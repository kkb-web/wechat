<template>
  <div class="paysuccess-contains">
    <div :style="{height:pageHeight}" v-if="pageType ==1" class="pay-success-small-course">
      <div class="pay-success-small-content">
        <img
          class="pay-success-small-img"
          src="https://img.kaikeba.com/kkb_wx_paysuccess_samllcourse_crile.png"
        />
        <p class="pay-success-small-success-p" :data-price="price">{{price==0?"恭喜领取成功":"恭喜购买成功"}}!</p>
        <div class="pay-success-small-qrcode">
          <span class="qrcode-btn">最后一步:</span>
          <p class="qrcode-p1">{{title}}</p>
          <p class="qrcode-p2">（{{description}}）</p>
          <div class="qrcode-img">
            <div class="qrcode-img-box" id="qrcodeId">
              <qrcode-vue class="qrcode-form" v-if="assignType === 3" :size="141" :value="qrCodeUrl"></qrcode-vue>
              <img v-on:touchstart="handleIframe" v-on:touchend="handleIframeend" id="img-qrcode" :src="qrCodeUrl"/>
            </div>
            <button v-if="assignType === 3" class="writeNow" @click="goForm">立即填写</button>
            <p>{{bottom}}</p>
          </div>
        </div>
        <!--非微信环境下展示-->
        <div v-show="!isWechat" class="icons clearfix">
          <div class="icon1">
            <img src="https://img.kaikeba.com/form/result63425181600202zxcj.png" alt=""/>
            <p class="firstP">手机截屏</p>
            <p class="desc">保存二维码</p>
          </div>
          <p class="line"></p>
          <div class="icon2">
            <img src="https://img.kaikeba.com/form/result35225181600202qynf.png" alt=""/>
            <p class="firstP">打开微信</p>
            <p>点击右上角+号</p>
          </div>
          <p class="line"></p>
          <div class="icon3">
            <img src="https://img.kaikeba.com/form/result55425181600202wlzb.png" alt=""/>
            <p class="firstP">扫描二维码</p>
            <p>添加老师微信</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="pageType == 2" class="pay-success">
      <div class="back">
        <div class="top">
          <img class="icon-success" src="https://img.kaikeba.com/success_icon.png" alt/>
          <span class="text-success">恭喜你，支付成功</span>
        </div>
        <div class="middle">
          <img class="icon-line" src="https://img.kaikeba.com/line.png" alt/>
        </div>
        <div class="bottom">
          <img class="icon-tele" src="https://img.kaikeba.com/Oval.png" alt/>
          <div class="next">
            <span class="text-next">距离报名成功，仅剩最后一步</span>
            <p class="text-hint">绑定开课吧账号才能完成报名哦</p>
          </div>
        </div>
      </div>
      <!--<div class="button" @click="goBindAccount">-->
      <!--去完成报名-->
      <!--</div>-->
    </div>
    <div
      :style="{height:pageHeight}"
      id="course-orther"
      v-else-if="pageType == 3"
      class="pay-success-small-course-orther"
    >
      <img
        class="pay-success-small-img"
        src="https://img.kaikeba.com/kkb_wx_paysuccess_samllcourse_crile.png"
      />
      <p class="pay-success-small-success-p">恭喜购买成功!</p>
      <div class="pay-success-small-qrcode02">
        <span class="qrcode-btn notwechat">最后一步:</span>
        <p class="qrcode-p1 notwechat">直接打开微信添加课程老师微信</p>
        <p class="qrcode-p2 notwechat">（ 进行课程激活 ）</p>
      </div>
    </div>
    <div @click="requestOrder" v-show="orderfail" class="orderfail">
      <img src="https://img.kaikeba.com/21145131300202xizf.png"/>
      <p>
        请求失败，
        <span>点击刷新</span>
      </p>
    </div>
    <div v-show="orderfailLoad" class="orderfailLoad">
      <img src="https://img.kaikeba.com/85735131300202hgjb.gif"/>
      <p>
        正在确认订单，预计等待
        <span>{{counterTime}}</span>
        <span class="sp1">s</span>
      </p>
    </div>
    <div @click="linkToGoodsList" class="good_live" v-if="liveCloseAndBack">
      <img src="https://img.kaikeba.com/a/21749112800202eyxy.png" >
    </div>
  </div>
</template>

