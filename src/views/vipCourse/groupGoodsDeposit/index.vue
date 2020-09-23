<template>
  <div class="group_pay_info">
    <div class="money_wapper">
      <span class="money">
        <i>¥</i>{{orderPaymentData.currentAmount}}
        <span class="sign" v-if="orderPaymentData.channelModel === 1">
          <!-- {{?"付尾款":"首付款"}} -->
          <img v-if="orderPaymentData.currentPayType === 1" src="../../../assets/img/payImgs/weikuan.png" />
          <img v-else src="../../../assets/img/payImgs/shoufukuan.png" />
        </span>
      </span>
    </div>
    <div class="goods_info">
      <div class="goods_title">商品信息</div>
      <template v-for="(item,index) of orderPaymentData.childOrder" >
        <div v-if="orderPaymentData.channelModel === 0" :key="index" v-show="index < showNum">
          <div class="goods_list">
            <div class="goods_name">{{item.courseName}}</div>
            <div class="money_info">
              <div v-if="orderPaymentData.currentPayType === 1 && item.balance1 && item.deposit">¥{{item.balance1}}尾款</div>
              <div v-if="orderPaymentData.currentPayType === 0 && item.balance1 && item.deposit">¥{{item.deposit}}首付款</div>
              <div v-if="!item.balance1 && !item.deposit">¥{{item.amount}}全款</div>
            </div>
          </div>
          <div class="balance1_money" v-if="!item.balance1 && !item.deposit"></div>
          <div class="balance1_money" v-if="item.balance1 && item.deposit">¥{{orderPaymentData.currentPayType === 0 ? item.balance1+"尾款":item.deposit+"首付款"}}</div>
        </div>
      </template>
      <div v-if="orderPaymentData.childOrder && orderPaymentData.childOrder.length > 3 && orderPaymentData.channelModel !== 1" @click="showMore" class="showmore">
        <span>{{showNum === 3 ?"展开更多":"点击收起"}}</span>
        <img :class="showNum === 3 ? 'down_icon' : 'down_icon top'" src="../../../assets/img/right.png"/>
      </div>
      <div class="goods_list" v-if="orderPaymentData.channelModel === 1">
        <div class="goods_name">{{orderPaymentData.name}}</div>
        <div class="money_info">
          <span>¥{{orderPaymentData.orderAmount}}</span>
        </div>
      </div>
      
    </div>

    <div class="pay_types_wapper">
      <div class="goods_title">付款方式</div>
      <div class="goods_list_wapper">
        <template id v-for="(item,index) in payListNew" >
          <div :key="index" :class="['all-pay',item.cls]"  @click="choosePaytype(item)">
            <div style="display: flex;align-items: center">
              <img
                class="pay_icon"
                :style="{marginRight:'12px'}"
                :src="`https://img.kaikeba.com/${item.icon}`"
                alt
              />
              <span class="pay_name">{{item.name}}</span>
            </div>
            <div class="radio_wapper">
              <input :id="'pay_'+item.id" type="radio" name="payType" :checked="item.id === payItem.id">
              <label :for="'pay_'+item.id"></label>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div style="height:110px"></div>
    <div class="bottom_pay">
      <div class="pay_text_bot">
        点击立即付款即代表您已阅读并同意<span @click="showDownProtocol">《首付款协议》</span>
      </div>
      <div class="pay_btn_wapper">
        <button @click="pay()">立即付款</button>
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
     <!--定金协议内容-->
    <transition name="slide-fade-two">
      <div v-show="isShowPol" class="show-marks two">
        <div class="agreement mark-head" style="background-size: 100% 55px">
          培训协议（首付款模式）
          <img
            @click="closeDownProtocol"
            class="mark-head-img"
            src="../../../assets/img/payImgs/pay_close.png"
          />
        </div>
        <div class="agreement-contains">
          <div class="agree-content">
            <Agreement />
          </div>
        </div>
      </div>
    </transition>
  </div>

</template>


<script>
import { getToken, routeUrl, timestampToTime, cashierLink, isPcDingTalkWS, getParam, setToken } from "../../../assets/js/filter"
import { groupPayment,getOrderPart,urlGetOrderStatus,orderPartPay,apiCodeWarn,getCheckUninonid,kkblogin,groupPayorder} from "../../../api/api"
import Agreement from "../cashier/agreement"
import { Toast } from "we-vue"
import { _AP } from "../../../assets/js/urlencode"

