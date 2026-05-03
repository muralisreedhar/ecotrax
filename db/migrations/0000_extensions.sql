-- Required extensions for Ecotrax
-- (postgis, vector, pg_cron, pg_trgm, uuid-ossp)
-- Note: h3 / h3_postgis are NOT used; H3 cell indices are computed in
-- TypeScript via h3-js and stored as text columns.

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_trgm;     -- fuzzy text matching for species_id_map
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- uuid_generate_v4()