<script>
import { routeUrl, getToken, cashierLink, isPcDingTalkWS, projectEnv, setToken, removeToken ,isIOS} from "../../../assets/js/filter"
import {childrenPostMassage} from "../../../utils"
import { APPOINT_COURSEID } from "../../../utils/const"
import { urlGetOrderStatus } from "../../../api/api"
import { share } from "../../../assets/js/share"
import { Toast } from "we-vue"
import QrcodeVue from "qrcode.vue"
import QRcode from "qrcode"

let rfailTimer
let requestTimer
let ApiLogParams = { orderNo: "", data: {} }
export default {
  data() {
    return {
      orderNo: this.$route.query.orderId,
      assignType: null,
      price:0,
      pageType: 0,
      pageHeight: "",
      vipCourseDetail: {},
      versionFlag: "",
      qrCodeUrl: "",
      title: "",
      description: "",
      bottom: "",
      // orderId: (this.$route.query.orderId.length == 16) ?
      //     this.$route.query.orderId :
      //     this.$route.query.orderId.substring(0, this.$route.query.orderId.length - 13)
      copyData: "",
      paysuccess__copy: false,
      supportScheme: true,
      orderfail: false,
      orderfailLoad: false,
      counter: 0,
      Verify: null,
      counterTime: 10,
      orderType: this.$route.query.orderType, // 0 线上订单 1 线下订单 2 定金模式订单
      orderPartId: this.$route.query.orderPartId,
      cashPartType: this.$route.query.cashPartType,
      deadlineTime: this.$route.query.deadlineTime,
      isWechat: false,
      isGoodsShelves:this.$route.query.isGoodsShelves, // 等于isTrue代表是直播间展示
      lichee:this.$route.query.lichee,
      liveCloseAndBack:false,
      isIOS:isIOS()
    }
  },
  components: {
    QrcodeVue,
    QRcode,
  },
  watch: {
    pageType: function(val) {
      if (val === 1) {
        setTimeout(() => {
          this.getUrl()
        }, 0)
      }
    },
  },
  mounted() {
    this.handLiveBtn() // 处理直播间关闭按钮
    if (navigator.userAgent.toLocaleLowerCase().indexOf("baidu") !== -1 || isPcDingTalkWS()) {
      this.supportScheme = false
    }
    this.vipCourseDetail = getToken("vipCourseDetail")
    this.handleOrder()
    let vipCourseDetailParse = JSON.parse(this.vipCourseDetail)
    /**
     *  微信浏览器用getToken 获取课程标识，非微信浏览器用url参数获取课程标识。
     */
    // this.getUrl()

    let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
    this.versionFlag = version === -1 ? false : true
    // 不是微信浏览器
    if (version === -1) {
      this.isWechat = false
      this.getOrderNo()
      this.orderNo = this.$route.query.orderId
      gio("track", "Data_small_buySuccess", {
        Data_buy_small_time: new Date().valueOf(),
        Data_buy_small_orderCode: this.orderNo,
      })
    } else {
      // 微信浏览器
      this.isWechat = true
      let send = {
        orderNo: this.$route.query.out_trade_no || this.orderNo,
      }
      urlGetOrderStatus(send).then((res) => {
        console.log(res)
        if(res.data.code === 0){
          let resData = res.data.data

          // 判断是否定金模式
          const type = resData.type === 2 ? 1 : 0
          const courseModel = type

          // 判断课程类型
          const courseType = resData.courseType

          setToken("courseModel",courseModel)
          setToken("courseType",courseType)
          sessionStorage.setItem("courseCode", resData.courseCode)
          sessionStorage.setItem("channelCode", resData.channelCode)

          if (courseType == 0) {
            // 如果是定金模式
            if (courseModel == 1) {
              // 定金模式,再判断跳转到bindsuccess还是downsuc ：首付跳转到bindsuccess，尾款跳转到downsuc
              // this.getdepostStatus(this.cashPartType, this.deadlineTime, this.orderNo)
              this.getdepostStatus(resData.partType, resData.deadlineTime, resData.no)
            } else {
              //普通模式
              this.handleOrderSuccess()
              let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : ''
              let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : ''
              window.location.href =
                `${cashierLink()}bindsuccess?code=` + sessionStorage.getItem("courseCode") + "&channel=" + sessionStorage.getItem("channelCode") + isGoodsShelves + lichee
              return
            }
          } else {
            try {
              share.init(
                vipCourseDetailParse.groupShareTitle,
                vipCourseDetailParse.shareDescription,
                vipCourseDetailParse.shareCoverImage,
                vipCourseDetailParse.friendCircleTitle,
                "",
                vipCourseDetailParse.courseCode,
                vipCourseDetailParse.channelCode
              )
            } catch (e) {
              console.log(e)
            }
            this.getOrderNo()
            this.handlePageHeight()
          }
        }else{
          Toast.fail({
            duration: 1000,
            message: res.data.msg
          });
        }
      })

    }
  },
  methods: {
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
    linkToGoodsList(){
      if(this.lichee === 'lichee'){
        childrenPostMassage({success: 'closeLicheeBox'}) // 直播间通知顶层页面关闭红包弹窗（h5）
      }else {
        window.location.href = getToken('goodsListUrls')
      }
    },
    handleIframe() {
      let _this = this
      if (!(window.self === window.top) && this.isWechat && this.isIOS) {
        window.top.postMessage(JSON.stringify({state: 1, success: 'IdentifyImgStart', url: _this.qrCodeUrl }), "*")
      }
    },
    handleIframeend() {
      if (!(window.self === window.top) && this.isWechat && this.isIOS) {
        window.top.postMessage(JSON.stringify({state: 2, success: 'IdentifyImgOver' }), "*")
      }
    },
    getUrl() {
      const qrcodeBox = document.getElementById("qrcodeId")
      const canvas = qrcodeBox.querySelector("canvas")
      const code = document.getElementById("img-qrcode")

      const image = new Image()
      if (canvas) {
        image.src = canvas.toDataURL("image/png")
        image.style.width = "141px"
        image.style.height = "141px"
        qrcodeBox.appendChild(image)
      }
    },
    goForm() {
      window.location.href = this.qrCodeUrl
    },
    cutdowTimer() {
      let that = this
      that.Verify = setInterval(function() {
        that.counterTime = that.counterTime - 1
        if (that.counterTime === 0) {
          clearInterval(that.Verify)
        }
      }, 1000)
    },
    handleOrder() {
      let that = this
      this.orderfailLoad = true
      ApiLogParams.orderNo = this.$route.query.out_trade_no || this.orderNo
      ApiLogParams.data.showLoading = true
      this.cutdowTimer()
      rfailTimer = setTimeout(function() {
        that.orderfail = true
        that.orderfailLoad = false
      }, 10000)
    },
    handleOrderSuccess() {
      this.orderfail = false
      this.orderfailLoad = false
      clearTimeout(rfailTimer)
      clearTimeout(requestTimer)
      clearInterval(this.Verify)
    },
    requestOrder() {
      let that = this
      this.counter = 0
      this.counterTime = 10
      this.orderfail = false
      this.orderfailLoad = true
      this.handleOrder()
      this.getOrderNo()
      rfailTimer = setTimeout(function() {
        that.orderfail = true
        that.orderfailLoad = false
      }, 10000)
    },

    getdepostStatus(type, deadlineTime, no) {
      // type: 0:定金  1:尾款  2:尾款
      if (parseInt(type) === 0) {
        let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : '' // 直播间货架参数
        let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : '' // 直播间红包参数
        window.location.href =
          `${cashierLink()}bindsuccess?code=` + sessionStorage.getItem("courseCode") + "&channel=" + sessionStorage.getItem("channelCode") + isGoodsShelves + lichee
      } else if (parseInt(type) === 1) {
        window.location.href = `${cashierLink()}downsuc?orderId=${no}&type=1&deadlineTime=${deadlineTime}`
      } else if (parseInt(type) === 2) {
        window.location.href = `${cashierLink()}downsuc?orderId=${no}&type=2`
      }
    },
    getOrderNo() {
      let send = {
        orderNo: this.$route.query.out_trade_no || this.orderNo,
      }
      if (this.orderPartId) {
        send.orderPartId = this.orderPartId
      }
      urlGetOrderStatus(send).then((res) => {
        if (res.data.code === 0) {
          let resData = res.data.data
          const assignType = resData.assignType
          this.assignType = assignType
          this.price = resData.price

           // 判断是否定金模式
          const type = resData.type === 2 ? 1 : 0
          const courseModel = type
          // 判断课程类型
          const courseType = resData.courseType
          setToken("courseModel",courseModel)
          setToken("courseType",courseType)
          sessionStorage.setItem("courseCode", resData.courseCode)
          sessionStorage.setItem("channelCode", resData.channelCode)

          // 添加对定金模式判断
          if (courseModel == 1 || (this.orderType && parseInt(this.orderType) === 2)) {
            if(resData.sellType !== 1){
              this.getdepostStatus(resData.partType, resData.deadlineTime, resData.no)
              return
            }
          }
          ApiLogParams.data.showSuccess = true
          this.handleOrderSuccess()
          this.orderNo = resData.no
          if (resData.courseType === 1 || resData.courseType === 2 || resData.courseType === 3||resData.sellType === 1) {
            if (resData.qrCode) {
              ApiLogParams.data.showQrcode = true
              let sendData = {
                orderNo: ApiLogParams.orderNo,
                data: {
                  showLoading: true,
                  showSuccess: true,
                  showQrcode: true,
                },
              }
            }
            if(resData.sellType === 1 && !resData.qrCode){
                resData.qrCode = "/a/71245170800202rxcj.jpg"
            }
            if (this.versionFlag) {
              //wx
              this.qrCodeUrl = `https://img.kaikeba.com/${resData.qrCode}`
              this.pageType = 1
              this.title = resData.title
              this.description = resData.description
              this.bottom = resData.bottom
              this.copyData = resData.weChatNo
            } else {
              //非wx
              // this.pageType = 3;
              this.qrCodeUrl = `https://img.kaikeba.com/${resData.qrCode}`
              this.pageType = 1
              this.title = resData.title
              this.description = resData.description
              this.bottom = resData.bottom
              this.copyData = resData.weChatNo
            }
            
            // 特定id 如果不展示二维码，就展示默认的二维码
            if (resData.courseId === APPOINT_COURSEID[projectEnv()]) {
              if (!resData.qrCode) {
                this.qrCodeUrl = "https://img.kaikeba.com/00030220400202fvmi.png"
              }
              if (!resData.title) {
                this.title = "预约上课"
              }
              if (!resData.description) {
                this.description = "关注【开课吧小课】公众号，回复【预约】即可"
              }
              if (!resData.bottom) {
                this.bottom = "课程开始前公众号内会推送助教老师的微信给您"
              }
            }
            if (assignType === 3) {
              // this.qrCodeUrl = res.data.data.qrCode
              window.location.href = resData && resData.qrCode
              // 直接跳转 暂时先注释 以后不用再删除-
              // console.log(this.qrCodeUrl, "hai")
              // this.title = res.data.data.title
              // this.description = res.data.data.description
              // this.bottom = res.data.data.bottom
            }
            this.handlePageHeight()
          } else {
            let isGoodsShelves = this.isGoodsShelves === 'isTrue' ? `&isGoodsShelves=isTrue` : '' // 直播间货架参数
            let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : '' // 直播间红包参数
            window.location.href =
              `${cashierLink()}bindsuccess?code=` + sessionStorage.getItem("courseCode") + "&channel=" + sessionStorage.getItem("channelCode") + isGoodsShelves + lichee
            return
          }
        } else {
          if (this.counter < 2) {
            let that = this
            requestTimer = setTimeout(function() {
              that.getOrderNo()
              that.counter += 1
            }, 3000)
          } else {
            clearTimeout(requestTimer)
          }
          let message = res.data.msg
          if (message.indexOf("mobile code") !== -1) {
            message = "验证码错误"
          }
        }
      })
    },
    goBindAccount() {
      this.$router.push({
        path: routeUrl() + "register",
        query: { orderId: this.orderNo },
      })
    },
    handlePageHeight() {
      if (this.pageType == 3 || this.pageType == 1) {
        let pageHeight = window.innerHeight
        this.pageHeight = pageHeight + "px"
      }
    },
    // 复制微信号，跳转到微信添加好友
    copyToAddFriend() {
      ApiLogParams.data.copyedWechatNo = true
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
      if (version === -1) {
        version = !!0
      }
      if (version) {
        copyText(this.copyData, () => {
          Toast.success({
            duration: 3000,
            message: "复制成功",
          })
        })
      } else {
        copyText(this.copyData, () => {
          this.paysuccess__copy = true
        })
      }

      function copyText(text, callback) {
        // text: 要复制的内容， callback: 回调
        var tag = document.createElement("input")
        tag.setAttribute("id", "cp_hgz_input")
        tag.value = text
        document.getElementsByTagName("body")[0].appendChild(tag)
        document.getElementById("cp_hgz_input").select()
        document.execCommand("copy")
        document.getElementById("cp_hgz_input").remove()
        if (callback) {
          callback(text)
        }
      }
    },
    paysuccess__copy_wx() {
      document.location.href = "weixin://"
    },
  },
}
</script>

