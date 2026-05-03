import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,



  // 🚀 Experimental (optional but powerful)
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // ⚡ Turbopack
  turbopack: {
    root: __dirname,
  },

  // 🖼️ Image Optimization (IMPORTANT for Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // 🌍 Security Headers (bonus)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;