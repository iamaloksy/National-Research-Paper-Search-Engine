import { motion } from "framer-motion";
import { Stats } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface StatsChartsProps {
  stats: Stats | undefined;
}

const COLORS = [
  "hsl(160, 60%, 45%)",
  "hsl(200, 80%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(30, 80%, 55%)",
  "hsl(340, 60%, 55%)",
  "hsl(60, 70%, 50%)",
];

export function StatsCharts({ stats }: StatsChartsProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Papers by Source</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.by_source} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 12 }} />
              <YAxis type="category" dataKey="source" tick={{ fill: "hsl(210, 20%, 85%)", fontSize: 12 }} width={80} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {stats.by_source?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Papers by Domain</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.by_domain} layout="vertical" margin={{ left: 10 }}>
              <XAxis type="number" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 12 }} />
              <YAxis type="category" dataKey="domain" tick={{ fill: "hsl(210, 20%, 85%)", fontSize: 12 }} width={120} />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {stats.by_domain?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
