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

interface UploadPaperRow {
  title: string;
  authors: string;
  abstract: string;
  year: number | null;
  source: string;
  domain: string;
  url: string | null;
}

const DEFAULT_UPSERT_BATCH_SIZE = 400;
const MIN_UPSERT_BATCH_SIZE = 25;
const MAX_UPSERT_RETRIES = 6;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isStatementTimeoutError(error: unknown): boolean {
  const message = (error as { message?: string } | null)?.message ?? "";
  const code = (error as { code?: string } | null)?.code ?? "";
  return code === "57014" || /statement timeout|canceling statement/i.test(message);
}

function isRetryableError(error: unknown): boolean {
  if (isStatementTimeoutError(error)) return true;
  const message = ((error as { message?: string } | null)?.message ?? "").toLowerCase();
  return (
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("network") ||
    message.includes("fetch") ||
    message.includes("connection")
  );
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }

  result.push(current.trim());
  return result;
}

function clampYear(val: string | undefined): number | null {
  if (!val) return null;
  const parsed = parseInt(val, 10);
  if (Number.isNaN(parsed)) return null;
  return Math.max(1800, Math.min(2100, parsed));
}

function normalizeCategory(value: string | null | undefined, fallback: string): string {
  const normalized = (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
  return normalized || fallback.toLowerCase();
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function buildPaperFingerprint(row: Pick<UploadPaperRow, "title" | "authors" | "year" | "source" | "domain" | "url">): string {
  return [
    normalizeText(row.title),
    normalizeText(row.authors),
    row.year ?? "",
    normalizeText(row.source),
    normalizeText(row.domain),
    normalizeText(row.url),
  ].join("|");
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteMode, setDeleteMode] = useState<"selected" | "all" | "source" | "domain" | null>(null);
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const perPage = 20;
  const minCategoryCount = 10;

  const statsQuery = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const sourceOptions = [...new Set((statsQuery.data?.by_source ?? [])
    .filter((item) => item.count > minCategoryCount)
    .map((item) => normalizeCategory(item.source, "Unknown Source")))];
  const domainOptions = [...new Set((statsQuery.data?.by_domain ?? [])
    .filter((item) => item.count > minCategoryCount)
    .map((item) => normalizeCategory(item.domain, "General")))];
  const sourceCount = (statsQuery.data?.by_source ?? []).filter((item) => item.count > minCategoryCount).length;
  const domainCount = (statsQuery.data?.by_domain ?? []).filter((item) => item.count > minCategoryCount).length;

  // Check admin
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        toast({ title: "Admin check failed", description: roleError.message, variant: "destructive" });
        navigate("/admin/login");
        return;
      }

      if (!roleData) { navigate("/admin/login"); return; }
      setIsAdmin(true);
    })();
  }, [navigate, toast]);

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
    if (uploading) return;
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.name.toLowerCase().endsWith(".csv"));
    if (invalidFile) {
      toast({ title: "Only CSV files allowed", description: `${invalidFile.name} is not a CSV.`, variant: "destructive" });
      e.target.value = "";
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setUploading(false);
      setUploadProgress(0);
      toast({ title: "Session expired", description: "Please login again.", variant: "destructive" });
      e.target.value = "";
      return;
    }

    const rows: UploadPaperRow[] = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim());

      if (lines.length < 2) {
        toast({ title: "Import failed", description: `${file.name}: CSV must have header + at least 1 row`, variant: "destructive" });
        setUploading(false);
        setUploadProgress(0);
        e.target.value = "";
        return;
      }

      const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().trim());
      const titleIdx = headers.indexOf("title");
      const authorsIdx = headers.indexOf("authors");
      const abstractIdx = headers.indexOf("abstract");
      const yearIdx = headers.indexOf("year");
      const sourceIdx = headers.indexOf("source");
      const domainIdx = headers.indexOf("domain");
      const urlIdx = headers.indexOf("url");

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue;

        rows.push({
          title: (titleIdx >= 0 ? cols[titleIdx] : null) || "Untitled",
          authors: (authorsIdx >= 0 ? cols[authorsIdx] : null) || "Unknown Authors",
          abstract: (abstractIdx >= 0 ? cols[abstractIdx] : null) || "No abstract available",
          year: clampYear(yearIdx >= 0 ? cols[yearIdx] : undefined),
          source: normalizeCategory(sourceIdx >= 0 ? cols[sourceIdx] : null, "Unknown Source"),
          domain: normalizeCategory(domainIdx >= 0 ? cols[domainIdx] : null, "General"),
          url: urlIdx >= 0 ? cols[urlIdx] || null : null,
        });
      }

      setUploadProgress(Math.max(5, Math.round(((fileIndex + 1) / files.length) * 40)));
    }

    if (rows.length === 0) {
      toast({ title: "Import failed", description: "No valid rows found", variant: "destructive" });
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
      return;
    }

    const uniqueRows: UploadPaperRow[] = [];
    const seenFingerprints = new Set<string>();

    for (const row of rows) {
      const fingerprint = buildPaperFingerprint(row);
      if (seenFingerprints.has(fingerprint)) continue;
      seenFingerprints.add(fingerprint);
      uniqueRows.push(row);
    }

    const duplicateInFileCount = rows.length - uniqueRows.length;

    const uploadRowsWithAdaptiveBatching = async (items: UploadPaperRow[]) => {
      let processed = 0;
      let cursor = 0;
      let batchSize = DEFAULT_UPSERT_BATCH_SIZE;

      while (cursor < items.length) {
        const end = Math.min(cursor + batchSize, items.length);
        const batch = items.slice(cursor, end);

        let attempt = 0;
        while (attempt < MAX_UPSERT_RETRIES) {
          const { error } = await supabase
            .from("papers")
            .upsert(batch, { onConflict: "dedupe_hash", ignoreDuplicates: true });

          if (!error) {
            processed += batch.length;
            cursor = end;
            const insertProgress = Math.round((processed / Math.max(items.length, 1)) * 60);
            setUploadProgress(Math.min(100, 40 + insertProgress));
            if (batchSize < DEFAULT_UPSERT_BATCH_SIZE) {
              batchSize = Math.min(DEFAULT_UPSERT_BATCH_SIZE, batchSize + 50);
            }
            break;
          }

          attempt += 1;

          if (isStatementTimeoutError(error) && batchSize > MIN_UPSERT_BATCH_SIZE) {
            batchSize = Math.max(MIN_UPSERT_BATCH_SIZE, Math.floor(batchSize / 2));
            break;
          }

          if (!isRetryableError(error) || attempt >= MAX_UPSERT_RETRIES) {
            throw error;
          }

          await delay(400 * attempt);
        }

        await delay(0);
      }
    };

    try {
      await uploadRowsWithAdaptiveBatching(uniqueRows);
    } catch (error) {
      const description = (error as { message?: string } | null)?.message || "Upload failed during batch processing.";
      toast({ title: "Import failed", description, variant: "destructive" });
      setUploading(false);
      setUploadProgress(0);
      e.target.value = "";
      return;
    }

    setUploadProgress(100);
    toast({
      title: "Import successful",
      description: `${uniqueRows.length} unique row(s) processed, ${duplicateInFileCount} duplicate row(s) skipped in file(s). Existing DB duplicates were auto-skipped.`,
    });

    fetchPapers();
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    setUploading(false);
    setTimeout(() => setUploadProgress(0), 600);
    e.target.value = "";
  };

  const handleDeleteSelected = async () => {
    if (uploading) return;
    if (selectedIds.size === 0) return;
    setDeleting(true);
    setDeleteMode("selected");
    setDeleteProgress(0);
    const idsToDelete = Array.from(selectedIds);

    let deleted = 0;
    for (let i = 0; i < idsToDelete.length; i += 500) {
      const chunk = idsToDelete.slice(i, i + 500);
      const { error } = await supabase.from("papers").delete().in("id", chunk);
      if (error) {
        toast({ title: "Delete failed", description: error.message, variant: "destructive" });
        setDeleting(false);
        setDeleteMode(null);
        setDeleteProgress(0);
        return;
      }

      deleted += chunk.length;
      setDeleteProgress(Math.round((deleted / idsToDelete.length) * 100));
    }

    toast({ title: "Deleted", description: `${idsToDelete.length} paper(s) removed.` });
    setSelectedIds(new Set());
    fetchPapers();
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    setDeleting(false);
    setDeleteMode(null);
    setTimeout(() => setDeleteProgress(0), 600);
  };

  const handleDeleteAll = async () => {
    if (uploading) return;
    setDeleting(true);
    setDeleteMode("all");
    setDeleteProgress(0);

    const { count, error: countError } = await supabase
      .from("papers")
      .select("id", { count: "exact", head: true });

    if (countError) {
      toast({ title: "Error", description: countError.message, variant: "destructive" });
      setDeleting(false);
      setDeleteMode(null);
      setDeleteProgress(0);
      return;
    }

    const totalToDelete = count ?? 0;
    if (totalToDelete === 0) {
      toast({ title: "No papers to delete" });
      setDeleting(false);
      setDeleteMode(null);
      setDeleteProgress(0);
      return;
    }

    let deleted = 0;
    let lastSeenId = 0;

    while (true) {
      const { data: idRows, error: listError } = await supabase
        .from("papers")
        .select("id")
        .gt("id", lastSeenId)
        .order("id", { ascending: true })
        .limit(1000);

      if (listError) {
        toast({ title: "Error", description: listError.message, variant: "destructive" });
        setDeleting(false);
        setDeleteMode(null);
        setDeleteProgress(0);
        return;
      }

      const ids = (idRows ?? []).map((paper) => paper.id);
      if (ids.length === 0) break;

      const { error } = await supabase.from("papers").delete().in("id", ids);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setDeleting(false);
        setDeleteMode(null);
        setDeleteProgress(0);
        return;
      }

      deleted += ids.length;
      lastSeenId = ids[ids.length - 1];
      setDeleteProgress(Math.min(100, Math.round((deleted / totalToDelete) * 100)));
    }

    toast({ title: "All papers deleted" });
    setSelectedIds(new Set());
    fetchPapers();
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    setDeleting(false);
    setDeleteMode(null);
    setTimeout(() => setDeleteProgress(0), 600);
  };

  const handleDeleteByField = async (field: "source" | "domain", value: string) => {
    if (uploading) return;
    if (!value || value === "all") return;

    setDeleting(true);
    setDeleteMode(field);
    setDeleteProgress(0);

    const { count, error: countError } = await supabase
      .from("papers")
      .select("id", { count: "exact", head: true });

    if (countError) {
      toast({ title: "Error", description: countError.message, variant: "destructive" });
      setDeleting(false);
      setDeleteMode(null);
      setDeleteProgress(0);
      return;
    }

    const totalRows = count ?? 0;
    if (totalRows === 0) {
      toast({ title: `No papers found for ${field}: ${value}` });
      setDeleting(false);
      setDeleteMode(null);
      setDeleteProgress(0);
      return;
    }

    const idsToDelete: number[] = [];
    let lastSeenId = 0;

    while (true) {
      const { data: rows, error: listError } = await supabase
        .from("papers")
        .select(`id, ${field}`)
        .gt("id", lastSeenId)
        .order("id", { ascending: true })
        .limit(1000);

      if (listError) {
        toast({ title: "Error", description: listError.message, variant: "destructive" });
        setDeleting(false);
        setDeleteMode(null);
        setDeleteProgress(0);
        return;
      }

      const pageRows = rows ?? [];
      if (pageRows.length === 0) break;

      for (const row of pageRows) {
        const normalized = normalizeCategory(
          field === "source" ? (row as { source?: string | null }).source : (row as { domain?: string | null }).domain,
          field === "source" ? "Unknown Source" : "General",
        );
        if (normalized === value) {
          idsToDelete.push((row as { id: number }).id);
        }
      }

      lastSeenId = pageRows[pageRows.length - 1].id;
      setDeleteProgress(Math.min(45, Math.round((lastSeenId / Math.max(lastSeenId, 1)) * 45)));
    }

    if (idsToDelete.length === 0) {
      toast({ title: `No papers found for ${field}: ${value}` });
      setDeleting(false);
      setDeleteMode(null);
      setDeleteProgress(0);
      return;
    }

    let deleted = 0;
    for (let i = 0; i < idsToDelete.length; i += 500) {
      const chunk = idsToDelete.slice(i, i + 500);
      const { error } = await supabase.from("papers").delete().in("id", chunk);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setDeleting(false);
        setDeleteMode(null);
        setDeleteProgress(0);
        return;
      }

      deleted += chunk.length;
      setDeleteProgress(Math.min(100, 45 + Math.round((deleted / idsToDelete.length) * 55)));
    }

    toast({ title: "Deleted", description: `${deleted} paper(s) deleted for ${field}: ${value}` });
    setSelectedIds(new Set());
    if (field === "source") setSelectedSource("all");
    if (field === "domain") setSelectedDomain("all");
    fetchPapers();
    queryClient.invalidateQueries({ queryKey: ["stats"] });
    setDeleting(false);
    setDeleteMode(null);
    setTimeout(() => setDeleteProgress(0), 600);
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
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} disabled={uploading}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Search
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={uploading}>
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
            { icon: Globe, label: "Sources", value: sourceCount },
            { icon: BarChart3, label: "Domains", value: domainCount },
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
                <input type="file" accept=".csv" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
                <Button asChild variant="default" disabled={uploading}>
                  <span>
                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    {uploading ? `Importing... ${uploadProgress}%` : "Upload CSVs"}
                  </span>
                </Button>
              </label>

              {/* Delete Selected */}
              {selectedIds.size > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleting || uploading}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deleting && deleteMode === "selected"
                        ? `Deleting... ${deleteProgress}%`
                        : `Delete ${selectedIds.size} Selected`}
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
                  <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10" disabled={deleting || uploading || totalPapers === 0}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting && deleteMode === "all" ? `Deleting... ${deleteProgress}%` : "Delete All"}
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

            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex gap-2">
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="h-10 rounded-md border border-glass-border bg-secondary/50 px-3 text-sm flex-1"
                  disabled={deleting || sourceOptions.length === 0}
                >
                  <option value="all">Select source</option>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      disabled={deleting || uploading || selectedSource === "all"}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deleting && deleteMode === "source" ? `Deleting... ${deleteProgress}%` : "Delete Source"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete papers from source: {selectedSource}?</AlertDialogTitle>
                      <AlertDialogDescription>This will delete all papers for the selected source. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteByField("source", selectedSource)} className="bg-destructive text-destructive-foreground">Delete Source</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="h-10 rounded-md border border-glass-border bg-secondary/50 px-3 text-sm flex-1"
                  disabled={deleting || domainOptions.length === 0}
                >
                  <option value="all">Select domain</option>
                  {domainOptions.map((domain) => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                </select>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                      disabled={deleting || uploading || selectedDomain === "all"}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deleting && deleteMode === "domain" ? `Deleting... ${deleteProgress}%` : "Delete Domain"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete papers from domain: {selectedDomain}?</AlertDialogTitle>
                      <AlertDialogDescription>This will delete all papers for the selected domain. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteByField("domain", selectedDomain)} className="bg-destructive text-destructive-foreground">Delete Domain</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {(uploading || deleting) && (
              <p className="text-sm text-muted-foreground">
                {uploading ? `Upload progress: ${uploadProgress}%` : `Delete progress: ${deleteProgress}%`}
              </p>
            )}

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
