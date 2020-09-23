<template>
  <div id="GroupPay">
    <div class="title" >
      <span class="downt"><img src="../../../assets/img/payImgs/pay_close.png" alt=""></span>
      <span>付款详情</span>
      <span @click="depositGroupPayMatHide" class="down"><img src="../../../assets/img/payImgs/pay_close.png" alt=""></span>
    </div>
    <div class="group_pay_info">
      <div class="money_wapper">
        <span class="money">
          ¥{{orderPaymentData.currentAmount}}
          <span class="sign">
            {{orderPaymentData.currentPayType === 1?"付尾款":"首付款"}}
          </span>
        </span>
      </div>
      <div class="goods_info">
        <div class="goods_title">商品信息</div>

        <div class="goods_list" v-show="orderPaymentData.childOrder.length > 0" v-for="(item,index) of orderPaymentData.childOrder" :key="index">
          <div class="goods_name">{{item.courseName}}</div>
          <div class="money_info">
            <span v-if="item.deposit && item.balance1">
              <span :class="orderPaymentData.currentPayType === 1?'':'iscolor'">¥{{item.deposit}}首</span> + <span :class="orderPaymentData.currentPayType === 1?'iscolor':''">¥{{item.balance1}}尾</span>
            </span>
            <span v-if="!item.deposit && !item.balance1" :class="orderPaymentData.currentPayType === 1?'':'iscolor'">¥{{item.amount}}全</span>
          </div>
        </div>
        <div class="goods_list" v-if="orderPaymentData.childOrder.length <= 0">
          <div class="goods_name">{{orderPaymentData.name}}</div>
          <div class="money_info">
            <span>¥{{orderPaymentData.currentAmount}}</span>
          </div>
        </div>
      </div>
      <div class="pay_wapper" @click="depositPayTypesMatShow">
        <span>付款方式</span>
        <div>{{payItem.name}}支付<img class="right_icon" src="../../../assets/img/right.png" alt="" ></div>
      </div>
      <div class="pay_text_bot">
        点击立即付款即代表您已阅读并同意<span @click="showDownProtocol">《首付款协议》</span>
      </div>
      <div class="pay_btn_wapper">
        <button @click="immediatelyPay()">立即付款</button>
      </div>
    </div>
  </div>
</template>


<script>
import { getToken, routeUrl, timestampToTime, cashierLink, isPcDingTalkWS, getParam } from "../../../assets/js/filter"
import { getOrderPart, orderPartPay,apiCodeWarn,getCheckUninonid,kkblogin,groupPayorder} from "../../../api/api"

