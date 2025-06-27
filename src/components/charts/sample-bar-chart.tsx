
"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts"

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
  { month: "January", sales: 186 },
  { month: "February", sales: 305 },
  { month: "March", sales: 237 },
  { month: "April", sales: 173 },
  { month: "May", sales: 209 },
  { month: "June", sales: 280 },
]

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
}

export default function SampleBarChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full aspect-auto">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
