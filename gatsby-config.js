const siteConfig = require('./config/site');
const buildInfo = require('./config/build-info');

module.exports = {
  siteMetadata: {
    title: siteConfig.title,
    description: siteConfig.description,
    pwaShortName: siteConfig.pwaShortName,
    buildInfo: {
      commit: buildInfo.commit,
      version: buildInfo.version,
    },
  },
  plugins: [
    'gatsby-plugin-typescript',
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/theme/typography.ts',
      },
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          '/*': [
            "Content-Security-Policy: default-src 'self' https://fonts.googleapis.com; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; img-src data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; worker-src 'self'; object-src 'none'",
            'Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=()',
            'Referrer-Policy: no-referrer-when-downgrade',
            'Expect-CT: enforce, max-age=3600',
          ],
        },
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    'gatsby-plugin-use-dark-mode',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: siteConfig.title,
        short_name: siteConfig.pwaShortName,
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#1c304a',
        display: 'standalone',
        icon: 'src/images/icon.png',
      },
    },
    'gatsby-plugin-offline',
  ],
  flags: {
    FAST_DEV: true,
    PRESERVE_WEBPACK_CACHE: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
};
