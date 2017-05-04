'use strict'

let url = require('url')
let env = process.env
const argv = require('yargs').argv

module.exports = {
  alwaysHttps: (argv.alwaysHttps || env.NPM_REGISTER_ALWAYS_HTTPS === 'true'),
  port: env.PORT || 3000,
  production: !!['production', 'staging'].find(e => e === env.NODE_ENV),
  timeout: parseInt(env.TIMEOUT) || 10000,
  uplink: url.parse(env.UPLINK || 'https://registry.npmjs.org'),
  redis: env.REDIS_URL,
  cloudfrontHost: env.CLOUDFRONT_HOST,
  cache: {
    packageTTL: parseInt(env.CACHE_PACKAGE_TTL) || 60,
    tarballTTL: parseInt(env.CACHE_TARBALL_TTL) || (6 * 60 * 60)
  },
  fs: {directory: env.NPM_REGISTER_FS_DIRECTORY || 'tmp'},
  s3: {
    bucket: env.AWS_S3_BUCKET,
    region: env.AWS_DEFAULT_REGION
  },
  auth: {
    write: (env.NPM_REGISTER_AUTH_WRITE || 'true') === 'true',
    read: (env.NPM_REGISTER_AUTH_READ || 'false') === 'true'
  },
  httpProxyHost: env.HTTP_PROXY_HOST,
  httpProxyPort: env.HTTP_PROXY_PORT,
  httpProxyAuth: env.HTTP_PROXY_AUTH
}

let storageType = ((env.NPM_REGISTER_STORAGE && env.NPM_REGISTER_STORAGE.toLowerCase()) || 'fs')
let Storage = require('./lib/storage/' + storageType)
module.exports.storage = new Storage()
