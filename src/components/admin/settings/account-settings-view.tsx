'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Shield, Lock, Image as ImageIcon, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { AdminUser } from '@/types/ecommerce';

export function AccountSettingsView() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetch('/api/admin/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setAdminUser(data.user);
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setAvatarUrl(data.user.avatar_url || '');
        }
      })
      .catch(() => {
        toast.error('Gagal memuat informasi akun');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Nama lengkap wajib diisi.');
      return;
    }

    if (!email.trim()) {
      toast.error('Alamat email wajib diisi.');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        toast.error('Masukkan kata sandi saat ini untuk melakukan penggantian kata sandi.');
        return;
      }
      if (newPassword.length < 6) {
        toast.error('Kata sandi baru minimal harus 6 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Konfirmasi kata sandi baru tidak sesuai.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        email: email.trim(),
        avatar_url: avatarUrl.trim() || null,
      };

      if (newPassword) {
        payload.current_password = currentPassword;
        payload.new_password = newPassword;
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal memperbarui profil');
      }

      setAdminUser(result.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Dispatch event to update sidebar and header immediately
      window.dispatchEvent(new CustomEvent('sparke:admin-profile-updated', { detail: result.user }));

      toast.success('Pengaturan Akun Disimpan', {
        description: 'Informasi profil dan keamanan administrator berhasil diperbarui.',
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Gagal menyimpan perubahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const adminInitials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'AP';

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 max-w-4xl animate-pulse">
        <div className="h-8 w-48 bg-neutral-100 rounded-lg" />
        <div className="h-64 bg-neutral-100 rounded-2xl" />
        <div className="h-48 bg-neutral-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Pengaturan Akun
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal">
            Kelola profil administrator, alamat email login, dan keamanan kata sandi.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
            <User className="h-4 w-4 text-neutral-400" />
            <span>Informasi Identitas Profil</span>
          </h3>

          {/* Avatar Preview Section */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50/70 border border-neutral-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="h-14 w-14 rounded-2xl object-cover border border-neutral-200 shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-white font-bold text-base shadow-xs shrink-0">
                {adminInitials}
              </div>
            )}
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1a1a1a] truncate">{name || 'Nama Administrator'}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                  <Shield className="h-2.5 w-2.5" />
                  {adminUser?.role || 'Superadmin'}
                </span>
              </div>
              <p className="text-xs text-neutral-500 truncate">{email || 'email@sparke.id'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="admin_name" className="text-xs font-semibold">
                Nama Lengkap Administrator <span className="text-destructive">*</span>
              </Label>
              <Input
                id="admin_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan Nama Lengkap"
                required
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="admin_email" className="text-xs font-semibold flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                <span>Alamat Email Login <span className="text-destructive">*</span></span>
              </Label>
              <Input
                id="admin_email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sparke.id"
                required
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-1.5">
              <Label htmlFor="avatar_url" className="text-xs font-semibold flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-neutral-400" />
                <span>URL Foto Avatar (Opsional)</span>
              </Label>
              <Input
                id="avatar_url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>
          </div>
        </Card>

        {/* Security & Password Card */}
        <Card className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold tracking-tight text-[#1a1a1a] flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-neutral-400" />
              <span>Keamanan & Perubahan Kata Sandi</span>
            </h3>
            <p className="text-[11px] text-neutral-400 font-normal">
              Biarkan bidang di bawah ini kosong jika Anda tidak berencana mengganti kata sandi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Password */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="current_password" className="text-xs font-semibold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-neutral-400" />
                <span>Kata Sandi Saat Ini</span>
              </Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama Anda"
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new_password" className="text-xs font-semibold">
                Kata Sandi Baru
              </Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-xs font-semibold">
                Konfirmasi Kata Sandi Baru
              </Label>
              <Input
                id="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="h-10 rounded-xl text-xs bg-neutral-50/50 font-normal"
              />
            </div>
          </div>
        </Card>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
            className="h-10 rounded-full text-xs font-semibold px-5 cursor-pointer"
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-semibold px-6 shadow-xs cursor-pointer"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </div>
  );
}
