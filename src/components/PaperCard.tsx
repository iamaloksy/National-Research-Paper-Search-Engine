import { motion } from "framer-motion";
import { Calendar, User, BookOpen, ExternalLink, Tag } from "lucide-react";
import { Paper } from "@/lib/api";

interface PaperCardProps {
  paper: Paper;
  index: number;
}

export function PaperCard({ paper, index }: PaperCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card-hover p-5 md:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
              <Tag className="w-3 h-3" />
              {paper.domain}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-accent/10 text-accent text-xs font-medium">
              {paper.source}
            </span>
            {paper.score !== undefined && paper.score > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary text-muted-foreground text-xs">
                Score: {paper.score.toFixed(3)}
              </span>
            )}
          </div>

          <h3 className="text-lg font-display font-semibold text-foreground mb-2 line-clamp-2">
            {paper.title}
          </h3>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{paper.authors}</span>
            </span>
            {paper.year && (
              <span className="inline-flex items-center gap-1 shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                {paper.year}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            <BookOpen className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            {paper.abstract}
          </p>
        </div>

        {paper.url && (
          <a
            href={paper.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
