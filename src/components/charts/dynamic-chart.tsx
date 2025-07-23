// src/components/charts/DynamicChart.tsx
"use client";

import { useMemo } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryLine,
  VictoryArea,
  VictoryScatter,
  VictoryGroup,
  VictoryPie,
  VictoryVoronoiContainer,
  VictoryTooltip,
  VictoryLegend,
} from "victory";

export type ChartSpec = {
  type: "bar" | "line" | "area" | "scatter" | "pie";
  xKey: string;
  xAxisType: "category" | "number" | "time";
  yKeys: { key: string; label: string }[];
  data: Array<Record<string, string | number | null>>;
  sort: { by: string; order: "asc" | "desc" };
  domainPadding: { x: number };
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

export default function DynamicChart({ spec }: { spec: ChartSpec }) {
  //
  // ── 1) sort the data
  //
  const sorted = useMemo(() => {
    const arr = [...spec.data];
    const { by, order } = spec.sort;
    arr.sort((a, b) => {
      const v1 = a[by],
        v2 = b[by];
      const n1 = typeof v1 === "number" ? v1 : parseFloat(v1 as string) || 0;
      const n2 = typeof v2 === "number" ? v2 : parseFloat(v2 as string) || 0;
      return order === "asc" ? n1 - n2 : n2 - n1;
    });
    return arr;
  }, [spec.data, spec.sort]);

  //
  // ── 2) build one series per yKey
  //
  const series = useMemo(() => {
    type Pt = { x: string | number; y: number };

    return spec.yKeys.map((yk, idx) => {
      const pts: Pt[] = sorted
        .map((row) => {
          const rawX = row[spec.xKey];
          const rawY = row[yk.key];
          const x =
            spec.xAxisType === "time" && typeof rawX === "string"
              ? new Date(rawX).toISOString()
              : rawX!;
          const y =
            typeof rawY === "number"
              ? rawY
              : typeof rawY === "string"
              ? parseFloat(rawY)
              : NaN;
          return { x, y };
        })
        .filter((p) => typeof p.y === "number" && !isNaN(p.y));

      return {
        key: yk.key,
        label: yk.label,
        color: COLORS[idx % COLORS.length],
        points: pts,
      };
    });
  }, [sorted, spec.yKeys, spec.xKey, spec.xAxisType]);

  //
  // ── 3) bail early if no data
  //
  if (sorted.length === 0 || series.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nessun dato da visualizzare
      </p>
    );
  }

  //
  // ── 4) pie‐chart branch
  //
  if (spec.type === "pie") {
    // we only have one series, so pick series[0]
    const pieSeries = series[0];
    // build the pie data
    const pieData = pieSeries.points.map((pt) => ({
      x: pt.x as string,
      y: pt.y,
    }));

    return (
      <div className="min-h-[250px] w-full flex justify-center items-center">
        <VictoryPie
          data={pieData}
          // use your COLORS array
          colorScale={COLORS}
          // show “Category: 1,404,126” in the tooltip _and_ on-slice
          labels={({ datum }) => `${datum.x}\n${datum.y.toLocaleString()}`}
          labelComponent={
            <VictoryTooltip
              // default tooltip styling; you can tweak
              centerOffset={{ x: 25 }}
              flyoutStyle={{ stroke: "#333", fill: "#fff" }}
            />
          }
          // push the on-slice labels outwards so they don't overlap
          labelRadius={({ radius }) => (typeof radius === "number" ? radius + 20 : 50)}
          style={{
            labels: { fontSize: 8, fill: "#333", pointerEvents: "none" },
          }}
          // add a little separation between slices
          padAngle={1}
          // make it responsive
          width={350}
          height={350}
        />

        {/* Legend underneath */}
        <VictoryLegend
          orientation="horizontal"
          gutter={10}
          itemsPerRow={3}
          style={{
            labels: { fontSize: 10, padding: 5 },
          }}
          data={pieData.map((d, i) => ({
            name: d.x,
            symbol: { fill: COLORS[i % COLORS.length], type: "square" },
          }))}
        />
      </div>
    );
  }

  //
  // ── 5) domain & padding
  //
  const padding = { top: 60, bottom: 50, left: 70, right: 50 };
  const domainPadding = { x: spec.domainPadding.x };

  //
  // ── 6) render cartesian chart
  //
  return (
    <div className="min-h-[250px] w-full">
      <VictoryChart
        padding={padding}
        domainPadding={domainPadding}
        containerComponent={
          <VictoryVoronoiContainer
            responsive
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip flyoutStyle={{ fill: "#fff" }} />}
          />
        }
      >
        {/* legend */}
        <VictoryLegend
          x={padding.left}
          y={10}
          orientation="horizontal"
          gutter={20}
          style={{ labels: { fontSize: 12 } }}
          data={series.map((s) => ({
            name: s.label,
            symbol: { fill: s.color, type: "circle", size: 6 },
          }))}
        />

        {/* x‐axis */}
        <VictoryAxis
          tickFormat={(t) =>
            spec.xAxisType === "time"
              ? new Date(t as string).toLocaleDateString()
              : `${t}`
          }
          style={{
            tickLabels: { fontSize: 10, padding: 5 },
            grid: { stroke: spec.type === "bar" ? "none" : "#eee" },
          }}
        />

        {/* y‐axis */}
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "#e5e7eb", strokeWidth: 1 },
            tickLabels: { fontSize: 10, padding: 5 },
          }}
        />

        {/* series by type */}
        {spec.type === "bar" && (
          <VictoryGroup offset={domainPadding.x || 20}>
            {series.map((s) => (
              <VictoryBar
                key={s.key}
                data={s.points}
                barWidth={domainPadding.x / series.length - 2}
                style={{ data: { fill: s.color } }}
              />
            ))}
          </VictoryGroup>
        )}
        {spec.type === "area" &&
          series.map((s) => (
            <VictoryArea
              key={s.key}
              data={s.points}
              style={{
                data: {
                  fill: s.color,
                  fillOpacity: 0.2,
                  stroke: s.color,
                  strokeWidth: 2,
                },
              }}
            />
          ))}
        {spec.type === "scatter" &&
          series.map((s) => (
            <VictoryScatter
              key={s.key}
              data={s.points}
              size={4}
              style={{ data: { fill: s.color } }}
            />
          ))}
        {spec.type === "line" &&
          series.map((s) => (
            <VictoryLine
              key={s.key}
              data={s.points}
              style={{ data: { stroke: s.color, strokeWidth: 2 } }}
            />
          ))}
      </VictoryChart>
    </div>
  );
}
