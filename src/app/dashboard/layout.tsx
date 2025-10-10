import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { MainNav } from '@/components/dashboard/main-nav';
import { UserNav } from '@/components/dashboard/user-nav';
import { BachatBuddyLogo } from '@/components/bachat-buddy-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PanelLeft } from 'lucide-react';
import { NotificationPermissionManager } from '@/components/dashboard/notification-permission-manager';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BachatBuddyLogo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">Bachat Buddy</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
             <MainNav />
          </div>
        </div>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger variant="outline" size="icon" className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
          </SidebarTrigger>
          <div className="flex-1">
             {/* Search bar or other header content can go here */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-8">
          <NotificationPermissionManager />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    