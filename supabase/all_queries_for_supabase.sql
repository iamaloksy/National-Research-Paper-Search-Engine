-- Run this file in Supabase SQL Editor in the same order.

-- =====================================================
-- 1) Initial papers schema + search/stats functions
-- Source: 20260228061207_36ccafdd-a359-4407-9820-b131f55f45d6.sql
-- =====================================================

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
  dedupe_hash TEXT GENERATED ALWAYS AS (
    md5(
      lower(trim(coalesce(title, ''))) || '|' ||
      lower(trim(coalesce(authors, ''))) || '|' ||
      coalesce(year::text, '') || '|' ||
      lower(trim(coalesce(source, ''))) || '|' ||
      lower(trim(coalesce(domain, ''))) || '|' ||
      lower(trim(coalesce(url, '')))
    )
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes
CREATE INDEX idx_papers_year ON public.papers (year);
CREATE INDEX idx_papers_source ON public.papers (source);
CREATE INDEX idx_papers_domain ON public.papers (domain);
CREATE UNIQUE INDEX idx_papers_dedupe_hash_unique ON public.papers (dedupe_hash);

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


-- =====================================================
-- 2) Roles/profiles schema + auth trigger
-- Source: 20260228062451_92b6d8f6-9bc4-411f-8e9e-a7afddd23ffa.sql
-- =====================================================

-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS: only admins can manage roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();


-- =====================================================
-- 3) Tighten papers write access to admins only
-- Source: 20260228062508_f64aac12-77ba-471d-b7ec-c2d84dd85719.sql
-- =====================================================

-- Drop overly permissive policies on papers
DROP POLICY IF EXISTS "Papers can be inserted via service role" ON public.papers;
DROP POLICY IF EXISTS "Papers can be updated via service role" ON public.papers;
DROP POLICY IF EXISTS "Papers can be deleted via service role" ON public.papers;

-- Only admins can insert papers
CREATE POLICY "Admins can insert papers"
ON public.papers FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update papers
CREATE POLICY "Admins can update papers"
ON public.papers FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete papers
CREATE POLICY "Admins can delete papers"
ON public.papers FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
