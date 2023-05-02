/** @type {import('next').NextConfig} */
const path = require('path');
const nextTranslate = require('next-translate-plugin');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/styles')],
    prependData: `@import "@styles/_variables.scss"; @import "@styles/_mixins.scss";`, // prependData 옵션 추가
  },
  ...nextTranslate(),
}

module.exports = nextConfig
