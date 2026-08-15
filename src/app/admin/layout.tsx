'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/layout/app-sidebar';
import { AdminTopbarTitle } from '@/components/admin/layout/admin-topbar-title';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname?.startsWith('/admin/login');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAuthPage) {
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;

    fetch('/api/admin/auth/me')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data?.authenticated) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            const redirectUrl =
              pathname && pathname !== '/admin'
                ? `/admin/login?redirect=${encodeURIComponent(pathname)}`
                : '/admin/login';
            router.replace(redirectUrl);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
          const redirectUrl =
            pathname && pathname !== '/admin'
              ? `/admin/login?redirect=${encodeURIComponent(pathname)}`
              : '/admin/login';
          router.replace(redirectUrl);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pathname, isAuthPage, router]);

  // If on login page, render children directly
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If checking authentication, render elegant loading screen
  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-lg border-2 border-foreground flex items-center justify-center">
            <div className="h-2 w-2 bg-foreground rounded-[2px]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground font-sans">
            Sparke Admin
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <Loader2 className="h-4 w-4 animate-spin text-neutral-700" />
          <span>Memverifikasi hak akses admin...</span>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      defaultOpen={true}
      style={
        {
          "--sidebar-width": "10.5rem",
          "--sidebar-width-icon": "3.5rem",
        } as React.CSSProperties
      }
    >
      <div className="flex min-h-screen w-full bg-white text-[#222222] font-sans antialiased selection:bg-neutral-800 selection:text-white">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col bg-white">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b border-neutral-200/80 bg-white px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="-ml-1 text-neutral-500 hover:text-[#1a1a1a]" />
              <div className="h-4 w-[1px] bg-neutral-200 shrink-0" />
              <AdminTopbarTitle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
