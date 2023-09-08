const nextra = require('nextra');

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.js',
  unstable_stork: false,
  unstable_contentDump: true,
});

module.exports = withNextra({
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
  },
  redirects: () => {
    return [
      {
        source: '/docs',
        destination: '/docs/getting-started',
        statusCode: 301,
      },
    ];
  },
});
