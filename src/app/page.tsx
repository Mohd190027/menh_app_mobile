'use client';
/**
 * ضمين — React حقيقي بنفس التصميم بالضبط.
 * كل واجهة ضمين الآن مكوّنات React (src/dameen/*) — بنفس البنية والفئات والنصوص
 * ونفس CSS الأصلي (public/dameen/dameen.css) ونفس مفتاح الحفظ dameen_v1.
 * التطبيق الأصلي يبقى متاحاً للمقارنة على /dameen.html.
 */
import dynamic from 'next/dynamic';

const DameenApp = dynamic(() => import('../dameen/app'), { ssr: false });

export default function Home() {
  return <DameenApp />;
}
