import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Webpack's default `xxhash64` is WebAssembly-backed. On machines where a
    // Windows Application Control policy blocks Next.js' native bindings, that
    // WASM module fails to instantiate and the build dies inside WasmHash.
    // Node's crypto-backed sha256 avoids WASM entirely.
    config.output.hashFunction = "sha256";

    // On that same WASM fallback path, webpack's persistent filesystem cache
    // deserialises entries with undefined content, so a *second* production
    // build over a warm .next dies in hash.update(). A clean build always
    // works, so skip the cache for local prod builds. Vercel builds on Linux
    // with working native bindings, so it keeps full caching.
    if (!dev && !process.env.VERCEL) {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
