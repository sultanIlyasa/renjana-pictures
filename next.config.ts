import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.trycloudflare.com"],
  images: {
    remotePatterns: [new URL("https://cdn.sanity.io/images/**")],
  },
};

export default nextConfig;
