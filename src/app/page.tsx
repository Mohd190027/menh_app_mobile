'use client';

import { useSyncExternalStore } from 'react';
import DameenApp from '@/components/dameen/app';

const emptySubscribe = () => () => {};

export default function Home() {
  // بوابة الترطيب: تمنع أي عدم تطابق SSR/CSR مع شاشة انتقال بصرية
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand gap-3">
        <div className="w-20 h-20 rounded-3xl bg-gold/15 border border-gold/40 flex items-center justify-center text-4xl animate-pulse">
          🛡️
        </div>
        <div className="text-cream font-extrabold text-3xl tracking-tight">ضمين</div>
        <div className="text-cream/50 text-sm">تسوّق مضمون بثقة…</div>
      </div>
    );
  }
  return <DameenApp />;
}
