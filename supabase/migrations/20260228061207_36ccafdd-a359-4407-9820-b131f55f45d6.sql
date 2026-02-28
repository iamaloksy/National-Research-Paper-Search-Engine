
-- Create papers table
CREATE TABLE public.papers (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Untitled',
  authors TEXT DEFAULT 'Unknown Authors',
  abstract TEXT DEFAULT 'No abstract available',
  year INTEGER,
  source TEXT DEFAULT 'Unknown Source',
  domain TEXT DEFAULT 'General',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_papers_year ON public.papers (year);
CREATE INDEX idx_papers_source ON public.papers (source);
CREATE INDEX idx_papers_domain ON public.papers (domain);

-- Full-text search index
ALTER TABLE public.papers ADD COLUMN fts tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(authors, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(abstract, '')), 'C')
  ) STORED;

CREATE INDEX idx_papers_fts ON public.papers USING GIN (fts);

-- Enable RLS (public read access for search engine)
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Papers are publicly readable"
  ON public.papers FOR SELECT
  USING (true);

CREATE POLICY "Papers can be inserted via service role"
  ON public.papers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Papers can be updated via service role"
  ON public.papers FOR UPDATE
  USING (true);

CREATE POLICY "Papers can be deleted via service role"
  ON public.papers FOR DELETE
  USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_papers_updated_at
  BEFORE UPDATE ON public.papers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Search function with relevance scoring
CREATE OR REPLACE FUNCTION public.search_papers(
  search_query TEXT DEFAULT '',
  search_field TEXT DEFAULT 'all',
  filter_year_from INTEGER DEFAULT NULL,
  filter_year_to INTEGER DEFAULT NULL,
  filter_source TEXT DEFAULT 'all',
  filter_domain TEXT DEFAULT 'all',
  sort_by TEXT DEFAULT 'relevance',
  page_num INTEGER DEFAULT 1,
  items_per_page INTEGER DEFAULT 10
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  total_count INTEGER;
  offset_val INTEGER;
  safe_per_page INTEGER;
BEGIN
  safe_per_page := LEAST(GREATEST(items_per_page, 1), 100);
  offset_val := (GREATEST(page_num, 1) - 1) * safe_per_page;

  -- Count total
  SELECT COUNT(*) INTO total_count
  FROM public.papers p
  WHERE
    (search_query = '' OR search_query IS NULL OR
      CASE search_field
        WHEN 'title' THEN p.title ILIKE '%' || search_query || '%'
        WHEN 'authors' THEN p.authors ILIKE '%' || search_query || '%'
        WHEN 'abstract' THEN p.abstract ILIKE '%' || search_query || '%'
        ELSE p.fts @@ plainto_tsquery('english', search_query)
      END
    )
    AND (filter_year_from IS NULL OR p.year >= filter_year_from)
    AND (filter_year_to IS NULL OR p.year <= filter_year_to)
    AND (filter_source = 'all' OR filter_source IS NULL OR p.source = filter_source)
    AND (filter_domain = 'all' OR filter_domain IS NULL OR p.domain = filter_domain);

  -- Get results
  SELECT json_build_object(
    'success', true,
    'total', total_count,
    'page', GREATEST(page_num, 1),
    'per_page', safe_per_page,
    'total_pages', CEIL(total_count::FLOAT / safe_per_page),
    'results', COALESCE((
      SELECT json_agg(row_to_json(t))
      FROM (
        SELECT 
          p.id, p.title, p.authors, p.abstract, p.year, p.source, p.domain, p.url,
          CASE 
            WHEN search_query = '' OR search_query IS NULL THEN 0
            WHEN search_field = 'all' THEN ts_rank(p.fts, plainto_tsquery('english', search_query))::FLOAT
            ELSE 
              CASE 
                WHEN p.title ILIKE '%' || search_query || '%' THEN 1.0
                WHEN p.authors ILIKE '%' || search_query || '%' THEN 0.7
                WHEN p.abstract ILIKE '%' || search_query || '%' THEN 0.4
                ELSE 0
              END
          END AS score
        FROM public.papers p
        WHERE
          (search_query = '' OR search_query IS NULL OR
            CASE search_field
              WHEN 'title' THEN p.title ILIKE '%' || search_query || '%'
              WHEN 'authors' THEN p.authors ILIKE '%' || search_query || '%'
              WHEN 'abstract' THEN p.abstract ILIKE '%' || search_query || '%'
              ELSE p.fts @@ plainto_tsquery('english', search_query)
            END
          )
          AND (filter_year_from IS NULL OR p.year >= filter_year_from)
          AND (filter_year_to IS NULL OR p.year <= filter_year_to)
          AND (filter_source = 'all' OR filter_source IS NULL OR p.source = filter_source)
          AND (filter_domain = 'all' OR filter_domain IS NULL OR p.domain = filter_domain)
        ORDER BY
          CASE sort_by
            WHEN 'year_desc' THEN -COALESCE(p.year, 0)
            WHEN 'year_asc' THEN COALESCE(p.year, 9999)
            WHEN 'title_asc' THEN 0
            ELSE -ts_rank(p.fts, plainto_tsquery('english', COALESCE(NULLIF(search_query, ''), 'a')))::FLOAT
          END,
          CASE WHEN sort_by = 'title_asc' THEN p.title ELSE NULL END ASC NULLS LAST,
          p.id
        LIMIT safe_per_page OFFSET offset_val
      ) t
    ), '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Stats function
CREATE OR REPLACE FUNCTION public.get_paper_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'success', true,
    'total_papers', (SELECT COUNT(*) FROM public.papers),
    'by_source', COALESCE((SELECT json_agg(json_build_object('source', source, 'count', cnt)) FROM (SELECT source, COUNT(*) as cnt FROM public.papers GROUP BY source ORDER BY cnt DESC) s), '[]'::json),
    'by_domain', COALESCE((SELECT json_agg(json_build_object('domain', domain, 'count', cnt)) FROM (SELECT domain, COUNT(*) as cnt FROM public.papers GROUP BY domain ORDER BY cnt DESC) s), '[]'::json),
    'year_range', json_build_object('min', (SELECT MIN(year) FROM public.papers), 'max', (SELECT MAX(year) FROM public.papers))
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
