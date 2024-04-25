const config = {
  publicRuntimeConfig: {
    // Will be available on both server and client
    BASE_API_URL: process.env.BASE_API_URL,
  },
  images: {
    domains: ['media.guim.co.uk', 'localhost', 'yoursite.com', 'api.yoursite.com',],
  },
};

module.exports = config;
