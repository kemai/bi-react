
"use client";

import PageHeader from '../components/layout/page-header';
import SettingsContentCard from '../components/layout/settings-content-card';
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure your application preferences and account details."
      />
      <SettingsContentCard
        icon={SettingsIcon}
        title="Application Settings"
        description="Account details and preferences."
        iconClassName="animate-spin-slow"
      >
        <p className="text-lg font-semibold text-center">Full-Width Content Area</p>
        <p className="text-muted-foreground mt-2 text-center">This section should span the full width of the page content area.</p>
        <p className="text-sm text-muted-foreground mt-1 text-center">Application settings will be available here soon. Customize BI to your needs.</p>
      </SettingsContentCard>
      <style>{`
        ..keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 5s linear infinite;
        }
      `}</style>
    </div>
  );
}
