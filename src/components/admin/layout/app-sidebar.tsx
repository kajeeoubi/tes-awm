'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  ChevronsUpDown,
  LogOut,
  User,
  Shield,
  Settings,
} from 'lucide-react';
import { AdminUser } from '@/types/ecommerce';

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetch('/api/admin/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});

    const handleProfileUpdate = (e: CustomEvent<AdminUser>) => {
      if (e.detail) {
        setAdminUser(e.detail);
      }
    };

    window.addEventListener('sparke:admin-profile-updated' as any, handleProfileUpdate);
    return () => {
      window.removeEventListener('sparke:admin-profile-updated' as any, handleProfileUpdate);
    };
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      toast.success('Berhasil Keluar', {
        description: 'Sesi admin telah diakhiri dengan aman.',
      });
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Gagal keluar');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Ringkasan', href: '/admin', icon: LayoutDashboard },
    { id: 'orders', label: 'Pesanan', href: '/admin/orders', icon: ShoppingBag },
    { id: 'products', label: 'Katalog Produk', href: '/admin/products', icon: Package },
    { id: 'vouchers', label: 'Voucher & Promo', href: '/admin/vouchers', icon: Tag },
  ];

  const adminInitials = adminUser?.name
    ? adminUser.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AP';

  const adminName = adminUser?.name || 'Admin Pusat';
  const adminEmail = adminUser?.email || 'admin@sparke.id';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40 bg-white font-sans">
      <SidebarHeader className="h-18 flex flex-row items-center p-2.5 border-b border-border/40 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <Link href="/admin" className="flex items-center gap-2.5 w-full px-2.5 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group">
          <div className="h-5 w-5 rounded-[5px] border-2 border-foreground flex items-center justify-center shrink-0">
            <div className="h-1.5 w-1.5 bg-foreground rounded-[1px]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans leading-none group-data-[collapsible=icon]:hidden">
            Sparke
          </span>
        </Link>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="p-2.5 py-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:py-4">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => {
            const isActive =
              item.id === 'overview'
                ? pathname === '/admin'
                : pathname === item.href || pathname?.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={item.label}
                  className={`w-full justify-start rounded-xl px-2.5 py-2 text-xs transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                    isActive
                      ? 'bg-foreground text-white font-bold shadow-xs'
                      : 'text-neutral-500 hover:text-foreground hover:bg-neutral-100/80 font-medium'
                  }`}
                  render={<Link href={item.href} />}
                >
                  <Icon className="h-4 w-4 shrink-0 stroke-[1.75]" />
                  <span className="truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2.5 border-t border-border/40 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={adminName}
                    className="data-[state=open]:bg-neutral-100 hover:bg-neutral-100/80 rounded-xl px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center transition-colors"
                  />
                }
              >
                {adminUser?.avatar_url ? (
                  <img
                    src={adminUser.avatar_url}
                    alt={adminName}
                    className="h-7 w-7 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold text-[11px] shrink-0">
                    {adminInitials}
                  </div>
                )}
                <div className="grid flex-1 text-left text-xs leading-tight ml-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-neutral-900 dark:text-white text-[11px]">
                    {adminName}
                  </span>
                  <span className="truncate text-[9px] text-neutral-400">
                    {adminEmail}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-3.5 text-neutral-400 shrink-0 group-data-[collapsible=icon]:hidden" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[185px] rounded-xl p-1.5 shadow-lg border border-neutral-200 bg-white"
                side="top"
                align="center"
                sideOffset={8}
              >
                <div className="flex items-center gap-2 px-2 py-2 text-left text-xs">
                  {adminUser?.avatar_url ? (
                    <img
                      src={adminUser.avatar_url}
                      alt={adminName}
                      className="h-7 w-7 rounded-lg object-cover border border-neutral-200 shrink-0"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white font-semibold text-[11px] shrink-0">
                      {adminInitials}
                    </div>
                  )}
                  <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                    <span className="truncate font-semibold text-neutral-900 text-[11px]">{adminName}</span>
                    <span className="truncate text-[9px] text-neutral-400">{adminEmail}</span>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-1 bg-neutral-100" />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push('/admin/settings')}
                    className="text-xs cursor-pointer rounded-lg px-2 py-1.5 hover:bg-neutral-100 flex items-center gap-2 text-neutral-700 font-medium"
                  >
                    <Settings className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Pengaturan Akun</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator className="my-1 bg-neutral-100" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="text-xs text-red-600 cursor-pointer rounded-lg px-2 py-1.5 hover:bg-red-50 focus:bg-red-50 flex items-center gap-2"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-600" />
                  <span>{isLoggingOut ? 'Mengeluarkan...' : 'Keluar'}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

