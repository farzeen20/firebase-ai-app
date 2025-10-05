import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { MainNav } from '@/components/dashboard/main-nav';
import { UserNav } from '@/components/dashboard/user-nav';
import { BachatPalLogo } from '@/components/bachat-pal-logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <BachatPalLogo className="h-8 w-8 text-primary" />
              <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">BachatPal</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
             <MainNav />
          </div>
        </div>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <div className="flex-1">
             {/* Mobile sidebar trigger can be added here if needed */}
          </div>
          <UserNav />
        </header>
        <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
