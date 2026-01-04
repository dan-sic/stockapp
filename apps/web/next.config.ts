import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/notifications",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
