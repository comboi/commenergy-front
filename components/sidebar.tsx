'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/app/platform/auth/contexts/auth-context';

const sidebarItems = [
  // { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  // { icon: Users, label: 'Users', href: '/users' },
  { icon: FileText, label: 'Contracts', href: '/platform/contracts' },
  { icon: Home, label: 'Communities', href: '/platform/communities' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { isAuthenticated, handleLogout, user } = useAuth();

  const avatar = 'https://avatar.iran.liara.run/public/31';

  if (!isAuthenticated) {
    return null;
  }

  const isCollapsed = state === 'collapsed';

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex gap-2 items-center space-between">
          <SidebarTrigger />
          {state === 'expanded' && <h2>Commenergy</h2>}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-4',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}>
                  <item.icon className="h-5 w-5" />
                  <span>{state === 'expanded' ? item.label : null}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={`flex items-center gap-4 justify-between ${
                isCollapsed ? 'flex-col' : 'flex-row'
              }`}>
              <div className="flex items-center gap-2">
                <img
                  src={avatar}
                  className="inline w-6 h-6 rounded-full"
                  alt="avatar"
                />
                {!isCollapsed && <span>{user?.name}</span>}
              </div>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
