<template>
  <div class="container">
    <div class="cash-bg">
      <div class="info">
        <p class="discount">
          <img
            class="dis-icon"
            src="https://img.kaikeba.com/a/23159141500202dint.png?imageView2/0/interlace/1/q/90|imageslim"
            alt
          />
          <span>¥</span>
          {{orderData.amount.toFixed(2)}}
        </p>
        <p class="origin">
          原价
          <span>¥{{orderData.price}}</span>
        </p>
        <p v-if="startTime && curPayType === 0" class="discount-time">
          优惠剩余时间
          <span>{{data.days}}:{{data.hourse}}:{{data.minute}}:{{data.second}}</span>
        </p>
        <p class="order-num">
          订单编号：
          <span>{{typeof orderNo === "string" ? orderNo : orderNo[0]}}</span>
        </p>
      </div>
    </div>
    <div class="process">
      <p class="pro-info">
        您正在支付{{orderLen === 3 ? PAY_STAGE[curPayType] : PAY_STAGE_MIN[curPayType]}}
        <span
          class="pro-time"
        >
          <span class="count-time">{{payCount.days}}</span>天
          <span class="count-time">{{payCount.hourse}}</span>时
          <span class="count-time">{{payCount.minute}}</span>分
          <span class="count-time">{{payCount.second}}</span>秒
        </span>
      </p>
      <div class="pro-ct" v-if="orderData.orderParts">
        <div v-for="(item,index) in orderData.orderParts" class="pro-item" :key="`item${index}`">
          <div v-if="orderLen === 2 && index > 0" class="line line-sel"></div>
          <div v-if="orderLen === 3 && index > 0" class="line-t line-sel"></div>
          <div class="item-index pro-item-top">
            <div
              class="item-circle"
              :class="curObj[index] ? 'item-circle-sel' : 'item-circle-week'"
            >{{orderLen === 3 ? PAY_STAGE[item.type] : PAY_STAGE_MIN[item.type] }}</div>
            <p class="sum" :class="curObj[index] ? 'sum-sel' : 'sum-week'">
              ¥
              <span>{{item.amount}}</span>
            </p>
            <p
              v-if="item.payType === 0 || item.payType"
              class="pay-way-info"
            >{{PAY_WAY[item.payType]}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="pay-ct">
      <p class="pro-info">支付方式</p>
      <div class="pay" @click="showPay()">
        <img v-if="payItem" class="icon" :src="`https://img.kaikeba.com/${payItem.icon}`" />
        <img
          v-if="!payItem && initPayType === 1"
          class="icon"
          src="https://img.kaikeba.com/pay_wechat.png"
        />
        <img
          v-if="!payItem && initPayType === 0"
          class="icon"
          src="https://img.kaikeba.com/pay_apli.png"
        />
        <span class="icon-info">{{payItem ? payItem.name : (initPayType === 0 ? '支付宝' : '微信')}}</span>
        <img
          class="arrow"
          src="https://img.kaikeba.com/a/11348141500202hpmg.png?imageView2/0/interlace/1/q/90|imageslim"
          alt
        />
      </div>
    </div>
    <p class="agreement">
      您已同意
      <span @click="togglePol">《首付款协议》</span>中的相关规则
    </p>
    <div class="pay-btn" @click="pay()">支付</div>
    <div class="pay-way" v-if="isShow">
      <!--支付方式-->
      <transition name="slide-fade">
        <div v-show="true" class="show-marks">
          <div class="mark-head">
            请选择支付方式
            <!-- <img
              class="mark-head-img"
              @click="closePay()"
              src="../../../assets/img/payImgs/pay_close.png"
            />-->
          </div>
          <div class="mark-content">
            <template id v-for="(item,index) in payChannel">
              <div
                :key="index"
                :class="['all-pay',item.cls,index === payIndex ? 'pay-active' : null]"
                @click="selOne(index,item)"
              >
                <img
                  :style="{marginRight: item.code === 'CHEESE' ? '12px' : ''}"
                  :src="`https://img.kaikeba.com/${item.icon}`"
                  alt
                />
                <span>{{item.name}}</span>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
    <!--定金协议内容-->
    <transition name="slide-fade-two">
      <div v-show="isShowPol" class="show-marks two">
        <div class="agreement mark-head" style="background-size: 100% 55px">
          培训协议（首付款模式）
          <img
            @click="togglePol"
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
            <img :src="require('../../../assets/img/A10E08AF-2272-4205-A0BB-8A9AB10B130E.png')" />
          </span>
          <input ref="inputphoneNumber" v-model="registForm.phoneNumber" autofocus />
          <button
            @click="getVerifycode"
            class="verifycodeSublime"
            :class="{'disable': getVerifycodeclicked || (!registForm.phoneNumber)}"
            :disabled="getVerifycodeclicked || (!registForm.phoneNumber)"
          >{{Verifycodenum ? Verifycodenum+'s后重试' : '获取验证码'}}</button>
        </label>
        <label class="label verifycode">
          <span>
            <img :src="require('../../../assets/img/724C2DC2-3B1B-4B51-BDBF-79313B3D090A.png')" />
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
  </div>
</template>
<script>
import Agreement from "./agreement";
import {
  getOrderPart,
  orderPartPay,
  apiCodeWarn,
  getCheckUninonid,
  getVerificode,
  kkblogin,
} from "../../../api/api";
import {
  getToken,
  routeUrl,
  timestampToTime,
  cashierLink,
  isPcDingTalkWS,
  getParam,
} from "../../../assets/js/filter";

import { Toast } from "we-vue";
import { _AP } from "../../../assets/js/urlencode";
import { PAY_WAY, PAY_STAGE, PAY_STAGE_MIN } from "../../../consts";

let version = navigator.userAgent.toLowerCase().indexOf("micromessenger");
export default {
  name: "remind",
  data() {
    return {
      getVerifycodeclicked: false,
      Verifycodenum: 0,
      kkbregist: false,
      registForm: {
        phoneNumber: "",
        verifycode: "",
      },
      PAY_STAGE_MIN,
      PAY_STAGE,
      PAY_WAY,
      model: null,
      deadlineTime: null,
      isWx: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1,
      initPayType: isPcDingTalkWS() ? 0 : 1,
      curPayType: null,
      time1: 675446,
      isShowPol: false,
      payLeftTime: null,
      startTime: null,
      endTime: null,
      payId: null,
      orderData: {},
      orderNo: this.$route.query.orderId,
      payChannel: null,
      payType: null,
      payItem: null,
      orderLen: null,
      curPay: false,
      curPaySec: false,
      curPayThrid: false,
      curObj: {},
      payIndex: null,
      isShow: false,
      paySearch: false,
      isStart: true,
      data: {
        //倒计时天、时、分、秒
        days: "00",
        hourse: "00",
        minute: "00",
        second: "00",
      },
      payCount: {
        days: "00",
        hourse: "00",
        minute: "00",
        second: "00",
      },
      rule: {
        mobile: {
          rule: /^1[1-9][0-9]\d{8}$/,
          message: "手机号格式不正确",
          requiredMsg: "手机号不能为空",
        }
      },
    };
  },
  components: {
    Agreement,
  },
  mounted() {
    clearTimeout(this.timer);
    this.getOrderInfo();
    this.startInerval();
    this.handleDom();
  },
  methods: {
    onInputNotWx(e) {
      this.registForm.verifycode = e.target.value.slice(0, 4);
    },
    closeRegist() {
      this.kkbregist = false;
    },
    goPay() {
      let payType = null;
      if (isPcDingTalkWS()) {
        payType = this.payItem ? this.payType : 0;
      } else {
        payType = this.payItem ? this.payType : 1;
      }
      if (payType === 0) {
        this.aliPay(payType);
      } else if (payType === 1) {
        if (!this.isWx) {
          this.payType = 13;
          this.wxPay(payType);
        } else {
          this.wxPay(payType);
        }
      } else if (payType === 13) {
        this.wxPay(payType);
      } else if (payType === 16) {
        this.jdPay(payType);
      } else {
        this.stagesPay(payType);
      }
    },
    registLogin() {
      debugger;
      if (!this.registForm.phoneNumber) {
        Toast.fail({
          duration: 1000,
          message: "手机号码为必填项",
        });
      } else if (
        !parseInt(this.registForm.phoneNumber) ||
        this.registForm.phoneNumber.length !== 11
      ) {
        Toast.fail({
          duration: 1000,
          message: "手机号码格式错误",
        });
      } else if (!this.registForm.verifycode) {
        Toast.fail({
          duration: 1000,
          message: "验证码为必填项",
        });
      } else if (
        !parseInt(this.registForm.verifycode) ||
        this.registForm.verifycode.length !== 4
      ) {
        Toast.fail({
          duration: 1000,
          message: "验证码码格式错误",
        });
      } else {
        let formdata = new FormData();
        formdata.append("phone", this.registForm.phoneNumber);
        formdata.append("code", this.registForm.verifycode);
        kkblogin(formdata).then((result) => {
          this.closeRegist();
          if (result.data.code === 0) {
            if (result.data.data.data.uid) {
              localStorage.setItem("cacheuserid", result.data.data.data.uid);
              this.goPay();
            } else {
              Toast.fail({
                duration: 1000,
                message: "请求出错请重试",
              });
            }
          } else if (result.data.code !== 0) {
            let message = result.data.msg;
            if (message.indexOf("mobile code") !== -1) {
              message = "验证码错误";
            }
            Toast.fail({
              duration: 1500,
              message: message,
            });
          }
        });
      }
    },
    getVerifycode() {
      if (!this.registForm.phoneNumber) {
        Toast.fail({
          duration: 1000,
          message: "手机号码为必填项",
        });
      } else if (
        !parseInt(this.registForm.phoneNumber) ||
        this.registForm.phoneNumber.length !== 11
      ) {
        Toast.fail({
          duration: 1000,
          message: "手机号码格式错误",
        });
      } else {
        if (this.Verify) return;

        let rul = this.rule["mobile"]
        if(!rul.rule.test(this.registForm.phoneNumber)){
          Toast.text({
            duration: 1000,
            message: "手机号码格式错误"
          });
          return 0;
        }

        let result = getVerificode(this.registForm.phoneNumber);
        result
          .then((result) => {
            this.getVerifycodeclicked = true;
            this.Verifycodenum = 60;
            this.Verify = setInterval(() => {
              this.Verifycodenum = this.Verifycodenum - 1;
              if (this.Verifycodenum === 0) {
                clearInterval(this.Verify);
                this.getVerifycodeclicked = false;
                this.Verify = null;
              }
            }, 1000);
            Toast.success({
              duration: 1000,
              message: "验证码已发送",
            });
          })
          .catch((e) => {
            {
              console.log(e);
            }
          });
      }
    },
    loadthisUrl(isOrderId) {
      const orderPartId = `&orderPartId=${sessionStorage.getItem(
        "deposit-payId"
      )}`;
      const orderNo =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      if (getParam(location.href, "orderId")) {
        if (isOrderId) {
          this.wxMobilePayLink();
          location.assign(
            `${cashierLink()}paysuccess?orderId=${orderNo}${orderPartId}`
          );
        } else {
          this.paySearch = false;
        }
      } else {
        location.reload();
      }
    },
    handleDom() {
      const flag = typeof this.orderNo === "string" ? true : false;
      if (version === -1 && !flag) {
        this.paySearch = true;
      }
    },
    togglePol() {
      this.isShowPol = !this.isShowPol;
    },
    handlePayId(payId) {
      if (!sessionStorage.getItem("deposit-payId")) {
        sessionStorage.setItem("deposit-payId", payId);
      }
    },
    getOrderInfo() {
      const orderNo = typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0]
      getOrderPart(orderNo).then((res) => {
        const data = res.data;
        if (data.code === 0 && data.msg == "Success") {
          this.handlePayId(data.data.payId)
          let payChannel = data.data.payChannel
          data.data.startTime && data.data.endTime && this.countTime()
          this.orderData = data.data
          this.model = data.data.model
          this.payChannel = isPcDingTalkWS() ? payChannel.filter((item) => item.payType !== 1) : payChannel
          if (isPcDingTalkWS()) {
            // 支付宝
            if(this.isStart){
              let findIndex = this.payChannel.findIndex((item) => item.code === 'ALIPAY')
              this.selOne(findIndex, this.payChannel[findIndex])
              this.isStart = false
            }
          } else {
            // 微信
            if(this.isStart){
              let findIndex = this.payChannel.findIndex((item) => item.code === 'WECHAT')
              this.selOne(findIndex, this.payChannel[findIndex])
              this.isStart = false
            }
          }
          this.orderLen = data.data.orderParts.length;
          this.startTime = data.data.startTime;
          this.endTime = data.data.endTime;
          this.payId = data.data.payId;
          this.payLeftTime = data.data.timeLeftSecond;
          this.curPayType = data.data.type;
          this.deadlineTime = data.data.deadlineTime;
          if (this.orderData.orderParts[0].status !== 1) {
            this.curObj = {
              0: true,
              1: false,
              2: false,
            };
          }
          if (
            this.orderData.orderParts[0].status === 1 &&
            this.orderData.orderParts[1].status !== 1
          ) {
            this.curObj = {
              0: false,
              1: true,
              2: false,
            };
          }
          if (
            this.orderData.orderParts[2] &&
            this.orderData.orderParts[1].status === 1 &&
            this.orderData.orderParts[2].status !== 1
          ) {
            this.curObj = {
              0: false,
              1: false,
              2: true,
            };
          }
        } else {
          alert("服务错误，请重试");
        }
      });
    },
    pay() {
      const openid = getToken("openid");
      let payType = null;
      // if (isPcDingTalkWS()) {
      //   payType = this.payItem ? this.payType : 0
      // } else {
      //   payType = this.payItem ? this.payType : 1
      // }
      if (this.model === 1) {
        if (getToken("cacheuserid")) {
          this.goPay();
        } else {
          if (getToken("unionid")) {
            getCheckUninonid(getToken("unionid")).then((res) => {
              if (res.data.code === 0) {
                localStorage.setItem("cacheuserid", res.data.data.uid);
                this.goPay();
              } else {
                this.kkbregist = true;
              }
            });
          } else {
            this.kkbregist = true;
          }
        }
      } else {
        this.goPay();
      }
    },
    wxPay(payType) {
      const orderPartId = `&orderPartId=${this.payId}`;
      const orderNos =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      let wxPayParams = {},
        //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
        sendData = {
          openid: getToken("openid"),
          orderNo: orderNos,
          payType: payType,
          orderPartId: this.payId,
          userId: getToken("cacheuserid"),
        };
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5";
      }

      let _that = this;
      orderPartPay(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            if (
              navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1
            ) {
              let flag = location.href.indexOf("?") != -1 ? "&" : "?";
              location.assign(
                res.data.data.mwebUrl +
                  "&redirect_url=" +
                  encodeURIComponent(
                    location.href + flag + "orderId=" + orderNos
                  )
              );
            } else {
              //获取jsApiParameData
              wxPayParams.appId = res.data.data.appId; //公众号名称，由商户传入
              wxPayParams.timeStamp = res.data.data.timeStamp; //时间戳，自1970年以来的秒数
              wxPayParams.nonceStr = res.data.data.nonceStr; //随机串
              wxPayParams.package = res.data.data.packageValue;
              wxPayParams.signType = res.data.data.signType; //微信签名方式：
              wxPayParams.paySign = res.data.data.paySign; //微信签名
              implementWxPay();
            }
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            });
            _that.kkbregist = true;
            // this.wxAuthor()
            // apiCodeWarn(res)
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            });
            apiCodeWarn(res);
          }
        })
        .catch((err) => {
          console.log("wxPay", err);
        });
      let _this = this;
      //H5调起微信支付
      let onBridgeReady = () => {
        WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, function (
          res
        ) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            //成功后跳转到支付成功页面
            if (_this.orderLen === 2) {
              if (_this.curPayType === 0) {
                window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`;
              } else {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`;
              }
            }

            if (_this.orderLen === 3) {
              if (_this.curPayType === 0) {
                window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`;
              }
              if (_this.curPayType === 1) {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=1&deadlineTime=${
                  _this.deadlineTime
                }`;
              }
              if (_this.curPayType === 2) {
                window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`;
              }
            }
          }
          if (res.err_msg == "get_brand_wcpay_request:cancel") {
          }
        });
      };

      let implementWxPay = () => {
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener(
              "WeixinJSBridgeReady",
              onBridgeReady,
              false
            );
          } else if (document.attachEvent) {
            document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
            document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
          }
        } else {
          onBridgeReady();
        }
      };
    },
    wxMobilePayLink() {
      const orderPartId = `&orderPartId=${this.payId}`;
      const orderNos =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      let _this = this;
      //成功后跳转到支付成功页面
      if (_this.orderLen === 2) {
        if (_this.curPayType === 0) {
          window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`;
        } else {
          window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`;
        }
      }

      if (_this.orderLen === 3) {
        if (_this.curPayType === 0) {
          window.location.href = `${cashierLink()}paysuccess?orderId=${orderNos}${orderPartId}&cashPartType=0`;
        }
        if (_this.curPayType === 1) {
          window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=1&deadlineTime=${
            _this.deadlineTime
          }`;
        }
        if (_this.curPayType === 2) {
          window.location.href = `${cashierLink()}downsuc?orderId=${orderNos}&type=2`;
        }
      }
    },
    //支付宝支付
    aliPay(payType) {
      const orderNos =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      let sendData = {
        openid: getToken("openid"),
        orderNo: orderNos,
        payType: payType,
        orderPartId: this.payId,
        userId: getToken("cacheuserid"),
      };
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5";
      }
      let _this = this;
      const orderPartId = "&orderPartId=" + this.payId;
      //请求获取支付宝参数
      orderPartPay(sendData)
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
                  "&cashPartType=0";
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
                  "&cashPartType=2";
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
                  "&cashPartType=0";
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
                  "&cashPartType=1";
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
                  "&cashPartType=2";
              }
            }
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            });
            _this.kkbregist = true;
            // this.wxAuthor()
            // apiCodeWarn(res)
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            });
            apiCodeWarn(res);
          }
        })
        .catch((err) => {
          console.log("aliPay", err);
        });
    },
    // jdPay
    jdPay(payType) {
      const orderNos =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      let sendData = {
        openid: getToken("openid"),
        orderNo: orderNos,
        payType: payType,
        orderPartId: this.payId,
        userId: getToken("cacheuserid"),
      };
      if (version === -1 && !isPcDingTalkWS()) {
        sendData.endpoint = "PE-H5";
      }
      let _this = this;
      const orderPartId = "&orderPartId=" + this.payId;
      //请求获取支付宝参数
      orderPartPay(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            if (_this.orderLen === 2) {
              if (_this.curPayType === 0) {
                top.location.href =
                  routeUrl() +
                  "jdpay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  orderPartId +
                  "&cashPartType=0";
              } else {
                top.location.href =
                  routeUrl() +
                  "jdpay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=2" +
                  orderPartId +
                  "&cashPartType=2";
              }
            }

            if (_this.orderLen === 3) {
              if (_this.curPayType === 0) {
                top.location.href =
                  routeUrl() +
                  "jdpay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  orderPartId +
                  "&cashPartType=0";
              }
              if (_this.curPayType === 1) {
                top.location.href =
                  routeUrl() +
                  "jdpay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=1&deadlineTime=" +
                  _this.deadlineTime +
                  orderPartId +
                  "&cashPartType=1";
              }
              if (_this.curPayType === 2) {
                top.location.href =
                  routeUrl() +
                  "jdpay/" +
                  orderNos +
                  "?orderUrl=" +
                  _AP.a_encode(encodeURIComponent(res.data.data.webUrl)) +
                  "&openId=" +
                  getToken("openid") +
                  "&type=2" +
                  orderPartId +
                  "&cashPartType=2";
              }
            }
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            });
            this.kkbregist = false;
            // this.wxAuthor()
            // apiCodeWarn(res)
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            });
            apiCodeWarn(res);
          }
        })
        .catch((err) => {
          console.log("aliPay", err);
        });
    },
    stagesPay(payType) {
      const orderNos =
        typeof this.orderNo === "string" ? this.orderNo : this.orderNo[0];
      let sendData = {
        openid: getToken("openid"),
        orderNo: orderNos,
        payType: payType,
        orderPartId: this.payId,
        userId: getToken("cacheuserid"),
      };
      let that = this;
      //type == 'CHEESE' ? 5 : 6
      orderPartPay(sendData)
        .then((res) => {
          if (res.data.code == 0) {
            top.location.href = res.data.data.payUrl;
          } else if (res.data.code === 60008) {
            Toast.fail({
              duration: 1000,
              message: "信息不一致，请重新授权",
            });
            that.kkbregist = true;
            // this.wxAuthor()
            // apiCodeWarn(res)
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg,
            });
            apiCodeWarn(res);
          }
        })
        .catch((err) => {
          console.log("stagesPay", err);
        });
    },
    selOne(index, item) {
      this.payItem = item;
      this.payIndex = index;
      this.payType = item.payType;
      this.closePay();
    },
    showPay() {
      this.isShow = true;
    },
    closePay() {
      this.isShow = false;
    },

    startInerval() {
      this.payTimer = setInterval(() => {
        this.payCountTime();
      }, 1000);
    },
    stopInterval() {
      clearInterval(this.payTimer);
    },
    payCountTime() {
      if (!this.payLeftTime) {
        return;
      }
      this.payLeftTime -= 1;

      // console.log({ time1: this.time1 })
      if (this.payLeftTime <= 0) {
        this.stopInterval();
        setTimeout(() => {
          this.getOrderInfo();
        }, 2000);
      }
      this.payCount.days = Math.floor(this.payLeftTime / 60 / 60 / 24);
      this.payCount.hourse = Math.floor((this.payLeftTime / 60 / 60) % 24);
      this.payCount.minute = Math.floor((this.payLeftTime / 60) % 60);
      this.payCount.second = Math.floor(this.payLeftTime % 60);

      this.payCount.days =
        this.payCount.days < 10 ? "0" + this.payCount.days : this.payCount.days;
      this.payCount.hourse =
        this.payCount.hourse < 10
          ? "0" + this.payCount.hourse
          : this.payCount.hourse;
      this.payCount.minute =
        this.payCount.minute < 10
          ? "0" + this.payCount.minute
          : this.payCount.minute;
      this.payCount.second =
        this.payCount.second < 10
          ? "0" + this.payCount.second
          : this.payCount.second;
    },

    /*倒计时*/
    countTime() {
      //获取当前时间

      let date = new Date(),
        now = date.getTime(),
        //设置截止时间
        endDate = new Date(timestampToTime(this.endTime).replace(/-/g, "/")),
        end = endDate.getTime(),
        // 设置开始时间
        startDate = new Date(
          timestampToTime(this.startTime).replace(/-/g, "/")
        ),
        start = startDate.getTime(),
        //时间差
        leftTime = now >= start ? end - now : start - now;

      this.begin = now >= start ? true : false;
      //定义变量 d,h,m,s保存倒计时的时间
      // console.log({ now, start, leftTime })
      if (parseInt(leftTime / 1000) > 0) {
        // console.log(
        //   now,
        //   start,
        //   end,
        //   parseInt(leftTime / 1000),
        //   this.data.second
        // );
        // console.log("count")
        this.data.days = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        this.data.hourse = Math.floor((leftTime / 1000 / 60 / 60) % 24);
        this.data.minute = Math.floor((leftTime / 1000 / 60) % 60);
        this.data.second = Math.floor((leftTime / 1000) % 60);
        this.data.days =
          this.data.days < 10 ? "0" + this.data.days : this.data.days;
        this.data.hourse =
          this.data.hourse < 10 ? "0" + this.data.hourse : this.data.hourse;
        this.data.minute =
          this.data.minute < 10 ? "0" + this.data.minute : this.data.minute;
        this.data.second =
          this.data.second < 10 ? "0" + this.data.second : this.data.second;
        this.timer = setTimeout(this.countTime, 1000);
      } else {
        // console.log("else")
        clearTimeout(this.timer);
        setTimeout(() => {
          this.getOrderInfo(true);
        }, 2000);
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.payTimer);
    clearTimeout(this.timer);
  },
};
</script>
<style scoped>
.container {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 40px;
  background: #f3f5f7;
}
.cash-bg {
  width: 100%;
  height: 215px;
  background: url("https://img.kaikeba.com/a/80704141500202ierl.png") center
    center;
}
/* .cash-bg img {
  width: 100%;
  height: 215px;
} */
.info {
  text-align: center;
  padding-top: 46px;
}
.discount,
.origin {
  color: #fff;
  font-family: PingFangSC-Semibold, sans-serif;
}
.discount {
  font-size: 30px;
  line-height: 40px;
  position: relative;
}
.discount span {
  font-size: 20px;
  margin-right: 2px;
}
.origin {
  margin-bottom: 11px;
  font-size: 12px;
  margin-top: -6px;
}
.origin span {
  margin-left: 4px;
  text-decoration: line-through;
}
.discount-time {
  font-family: PingFangSC-Semibold, sans-serif;
  font-size: 11px;
  color: #fff;
  width: 177px;
  height: 32px;
  border-radius: 32px;
  background: rgba(0, 0, 0, 0.29);
  line-height: 32px;
  margin: 0 auto;
}
.discount-time span {
  font-size: 12px;
}
.order-num {
  margin-top: 16.4px;
  color: #fff;
  font-family: PingFangSC-Semibold, sans-serif;
  font-size: 11px;
}
.order-num span {
  font-size: 12px;
}