<style scoped>
.paysuccess-contains {
  width: 100%;
}

.pay-success-small-course {
  width: 100%;
}

.pay-success {
  width: 100%;
}

.pay-success-small-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background: url("https://img.kaikeba.com/kkb_wx_paysuccess_samllcourse_background.png") top center no-repeat;
  background-color: #fff;
  background-size: 100%;
  text-align: center;
}

.pay-success-small-img {
  width: 109px;
  height: 108px;
  margin-top: 26px;
  vertical-align: top;
}

.pay-success-small-success-p {
  width: 100%;
  text-align: center;
  font-size: 16px;
  color: #ffffff;
  margin-top: 5px;
  line-height: 16px;
}

.pay-success-small-qrcode {
  width: 100%;
  text-align: center;
  margin-top: 38px;
  box-sizing: border-box;
  border-top-right-radius: 28px;
  border-top-left-radius: 28px;
  background-color: #ffffff;
}

.pay-success-small-qrcode02 {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  box-sizing: border-box;
}

.qrcode-btn {
  display: inline-block;
  height: 27px;
  line-height: 27px;
  border: 1px solid rgba(235, 87, 87, 0.32);
  background-color: rgba(235, 87, 87, 0.15);
  border-radius: 20px;
  font-size: 15px;
  color: #432222;
  padding: 0 20px;
  font-weight: 500;
  margin-top: 29px;
}

