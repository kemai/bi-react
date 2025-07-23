"use client";

import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from "victory";

const chartData = [
  { date: "2024-01", users: 150 },
  { date: "2024-02", users: 180 },
  { date: "2024-03", users: 220 },
  { date: "2024-04", users: 200 },
  { date: "2024-05", users: 250 },
  { date: "2024-06", users: 300 },
];

export default function SampleLineChart() {
  return (
    <div className="min-h-[200px] w-full aspect-auto">
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer
            labels={({ datum }) => datum.y}
            labelComponent={<VictoryTooltip />}
          />
        }
      >
        <VictoryAxis
          tickFormat={(value) => {
            const date = new Date(value + "-01");
            return date.toLocaleDateString("en-US", {
              month: "short",
            });
          }}
          style={{
            tickLabels: { padding: 8 },
            axis: { stroke: "none" },
            grid: { stroke: "none" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: { padding: 10 },
            axis: { stroke: "none" },
            grid: { stroke: "none" },
          }}
        />

        <VictoryLine
          data={chartData.map((d) => ({ x: d.date, y: d.users }))}
          style={{
            data: { stroke: "hsl(var(--accent))", strokeWidth: 2 },
          }}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </div>
  );
}
