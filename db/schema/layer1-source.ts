import {
  pgTable, bigserial, integer, text, jsonb, timestamp, real,
  boolean, doublePrecision, customType,
} from 'drizzle-orm/pg-core'
import { matchMethodEnum } from './enums'

// PostGIS geometry — text in TS (WKT/EWKT), validated server-side at ingest.
export const geometry = customType<{ data: string; driverData: string }>({
  dataType: () => 'geometry',
})

export const speciesIdMap = pgTable('species_id_map', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  canonicalSpeciesId: integer('canonical_species_id').notNull(),
  sourceSystem: text('source_system').notNull(),
  sourceId: text('source_id').notNull(),
  matchMethod: matchMethodEnum('match_method').notNull(),
  matchConfidence: real('match_confidence').notNull(),
  manualOverride: boolean('manual_override').notNull().default(false),
  reconciledAt: timestamp('reconciled_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcGbifOccurrences = pgTable('src_gbif_occurrences', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  gbifKey: integer('gbif_key').notNull(),
  occurrenceId: text('occurrence_id').notNull().unique(),
  location: geometry('location').notNull(),
  h3R5: text('h3_r5'),
  h3R6: text('h3_r6'),
  h3R7: text('h3_r7'),
  observedAt: timestamp('observed_at', { withTimezone: true }),
  source: text('source'),
  coordinateUncertaintyM: doublePrecision('coordinate_uncertainty_m'),
  taxonVerified: boolean('taxon_verified').default(false),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcIucnAssessments = pgTable('src_iucn_assessments', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  iucnId: integer('iucn_id').notNull().unique(),
  scientificName: text('scientific_name').notNull(),
  iucnStatus: text('iucn_status'),
  populationTrend: text('population_trend'),
  assessmentDate: timestamp('assessment_date', { withTimezone: true }),
  threatsRaw: jsonb('threats_raw'),
  narrativesRaw: jsonb('narratives_raw'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcIucnRanges = pgTable('src_iucn_ranges', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  iucnId: integer('iucn_id').notNull(),
  rangePolygon: geometry('range_polygon').notNull(),
  presenceCode: integer('presence_code'),
  originCode: integer('origin_code'),
  seasonalCode: integer('seasonal_code'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcWdpaAreas = pgTable('src_wdpa_areas', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  wdpaId: integer('wdpa_id').notNull().unique(),
  name: text('name'),
  boundary: geometry('boundary').notNull(),
  iucnCategory: text('iucn_category'),
  countryCode: text('country_code'),
  designation: text('designation'),
  status: text('status'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcGfwAlerts = pgTable('src_gfw_alerts', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  alertType: text('alert_type').notNull(),
  location: geometry('location').notNull(),
  h3R6: text('h3_r6'),
  detectedAt: timestamp('detected_at', { withTimezone: true }).notNull(),
  areaHa: real('area_ha'),
  confidenceLevel: text('confidence_level'),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcLandmarkIlcLands = pgTable('src_landmark_ilc_lands', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  externalId: text('external_id'),
  countryCode: text('country_code'),
  recognitionStatus: text('recognition_status'),
  boundary: geometry('boundary').notNull(),
  rawPayload: jsonb('raw_payload'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcWorldclimLayers = pgTable('src_worldclim_layers', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  variable: text('variable').notNull(),
  resolutionArcsec: integer('resolution_arcsec').notNull(),
  storagePath: text('storage_path').notNull(),
  versionTag: text('version_tag'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})

export const srcHumanFootprint = pgTable('src_human_footprint', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  referenceYear: integer('reference_year').notNull(),
  hfiRegion: geometry('hfi_region').notNull(),
  hfiScore: real('hfi_score'),
  ingestedAt: timestamp('ingested_at', { withTimezone: true }).notNull().defaultNow(),
})
