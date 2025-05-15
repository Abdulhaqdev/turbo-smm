import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const nextConfig = {};

export default withNextIntl(nextConfig);