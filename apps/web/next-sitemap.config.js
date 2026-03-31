/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://wedeliverlaundry.com",
  generateRobotsTxt: true,
  exclude: ["/account/*", "/signup", "/login", "/variants/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account/", "/signup", "/login"],
      },
    ],
  },
};
