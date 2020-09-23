<template>
  <div>
    <qrcode-Modal :dataInfo="pcQrcodeInfo" v-if="qrcodeModal"></qrcode-Modal>
    <div>
      <div v-if="showPage">
        <!--课程内容-->
        <div>
          <div
            ref="showImg"
            :class="(vipInfo.type == 1  && vipInfo.use == 1) ? 'show-img show-img-bottom' :'show-img'"
          >
            <img
              v-for="(item, idx) in vipInfo.vipCourseImgList"
              :src="item"
              v-if="idx < 2"
              :key="idx"
              :class="!isMobile ? 'addfilter' : '' "
            />
            <img
              v-for="(item, idx) in vipInfo.vipCourseImgList"
              v-lazy="item"
              v-if="idx >= 2"
              :key="idx"
              :class="!isMobile ? 'addfilter' : '' "
            />
          </div>

          <div
            class="fixed-text"
            :style="{bottom: vipInfo.endTime ? '90px' : '50px'}"
            v-show="vipInfo.once === 1 && vipInfo.use === 1 && vipInfo.payStatus !== 1"
          >
            {{vipInfo.text ?
            vipInfo.text : `Hi，${nickname?nickname+'，':''}这是我专门为你生成的专属优惠哦，请尽快使用吧`}}
          </div>
          <p
            v-if="vipInfo.type == 1 && vipInfo.classStatus != 1 && vipInfo.payStatus !== 1&& Number(sell) !==1 "
            class="discounts"
          >此课程暂时不支持付款，请稍后尝试</p>
          <p
            v-else-if="vipInfo.type == 1 && vipInfo.payStatus !== 1 && vipInfo.use == 0 && !end && Number(sell) !==1 "
            class="discounts"
          >该优惠入口已失效，请联系课程顾问</p>
          <!--倒计时-->
          <div
            v-else-if="vipInfo.type == 1 && vipInfo.payStatus !== 1 && end"
            class="discounts discounts-spe clear"
          >
            <p class="left">距{{begin ? '结束' : '开始'}}还剩：</p>
            <div class="countdown-clock left">
              <span class="clock-top">{{data.days}}</span>
              <span class="span-time-moble">天</span>
              <span class="clock-top">{{data.hourse}}</span>
              <span class="span-time-moble">时</span>
              <span class="clock-top">{{data.minute}}</span>
              <span class="span-time-moble">分</span>
              <span class="clock-top">{{data.second}}</span>
              <span class="span-time-moble">秒</span>
            </div>
          </div>
          <div class="bottom" :class="!isMobile ? 'addfilter' : ''" v-show="btnState1">
            <!--<input style="height: 50px;"  placeholder="请输入手机号"/>-->
            <div class="bottom-left-spe left">
              <p class="original-price">
                官方价
                <span>￥{{vipInfo.price}}</span>
              </p>
              <p class="present-price">
                优惠价
                <span>￥{{vipInfo.actualPrice}}</span>
              </p>
            </div>
            <div
              v-if="courseCode == 'b16nrjdf3l'"
              class="bottom-right"
              @click="createOrderStepOne"
            >确认支付</div>
            <div
              v-else
              class="bottom-right"
              @click="model === 1 ? confirmDown() : createOrderStepOne()"
            >去报名</div>
          </div>
          <!-- 组合商品 -->
          <div class="bottom skuUsable" v-if="skuUsable === 0 && Number(sell) === 1">
            课程已失效
          </div>
          <div
            @click="toLogin"
            v-show="btnState2 || btnState3"
            class="bottom no-bindding buy-over-style"
          >
            <p class="buy-over-word">已购买 登录学习中心学习</p>
            <p class="buy-over-link">learn.kaikeba.com</p>
          </div>
          <div class="bottom-samll-course" v-show="btnState4">
            <div class="bottom-right-course" @click="courseLinkToSuccess">已购买，进行课程激活</div>
          </div>
        </div>
        <div class="popups" v-show="payMask" @click="shutPayBoxFalse"></div>
        <div class="popupsmobile" ref="mobileLoginMast" v-show="payMaskMobile"></div>
        <!--支付方式-->
        <transition name="slide-fade">
          <div v-show="showPayMark" class="show-marks-pay">
            <div class="mark-head">
              <span class="mark-title">请选择支付方式</span>
              <span class="mark-cancel-button" @click="shutPayBoxFalse">取消</span>
            </div>
            <div class="mark-content" :class="isGoodsShelves==='isTrue' || lichee === 'lichee' ? 'mark-content-live' : ''">
              <template id v-for="(item,index) in payListNew">
                <div :key="index" :class="['all-pay',item.cls]" @click="unityPay(item.code)">
                  <img
                    :style="{marginRight: item.code === 'CHEESE' ? '12px' : ''}"
                    :src="`https://img.kaikeba.com/${item.icon}`"
                    alt
                  />
                  <span>{{item.name}}</span>
                  <!--<img v-if="item.code === 'CREDIT_CARD_INSTALMENT'"-->
                  <!--:style="{position: 'absolute',top: '1px',left: '180px'}"-->
                  <!--src="https://img.kaikeba.com/55c1fc9b-c664-4796-8dbd-eb5f9dbeca53.png" alt="">-->
                </div>
              </template>
            </div>
            <div v-if="protocolMode === 0">
              <div
                v-if="markFoot === 0 || itemId === SpecialItemId || SpecialItemIdArrFlag || (Number(sell) === 1 && protocolMode === 0)"
                class="mark-foot"
              >
                <p class="to-show-mark-title">点击支付即代表您已阅读并同意</p>
                <p @click="showEleProtocolMark" class="to-show-mark-click">《电子协议》</p>
              </div>
            </div>
            <div v-if="protocolMode === 1">
              <div
                v-if="markFoot === 0 || itemId === SpecialItemId || SpecialItemIdArrFlag ||(Number(sell) === 1 && protocolMode === 1)"
                class="mark-foot checkboxag"
              >
                <input
                        type="checkbox"
                        :style="{top: isIOS ? '1px' : '4px'}"
                        id="agreements"
                        v-model="ckeckVal"
                />
                <label for="agreements" class="checkbox-label">
                  <span class="to-show-mark-title check">勾选即代表您已阅读并同意</span>
                  <span @click.prevent.stop="showEleProtocolMark" class="to-show-mark-click check">《电子协议》</span>
                </label>
              </div>
            </div>
          </div>
        </transition>
        <!-- 定金 -->
        <transition name="slide-fade">
          <div v-show="showDown" class="show-marks">
            <div class="mark-head">
              提醒
              <img
                @click="closeDown"
                class="mark-head-img"
                src="../../assets/img/payImgs/pay_close.png"
              />
            </div>
            <div class="mark-content down-ct">
              <p class="down-info">您正在前往首付款模式支付，是否确认？</p>
              <p class="down-info-item">首付款支付后可开始学习，在期限内补齐</p>
              <p class="down-info-item">尾款即可享受全部课程服务</p>

              <div class="down-btn" @click="createOrderStepOne">确定</div>
              <p class="down-agreement-info">点击确定即代表您已阅读并同意</p>
              <p @click="showDownProtocol" class="to-show-mark-click check">《首付款协议》</p>
            </div>
          </div>
        </transition>
        <!--手机登录框-->
        <transition name="slide-fade-three">
          <div ref="mobileLoginBox" v-show="mobileLoginFlag" class="show-marks three mobilelogin">
            <div class="mobilehead">
              <span>请先登录</span>
              <img @click="closeMobileLogin" src="https://img.kaikeba.com/60720070219102arlw.png" />
            </div>
            <div class="mobileline"></div>
            <p
              class="mobileerrmsg"
              :class="{mobileerrmsgtips:errmsgMobileLoginFlag}"
            >{{errmsgMobileLogin}}</p>
            <div class="telephone" @click="clickWxMobile">
              <input
                @blur="wxCodeBlur"
                ref="wxMobile"
                v-model="wxMobile"
                class="wxinput"
                type="number"
                placeholder="请输入手机号"
              />
            </div>
            <div class="mobilecode">
              <input
                @blur="wxCodeBlur"
                @input="onInput"
                ref="mobileLoginCode"
                v-model="wxCode"
                class="wxinput code"
                type="number"
                placeholder="请输入验证码"
              />
              <button
                @click="getCode"
                v-text="codeBtn"
                :class="{btnActive: isClick}"
                class="btn-code"
              >获取验证码</button>
            </div>
            <button :disabled="mobileLoginBtn" class="wxbtn" @click="mobileLogin">立即登录</button>
          </div>
        </transition>
        <!--定金协议内容-->
        <transition name="slide-fade-two">
          <div v-show="isShowPol" class="show-marks two">
            <div class="agreement mark-head" style="background-size: 100% 55px">
              培训协议（首付款模式）
              <img
                @click="closeDownProtocol"
                class="mark-head-img"
                src="../../assets/img/payImgs/pay_close.png"
              />
            </div>
            <div class="agreement-contains">
              <div class="agree-content">
                <Agreement />
              </div>
            </div>
          </div>
        </transition>

        <!--协议内容-->
        <transition name="slide-fade-two">
          <div v-show="showEleProMask" class="show-marks two" :class="isGoodsShelves==='isTrue' ? 'goodslive' : ''">
            <div class="agreement mark-head" style="background-size: 100% 55px">
              培训协议
              <img
                @click="closeEleMarks"
                class="mark-head-img"
                src="../../assets/img/payImgs/pay_close.png"
              />
            </div>
            <div class="agreement-contains" :class="isGoodsShelves === 'isTrue' ? 'liveheight' : ''">
              <div class="agree-content">
                <template id="agreement-template" v-for="(item,index) in PAYAGREEMENT">
                  <p
                    :ref="`${item.diffCls === 'vipcoursenameflag' ? 'refCourseName' : null}`"
                    :key="index"
                    :class="{'sub-desc-p':item.type === 1,'sub-title':item.type === 0,'sub-desc-p-weight':item.diffCls === 'sub-desc-p-weight','noindent':item.diffCls === 'noindent'}"
                  >{{item.content}}</p>
                </template>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="inexistence-course" v-else>
        <img class src="../../assets/img/vipImgs/inexistence.jpg" />
        <p>该课程不存在，请检查链接是否正确</p>
      </div>
      <div v-if="kkbregist" class="kkbregist">
        <div class="kkbregistInfo">
          <div style="color: #9e9e9e;text-align: right;">
            <span @click="closeRegist">X</span>
          </div>
          <label>
            <span class="title" style="color: #0099ee;">请输入学员手机号</span>
          </label>
          <label class="label phoneNumber">
          <span>
            <img :src="require('../../assets/img/A10E08AF-2272-4205-A0BB-8A9AB10B130E.png')" />
          </span>
            <input ref="inputphoneNumber" v-model="registForm.phoneNumber" autofocus />
            <button
              @click="getVerifycode"
              class="verifycodeSublime"
              :class="{'disable': getVerifycodeclicked || (!registForm.phoneNumber)}"
              :disabled="getVerifycodeclicked || (!registForm.phoneNumber)"
            >
              {{Verifycodenum ?
              Verifycodenum+'s后重试' : '获取验证码'}}
            </button>
          </label>
          <label class="label verifycode">
          <span>
            <img :src="require('../../assets/img/724C2DC2-3B1B-4B51-BDBF-79313B3D090A.png')" />
          </span>
            <input @input="onInputNotWx" v-model="registForm.verifycode" />
          </label>
          <button
            @click="registLogin"
            class="sublime"
            :class="{'disable': !registForm.phoneNumber||!registForm.verifycode}"
            :disabled="!registForm.phoneNumber||!registForm.verifycode"
          >完成</button>
        </div>
      </div>
      <div class="kkbregist" v-if="paySearch">
        <div class="paysuccess">
          <header>是否已完成支付？</header>
          <div class="payed" @click="loadthisUrl(true)">
            <a>已完成支付</a>
          </div>
          <div @click="loadthisUrl()" class="noPay">
            <a>支付遇到问题，重新支付</a>
          </div>
        </div>
      </div>
      <div class="kkbregist" v-if="depositGroupPayMat">
        <groupPayMessage
          :payItem="payItem"
          :sell="sell"
          :orderPaymentData = 'orderPaymentData'
          :orderNo = "orderNo"
          :parts = "parts"
          @unityPay = "unityPay"
          @depositPayTypesMatShow="depositPayTypesMatShow"
          @depositGroupPayMatHide="depositGroupPayMatHide"
          @showDownProtocol="showDownProtocol"
        />
      </div>
      <div class="kkbregist" v-if="depositGroupPayTypesMat">
        <groupPayTypes
          :payListNew="payListNew"
          @depositPayTypesMatHide="depositPayTypesMatHide"
          @choosePaytype="choosePaytype"
        />
      </div>
      <div class="kkbregist" v-if="loading"></div>
      <div class="toastmobile" :class="{toastmobileactive:mobileToast}">
        <div class="toastmobile-des">{{mobileToastMsg}}</div>
      </div>
      <div @click="linkToGoodsList" class="good_live" v-if="liveCloseAndBack">
        <img src="https://img.kaikeba.com/a/21749112800202eyxy.png" >
      </div>
    </div>
  </div>
