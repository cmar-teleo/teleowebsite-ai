/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: the site deploys as plain files (Cloudflare Pages, S3, any static host).
  output: 'export',
  images: { unoptimized: true },
  reactStrictMode: true,
}
export default nextConfig
