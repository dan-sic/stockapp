import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../"),
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
