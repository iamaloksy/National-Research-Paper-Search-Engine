import { motion } from "framer-motion";
import { FileText, Database, Globe, Calendar } from "lucide-react";
import { Stats } from "@/lib/api";

interface StatsCardsProps {
  stats: Stats | undefined;
  isLoading: boolean;
}

const iconMap = [
  { icon: FileText, label: "Total Papers" },
  { icon: Database, label: "Sources" },
  { icon: Globe, label: "Domains" },
  { icon: Calendar, label: "Year Range" },
];

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    { value: stats?.total_papers ?? 0, label: "Total Papers", idx: 0 },
    { value: stats?.by_source?.length ?? 0, label: "Sources", idx: 1 },
    { value: stats?.by_domain?.length ?? 0, label: "Domains", idx: 2 },
    { value: stats?.year_range ? `${stats.year_range.min}–${stats.year_range.max}` : "—", label: "Year Range", idx: 3 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = iconMap[card.idx].icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-card-hover p-5 text-center"
          >
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 w-8 rounded-lg bg-muted mx-auto" />
                <div className="h-8 bg-muted rounded w-16 mx-auto" />
                <div className="h-4 bg-muted rounded w-20 mx-auto" />
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">
                  {card.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{card.label}</div>
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