let version = navigator.userAgent.toLowerCase().indexOf("micromessenger")
export default {
  data(){
    return{
      isWx: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1,
    }
  },
  methods:{
    depositPayTypesMatShow() {
      this.$emit("depositPayTypesMatShow");
    },
    depositGroupPayMatHide(){
      this.$emit("depositGroupPayMatHide")
    },
    showDownProtocol(){
      this.$emit("showDownProtocol")
    },
    goPay(){
      debugger
      let payType = null

      if (isPcDingTalkWS()) {
        payType = this.payItem ? this.payItem.payType : 0
      } else {
        payType = this.payItem ? this.payItem.payType : 1
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
      } else {
        this.stagesPay(payType)
      }
    },
    // 立即支付
    immediatelyPay(){
      console.log("支付")
      console.log(this.payItem.code)
      this.$emit("unityPay",this.payItem.code)
      // const openid = getToken("openid")
      // if(getToken("cacheuserid")){
      //   this.goPay()
      // }else{
      //   if(getToken('unionid')){
      //     getCheckUninonid(getToken('unionid')).then((res)=>{
      //       if(res.data.code===0){
      //         localStorage.setItem("cacheuserid",res.data.data.uid)
      //         this.goPay()
      //       }else{
      //         // 登陆
      //       }
      //     })
      //   }else{
      //     // 登陆
      //   }
      // }
    },
    wxPay(payType) {
      debugger
      console.log(this.orderNo)
      // const orderPartId = `&orderPartId=${this.payId}`
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let wxPayParams = {},
      //   //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
      sendData = {}
      let _that = this
      let getPayUrl 
      if(Number(this.sell)===1){
        debugger
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
        getPayUrl =  groupPayorder(sendData)
      }else{
        alert("不是组合商品")
        return
      }
      getPayUrl
        .then((res) => {
          debugger
          if (res.data.code == 0) {
            if (navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1) {
              let flag = location.href.indexOf("?") != -1 ? "&" : "?"
              location.assign(res.data.data.mwebUrl + "&redirect_url=" + encodeURIComponent(location.href + flag + "orderId=" + orderNos))
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
      let _this = this
      //H5调起微信支付
      let onBridgeReady = () => {
        WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            //成功后跳转到支付成功页面
            // window.location.href - `${cashierLink()}groupDepositSuccess?orderId=${orderNos}`
            if (_this.orderLen === 2) {
              if (_this.curPayType === 0) {
                window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`
              } else {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`
              }
            }

            if (_this.orderLen === 3) {
              if (_this.curPayType === 0) {
                window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`
              }
              if (_this.curPayType === 1) {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=1&deadlineTime=${_this.deadlineTime}`
              }
              if (_this.curPayType === 2) {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`
              }
            }
          }
          if (res.err_msg == "get_brand_wcpay_request:cancel") {
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
      debugger
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let sendData = {}
      let _this = this
      const orderPartId = "&orderPartId=" + this.payId
      let getPayUrl 
      if(Number(this.sell)===1){
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
        getPayUrl =  groupPayorder(sendData)
      }else{
        alert("不是组合商品")
        return
      }

      //请求获取支付宝参数
      getPayUrl
        .then((res) => {
          if (res.data.code == 0) {
            if (_this.orderLen === 2) {
              if (_this.curPayType === 0) {
                top.location.href =
                  routeUrl() +
                  "alipay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  orderPartId +
                  "&cashPartType=0"
              } else {
                top.location.href =
                  routeUrl() +
                  "alipay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=2" +
                  orderPartId +
                  "&cashPartType=2"
              }
            }

            if (_this.orderLen === 3) {
              if (_this.curPayType === 0) {
                top.location.href =
                  routeUrl() +
                  "alipay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  orderPartId +
                  "&cashPartType=0"
              }
              if (_this.curPayType === 1) {
                top.location.href =
                  routeUrl() +
                  "alipay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=1&deadlineTime=" +
                  _this.deadlineTime +
                  orderPartId +
                  "&cashPartType=1"
              }
              if (_this.curPayType === 2) {
                top.location.href =
                  routeUrl() +
                  "alipay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=2" +
                  orderPartId +
                  "&cashPartType=2"
              }
            }
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            })
            _this.kkbregist = true
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
    // 其他支付
    stagesPay(payType) {
      debugger
      const orderNos = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      let sendData = {}
      let that = this
      //type == 'CHEESE' ? 5 : 6

      let getPayUrl 
      if(Number(this.sell)===1){
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
        getPayUrl =  groupPayorder(sendData)
      }else{
        alert("不是组合商品")
        return
      }

      getPayUrl
        .then((res) => {
          if (res.data.code == 0) {
            top.location.href = res.data.data.payUrl
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            })
            that.kkbregist = true
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
          console.log("stagesPay", err)
        })
    },
     // 京东支付
    jdPay(payType) {
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: payType,
      }
      let getPayUrl 
      if(Number(this.sell) === 1){
        sendData = {
          openid: getToken("openid")||"",
          orderNo: this.orderNo||"",
          payType: payType,
          unionid:getToken('unionid')||"",
          parts:this.parts||"",
          userId:"",
          endpoint:""
        }
        // payRequest = 
        if (version === -1 && !isPcDingTalkWS()) {
          sendData.endpoint = "PE-H5"
        }
        getPayUrl = groupPayorder(sendData)
      }else{
        alert("不是组合商品")
        return
      }
      getPayUrl.then((res) => {
        console.log(res)
        if (res.data.code == 0) {
          if (version !== -1) {
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
    },
  },
  props:["payItem","sell","orderPaymentData","orderNo","parts"]
}
</script>


<style scoped>
#GroupPay{
  background: #fff;
  width: 100%;
  position: absolute;
  bottom: 50px;
}

#GroupPay .title{
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ccc;
}
.downt img{
  visibility:hidden;
  width: 15px;
}
#GroupPay .title .down img{
  width: 15px;
}
.group_pay_info{
  padding: 10px 0px;
  box-sizing: border-box;
}
.money_wapper{
  text-align: center;
  padding: 10px 0;
  box-sizing: border-box;
}
.money_wapper .money{
  position: relative;
  font-size: 28px;
  display: inline-block;
}
.money_wapper .money .sign{
  position: absolute;
  font-size: 12px;
  display: inline-block;
  top: -5px;
  right: -35px;
  background: #fff2e9;
  border: 1px solid #ffbb9a;
  color: #ff552d;
  border-radius: 3px;
  padding: 0 6px;
}
.goods_info{
  padding: 0 15px 10px 15px;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
}
.goods_title{
  font-size: 14px;
  color: #999;
  font-weight: bold;
}
.goods_list{
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 5px;
}
.goods_name{
  width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #333;
}
.money_info{
  color: #666;
}
.iscolor{
  color: #ff552d;
}

.pay_wapper{
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  border-bottom: 1px solid #ccc;
  font-size: 14px;
}
.pay_wapper span{
  color: #999;
  font-weight: bold;
}
.pay_wapper div{
  display: flex;
  align-items: center;
}
.pay_wapper .right_icon{
  width: 20px;

}
.pay_text_bot{
  padding: 10px 15px;
  box-sizing: border-box;
  font-size: 14px;
  height: 100px;
}
.pay_text_bot span{
  color: #008fe5;
}
.pay_btn_wapper{
  padding: 0 15px;
}

.pay_btn_wapper button{
  width: 100%;
  background: #008fe5;
  color: #fff;
  padding: 10px 0;
  font-size: 16px;
  border-radius: 5px;
  border: none;
  outline: none;
}

</style>