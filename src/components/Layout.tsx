
import "../index.css"; 
import { Toaster } from "../components/ui/toaster";
import { SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/layout/app-sidebar";
import AppHeader from "../components/layout/app-header";
import { TooltipProvider } from "../components/ui/tooltip";


export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {/* wrap everything in your provider */}
        <SidebarProvider defaultOpen={true}>
          <TooltipProvider delayDuration={0}>
            <div className="flex min-h-screen">
              {/* this renders your mobile & desktop sidebar */}
              <AppSidebar />

              {/* main area */}
              <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex flex-col flex-1 w-full p-4 md:p-6 lg:p-8 overflow-y-auto">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </TooltipProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