</template>

<script>
import { share } from "../../assets/js/share"
import { Authorize } from "../../assets/js/userAuthorize"
import {
  getToken,
  timestampToTime,
  setToken,
  routeUrl,
  getCaption,
  isPcDingTalkWS,
  isIOS,
  getCookie,
  setCookie,
  cashierLink,
  removeToken,
  getParam,
  isMobile
} from "../../assets/js/filter"
import { Toast } from "we-vue"
import {
  urlGetVipcourseInfo,
  urlCreateOrder,
  urlPay,
  groupPayorder,
  getPayList,
  getVerificode,
  checkVerificode,
  kkblogin,
  Wxpay,
  getUuid,
  getCheckUninonid,
  urlGetOrderStatus,
  groupPayment,
  getIpsInfo
} from "../../api/api"
import {
  PAYAGREEMENT,
  SpecialItemId,
  SpecialItemIdArr,
  SpecialItemIdArr2,
  SpecialItemIdArr3,
  SpecialItemIdArr4,
  SpecialItemIdArr5,
  webExcellentCourse,
  scholarshipCard,
  xiaokepeiyouFixCard,
  dataChanpinFixCard,
  factoryCourse,
  millionCourse,
  changXueCard
} from "../../utils/agreement"
import {isMobileLive,childrenPostMassage,getMassage} from "../../utils"
import {LEARNEDU_TOKEN} from "../../utils/const"
import {isLoginApp, payCourse, goLogin,showToast} from "../../utils/appAgreement"
import { _AP } from "../../assets/js/urlencode"
import Dialog from "../common/dialog"
import qrcodeModal from './components/vipCoursePcQrcode'
import groupPayMessage from './components/groupPayMessage'
import groupPayTypes from './components/groupPayTypes'
import Agreement from "./cashier/agreement"
import { initSdk,dealSmDeviceId,shumeiSdk } from "../../assets/js/shumeiSdk"
var vipInfoData = require("./pay/getvipinfo.json")

