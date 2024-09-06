/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "htyouocguzgigopxxidt.supabase.co",
      },
      {
        hostname: "permi.b-cdn.net",
      },
    ],
  },
};

module.exports = nextConfig;
