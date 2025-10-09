
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navLinks } from '@/lib/data';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/context/language-context';

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const translatedNavLinks = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: navLinks[0].icon },
    { href: '/dashboard/savings', label: t('nav.dailySavings'), icon: navLinks[1].icon },
    { href: '/dashboard/goals', label: t('nav.goals'), icon: navLinks[2].icon },
    { href: '/dashboard/committees', label: t('nav.committees'), icon: navLinks[3].icon },
    { href: '/dashboard/budget', label: t('nav.budgetManager'), icon: navLinks[4].icon },
    { href: '/dashboard/learn', label: t('nav.literacyHub'), icon: navLinks[5].icon },
    { href: '/dashboard/family', label: t('nav.familyMode'), icon: navLinks[6].icon },
    { href: '/dashboard/settings', label: t('nav.settings'), icon: navLinks[7].icon },
  ]


  return (
    <nav className="flex flex-col p-2">
      <SidebarMenu>
        {translatedNavLinks.map((link) => (
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