initSdk()
//实例化 authorize
var authorize = new Authorize()
let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
export default {
  name: "vipCourse",
  data() {
    return {
      isInitSDk:true,
      payItem:{}, // 支付方式
      depositGroupPayMat:false, // 定金模式支付
      depositGroupPayTypesMat:false, //定金模式选择支付方式
      timer: null,
      isShowPol: false,
      showDown: false,
      model: null,
      parts:this.$route.query.sub_goods_id||'',
      sell:this.$route.query.sell || 0,
      courseCode: this.$route.params.code,
      channelCode: this.$route.params.channel,
      code: this.$route.query.code, //获取授权code,
      tenant: this.$route.query.tenant ? this.$route.query.tenant : null,
      channelParams: this.$route.query.channelParams ? this.$route.query.channelParams : null,
      thirdPartOpenId: "",
      thirdPartAppid: "",
      showPage: true, //页面的显示
      vipInfo: {
        text: "",
        vipCourseImgList: [], //图片列表
        price: "", //价格
        actualPrice: "", //实际价格
        coupon: "", //折扣
        use: "", //是否可使用
        classStatus: "",
        type: "",
        startTime: "",
        endTime: "",
        payStatus: "",
        once: null,
        protocolStatus: false, //控制显示用户协议的内容,
        courseType: "", //课程类型
      },
      data: {
        //倒计时天、时、分、秒
        days: "00",
        hourse: "00",
        minute: "00",
        second: "00",
      },
      nickname: getToken("username"),
      btnState1: true, //未购买
      btnState2: false, //已购买
      btnState3: false, //已购买未报名,
      btnState4: false,
      payMask: false, //遮罩层
      showPayMark: false, //支付遮罩层
      showEleProMask: false, //电子协议遮罩层
      orderNo: null, //支付订单id
      timer: null, //定时器
      begin: null, //当前时间>=开始时间true
      end: null, // 当前时间<=结束时间true
      pageScrollFlag: false,
      payTypeZSFlag: true,
      payTypeCheeseFlag: true,
      markFoot: "", //协议flag
      itemId: "",
      mobileLoginFlag: false,
      payList: [
        {
          id: 8,
          name: "支付宝线下",
          code: "ALIPAY_OFFLINE",
          icon: null,
          cls: null,
          status: null,
          online: 0,
        },
        {
          id: 9,
          name: "微信线下",
          code: "WECHAT_OFFLINE",
          icon: null,
          cls: null,
          status: null,
          online: 0,
        },
      ],
      payListNew: [],
      kkbregist: false,
      registForm: {
        phoneNumber: "",
        verifycode: "",
      },
      getVerifycodeclicked: false,
      Verify: null,
      Verifycodenum: 0,
      kkbWHtime: null,
      paySearch: false,
      locationhref: window.location.origin,
      loading: false,
      wxMobile: "",
      wxCode: "",
      codeBtn: "获取验证码",
      isClick: false,
      isCounting: false,
      mobileuuid: "",
      errmsgMobileLogin: "为绑定课程，请通过手机验证码登录",
      errmsgMobileLoginFlag: false,
      rule: {
        mobile: {
          rule: /^1[1-9][0-9]\d{8}$/,
          message: "手机号格式不正确",
          requiredMsg: "手机号不能为空",
        },
        captcha: {
          rule: /^(\d){4}$/,
          message: "验证码格式不正确",
          requiredMsg: "验证码不能为空",
        },
      },
      payMaskMobile: false,
      mobileToast: false,
      mobileToastMsg: "提示",
      bindMobile: null,
      mobileLoginBtn: false,
      custom_data: this.$route.query.custom_data ? this.$route.query.custom_data : null,
      tenant_unionid: this.$route.query.tenant_unionid ? this.$route.query.tenant_unionid : null,
      source_unionid: this.$route.query.source_unionid ? this.$route.query.source_unionid : null,
      seller_id: this.$route.query.seller_id ? this.$route.query.seller_id : null,
      isPcDingTalkWS: isPcDingTalkWS(),
      isOnlyAliPay: null,
      PAYAGREEMENT: {},
      SpecialItemId: SpecialItemId,
      SpecialItemIdArrFlag: false,
      protocolMode: 0, // 协议勾选状态
      ckeckVal: false, // 协议复选框初始值
      isWechat: false,
      isIOS: false,
      courseInvalid: false,
      qrcodeModal: false,
      containShow: true,
      pcQrcodeInfo:{},
      isMobile:true,
      partList:[],
      groupCourseCode:null,
      skuUsable:null,
      skuDeposit:0, //0 sku无定金模式 1 sku有定金模式
      orderPaymentData:Object, // 组合商品定金模式数据
      broadcastId:'',
      isGoodsShelves:this.$route.query.isGoodsShelves,
      lichee:this.$route.query.lichee,
      HKYOperId:this.$route.query.HKYOperId, //直播间红包或者直播间货架带过来的 直播间id
      liveCloseAndBack:false,
      contentId:this.$route.query.contentId, // 直播间红包带过来的
      goodShelvId:this.$route.query.goodShelvId //直播间货架带过来的 货架id
    }
  },
  computed: {},
  components: {
    Dialog,
    Toast,
    Agreement,
    qrcodeModal,
    groupPayMessage,
    groupPayTypes
  },
  mounted() {
    this.setLiveVipcourseUrl()
    this.addEventOrder()
    this.handAppPage()
    this.handleTenant_unionid()
    this.handleSellerId()
    this.handLiveBtn()
    sessionStorage.setItem("courseCode", this.$route.params.code)
    sessionStorage.setItem("channelCode", this.$route.params.channel)
    if (isIOS()) {
      this.isIOS = true
      let that = this
      document.body.addEventListener("focusout", () => {
        // 收起
        that.$refs.showImg.addEventListener("touchmove", that.handle, false)
        that.$refs.mobileLoginBox.addEventListener("touchmove", that.handle, false)
        that.$refs.mobileLoginMast.addEventListener("touchmove", that.handle, false)
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
        window.scrollTo(0, Math.max(scrollHeight - 1, 0))
      })
      document.body.addEventListener("focusin", () => {
        // 弹起
        that.$refs.showImg.removeEventListener("touchmove", that.handle, false)
        // that.$refs.mobileLoginBox.removeEventListener('touchmove',that.handle,false);
        that.$refs.mobileLoginMast.removeEventListener("touchmove", that.handle, false)
      })
    }
    // 先请求一下
    // if (process.env.NODE_ENV === "development") {
    //   setToken("openid", "o0IXit58b0SRSYgjrWGtqunN_2dE")
    //   setToken("unionid", "oBB9ps_-tZhyD6w24TNY-RTgvK6I")
    //   this.getVipcourseInfo()
    // }

    if (this.tenant) {
      this.handletenant()
    }
    let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
    // 是微信内置浏览器需要授权;
    if (version !== -1) {
      this.isWechat = true
      if (isPcDingTalkWS()) {
        window.location = "http://study.kaikeba.com/wxlimit"
      } else {
        //授权获取code
        // this.wxAuthor();
        if (getToken("openid") && getToken("unionid")) {
          if(getToken("openid").indexOf("channelParams") === 0 || getToken("unionid").indexOf("channelParams") === 0){
            this.wxAuthor()
            return
          }
          authorize.getUserInfo(getToken("openid"))
          //获取vip详情
          this.getVipcourseInfo()
        } else {
          this.wxAuthor()
        }
      }
    } else {
      if (!isMobile()) {
        // pc 端展示该链接的二维码
        this.qrcodeModal = true
        document.body.style.overflow = "hidden";
        this.isMobile = false
      } else {
        this.isWechat = false;
        let orderId = this.$route.query.orderId
        if (orderId && orderId !== '') {
          this.paySearch = true;
        }
      }
      this.getVipcourseInfo(true);
    }
  },
  created() {},
  destroyed() {
    if (getToken("tenant_unionid_type")) {
      removeToken("tenant_unionid_type")
    }
  },
  methods: {
    // 直播间设置详情页链接
    setLiveVipcourseUrl(){
      if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){
        setToken('vipCurrentUrl',window.location.href)
      }
    },
    handLiveBtn(){
      let isWechat = navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? true : false
      if(this.lichee === 'lichee'){ // 直播间红包
        if (isWechat){
          this.liveCloseAndBack = false //微信内不需要展示
        }else {
          if(getToken('isShowLicheBtn') == '1'){
            this.liveCloseAndBack = true // h5 需要展示
          }
        }
      }else {
        if(this.isGoodsShelves === 'isTrue'){
          this.liveCloseAndBack = true
        }
      }
    },
    // 直播间返回货架列表
    linkToGoodsList(){
      if(this.lichee === 'lichee'){
        childrenPostMassage({success: 'closeLicheeBox'}) // 直播间通知顶层页面关闭红包弹窗（h5）
      }else {
        window.location.href = getToken('goodsListUrls')
      }

    },
    addEventOrder(){
      let that = this;
      window.addEventListener('storage', function(e) {
        if(e.key === 'goodsLinkUrl'){ // 微信环境 && 直播间间支付成功跳转成功页
          window.location.href = `${e.newValue}&isGoodsShelves=isTrue`
        }
        if(e.key === 'licheeLinkUrl'){ // 微信环境红包支付成功
          window.location.href = `${e.newValue}&isGoodsShelves=isTrue&lichee=lichee`
        }
        if(e.key === 'KKBLoginToken'){
          that.isLoginGoodsShelves(e.newValue)
        }
      })
    },
    // 如果是直播间过来的，电完支付后，关闭支付方式列表
    closeLivePayList(){
      if((this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee') && this.isWechat){
        this.shutPayBoxFalse()
      }
    },
    handAppPage(){
      if(isMobileLive === 'AnniversaryAPP'){
        this.getVipcourseInfo()
        return
      }
    },
    async isAppCreateOrder() {
      this.isAppLogin = await isLoginApp()
      if(this.isAppLogin){
        this.appPay()
      }else {
        this.appLogin()
      }
    },
    async appLogin() {
      let result = await goLogin()
      if (result.loginState == 1) {
        this.appPay()
      }
    },

    async appPay(){
      let orderSendData = {
        price: this.vipInfo.actualPrice * 100, // app支付价格基数是0.01元
        productCode: this.vipInfo.itemSkuCode,
        productName: this.vipInfo.courseName
      }
      let data = await payCourse(orderSendData)
      if(parseInt(data.payState) === 1){
        showToast('支付成功')
        window.location.reload()
      }else if(parseInt(data.payState) === 0){
        showToast('支付失败')
      }
    },

    // 支付方式
    choosePaytype(item){
      this.payItem = item // 支付方式
      this.depositGroupPayTypesMat = false
    },
    // 定金模式支付方式弹框
    depositPayTypesMatShow(){
      this.depositGroupPayTypesMat = true
    },
    depositPayTypesMatHide(){
      this.depositGroupPayTypesMat = false
    },
    // 定金模式支付详情弹框
    depositGroupPayMatHide(){
      this.depositGroupPayMat = false
    },
    // 定金模式判断sell
    goDownUrl() {
      clearTimeout(this.timer)
      if(Number(this.sell) === 1){
        let partListArr = []

        if(!this.parts && this.partList.length > 0){
          for(let x = 0; x < this.partList.length; x++){
            partListArr.push(this.partList[x].id)
          }
        }
        if(getToken("cacheuserid")){
          this.$router.push({
            path: routeUrl() + `GroupGoodsDeposit/${this.orderNo}/${getToken("openid")}/${getToken("cacheuserid")}`,
            query: {
              sub_goods_id: this.parts||partListArr.join(',')
            },
          })
        }

      }else{
        this.$router.push({
          path: routeUrl() + "downCash",
          query: {
            orderId: this.orderNo,
            sell: this.sell,
            sub_goods_id: this.parts
          },
        })
      }
    },
    confirmDown() {
      if (this.courseInvalid) {
        Toast.text({
          duration: 2000,
          message: "当前课程信息已过期，请联系销售顾问获取最新课程信息",
        })
        return
      }
      this.showDown = true
    },
    closeDown() {
      this.showDown = false
    },
    handleSellerId() {
      if (this.seller_id) {
        setToken("seller_id", this.seller_id)
      } else {
        removeToken("seller_id")
      }
    },
    handleTenant_unionid() {
      if (this.tenant_unionid) {
        setToken("unionid", this.tenant_unionid)
        setToken("tenant_unionid_type", "snsapi_base")
      }
    },
    wxCodeBlur() {
      window.scrollTop(0, 0)
    },
    handle(event) {
      event.preventDefault() //阻止元素发生默认的行为
    },
    onInput(e) {
      this.wxCode = e.target.value.slice(0, 4)
    },
    onInputNotWx(e) {
      this.registForm.verifycode = e.target.value.slice(0, 4)
    },
    getMobileLogin() {
      let that = this
      this.payMaskMobile = true
      this.mobileLoginFlag = true
      this.$refs.showImg.addEventListener("touchmove", that.handle, false)
      this.$refs.mobileLoginBox.addEventListener("touchmove", that.handle, false)
      this.$refs.mobileLoginMast.addEventListener("touchmove", that.handle, false)
      this.$refs.wxMobile.focus()
    },
    closeMobileLogin() {
      let that = this
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      this.$refs.showImg.removeEventListener("touchmove", that.handle, false)
      this.$refs.mobileLoginBox.removeEventListener("touchmove", that.handle, false)
      this.$refs.mobileLoginMast.removeEventListener("touchmove", that.handle, false)
      this.payMaskMobile = false
      this.mobileLoginFlag = false

      // document.querySelector('body').scrollTop(0)
      // window.scrollBy(0,1)
      // const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
      // window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    },
    clickWxMobile(e) {
      e.stopPropagation()
      this.$refs.wxMobile.focus()
    },
    // 验证手机验证码，并且登录
    checkCode() {
      let that = this
      let value = this.rule["captcha"]
      if (this.wxCode === "") {
        this.errmsgMobileLogin = "手机验证码不能为空"
        this.errmsgMobileLoginFlag = true
      } else if (!value.rule.test(this.wxCode)) {
        this.errmsgMobileLogin = "验证码格式不正确"
        this.errmsgMobileLoginFlag = true
      } else {
        checkVerificode(this.wxMobile, this.wxCode).then((res) => {
          if (res.data.code === 0) {
            that.errmsgMobileLogin = "为绑定课程，请通过手机验证码登录"
            that.errmsgMobileLoginFlag = false
            that.mobileLoginBtn = true
            getUuid(this.wxMobile).then((res) => {
              if (res.data.code === 0) {
                // that.handMobileToast('登录成功');
                that.mobileuuid = res.data.data.uid
                // 数美
                // if(that.vipInfo.type === 2 && that.vipInfo.validChannel === 1){
                  let userId = res.data.data.uid,
                   mobile=that.wxMobile,
                   pageUrl = window.location.href
                  dealSmDeviceId(userId,mobile,pageUrl,'login',shumeiSdk)
                // }

                that.closeMobileLogin()
                that.createOrder(res.data.data.uid)
              } else {
                that.handMobileToast("登录失败，请重新登录")
              }
              that.mobileLoginBtn = false
            })
          } else if (res.data.code === 10003) {
            that.handMobileToast("验证码错误")
          } else {
            that.handMobileToast(res.data.msg)
            that.errmsgMobileLogin = res.data.msg
            that.errmsgMobileLoginFlag = true
          }
        })
      }
    },
    // 检测手机格式
    checkPhoneNum() {
      let value = this.rule["mobile"]
      let mobile = this.wxMobile
      if (mobile === "") {
        this.errmsgMobileLogin = "手机号不能为空"
        this.errmsgMobileLoginFlag = true
        return false
      } else if (!value.rule.test(mobile)) {
        this.errmsgMobileLogin = "手机号格式不正确"
        this.errmsgMobileLoginFlag = true
        return false
      } else {
        this.isClick = true
        this.errmsgMobileLogin = "为绑定课程，请通过手机验证码登录"
        this.errmsgMobileLoginFlag = false
        return true
      }
    },
    // toast弹窗提示
    handMobileToast(msg) {
      let that = this
      this.mobileToast = true
      this.mobileToastMsg = msg
      setTimeout(function() {
        that.mobileToast = false
      }, 2500)
    },
    // 获取手机验证码
    getCode() {
      // 调接口获取验证码
      if (!this.isClick) {
        return false
      }
      this.$refs.mobileLoginCode.focus()
      getVerificode(this.wxMobile)
        .then((res) => {
          if (res.data.code === 0) {
            this.handMobileToast("验证码发送成功")
            // 60s倒计时
            this.countDown()
          } else {
            this.handMobileToast("验证码发送失败，请重新发送")
          }
        })
        .catch((err) => {
          this.handMobileToast("服务器维护，请稍后再试")
        })
    },
    // 登录
    mobileLogin() {
      if (this.checkPhoneNum()) {
        this.checkCode()
      }
    },
    courseLinkToSuccess() {
      if(Number(this.sell) === 1 && this.model === 1){
        window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${this.orderNo}`
        return
      }
      let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : ''
      let lichee = this.lichee === 'lichee' ? `&lichee=lichee` : ''
      window.location.href = `${cashierLink()}paysuccess?orderId=${this.orderNo}${isGoodsShelves}${lichee}`
    },
    // 处理低价小课租户参数
    handletenant() {
      let newTenant
      if (this.tenant) {
        newTenant = decodeURIComponent(this.tenant)
        this.thirdPartOpenId = getCaption(this.tenant, 1, "_")
        this.thirdPartAppid = getCaption(this.tenant, 0, "_")
      }
    },
    wxAuthor() {
      if (authorize.isEmpty(this.code)) {
        let query = location.search
          .slice(1)
          .split("?")[0]
          .split("&")
        let queryObject = {}
        query.forEach((item) => {
          queryObject[item.split("=")[0]] = decodeURIComponent(item.split("=")[1])
        })
        localStorage.setItem("channelParams", decodeURIComponent(queryObject.channelParams))
        authorize.obtainGetCode()
      } else {
        authorize.codeGetAccess(this.code, this.getVipcourseInfo)
      }
    },

    // 支付成功后 直接获取订单状态-
    async getOrderStatus(orderNo) {
      const res = await urlGetOrderStatus({ orderNo }).then((res) => {
        const resData = res && res.data
        if (resData.code === 0) {
          const { assignType, qrCode } = resData.data
          if (assignType === 3) {
            window.location.href = qrCode
            return false
          } else {
            return true
          }
        }
      })
      return res
    },
    //多个请求发送相同数据的函数
    sendDataFn() {
      let sendReqData = {
        courseCode: this.courseCode,
        channelCode: this.channelCode,
        openid: getToken("openid"),
        unionid: getToken("unionid"),
      }
      return sendReqData
    },
    // 处理特殊课程协议的课程名称
    handleCourseName(courseArr,itemId,Template,courseName){
      if (courseArr.includes(itemId)) {
        this.PAYAGREEMENT = Template
        this.SpecialItemIdArrFlag = true
        this.$nextTick(() => {
          this.$refs.refCourseName[0].innerHTML = `1. 乙方参加甲方开设的 ${courseName}`
        })
      }
    },
    /**
     * 获取课程
     * isNotWechat  不是微信环境的标记
     * cb 如果填入的手机号和当前存储的不一致，要重新设置，设置之后需要再次请求课程，cb是完成请求之后的回调
     */
    getVipcourseInfo(isNotWechattrue, cb) {
      let isNotWechat = isNotWechattrue
      if (isNotWechat !== true) {
        isNotWechat = false
      }
      if (isNotWechat && !(getCookie("auto_pay") && getCookie("auto_pay") == 1) && !sessionStorage.getItem("visited") && !cb) {
        // 如果是从落地页跳转过来，就不要设置openid
        // 如果已经输入一次手机号过了也不再设置
        let storageOpenid = localStorage.getItem("openid");
        if(storageOpenid && storageOpenid.indexOf("channelParamsMB") === -1){
          localStorage.setItem("openid", "channelParams" + Math.ceil(Math.random() * 1000000))
          localStorage.setItem("unionid", "channelParams" + new Date().valueOf())
        }
      }
      if (isNotWechat) {
        if(getCookie("phone") && getCookie("wx_uid")){
          sessionStorage.setItem("phone", getCookie("phone"))
          sessionStorage.setItem("wx_uid", getCookie("wx_uid"))
        }
        if (getCookie("auto_pay") && getCookie("auto_pay") == 1 && getCookie("phone") && getCookie("wx_uid")) {
          sessionStorage.setItem("auto_pay", getCookie("auto_pay"))
          sessionStorage.setItem("phone", getCookie("phone"))
          sessionStorage.setItem("wx_uid", getCookie("wx_uid"))
          document.cookie = "auto_pay=0; domain=.kaikeba.com; path=/"
          sessionStorage.setItem("visited", "true")
        }
      }
      let sendData = this.sendDataFn()
      sendData.sell = this.sell
      if(this.sell == 1 && this.parts && this.parts !== ''){
        sendData.parts = this.parts
      }
      urlGetVipcourseInfo(sendData).then(async (res) => {
        if (res.data.code == 0) {
          let resData = res.data.data
          let shareResData = JSON.stringify(res.data.data)
          // 生成pc端二维码相应信息
          let url = this.thirdPartAppid ? `${cashierLink()}vip_course/${this.courseCode}/${this.channelCode}?tenant=${this.thirdPartAppid}&sell=${this.sell}` : `${cashierLink()}vipcourse/${this.courseCode}/${this.channelCode}`
          this.pcQrcodeInfo = {name: Number(this.sell) === 1 ? resData.name : resData.courseName,url:url}
          // let resData = vipInfoData.data;
          //分享
          share.init(resData.groupShareTitle, resData.shareDescription, resData.shareCoverImage, resData.friendCircleTitle)
          //end
          setToken("courseType", resData.courseType)
          setToken("vipCourseDetail", shareResData)
          setToken("courseModel", resData.model)

          // 判断是否是组合商品
          if(Number(this.sell)===1){
            document.title = resData.name
            this.skuDeposit = resData.skuDeposit
            if(resData.partList){
              this.partList = resData.partList
            }
            if((resData.channelStatus === 1 && resData.model === 1)|| resData.skuDeposit===1){
              this.model = 1
            }
            setToken("courseModel", this.model)
            this.vipInfo.price = resData.totalPrice
          }else{
            this.model = resData.model
            document.title = resData.courseName
            this.vipInfo.price = resData.price
          }
          if(Number(this.sell) === 1){
            this.groupCourseCode =  resData.code
            this.skuUsable = resData.skuUsable
            this.vipInfo.validChannel = resData.channelStatus // 渠道是否有效 0 无效 1 有效
          }else{
            this.vipInfo.validChannel = resData.validChannel // 渠道是否有效 0 无效 1 有效
          }
          this.bindMobile = resData.bindMobile === 1 ? true : false
          this.protocolMode = resData.protocolMode
          this.vipInfo.actualPrice = resData.amount
          this.vipInfo.coupon = resData.discount
          this.vipInfo.use = resData.used
          this.vipInfo.classStatus = resData.classStatus
          this.vipInfo.type = resData.type // 渠道的类型 0：默认、1：折扣、2：推广

          this.vipInfo.startTime = resData.startTime
          this.vipInfo.endTime = resData.endTime
          this.vipInfo.payStatus = resData.payStatus
          this.vipInfo.text = resData.text
          this.vipInfo.once = resData.once
          this.vipInfo.itemSkuCode = resData.itemSkuCode
          this.vipInfo.courseName = resData.courseName
          this.orderNo = resData.orderNo
          this.courseInvalid = parseInt(resData.validChannel) === 0 ? true : false
          this.begin = resData.startTime ? (Math.round(new Date().getTime() / 1000) >= resData.startTime ? true : false) : false
          this.end = resData.endTime ? (Math.round(new Date().getTime() / 1000 <= resData.endTime) ? true : false) : false
          this.vipInfo.courseType = resData.courseType
          this.markFoot = resData.courseType
          this.itemId = resData.itemId
          this.getPayList(resData.payChannel)


          // '0 待付款 1 处理中（至少支付过一笔）（如分期支付，订金，尾款支付，完成了部分支付）2 已付款 3 超时 4 退款 5 部分退款 6已取消'
          // if (resData.orderStatus === 1 && resData.model === 1) {

          // }
          // if (resData.orderStatus === 2 && resData.model === 1) {
          //   this.depostLinkToSuccess() //直接跳转到二维码页面
          // }
          //VIP课程图片
          if (!cb) {
            let imgKey =Number(this.sell)===1? resData.contentImage : resData.icon
            let imgUrl = imgKey.substring(0, imgKey.length - 6),
              imgCount = imgKey.substring(imgKey.length, imgKey.length - 2)
            this.vipInfo.vipCourseImgList = []
            if (imgKey.indexOf("_") === -1) {
              if(imgKey.indexOf('http') === 0){
                this.vipInfo.vipCourseImgList.push(imgKey)
              }else{
                this.vipInfo.vipCourseImgList.push("https://img.kaikeba.com/" + imgKey)
              }

            } else {
              for (let i = 1; i <= parseInt(imgCount); i++) {
                if (i > 9) {
                  if(imgKey.indexOf('http') === 0){
                    this.vipInfo.vipCourseImgList.push( imgUrl + "_" + i + "_" + imgCount)
                  }else{
                    this.vipInfo.vipCourseImgList.push("https://img.kaikeba.com/" + imgUrl + "_" + i + "_" + imgCount)
                  }
                } else {
                  if(imgUrl.indexOf('http') === 0){
                    this.vipInfo.vipCourseImgList.push(imgUrl + "_0" + i + "_" + imgCount)
                  }else{
                    this.vipInfo.vipCourseImgList.push("https://img.kaikeba.com/" + imgUrl + "_0" + i + "_" + imgCount)
                  }

                }
              }
            }
          }
          // 获取order状态-
          if (resData.orderNo) {
            const isType3 = await this.getOrderStatus(resData.orderNo)
            if (!isType3) return
          }
          // 此处动态判断支付协议内容
          if (resData.courseType === 0 || Number(this.sell) === 1) {
            this.PAYAGREEMENT = PAYAGREEMENT.Template1
          } else {
            if (resData.itemId === SpecialItemId) {
              this.PAYAGREEMENT = PAYAGREEMENT.Template2
            }
          }
          if (SpecialItemIdArr.includes(resData.itemId)) {
            this.PAYAGREEMENT = PAYAGREEMENT.Template3
            this.SpecialItemIdArrFlag = true
          }
          this.handleCourseName(SpecialItemIdArr2,resData.itemId,PAYAGREEMENT.Template4,resData.courseName)
          this.handleCourseName(factoryCourse,resData.itemId,PAYAGREEMENT.Template5,resData.courseName)
          this.handleCourseName(SpecialItemIdArr3,resData.itemId,PAYAGREEMENT.Template6,resData.courseName)
          this.handleCourseName(SpecialItemIdArr4,resData.itemId,PAYAGREEMENT.Template7,resData.courseName)
          this.handleCourseName(SpecialItemIdArr5,resData.itemId,PAYAGREEMENT.Template8,resData.courseName)
          this.handleCourseName(millionCourse,resData.itemId,PAYAGREEMENT.Template9,resData.courseName)
          this.handleCourseName(scholarshipCard,resData.itemId,PAYAGREEMENT.Template12,resData.courseName)
          this.handleCourseName(xiaokepeiyouFixCard,resData.itemId,PAYAGREEMENT.Template13,resData.courseName)
          this.handleCourseName(dataChanpinFixCard,resData.itemId,PAYAGREEMENT.Template14,resData.courseName)
          
          
          // 培优班指定支付协议
          this.handleCourseName(webExcellentCourse,resData.itemId,PAYAGREEMENT.Template10,resData.courseName)
          // 畅学卡课程协议
          if (changXueCard.includes(resData.itemId)) {
            this.PAYAGREEMENT = PAYAGREEMENT.Template11
            this.SpecialItemIdArrFlag = true
          }
          if (!cb) {
            if (resData.protocolStatus == 1) {
              this.vipInfo.protocolStatus = true
            } else {
              this.vipInfo.protocolStatus = false
            }
            //课程价格小于600或者cheeseId为null的时候不展示分期按钮
            if (resData.amount < 600 || resData.cheeseId == null) {
              this.payTypeZSFlag = false
            }
            // //课程价格小于1000不展示芝士分期按钮
            // if (resData.amount < 1000) {
            //     this.payTypeCheeseFlag = false
            // }
          }

          if (cb) {
            sessionStorage.setItem("visited", "true")
          }
          if (resData.model === 1) {
            if (resData.orderStatus === 1) {
              this.goDownUrl()
            }
            if (resData.orderStatus === 2) {
              Number(this.sell) === 1 ? "" : this.depostLinkToSuccess()
            }
          } else {
            // 判断显示报名还是购买的状态
            if (resData.payStatus == 1 && resData.binding == 0) {
              if (this.vipInfo.courseType == 0) {
                this.btnState2 = false
                this.btnState3 = true
                this.btnState1 = false
                this.handleBigCourseLink()
              } else {
                this.btnState1 = false
                this.btnState2 = false
                this.btnState3 = false
                this.btnState4 = true
                if (this.kkbWHtime) {
                  clearInterval(this.kkbWHtime)
                  this.kkbWHtime = null
                }
                isNotWechat = false

                this.loading = false

                this.courseLinkToSuccess() //直接跳转到二维码页面
              }
            } else if (resData.payStatus == 1 && resData.binding == 1) {
              if (this.vipInfo.courseType == 0) {
                this.btnState3 = false
                this.btnState2 = true
                this.btnState1 = false
                this.handleBigCourseLink()
              } else {
                this.btnState1 = false
                this.btnState2 = false
                this.btnState3 = false
                this.btnState4 = true
                if (this.kkbWHtime) {
                  clearInterval(this.kkbWHtime)
                  this.kkbWHtime = null
                }
                this.loading = false
                isNotWechat = false
                this.courseLinkToSuccess() //直接跳转到二维码页面
              }
            } else {
              this.btnState1 = true
              this.btnState2 = false
              this.btnState3 = false
              if (cb) {
                cb()
              }
            }
          }
          //展示倒计时
          if (!cb) {
            if (resData.type === 1 && resData.payStatus !== 1 && this.end) {
              this.countTime()
            }
          }

          if (!cb) {
            if (isNotWechat) {
              if (
                sessionStorage.getItem("auto_pay") &&
                sessionStorage.getItem("auto_pay") == 1 &&
                sessionStorage.getItem("phone") &&
                sessionStorage.getItem("wx_uid")
              ) {
                this.registForm.phoneNumber = sessionStorage.getItem("phone")
                this.createOrder(sessionStorage.getItem("wx_uid"))
              }
            }
          }
        }
      })
      if (isNotWechat) {
        if (
          sessionStorage.getItem("auto_pay") &&
          sessionStorage.getItem("auto_pay") == 1 &&
          sessionStorage.getItem("phone") &&
          sessionStorage.getItem("wx_uid")
        ) {
          Toast.loading({
            duration: 1500,
            message: "正在加载支付...",
          })
          this.loading = true
        }
      }
    },
    depostLinkToSuccess() {
      window.location.href = `${cashierLink()}downsuc?orderId=${this.orderNo}&type=2`
    },

    //绑定账号，默认到注册页面
    handleBigCourseLink() {
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
      //是微信内置浏览器需要授权
      if (version === -1) {
        this.paySearch = false
        this.toLogin()
      }
    },
    toLogin() {
      let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : ''
      let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : ''
      window.location.href = `${routeUrl()}bindsuccess?code=${this.courseCode}&channel=${this.channelCode}${isGoodsShelves}${lichee}`
      // this.$router.push({
      //   path: routeUrl() + "bindsuccess?code=" + this.courseCode + "&channel=" + this.channelCode + isGoodsShelves + lichee,
      // })
    },
    getVerifycode() {
      let rul = this.rule["mobile"]
      if (!this.registForm.phoneNumber) {
        Toast.fail({
          duration: 1000,
          message: "手机号码为必填项",
        })
      } else if (!parseInt(this.registForm.phoneNumber) || this.registForm.phoneNumber.length !== 11 || !rul.rule.test(this.registForm.phoneNumber)) {
        Toast.fail({
          duration: 1000,
          message: "手机号码格式错误",
        })
      } else {
        if (this.Verify) return
        let result = getVerificode(this.registForm.phoneNumber)
        result
          .then((result) => {
            this.getVerifycodeclicked = true
            this.Verifycodenum = 60
            this.Verify = setInterval(() => {
              this.Verifycodenum = this.Verifycodenum - 1
              if (this.Verifycodenum === 0) {
                clearInterval(this.Verify)
                this.getVerifycodeclicked = false
                this.Verify = null
              }
            }, 1000)
            Toast.success({
              duration: 1000,
              message: "验证码已发送",
            })
          })
          .catch((e) => {
            {
              console.log(e)
            }
          })
      }
    },

    registLogin() {
      debugger
      if (!this.registForm.phoneNumber) {
        Toast.fail({
          duration: 1000,
          message: "手机号码为必填项",
        })
      } else if (!parseInt(this.registForm.phoneNumber) || this.registForm.phoneNumber.length !== 11) {
        Toast.fail({
          duration: 1000,
          message: "手机号码格式错误",
        })
      } else if (!this.registForm.verifycode) {
        Toast.fail({
          duration: 1000,
          message: "验证码为必填项",
        })
      } else if (!parseInt(this.registForm.verifycode) || this.registForm.verifycode.length !== 4) {
        Toast.fail({
          duration: 1000,
          message: "验证码码格式错误",
        })
      } else {
        let formdata = new FormData()
        formdata.append("phone", this.registForm.phoneNumber)
        formdata.append("code", this.registForm.verifycode)
        if (this.channelParams && this.channelParams !== "undefined") {
          try {
            let channel = JSON.parse(decodeURIComponent(this.channelParams))
            gio("track", "Data_submission_small_phone", {
              userid: localStorage.getItem("openid"),
              Data_enroll_small_type: channel.utm_source,
              Data_buy_small_url: channel.utm_content,
              Data_click_small_class_ID: this.courseCode,
              Data_submission_small_phone: this.registForm.phoneNumber,
            })
          } catch (e) {
            if (localStorage.getItem("channelParams")) {
              let channel = JSON.parse(localStorage.getItem("channelParams"))
              gio("track", "Data_submission_small_phone", {
                userid: localStorage.getItem("openid"),
                Data_enroll_small_type: channel.utm_source,
                Data_buy_small_url: channel.utm_content,
                Data_click_small_class_ID: this.courseCode,
                Data_submission_small_phone: this.registForm.phoneNumber,
              })
            }
            console.log(e)
          }
        }
        const ua = navigator.userAgent.toLowerCase().indexOf("micromessenger")
        // 没设置手机号
        if (ua === -1) {
          let storageUnionid = localStorage.getItem("unionid")
          if (storageUnionid && storageUnionid.indexOf("channelParamsMB") === -1) {
            localStorage.setItem("openid", "channelParamsMB" + this.registForm.phoneNumber)
            localStorage.setItem("unionid", "channelParamsMB" + this.registForm.phoneNumber)
            this.getVipcourseInfo(true, () => {
              createOrder.apply(this)
            })
          }
          // 设置了手机号但不是当前填入的手机号
          else if (storageUnionid && storageUnionid.indexOf(this.registForm.phoneNumber) === -1) {
            localStorage.setItem("openid", "channelParamsMB" + this.registForm.phoneNumber)
            localStorage.setItem("unionid", "channelParamsMB" + this.registForm.phoneNumber)
            this.getVipcourseInfo(true, () => {
              createOrder.apply(this)
            })
          } else {
            createOrder.apply(this)
            // 直接生成订单，已经注册过
          }
        } else {
          createOrder.apply(this)
        }
        let that = this
        function createOrder() {
          kkblogin(formdata).then((result) => {
            if (result.data.code === 0) {
              if (result.data.data.data.uid) {
                // if(that.vipInfo.type === 2 && that.vipInfo.validChannel === 1){
                  let userId = result.data.data.data.uid,
                   mobile=that.registForm.phoneNumber,
                   pageUrl = window.location.href
                  dealSmDeviceId(userId,mobile,pageUrl,'login',shumeiSdk)
                // }

                localStorage.setItem("cacheuserid", result.data.data.data.uid)
                this.createOrder(result.data.data.data.uid)
              } else {
                Toast.fail({
                  duration: 1000,
                  message: "请求出错请重试",
                })
              }
            } else if (result.data.code !== 0) {
              let message = result.data.msg
              if (message.indexOf("mobile code") !== -1) {
                message = "验证码错误"
              }
              Toast.fail({
                duration: 1500,
                message: message,
              })
            }
          })
        }
      }
    },

    getPayList(data) {
      let payArr = data||[]
      this.payListNew = payArr
      if (isPcDingTalkWS()) {
        let datas = payArr.filter((item) => item.payType !== 1)
        if (datas.length && datas.length === 1 && datas[0].code === "ALIPAY") {
          this.isOnlyAliPay = true
        }
        this.payListNew = datas
      }
      this.payItem = this.payListNew[0]
    },
    //关闭遮罩层
    shutPayBoxFalse() {
      this.payMask = false
      this.showPayMark = false
      this.showEleProMask = false
      document.querySelector("body").setAttribute("style", "overflow:scroll")
      this.closeMobileLogin()
    },
    //创建订单
    createOrder(userid) {
      if (userid) {
        localStorage.setItem("cacheuserid", userid)
      }
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
      let sendData = this.sendDataFn()
      if (version === -1) {
        if (isPcDingTalkWS()) {
          sendData.unionid = ""
        } else {
          sendData.unionid = ""
          sendData.endpoint = "PE-H5"
        }
      }
      if (version !== -1) {
        sendData.buyerId = this.mobileuuid
        sendData.mobile = this.wxMobile
      }
      sendData.appOpenid = this.thirdPartOpenId
      sendData.appid = this.thirdPartAppid
      let passback_params = {}
      if (this.channelParams && this.channelParams !== "undefined") {
        try {
          let channel = JSON.parse(decodeURIComponent(this.channelParams))
          if (channel.utm_source) {
            passback_params = {
              type: channel.utm_source || "",
              content: channel.utm_content || "",
              medium: channel.utm_medium || "",
              campaign: channel.utm_campaign || "",
              term: channel.utm_term || "",
              phone: this.registForm.phoneNumber,
            }
            if (channel.utm_source == "wechat_moments") {
              passback_params["medium"] = passback_params["content"]
            }
          }
        } catch (e) {
          passback_params = {
            type: "natural",
            content: "",
            medium: "",
            campaign: "",
            term: "",
            phone: this.registForm.phoneNumber,
          }
          // baoxianyllyh
          if (localStorage.getItem("channelParams")) {
            let channel = JSON.parse(localStorage.getItem("channelParams"))
            if (channel.utm_source) {
              passback_params = {
                type: channel.utm_source || "",
                content: channel.utm_content || "",
                medium: channel.utm_medium || "",
                campaign: channel.utm_campaign || "",
                term: channel.utm_term || "",
                phone: this.registForm.phoneNumber,
              }
              if (channel.utm_source == "wechat_moments") {
                passback_params["medium"] = passback_params["content"]
              }
            }
            localStorage.removeItem("channelParams") //tybwslsyh
          }
        }
      }
      if (userid) sendData.user_id = userid
      if (userid && this.registForm.phoneNumber) {
        sendData.buyerId = userid
        sendData.mobile = this.registForm.phoneNumber
      }
      if (this.custom_data) {
        passback_params.custom_data = this.custom_data
      }
      if (this.source_unionid) {
        passback_params.source_unionid = this.source_unionid
      }
      if (this.seller_id) {
        passback_params.seller_id = this.seller_id
      }
      if(Number(this.sell) === 1){
        sendData.courseCode = this.groupCourseCode
      }
      if(this.HKYOperId){
        passback_params.operId = this.HKYOperId
      }
      if(this.contentId){
        passback_params.contentId = this.contentId
      }
      if(this.goodShelvId){
        passback_params.shelvesId = this.goodShelvId
      }
      sendData.passback_params = JSON.stringify(passback_params)
      sendData.returnUrl = Number(this.sell) === 1 && this.model === 1?`${cashierLink()}groupDepositSuccess` : `${cashierLink()}paysuccess`
      sendData.orderStrategy = Number(this.sell) === 1 ? 2 : 1  // 1 普通订单 2  组合商品订单
      sessionStorage.setItem("visited", "true")
      urlCreateOrder(sendData).then((res) => {
        if (res.data.code == 0) {
          // 0线上订单1线下订单  2 定金模式订单
          if(res.data.data.vipOrderType === 2 && Number(this.sell)===1){
            this.model = 1
          }
          // orderType 0为0元订单，1为正常订单
          if (res.data.data.orderType === 0) {
            let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : ''
            let lichee = this.lichee === 'lichee' ? `&lichee=lichee` : ''
            window.location.href = Number(this.sell) === 1 && this.model === 1? `${cashierLink()}groupDepositSuccess?orderId=${res.data.data.orderNo}`:`${cashierLink()}paysuccess?orderId=${res.data.data.orderNo}${isGoodsShelves}${lichee}`
            return
          }
          // 0 待付款 1 处理中（如分期支付，订金，尾款支付，完成了部分支付）2 已付款 3 超时 4 退款 5 部分退款 6已取消
          if (res.data.data.orderStatus && res.data.data.orderStatus === 2 && this.model === 1) {
            Number(this.sell)=== 1 ?  window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${res.data.data.orderNo}` :
            window.location.href = `${cashierLink()}downsuc?orderId=${res.data.data.orderNo}&type=2`
            return 
          }
          if(Number(this.sell) === 1 && this.model !== 1){
            this.orderNo = res.data.data.orderNo
            let params = {
              no: res.data.data.orderNo,
              unionid:getToken("unionid"),
              openid:res.data.data.openid,
              parts:this.parts||'',
              userId:getToken("cacheuserid"),
            }
            groupPayment(params).then((res)=>{
              if(res.data.code === 0){
                this.getPayList(res.data.data.payChannels)
                this.payMask = true
                this.showPayMark = true
                this.stopScroll()
              }
            })
            return 0
          }
          // 判断支付弹框
          if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
            this.payMask = true
            this.showPayMark = true
            this.stopScroll()
          }
          if (version === -1 && res.data.data.openid && res.data.data.openid != "") {
            setToken("openid", res.data.data.openid)
          }
          this.orderNo = res.data.data.orderNo
          if (this.model === 1) {
            this.goDownUrl()
          }
          this.kkbregist = false
          if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
            // 钉钉内
            if (this.model !== 1) {
              if (isPcDingTalkWS()) {
                if (this.isOnlyAliPay) {
                  this.unityPay("ALIPAY")
                  return
                }
                this.payMask = true
                this.showPayMark = true
                this.stopScroll()
                sessionStorage.setItem("auto_pay", 0)
                return
              }

              if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){
                console.log('window.location.reload()')
                setTimeout(function () {
                  window.location.reload()
                },1580)
              }else {
                if (!this.kkbWHtime) {
                  let _that_ = this
                  this.kkbWHtime = setTimeout(function() {
                    _that_.loading = false
                    _that_.paySearch = true
                  }, 1580)
                }
              }
              sessionStorage.setItem("auto_pay", 0)
              // h5支付主动查询，延迟50执行
              this.unityPay("WECHAT_MWEB")
            }
          }
        } else if (res.data.code == 60005) {
          this.payMask = true
          this.showPayMark = true
          this.stopScroll()
          this.orderNo = res.data.data
        } else if (res.data.code === 60008) {
          this.payMask = false
          this.showPayMark = false
          document.querySelector("body").setAttribute("style", "overflow:scroll")
          Toast.fail({
            duration: 1000,
            message: "信息不一致，请重新授权",
          })
          this.wxAuthor()
        } else {
          this.payMask = false
          this.showPayMark = false
          document.querySelector("body").setAttribute("style", "overflow:scroll")
          Toast.fail({
            duration: 1000,
            message: res.data.msg,
          })
        }
        this.$set(this, "orderresult", res)
      })
    },

    // 直播货架判断是否登录
    isLoginGoodsShelves(ipsToken){
      let that = this;
      if(ipsToken){
        getIpsInfo(`h5:${ipsToken}`).then(res=>{
          if(res.data.code === 0){
            if(this.isWechat){ // 直播间微信内
              this.mobileuuid = res.data.data.uid
              this.wxMobile = res.data.data.mobile
              this.createOrder(this.mobileuuid)
            }else { // 直播间微信外
              localStorage.setItem("openid", "channelParamsMB" + res.data.data.mobile)
              localStorage.setItem("unionid", "channelParamsMB" + res.data.data.uid)
              sessionStorage.setItem("phone", String(res.data.data.mobile))
              sessionStorage.setItem("wx_uid", String(res.data.data.uid))
              this.mobile = String(res.data.data.mobile)
              this.registForm.phoneNumber = String(res.data.data.mobile)
              this.getVipcourseInfo(true, () => {
                that.createOrder(String(res.data.data.uid))
              })
            }
          }else {
            this.ipsLogin()
          }
        })
      }else {
        this.ipsLogin()
      }
    },

    //ipsLogin 学习中心h5登录
    ipsLogin(){
      childrenPostMassage({success:'KKBLoginH5'})
    },

    createOrderStepOne() {
      let that = this;
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
      this.closeDown()
      if (this.courseInvalid) {
        Toast.text({
          duration: 2000,
          message: "当前课程信息已过期，请联系销售顾问获取最新课程信息",
        })
        return
      }

      if (this.model === 1) {
        if (sessionStorage.getItem("phone") && sessionStorage.getItem("wx_uid")) {
          this.registForm.phoneNumber = sessionStorage.getItem("phone")
          this.createOrder(sessionStorage.getItem("wx_uid"))
        } else {
          this.kkbregist = true
          this.$nextTick(() => {
            this.$refs.inputphoneNumber.focus()
          })
          if (this.kkbWHtime) {
            clearInterval(this.kkbWHtime)
            this.kkbWHtime = null
          }
        }
      } else {
        if (version === -1) {
          if(this.isGoodsShelves === 'isTrue'){ // 直播货架h5 支付逻辑
            if(sessionStorage.getItem("phone") && sessionStorage.getItem("wx_uid")){
              localStorage.setItem("openid", "channelParamsMB" + sessionStorage.getItem("phone"))
              localStorage.setItem("unionid", "channelParamsMB" + sessionStorage.getItem("phone"))
              this.registForm.phoneNumber = sessionStorage.getItem("phone")
              this.getVipcourseInfo(true, () => {
                that.createOrder(String(sessionStorage.getItem("wx_uid")))
              })
            }else { // 没有的话，判断cook里面有没有token，有的话拿着token 去请求新消息，没有的话，调学习中心的登录框
              let ipsToken = getCookie(LEARNEDU_TOKEN)
              this.isLoginGoodsShelves(ipsToken)
            }
            return
          }
          if (sessionStorage.getItem("phone") && sessionStorage.getItem("wx_uid")) {
            this.registForm.phoneNumber = sessionStorage.getItem("phone")
            this.createOrder(sessionStorage.getItem("wx_uid"))
          } else {
            if (sessionStorage.getItem("visited")) {
              this.registForm.phoneNumber = localStorage.getItem("openid").split("channelParamsMB")[1]
              this.createOrder(localStorage.getItem("cacheuserid"))
            } else {
              this.kkbregist = true
              this.$nextTick(() => {
                this.$refs.inputphoneNumber.focus()
              })
              if (this.kkbWHtime) {
                clearInterval(this.kkbWHtime)
                this.kkbWHtime = null
              }
            }
          }
        } else {
          // 微信内获取手机号，换取uuid成功后，创建订单，传给后端
          if (this.bindMobile) {
            if (this.mobileuuid !== "" && this.mobileuuid) {
              if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){ // 如果是直播间，先调详情接口，再下单
                this.getVipcourseInfo(true, () => {
                  that.createOrder(this.mobileuuid)
                })
              }else {
                that.createOrder(this.mobileuuid)
              }
            } else {
              // 检测unionid
              getCheckUninonid(getToken("unionid"))
                .then((res) => {
                  if (res.data.code === 0) {
                    this.mobileuuid = String(res.data.data.uid)
                    this.wxMobile = String(res.data.data.mobile)
                    this.createOrder(this.mobileuuid)
                  } else {
                    if(this.isGoodsShelves === 'isTrue'){ // 直播间手机登录框
                      this.ipsLogin()
                    }else {
                      this.getMobileLogin() // 微信弹起手机登录框
                    }
                  }
                })
                .catch((err) => {
                  if(this.isGoodsShelves === 'isTrue'){ // 直播间手机登录框
                    this.ipsLogin()
                  }else {
                    this.getMobileLogin() // 微信弹起手机登录框
                  }
                })
            }
          } else {
            getCheckUninonid(getToken("unionid"))
              .then((res) => {
                if (res.data.code === 0) {
                  this.mobileuuid = String(res.data.data.uid)
                  this.wxMobile = String(res.data.data.mobile)
                }
                this.createOrder(this.mobileuuid)
              })
              .catch((err) => {
                this.createOrder()
              })
          }
        }
      }
    },
    //微信支付
    wxPay(payType) {
      // this.closeLivePayList()
      let wxPayParams = {},
        //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
        sendData = {
          openid: getToken("openid"),
          orderNo: this.orderNo,
          payType: payType,
          // unionid:getToken('unionid')
        }
      //请求获取wxPayParams
      let payRequest;
      if(Number(this.sell) === 1){
         sendData = {
          openid: getToken("openid")||"",
          orderNo: this.orderNo||"",
          payType: payType||"",
          unionid:getToken('unionid')||"",
          parts:this.parts||"",
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
      let that = this
      payRequest
        .then((res) => {
          if (res.data.code == 0) {
            if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
              let flag = location.href.indexOf("?") != -1 ? "&" : "?"
              if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){
                let goodsLiveUrlLink = getToken('goodsLiveUrlLink')
                let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : '' // 直播间货架参数
                let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : ''  // 直播间红包参数
                childrenPostMassage({ success: 'wxPayH5',payUrl:res.data.data.mwebUrl + "&redirect_url=" + encodeURIComponent(`${cashierLink()}goodsshelves?orderId=${this.orderNo}${isGoodsShelves}${lichee}&liveUrl=${goodsLiveUrlLink}`)})
              }else {
                location.assign(res.data.data.mwebUrl + "&redirect_url=" + encodeURIComponent(location.href + flag + "orderId=" + this.orderNo))
              }
            } else {
              //获取jsApiParameData
              wxPayParams.appId = res.data.data.appId //公众号名称，由商户传入
              wxPayParams.timeStamp = res.data.data.timeStamp //时间戳，自1970年以来的秒数
              wxPayParams.nonceStr = res.data.data.nonceStr //随机串
              wxPayParams.package = res.data.data.packageValue
              wxPayParams.signType = res.data.data.signType //微信签名方式：
              wxPayParams.paySign = res.data.data.paySign //微信签名
              if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){
                wxPayParams.orderNo = this.orderNo
                wxPayParams.isGoodsShelves = this.isGoodsShelves
                wxPayParams.lichee = this.lichee
                childrenPostMassage({ success: 'wxPay', payObj: wxPayParams })
              }else {
                implementWxPay()
              }
            }
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            })
            this.wxAuthor()
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            })
          }
        })
        .catch((err) => {
          console.log("wxPay", err)
        })
      // let _this = this;

      //H5调起微信支付
      let onBridgeReady = () => {
        WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, async (res) => {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 加类型判断 跳转逻辑-
            const isType3 = await this.getOrderStatus(this.orderNo)
            if (!isType3) return
            //成功后跳转到支付成功页面
            if(Number(this.sell) === 1 && this.model === 1){
              window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${this.orderNo}`
            }else{
              let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : ''
              let lichee = this.lichee === 'lichee' ? `&lichee=lichee` : ''
              window.location.href = `${cashierLink()}paysuccess?orderId=${this.orderNo}${isGoodsShelves}${lichee}`
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
    },
    //支付宝支付
    aliPay(payType) {
      this.closeLivePayList()
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: payType,
      }

      if(Number(this.sell) === 1){
         sendData = {
          openid: getToken("openid")||"",
          orderNo: this.orderNo||"",
          payType: payType,
          unionid:getToken('unionid')||"",
          parts:this.parts||"",
          userId:getToken("cacheuserid"),
          endpoint:""
        }
        // payRequest =
        if (version === -1 && !isPcDingTalkWS()) {
          sendData.endpoint = "PE-H5"
        }
        groupPayorder(sendData).then((res)=>{
          if (res.data.code == 0) {
            top.location.href =
              routeUrl() +
              "alipay/" +
              this.orderNo +
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
      }else{
        // payRequest = urlPay(sendData)
        //请求获取支付宝参数
        urlPay(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            top.location.href =
              routeUrl() +
              "alipay/" +
              this.orderNo +
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

    },

    // 京东支付
    jdPay(payType) {
      this.closeLivePayList()
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: payType,
      }
      if(Number(this.sell) === 1){
        sendData = {
          openid: getToken("openid")||"",
          orderNo: this.orderNo||"",
          payType: payType,
          unionid:getToken('unionid')||"",
          parts:this.parts||"",
          userId:getToken("cacheuserid"),
          endpoint:""
        }
        // payRequest =
        if (version === -1 && !isPcDingTalkWS()) {
          sendData.endpoint = "PE-H5"
        }
        groupPayorder(sendData).then((res)=>{
          if (res.data.code == 0) {
            if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
              window.location.href = res.data.data.webUrl
            } else {
              top.location.href =
                      routeUrl() +
                      "jdpay/" +
                      this.orderNo +
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
        })
      }else{
        urlPay(sendData).then((res) => {
          if (res.data.code == 0) {
            if (navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
              window.location.href = res.data.data.webUrl
            } else {
              top.location.href =
                      routeUrl() +
                      "jdpay/" +
                      this.orderNo +
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
    },

    closeRegist() {
      this.kkbregist = false
      this.closeMobileLogin()
    },
    /*
     * 分期支付
     * 1、payType：9 -- 代表芝士分期；
     * 2、payType：5 -- 代表信用卡分期；
     * */
    stagesPay(payType) {
      this.closeLivePayList()
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: payType,
      }
      if(Number(this.sell) === 1){
         sendData = {
          openid: getToken("openid")||"",
          orderNo: this.orderNo||"",
          payType: payType||"",
          unionid:getToken('unionid')||"",
          parts:this.parts||"",
          userId:getToken("cacheuserid"),
          endpoint:""
        }
        if (version === -1 && !isPcDingTalkWS()) {
          sendData.endpoint = "PE-H5"
        }
        groupPayorder(sendData).then((res)=>{
          if (res.data.code == 0) {
            top.location.href = res.data.data.payUrl
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            })
          }
        })
      }else{
        urlPay(sendData)
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
      //type == 'CHEESE' ? 5 : 6

    },

    unityPay(type) {
      // 判断是否勾选协议 protocolMode:0 默认勾选 1 手动勾选
      if (this.protocolMode === 1 && !this.ckeckVal && this.isWechat) {
        Toast.text({
          duration: 2000,
          message: "请先勾选协议！",
        })
        this.$nextTick(() => {
          document.getElementsByClassName("weui-toast_text")[0].style.zIndex = 99999
        })
        return
      }
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
        orderNo: this.orderNo,
        payType: isType,
      }
      if (this.channelParams && this.channelParams !== "undefined") {
        try {
          let channel = JSON.parse(decodeURIComponent(this.channelParams))
          gio("track", "Data_small_buyclass", {
            Data_enroll_small_type: channel.utm_source,
            Data_buy_small_url: channel.utm_content,
            Data_user_small_phone: this.registForm.phoneNumber,
            Data_click_small_class_ID: this.courseCode,
            Data_buy_small_type: paytype[isType],
            // coursecode
            Data_buy_small_orderCode: this.orderNo,
          })
        } catch (e) {
          console.log(e)
        }
      }
      if (isType === 0) {
        this.aliPay(isType)
      } else if (isType === 1) {
        if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
          isType = 13
          sendData.payType = isType
          this.wxPay(isType)
        } else {
          this.wxPay(isType)
        }
      } else if (isType === 13) {
        this.wxPay(isType)
      } else if (isType === 16) {
        this.jdPay(isType)
      } else {
        this.stagesPay(isType)
      }
    },

    loadthisUrl(isOrderId) {
      if (getParam(location.href, "orderId")) {
        if (isOrderId) {
          if(Number(this.sell) === 1 && this.model === 1){
            location.assign(`${cashierLink()}groupDepositSuccess?orderId=${getParam(location.href, "orderId")}`)
          }else{
            if(this.isGoodsShelves === 'isTrue' || this.lichee === 'lichee'){ //直播间h5 转
              let lichee = this.lichee === 'lichee' ? '&lichee=lichee' : ''
              window.location.replace(`${cashierLink()}paysuccess?orderId=${getParam(location.href, "orderId")}&isGoodsShelves=isTrue${lichee}`)
            }else { // 正常跳转
              location.assign(`${cashierLink()}paysuccess?orderId=${getParam(location.href, "orderId")}`)
            }
          }
        } else {
          location.assign(location.search.split("&orderId=")[0])
        }
      } else {
        location.reload()
      }
    },
    /*倒计时*/
    countTime() {
      //获取当前时间
      let date = new Date(),
        now = date.getTime(),
        //设置截止时间
        endDate = new Date(timestampToTime(this.vipInfo.endTime).replace(/-/g, "/")),
        end = endDate.getTime(),
        // 设置开始时间
        startDate = new Date(timestampToTime(this.vipInfo.startTime).replace(/-/g, "/")),
        start = startDate.getTime(),
        //时间差
        leftTime = now >= start ? end - now : start - now
      this.begin = now >= start ? true : false
      //定义变量 d,h,m,s保存倒计时的时间
      if (parseInt(leftTime / 1000) > 0) {
        this.data.days = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        this.data.hourse = Math.floor((leftTime / 1000 / 60 / 60) % 24)
        this.data.minute = Math.floor((leftTime / 1000 / 60) % 60)
        this.data.second = Math.floor((leftTime / 1000) % 60)
        this.data.days = this.data.days < 10 ? "0" + this.data.days : this.data.days
        this.data.hourse = this.data.hourse < 10 ? "0" + this.data.hourse : this.data.hourse
        this.data.minute = this.data.minute < 10 ? "0" + this.data.minute : this.data.minute
        this.data.second = this.data.second < 10 ? "0" + this.data.second : this.data.second
        this.timer = setTimeout(this.countTime, 1000)
      } else {
        clearTimeout(this.timer)
        setTimeout(() => {
          this.getVipcourseInfo()
        }, 2000)
      }
    },
    //查看电子协议
    showEleProtocolMark() {
      this.showEleProMask = true
      this.stopScroll()
    },
    showDownProtocol() {
      this.isShowPol = true
      this.stopScroll()
    },
    closeDownProtocol() {
      this.isShowPol = false
      this.moveScroll()
    },
    //关闭电子协议
    closeEleMarks() {
      this.showEleProMask = false
      this.moveScroll()
    },
    //滑动限制
    stopScroll() {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.top = "0px"
      document.body.style.left = "0px"
    },
    //取消滑动限制
    moveScroll() {
      document.body.style.overflow = "scroll" //出现滚动条
    },
    // 60s倒计时
    countDown() {
      let that = this
      let num = 60
      this.isCounting = true
      this.isClick = false
      clearInterval(that.timer)
      this.timer = setInterval(function() {
        that.codeBtn = num + "s后重试"
        num--
        if (num <= 0) {
          that.isCounting = false
          that.isClick = true
          that.codeBtn = "重新获取"
          clearInterval(that.timer)
          return true
        }
      }, 1000)
      return false
    },
  },
  beforeDestory() {
    clearTimeout(this.timer)
  },
  watch: {
    wxMobile: function(e) {
      if (e.length >= 11 && this.checkPhoneNum(e)) {
        this.isClick = true
      } else {
        this.isClick = false
      }
    },
  },
}
</script>


<style lang="css" scoped>
.good_live{
  width: 25px;
  height: 25px;
  position: fixed;
  top: 15px;
  right: 15px;
  color: #000;
  font-size: 14px;
}
.good_live img{
  width: 100%;
}
.show-img {
  width: 100%;
  padding-bottom: 50px;
}

.show-img-bottom {
  padding-bottom: 90px;
}

.show-img img {
  width: 100%;
  display: block;
}

.fixed-text {
  color: #fff;
  position: fixed;
  bottom: 90px;
  left: 0;
  right: 0;
  font-size: 0.9rem;
  padding: 10px 16px;
  border-radius: 6px 6px 0 0;
  background: rgba(0, 0, 0, 0.7);
}

/*优惠*/
.discounts {
  background: #eefbff;
  color: #606060;
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 0.8rem;
  text-align: center;
  /*border-radius:4px 4px 0px 0px;*/
}

.discounts-spe {
  background: #fff4f4;
  color: #f41551;
  text-align: left;
  display: flex;
  justify-content: center;
  align-items: center;
}

.countdown-clock {
  height: 38px;
}

.clock-top {
  height: 22px;
  width: 18px;
  display: inline-block;
  border-radius: 4px;
  background: #f41551;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  line-height: 26px;
  font-family: OpenCourseFonts;
}

.span-time-moble {
  color: #808080;
}

.bottom-samll-course {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 1.06rem;
  overflow: hidden;
  background: #ffffff;
  text-align: center;
}

.addfilter{
  -webkit-filter: blur(15px);
  filter: blur(15px);
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 1.06rem;
  overflow: hidden;
  background: #ffffff;
  text-align: center;
}

.bottom-left {
  float: left;
  width: 40%;
  line-height: 50px;
  color: #f43c37;
  font-weight: 600;
}

.bottom-left-spe {
  width: 40%;
  color: #f43c37;
  line-height: normal;
}

.original-price,
.present-price {
  margin-right: 10%;
  text-align: right;
  color: #606060;
  font-size: 12px;
}

.original-price {
  margin-top: 6px;
  font-size: 12px;
  text-decoration: line-through;
}

.present-price {
  font-size: 12px;
  margin-top: -2px;
  color: #f43c37;
}

.present-price span {
  font-weight: 600;
  font-size: 16px;
  color: #f43c37;
}

.bottom-right {
  color: #ffffff;
  float: left;
  width: 60%;
  line-height: 50px;
  font-weight: 600;
  background: url("../../assets/img/vipImgs/vip_bottom_bg.png") top left;
}

.bottom-right-course {
  color: #ffffff;
  float: left;
  width: 100%;
  line-height: 50px;
  font-weight: 600;
  background: url("../../assets/img/vipImgs/vip_bottom_bg.png") top left;
}

.bottom span {
  cursor: pointer;
}

.no-bindding {
  color: #ffffff;
  float: left;
  width: 100%;
  line-height: 50px;
  font-weight: 600;
  background: url("../../assets/img/vipImgs/vip_bottom_bg.png") top left;
}

/*已经购买*/
.buy-over-style {
  height: 50px;
}

.buy-over-word {
  line-height: 35px;
  font-weight: 500;
  font-size: 16px;
}

.buy-over-link {
  line-height: 5px;
  font-size: 12px;
}

.show-marks-pay {
  width: 100%;
  /*height: 328px;*/
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0px;
  z-index: 9998;
  padding: 0 20px 10px;
  box-sizing: border-box;
}

.show-marks {
  width: 100%;
  /*height: 328px;*/
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0px;
  z-index: 9998;
  box-sizing: border-box;
}

.show-marks.two {
  height: 457px;
  background: #fff;
  z-index: 9999;
}

.show-marks.two.goodslive {
  height: 246px;
  background: #fff;
  z-index: 9999;
}

.show-marks.three {
  height: 332px;
  background: #fff;
  z-index: 9999;
}

.mark-head {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f4f4f4
}
.mark-head-img {
  position: absolute;
  top: 16px;
  right: 15px;
  width: 12px;
  height: 12px;
  cursor: pointer;
}

.mark-title {
  font-size:16px;
  font-weight:600;
  color:rgba(51,51,51,1);
  line-height:20px;
}

.agreement.mark-head {
  background: url("./../../assets/img/payImgs/headbg.png") top center repeat;
  background-size: 100% 54px;
}

.mark-cancel-button {
  position: absolute;
  top: 15px;
  left: 20px;
  font-size:14px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:20px;
  cursor: pointer;
}

.pagescrool {
  overflow: hidden;
}

.mark-content {
  width: 100%;
  padding: 22px 0;
  box-sizing: border-box;
}
.mark-content.mark-content-live{
  max-height: 200px;
  overflow: scroll;
}

.all-pay {
  width: 241px;
  height: 45px;
  margin: 0 auto 10px;
  border-radius: 22.5px;
  background: #F1F8FA;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding-left: 66px;
}
.all-pay:last-child {
  margin-bottom: 0;
}

.all-pay img {
  width: 23px;
  height: 23px;
  margin-right: 13px;
  vertical-align: middle;
}

.all-pay span {
  font-size: 14px;
  vertical-align: middle;
  color: #7b7e7f;
}

.wechat-pay {
}

.apli-pay {
}

.stages-pay {
}

.stages-zhi {
}


.mark-foot {
  height: 40px;
  border-top: 1px solid #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mark-foot.checkboxag {
  padding-top: 6px;
}

.to-show-mark-title {
  font-size:12px;
  font-weight:400;
  color:rgba(167,167,167,1);
  line-height:14px;
}

.to-show-mark-title.check {
  margin-left: 3px;
}

.to-show-mark-click {
  display: inline-block;
  font-size:12px;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:14px;
}

.to-show-mark-click.check {
    display: inline-block
}

.agreement-contains {
  position: absolute;
  width: 88%;
  overflow-y: auto;
  top: 54px;
  left: 6.5%;
  font-size: 12px;
  height: 400px;
  background: #fff;
  text-align: left;
  border-radius: 4px;
  -webkit-overflow-scrolling: touch;
}
.agreement-contains.liveheight{
  height: 200px;
}

.bottom span {
  cursor: pointer;
}

.bothpay p {
  font-size: 12px;
}

.bothpay img {
  width: 50px;
  height: 50px;
}

.popups {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 9997;
  overflow: hidden;
}

.popupsmobile {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9997;
  overflow: hidden;
}

/*新增agree*/

.agree_des span {
  color: cornflowerblue;
}

.agree-content {
  height: auto;
  overflow-y: auto;
  padding: 8px 8px 12px;
  margin-top: 10px;
}

.to_hide span {
  font-size: 18px;
  margin-top: 10px;
  font-weight: 600;
}

.sub-title {
  font-size: 14px;
  margin: 5px 0;
  font-weight: 700;
}

/*iPhoneX的适配*/
@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
  .show-marks {
    height: 280px;
  }
}

.inexistence-course {
  text-align: center;
  color: #9a9a9a;
  font-size: 14px;
}

.inexistence-course img {
  margin-top: 40%;
  width: 74px;
  height: 60px;
}

@font-face {
  font-family: "OpenCourseFonts";
  src: url("../../assets/font-styles/fonts/font-styles.eot"); /* IE9 Compat Modes */
  src: url("../../assets/font-styles/fonts/font-styles.eot?#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */ url("../../assets/font-styles/fonts/font-styles.woff")
      format("woff"),
    /* Modern Browsers */ url("../../assets/font-styles/fonts/font-styles.ttf")
      format("truetype"),
    /* Safari, Android, iOS */
      url("../../assets/font-styles/fonts/font-styles.svg#OpenCourseFonts")
      format("svg"); /* Legacy iOS */
  font-weight: normal;
  font-style: normal;
}

img[lazy="loading"] {
  width: 50px;
  /*margin-left: 47%;*/
  display: block;
  height: 550px;
  text-align: center;
  margin: 0 auto;
  /*margin-left: 56%;*/
}

.kkbregist {
  width: 100%;
  height: calc(100% + 50px);
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}

.kkbregist .kkbregistInfo {
  position: fixed;
  width: 100%;
  background: rgb(255, 255, 255);
  bottom: 0;
  text-align: center;
  padding: 5px 20px 25px 20px;
  border-radius: 10px;
  box-sizing: border-box;
}

.kkbregist .title {
  font-size: 20px;
  margin: 10px 0;
  display: block;
}

.kkbregist .kkbregistInfo .verifycodeSublime.disable {
  color: #9e9e9e;
}

.kkbregist .kkbregistInfo .verifycodeSublime,
.kkbregist .kkbregistInfo .sublime {
  width: 100px;
  text-align: center;
  height: 41px;
  background: #0099ee;
  color: #f9f9f9;
  border-radius: 5px;
  outline: none;
  border: none;
}

.kkbregist .kkbregistInfo .verifycodeSublime {
  background: transparent;
  color: #0099ec;
  position: absolute;
  right: 11px;
}

.kkbregist .kkbregistInfo .sublime.disable {
  background: #9e9e9e;
}

.kkbregist .kkbregistInfo .verifycodeSublime:active,
.kkbregist .kkbregistInfo .sublime:active {
  opacity: 0.6;
}

.kkbregist .kkbregistInfo .sublime {
  width: 150px;
  font-size: 16px;
  border-radius: 60px;
}

.kkbregist .kkbregistInfo .label {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 0 20px 0;
  width: 100%;
  border-radius: 51px;
  background: rgb(245, 244, 251);
}

.kkbregist .kkbregistInfo .label input {
  height: 35px;
  font-size: 16px;
  border: none;
  outline: none;
  padding: 2px 5px;
  flex-grow: 1;
  flex-basis: 0;
  background: transparent;
}

.kkbregist .kkbregistInfo .label span {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 15px;
}

.paysuccess {
  position: absolute;
  top: 50%;
  z-index: 100;
  width: 80%;
  background: #ffffff;
  transform: translate(0, -50%);
  border-radius: 10px;
  margin: 0 10%;
  padding: 10px 0 5px 0;
  display: flex;
  flex-direction: column;
  line-height: 2.5em;
}

.paysuccess header {
  text-align: center;
  margin-bottom: 10px;
}

.paysuccess .payed {
  text-align: center;
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
}

.paysuccess .payed a {
  color: #ff0800;
}

.paysuccess .noPay {
  text-align: center;
}

.mobilebox {
  width: 100%;
  height: 200px;
  color: red;
}

.wxbtn {
  width: 88.8%;
  height: 52px;
  line-height: 40px;
  border: none;
  border-radius: 26px;
  font-size: 14px;
  color: #ffffff;
  background-color: #00cdff;
  /*margin-top: 20%;*/
  font-weight: 700;
  outline: none;
}

.wxbtn:active {
  background-color: #ccc;
}

.wxinput {
  width: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  height: 46px;
  border-radius: 26px;
  padding-left: 6%;
  outline: none;
  text-align: left;
  background-color: #f2f2f2;
  border: none;
  font-size: 14px;
  color: #000;
}

.wxinput.code {
  width: 57%;
}

.telephone,
.mobilecode {
  width: 88.8%;
  height: 46px;
  position: relative;
  line-height: 0;
}

.telephone {
  margin-bottom: 14px;
}

.mobilecode {
  margin-bottom: 35px;
}

.btn-code {
  position: absolute;
  right: 0;
  top: 0px;
  height: 46px;
  border-radius: 26px;
  width: 39.1%;
  line-height: 36px;
  margin-top: 0;
  font-size: 14px;
  border: 1px solid #e6e6e6;
  background-color: #fff;
  color: #bbbbbb;
  outline: none;
}

.mobilelogin {
  box-sizing: border-box;
  padding-left: 18px;
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
  padding-bottom: 0;
  overflow: hidden;
}

.btnActive {
  background-color: #00cdff !important;
  color: #fff;
}

.mobileline {
  position: relative;
  width: 95%;
}

.mobileline:before {
  content: " ";
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #f3f5f7;
  color: #f3f5f7;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.7);
  z-index: 2;
}

.mobilehead {
  width: 95.8%;
  height: 49px;
  line-height: 49px;
  box-sizing: border-box;
}

.mobilehead span {
  font-size: 14px;
  color: #000;
}

.mobilehead img {
  width: 15px;
  height: 15px;
  float: right;
  margin-top: 17px;
  margin-right: 4px;
}

.mobileerrmsg {
  margin-top: 25px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #555555;
}

.mobileerrmsgtips {
  color: #f36563;
}

.toastmobile {
  width: 100%;
  box-sizing: border-box;
  height: 50px;
  line-height: 50px;
  position: fixed;
  left: 0;
  bottom: 25%;
  background: none;
  z-index: -99;
  opacity: 0;
  transition: all 1s;
}

.toastmobileactive {
  opacity: 1;
  transition: all 1s;
  z-index: 9999999;
}

.toastmobile-des {
  width: 50%;
  margin: 0 auto;
  box-sizing: border-box;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
  border-radius: 3px;
  padding: 0 20px;
  color: #fff;
  font-size: 14px;
}
.sub-desc-p {
  text-indent: 2em;
}
.sub-desc-p-weight {
  font-size: 12px;
  font-weight: 700 !important;
}
.noindent {
  text-indent: 0;
}
#agreements {
  width: 15px;
  height: 15px;
  position: relative;
  top: 4px;
  left: 0;
  display: none;
}
.checkbox-label {
  height: 14px;
  padding-left: 14px;
  line-height: 14px;
  position: relative;
}
.checkbox-label:before {
  content: '';
  position: absolute;
  top: 1px;
  left: 0;
  bottom: 0;
  margin: auto 0;
  display: inline-block;
  width: 14px;
  height: 14px;
  background-size: 100% 100%;
  background-position: center center;
  background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+56m6PC90aXRsZT4KICAgIDxnIGlkPSJINS0t5pSv5LuY55WM6Z2iIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5pSv5LuY6YCJ5oupLTEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MC4wMDAwMDAsIC03NzYuMDAwMDAwKSIgc3Ryb2tlPSIjQkVCRUJFIj4KICAgICAgICAgICAgPGcgaWQ9Iue8lue7hC04IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MC4wMDAwMDAsIDc3Ni4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMyI+CiAgICAgICAgICAgICAgICAgICAgPGcgaWQ9Iue8lue7hCI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxyZWN0IGlkPSLnqboiIHg9IjIiIHk9IjIiIHdpZHRoPSI5LjUiIGhlaWdodD0iOS41IiByeD0iMi41Ij48L3JlY3Q+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=');
}
#agreements:checked + .checkbox-label:before {
  background-image:url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTRweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgMTQgMTQiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+5Yu+6YCJPC90aXRsZT4KICAgIDxnIGlkPSJINS0t5pSv5LuY55WM6Z2iIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0i5pSv5LuY6YCJ5oupLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MC4wMDAwMDAsIC03NzYuMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSLnvJbnu4QtMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNzAuMDAwMDAwLCA3NzYuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0i5Yu+6YCJIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjUwMDAwMCwgMS41MDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCBpZD0i55+p5b2iIiBzdHJva2U9IiMwMEFGRjIiIHg9IjAuNSIgeT0iMC41IiB3aWR0aD0iOS41IiBoZWlnaHQ9IjkuNSIgcng9IjIuNSI+PC9yZWN0PgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik04LjMxOTEwNjM1LDMuOTM5NTcyNjggTDQuOTkwNzEyMjEsNy4zNTE2Mzc3NCBDNC44OTQyNDQ3OSw3LjQ1MDUzMDIyIDQuNzQ5NTIwNjgsNy41IDQuNjA0Nzk2NTgsNy41IEM0LjQ2MDEzMzcxLDcuNSA0LjMxNTQwOTYxLDcuNDUwNTMwMjIgNC4yMTg5NDIxOCw3LjM1MTYzNzc0IEwyLjE0NDcwMTE0LDUuMjI1MjUzMzQgQzEuOTUxNzY2MjksNS4wMjc0NjgzOSAxLjk1MTc2NjI5LDQuNjMxODUxNCAyLjE0NDcwMTE0LDQuNDM0MDgyMTUgQzIuMzM3NjIwNjgsNC4yMzYyMzQ0MiAyLjcyMzUzNjMyLDQuMjM2MjM0NDIgMi45MTY0NzExNyw0LjQzNDA4MjE1IEw0LjYwNDc5NjU4LDYuMTY0ODQ5NTcgTDcuNTQ3MzM2MzIsMy4xNDgzMzg3MSBDNy43NDAyNzExNywyLjk1MDU1Mzc2IDguMTI2MTg2ODEsMi45NTA1NTM3NiA4LjMxOTEwNjM1LDMuMTQ4MzM4NzEgQzguNTYwMjk3ODgsMy4zNDYxNzA3NSA4LjU2MDI5Nzg4LDMuNzQxNzg3NzMgOC4zMTkxMDYzNSwzLjkzOTU3MjY4IFoiIGlkPSLot6/lvoQiIGZpbGw9IiMwMEFGRjIiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+');
}
.down-info {
  font-size: 15px;
  color: #00aff2;
  font-weight: 600;
  margin-top: 26px;
  margin-bottom: 11px;
}
.down-info-item {
  font-size: 13px;
  color: #5a5b5c;
}
.down-agreement-info {
  font-size: 12px;
  color: #a7a7a7;
}
.down-btn {
  width: 87%;
  height: 40px;
  font-size: 15px;
  margin: 26px auto 13px;
  background: #00aff2;
  border-radius: 21px;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
.down-ct {
  text-align: center;
}
.skuUsable{
  background: #d7d7d7;
  z-index: 999;
}

</style>
