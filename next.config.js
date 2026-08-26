/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';

  connect-src 'self'
    https://github.com
    https://api.github.com
    https://github.com/login/oauth
    https://accounts.google.com
    https://oauth2.googleapis.com;

  script-src 'self'
    'unsafe-inline'
    ${isDev ? "'unsafe-eval'" : ""}
    https://cdn.jsdelivr.net;

  worker-src 'self' blob:;

  style-src 'self' 'unsafe-inline';

  img-src 'self'
    https://authjs.dev
    https://github.com
    https://api.github.com
    https://accounts.google.com
    https://res.cloudinary.com
    blob:
    data:;

  font-src 'self';

  object-src 'none';

  base-uri 'self';

  form-action 'self'
    https://github.com
    https://api.github.com
    https://github.com/login/oauth
    https://accounts.google.com
    https://oauth2.googleapis.com;

  frame-src 'self' https://www.youtube.com;
  frame-ancestors 'none';

  upgrade-insecure-requests;
`;
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://blocksy-news.vercel.app",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
