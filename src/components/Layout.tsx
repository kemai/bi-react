// src/components/Layout.tsx

import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";
import { SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import { TooltipProvider } from "../components/ui/tooltip";
import "../index.css";

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <TooltipProvider delayDuration={0}>
        <div className="flex min-h-screen font-body antialiased bg-page-bg">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main content */}
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <main className="flex flex-col flex-1 w-full p-4 md:p-6 lg:p-8 overflow-y-auto">
              {/* qui React Router inietta le route figlie */}
              <Outlet />
            </main>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </TooltipProvider>
    </SidebarProvider>
  );
}
