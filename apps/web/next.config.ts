import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/forecast",
        destination: "/forecast",
        permanent: true,
      },
      {
        source: "/geospatial",
        destination: "/map",
        permanent: true,
      },
      {
        source: "/dashboard/source-map",
        destination: "/source-attribution",
        permanent: true,
      },
      {
        source: "/dashboard/enforcement",
        destination: "/enforcement",
        permanent: true,
      },
      {
        source: "/citizen",
        destination: "/advisory",
        permanent: true,
      },
      {
        source: "/dashboard/advisory",
        destination: "/advisory",
        permanent: true,
      },
      {
        source: "/dashboard/reports",
        destination: "/reports",
        permanent: true,
      },
      {
        source: "/dashboard/simulator",
        destination: "/scenario",
        permanent: true,
      },
      {
        source: "/settings",
        destination: "/dashboard/settings",
        permanent: true,
      },
      {
        source: "/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/auth/register",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
