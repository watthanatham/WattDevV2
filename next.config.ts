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

    // Webpack's persistent filesystem cache corrupts under this setup: a build
    // that *restores* a warm cache dies with
    //   TypeError: The "data" argument must be ... Received undefined
    // inside hash.update(). It bites on any second build over a warm cache —
    // locally over .next AND on Vercel once it restores the cache it saved from
    // the previous deploy (the first, cold deploy always passes, hiding it).
    // A cold build always works, so disable the persistent cache for every
    // production build. Costs a few seconds on a ~1min build; buys reliability.
    if (!dev) {
      config.cache = false;
    }

    return config;
  },
};

export default nextConfig;
