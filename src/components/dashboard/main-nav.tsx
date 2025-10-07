'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { navLinks } from '@/lib/data';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col p-2">
      <SidebarMenu>
        {navLinks.map((link) => (
          <SidebarMenuItem key={link.href}>
            <Link href={link.href} passHref>
              <SidebarMenuButton
                isActive={pathname === link.href}
                tooltip={{ children: link.label, side: 'right' }}
                className="justify-start"
                asChild
              >
                <div>
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
