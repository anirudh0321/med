
"use client";

import Link from 'next/link';
import { Pill, UserCircle, Bell, Settings } from 'lucide-react'; // Removed PanelLeft as SidebarTrigger provides it
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
// Removed useIsMobile import as it's no longer needed for the trigger's visibility

export function AppHeader() {
  // const isMobile = useIsMobile(); // No longer needed for this logic

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger /> {/* SidebarTrigger is now always visible */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <Pill className="h-7 w-7 text-primary" />
          <span className="text-xl font-semibold font-headline text-primary hidden sm:block">
            Pill Pal
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <UserCircle className="h-6 w-6" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // Mock logout: redirect to login page
                window.location.href = '/'; 
              }}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
