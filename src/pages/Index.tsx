import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, FileText } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { StatsCards } from "@/components/StatsCards";
import { StatsCharts } from "@/components/StatsCharts";
import { SearchBar } from "@/components/SearchBar";
import { PaperCard } from "@/components/PaperCard";
import { Pagination } from "@/components/Pagination";
import {
  searchPapers,
  getStats,
  getDistinctSources,
  getDistinctDomains,
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

export default function Index() {
  const [params, setParams] = useState<SearchParams>(defaultParams);
  const [activeParams, setActiveParams] = useState<SearchParams>(defaultParams);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const sourcesQuery = useQuery({ queryKey: ["sources"], queryFn: getDistinctSources });
  const domainsQuery = useQuery({ queryKey: ["domains"], queryFn: getDistinctDomains });

  const searchQuery = useQuery({
    queryKey: ["search", activeParams],
    queryFn: () => searchPapers(activeParams),
    enabled: hasSearched,
  });

  const handleSearch = useCallback(() => {
    const newParams = { ...params, page: 1 };
    setActiveParams(newParams);
    setParams(newParams);
    setHasSearched(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [params]);

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = { ...activeParams, page };
      setActiveParams(newParams);
      setParams(newParams);
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [activeParams]
  );

  const handleFocusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
            <span className="text-xs text-muted-foreground">
              {statsQuery.data?.total_papers ?? "—"} papers indexed
            </span>
            <a href="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Admin
            </a>
          </div>
        </div>
      </header>

      <HeroSection onSearchFocus={handleFocusSearch} />

      <main className="container mx-auto px-4 pb-20 space-y-10">
        {/* Stats */}
        <section>
          <StatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />
        </section>

        <StatsCharts stats={statsQuery.data} />

        {/* Search */}
        <section id="search" className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">Search Papers</h2>
          <SearchBar
            ref={searchRef}
            params={params}
            onChange={(p) => setParams((prev) => ({ ...prev, ...p }))}
            onSearch={handleSearch}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            sources={sourcesQuery.data ?? []}
            domains={domainsQuery.data ?? []}
          />
        </section>

        {/* Results */}
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

          {!hasSearched && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-16 text-center"
            >
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-float" />
              <p className="text-lg text-muted-foreground">
                Enter a keyword above to search research papers.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          National Research Paper Search Engine — Powered by Lovable Cloud
        </div>
      </footer>
    </div>
  );
}
