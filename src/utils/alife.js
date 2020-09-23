import BrowserLogger from 'alife-logger';
import { getEnv } from "./env"
const alifeEnv = {
  dev: 'local',
  local: 'dev',
  test: 'daily',
  pre: 'pre',
  prod: 'prod',
};

BrowserLogger.singleton({
  pid: "hpn9ac29kz@f6554cb0d247a70",
  appType: "web",
  environment: alifeEnv[getEnv()],
  imgUrl: "https://arms-retcode.aliyuncs.com/r.png?",
  sendResource: true,
  enableLinkTrace: true,
  behavior: true,
  enableSPA: true,
  useFmp: true,
  ignore: {
    ignoreApis: [
      /.*api.growingio.com.+/, // 正则表达式
      /.*hky-sdk.kaikeba.com.+/, // 正则表达式
      /.*hm.baidu.com.+/, // 正则表达式
      /.*53kf.com.+/, // 正则表达式
      /.*oneapm.com.+/, // 正则表达式
      /.*kuick.cn.+/, // 正则表达式
    ],
  },
  enableConsole: true,
});
