// src/routes.tsx
import HomePage from "./pages/HomePage";
import SourcesPage from "./pages/DataSourcesPage";
import QueryPage from "./pages/BIQueryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import type { LucideIcon } from "lucide-react";

import {
  LayoutDashboard,
  Database,
  BarChartBig,
  MessageSquareQuote,
  Settings,
} from "lucide-react";

export interface AppRoute {
  path: string;
  label: string;
  element: React.ReactNode;
  icon: LucideIcon;
}

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    label: "Dashboard",
    element: <HomePage />,
    icon: LayoutDashboard,
  },
  {
    path: "/query",
    label: "BI Assistant",
    element: <QueryPage />,
    icon: MessageSquareQuote,
  },
  {
    path: "/data-sources",
    label: "Data Sources",
    element: <SourcesPage />,
    icon: Database,
  },
  {
    path: "/reports",
    label: "Reports",
    element: <ReportsPage />,
    icon: BarChartBig,
  },
  {
    path: "/settings",
    label: "Settings",
    element: <SettingsPage />,
    icon: Settings,
  },
];
