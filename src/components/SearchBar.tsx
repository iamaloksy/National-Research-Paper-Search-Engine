import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchParams } from "@/lib/api";

interface SearchBarProps {
  params: SearchParams;
  onChange: (params: Partial<SearchParams>) => void;
  onSearch: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  sources: string[];
  domains: string[];
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ params, onChange, onSearch, showFilters, onToggleFilters, sources, domains }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") onSearch();
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              ref={ref}
              value={params.query}
              onChange={(e) => onChange({ query: e.target.value })}
              onKeyDown={handleKeyDown}
              placeholder="Search papers by keyword..."
              className="pl-12 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
            {params.query && (
              <button
                onClick={() => onChange({ query: "" })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Select value={params.field} onValueChange={(v) => onChange({ field: v as SearchParams["field"] })}>
            <SelectTrigger className="w-36 h-12 bg-card border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="authors">Authors</SelectItem>
              <SelectItem value="abstract">Abstract</SelectItem>
            </SelectContent>
          </Select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFilters}
            className={`h-12 w-12 rounded-lg border flex items-center justify-center transition-colors ${
              showFilters ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSearch}
            className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/25 transition-shadow"
          >
            Search
          </motion.button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
          >
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Year From</label>
              <Input
                type="number"
                value={params.year_from || ""}
                onChange={(e) => onChange({ year_from: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 2020"
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Year To</label>
              <Input
                type="number"
                value={params.year_to || ""}
                onChange={(e) => onChange({ year_to: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="e.g. 2024"
                className="bg-secondary border-border h-10"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Source</label>
              <Select value={params.source} onValueChange={(v) => onChange({ source: v })}>
                <SelectTrigger className="bg-secondary border-border h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Domain</label>
              <Select value={params.domain} onValueChange={(v) => onChange({ domain: v })}>
                <SelectTrigger className="bg-secondary border-border h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Domains</SelectItem>
                  {domains.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Sort By</label>
              <Select value={params.sort} onValueChange={(v) => onChange({ sort: v as SearchParams["sort"] })}>
                <SelectTrigger className="bg-secondary border-border h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="year_desc">Year (Newest)</SelectItem>
                  <SelectItem value="year_asc">Year (Oldest)</SelectItem>
                  <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
