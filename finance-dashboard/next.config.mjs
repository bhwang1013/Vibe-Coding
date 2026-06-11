/**
 * GITHUB_PAGES=true is set by the deploy workflow so the app is served
 * from https://bhwang1013.github.io/Vibe-Coding/dashboard/
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/Vibe-Coding/dashboard" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

export default nextConfig;