.qrcode-p1 {
  font-size: 25px;
  color: #141a43;
  font-weight: 700;
  line-height: 25px;
  margin-top: 22px;
}

.qrcode-p2 {
  width: 280px;
  margin: 0 auto;
  font-size: 14px;
  color: #4f578a;
  line-height: 14px;
  margin-top: 10px;
}

.qrcode-btn.notwechat {
  display: inline-block;
  height: 27px;
  line-height: 27px;
  border: 1px solid #26ab9b;
  background-color: #33c8aa;
  border-radius: 20px;
  font-size: 15px;
  color: #fff;
  padding: 0 20px;
  font-weight: 500;
  margin-top: 16px;
}

.qrcode-p1.notwechat {
  font-size: 25px;
  color: #fff;
  font-weight: 700;
  line-height: 25px;
  margin-top: 22px;
}

.qrcode-p2.notwechat {
  font-size: 14px;
  color: #e8fff9;
  line-height: 14px;
  margin-top: 10px;
}

.qrcode-img {
  width: 100%;
  /*height: 160px;*/
  margin: 0 auto;
  box-sizing: border-box;
  padding-top: 23px;
  margin-top: 3px;
  background: url("http://v.chanpin100.com/kkb_wx_paysuccess_samllcourse_floor02.png") no-repeat;
  /*background-size: 100%;*/
  background-position: 44% 0;
}

