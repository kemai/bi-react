
import LookerStudioCard from '../components/dashboard/looker-studio-card';
import DataVisualizationCard from '../components/dashboard/data-visualization-card';
import PageHeader from '../components/layout/page-header';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to your BI Intrapresa overview."
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <LookerStudioCard className="md:col-span-2 lg:col-span-2" />
        <DataVisualizationCard className="lg:col-span-1" />
      </div>
    </div>
  );
}
