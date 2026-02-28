import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, FileText } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { PaperCard } from "@/components/PaperCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  searchPapers,
  getStats,
  SearchParams,
} from "@/lib/api";

const defaultParams: SearchParams = {
  query: "",
  field: "all",
  source: "all",
  domain: "all",
  sort: "relevance",
  page: 1,
  per_page: 10,
};

function toParams(searchParams: URLSearchParams): SearchParams {
  const yearFromRaw = searchParams.get("year_from");
  const yearToRaw = searchParams.get("year_to");
  const pageRaw = Number(searchParams.get("page") || "1");
  const perPageRaw = Number(searchParams.get("per_page") || "10");

  return {
    query: searchParams.get("query") ?? "",
    field: (searchParams.get("field") as SearchParams["field"]) || "all",
    source: searchParams.get("source") ?? "all",
    domain: searchParams.get("domain") ?? "all",
    sort: (searchParams.get("sort") as SearchParams["sort"]) || "relevance",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    per_page: Number.isFinite(perPageRaw) && perPageRaw > 0 ? perPageRaw : 10,
    year_from: yearFromRaw ? Number(yearFromRaw) : undefined,
    year_to: yearToRaw ? Number(yearToRaw) : undefined,
  };
}

function toQuery(params: SearchParams): URLSearchParams {
  return new URLSearchParams({
    query: params.query,
    field: params.field,
    source: params.source,
    domain: params.domain,
    sort: params.sort,
    page: String(params.page),
    per_page: String(params.per_page),
    ...(params.year_from ? { year_from: String(params.year_from) } : {}),
    ...(params.year_to ? { year_to: String(params.year_to) } : {}),
  });
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialParams = useMemo(() => toParams(searchParams), [searchParams]);
  const [params, setParams] = useState<SearchParams>(initialParams);
  const [activeParams, setActiveParams] = useState<SearchParams>(initialParams);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = toParams(searchParams);
    setParams(parsed);
    setActiveParams(parsed);
  }, [searchParams]);

  const minCategoryCount = 10;
  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const sourceOptions = (statsQuery.data?.by_source ?? [])
    .filter((item) => item.count > minCategoryCount)
    .map((item) => item.source);
  const domainOptions = (statsQuery.data?.by_domain ?? [])
    .filter((item) => item.count > minCategoryCount)
    .map((item) => item.domain);

  const searchQuery = useQuery({
    queryKey: ["search", activeParams],
    queryFn: () => searchPapers(activeParams),
    enabled: true,
  });

  const handleSearch = useCallback(() => {
    const newParams = { ...params, page: 1 };
    setParams(newParams);
    setActiveParams(newParams);
    setSearchParams(toQuery(newParams));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [params, setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = { ...activeParams, page };
      setParams(newParams);
      setActiveParams(newParams);
      setSearchParams(toQuery(newParams));
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [activeParams, setSearchParams]
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-lg hidden sm:block">
              NRPSE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Back</Link>
            </Button>
            <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 space-y-6">
        <section id="search" className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Search Results</h2>
          <SearchBar
            ref={searchRef}
            params={params}
            onChange={(partial) => setParams((prev) => ({ ...prev, ...partial }))}
            onSearch={handleSearch}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            sources={sourceOptions}
            domains={domainOptions}
          />
        </section>

        <section ref={resultsRef} className="space-y-4">
          {searchQuery.isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {searchQuery.data && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {searchQuery.data.total} result{searchQuery.data.total !== 1 ? "s" : ""} found
                </p>
                <p className="text-sm text-muted-foreground">
                  Page {searchQuery.data.page} of {searchQuery.data.total_pages}
                </p>
              </div>

              {searchQuery.data.results.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-16 text-center"
                >
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">No papers found matching your criteria.</p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {searchQuery.data.results.map((paper, i) => (
                    <PaperCard key={paper.id} paper={paper} index={i} />
                  ))}
                </div>
              )}

              <Pagination
                page={searchQuery.data.page}
                totalPages={searchQuery.data.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
