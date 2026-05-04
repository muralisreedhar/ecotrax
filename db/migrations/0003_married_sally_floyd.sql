CREATE TABLE IF NOT EXISTS "admin_actions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"admin_id" uuid NOT NULL,
	"target_table" text NOT NULL,
	"target_id" text NOT NULL,
	"action" text NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_embeddings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"source_type" text NOT NULL,
	"source_id" integer NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ai_outputs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"capability" "ai_capability" NOT NULL,
	"project_id" integer,
	"user_id" uuid,
	"prompt_version_id" integer,
	"model_version" text,
	"temperature" real,
	"retrieval_bundle" jsonb,
	"raw_output" jsonb,
	"parsed_output" jsonb,
	"validation_passed" boolean,
	"validation_errors" jsonb,
	"validation_warnings" jsonb,
	"confidence_overall" real,
	"latency_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "field_observations" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"contributor_id" uuid NOT NULL,
	"species_id" integer,
	"location" geometry NOT NULL,
	"h3_cell" text,
	"observed_at" timestamp with time zone NOT NULL,
	"photo_url" text,
	"notes" text,
	"verification_tier" "verification_tier" DEFAULT 'auto' NOT NULL,
	"confidence_score" real,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funder_intent_profiles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"thematic_prefs" text[],
	"region_prefs" text[],
	"budget_range_min" double precision,
	"budget_range_max" double precision,
	"giving_history" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funder_shortlists" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"funder_id" uuid NOT NULL,
	"project_id" integer NOT NULL,
	"notes" text,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funding_commitments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"funder_id" uuid NOT NULL,
	"amount_usd" double precision NOT NULL,
	"status" "funding_commitment_status" DEFAULT 'pledged' NOT NULL,
	"fiscal_sponsor_ref" text,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "funding_disbursements" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"commitment_id" integer NOT NULL,
	"amount_usd" double precision NOT NULL,
	"disbursed_at" timestamp with time zone NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org_profiles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"org_name" text NOT NULL,
	"org_type" text,
	"country" text,
	"website" text,
	"description" text,
	"verification_status" "org_verification_status" DEFAULT 'unverified' NOT NULL,
	"verified_at" timestamp with time zone,
	"verified_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "outcome_reports" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"reporting_period" text,
	"population_change_pct" real,
	"habitat_change_ha" double precision,
	"threat_reduction_score" real,
	"narrative" text,
	"evidence_urls" text[],
	"verification_status" "outcome_report_status" DEFAULT 'submitted' NOT NULL,
	"verified_by" uuid,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_interventions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"intervention_type" text NOT NULL,
	"description" text,
	"budget_usd" double precision,
	"timeline_months" integer,
	"ordering" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "project_milestones" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"title" text NOT NULL,
	"due_date" timestamp with time zone,
	"status" "milestone_status" DEFAULT 'pending' NOT NULL,
	"evidence_url" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"practitioner_id" uuid NOT NULL,
	"species_id" integer,
	"location" geometry,
	"location_name" text,
	"country_code" text,
	"h3_cell" text,
	"status" "project_status" DEFAULT 'draft' NOT NULL,
	"duration_years" integer,
	"total_budget_usd" double precision,
	"ai_plan" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prompt_versions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"version" text NOT NULL,
	"template" text NOT NULL,
	"system_prompt" text,
	"model" text NOT NULL,
	"temperature" real DEFAULT 0.2 NOT NULL,
	"git_commit" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_alerts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"species_id" integer,
	"alert_type" text NOT NULL,
	"location" geometry NOT NULL,
	"h3_cell" text,
	"severity" text,
	"detected_at" timestamp with time zone NOT NULL,
	"draft_response_plan" jsonb,
	"notified_project_ids" integer[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_watchlists" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"watched_h3_cells" text[],
	"watched_species_ids" integer[],
	"notify_via" text DEFAULT 'email' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" "user_role" DEFAULT 'other' NOT NULL,
	"full_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "materialization_jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"job_type" text NOT NULL,
	"source" text,
	"scope" jsonb,
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"status" "materialization_status" DEFAULT 'queued' NOT NULL,
	"rows_processed" integer DEFAULT 0,
	"rows_failed" integer DEFAULT 0,
	"error_log" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "source_refresh_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"last_synced_at" timestamp with time zone,
	"next_due_at" timestamp with time zone,
	"records_added" integer DEFAULT 0,
	"records_updated" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_outputs" ADD CONSTRAINT "ai_outputs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_outputs" ADD CONSTRAINT "ai_outputs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ai_outputs" ADD CONSTRAINT "ai_outputs_prompt_version_id_prompt_versions_id_fk" FOREIGN KEY ("prompt_version_id") REFERENCES "public"."prompt_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_observations" ADD CONSTRAINT "field_observations_contributor_id_users_id_fk" FOREIGN KEY ("contributor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "field_observations" ADD CONSTRAINT "field_observations_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funder_intent_profiles" ADD CONSTRAINT "funder_intent_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funder_shortlists" ADD CONSTRAINT "funder_shortlists_funder_id_users_id_fk" FOREIGN KEY ("funder_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funder_shortlists" ADD CONSTRAINT "funder_shortlists_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funding_commitments" ADD CONSTRAINT "funding_commitments_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funding_commitments" ADD CONSTRAINT "funding_commitments_funder_id_users_id_fk" FOREIGN KEY ("funder_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "funding_disbursements" ADD CONSTRAINT "funding_disbursements_commitment_id_funding_commitments_id_fk" FOREIGN KEY ("commitment_id") REFERENCES "public"."funding_commitments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_profiles" ADD CONSTRAINT "org_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_profiles" ADD CONSTRAINT "org_profiles_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outcome_reports" ADD CONSTRAINT "outcome_reports_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "outcome_reports" ADD CONSTRAINT "outcome_reports_verified_by_users_id_fk" FOREIGN KEY ("verified_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_interventions" ADD CONSTRAINT "project_interventions_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_practitioner_id_users_id_fk" FOREIGN KEY ("practitioner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "prompt_versions" ADD CONSTRAINT "prompt_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_alerts" ADD CONSTRAINT "threat_alerts_species_id_species_profiles_id_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species_profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_watchlists" ADD CONSTRAINT "user_watchlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
