
"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Pill,
  PlusCircle,
  BarChart3,
  Award,
  Lightbulb,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { AppHeader } from '@/components/shared/app-header';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';


interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    href: '/medications',
    label: 'Medications',
    icon: Pill,
    subItems: [
      { href: '/medications/list', label: 'View All', icon: Pill },
      { href: '/medications/add', label: 'Add New', icon: PlusCircle },
    ]
  },
  { href: '/stats', label: 'Adherence Stats', icon: BarChart3 },
  { href: '/rewards', label: 'Rewards', icon: Award },
  { href: '/health-insights', label: 'Health Insights', icon: Lightbulb },
];

const settingsNavItems: NavItem[] = [
  { href: '/settings', label: 'Settings', icon: Settings },
];


export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        router.push('/'); // Redirect to login if not authenticated
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      // Clear local storage on logout
      localStorage.removeItem('pillPalUserStats');
      localStorage.removeItem('pillPalMedications');
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

  const toggleSubMenu = (label: string) => {
    setOpenSubMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavItem = (item: NavItem, isSubItem = false) => {
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const Icon = item.icon;

    if (item.subItems) {
      const isSubMenuOpen = openSubMenus[item.label] ?? false;
      return (
        <SidebarMenuItem key={item.label}>
          <div className="flex w-full items-center">
            <SidebarMenuButton
              onClick={() => toggleSubMenu(item.label)}
              className="flex-grow"
              isActive={isActive && !isSubMenuOpen}
              tooltip={item.label}
            >
              <Icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
            <Button variant="ghost" size="icon" onClick={() => toggleSubMenu(item.label)} className="ml-auto p-1 h-auto group-data-[collapsible=icon]:hidden">
              {isSubMenuOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
          {isSubMenuOpen && (
            <SidebarMenuSub className="group-data-[collapsible=icon]:hidden">
              {item.subItems.map(subItem => (
                 <SidebarMenuSubItem key={subItem.href}>
                   <Link href={subItem.href} passHref legacyBehavior>
                     <SidebarMenuSubButton
                       isActive={pathname === subItem.href}
                       aria-current={pathname === subItem.href ? "page" : undefined}
                     >
                       <subItem.icon className="mr-2 h-4 w-4" />
                       <span>{subItem.label}</span>
                     </SidebarMenuSubButton>
                   </Link>
                 </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          )}
        </SidebarMenuItem>
      );
    }

    const ButtonComponent = isSubItem ? SidebarMenuSubButton : SidebarMenuButton;

    return (
      <SidebarMenuItem key={item.label}>
        <Link href={item.href} passHref legacyBehavior>
          <ButtonComponent
            isActive={isActive}
            aria-current={isActive ? "page" : undefined}
            tooltip={item.label}
          >
            <Icon />
            <span>{item.label}</span>
          </ButtonComponent>
        </Link>
      </SidebarMenuItem>
    );
  };

  if (loadingAuth) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-lg text-muted-foreground">Authenticating...</p>
      </div>
    );
  }
  
  if (!currentUser && !loadingAuth) {
    // This case should ideally be handled by the redirect in onAuthStateChanged,
    // but it's a fallback. Return null or a minimal loading/redirecting message.
    return null; 
  }


  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <Sidebar side="left" variant="sidebar" collapsible="icon">
          <SidebarHeader className="p-4 flex items-center justify-between">
             {/* Sidebar trigger can be here if not solely in AppHeader for mobile */}
          </SidebarHeader>
          <ScrollArea className="h-[calc(100vh-8rem)]"> {/* Adjust height as needed */}
            <SidebarContent>
              <SidebarMenu>
                {navItems.map(item => renderNavItem(item))}
              </SidebarMenu>
              <SidebarGroup>
                <SidebarGroupLabel>Account</SidebarGroupLabel>
                <SidebarMenu>
                 {settingsNavItems.map(item => renderNavItem(item))}
                 <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={handleLogout}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                        tooltip="Log Out"
                    >
                        <LogOut />
                        <span>Log Out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
          </ScrollArea>
          <SidebarFooter>
            {/* Footer content if any, e.g. app version */}
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-1 flex-col sm:pl-[var(--sidebar-width-icon)] group-data-[state=expanded]:sm:pl-[var(--sidebar-width)] transition-[padding-left] duration-200 ease-linear">
           <AppHeader />
           <main className="flex-1 overflow-auto w-full">
             {children}
           </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
