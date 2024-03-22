/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    productionBrowserSourceMaps: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    env: {
        BASE_URL: process.env.BASE_URL,
    },
};

module.exports = nextConfig;
