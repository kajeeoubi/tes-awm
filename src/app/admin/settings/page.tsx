import React from 'react';
import { AccountSettingsView } from '@/components/admin/settings/account-settings-view';

export const metadata = {
  title: 'Pengaturan Akun — Sparke Admin',
};

export default function AdminSettingsPage() {
  return <AccountSettingsView />;
}
