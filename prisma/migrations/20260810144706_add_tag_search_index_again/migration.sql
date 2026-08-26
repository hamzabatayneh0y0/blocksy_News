-- This is an empty migration.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX "Tag_name_trgm_idx"
ON "Tag"
USING GIN ("name" gin_trgm_ops);