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
  async redirects() {
    return [
      {
        source: '/system-level-transformation',
        destination: '/about-us/system-level-transformation',
        permanent: true,
      },
      {
  source: '/project-with-real-societal-impact',
  destination: '/about-us/project-with-real-societal-impact',
  permanent: true,
},
     {
  source: '/sustainable-and-long-term-change',
  destination: '/about-us/sustainable-and-long-term-change',
  permanent: true,
},


  {
  source: '/health-policy-and-consulting',
  destination: '/services/health-policy-and-consulting',
  permanent: true,
},


  {
  source: '/strategic-planning-and-development',
  destination: '/services/strategic-planning-and-development',
  permanent: true,
},
{
  source: '/project-design-and-management-eu-and-national',
  destination: '/services/project-design-and-management-eu-and-national',
  permanent: true,
},

{
  source: '/capacity-building-and-methodology-support',
  destination: '/services/capacity-building-and-methodology-support',
  permanent: true,
},
  {
  source: '/feasibility-and-service-design-studies',
  destination: '/services/feasibility-and-service-design-studies',
  permanent: true,
},
{
  source: '/digital-solutions-and-innovation',
  destination: '/services/digital-solutions-and-innovation',
  permanent: true,
},
    ];
  },
};

export default nextConfig;
