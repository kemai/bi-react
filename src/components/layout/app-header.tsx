
"use client";

import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Search, Bell } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="w-full sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Left Group */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-foreground hover:text-primary" />
        {/* Optional: Page Title/Breadcrumbs can be added here */}
      </div>

      {/* Center Group (Search Bar) */}
      <div className="flex-1 flex justify-center px-4"> {/* Added px-4 to prevent search bar from touching side elements on smaller screens */}
        <form className="relative hidden md:block w-full max-w-md lg:max-w-lg"> {/* Adjusted width and max-width for better responsiveness */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-10 w-full rounded-full" /> {/* Changed to pl-10 and w-full */}
        </form>
      </div>

      {/* Right Group */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="user profile" />
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
