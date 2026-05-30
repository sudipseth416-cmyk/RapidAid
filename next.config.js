/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/citizen", destination: "/citizen/index.html" },
        { source: "/citizen/", destination: "/citizen/index.html" },
        { source: "/ambulance", destination: "/ambulance/index.html" },
        { source: "/ambulance/", destination: "/ambulance/index.html" },
      ],
    };
  },
};

module.exports = nextConfig;