let requestTimer
let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
export default {
  data(){
    return{
      showNum:3,
      isShowPol:false,
      isWx: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1,
      orderNo:this.$route.params.orderNo,
      openid:this.$route.params.openid,
      parts:this.$route.query.sub_goods_id||'',
      isParts:this.$route.query.sub_goods_id||'',
      userid:this.$route.params.id,
      orderPaymentData:Object,
      payListNew:Array,
      payItem:{},
      payType:null,
      paySearch:false
    }
  },
  components: {
    Agreement
  },
  mounted(){
    this.moveScroll()
    setToken("openid",this.$route.params.openid)
    setToken("cacheuserid",this.$route.params.id)
    this.getGroupPayment()
    this.handleDom()
  },
                                     
  methods:{
    handleDom() {
      const flag = this.$route.query.groupOrderId ? true : false;
      console.log(flag)
      if (version === -1 && flag) {
        this.paySearch = true;
      }
    },
    loadthisUrl(isOrderId) {
      if (isOrderId) {
        window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${this.orderNo}`
      } else {
        this.paySearch = false;
      }
    },
    pay() {
      this.goPay()
    },
    goPay(){
      debugger
      let payType = null
      if (isPcDingTalkWS()) {
        payType = this.payItem ? this.payType : 0
      } else {
        payType = this.payItem ? this.payType : 1
      }
      if (payType === 0) {
        this.aliPay(payType)
      } else if (payType === 1) {
        if (!this.isWx) {
          this.payType = 13
          this.wxPay(payType)
        } else {
          this.wxPay(payType)
        }
      } else if (payType === 13) {
        this.wxPay(payType)
      } else if (payType === 16) {
        this.jdPay(payType)
      } else {
        this.stagesPay(payType)
      }
    },
    wxPay(payType) {
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let wxPayParams = {},_that = this,
        //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
      sendData = {
        openid: getToken("openid")||"",
        orderNo: orderNos,
        payType: payType,
        unionid:getToken('unionid')||"",
        parts:this.parts||"",
        userId:getToken("cacheuserid"),
        endpoint:""
      }
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5"
      }
      groupPayorder(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
              let flag = location.href.indexOf("?") != -1 ? "&" : "?"
              location.assign(res.data.data.mwebUrl + "&redirect_url=" + encodeURIComponent(location.href + flag + "groupOrderId=" + orderNos))
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
            _that.kkbregist = true
            // this.wxAuthor()
            // apiCodeWarn(res)
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
        WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            //成功后跳转到支付成功页面
            window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${_that.orderNo}`
          }
          if (res.err_msg == "get_brand_wcpay_request:cancel") {
            Toast.fail({
              duration: 1000,
              message: '支付失败'
            })
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
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let _that = this
      let sendData = {
        openid: getToken("openid")||"",
        orderNo: orderNos,
        payType: payType,
        unionid:getToken('unionid')||"",
        parts:this.parts||"",
        userId:getToken("cacheuserid"),
        endpoint:""
      }
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5"
      }
      //请求获取支付宝参数
      groupPayorder(sendData)
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
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            })
          }else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            })
            apiCodeWarn(res)
          }
        })
        .catch((err) => {
          console.log("aliPay", err)
        })
    },
// jdPay
    jdPay(payType){
      debugger
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let sendData = {},_that = this;
      sendData = {
        openid: getToken("openid")||"",
        orderNo: orderNos,
        payType: payType,
        unionid:getToken('unionid')||"",
        parts:this.parts||"",
        userId:getToken("cacheuserid"),
        endpoint:""
      }
      
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5"
      }
      debugger
      groupPayorder(sendData).then((res) => {
        console.log(res)

        if (res.data.code == 0) {
          debugger
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
    },
// 分期
    stagesPay(payType) {
      debugger
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let that = this
      let sendData = {
        openid: getToken("openid")||"",
        orderNo: orderNos,
        payType: payType,
        unionid:getToken('unionid')||"",
        parts:this.parts||"",
        userId:getToken("cacheuserid"),
        endpoint:""
      }
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5"
      }
      groupPayorder(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            top.location.href = res.data.data.payUrl
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            })
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            })
            apiCodeWarn(res)
          }
        })
        .catch((err) => {
          console.log("stagesPay", err)
        })
    },
    showMore(){
      if(this.showNum  === 3){
        this.showNum = this.orderPaymentData.childOrder.length
      } else{
        this.showNum = 3
      }  
    },
    // 选择支付方式
    choosePaytype(item){
      this.payItem = item
      this.payType = this.payItem.payType
    },
    showDownProtocol() {
      this.isShowPol = true
      this.stopScroll()
    },
    closeDownProtocol() {
      this.isShowPol = false
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
      document.body.style.position = "initial"
    },
    getGroupPayment(){
      let params = {
        no: this.orderNo,
        unionid:getToken("unionid"),
        openid:this.openid,
        parts:this.isParts,
        userId:getToken("cacheuserid"),
      }
      groupPayment(params).then((res)=>{
        if(res.data.code === 0){
          this.partsMatch = res.data.data.partsMatch
          if(this.partsMatch === 0){
            this.parts = ""
          }
          this.orderPaymentData = res.data.data
          this.getPayList(res.data.data.payChannels)
        }else if(res.data.code === 60011){
          window.location.href = `${cashierLink()}groupDepositSuccess?orderId=${this.orderNo}`
        }else{
          Toast.fail({
            duration: 1000,
            message: res.data.msg
          })
        }
      })
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
      this.payType = this.payItem.payType
    },
  }
}
</script>


