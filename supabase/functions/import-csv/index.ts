import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current.trim());
  return result;
}

function clampYear(val: string | undefined): number | null {
  if (!val) return null;
  const n = parseInt(val, 10);
  if (isNaN(n)) return null;
  return Math.max(1800, Math.min(2100, n));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user is admin
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid auth" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check admin role using service role client
    const adminClient = createClient(supabaseUrl, supabaseKey);
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(
        JSON.stringify({ success: false, error: "Not authorized - admin only" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse CSV from body
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return new Response(
        JSON.stringify({ success: false, error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) {
      return new Response(
        JSON.stringify({ success: false, error: "CSV must have header + at least 1 row" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim());
    const titleIdx = headers.indexOf("title");
    const authorsIdx = headers.indexOf("authors");
    const abstractIdx = headers.indexOf("abstract");
    const yearIdx = headers.indexOf("year");
    const sourceIdx = headers.indexOf("source");
    const domainIdx = headers.indexOf("domain");
    const urlIdx = headers.indexOf("url");

    const papers: Record<string, unknown>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length === 0 || (cols.length === 1 && !cols[0])) continue;

      papers.push({
        title: (titleIdx >= 0 ? cols[titleIdx] : null) || "Untitled",
        authors: (authorsIdx >= 0 ? cols[authorsIdx] : null) || "Unknown Authors",
        abstract: (abstractIdx >= 0 ? cols[abstractIdx] : null) || "No abstract available",
        year: clampYear(yearIdx >= 0 ? cols[yearIdx] : undefined),
        source: (sourceIdx >= 0 ? cols[sourceIdx] : null) || "Unknown Source",
        domain: (domainIdx >= 0 ? cols[domainIdx] : null) || "General",
        url: urlIdx >= 0 ? cols[urlIdx] || null : null,
      });
    }

    if (papers.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "No valid rows found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert in batches of 500
    let inserted = 0;
    for (let i = 0; i < papers.length; i += 500) {
      const batch = papers.slice(i, i + 500);
      const { error: insertError } = await adminClient
        .from("papers")
        .insert(batch);
      if (insertError) {
        return new Response(
          JSON.stringify({ success: false, error: insertError.message, inserted }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      inserted += batch.length;
    }

    return new Response(
      JSON.stringify({ success: true, inserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
