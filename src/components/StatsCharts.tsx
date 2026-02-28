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

const MIN_CHART_HEIGHT = 220;
const ROW_HEIGHT = 34;
const MIN_CATEGORY_COUNT = 10;
const TOP_DOMAIN_LIMIT = 10;

function getChartHeight(itemCount: number): number {
  return Math.max(MIN_CHART_HEIGHT, itemCount * ROW_HEIGHT);
}

function truncateLabel(label: string, maxLength: number): string {
  if (!label) return "—";
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label;
}

export function StatsCharts({ stats }: StatsChartsProps) {
  if (!stats) return null;

  const sourceChartData = stats.by_source.filter((item) => item.count > MIN_CATEGORY_COUNT);
  const domainChartData = stats.by_domain
    .filter((item) => item.count > MIN_CATEGORY_COUNT)
    .slice(0, TOP_DOMAIN_LIMIT);

  const sourceChartHeight = getChartHeight(sourceChartData.length);
  const domainChartHeight = getChartHeight(domainChartData.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Papers by Source</h3>
        <div className="pr-1">
          <div style={{ height: `${sourceChartHeight}px`, minHeight: `${MIN_CHART_HEIGHT}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceChartData} layout="vertical" margin={{ left: 10, right: 8 }}>
              <XAxis type="number" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="source"
                tick={{ fill: "hsl(210, 20%, 85%)", fontSize: 12 }}
                width={140}
                tickFormatter={(value) => truncateLabel(String(value), 20)}
              />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {sourceChartData?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <h3 className="font-display font-semibold text-foreground mb-4">Papers by Domain</h3>
        <div className="pr-1">
          <div style={{ height: `${domainChartHeight}px`, minHeight: `${MIN_CHART_HEIGHT}px` }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainChartData} layout="vertical" margin={{ left: 10, right: 8 }}>
              <XAxis type="number" tick={{ fill: "hsl(215, 12%, 55%)", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="domain"
                tick={{ fill: "hsl(210, 20%, 85%)", fontSize: 12 }}
                width={160}
                tickFormatter={(value) => truncateLabel(String(value), 24)}
              />
              <Tooltip
                contentStyle={{ background: "hsl(220, 20%, 12%)", border: "1px solid hsl(220, 15%, 22%)", borderRadius: 8, color: "hsl(210, 20%, 92%)" }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {domainChartData?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
