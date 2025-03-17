const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

module.exports = {
  siteUrl: BASE_URL,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/server-sitemap.xml"], 
  robotsTxtOptions: {
    additionalSitemaps: [`${BASE_URL}/server-sitemap.xml`],
  },
};
