/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')
const withPlugins = require('next-compose-plugins')

const nextConfig = withPlugins([], {
  assetPrefix: '.',
  reactStrictMode: true,
  webpack(config, { isClient }) {
    if (isClient) {
    }
	},
  ...nextTranslate()
})

module.exports = nextConfig
