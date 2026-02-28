import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const delta = 2;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, i) =>
        typeof p === "string" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
              p === page
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="w-9 h-9 rounded-lg flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
