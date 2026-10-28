import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return {
      // قبل أي مسار آخر: الصفحة الجذر تقدّم تطبيق ضمين (ملف ثابت كامل مكتفٍ)
      beforeFiles: [{ source: "/", destination: "/dameen.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
