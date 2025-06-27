
import LookerBIQuerySection from '../components/dashboard/looker-bi-query-section';
import PageHeader from '../components/layout/page-header';

export default function BIQueryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="BI Assistant + Looker Studio"
        description="Ask questions about your Looker Studio data in natural language."
      />
      <LookerBIQuerySection />
    </div>
  );
}

