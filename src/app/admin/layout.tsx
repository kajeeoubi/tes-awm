import React from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/admin/layout/app-sidebar';
import { AdminTopbarTitle } from '@/components/admin/layout/admin-topbar-title';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
