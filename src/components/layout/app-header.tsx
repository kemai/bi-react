// src/components/layout/AppHeader.tsx
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fuse from "fuse.js";
import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search, Bell, X } from "lucide-react";
import { appRoutes } from "../../routes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../ui/dropdown-menu";

type RouteItem = {
  path: string;
  label: string;
  aliases?: string[];
};

export default function AppHeader() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // 1) Build routes + add "dashboard" alias
  const routes: RouteItem[] = useMemo(
    () =>
      appRoutes.map(({ path, label }) => ({
        path,
        label,
        aliases: path === "/" ? ["dashboard"] : [],
      })),
    []
  );

  // 2) Fuse.js setup
  const fuse = useMemo(
    () =>
      new Fuse(routes, {
        keys: ["label", "aliases"],
        threshold: 0.4,
      }),
    [routes]
  );

  // 3) Compute filtered
  const filtered = useMemo(() => {
    const t = query.trim();
    if (!t) return [];
    return fuse.search(t).map((r) => r.item);
  }, [query, fuse]);

  // 4) Click-outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // 5) Render
  return (
    <header className="w-full sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-foreground hover:text-primary" />
        {/* Optional: Page Title/Breadcrumbs can be added here */}
      </div>

      {/* Center */}
      <div className="flex-1 flex justify-center px-4">
        <div
          ref={containerRef}
          className="relative hidden md:block w-full max-w-md lg:max-w-lg"
        >
          {/* search icon */}
          {!query && (
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          )}

          {/* clear button */}
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* input */}
          <input
            type="text"
            className="w-full pl-12 pr-12 py-2 rounded-full border-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-[#0A7D82]"
            placeholder="Search pages…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* dropdown */}
          {query !== "" && (
            <ul className="absolute mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto z-20">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <li
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setQuery("");
                    }}
                    className="px-4 py-2 hover:bg-[#0A7D82]/10 cursor-pointer text-gray-900"
                  >
                    {item.label}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-500">No results found.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-foreground hover:text-primary"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="https://placehold.co/100x100.png"
                  alt="User avatar"
                />
                <AvatarFallback>IF</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
