import Vue from "vue"
import axios from "axios"
import { Toast } from "we-vue"
import { baseUrl, getToken, payLogUrl, projectEnv, statyPassPortApi, apiWarn } from "../assets/js/filter"
import { getEnv,distributionUrl } from '../utils/env'
import { getCommonAppHeader } from "../utils/appAgreement"
import errorModal429 from '../utils/errorModal429'
import qs from "qs"
errorModal429.install(Vue)

Vue.prototype.$axios = axios

axios.defaults.headers.common["Content-Type"] = "application/json"
// 超时时间
axios.defaults.timeout = 20000
//axios管理请求头统一处理
axios.interceptors.request.use(
  (config) => {
    // 这里写死一个token，需要在这里取到设置好的token的值
    const token = localStorage.getItem("token")
    if (token) {
      // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
      config.headers.Authorization = "Bearer " + token
    }
    // apm.entryQueue(config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
//axios管理返回错误数据统一处理
axios.interceptors.response.use(
  (response) => {
    if(response.status == 429){
      Vue.prototype.$errorModal429({modalShow:true});
      return
    }
    // apm.exitQueue({
    //     project:'wx',
    //     env:projectEnv(),
    //     api:response.config.url,
    //     type:0 // 接口是否超时 0 正常，1超时
    // })
    return response
  },
  (err) => {

    if(err.response && err.response.status === 429){
      Vue.prototype.$errorModal429({modalShow:true});
      return
    }
    if (err.response.request.responseURL) {
      if (payLogUrl.includes(err.response.request.responseURL)) {
        return
      }
    }
    // apm.apiWarn({
    //     project: 'wx',
    //     env: projectEnv(),
    //     api: err.response.request.responseURL,
    //     response: JSON.stringify(err.response),
    //     notice_id: 'fe'
    // })
    if(getEnv() === "prod"){
      apiWarn({
        project: "wx",
        env: projectEnv(),
        api: err.response.request.responseURL,
        notice: true,
        content: {
          method: err.response.config.method,
          status: err.response.status,
          request: err.response.config.method === "post" ? err.response.config.data : "",
          response: err.response.data,
        },
      })
    }

    if (
      err.response.status === 502 ||
      err.response.status === 500 ||
      err.response.status === 401 ||
      err.response.status === 400 ||
      err.message.includes("timeout")
    ) {
      Toast.fail({
        duration: 1000,
        message: "服务器错误，请稍后再试！",
      })
    }
    return Promise.reject(err)
  }
)
let distributionURL = distributionUrl()
let baseURL = ""
let learnApi = ""
let mobileLogonUrl = ""
if (process.env.NODE_ENV === "development" || window.location.href.indexOf("wxtest") !== -1) {
  baseURL = "/opencourseapi"
  learnApi = "https://opentest.kaikeba.com"
  mobileLogonUrl = "http://test-inner-api-passport.kaikeba.com"
} else {
  if (window.location.href.indexOf("wxpre") !== -1) {
    console.log("pre环境")
    baseURL = "/api"
    learnApi = "https://openpre.kaikeba.com"
    mobileLogonUrl = "http://test-inner-api-passport.kaikeba.com"
  }else if (window.location.href.indexOf('wxdev2') !== -1) {
    console.log('dev2环境');
    baseURL = '/opencourseapi';
    mobileLogonUrl='http://test-inner-api-passport.kaikeba.com'
  }else if (window.location.href.indexOf('wxdev') !== -1) {
    console.log('dev环境');
    baseURL = '/opencourseapi';
    mobileLogonUrl='http://test-inner-api-passport.kaikeba.com'
  } else {
    console.log("正式环境")
    learnApi = "https://open2.kaikeba.com"
    baseURL = "/opencourseapi"
    mobileLogonUrl = "http://inner-api-passport.kaikeba.com"
  }
}

let baseOldURL = ""
if (process.env.NODE_ENV === "development") {
  baseOldURL = "/s1"
} else {
  baseOldURL = "/s1"
}



// 接口200失败警告
export const apiCodeWarn = (res) =>{
  if(getEnv() === "prod"){
    apiWarn({
      project: "wx",
      env: projectEnv(),
      api: res.config.url,
      notice: true,
      content: {
        method: res.config.method,
        status: res.status,
        request: res.config.method === "post" ? res.config.data : "",
        response: res.data,
      },
    })
  }
} ;


// 本期S8迭代会使用代理 字段为/opencourseapi

//微信授权
export const urlAccess = (params) => {
  return axios.get(baseURL + `/wechat/authorize?code=${params.code}&state=kkb&appOpenId=null`, params)
}
//微信授权Tos系统
export const urlAccessTos = (params) => {
  return axios.get(baseURL + `/wechat/authorize?code=${params.code}&state=tos&appOpenId=${params.appOpenId}`, params)
}
//微信授权Open
export const urlAccessOpen = (params) => {
  if (location.href.indexOf("weightQrcode") > -1) {
    return axios.get(baseURL + `/wechat/open/authorize?code=${params.code}&state=kkb`, params)
  } else {
    return axios.get(baseURL + `/wechat/open/authorize?code=${params.code}&state=kkb&appId=${getToken("tenant")}`, params)
  }
}
//获取用户信息(openid)
export const urlUserInfoByOpen = (params) => {
  return axios.get(baseURL + `/wechat/openid/${params.openid}`, params)
}
//获取用户信息(unionid)
export const urlUserInfoByUnion = (params) => {
  return axios.get(baseURL + `/wechat/unionid/${params.unionid}`, params)
}
//分享
export const urlJsapisign = (params) => {
  return axios.get(baseURL + `/wechat/jsapisign?url=${params.url}`, params)
}
//获取临时二维码
export const urlGetQrcode = (params) => {
  return axios.post(baseURL + `/wechat/qr?p=${params}`)
}
//公开课详情
export const urlGetOpenCourseInfo = (params) => {
  let strParams = ""
  if (params.sharerUnionId && params.sharerUnionId != "" && params.sharerUnionId != "undefined") {
    strParams += "&sharerUnionId=" + params.sharerUnionId
  }
  if (params.unionId && params.unionId != "" && params.unionId != "undefined") {
    strParams += "&unionId=" + params.unionId
  }
  return axios.get(
    baseURL + `/opencourse/${params.courseId}?pageCode=${params.pageCode}&endpoint=${params.endpoint}&channelCode=${params.channelCode}` + strParams,
    params
  )
}

// s09

// 图片上传获取token
export const getUploadToken = () => {
  return axios.get(baseUrl() + `/common/qiniu/token`)
}
// 图片上传后台
export const uploadPayPicture = (params) => {
  return axios.post(baseURL + `/qrcode/ad/${params.uuid}/certificate?certificate=${params.certificate}`)
}
// 计算pv/uv
export const statisticsUVAndPV = (params) => {
  return axios.get(baseURL + `/qrcode/ad/${params.id}/weight?uuid=${params.uuid}&openid=${params.openid}&unionid=${params.unionid}`)
}
// 二维码长按
export const qrCodeLongPress = (params) => {
  return axios.put(baseURL + `/qrcode/ad/${params.id}/seller/${params.qrCode}/press?openid=${params.openid}&unionid=${params.unionid}`)
}

//s10
//获取vip课程详情
export const urlGetVipcourseInfo = (params) => {
  let strParams = ""
  if (params.openid && params.unionid && params.unionid != "" && params.unionid != "undefined") {
    strParams += `?openid=${params.openid}&unionid=${params.unionid}`
  } else {
    strParams += `?openid=null&unionid=null`
  }
  if(params.parts){
    strParams += `&parts=${params.parts}`
  }
  if(Number(params.sell) === 1){
    // 组合商品
    return axios.get(baseURL + `/vipcourse/group/${params.courseCode}/${params.channelCode}` + strParams, params)
  }else{
    return axios.get(baseURL + `/vipcourse/${params.courseCode}/${params.channelCode}` + strParams, params)
  }
}

// 获取支付链接【组合商品】
export const groupPayorder = (params) =>{
  return axios.get(baseURL + `/vipcourse/group/payorder/${params.openid}/${params.orderNo}/${params.payType}?unionid=${params.unionid}&openid=${params.openid}&parts=${params.parts}&userId=${params.userId}&endpoint=${params.endpoint}`)
}

// 付款详情【组合商品】
export const groupPayment = (params) =>{
  return axios.get(baseURL + `/vipcourse/group/payment/${params.no}?unionid=${params.unionid}&openid=${params.openid}&parts=${params.parts}&userId=${params.userId}`)
}


//创建订单
export const urlCreateOrder = (params) => {
  return axios.post(baseURL + `/vipcourse/order`, params)
}
//查询订单 (支付宝)
// export const urlGetOrderInfo = params => { return axios.get(baseURL + `/vipcourse/order/${params.orderNo}/${params.unionId}`); };
//询订单状态
export const urlGetOrderStatus = async (params) => {
  const data = params.orderPartId ? `${params.orderNo}?orderPartId=${params.orderPartId}` : `${params.orderNo}`
  return axios.get(baseURL + `/vipcourse/order/${data}`)
}
//芝士分期查询状态
export const urlGetOrderStatusZS = (params) => {
  return axios.get(baseURL + `/pay/cheese/creditcardorder/${params.orderNo}`)
}
//微信支付
export const urlWxPay = (params) => {
  return axios.post(baseURL + `/pay/wechatpay`, params)
}
//支付宝支付
export const urlAliPay = (params) => {
  return axios.post(baseURL + `/pay/alipay`, params)
}
// 查询订单号
export const queryOrderId = (params) => {
  return axios.get(baseURL + `/vipcourse/getorder/${params}`)
}

export const Wxpay = (pt, params) => {
  return axios.post(baseURL + `/pay/${pt}`, params)
}

// 新调整的支付统一接口
export const urlPay = (params) => {
  return axios.get(baseURL + `/vipcourse/payorder/${params.openid}/${params.orderNo}/${params.payType}`)
}

//验证手机号是否存在
export const urlPhoneNum = (params) => {
  return axios.post(baseOldURL + `/v2/users/checkuser`, params)
}
//手机号登录
export const urlPhoneLogin = (params) => {
  return axios.post(baseOldURL + `/v2/users/login`, params, {
    headers: {
      Platform: "wx",
    },
  })
}
//手机号注册
export const urlPhoneRegister = (params) => {
  return axios.post(baseOldURL + `/v2/users/register`, params, {
    headers: {
      Platform: "wx",
    },
  })
}
//获取手机号验证码
export const urlGetCaptcha = (params) => {
  return axios.post(baseOldURL + `/v2/users/${params.mobile}/verifycode`, params)
}
//验证手机号验证码
export const urlcheckCaptcha = (params) => {
  return axios.get(baseOldURL + `/v2/users/${params.mobile}/verifycode?mobile=${params.mobile}&code=${params.code}`)
}
//验证绑定是否成功
export const urlBind = (params) => {
  return axios.post(baseOldURL + `/v3/wx/pay/trade/success`, params)
}

//学习证书
export const urlLearnCert = (params) => {
  return axios.get(`/opencourseapi/vipcourse/cert/student/${params.code}`)
}

//11
//查询全部学科
export const getSubjectList = () => {
  return axios.get(`/opencourseapi/opencourse/subject`)
}
//公开课聚合页
export const getOpencourseList = (params) => {
  return axios.post(`/opencourseapi/opencourse/site/list`, params)
}
//vip课聚合页
export const getVipcourseList = (params) => {
  return axios.post(`/opencourseapi/vipcourse/site/list/${params.id}`, params.data)
}

//s14
//获取资料详情
export const getPreSaleDataDetail = (params) => {
  let strParams = ""
  if (params.sharerUnionId && params.sharerUnionId != "" && params.sharerUnionId != "undefined") {
    strParams += "&sharerUnionId=" + params.sharerUnionId
  }
  if (params.unionId && params.unionId != "" && params.unionId != "undefined") {
    strParams += "&unionId=" + params.unionId
  }
  return axios.get(baseURL + `/materials/${params.materialsId}?channelCode=${params.channelCode}` + strParams)
}
//获取资料内容
export const getPreSaleContainer = (params) => {
  return axios.get(baseURL + `/materials/content/${params.materialsId}`)
}
//资料页面视频观看时长
export const sendvideoWatchTime = (params) => {
  return axios.get(baseURL + `/materials/watch/${params.materialsId}/${params.channelCode}/${params.watchTime}/${params.unionId}`)
}

// 获取支付渠道
export const getPayList = (params) => {
  return axios.get(baseURL + `/item/payChannel/${params}`)
}

//第三方授权
export const thirdpartyouths = (params) => {
  return axios.get(baseURL + `/wechat/app/authorize?redirectURI=${params}`)
}

//收银台支付
export const cashierPay = (params) => {
  return axios.get(baseURL + `/order/cashier`, { params })
}
//收银台查询支付
export const cashierSearch = (params) => {
  return axios.get(baseURL + `/order/${params.no}/status`, params)
}
//收银台支付接口
// export const urlPayCashier = params => { return axios.post(baseURL + `/order/app/pay/${params.openid}/${params.payType}/${params.orderNo}`); };
export const urlPayCashier = (params) => {
  return axios.post(
    baseURL +
      `/order/app/pay?order_no=${params.order_no}&pay_channel=${params.pay_channel}&return_url=${params.return_url}&endpoint=${params.endpoint}`,
    params
  )
}

// 请求开课吧验证码
export const getVerificode = (phonenumber) => {
  return axios.get(baseURL + `/common/code/${phonenumber}`)
}

// 请求开课吧验证码
export const checkVerificode = (phonenumber, code) => {
  return axios.get(baseURL + `/common/verifycode/${phonenumber}?code=${code}`)
}

export const kkblogin = (params) => {
  return axios.post(baseURL + `/uaa/users/learn-center/auth`, params)
}

export const getclassDetail = (params) => {
  return axios.post(baseURL + `/vip-class/${params}`)
}

// 学习中心接口，获取uuid
export const getUuid = (params) => {
  return axios.get(baseURL + `/vipcourse/uid/${params}`)
}
// 学习中心接口，获取uuid
export const getCheckUninonid = (params) => {
  return axios.get(baseURL + `/vipcourse/unionid/${params}`)
}
// 学习中心获取支付链接
export const getPayUrl = (params) => {
  return axios.get(baseURL + `/vipcourse/${params.courseId}/item/detail?chapter_id=${params.chapterId}&uid=${params.uid}&unionid=${params.unionid}`)
}
// 根据UID查询手机号
export const getPhoneByUid = (uid) => {
  return axios.get(baseURL + `/uaa/learn-users/sso/user/${uid}`)
}

// 定金详情
export const getOrderPart = (params) => {
  return axios.get(`${baseURL}/vipcourse/orderPart/${params}`)
}
// 定金支付
export const orderPartPay = ({ openid, orderNo, payType, orderPartId, endpoint, userId }) => {
  const endpointParams = endpoint ? `&endpoint=${endpoint}` : ``
  return axios.get(`${baseURL}/vipcourse/payorder/${openid}/${orderNo}/${payType}?userId=${userId}&orderPartId=${orderPartId}${endpointParams}`)
}

// 微信授权
export const interfaceApi = (url) => {
  return axios.get(`${statyPassPortApi()}/wechat/public_account_params?redirect_uri=${encodeURIComponent(url)}`)
}
// 通过orderpartId 查询该笔订单的类型，首款、中款、尾款
export const getOrderPartType = (orderPartId) => {
  return axios.get(`${baseURL}/vipcourse/orderPart/detail/${orderPartId}`)
}

// 租户服务号获取code
export const getWechatCode = (params) => {
  return axios.get(`${baseURL}/wechat/open/redirect/url`, { params })
}


// 获取分销商品详情
export const getGoodsDetail= (params) =>{
  return axios.get(`${distributionURL}/distribution/user/goods/${params}`)
}
// 分销浏览记录
export const postBrowsing= (params) =>{
  return axios.post(`${distributionURL}/distribution/browsing/add`,params)
}

// 购买详情
export const buyGoodsDetail = (goodsId,partnerId,uid) =>{
  if(uid){
    return axios.get(`${distributionURL}/distribution/user/goods/purchasersDetail/${goodsId}/${partnerId}?uid=${uid}`)
  }else{
    return axios.get(`${distributionURL}/distribution/user/goods/purchasersDetail/${goodsId}/${partnerId}`)
  }
}

// 判断分销员
export const wechatLogin = (unionid) =>{
  return axios.get(`${distributionURL}/distribution/user/wechat/login?unionid=${unionid}`)
}

// 数美注册登录
export const SmeiFengkong = (params) =>{
  return axios.post(`${baseURL}/support/receive/shumei/fengkong`,params)
}

// 获取直播货架列表
export const getGoodShelv = (id) =>{
  return axios.get(`${learnApi}/shelves/client/shelves/${id}`)
}
// 直播货架pv/uv
export const getGoodShelvPVandUV = (id,key) =>{
  return axios.post(`${learnApi}/shelves/client/shelves/pv_uv/${id}/${key}`)
}

// 获取学习中心信息
export const getIpsInfo = (token) =>{
  return axios.get(`${learnApi}/uaa/learn-users/info`,{headers:{"lpsAuthorization":token}})
}


export const post = (url,params = {}) =>{
  const headers = getCommonAppHeader()
  return new Promise((resolve,reject)=>{
    axios.post(url,params,{headers}).then(res=>{
      if(res.data){
        resolve(res.data)
      }
    }).catch(error=>{
      reject(error)
    })
  })
}
