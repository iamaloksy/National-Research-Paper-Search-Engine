import { supabase } from "@/integrations/supabase/client";

export interface Paper {
  id: number;
  title: string;
  authors: string;
  abstract: string;
  year: number;
  source: string;
  domain: string;
  url: string;
  score?: number;
}

export interface SearchParams {
  query: string;
  field: "all" | "title" | "authors" | "abstract";
  year_from?: number;
  year_to?: number;
  source: string;
  domain: string;
  sort: "relevance" | "year_desc" | "year_asc" | "title_asc";
  page: number;
  per_page: number;
}

export interface SearchResult {
  success: boolean;
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  results: Paper[];
}

export interface Stats {
  success: boolean;
  total_papers: number;
  by_source: { source: string; count: number }[];
  by_domain: { domain: string; count: number }[];
  year_range: { min: number; max: number };
}

export async function searchPapers(params: SearchParams): Promise<SearchResult> {
  const { data, error } = await supabase.rpc("search_papers", {
    search_query: params.query,
    search_field: params.field,
    filter_year_from: params.year_from || null,
    filter_year_to: params.year_to || null,
    filter_source: params.source,
    filter_domain: params.domain,
    sort_by: params.sort,
    page_num: params.page,
    items_per_page: params.per_page,
  });

  if (error) throw error;
  return data as unknown as SearchResult;
}

export async function getStats(): Promise<Stats> {
  const { data, error } = await supabase.rpc("get_paper_stats");
  if (error) throw error;
  return data as unknown as Stats;
}

export async function getDistinctSources(): Promise<string[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("source")
    .order("source");
  if (error) throw error;
  const unique = [...new Set((data || []).map((d: { source: string }) => d.source))];
  return unique;
}

export async function getDistinctDomains(): Promise<string[]> {
  const { data, error } = await supabase
    .from("papers")
    .select("domain")
    .order("domain");
  if (error) throw error;
  const unique = [...new Set((data || []).map((d: { domain: string }) => d.domain))];
  return unique;
}
