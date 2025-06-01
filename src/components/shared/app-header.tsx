
"use client";

import Link from 'next/link';
import { Pill, UserCircle, Bell, Settings, LogOut, Inbox, MessageSquareText, Trash2 } from 'lucide-react';
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
import React, { useState, useEffect, useCallback } from 'react';
import { InAppNotification } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY = 'pillPalInAppNotifications';

export function AppHeader() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const loadNotifications = useCallback(() => {
    if (!isClient) return;
    try {
      const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY);
      if (storedNotificationsString) {
        const loadedNotifs = JSON.parse(storedNotificationsString) as InAppNotification[];
        setNotifications(loadedNotifs);
        setUnreadCount(loadedNotifs.filter(n => !n.isRead).length);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error loading in-app notifications:", error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isClient]);

  useEffect(() => {
    loadNotifications();

    const handleStorageUpdate = (event: Event) => {
        // Check if it's our custom event or a storage event for the specific key
      if ((event instanceof CustomEvent && event.type === 'pillPalInAppNotificationUpdate') ||
          (event instanceof StorageEvent && event.key === LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY)) {
        loadNotifications();
      }
    };
    
    window.addEventListener('pillPalInAppNotificationUpdate', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate); // For changes in other tabs

    return () => {
      window.removeEventListener('pillPalInAppNotificationUpdate', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [loadNotifications]);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('pillPalUserStats');
      localStorage.removeItem('pillPalMedications');
      localStorage.removeItem('pillPalMedicationRemindersEnabled');
      localStorage.removeItem(LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY);
      router.push('/'); 
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

  const markNotificationAsRead = (notificationId: string) => {
    if (!isClient) return;
    try {
      const updatedNotifications = notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
      localStorage.setItem(LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
  };

  const markAllNotificationsAsRead = () => {
    if (!isClient) return;
    try {
        const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
        localStorage.setItem(LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
    }
  };
  
  const clearAllNotifications = () => {
    if (!isClient) return;
    try {
        setNotifications([]);
        setUnreadCount(0);
        localStorage.removeItem(LOCAL_STORAGE_IN_APP_NOTIFICATIONS_KEY);
    } catch (error) {
        console.error("Error clearing notifications:", error);
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
        <DropdownMenu onOpenChange={(open) => { if (open) loadNotifications(); }}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-5 w-5" />
              {isClient && unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 min-w-4 p-0 flex items-center justify-center text-xs rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 md:w-96 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                {notifications.length > 0 && (
                     <Button variant="link" size="sm" className="text-xs p-0 h-auto" onClick={markAllNotificationsAsRead} disabled={unreadCount === 0}>
                        Mark all as read
                    </Button>
                )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <DropdownMenuItem 
                    key={notif.id} 
                    className={`flex flex-col items-start gap-1 cursor-pointer hover:bg-accent/80 ${!notif.isRead ? 'bg-primary/5 font-medium' : ''}`}
                    onClick={() => markNotificationAsRead(notif.id)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') markNotificationAsRead(notif.id);}}
                    tabIndex={0} 
                >
                  <div className="flex items-center w-full">
                     <MessageSquareText className={`mr-2 h-4 w-4 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                     <p className="text-sm flex-grow">{notif.title}</p>
                     {!notif.isRead && <div className="h-2 w-2 rounded-full bg-primary ml-auto"></div>}
                  </div>
                  <p className="text-xs text-muted-foreground pl-6">{notif.body}</p>
                  <p className="text-xs text-muted-foreground/70 pl-6">{formatDistanceToNow(notif.timestamp, { addSuffix: true })}</p>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                <Inbox className="mx-auto h-10 w-10 opacity-50 mb-2" />
                <p>No new notifications yet.</p>
                <p className="text-xs">Check back later!</p>
              </div>
            )}
            {notifications.length > 0 && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={clearAllNotifications} className="text-destructive focus:bg-destructive/10 focus:text-destructive justify-center">
                        <Trash2 className="mr-2 h-4 w-4"/> Clear All Notifications
                    </DropdownMenuItem>
                </>
            )}
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
              <Link href="/settings"> 
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

