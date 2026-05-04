-- ============================================================================
-- Helper: check if current user is admin
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================================
-- Enable RLS on every table
-- ============================================================================
ALTER TABLE public.users                          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_profiles                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_interventions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_milestones             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_commitments            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funding_disbursements          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outcome_reports                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_observations             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_alerts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_outputs                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_embeddings                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_versions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funder_intent_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funder_shortlists              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materialization_jobs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_refresh_log             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_profiles               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_location_assessments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intervention_outcomes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_priors                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intervention_evidence   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_capacity           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_pathways            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_confidence_scores         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.species_id_map                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_gbif_occurrences           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_iucn_assessments           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_iucn_ranges                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_wdpa_areas                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_gfw_alerts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_landmark_ilc_lands         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_worldclim_layers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.src_human_footprint            ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS
-- ============================================================================
CREATE POLICY users_self_read ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================================
-- ORG PROFILES
-- ============================================================================
CREATE POLICY org_profiles_public_verified_read ON public.org_profiles
  FOR SELECT USING (verification_status = 'verified' OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY org_profiles_self_write ON public.org_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY org_profiles_self_update ON public.org_profiles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PROJECTS
-- ============================================================================
CREATE POLICY projects_public_listed ON public.projects
  FOR SELECT USING (
    status IN ('listed','funded','closed')
    OR practitioner_id = auth.uid()
    OR public.is_admin()
  );
CREATE POLICY projects_owner_insert ON public.projects
  FOR INSERT WITH CHECK (practitioner_id = auth.uid());
CREATE POLICY projects_owner_update ON public.projects
  FOR UPDATE USING (practitioner_id = auth.uid()) WITH CHECK (practitioner_id = auth.uid());

-- ============================================================================
-- PROJECT INTERVENTIONS / MILESTONES — follow parent project
-- ============================================================================
CREATE POLICY pi_read ON public.project_interventions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
            AND (p.status IN ('listed','funded','closed')
                 OR p.practitioner_id = auth.uid()
                 OR public.is_admin()))
  );
CREATE POLICY pi_write ON public.project_interventions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

CREATE POLICY pm_read ON public.project_milestones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id
            AND (p.status IN ('listed','funded','closed')
                 OR p.practitioner_id = auth.uid()
                 OR public.is_admin()))
  );
CREATE POLICY pm_write ON public.project_milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

-- ============================================================================
-- FUNDING COMMITMENTS / DISBURSEMENTS
-- ============================================================================
CREATE POLICY fc_read ON public.funding_commitments
  FOR SELECT USING (
    funder_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY fc_funder_insert ON public.funding_commitments
  FOR INSERT WITH CHECK (funder_id = auth.uid());

CREATE POLICY fd_read ON public.funding_disbursements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.funding_commitments fc
      WHERE fc.id = commitment_id
      AND (
        fc.funder_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = fc.project_id AND p.practitioner_id = auth.uid())
        OR public.is_admin()
      )
    )
  );

-- ============================================================================
-- OUTCOME REPORTS
-- ============================================================================
CREATE POLICY outcome_reports_read ON public.outcome_reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.status = 'funded')
    OR EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY outcome_reports_write ON public.outcome_reports
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid())
  );

-- ============================================================================
-- FIELD OBSERVATIONS
-- ============================================================================
CREATE POLICY field_obs_read ON public.field_observations
  FOR SELECT USING (true);
CREATE POLICY field_obs_write ON public.field_observations
  FOR INSERT WITH CHECK (contributor_id = auth.uid());
CREATE POLICY field_obs_update ON public.field_observations
  FOR UPDATE USING (contributor_id = auth.uid()) WITH CHECK (contributor_id = auth.uid());

-- ============================================================================
-- AI OUTPUTS
-- ============================================================================
CREATE POLICY ai_outputs_read ON public.ai_outputs
  FOR SELECT USING (
    user_id = auth.uid()
    OR (project_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.practitioner_id = auth.uid()
    ))
    OR public.is_admin()
  );

-- ============================================================================
-- LAYER 2 (public read; service_role writes)
-- ============================================================================
CREATE POLICY species_profiles_read ON public.species_profiles FOR SELECT USING (true);
CREATE POLICY sla_read ON public.species_location_assessments FOR SELECT USING (true);
CREATE POLICY io_read ON public.intervention_outcomes
  FOR SELECT USING (verification_tier IN ('peer','expert') OR contributor_id::uuid = auth.uid() OR public.is_admin());
CREATE POLICY io_self_write ON public.intervention_outcomes
  FOR INSERT WITH CHECK (contributor_id::uuid = auth.uid());
CREATE POLICY cp_read ON public.cost_priors FOR SELECT USING (true);
CREATE POLICY tie_read ON public.threat_intervention_evidence FOR SELECT USING (true);
CREATE POLICY sc_read ON public.stakeholder_capacity FOR SELECT USING (true);
CREATE POLICY rp_read ON public.regulatory_pathways FOR SELECT USING (true);
CREATE POLICY dcs_read ON public.data_confidence_scores FOR SELECT USING (true);
CREATE POLICY sim_read ON public.species_id_map FOR SELECT USING (true);

-- ============================================================================
-- THREAT ALERTS / AI EMBEDDINGS — public read
-- ============================================================================
CREATE POLICY threat_alerts_read ON public.threat_alerts FOR SELECT USING (true);
CREATE POLICY ai_embeddings_read ON public.ai_embeddings FOR SELECT USING (true);

-- ============================================================================
-- LAYER 1 (service_role only — RLS enabled, no policies = no anon access)
-- ============================================================================
-- (no policies)

-- ============================================================================
-- USER-SPECIFIC TABLES
-- ============================================================================
CREATE POLICY fip_self ON public.funder_intent_profiles
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY fs_self ON public.funder_shortlists
  FOR ALL USING (funder_id = auth.uid()) WITH CHECK (funder_id = auth.uid());
CREATE POLICY uw_self ON public.user_watchlists
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY n_self ON public.notifications
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- ADMIN-ONLY
-- ============================================================================
CREATE POLICY admin_actions_admin_only ON public.admin_actions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY pv_admin_only ON public.prompt_versions
  FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY mj_admin_only ON public.materialization_jobs
  FOR SELECT USING (public.is_admin());
CREATE POLICY srl_admin_only ON public.source_refresh_log
  FOR SELECT USING (public.is_admin());