<style scoped>
.money_wapper{
  text-align: center;
  padding: 41px 0 30px 0;
  box-sizing: border-box;
  border-bottom: 10px solid #fafafa;
}
.money_wapper .money{
  position: relative;
  display: inline-block;
  height:56px;
  font-size:48px;
  font-family:DINAlternate-Bold,DINAlternate;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:56px;
}
.money_wapper .money i{
  font-style: normal;
  font-size: 24px;
  font-weight: 500;
  height:28px;
  font-family:DINAlternate-Bold,DINAlternate;
  font-weight:bold;
  color:rgba(51,51,51,1);
  line-height:28px;
}
.money_wapper .money .sign{
  position: absolute;
  font-size: 12px;
  display: inline-block;
  width: 40px;
  height: 17px;
  top: 5px;
  right: -35px;
  text-align: left;
}
.money_wapper .money .sign img{
  height: 17px;
  position: absolute;
  top: 0;
  left: 0;
}
.pay_types_wapper, .goods_info{
  padding: 14px 18px;
  box-sizing: border-box;
  border-bottom: 10px solid #fafafa;
}
.pay_types_wapper{
  padding-bottom: 0;
}
.goods_title{
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:20px;
  margin-bottom: 14px;
}
.goods_list{
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  /* margin-top: 14px; */
}
.goods_name{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width:210px;
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:20px;
}
.money_info{
  font-size:14px;
  font-family:ArialMT;
  color:rgba(51,51,51,1);
  line-height:16px;
}
.balance1_money{
  text-align: right;
  height:18px;
  line-height: 14px;
  font-size:10px;
  font-family:ArialMT;
  color:rgba(153,153,153,1);
  line-height:11px;
}
.bottom_pay{
  position: fixed;
  height:110px;
  width: 100%;
  height: 1;
  bottom: 0;
  padding: 20px 0;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pay_text_bot{
  text-align: center;
  box-sizing: border-box;
  font-size: 14px;
  color: #999;
}
.pay_text_bot span{
  color: #00AFF2;
}
.pay_btn_wapper{
  padding: 0 15px;
}

.pay_btn_wapper button{
  width: 100%;
  background: #00AFF2;
  color: #fff;
  padding: 10px 0;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  outline: none;
}

.all-pay{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 0px;
  border-bottom: 1px solid #eee;
}
.all-pay:last-child{
  border: none;
}
.pay_icon{
  width: 22px;
}
.pay_name{
  height:16px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:16px;
}
.radio_wapper{
  position: relative;
  width: 15px;
  height: 15px;
}
input[type="radio"] {
  width: 15px;
  height: 15px;
  opacity: 0;
}

label {
  position: absolute;
  left: 0px;
  top: 3px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #999;
}

input:checked+label { 
  background-color: #00AFF2;
  border: 1px solid #00AFF2;
}
input:checked+label::after {
  position: absolute;
  content: "";
  width: 4px;
  height: 9px;
  top: 1px;
  left: 5px;
  border: 2px solid #fff;
  border-top: none;
  border-left: none;
  transform: rotate(45deg);
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
.mark-head {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #f4f4f4
}
.agreement.mark-head {
  background: url("./../../../assets/img/payImgs/headbg.png") top center repeat;
  background-size: 100% 54px;
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
.mark-head-img {
  position: absolute;
  top: 16px;
  right: 15px;
  width: 12px;
  height: 12px;
  cursor: pointer;
}
.agree-content {
  height: auto;
  overflow-y: auto;
  padding: 8px 8px 12px;
  margin-top: 10px;
}
.showmore{
  text-align: center;
  height:17px;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:17px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.down_icon{
  width: 11px;
  transform: rotate(90deg)
}
.down_icon.top{
  transform: rotate(-90deg)
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
</style>