"use client";

import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTooltip,
} from "victory";

const chartData = [
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 173 },
  { month: "May", sales: 209 },
  { month: "June", sales: 280 },
];

export default function SampleBarChart() {
  return (
    <div className="min-h-[200px] w-full aspect-auto">
      <VictoryChart domainPadding={20}>
        {/* X Axis */}
        <VictoryAxis
          tickFormat={(t) => (t as string).slice(0, 3)}
          style={{
            tickLabels: { padding: 10 },
            axis:       { stroke: "none" },
            grid:       { stroke: "none" },
          }}
        />

        {/* Y Axis */}
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: { padding: 10 },
            axis:       { stroke: "none" },
            grid:       { stroke: "none" },
          }}
        />

        {/* Bars with built-in tooltips */}
        <VictoryBar
          data={chartData.map((d) => ({ x: d.month, y: d.sales }))}
          style={{ data: { fill: "hsl(var(--primary))" } }}
          cornerRadius={4}

          // ← here’s the change: labels + labelComponent instead of containerComponent
          labels={({ datum }) => datum.y}
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </div>
  );
}
