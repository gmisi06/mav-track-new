import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A régi Vite kliens StrictMode-ot használt, azt a Root komponens kezeli.
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: false },
};

export default nextConfig;
