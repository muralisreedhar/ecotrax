CREATE TYPE "public"."ai_capability" AS ENUM('plan', 'qa', 'match');--> statement-breakpoint
CREATE TYPE "public"."confidence_band" AS ENUM('low', 'moderate', 'high', 'very_high');--> statement-breakpoint
CREATE TYPE "public"."funding_commitment_status" AS ENUM('pledged', 'confirmed', 'disbursed');--> statement-breakpoint
CREATE TYPE "public"."match_method" AS ENUM('exact', 'synonym', 'fuzzy', 'manual');--> statement-breakpoint
CREATE TYPE "public"."materialization_status" AS ENUM('queued', 'running', 'success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."milestone_status" AS ENUM('pending', 'completed');--> statement-breakpoint
CREATE TYPE "public"."org_verification_status" AS ENUM('unverified', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."outcome_report_status" AS ENUM('submitted', 'verified', 'disputed');--> statement-breakpoint
CREATE TYPE "public"."presence_type" AS ENUM('observed', 'inferred_high', 'inferred_med', 'inferred_low');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('draft', 'submitted', 'listed', 'funded', 'closed');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('funder', 'practitioner', 'other', 'admin');--> statement-breakpoint
CREATE TYPE "public"."verification_tier" AS ENUM('auto', 'peer', 'expert');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "species_id_map" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"canonical_species_id" integer NOT NULL,
	"source_system" text NOT NULL,
	"source_id" text NOT NULL,
	"match_method" "match_method" NOT NULL,
	"match_confidence" real NOT NULL,
	"manual_override" boolean DEFAULT false NOT NULL,
	"reconciled_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_gbif_occurrences" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"gbif_key" integer NOT NULL,
	"occurrence_id" text NOT NULL,
	"location" geometry NOT NULL,
	"h3_r5" text,
	"h3_r6" text,
	"h3_r7" text,
	"observed_at" timestamp with time zone,
	"source" text,
	"coordinate_uncertainty_m" double precision,
	"taxon_verified" boolean DEFAULT false,
	"raw_payload" jsonb,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "src_gbif_occurrences_occurrence_id_unique" UNIQUE("occurrence_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_gfw_alerts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"alert_type" text NOT NULL,
	"location" geometry NOT NULL,
	"h3_r6" text,
	"detected_at" timestamp with time zone NOT NULL,
	"area_ha" real,
	"confidence_level" text,
	"raw_payload" jsonb,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_human_footprint" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"reference_year" integer NOT NULL,
	"hfi_region" geometry NOT NULL,
	"hfi_score" real,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_iucn_assessments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"iucn_id" integer NOT NULL,
	"scientific_name" text NOT NULL,
	"iucn_status" text,
	"population_trend" text,
	"assessment_date" timestamp with time zone,
	"threats_raw" jsonb,
	"narratives_raw" jsonb,
	"raw_payload" jsonb,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "src_iucn_assessments_iucn_id_unique" UNIQUE("iucn_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_iucn_ranges" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"iucn_id" integer NOT NULL,
	"range_polygon" geometry NOT NULL,
	"presence_code" integer,
	"origin_code" integer,
	"seasonal_code" integer,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_landmark_ilc_lands" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"external_id" text,
	"country_code" text,
	"recognition_status" text,
	"boundary" geometry NOT NULL,
	"raw_payload" jsonb,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_wdpa_areas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"wdpa_id" integer NOT NULL,
	"name" text,
	"boundary" geometry NOT NULL,
	"iucn_category" text,
	"country_code" text,
	"designation" text,
	"status" text,
	"raw_payload" jsonb,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "src_wdpa_areas_wdpa_id_unique" UNIQUE("wdpa_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "src_worldclim_layers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"variable" text NOT NULL,
	"resolution_arcsec" integer NOT NULL,
	"storage_path" text NOT NULL,
	"version_tag" text,
	"ingested_at" timestamp with time zone DEFAULT now() NOT NULL
);
