CREATE TABLE IF NOT EXISTS "cost_priors" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"intervention_type" text NOT NULL,
	"country_code" text NOT NULL,
	"sub_region" text,
	"cost_per_unit_median" double precision NOT NULL,
	"cost_per_unit_p25" double precision,
	"cost_per_unit_p75" double precision,
	"unit_definition" text NOT NULL,
	"sample_size" integer,
	"evidence_strength" real,
	"cost_drivers" jsonb,
	"last_computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "data_confidence_scores" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"species_id" integer NOT NULL,
	"h3_cell" text NOT NULL,
	"occurrence_density" real,
	"recency_score" real,
	"source_diversity" real,
	"iucn_freshness" real,
	"spatial_precision" real,
	"composite_score" real NOT NULL,
	"band" "confidence_band" NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "intervention_outcomes" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"contributor_id" text,
	"species_id" integer,
	"location" geometry,
	"h3_cell" text,
	"country_code" text,
	"intervention_type" text NOT NULL,
	"intervention_subtype" text,
	"duration_months" integer,
	"total_cost_usd" double precision,
	"cost_breakdown" jsonb,
	"outcome_metrics" jsonb,
	"success_rating" integer,
	"narrative" text,
	"evidence" jsonb,
	"verification_tier" "verification_tier" DEFAULT 'auto' NOT NULL,
	"verified_by" text,
	"disclosed_funders" text[],
	"conflicts_of_interest" text,
	"disputed" boolean DEFAULT false NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "regulatory_pathways" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"country_code" text NOT NULL,
	"intervention_type" text NOT NULL,
	"permit_name" text NOT NULL,
	"issuing_agency" text,
	"typical_timeline_days" integer,
	"typical_cost_usd" double precision,
	"notes" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "species_location_assessments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"species_id" integer NOT NULL,
	"h3_cell" text NOT NULL,
	"deforestation_rate_5yr_pct" real,
	"deforestation_alert_count_12mo" integer,
	"hfi_score" real,
	"hfi_delta_10yr" real,
	"protected_area_coverage_pct" real,
	"protected_area_iucn_categories" jsonb,
	"climate_exposure_ssp245_2050" real,
	"climate_niche_loss_pct" real,
	"mining_concession_overlap_pct" real,
	"road_density_delta" real,
	"ilc_overlap_pct" real,
	"neighboring_active_projects" integer,
	"local_practitioner_capacity_score" real,
	"intervention_evidence_strength" jsonb,
	"presence_type" "presence_type" NOT NULL,
	"surrogate_evidence" jsonb,
	"confidence_score" real,
	"confidence_band" "confidence_band",
	"data_gaps" text[],
	"last_computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "species_profiles" (
	"id" integer PRIMARY KEY NOT NULL,
	"scientific_name" text NOT NULL,
	"common_names" jsonb,
	"taxonomic_class" text,
	"iucn_status" text,
	"status_assessment_date" timestamp with time zone,
	"population_trend" text,
	"integrated_threats" jsonb,
	"key_geographies" jsonb,
	"provenance" jsonb,
	"confidence_score" real,
	"last_computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stakeholder_capacity" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"org_id" text,
	"country_code" text NOT NULL,
	"region" text,
	"intervention_specialties" text[],
	"historical_outcome_score" real,
	"project_count" integer DEFAULT 0,
	"total_funding_managed_usd" double precision DEFAULT 0,
	"ilc_affiliated" boolean DEFAULT false,
	"partner_vouched" boolean DEFAULT false,
	"capacity_score" real,
	"last_computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_intervention_evidence" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"threat_type" text NOT NULL,
	"intervention_type" text NOT NULL,
	"effectiveness_score" real,
	"sample_size" integer,
	"context_modifiers" jsonb,
	"literature_refs" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "data_confidence_scores" ADD CONSTRAINT "data_confidence_scores_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "intervention_outcomes" ADD CONSTRAINT "intervention_outcomes_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "species_location_assessments" ADD CONSTRAINT "species_location_assessments_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
