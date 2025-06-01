
"use client";

import Link from 'next/link';
import { Pill, UserCircle, Bell, Settings, LogOut, Inbox } from 'lucide-react';
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
import { auth } from '@/lib/firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function AppHeader() {
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear local storage on logout
      localStorage.removeItem('pillPalUserStats');
      localStorage.removeItem('pillPalMedications');
      localStorage.removeItem('pillPalMedicationRemindersEnabled');
      router.push('/'); // Redirect to login page
       toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="h-8 w-8" />
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-primary/5 transition-colors"
        >
          <Pill className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold font-headline text-primary hidden sm:block">
            Pill Pal
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-4 text-center text-sm text-muted-foreground">
              <Inbox className="mx-auto h-10 w-10 opacity-50 mb-2" />
              <p>No new notifications yet.</p>
              <p className="text-xs">Check back later!</p>
            </div>
            {/* Example of a notification item - can be used when actual notifications are implemented
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <p className="font-medium">Medication Reminder</p>
              <p className="text-xs text-muted-foreground">Time to take your Amoxicillin (10:00 AM).</p>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            */}
          </DropdownMenuContent>
        </DropdownMenu>

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
            <DropdownMenuItem asChild>
              <Link href="/settings"> {/* Updated to point to the main settings page */}
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profile & Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4"/>
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
