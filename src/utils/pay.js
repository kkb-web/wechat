// 
import { routeUrl, getToken,isPcDingTalkWS } from "../assets/js/filter"
import { Toast } from "we-vue"
import { _AP } from "../assets/js/urlencode"
import {
  urlPay,
  groupPayorder
} from "../api/api"
let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")

export const unityPaycommon = (type,_that) => {
  debugger
  let isType
  switch (type) {
    case "ALIPAY":
      isType = 0
      break
    case "WECHAT":
      isType = 1
      break
    case "LOAN":
      isType = 2
      break
    case "TENCENT":
      isType = 3
      break
    case "NETEASE":
      isType = 4
      break
    case "CHEESE": // 信用卡分期
      isType = 5
      break
    case "KKB_ICBC":
      isType = 6
      break
    case "ALIPAY_OFFLINE":
      isType = 7
      break
    case "CREDIT_CARD_INSTALMENT": // 芝士分期
      isType = 9
      break
    case "WECHAT_OFFLINE":
      isType = 8
      break
    case "WECHAT_MWEB":
      isType = 13
      break
    case "JDPAY":
      isType = 16
      break
    default:
      isType = 0
  }

  let paytype = {
    0: "ALIPAY",
    1: "WECHAT",
    2: "LOAN",
    3: "TENCENT",
    4: "NETEASE",
    5: "CHEESE",
    6: "KKB_ICBC",
    7: "ALIPAY_OFFLINE",
    9: "CREDIT_CARD_INSTALMENT",
    8: "WECHAT_OFFLINE",
    13: "WECHAT_MWEB",
    16: "JDPAY"
  }

  let sendData = {
    openid: getToken("openid"),
    orderNo: _that.orderNo,
    payType: isType,
  }

  if (_that.channelParams && _that.channelParams !== "undefined") {
    try {
      let channel = JSON.parse(decodeURIComponent(_that.channelParams))
      gio("track", "Data_small_buyclass", {
        Data_enroll_small_type: channel.utm_source,
        Data_buy_small_url: channel.utm_content,
        Data_user_small_phone: _that.registForm.phoneNumber,
        Data_click_small_class_ID: _that.courseCode,
        Data_buy_small_type: paytype[isType],
        // coursecode
        Data_buy_small_orderCode: _that.orderNo,
      })
    } catch (e) {
      console.log(e)
    }
  }


  if (isType === 0) {
    aliPay(isType,_that)
  } else if (isType === 1) {
    if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
      isType = 13
      sendData.payType = isType
      wxPay(isType,_that)
    } else {
      wxPay(isType,_that)
    }
  } else if (isType === 13) {
    wxPay(isType,_that)
  } else if (isType === 16) {
    jdPay(isType,_that)
  } else {
    stagesPay(isType,_that)
  }
}



