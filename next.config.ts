import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
