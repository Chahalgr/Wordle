/** @type {import('next').NextConfig} */
// On GitHub Pages the site lives at https://<user>.github.io/<repo>/,
// so the workflow sets PAGES_BASE_PATH=/<repo>. Locally it stays empty.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

module.exports = nextConfig;