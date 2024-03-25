/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    // add the following snippet
    compiler: {
      styledComponents: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "picsum.photos",
        }
      ]
    }
  };

export default nextConfig;
