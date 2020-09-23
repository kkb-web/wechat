import Vue from "vue"
import Router from "vue-router"
import VueWechatTitle from "vue-wechat-title"

Vue.use(Router)
Vue.use(VueWechatTitle)

const createRouter = (routerPath, routerName, routerComponent, routerTitle) => {
  let routerList = {}
  routerList["path"] = routerPath
  routerList["name"] = routerName
  routerList["component"] = routerComponent
  routerList["meta"] = { title: routerTitle }
  routerList["props"] = (router) => ({
    QueryParam: router.query,
  })
  return routerList
}

// 本期S8迭代的路由：公开课
const liveClass = () => import('@/views/openCourse/liveClass') //公开课直播
const openCourse = () => import('@/views/openCourse/openCourse') //公开课详情
const cleanUserInfo = () => import('@/views/openCourse/cleanUserInfo') //清除页面缓存
const transformpage = () => import('@/views/common/transformPage') // uinonid中转
const transformStudy = () => import('@/views/common/transformStudy') // uinonid中转


// S09
// 二维码中转页
const qrCode = () => import('@/views/weightQrCode/qrCode')

// 上传付款截图
const upload = () => import('@/views/payment/upload') //上传截图页面
const uploadSuccess = () => import('@/views/payment/uploadSuccess') //上传截图页面


//S10
const vipCourse = () => import('@/views/vipCourse/vipCourse') //vip详情

const aliPay = () => import('@/views/vipCourse/pay/aliPay') //支付宝支付
const jdPay = () => import('@/views/vipCourse/pay/jdPay') //jd宝支付
const stagesPay = () => import('@/views/vipCourse/pay/stagesPay') //支付宝支付


const paySuccess = () => import('@/views/vipCourse/pay/paySuccess') //支付成功
const groupDepositSuccess = () => import('@/views/vipCourse/pay/groupDepositSuccess') //定金模式支付成功
const login = () => import('@/views/vipCourse/bind/login') //绑定账号——登录
const register = () => import('@/views/vipCourse/bind/register') //绑定账号——注册
const bindSuccess = () => import('@/views/vipCourse/bind/bindSuccess') //绑定账号成功
const bindFailure = () => import('@/views/vipCourse/bind/bindFailure') //绑定账号失败


//s11
const opencourseAll = () => import('@/views/common/opencourseAll')
const vipcourseAll = () => import('@/views/common/vipcourseAll')

//s14 用户查看资料
const presaledata = () => import('@/views/preSaleData/preData')


//学习证书
const search = () => import('@/views/cert/search') //搜索
const certDetail = () => import('@/views/cert/certDetail') //证书
const cert404 = () => import('@/views/cert/404') //404

const Text = () => import('@/views/Text')
const ThirdAuthorize = () => import('@/views/demo/thirdAuthorize02')


//vip课程中转获取appOpenId
const transformVip = () => import('@/views/common/transformVip')

//第三方授权获取appopenid
const TransformTos = () => import('@/views/common/transformTos')
const TransformTosTwo = () => import('@/views/common/transformTosTwo')

//收银台
const Cashier = () => import('@/views/cashier/cashier')
const paying = () => import('@/views/cashier/paying')
const payFail = () => import('@/views/cashier/payFail')
const paySucceed = () => import('@/views/cashier/paySucceed')
const cashierAliPay = () => import('@/views/cashier/cashierAliPay')

// 第三方授权获取code
const TransformCode = () => import('@/views/common/TransformCode')
const AppTransformPage = () => import('@/views/appTransformPage')

// 定金cashier
const DownCashier = () => import('@/views/vipCourse/cashier')
const DownSuccess = () => import('@/views/vipCourse/cashier/success')

//组合商品 
const GroupGoodsDeposit = () => import('@/views/vipCourse/groupGoodsDeposit')

// 分销客户流程
const DistributionCustomer = () => import('@/views/distribution/customer')

// 直播货架
import Goodshelvees from "@/views/goodsShelves/index"
import GoodsList from "@/views/goodsShelves/goodsList"
import GoodsBox from "@/views/common/transformGoodsShelves"

let _base = "/"

