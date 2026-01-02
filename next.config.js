/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingIncludes: {
    "**/*": ["node_modules/.prisma/**", "node_modules/@prisma/client/**"],
  },
};

module.exports = nextConfig;
