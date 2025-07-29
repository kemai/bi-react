
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SampleBarChart from "../charts/sample-bar-chart";
import SampleLineChart from "../charts/sample-line-chart";
import { BarChart3, LineChart } from "lucide-react";



interface DataVisualizationCardProps {
  className?: string;
}

export default function DataVisualizationCard({ className }: DataVisualizationCardProps) {
  const [activeTab, setActiveTab] = useState("barChart");

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Data Visualizations</CardTitle>
        </div>
        <CardDescription>Explore your data through interactive charts and graphs. Current trends and key metrics at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto mb-4">
            <TabsTrigger value="barChart" aria-label="Show Bar Chart">
              <BarChart3 className="mr-2 h-4 w-4" /> Bar Chart
            </TabsTrigger>
            <TabsTrigger value="lineChart" aria-label="Show Line Chart">
              <LineChart className="mr-2 h-4 w-4" /> Line Chart
            </TabsTrigger>
          </TabsList>
          <TabsContent value="barChart" className="animate-fade-in">
             <p className="text-sm text-muted-foreground mb-2">Monthly Sales Performance</p>
            <SampleBarChart />
          </TabsContent>
          <TabsContent value="lineChart" className="animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">User Engagement Over Time</p>
            <SampleLineChart />
          </TabsContent>
        </Tabs>
        {/* Placeholder for when no chart is selected or as a general illustration */}
        {activeTab !== "barChart" && activeTab !== "lineChart" && (
           <div className="mt-4 flex flex-col items-center text-center">
             <img
               src="https://placehold.co/400x250.png"
               alt="Data visualization placeholder"
               width={400}
               height={250}
               className="rounded-lg object-cover"
               data-ai-hint="charts analytics"
             />
             <p className="mt-2 text-sm text-muted-foreground">Select a chart type to view data.</p>
           </div>
        )}
      </CardContent>
    </Card>
  );
}
