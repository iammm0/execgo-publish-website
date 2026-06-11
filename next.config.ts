import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/docs/execgo/:branch/zh",
        destination: "/docs/execgo/:branch/en",
        permanent: true,
      },
      {
        source: "/docs/execgo/:branch/zh/:slug*",
        destination: "/docs/execgo/:branch/en/:slug*",
        permanent: true,
      },
      {
        source: "/docs/runtime/zh",
        destination: "/docs/runtime/en",
        permanent: true,
      },
      {
        source: "/docs/runtime/zh/:slug*",
        destination: "/docs/runtime/en/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
