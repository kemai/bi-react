"use client";

import * as React from "react";
import {
  VictoryChart,
  VictoryTooltip,
  VictoryLegend,
  VictoryAxis,
  VictoryLine,
} from "victory";

export type SeriesDatum = { x: string | number; y: number };

export type SeriesConfig = {
  key: string;
  label?: React.ReactNode;
  icon?: React.ComponentType;
  color: string;
  theme?: { light: string; dark: string };
  data: SeriesDatum[];
};

export type ChartProps = {
  series: SeriesConfig[];
  width?: number;
  height?: number;
};

export function Chart({
  series,
  width = 600,
  height = 300,
}: ChartProps) {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const getColor = (s: SeriesConfig) =>
    s.theme ? (isDark ? s.theme.dark : s.theme.light) : s.color;

  return (
    <VictoryChart width={width} height={height}>
      {/* axes */}
      <VictoryAxis />
      <VictoryAxis dependentAxis />

      {/* one line per series, with its own tooltip */}
      {series.map((s) => (
        <VictoryLine
          key={s.key}
          data={s.data}
          style={{ data: { stroke: getColor(s), strokeWidth: 2 } }}
          labels={({ datum }) => datum.y}
          labelComponent={<VictoryTooltip />}
        />
      ))}

      {/* legend */}
      <VictoryLegend
        x={width / 2 - 80}
        y={10}
        orientation="horizontal"
        gutter={20}
        data={series.map((s) => ({
          name: s.label as string,
          symbol: { fill: getColor(s) },
        }))}
      />
    </VictoryChart>
  );
}

Chart.displayName = "Chart";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setMatches(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
