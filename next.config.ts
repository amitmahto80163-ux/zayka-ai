import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Production Build Optimization ────────────────────────────
  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Server-only packages (Firebase Admin, gRPC) ──────────────
  // These must NOT be bundled into the browser/client bundle
  serverExternalPackages: [
    'firebase-admin',
    '@google-cloud/firestore',
    '@google-cloud/firestore-api',
    'google-gax',
    'google-auth-library',
    '@grpc/grpc-js',
    '@grpc/proto-loader',
    'grpc',
  ],

  // ── Image optimization ───────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'thumb.wikimedia.org' },
      { protocol: 'https', hostname: 'image.pollinations.ai' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'source.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
