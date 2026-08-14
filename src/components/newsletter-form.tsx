'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Silakan masukkan alamat email Anda.');
      return;
    }
    toast.success('Terima kasih telah berlangganan info promo Sparke!');
    setEmail('');
    setAgreed(false);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2 space-y-3">
      <input
        type="email"
        placeholder="Masukkan alamat email Anda *"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full bg-transparent border-b border-neutral-600 pb-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
      />
      <div className="flex items-center gap-2 text-[11px] text-neutral-400">
        <input
          type="checkbox"
          id="newsletter-check"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="rounded cursor-pointer"
        />
        <label htmlFor="newsletter-check" className="cursor-pointer">
          Ya, kirimkan info promo & update produk terbaru
        </label>
      </div>
      <button
        type="submit"
        className="rounded-full bg-white px-7 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-100 active:scale-98 transition-all"
      >
        Berlangganan
      </button>
    </form>
  );
}
