<template>
  <div id="customer">
    <div class="t_wapper">
      <div class="img_wapper">
        <img :src="picMain" alt="">
      </div>
      <div class="user_info">
        <div class="user_info_img_wapper">
          <img class="user_info_img" v-if="distributionUser.headImg" :src="`${distributionUser.headImg.indexOf('http')>-1?distributionUser.headImg:`https://img.kaikeba.com/${distributionUser.headImg}`}`" alt="">
          <img class="user_info_img" v-if="!distributionUser.headImg" :src="DEFINE_AVATAR" alt="">
        </div>
        <div class="info">
          <div class="info_title">{{distributionUser.nickName||distributionUser.realName}}</div>
          <div class="vice_info">{{distributionUser.sign}}</div>
        </div>
      </div>
      <div class="num_wapper">
        <div class="num_inner_wapper">
          <div class="img_list">
            <img v-for="(item,index) in imgArrs" :key="index" :src="item" alt="">
            <div v-if="imgArrs.length >= 4" class="user_info_img_more"><span></span><span></span><span></span></div>
          </div>
          <div>
            <span>{{distributionUser.buy}}</span>人已购买
          </div>
        </div>
      </div>
      <!-- <div v-if="isSignShow" class="sign_wapper" @click="jumpUrl">
        赚取奖励
      </div> -->
    </div>

    <div class="title">
      <span class="title_text">商品详情</span>
    </div>
    <div class="bottom_img">
      <img :src="picDetail" alt="">
    </div>
    <div class="btn_mat"></div>
    <div class="btn_wapper">
      <div>
        <span>¥</span><span style="font-size:28px" >{{distributionPrice}}</span>
        <span class="original_price">¥{{price}}</span>
      </div>
      <button :class="isDisabled?'but disabled':'but'" @click="createOrderStepOne" :disabled="isDisabled"><i v-show="isDisabled" class="weui-loading loading"></i>{{!isDisabled?'立即报名':'请稍等...'}}</button>
    </div>
    <LoginMat v-show="loginShow" @onclose="onclose" :times="times" @payment="payment" />
    <PayMat v-show="payShow" @unityPay="unityPay" @onclose="onclose"/>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {DEFINE_AVATAR,DEFINE_IMGARR} from '../../consts'
