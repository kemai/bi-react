
"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

const chartData = [
  { date: "2024-01", users: 150 },
  { date: "2024-02", users: 180 },
  { date: "2024-03", users: 220 },
  { date: "2024-04", users: 200 },
  { date: "2024-05", users: 250 },
  { date: "2024-06", users: 300 },
]

const chartConfig = {
  users: {
    label: "Active Users",
    color: "hsl(var(--accent))",
  },
}

export default function SampleLineChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-auto">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 5,
          right: 20,
          left: -10,
          bottom: 5,
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            const date = new Date(value + "-01") // Ensure it's parsed as a date
            return date.toLocaleDateString("en-US", {
              month: "short",
            })
          }}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Line
          dataKey="users"
          type="monotone"
          stroke="var(--color-users)"
          strokeWidth={2}
          dot={{
            fill: "var(--color-users)",
            r: 4,
          }}
          activeDot={{
            r: 6,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
