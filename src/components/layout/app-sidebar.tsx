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
} from "../ui/sidebar";
import { useSidebar } from "../ui/sidebar-context";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  LogOut,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

import { appRoutes } from "../../routes";

export default function AppSidebar() {
  const { pathname } = useLocation();
  const { open, isMobile, state: sidebarState } = useSidebar();
  const logoSrc = open ? "/header_logo.svg" : "/favicon-Intrapresa-150x150.jpg";
  const logoClass = open ? "h-12 w-36 ml-10" : "h-8 w-8 ml-0";

  const navItems = appRoutes.filter((r) => r.path !== "/settings");
  const settingsItem = appRoutes.find((r) => r.path === "/settings")!;

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoSrc}
            alt="BI – Intrapresa"
            className={logoClass + " text-sidebar-primary transition-all"}
          />
          {open && (
            <h1 className="text-xl font-semibold text-sidebar-foreground"></h1>
          )}
        </Link>
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      <SidebarContent className="flex-1 overflow-y-auto p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              pathname === item.path  ||
              (item.path !== "/" && pathname.startsWith(item.path ));
            return (
              <SidebarMenuItem key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path}>
                      <SidebarMenuButton
                        variant="default"
                        size="default"
                        isActive={isActive}
                        className="text-base justify-start w-full mb-2 py-6 px-3"
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
        <SidebarMenuItem className="list-none marker-none">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={settingsItem.path}>
                <SidebarMenuButton
                  size="default"
                  isActive={pathname === settingsItem.path}
                  className="text-base justify-start w-full mb-2 py-6 px-3"
                >
                  <settingsItem.icon className="h-5 w-5 shrink-0" />
                  {open && (
                    <span className="truncate">{settingsItem.label}</span>
                  )}
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

        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-2 h-auto"
        >
          <LogOut className="mr-2 h-5 w-5 shrink-0" />
          {open && <span className="truncate">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