console.log(DEFINE_AVATAR)
import LoginMat from './components/loginMat'
import PayMat from './components/payMat'
import { _AP } from "../../assets/js/urlencode";
import { Authorize } from "../../assets/js/userAuthorize";
import {getRandomArr} from "../../utils"
import { Toast } from "we-vue";
import {
  getGoodsDetail,
  getCheckUninonid,
  urlCreateOrder,
  buyGoodsDetail,
  urlPay,
  urlGetOrderStatus,
  getUuid,
  wechatLogin,
  postBrowsing
} from "../../api/api";
import {
  getToken,
  setToken,
  routeUrl,
  isPcDingTalkWS,
  isIOS,
  cashierLink,
} from "../../assets/js/filter";
// 默认头像
const imgArr = DEFINE_IMGARR
//实例化 authorize
var authorize = new Authorize();
const timeNum = 120
export default {
  data(){
    return{
      DEFINE_AVATAR:DEFINE_AVATAR,
      loginShow:false,
      payShow:false,
      times: timeNum,
      interval:Function,
      picMain:"",
      price:"",
      distributionPrice:"",
      isWechat:false,
      courseInvalid:false,
      imgArrs:[],
      picDetail:'',
      isDisabled:false,
      isOnlyAliPay: null,
      code: this.$route.query.code, //获取授权code,
      tenant_unionid: this.$route.query.tenant_unionid? this.$route.query.tenant_unionid: null,
      distributionUser:{},// 分销员信息
      courseCode:'', // 课程code
      channelCode: '', // 渠道code 
      mobileuuid:"",
      wxMobile:"",
      orderNo:"",
      isSignShow:true
    }
  },
  mounted() {
    let version = navigator.userAgent.toLowerCase().indexOf("micromessenger");

    // // // 先请求一下
    const {goodsId,uid} = this.$route.query
    // setToken("unionid", "oBB9ps_-tZhyD6w24TNY-RTgvK6I");
    // setToken("openid", "o0IXit58b0SRSYgjrWGtqunN_2dE");
    // 是微信内置浏览器需要授权;
    if (version !== -1) {
      this.isWechat = true;
      if(getToken("unionid")){
        wechatLogin(getToken("unionid")).then(res=>{
          if(res.data.code === 0){
            this.isSignShow = false
          }
        })
      }

      if (isPcDingTalkWS()) {
        window.location = "http://study.kaikeba.com/wxlimit";
      } else {
        //授权获取code
        if (getToken("openid") && getToken("unionid")) {
          authorize.getUserInfo(getToken("openid"));
          getCheckUninonid(getToken('unionid')).then(res => {
            if (res.data.code === 0) {
              const {goodsId,uid} = this.$route.query
              sessionStorage.setItem("mobileuuid",res.data.data.uid)
              this.wxMobile = res.data.data.mobile
              sessionStorage.setItem("phone", res.data.data.mobile)
            }
            this.postBrowsing()
          })
        } else {
          this.wxAuthor();
        }
      }
    } else {
      this.postBrowsing()
      this.isWechat = false;
    }
    this.getVipcourseInfo(goodsId);
    this.buyGoodsDetail(goodsId,uid,sessionStorage.getItem("wx_uid"))
    
  },
  components:{
    LoginMat,PayMat
  },
  beforeDestroy(){
    clearInterval(this.interval);
    if (getToken("tenant_unionid_type")) {
      removeToken("tenant_unionid_type");
    }
  },
  methods:{
    // 用户统计 非微信传入设备信息 微信传入unionid+设备信息

    //  购买详情
    buyGoodsDetail(goodsId,partnerId,uid,paytype){
      const that = this
      buyGoodsDetail(goodsId,partnerId,uid).then(res=>{
        // 用户头像
        that.isDisabled = false
        if(res.data.code === 0){
          if(paytype && !res.data.data.purchase){
            this.createOrder(sessionStorage.getItem("wx_uid"));
            return
          }
          if(paytype && res.data.data.orderNo && res.data.data.purchase){
            window.location.href = `${cashierLink()}paysuccess?orderId=${res.data.data.orderNo}`;
            return
          }
          const usersLength = res.data.data.users?res.data.data.users.length:0
          const buyNum = res.data.data.buy||0
          const difference = res.data.data.buy - usersLength

          if(usersLength && usersLength >= 4){
            for(let y = 0;y < 4 ;y++ ){
              that.imgArrs.push(res.data.data.users[y].headimgUrl)
            }
          }
          if(usersLength && usersLength < 4){
            if(buyNum >= 4){
              const diffNum = 4 - usersLength
              const differenceArr = getRandomArr(diffNum,0,imgArr.length-1)
              for(let x = 0;x < diffNum ;x++ ){
                that.imgArrs.push(imgArr[differenceArr[x]])
              }
              for(let y = 0;y < usersLength ;y++ ){
                that.imgArrs.push(res.data.data.users[y].headimgUrl)
              }
            }else{
              const diffNum = buyNum - usersLength
              const differenceArr = getRandomArr(diffNum,0,imgArr.length-1)
              for(let x = 0;x < diffNum ;x++ ){
                that.imgArrs.push(imgArr[differenceArr[x]])
              }
              for(let y = 0;y < usersLength ;y++ ){
                that.imgArrs.push(res.data.data.users[y].headimgUrl)
              }
            }
            
          }

          if(!usersLength && buyNum >= 4){
            const differenceArr = getRandomArr(4,0,imgArr.length-1)
            for(let x = 0;x < 4 ;x++ ){
              that.imgArrs.push(imgArr[differenceArr[x]])
            }
          }

          if(!usersLength && buyNum < 4){
            const differenceArr = getRandomArr(buyNum,0,imgArr.length-1)
            for(let x = 0;x < buyNum ;x++ ){
              that.imgArrs.push(imgArr[differenceArr[x]])
            }
          }
         
          that.distributionUser = res.data.data
        }else{
          Toast.fail({
            duration: 1000,
            message: res.data.msg
          });
        }
        
      })
    },
    // 浏览记录
    postBrowsing(){
      const {goodsId,uid} = this.$route.query
      let uuid = null
      if(this.isWechat){
        uuid = uuidv4()
      }else{
        if(sessionStorage.getItem("uuid")){
          uuid =  sessionStorage.getItem("uuid")
        }else{
          uuid = uuidv4()
          sessionStorage.setItem("uuid",uuid)
        }
      }
      const sData = {
        "nickname":getToken("username")||null,
        "headimgurl":getToken("headimgurl")||null,
        "unionid":getToken('unionid')||null,
        "mobile":this.wxMobile||sessionStorage.getItem("phone")||null,
        "userId":uid, //合伙人userId（必填）
        "goodsId":goodsId, //课程ID（必填）
        "mobileUuid":uuid
      }
      postBrowsing(sData)
    },
    // 获取商品详情
    getVipcourseInfo(id){
      getGoodsDetail(id).then(res=>{
        document.title = res.data.data&&res.data.data.goodsName;
        this.picMain = res.data.data&&res.data.data.picMain
        this.picDetail = res.data.data&&res.data.data.picDetail
        this.channelCode = res.data.data&&res.data.data.channelCode
        this.courseCode = res.data.data&&res.data.data.courseCode
        this.distributionPrice = res.data.data && res.data.data.distributionPrice
        this.price = res.data.data && res.data.data.price
      })
    },
    //微信支付
    wxPay(payType) {
      let wxPayParams = {},
        //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
        sendData = {
          openid: getToken("openid"),
          orderNo: this.orderNo,
          payType: payType
          // unionid:getToken('unionid')
        };
      //请求获取wxPayParams
      let payRequest = urlPay(sendData);
      let that = this;
      payRequest
        .then(res => {
          if (res.data.code == 0) {
            if (
              navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1
            ) {
              let flag = location.href.indexOf("?") != -1 ? "&" : "?";
              location.assign(
                res.data.data.mwebUrl +
                  "&redirect_url=" +
                  encodeURIComponent(
                    location.href + flag + "orderId=" + this.orderNo
                  )
              );
            } else {
              // //获取jsApiParameData
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
              message: "信息不一致，请重新授权"
            });
            this.wxAuthor();
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log("wxPay", err);
        });
      // //H5调起微信支付
      let onBridgeReady = () => {
        WeixinJSBridge.invoke("getBrandWCPayRequest", wxPayParams, async (
          res
        ) => {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 加类型判断 跳转逻辑-
            const isType3 =  await this.getOrderStatus(this.orderNo)
            if (!isType3) return
            //成功后跳转到支付成功页面
            window.location.href = `${cashierLink()}paysuccess?orderId=${
              this.orderNo
            }`;
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
    //支付宝支付
    aliPay(payType) {
      console.log("支付宝")
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: payType
      };
      //请求获取支付宝参数
      urlPay(sendData)
        .then(res => {
          if (res.data.code == 0) {
            top.location.href =
              routeUrl() +
              "alipay/" +
              this.orderNo +
              "?orderUrl=" +
              _AP.a_encode(encodeURIComponent(res.data.data.payUrl)) +
              "&openId=" +
              getToken("openid");
          } else {
            Toast.fail({
              duration: 1000,
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log("aliPay", err);
        });
    },
    // 支付成功后 直接获取订单状态-
    async getOrderStatus(orderNo) {
      const res = await urlGetOrderStatus({ orderNo }).then(res => {
        const resData = res && res.data;
        if (resData.code === 0) {
          const { assignType, qrCode } = resData.data;
          if (assignType === 3) {
            window.location.href = qrCode;
            return false;
          } else {
            return true;
          }
        }
      });
      return res;
    },
    // 微信授权
    wxAuthor() {
      if (authorize.isEmpty(this.code)) {

        let query = location.search
          .slice(1)
          .split("?")[0]
          .split("&");
        let queryObject = {};
        query.forEach(item => {
          queryObject[item.split("=")[0]] = decodeURIComponent(
            item.split("=")[1]
          );
        });
        authorize.obtainGetCode();
      } else {
        const {goodsId,uid} = this.$route.query
        authorize.codeGetAccess(this.code, this.getAll());
      }
    },
    getAll(){
      const {goodsId,uid} = this.$route.query
      this.getVipcourseInfo(goodsId);
      this.buyGoodsDetail(goodsId,uid,sessionStorage.getItem("wx_uid"))
      if(this.isWechat){
        getCheckUninonid(getToken('unionid')).then(res => {
          if (res.data.code === 0) {
            const {goodsId,uid} = this.$route.query
            sessionStorage.setItem("mobileuuid",res.data.data.uid)
            this.wxMobile = res.data.data.mobile
            sessionStorage.setItem("phone", res.data.data.mobile)
          }
          this.postBrowsing()
        })
      }
    },
    // 生成订单
    createOrderStepOne(){
      
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger");
      let that = this;
      // 不是微信环境
      this.isDisabled = true
      if (version === -1) {
        if (sessionStorage.getItem("phone") && sessionStorage.getItem("wx_uid")) {
          console.log(this.mobileuuid)
          const {goodsId,uid} = this.$route.query
          // this.createOrder(sessionStorage.getItem("wx_uid"));
          this.buyGoodsDetail(goodsId,uid,sessionStorage.getItem("wx_uid"),true)
        } else {
           this.loginShow = true
           this.isDisabled = false
        }
      } else {
        // 微信内获取手机号，换取uuid成功后，创建订单，传给后端
        if (this.mobileuuid !== '' && this.mobileuuid) {
            // this.createOrder(this.mobileuuid);
            const {goodsId,uid} = this.$route.query
            this.buyGoodsDetail(goodsId,uid,this.mobileuuid,true)
        } else {
            // 检测unionid
          getCheckUninonid(getToken('unionid')).then(res => {
            if (res.data.code === 0) {
              const {goodsId,uid} = this.$route.query
              sessionStorage.setItem("mobileuuid",res.data.data.uid)
              this.mobileuuid = String(res.data.data.uid);
              this.wxMobile = String(res.data.data.mobile);
              // 商品详情
              this.buyGoodsDetail(goodsId,uid,this.mobileuuid,true)
            } else {
              this.isDisabled = false
              this.loginShow = true
            }
          }).catch(err => {
            this.isDisabled = false
            this.loginShow = true
            // this.getMobileLogin();
          })
        }
      }
      if(this.times === timeNum){
        this.timeInterval()
      }
    },
   
   //创建订单
    createOrder(userid) {
      if (userid) {
        localStorage.setItem("cacheuserid", userid);
      }
      let version = navigator.userAgent.toLowerCase().indexOf("micromessenger");
      let sendData = this.sendDataFn();
      if (version === -1) {
        console.log(2222222)
        if (isPcDingTalkWS()) {
          sendData.unionid = "";
        } else {
          sendData.unionid = "";
          sendData.endpoint = "PE-H5";
          let mobile = this.wxMobile||sessionStorage.getItem("phone")
          sendData.openid = "channelParamsMB"+mobile;
        }
      }
      if (version !== -1) {
        sendData.buyerId = this.mobileuuid;
        sendData.mobile = this.wxMobile||sessionStorage.getItem("phone");
      }

      sendData.appOpenid = '';
      sendData.appid = '';
      let passback_params = {
        type: "distribution",
        content: "",
        medium: "",
        campaign: "",
        term: "",
        inviteCode : this.$route.query.uid,
        phone: this.wxMobile||sessionStorage.getItem("phone")
      };
      sendData.passback_params = JSON.stringify(passback_params);
      if (userid) sendData.user_id = userid;
      if (userid && sessionStorage.getItem("phone")) {
        sendData.buyerId = userid;
        sendData.mobile = sessionStorage.getItem("phone");
      }
      sendData.returnUrl = `${cashierLink()}paysuccess`
      this.isDisabled = true
      urlCreateOrder(sendData).then(res => {
        this.isDisabled = false
        if (res.data.code == 0) {

          // orderType 0为0元订单，1为正常订单
          if (res.data.data.orderType === 0) {
            window.location.href = `${cashierLink()}paysuccess?orderId=${
              res.data.data.orderNo
            }`;
            return;
          }
          if (
            navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
          ) {
            this.payShow = true;
            this.stopScroll();
          }
          if (version === -1 && res.data.data.openid && res.data.data.openid != "") {
            setToken("openid", res.data.data.openid);
          }
          this.orderNo = res.data.data.orderNo;

          if (this.model === 1) {
            this.goDownUrl();
          }
          this.kkbregist = false;
          if (
            navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1
          ) {
            console.log(1)
            // 钉钉内
            if (this.model !== 1) {
              console.log(5)
              if (isPcDingTalkWS()) {
                if (this.isOnlyAliPay) {
                  console.log(3)                  
                  this.unityPay("ALIPAY");
                  return;
                }
                this.payShow = true;
                this.stopScroll();
                console.log(4)
                sessionStorage.setItem("auto_pay", 0);
                return;
              }

              if (!this.kkbWHtime) {
                console.log(44)
                let _that_ = this;
                this.kkbWHtime = setTimeout(function() {
                  _that_.loading = false;
                  _that_.paySearch = true;
                }, 1580);
              }
              sessionStorage.setItem("auto_pay", 0);
              // h5支付主动查询，延迟50执行
              console.log(33)
              this.unityPay("WECHAT_MWEB");
            }
            
          }
        } else if (res.data.code == 60005) {
          this.payShow = true;
          this.stopScroll();
          this.orderNo = res.data.data;
        } else if (res.data.code === 60008) {
          this.payShow = false;
          document
            .querySelector("body")
            .setAttribute("style", "overflow:scroll");
          Toast.fail({
            duration: 1000,
            message: "信息不一致，请重新授权"
          });
          this.wxAuthor();
        } else {
          this.payShow = false;
          document
            .querySelector("body")
            .setAttribute("style", "overflow:scroll");
          Toast.fail({
            duration: 1000,
            message: res.data.msg
          });
        }
        // this.$set(this, "orderresult", res);
      });
    },
    // 倒计时
    timeInterval(){
      const that = this
      that.interval = setInterval(function() {
          if (that.times-- <= 1) {
            that.times = timeNum
            that.loginShow = false
            clearInterval(that.interval);
          }
        }, 1000);
    },
    unityPay(type) {
      console.log(type)
      let isType;
      switch (type) {
         case "ALIPAY":
          isType = 0;
          break;
        case "WECHAT":
          isType = 1;
          break;
        case "LOAN":
          isType = 2;
          break;
        case "TENCENT":
          isType = 3;
          break;
        case "NETEASE":
          isType = 4;
          break;
        case "CHEESE": // 信用卡分期
          isType = 5;
          break;
        case "KKB_ICBC":
          isType = 6;
          break;
        case "ALIPAY_OFFLINE":
          isType = 7;
          break;
        case "CREDIT_CARD_INSTALMENT": // 芝士分期
          isType = 9;
          break;
        case "WECHAT_OFFLINE":
          isType = 8;
          break;
        case "WECHAT_MWEB":
          isType = 13;
          break;
        default:
          isType = 0;
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
        13: "WECHAT_MWEB"
      };
      let sendData = {
        openid: getToken("openid"),
        orderNo: this.orderNo,
        payType: isType
      };

      if (isType === 0) {
        this.aliPay(isType);
      } else if (isType === 1) {
        if (
          navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1
        ) {
          isType = 13;
          sendData.payType = isType;
          this.wxPay(isType);
        } else {
          this.wxPay(isType);
        }
      } else if (isType === 13) {
        this.wxPay(isType);
      } else {
        this.stagesPay(isType);
      }
    },
    //多个请求发送相同数据的函数
    sendDataFn() {
      let sendReqData = {
        courseCode: this.courseCode,
        channelCode: this.channelCode,
        // channelCode: "wpt148cu7l",
        // courseCode: "xw94yvltx9",
        openid:  getToken("openid"),
        unionid: getToken("unionid")
      };

      return sendReqData;
    },
    // 登陆返回弹窗
    payment(data){
      this.loginShow = false
      const that = this
      sessionStorage.setItem("phone",data.mobile)
      if(!this.isWechat){
        this.postBrowsing()
      }
      getUuid(data.mobile).then(res=>{
        if (res.data.code === 0) {
          sessionStorage.setItem("wx_uid",res.data.data.uid)
          that.payShow= true
          that.mobileuuid = res.data.data.uid;
          // 重新获取商品详情
          const {goodsId,uid} = that.$route.query
          that.buyGoodsDetail(goodsId,uid,sessionStorage.getItem("wx_uid"),true)
          // that.createOrder(res.data.data.uid);
          // this.createOrderStepOne()
        } else {
          Toast.text({
            duration: 2000,
            message: "登录失败，请重新登录"
          });
        }
      }).catch(err => {
        console.log("wxPay", err);
      })

      
    },
    // 关闭弹窗
    onclose(){
      this.loginShow = false
      this.payShow = false
      this.times = timeNum
      this.moveScroll()
      clearInterval(this.interval);
    },
    jumpUrl(){
      window.location.href = `${cashierLink()}fx/register/classTeacherId`
    },
    //滑动限制
    stopScroll() {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "0px";
      document.body.style.left = "0px";
    },
    //取消滑动限制
    moveScroll() {
      document.body.style.overflow = "scroll"; //出现滚动条
      document.body.style.position = "inherit";
    },
  }
}
</script>

<style lang="css" scoped>
#customer{
  padding: 0 16px;
}
.t_wapper{
  width: 100%;
  /* height:409px; */
  background:#fff;
  box-shadow:0px 10px 12px 0px rgba(0,0,0,0.08);
  border-radius:6px;
  margin: 0 auto;
  position: relative;
}
.sign_wapper{
  position: fixed;
  right: -16px;
  top: 46px;
  width:86px;
  height:26px;
  background:#FC7552;
  border-radius:15px 0px 0px 15px;
  color: #fff;
  font-size:13px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  line-height:26px;
  text-align: center;
}
.img_wapper{
  width: 100%;
  /* height:258px; */
  overflow: hidden;
  margin-top: 22px;
}
.img_wapper img{
  width: 100%;
  border-radius: 6px 6px 0 0;
  /* height: 100%; */
}
.user_info{
  padding: 16px 12px;
  display: flex;
}
.user_info_img_wapper{
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin-right: 12px;
  overflow: hidden;
}
.user_info_img{
  width: 52px;
  height: 100%;
}

.info{
  flex: 1;
}
.info_title{
  height:22px;
  font-size:16px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:22px;
  margin-top: 5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.vice_info{
  /* height:17px; */
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:17px;
  margin-top: 4px;
  overflow: hidden;  
  text-overflow: ellipsis;  
  display: -webkit-box;  
  -webkit-line-clamp: 2;  
  -webkit-box-orient: vertical; 
}
.num_wapper{
  padding: 0px 12px;
  font-size:14px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  line-height:20px;
}
.num_inner_wapper{
  padding: 15px 0;
  border-top: 2px solid #ededed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666666;
}
.img_list{
  height: 30px;
  display: flex;
  margin-left: 15px;
}
.img_list img{
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-left: -15px;
  background: #fff;

}
.img_list .user_info_img_more{
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin-left: -15px;
  border: 1px solid #fff;
  overflow: hidden;
  background:rgba(230,230,230,1);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
  box-sizing: border-box;
}
.img_list .user_info_img_more span{
  width: 3px;
  height: 3px;
  background: #989898;
  border-radius: 50%;
  display: inline-block;
}
.num_inner_wapper span{
  color:rgba(252,117,82,1);
}
.title{
  margin-top: 32px;
  text-align: center;
  color: #999;
  height:17px;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  line-height:17px;
  position: relative;
}
.title_text{
  position: relative;
}
.title_text::after{
  content:"";
  position: absolute;
  width: 60px;
  height: 1px;
  background: linear-gradient(to left,#cbcbcb,#fff);
  left: 70px;
  top: 0;
  bottom: 0;
  margin: auto;
}
.title_text::before{
  content:"";
  position: absolute;
  width: 60px;
  height: 1px;
  background: linear-gradient(to right,#cbcbcb,#fff);
  right: 70px;
  top: 0;
  bottom: 0;
  margin: auto;
}
.bottom_img{
  width: 100%;
  /* height: 130px; */
  /* overflow: hidden; */
  margin: 0 auto;
  margin-top: 24px;
}
.bottom_img img{
  width: 100%;
}
.btn_mat{
  height: 64px;
}
.btn_wapper{
  width: 100vw;
  margin: 0px auto;
  padding: 5px 16px;
  height: 54px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
}

.original_price{
  width:65px;
  height:17px;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:17px;
  text-decoration: line-through;
}
.btn_wapper .but{
  min-width: 100px;
  flex: 1;
  height:44px;
  background:rgba(0,175,242,1);
  border-radius:22px;
  color: #fff;
  border: none;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  outline: none;
  margin-left: 16px;
  position: relative
}
.btn_wapper .but.disabled{
background: rgba(0,0,0,.4);
}
/* .btn_wapper .but .loading{
  position: absolute;
  left: 30px;
  top:0;
  bottom: 0;
  margin: auto;
} */
</style>