import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  FileText, Upload, Trash2, LogOut, Search, ChevronLeft, ChevronRight,
  Database, BarChart3, Globe, Calendar, Loader2, ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Paper {
  id: number;
  title: string;
  authors: string | null;
  year: number | null;
  source: string | null;
  domain: string | null;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [totalPapers, setTotalPapers] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const perPage = 20;

  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });

  // Check admin
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }
      const res = await supabase.functions.invoke("check-admin", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.data?.is_admin) { navigate("/admin/login"); return; }
      setIsAdmin(true);
    })();
  }, [navigate]);

  // Fetch papers
  const fetchPapers = useCallback(async () => {
    let query = supabase
      .from("papers")
      .select("id, title, authors, year, source, domain", { count: "exact" })
      .order("id", { ascending: false })
      .range((page - 1) * perPage, page * perPage - 1);

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    const { data, count, error } = await query;
    if (error) {
      toast({ title: "Error loading papers", description: error.message, variant: "destructive" });
      return;
    }
    setPapers((data as Paper[]) || []);
    setTotalPapers(count || 0);
  }, [page, searchTerm, toast]);

  useEffect(() => {
    if (isAdmin) fetchPapers();
  }, [isAdmin, fetchPapers]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".csv")) {
      toast({ title: "Only CSV files allowed", variant: "destructive" });
      return;
    }

    setUploading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await supabase.functions.invoke("import-csv", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formData,
    });

    if (res.data?.success) {
      toast({ title: "Import successful", description: `${res.data.inserted} papers imported.` });
      fetchPapers();
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      toast({ title: "Import failed", description: res.data?.error || "Unknown error", variant: "destructive" });
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await supabase.functions.invoke("delete-papers", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { ids: Array.from(selectedIds) },
    });

    if (res.data?.success) {
      toast({ title: "Deleted", description: `${selectedIds.size} paper(s) removed.` });
      setSelectedIds(new Set());
      fetchPapers();
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      toast({ title: "Delete failed", description: res.data?.error, variant: "destructive" });
    }
    setDeleting(false);
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await supabase.functions.invoke("delete-papers", {
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { delete_all: true },
    });

    if (res.data?.success) {
      toast({ title: "All papers deleted" });
      fetchPapers();
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    } else {
      toast({ title: "Error", description: res.data?.error, variant: "destructive" });
    }
    setDeleting(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === papers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(papers.map((p) => p.id)));
    }
  };

  const totalPages = Math.ceil(totalPapers / perPage);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Search
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Database, label: "Total Papers", value: statsQuery.data?.total_papers ?? 0 },
            { icon: Globe, label: "Sources", value: statsQuery.data?.by_source?.length ?? 0 },
            { icon: BarChart3, label: "Domains", value: statsQuery.data?.by_domain?.length ?? 0 },
            { icon: Calendar, label: "Year Range", value: statsQuery.data?.year_range ? `${statsQuery.data.year_range.min}–${statsQuery.data.year_range.max}` : "—" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card border-glass-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="text-lg font-display">Manage Papers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {/* CSV Upload */}
              <label className="cursor-pointer">
                <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
                <Button asChild variant="default" disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? "Importing..." : "Upload CSV"}
                  </span>
                </Button>
              </label>

              {/* Delete Selected */}
              {selectedIds.size > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete {selectedIds.size} Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {selectedIds.size} paper(s)?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              {/* Delete All */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" disabled={deleting || totalPapers === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete ALL papers?</AlertDialogTitle>
                    <AlertDialogDescription>This will remove every paper from the database. This cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll} className="bg-destructive text-destructive-foreground">Delete All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search papers by title..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                className="pl-10 bg-secondary/50 border-glass-border"
              />
            </div>

            {/* Table */}
            <div className="rounded-xl border border-glass-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-glass-border hover:bg-transparent">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={papers.length > 0 && selectedIds.size === papers.length}
                        onChange={toggleAll}
                        className="rounded border-glass-border"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Authors</TableHead>
                    <TableHead className="hidden sm:table-cell">Year</TableHead>
                    <TableHead className="hidden lg:table-cell">Source</TableHead>
                    <TableHead className="hidden lg:table-cell">Domain</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {papers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No papers found. Upload a CSV to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    papers.map((paper) => (
                      <TableRow key={paper.id} className="border-glass-border">
                        <TableCell>
                          <input
                            type="checkbox"
                            checked={selectedIds.has(paper.id)}
                            onChange={() => toggleSelect(paper.id)}
                            className="rounded border-glass-border"
                          />
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{paper.title}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground max-w-xs truncate">
                          {paper.authors || "—"}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {paper.year || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {paper.source || "—"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground">
                          {paper.domain || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages} ({totalPapers} papers)
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CSV Format Hint */}
        <Card className="glass-card border-glass-border">
          <CardHeader>
            <CardTitle className="text-lg font-display">CSV Format</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Your CSV should have a header row with some or all of these columns:
            </p>
            <code className="block bg-secondary/50 p-3 rounded-lg text-sm text-primary overflow-x-auto">
              title,authors,abstract,year,source,domain,url
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Missing values will be filled with defaults (e.g. "Untitled", "Unknown Authors").
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
