import { findKey } from './index'

// 分销
const DISTRIBUTION = {
  dev:'/distriapi',
  test:'https://opentest.kaikeba.com/mos',
  pre:'https://openpre.kaikeba.com/mos',
  prod:'https://open2.kaikeba.com/mos'
}
const env = ['wxtest', 'wxpre', 'wx.', 'wxdev']
const envObj = {
  prod: 'wx.',
  test: 'wxtest',
  pre: 'wxpre',
  dev: 'wxdev',
  dev2: 'wxdev2'
}

const { hostname } = window.location

// 判断当前是哪个环境
export const isDevEnv =
  hostname.indexOf(envObj.dev) === 0 || hostname === 'localhost'

export const isPreEnv = hostname.indexOf(envObj.pre) === 0

export const isTestEnv = hostname.indexOf(envObj.test) === 0

export const isProdEnv =
  process.env.NODE_ENV === 'production' && hostname.indexOf(envObj.prod) === 0

// 获取当前域名的前缀
export const getDomainPrefix = () => {
  if (isDevEnv) return envObj.dev
  let prefix = env.find(item => {
    if (hostname.indexOf(item) === 0) return item
  })
  return prefix || 'wxtest'
}

// 当前api的前缀
export const getApiPrefix = () => {
  if (isDevEnv) return 'dev-'
  // if (isDevEnv) return 'test-'
  if (isTestEnv) return 'test-'
  if (isPreEnv) return 'pre-'
  return ''
}
// api的请求头 http or https
export const getApiHttp = () => {
  if (isDevEnv) return 'http'
  if (isTestEnv) return 'http'
  if (isPreEnv) return 'https'
  return 'https'
}

// 获取当前环境
export const getEnv = () => {
  let prefix = getDomainPrefix()
  return findKey(envObj)(prefix)
  // return prefix || 'prod'
}


// 分销
export const distributionUrl = ()=>{
  if (isDevEnv) return DISTRIBUTION.dev
  if (isTestEnv) return DISTRIBUTION.test
  if (isPreEnv) return DISTRIBUTION.pre
  return DISTRIBUTION.prod
}