.pro-ct {
  margin-top: 14px;
  text-align: center;
}
.process {
  width: 89%;
  height: 150px;
  box-sizing: border-box;
  margin: -28px auto 0;
  background: #fff;
  /* border: 1px solid #f00; */
  border-radius: 10px;
}
.pro-info {
  padding: 15px 0 0 20px;
  color: #777;
  font-family: "PingFangSC-Semibold", "sans-serif";
  font-size: 11px;
}
.pro-time {
  margin-left: 9px;
  font-size: 9px;
  color: #999;
}
.count-time {
  color: #f5a623;
  margin-left: -3px;
  margin-right: 2px;
  font-size: 12px;
}
.pro-item {
  /* width: 70px; */
  display: inline-block;
  vertical-align: top;
  font-family: PingFangSC-Semibold, sans-serif;
}
.pro-item-top {
  vertical-align: top;
}
.pay-way-info {
  color: #777;
  font-size: 11px;
}
.item-circle {
  margin: 0 auto;
  width: 41px;
  height: 41px;
  box-sizing: border-box;
  border-radius: 50%;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}
.pro-item .sum {
  font-size: 14px;
  font-weight: 500;
  margin-top: 4px;
  color: #f5a623;
}

.sum-sel {
  color: #f5a623;
}
.sum-week {
  color: #f5a623;
  opacity: 0.3;
}

