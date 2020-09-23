<template>
  <div class="goodscontent">
    <iframe id="show-iframe" allowfullscreen="true" frameborder="0" :src="iframeUrl"></iframe>
    <div class="paysuccessbox" :style="{height:payBox ? '400px' : '0px'}">
      <iframe id="show-iframe2" allowfullscreen="true" frameborder="0" :src="licheeIframeUrl"></iframe>
    </div>
    <img :src="QrcodeImg" class="erweimaClass" :style="{display: showImg ? 'block' : 'none'}"/>
  </div>
</template>


<script>
  import {Authorize} from "../../assets/js/userAuthorize";
  import {getMassage} from '../../utils'
  import {KKBPassportAppId} from "../../utils/const"
  import {
    getToken,
    setToken,
    cashierLink
  } from "../../assets/js/filter";

  let authorize = new Authorize();
  export default {
    name: "goodsShelves",
    data() {
      return {
        playLive: 'https://test-play.kaikeba.com/live/oper-837450772086784',
        wxCode: this.$route.query.code,
        orderId: this.$route.query.orderId,
        isWechat: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? true : false,
        paysuccess: sessionStorage.getItem('goodsLinkUrl') ? true : false,
        iframeUrl: this.$route.query.liveUrl + '?source=k-wx-iframe',
        licheeIframeUrl:'',
        lichee:this.$route.query.lichee,
        payBox:false,
        isGoodsShelves:this.$route.query.isGoodsShelves,
        QrcodeImg:'',
        showImg:false
      }
    },
    mounted() {
      let that = this
      getMassage((e) => {
        let result = e.data;
        if (result.success === 'wxPay') {
          that.wxPay(result.payObj)
        }
        if (result.success === 'childrenPageIsLoad' && this.orderId && this.isGoodsShelves === 'isTrue') {
          that.handOrder()
        }
        if (result.success === 'KKBLoginH5') {
          that.ipsLogin()
        }
        if(result.success === 'closeLicheeBox'){
          that.payBox = false
          localStorage.setItem('isShowLicheBtn', 0)
        }
        if(result.success === 'wxPayH5'){
          that.wxPayH5(result.payUrl)
        }
        // 成功页识别二维码
        if(typeof result == 'string'){
          result = JSON.parse(result)
          if(result.success === 'IdentifyImgStart'){
            that.QrcodeImg = result.url
            that.showImg = true
          }
          if(result.success === 'IdentifyImgOver'){
            that.showImg = false
          }
        }
      })
      this.init()
    },
    beforeDestroy() {

    },
    methods: {
      init() {
        setToken('goodsLiveUrlLink',this.$route.query.liveUrl) // 用于h5 回调跳转
        if (this.isWechat) {
          this.wechatPage()
        } else {
          if (this.orderId && this.lichee === 'lichee') {
            this.handlichee()
          }
          this.notWechatPage()
        }
      },
      //ipsLogin 学习中心h5登录
      ipsLogin() {
        let that = this;
        window.KKBPassport.init({
          loginType: ['phone'],
          mobileModal: true,
          appId: KKBPassportAppId,
          platForm: 'h5',
          onSuccess: data => {
            // 回调函数中 包含accessToken groudId 自行处理即可 实例如下
            if (data.accessToken) {
              localStorage.setItem('KKBLoginToken', data.accessToken)
            }
          }
        })
        window.KKBPassport.show()
      },
      handlichee(){ // 处理直播间h5 支付成功
        let that = this
        localStorage.setItem('isShowLicheBtn', 1)
        this.licheeIframeUrl = `${getToken('vipCurrentUrl')}&isGoodsShelves=isTrue&orderId=${this.orderId}`
        setTimeout(function () { // 延迟1s 弹起
          that.payBox = (that.$route.query.orderId && that.$route.query.lichee === 'lichee') ? true : false
        },1000)
      },
      handOrder() {
        // 发送通知到货架列表，通知跳转 // 处理直播间h5 支付成功
        localStorage.setItem('goodsLinkUrlOrderId', this.orderId)
      },
      wxPayH5(url){
        window.location.href = url
      },
      wxPay(obj) {
        let wxPayParams = {}
        wxPayParams.appId = obj.appId //公众号名称，由商户传入
        wxPayParams.timeStamp = obj.timeStamp //时间戳，自1970年以来的秒数
        wxPayParams.nonceStr = obj.nonceStr //随机串
        wxPayParams.package = obj.package
        wxPayParams.signType = obj.signType //微信签名方式：
        wxPayParams.paySign = obj.paySign //微信签名

        let onBridgeReady = () => {
          WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, async (res) => {
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 加类型判断 跳转逻辑-
              if(obj.isGoodsShelves === 'isTrue'){
                localStorage.setItem('goodsLinkUrl', `${cashierLink()}paysuccess?orderId=${obj.orderNo}`)
              }
              if(obj.lichee === 'lichee'){
                localStorage.setItem('licheeLinkUrl', `${cashierLink()}paysuccess?orderId=${obj.orderNo}`)
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

        implementWxPay()
      },
      wechatPage() {
        this.judgeWechatLogin()
      },
      notWechatPage() {

      },
      judgeWechatLogin() {
        if (getToken("openid") && getToken("unionid")) {
          if (getToken("openid").indexOf("channelParams") === 0 || getToken("unionid").indexOf("channelParams") === 0) {
            this.wxAuthor()
            return
          }
        } else {
          this.wxAuthor()
        }
      },
      wxAuthor() {
        if (authorize.isEmpty(this.wxCode)) {
          authorize.obtainGetCode()
        } else {
          authorize.codeGetAccess(this.wxCode, this.handWxLoginSuccess)
        }
      },
      handWxLoginSuccess() {

      }
    }
  }
</script>

<style lang="css" scoped>
  #show-iframe {
    width: 100%;
    height: 100%;
    display: block;
    background: #000;
  }

  #show-iframe2{
    width: 100%;
    height: 100%;
    display: block;
  }
  .goodscontent {
    width: 100%;
    height: 100%;
  }
  .paysuccessbox{
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    transition: 0.5s;
    height: 0;
    background: #000;
  }
  .erweimaClass{
    opacity: 0.01;
    width: 100%;
    z-index: 99999999;
    position: absolute;
    bottom: 3%;
    left: 0;
    -webkit-touch-callout: none;
  }
</style>
