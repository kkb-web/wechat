import { getEnv } from './env'

export const invokeApp = (dataObj, defaultValue = '') =>{
  try {
    if (getEnv() !== 'dev') {
      let jsonObj = JSON.stringify(dataObj);
      let result = window.prompt(jsonObj, defaultValue);
      return JSON.parse(result);
    }
  } catch (err) {
    console.log(invokeApp, 'invokeApp_error');
  }
  return {};
}

/**
 * 获取accessToken
 * @return accessToken
 */
export const getAccessToken = () => {
  let dataObj = {
    business: 'kaikeba',
    action: 'getAccessToken',
  };
  let accessTokenInfo = invokeApp(dataObj);
  return accessTokenInfo.accessToken || '';
};

/**
 * 打开NA端新webview
 * @param {*} webUrl
 * @return null
 */
export const openNAWebUrl = webUrl => {
  let dataObj = {
    business: 'kaikeba',
    action: 'openNAWebUrl',
    body: {
      url: webUrl,
    },
  };
  invokeApp(dataObj);
};

/**
 * 关闭当前webView
 * @return null
 */
export const closeWebView = () => {
  let dataObj = {
    business: 'kaikeba',
    action: 'closeView',
  };
  return invokeApp(dataObj);
};

/**
 * native是否登录态
 * @param {*} webUrl
 * @return {"isLogin":1} 1-已经登录,0-未登录
 */
export const isLoginApp = () => {
  let dataObj = {
    business: 'kaikeba',
    action: 'isLogin',
  };
  let res = invokeApp(dataObj);
  if(res && res.isLogin && res.isLogin){
    return res.isLogin === 1 ? true : false;
  }
  // return res && res?.isLogin && res?.isLogin === 1 ? true : false;
};

/**
 * 打开系统浏览器
 * @param {*} webUrl
 * @return null
 */
export const openPhoneWebView = webUrl => {
  let dataObj = {
    business: 'kaikeba',
    action: 'openPhoneWebView',
    body: {
      url: webUrl,
    },
  };
  return invokeApp(dataObj);
};


/**
 * 调起 native 登录
 * @return {"loginState":1,"accessToken":"xxxx"}
 * loginState 1-登录成功，0-登录失败,当登录失败时没有 accessToken
 */
export const goLogin = () => {
  let dataObj = {
    business: 'kaikeba',
    action: 'login',
  };
  return invokeApp(dataObj);
};

/**
 * 调起native课程支付
 * @return { "payState":1,"msg":"支付成功"}
 * payState 1-支付成功,0-支付失败
 */
export const payCourse = bodyObj => {
  let dataObj = {
    business: 'kaikeba',
    action: 'coursePay',
    body: bodyObj,
  };
  return invokeApp(dataObj);
};

/**
 * 通知APP端,H5页面加载完成
 */
export const pageFinished = () => {
  let dataObj = {
    business: 'kaikeba',
    action: 'onPageFinished',
  };
  return invokeApp(dataObj);
};


/**
 * 提示
 * @param {*} bodyObj
 */
export const showToast = msg => {
  let dataObj = {
    business: 'kaikeba',
    action: 'showToast',
    body: {
      showMsg: msg,
    },
  };
  return invokeApp(dataObj);
};

/**
 * app请求公用头部
 */
export const getCommonAppHeader = () => {
  let accessToken = getAccessToken();
  return accessToken
};