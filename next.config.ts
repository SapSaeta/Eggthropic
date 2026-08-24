import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async redirects() {
    return [
      {
        source: "/lab",
        destination: "/experiments",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
