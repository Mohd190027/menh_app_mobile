import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ضمين — تسوّق مضمون بثقة",
  description:
    "منصة التسوق السعودية بضمان الإسكرو: مبلغك محجوز في خزنة ضمين حتى استلامك ورضاك — أربعة عوالم: الأزياء والمأكولات والهدايا والألعاب.",
  keywords: ["ضمين", "إسكرو", "تسوق مضمون", "حجز المبلغ", "السعودية"],
  openGraph: {
    title: "ضمين — تسوّق مضمون بثقة",
    description: "مالك محجوز حتى ترضى — تسوق بضمان الإسكرو في أربعة عوالم.",
    siteName: "ضمين",
    type: "website",
    locale: "ar_SA",
  },
};

export const viewport: Viewport = {
  themeColor: "#1D4432",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* نفس ملف CSS الأصلي حرفياً — يضمن تطابق التصميم بالضبط */}
        <link rel="stylesheet" href="/dameen/dameen.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
