import PageHeader from "../components/layout/page-header";
import ReportsContentCard from "../components/layout/reports-content-card";
import DataVisualizationCard from "../components/dashboard/data-visualization-card";
import { BarChartBig } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col w-full gap-6">
      {" "}
      {/* Added w-full here */}
      <PageHeader
        title="Reports"
        description="View and generate detailed reports from your data."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ReportsContentCard
          icon={BarChartBig}
          title="Reports Module"
          description="Detailed data insights and visualizations."
        >
          <p className="text-lg font-semibold text-center">
            Full-Width Content Area
          </p>
          <p className="text-muted-foreground mt-2 text-center">
            This section should span the full width of the page content area.
          </p>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            The reporting module is currently in development. Stay tuned for
            powerful reporting capabilities!
          </p>
        </ReportsContentCard>
        <DataVisualizationCard className="lg:col-span-1" />
      </div>
    </div>
  );
}