/*.qrcode-img img{*/
/*width: 141px;*/
/*height: 141px;*/
/*box-shadow: 0 0 18px 0 rgba(34,218,172,.22);*/
/*vertical-align: top;*/
/*}*/
.qrcode-img-box {
  width: 141px;
  height: 141px;
  box-shadow: 0 0 18px 0 rgba(34, 218, 172, 0.22);
  margin: 0 auto;
  background-color: #fff;
  text-align: center;
  border-radius: 4px;
}

.qrcode-img-box img {
  margin-top: 6px;
  width: 129px;
  height: 129px;
  -webkit-touch-callout: none;
}

.qrcode-img-box .qrcode-form {
  display: none;
  margin-top: 6px;
  width: 129px;
  height: 129px;
  -webkit-touch-callout: none;
}

.qrcode-img p {
  font-size: 12px;
  color: #a7a7a7;
  line-height: 12px;
  margin-top: 25px;
}

.pay-success-small-course-orther {
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  background: url("https://img.kaikeba.com/kkb_wx_paysuccess_samllcourse_background.png") top center no-repeat;
  background-color: rgb(52, 216, 170);
  background-size: 100%;
  text-align: center;
}

.back {
  width: 100%;
  height: 242px;
  background-image: url("https://img.kaikeba.com/page.png");
  background-size: cover;
}

