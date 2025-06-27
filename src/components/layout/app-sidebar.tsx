
"use client";

import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LayoutDashboard, Database, BarChartBig, Settings, LogOut, MessageSquareQuote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/data-sources", label: "Data Sources", icon: Database },
  { href: "/reports", label: "Reports", icon: BarChartBig },
  { href: "/query", label: "Intelligent Query", icon: MessageSquareQuote },
];

const settingsItem = { href: "/settings", label: "Settings", icon: Settings };

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { open, isMobile, state: sidebarState } = useSidebar();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-sidebar-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          {open && <h1 className="text-xl font-semibold text-sidebar-foreground">BI - Intrapresa</h1>}
        </Link>
      </SidebarHeader>
      <Separator className="bg-sidebar-border" />
      <SidebarContent className="flex-1 overflow-y-auto p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <SidebarMenuItem key={item.label}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.href}>
                      <SidebarMenuButton
                        variant="default"
                        size="default"
                        isActive={isActive}
                        className="justify-start w-full" 
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {open && <span className="truncate">{item.label}</span>}
                      </SidebarMenuButton>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    align="center"
                    hidden={sidebarState !== "collapsed" || isMobile || open}
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <Separator className="bg-sidebar-border" />
      <SidebarFooter className="p-4">
        <SidebarMenuItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={settingsItem.href}>
                <SidebarMenuButton
                  size="default"
                  isActive={pathname === settingsItem.href}
                  className="justify-start w-full mb-2"
                >
                  <settingsItem.icon className="h-5 w-5 shrink-0" />
                  {open && <span className="truncate">{settingsItem.label}</span>}
                </SidebarMenuButton>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              align="center"
              hidden={sidebarState !== "collapsed" || isMobile || open}
            >
              {settingsItem.label}
            </TooltipContent>
          </Tooltip>
        </SidebarMenuItem>
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-2 h-auto">
          <LogOut className="mr-2 h-5 w-5 shrink-0" />
          {open && <span className="truncate">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
