"use client";

import  { useMemo } from "react";
import {
  BarChart,
  LineChart,
  AreaChart,
  ScatterChart,
  Bar,
  Line,
  Area,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
} from "../ui/chart";

type Spec = {
  type: "bar" | "line" | "area" | "scatter";
  xKey: string;
  yKeys?: { key: string; label: string }[];
  data?: Record<string, unknown>[];
};

/** Simple HTML‐entity escaper to neutralize any `<`, `>`, `&`, `"`, `'` */
const sanitize = (str: string) =>
  str.replace(/[<>&'"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;" }[
      c as "<" | ">" | "&" | '"' | "'"
    ]!),
  );

export default function DynamicChart({ spec }: { spec: Spec }) {
  const { type, xKey } = spec;

  // 1️⃣ Never undefined
  const yKeys = Array.isArray(spec.yKeys) ? spec.yKeys : [];
  const data = Array.isArray(spec.data) ? spec.data : [];

  // 2️⃣ Nothing to draw? bail out
  if (yKeys.length === 0 || data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessun dato da visualizzare
      </p>
    );
  }

  // 3️⃣ Pick your Recharts wrapper (fallback to BarChart)
  const ChartComponent =
    { bar: BarChart, line: LineChart, area: AreaChart, scatter: ScatterChart }[
      type
    ] ?? BarChart;

  // 4️⃣ Build your series, but first strip out any non‐word chars from the key
  const series = useMemo(
    () =>
      yKeys.map(({ key, label }) => {
        const safeKey = key.replace(/[^\w]/g, "");
        const safeLabel = sanitize(label);

        switch (type) {
          case "line":
            return (
              <Line
                key={safeKey}
                dataKey={safeKey}
                name={safeLabel}
                type="monotone"
              />
            );
          case "area":
            return (
              <Area
                key={safeKey}
                dataKey={safeKey}
                name={safeLabel}
                type="monotone"
                fillOpacity={0.15}
              />
            );
          case "scatter":
            return <Scatter key={safeKey} dataKey={safeKey} name={safeLabel} />;
          default:
            return <Bar key={safeKey} dataKey={safeKey} name={safeLabel} />;
        }
      }),
    [yKeys, type],
  );

  // 5️⃣ And sanitize your legend/tooltip config
  const config = useMemo(
    () =>
      Object.fromEntries(
        yKeys.map(({ key, label }) => [
          key.replace(/[^\w]/g, ""),
          { label: sanitize(label) },
        ]),
      ),
    [yKeys],
  );

  return (
    <ChartContainer config={config}>
      <ChartComponent data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        {series}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend />
      </ChartComponent>
    </ChartContainer>
  );
}
