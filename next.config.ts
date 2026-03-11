// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//     eslint: {
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "1337",
//         pathname: "/uploads/**", // ✅ Fix: added slash and corrected wildcard
//       },
//        {
//         protocol: "http",
//         hostname: "127.0.0.1",
//         port:"3000",
//         pathname: "/uploads/**",
//       },
//     ],
//   },
// };

// export default nextConfig;



import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "5.77.39.26",
        port: "1337",
        pathname: "/uploads/**", // ✅ Fix: added slash and corrected wildcard
      },
       {
        protocol: "https",
        hostname: "cmtprooptiki.gr",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