.item-circle-sel {
  color: #f5a623;
  border: 3px solid #f5a623;
  line-height: 37px;
}
.item-circle-week {
  line-height: 40px;
  color: #fff;
  background: #f5a623;
  opacity: 0.3;
}

.line {
  width: 93px;
  height: 2px;
  margin-left: 10px;
  /* margin-bottom: 75px; */
  display: inline-block;
  /* vertical-align: middle; */
}
.line-t {
  width: 42px;
  height: 2px;
  display: inline-block;
  margin-left: 10px;
}
.line-sel {
  background: #f5a623;
}
.line-week {
  background: #f5a623;
  opacity: 0.3;
}
.item-index {
  display: inline-block;
  vertical-align: top;
}

/* .pay-way {
  font-size: 11px;
  color: #777;
  opacity: 0.3;
} */

.pay-ct {
  width: 89%;
  height: 72px;
  margin: 13px auto 0;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
}
.pay {
  margin-left: 20px;
  position: relative;
}
.icon {
  width: 14px;
  height: 14px;
}
.arrow {
  width: 7px;
  height: 12px;
  position: absolute;
  right: 20px;
  top: 5px;
}
.icon-info {
  font-size: 14px;
  vertical-align: text-bottom;
}
.agreement {
  width: 89%;
  margin: 15px auto 0;
  box-sizing: border-box;
  padding-left: 20px;
  font-size: 12px;
  color: #a7a7a7;
}
.agreement span {
  color: #00aff2;
}
.pay-btn {
  width: 89%;
  height: 40px;
  margin: 40px auto 0;
  border-radius: 21px;
  background: #f5a623;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
.dis-icon {
  position: absolute;
  width: 72px;
  height: 24px;
  top: -22px;
  left: 46%;
}
.show-marks {
  width: 100%;
  /*height: 328px;*/
  background: #fff;
  position: fixed;
  left: 0;
  bottom: 0px;
  z-index: 9998;
  padding-bottom: 50px;
}
.mark-head {
  width: 100%;
  height: 54px;
  text-align: center;
  line-height: 54px;
  font-size: 17px;
  color: #5a5b5c;
  box-sizing: border-box;
  overflow: hidden;
  background: url("../../../assets/img/payImgs/headbg.png") top center repeat;
  background-size: 100% 54px;
  font-weight: 600;
}
.mark-head-img {
  position: absolute;
  top: 25px;
  right: 15px;
  width: 12px;
  height: 12px;
  cursor: pointer;
}
.all-pay {
  width: 64.5%;
  height: 45px;
  border-radius: 48px;
  margin: 0 auto;
  margin-top: 10px;
  text-align: left;
  font-size: 0;
  box-sizing: border-box;
  padding-left: 66px;
  position: relative;
  background: #f1f8fa;
}

.all-pay img {
  vertical-align: middle;
}

.all-pay span {
  font-size: 14px;
  vertical-align: middle;
  line-height: 45px;
  color: #666666;
}
.all-pay img {
  width: 23px;
  height: 23px;
  margin-right: 20px;
}

/*.pay-active {*/
/*  border: 1px solid #00aff2;*/
/*  background: #fff;*/
/*}*/

.show-marks.two {
  height: 457px;
  background: #fff;
  z-index: 9999;
}
.agree-content {
  height: auto;
  overflow-y: auto;
  padding: 8px 8px 12px;
  margin-top: 10px;
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
</style>