.back div {
  text-align: left;
}

.icon-success,
.icon-tele {
  width: 50px;
  margin-left: 30px;
  float: left;
}

.icon-success {
  margin-top: 30px;
}

.icon-line {
  width: 2px;
  height: 90px;
  margin-left: -182px;
  margin-top: 70px;
}

.icon-tele {
  margin-top: -7px;
}

.text-success {
  font-size: 17px;
  color: #fff;
  padding-top: 31px;
  margin-left: 20px;
  line-height: 50px;
  float: left;
  font-weight: bold;
}

.next {
  float: left;
  margin-top: -4px;
}

.text-next {
  font-size: 17px;
  color: #fff;
  margin-left: 20px;
  font-weight: bold;
}

.text-hint {
  font-size: 14px;
  color: #fff;
  margin-left: 20px;
  margin-top: -5px;
}

.writeNow {
  background: rgba(51, 200, 170, 1);
  width: 121px;
  height: 33px;
  border-radius: 70px;
  color: #fff;
  margin-top: 1rem;
  outline: none;
  border: 1px solid #fff;
}

.button {
  width: 80%;
  height: 48px;
  background-image: url("https://img.kaikeba.com/bing_button_icon.png");
  background-size: 100% 100%;
  margin: 0 auto;
  color: #fff;
  margin-top: 30px;
  font-size: 14px;
  font-weight: bold;
  line-height: 45px;
  text-align: center;
  cursor: pointer;
}

/*bywsnh*/
.paysuccess__copy--button {
  background: #6cd6af;
  color: #ffffff;
  border: none;
  outline: none;
  padding: 10px 15px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
}

.paysuccess__copy--button:active {
  background: #26ab9b;
}

.paysuccess__copy--wechat {
  display: inline-block;
  padding: 10px 0;
}

.paysuccess__copy--dialog {
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.paysuccess__copy--dialog__container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f9f9f9;
  width: 80%;
}

.paysuccess__copy--dialog__container header {
  text-align: center;
  font-size: 16px;
}

.paysuccess__copy--dialog__container header div span {
  font-size: 20px;
}

.paysuccess__copy--dialog__container header img {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  margin-top: 14.5px;
}

.paysuccess__copy--dialog__container > div span {
  display: inline-block;
  width: 80%;
  text-align: left;
  margin: 0 9%;
}

.paysuccess__copy--dialog__container > div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.paysuccess__copy--dialog__container footer span {
  width: 50px;
  display: inline-block;
  text-align: center;
  padding: 10px 15px;
  border: 0.5px solid rgba(0, 0, 0, 0.1);
  margin: 10px 0;
  border-radius: 20px;
}

.paysuccess__copy--dialog__container footer span:nth-of-type(2) {
  background: #26ab9b;
  color: #f9f9f9;
  border: none;
}

.paysuccess__copy--dialog__container footer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.orderfail {
  width: 60%;
  height: 100px;
  margin: 0 auto;
  margin-top: 66%;
  text-align: center;
}

.orderfail img {
  width: 35px;
  height: 35px;
  margin-bottom: 12px;
}

.orderfail p {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
}

.orderfail span {
  color: #17a0e9;
}

.orderfailLoad {
  width: 60%;
  height: 100px;
  margin: 0 auto;
  margin-top: 66%;
  text-align: center;
}

.orderfailLoad img {
  width: 42px;
  height: 42px;
  margin-bottom: 10px;
}

.orderfailLoad p {
  font-size: 14px;
  color: #333333;
  font-weight: 600;
}

.orderfailLoad span {
  font-size: 18px;
  color: #17a0e9;
}

.sp1 {
  font-size: 14px;
  color: #333333;
  font-weight: 400;
}

/*非微信下展示加好友提示*/
.icons {
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
  padding: 15px 15px 20px 15px;
  box-sizing: border-box;
  overflow: hidden;
}

.icons div {
  float: left;
  width: 27.2%;
  text-align: center;
}

.icons div img {
  width: 50px;
  height: 50px;
  margin-bottom: 16px;
}

.line {
  width: 27px;
  height: 1px;
  background: rgba(219, 226, 225, 1);
  border-radius: 1px;
  float: left;
  margin-top: 25px;
}

.firstP {
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.clearfix {
  overflow: auto;
  _height: 1%;
}
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
</style>
