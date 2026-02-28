ALTER TABLE public.papers
ADD COLUMN IF NOT EXISTS dedupe_hash TEXT GENERATED ALWAYS AS (
  md5(
    lower(trim(coalesce(title, ''))) || '|' ||
    lower(trim(coalesce(authors, ''))) || '|' ||
    coalesce(year::text, '') || '|' ||
    lower(trim(coalesce(source, ''))) || '|' ||
    lower(trim(coalesce(domain, ''))) || '|' ||
    lower(trim(coalesce(url, '')))
  )
) STORED;

WITH ranked AS (
  SELECT
    id,
    row_number() OVER (PARTITION BY dedupe_hash ORDER BY id) AS rn
  FROM public.papers
)
DELETE FROM public.papers p
USING ranked r
WHERE p.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_papers_dedupe_hash_unique
ON public.papers (dedupe_hash);
