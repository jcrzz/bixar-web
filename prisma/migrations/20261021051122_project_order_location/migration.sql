-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "location" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- Backfill: keep the current public order (oldest first) by numbering rows
-- over createdAt asc. Without this, every existing project would share
-- order = 0 and the tiebreak would be the only visible ordering.
WITH ranked AS (
    SELECT "id", row_number() OVER (ORDER BY "createdAt" ASC) - 1 AS "new_order"
    FROM "Project"
)
UPDATE "Project"
SET "order" = ranked."new_order"
FROM ranked
WHERE "Project"."id" = ranked."id";