let router = new Router({
  mode: "history",
  routes: [
    // S8公开课路由
    createRouter(_base + "liveclass/:id", "liveClass", liveClass, "直播"),
    createRouter(_base + "opencourse/:id", "openCourse", openCourse, "公开课"),
    createRouter(_base + "cleanuserinfo", "cleanUserInfo", cleanUserInfo, "清除页面缓存"),
    createRouter(_base + "transformpage", "transformpage", transformpage, ""),
    // S09上传图片路由
    createRouter(_base + "upload/:id", "upload", upload, "选择付款截图"),
    createRouter(_base + "uploadsuccess", "uploadSuccess", uploadSuccess, "上传结果"),
    createRouter(_base + "weightQrcode/:id", "qrCode", qrCode, ""),
    //S10 vip课程改造
    createRouter(_base + "vipcourse/:code/:channel", "vipCourse", vipCourse, "VIP课程"),
    // createRouter(_base + 'demoshare/:code/:channel', 'demoshare', demoshare, 'VIP课程'),
    createRouter(_base + "vipcourse/:code/:channel", "vip_Course", vipCourse, "VIP课程"),
    createRouter(_base + "paysuccess", "paySuccess", paySuccess, "支付成功"),
    createRouter(_base + "groupDepositSuccess","groupDepositSuccess",groupDepositSuccess,"支付成功"),
    createRouter(_base + "alipay/:orderNo", "aliPay", aliPay, "支付宝支付"),
    createRouter(_base + "jdpay/:orderNo", "jdPay", jdPay, "京东支付"),
    createRouter(_base + "cheese/notify/:batchNo", "stagesPay", stagesPay, "支付成功"),
    createRouter(_base + "login", "login", login, "登录"),
    createRouter(_base + "register", "register", register, "注册"),
    createRouter(_base + "bindsuccess", "bindSuccess", bindSuccess, "报名结果"),
    createRouter(_base + "bindfailure", "bindFailure", bindFailure, "报名结果"),
    createRouter("/oauth/:course", "Oauth", transformStudy, "中转"),
    createRouter(_base + "bindfailure", "bindFailure", bindFailure, "报名结果"),
    //s11
    createRouter(_base + "opencourseall", "opencourseall", opencourseAll, "公开课"),
    createRouter(_base + "vipcourseall", "vipcourseall", vipcourseAll, "VIP课程"),
    //学习证书
    createRouter(_base + "cert/student", "search", search, "学习证书"),
    createRouter(_base + "cert/student/404", "cert404", cert404, "学习证书"),
    createRouter(_base + "cert/student/:random", "certDetail", certDetail, "学习证书"),
    createRouter(_base + "text", "text", Text, "测试"),
    //s14 用户查看售前资料
    createRouter(_base + "presaledata/:id", "presaledata", presaledata, "课程资料"),

    //第三方授权demo
    createRouter(_base + "thirdAuthorize", "ThirdAuthorize", ThirdAuthorize, "三方授权"),
    createRouter(_base + "vip_course/:code/:channel", "transformVip", transformVip, ""),

    //收银台
    createRouter(_base + "cashier", "Cashier", Cashier, "支付"),
    createRouter(_base + "paying", "paying", paying, "交易中"),
    createRouter(_base + "payFail", "payFail", payFail, "支付失败"),
    createRouter(_base + "paySucceed", "paySucceed", paySucceed, "支付成功"),
    createRouter(_base + "cashalipay/:orderNo", "cashierAliPay", cashierAliPay, ""),

    //tos 系统中转授权
    createRouter(_base + "transformtos", "TransformTos", TransformTos, ""),
    createRouter(_base + "transformtostwo/:appopenid", "TransformTosTwo", TransformTosTwo, ""),

    // 获取code
    createRouter(_base + "transformcode", "TransformCode", TransformCode, ""),

    // 学习中心扫码中转页 AppTransformPage
    createRouter(_base + "apptransf", "AppTransformPage", AppTransformPage, ""),

    // 定金
    createRouter(`${_base}downCash`, "down", DownCashier, "收银台"),
    createRouter(`${_base}downsuc`, "downSuccess", DownSuccess, "支付结果"),

    // GroupGoodsDeposit
    createRouter(`${_base}GroupGoodsDeposit/:orderNo/:openid/:id`, "GroupGoodsDeposit", GroupGoodsDeposit, "付款详情"),

    // 分销客户流程
    createRouter(`${_base}distributionCustomer`, "distributionCustomer", DistributionCustomer, "客户流程"),

    // 直播货架
    createRouter(`${_base}goodsshelves`, "Goodshelvees", Goodshelvees, "直播间"),
    createRouter(`${_base}goodslist`, "Goodshelvees", GoodsList, "直播货架"),
    createRouter(`${_base}live`, "GoodsBox", GoodsBox, ""),
  ],
})

export default router
