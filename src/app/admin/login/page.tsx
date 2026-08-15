'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const loginEmail = customEmail !== undefined ? customEmail : email;
    const loginPassword = customPassword !== undefined ? customPassword : password;

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Harap isi email dan kata sandi.');
      toast.error('Email dan kata sandi wajib diisi');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Email atau kata sandi salah.');
      }

      toast.success('Login berhasil!');
      router.push(redirectTarget);
      router.refresh();
    } catch (err: any) {
      const msg = err.message || 'Terjadi kesalahan saat masuk.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseDemo = () => {
    setEmail('admin@sparke.id');
    setPassword('admin123');
    setErrorMessage(null);
    handleLogin(undefined, 'admin@sparke.id', 'admin123');
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <div className="h-5 w-5 rounded-[4px] border-2 border-[#1a1a1a] flex items-center justify-center">
            <div className="h-1.5 w-1.5 bg-[#1a1a1a] rounded-[1px]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1a1a1a] font-sans">
            Sparke
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
          Masuk Admin
        </h1>
        <p className="text-xs text-neutral-500 mt-1.5">
          Masukkan akun admin Anda untuk mengelola toko.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 leading-relaxed">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => handleLogin(e)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email" className="text-xs font-medium text-neutral-700">
              Email
            </Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@sparke.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="h-10 px-3 text-xs bg-white border-neutral-200 focus:border-neutral-900 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="admin-password" className="text-xs font-medium text-neutral-700">
              Kata Sandi
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="h-10 pl-3 pr-9 text-xs bg-white border-neutral-200 focus:border-neutral-900 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 accent-neutral-900 cursor-pointer"
              />
              <span>Ingat saya</span>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl transition-all cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Memproses...</span>
              </span>
            ) : (
              'Masuk'
            )}
          </Button>
        </form>

        {/* Simple Demo Box */}
        <div className="mt-5 pt-4 border-t border-neutral-100 text-center">
          <p className="text-[11px] text-neutral-500 mb-2">
            Akun demo: <span className="font-mono text-neutral-800">admin@sparke.id</span> / <span className="font-mono text-neutral-800">admin123</span>
          </p>
          <button
            type="button"
            onClick={handleUseDemo}
            disabled={isLoading}
            className="text-xs text-neutral-900 font-semibold underline underline-offset-4 hover:text-neutral-600 transition-colors cursor-pointer"
          >
            Gunakan Akun Demo & Masuk
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#fbfbfb] text-[#222222] flex flex-col justify-between p-4 sm:p-8 font-sans antialiased selection:bg-neutral-800 selection:text-white">
      <div className="flex-1 flex items-center justify-center py-8">
        <Suspense
          fallback={
            <div className="w-full max-w-sm mx-auto p-8 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      <footer className="text-center text-xs text-neutral-400 py-2">
        &copy; {new Date().getFullYear()} Sparke.
      </footer>
    </div>
  );
}
