
import LookerBIQuerySection from '../components/dashboard/bi-query-section';
import PageHeader from '../components/layout/page-header';

export default function BIQueryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="BI Assistant"
        description="Ask questions about your data in natural language."
      />
      <LookerBIQuerySection />
    </div>
  );
}

