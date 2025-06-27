// src/components/Layout.tsx
import React from "react";
import "../index.css";
import { Toaster } from "../components/ui/toaster";
import { SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import { TooltipProvider } from "../components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
              {children}
            </main>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster />
      </TooltipProvider>
    </SidebarProvider>
  );
}