// 微信支付
const wxPay = (payType,_that) =>{
  debugger
  let wxPayParams = {},
    //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
    sendData = {
      openid: getToken("openid"),
      orderNo: _that.orderNo,
      payType: payType,
      // unionid:getToken('unionid')
    }
  //请求获取wxPayParams
  let payRequest;
  if(Number(_that.sell) === 1){
     sendData = {
      openid: getToken("openid"),
      orderNo: _that.orderNo,
      payType: payType,
      unionid:getToken('unionid'),
      parts:_that.parts||"",
      userId:getToken("cacheuserid"),
      endpoint:""
    }
    if (version === -1 && !isPcDingTalkWS()) {
      sendData.endpoint = "PE-H5"
    }
    payRequest = groupPayorder(sendData)
  }else{
    payRequest = urlPay(sendData)
  }

  payRequest
    .then((res) => {
      if (res.data.code == 0) {
        if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
          let flag = location.href.indexOf("?") != -1 ? "&" : "?"
          location.assign(res.data.data.mwebUrl + "&redirect_url=" + encodeURIComponent(location.href + flag + "orderId=" + _that.orderNo))
        } else {
          //获取jsApiParameData
          wxPayParams.appId = res.data.data.appId //公众号名称，由商户传入
          wxPayParams.timeStamp = res.data.data.timeStamp //时间戳，自1970年以来的秒数
          wxPayParams.nonceStr = res.data.data.nonceStr //随机串
          wxPayParams.package = res.data.data.packageValue
          wxPayParams.signType = res.data.data.signType //微信签名方式：
          wxPayParams.paySign = res.data.data.paySign //微信签名
          implementWxPay()
        }
      } else if (res.data.code === 60008) {
        Toast.fail({
          duration: 1000,
          message: "信息不一致，请重新授权",
        })
        // _that.wxAuthor()
      } else {
        Toast.fail({
          duration: 1000,
          message: res.data.msg,
        })
        apiCodeWarn(res)
      }
    })
    .catch((err) => {
      console.log("wxPay", err)
    })

  //H5调起微信支付
  let onBridgeReady = () => {
    WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, async (res) => {
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        // 加类型判断 跳转逻辑-
        const isType3 = await _that.getOrderStatus(_that.orderNo)
        if (!isType3) return
        //成功后跳转到支付成功页面
        if(Number(_that.sell) === 1 && _that.model === 1){
          window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${_that.orderNo}`
        }else{
          window.location.href = `${cashierLink()}paysuccess?orderId=${_that.orderNo}`
        }
      }
    })
  }

  let implementWxPay = () => {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false)
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", onBridgeReady)
        document.attachEvent("onWeixinJSBridgeReady", onBridgeReady)
      }
    } else {
      onBridgeReady()
    }
  }
}



// 京东支付
const jdPay = (payType,_that) => {
  let sendData = {
    openid: getToken("openid"),
    orderNo: _that.orderNo,
    payType: payType,
  }
  let payRequest;
  if(Number(_that.sell) === 1){
    sendData = {
      openid: getToken("openid")||"",
      orderNo: _that.orderNo||"",
      payType: payType,
      unionid:getToken('unionid')||"",
      parts:_that.parts||"",
      userId:getToken("cacheuserid"),
      endpoint:""
    }
    if (version === -1 && !isPcDingTalkWS()) {
      sendData.endpoint = "PE-H5"
    }
    payRequest = groupPayorder(sendData)
  }else{
    payRequest = urlPay(sendData)
  }
  payRequest.then((res) => {
    console.log(res)
    if (res.data.code == 0) {
      if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
        window.location.href = res.data.data.webUrl
      } else {
        top.location.href =
                routeUrl() +
                "jdpay/" +
                _that.orderNo +
                "?orderUrl=" +
                _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                "&openId=" +
                getToken("openid")
      }
    } else {
      Toast.fail({
        duration: 1000,
        message: res.data.msg,
      })
    }
  }) .catch((err) => {
    console.log("jdPay", err)
  })
}

//支付宝支付
const aliPay = (payType,_that) => {
  debugger
  let sendData = {
    openid: getToken("openid"),
    orderNo: _that.orderNo,
    payType: payType,
  }
  let payRequest;
  if(Number(_that.sell) === 1){
      sendData = {
      openid: getToken("openid")||"",
      orderNo: _that.orderNo||"",
      payType: payType,
      unionid:getToken('unionid')||"",
      parts:_that.parts||"",
      userId:getToken("cacheuserid"),
      endpoint:""
    }
    if (version === -1 && !isPcDingTalkWS()) {
      sendData.endpoint = "PE-H5"
    }
    payRequest = groupPayorder(sendData)
  }else{
    payRequest = urlPay(sendData)
  }
  payRequest
  .then((res) => {
    if (res.data.code == 0) {
      top.location.href =
        routeUrl() +
        "alipay/" +
        _that.orderNo +
        "?orderUrl=" +
        _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
        "&openId=" +
        getToken("openid")
    } else {
      Toast.fail({
        duration: 1000,
        message: res.data.msg,
      })
    }
  })
  .catch((err) => {
    console.log("aliPay", err)
  })
}

/*
  * 分期支付
  * 1、payType：9 -- 代表芝士分期；
  * 2、payType：5 -- 代表信用卡分期；
  * */
const stagesPay = (payType,_that) => {
  let sendData = {
    openid: getToken("openid"),
    orderNo: _that.orderNo,
    payType: payType,
  }
  let payRequest;
  if(Number(_that.sell) === 1){
      sendData = {
      openid: getToken("openid")||"",
      orderNo: _that.orderNo||"",
      payType: payType||"",
      unionid:getToken('unionid')||"",
      parts:_that.parts||"",
      userId:getToken("cacheuserid"),
      endpoint:""
    }
    if (version === -1 && !isPcDingTalkWS()) {
      sendData.endpoint = "PE-H5"
    }
    payRequest = groupPayorder(sendData)
  }else{
    payRequest = urlPay(sendData)
  }
  payRequest
    .then((res) => {
      if (res.data.code == 0) {
        top.location.href = res.data.data.payUrl
      } else {
        Toast.fail({
          duration: 1000,
          message: res.data.msg,
        })
      }
    })
    .catch((err) => {
      console.log("stagesPay", err)
    })
}