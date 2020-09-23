import {SmeiFengkong} from "../../api/api"
// 1.初始化SDK
export const initSdk = () => {
  window._smReadyFuncs = [];
  window.SMSdk = {
    ready: function (fn) {
      fn && _smReadyFuncs.push(fn);
    }
  };
  // 1. 通用配置项
  window._smConf = {
    organization: '6w1xbDw6RaaNwWC93o06',   //必填，组织标识，邮件中organization项
    staticHost: `static.fengkongcloud.com`  //必填, 设置JS-SDK文件域名
  };
  var url = (function () {
    var originHost = "static2.fengkongcloud.com";
    var isHttps = 'https:' === document.location.protocol;
    var protocol = isHttps ? 'https://' : 'http://';
    var fpJsPath = '/fpv2.js';
    var url = protocol + _smConf.staticHost + fpJsPath;
    var ua = navigator.userAgent.toLowerCase();
    var isWinXP = /windows\s(?:nt\s5.1)|(?:xp)/.test(ua);
    var isLowIE = /msie\s[678]\.0/.test(ua);

    if (isHttps && isWinXP && isLowIE) {
      url = protocol + originHost + fpJsPath;
    }

    return url;
  })()
  var sm = document.createElement("script");
  var s = document.getElementsByTagName("script")[0];
  sm.src = url;
  s.parentNode.insertBefore(sm, s);
}

// 2.使用设备标识
export const dealSmDeviceId = (userId,mobile,pageUrl,eventId="login",cb) => {
  var smTimeoutTime = 500;
  var smDeviceId = "";
  var smDeviceIdReady = false;
  var smTimer = setTimeout(function(){
    smDeviceId = SMSdk.getDeviceId ? SMSdk.getDeviceId() : smDeviceId;
    if(!smDeviceIdReady) {
        smDeviceIdReady = true;
        //执行业务逻辑
        cb && cb(smDeviceId);
    }
  }, smTimeoutTime);
  SMSdk.ready(function(){
    smDeviceId = SMSdk.getDeviceId ? SMSdk.getDeviceId() : smDeviceId;
    clearTimeout(smTimer);
    console.log("smDeviceId:"+smDeviceId)
    if(!smDeviceIdReady) {
        smDeviceIdReady = true;
        //执行业务逻辑
        cb && cb(userId,mobile,pageUrl,eventId,smDeviceId);
    }
  });
}

export const shumeiSdk = (userId,mobile,pageUrl,eventId,deviceId) =>{
  let smData = {
    userId,
    mobile,
    pageUrl,
    eventId,
    deviceId,
  }
  SmeiFengkong(smData).then(res=>{
    console.log(res)
  })
}