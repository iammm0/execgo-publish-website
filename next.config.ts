import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/docs/main/:path*",
        destination: "/docs/execgo",
        permanent: false,
      },
      {
        source: "/docs/feat-add-adapter/:path*",
        destination: "/docs/execgo",
        permanent: false,
      },
      {
        source: "/docs/release-agent-adapter-runtime/:path*",
        destination: "/docs/execgo",
        permanent: false,
      },
      {
        source: "/docs/feat-add-cluster/:path*",
        destination: "/docs/ecosystem/versioning",
        permanent: false,
      },
      {
        source: "/docs/preview-distributed-runtime/:path*",
        destination: "/docs/ecosystem/versioning",
        permanent: false,
      },
      {
        source: "/docs/execgo/release-agent-adapter-runtime/:path*",
        destination: "/docs/execgo",
        permanent: false,
      },
      {
        source: "/docs/execgo/preview-distributed-runtime/:path*",
        destination: "/docs/ecosystem/versioning",
        permanent: false,
      },
      {
        source: "/docs/execgo/agent-adapter",
        destination: "/docs/execgo/integration/agent-adapter",
        permanent: false,
      },
      {
        source: "/docs/execgo/runtime-integration",
        destination: "/docs/ecosystem/execgo-and-runtime",
        permanent: false,
      },
      {
        source: "/docs/execgo/task-dsl",
        destination: "/docs/execgo/reference/task-dsl",
        permanent: false,
      },
      {
        source: "/docs/runtime/operations",
        destination: "/docs/runtime/deployment",
        permanent: false,
      },
      {
        source: "/docs/runtime/en/:path*",
        destination: "/docs/runtime/:path*",
        permanent: false,
      },
      {
        source: "/docs/runtime/zh/:path*",
        destination: "/docs/runtime",
        permanent: false,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
