import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { StatsCards } from "@/components/StatsCards";
import { StatsCharts } from "@/components/StatsCharts";
import {
  getStats,
} from "@/lib/api";

export default function Index() {
  const navigate = useNavigate();

  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });

  const handleStartSearching = useCallback(() => {
    navigate("/search");
  }, [navigate]);

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
            <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </header>

      <HeroSection onSearchFocus={handleStartSearching} />

      <main className="container mx-auto px-4 pb-20 space-y-10">
        {/* Stats */}
        <section>
          <StatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />
        </section>

        <StatsCharts stats={statsQuery.data} />

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          National Research Paper Search Engine
        </div>
      </footer>
    </div>
  );
}
