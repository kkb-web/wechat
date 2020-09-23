<template>
  <div>
    <div  v-show="!orderfail && !orderfailLoad" >
      <div class="speed_wapper">
        <template v-for="(item,index) in allPart">
          <div class="speed" :class="index!== 0? 'balance':''" :key="index" >
            <div class="icon" :index="index" :style="{background:(index === 0 && 'transparent')}" :class="groupOrderParts.indexOf(item) < 0 && index !== 0 && 'unpaid'">
              <img v-if="index === 0" class="icon_img" src="../../../assets/img/payImgs/paysuccess.png" alt="">
              <img v-else-if="groupOrderParts.indexOf(item) < 0 && index !== 0" class="icon_img" src="../../../assets/img/payImgs/waitpay.png" alt="">
              <img v-else-if="groupOrderParts.indexOf(item) >= 0 && index !== 0" class="icon_img" src="../../../assets/img/payImgs/paysuccess.png" alt="">
            </div>
            <div class="text_wapper">
              <div class="title">{{index === 0? "首付款支付成功" : `尾款${allPart.lenght>2?index:''}`}}</div>
              <div class="sign" v-if="index === 0">首付款支付成功即可开始课程学习</div>
              <div class="sign" v-if="groupOrderParts.indexOf(item) >= 0 && index !== 0" >尾款{{allPart.lenght>2?index:''}}支付成功</div>
              <div class="sign" v-if="groupOrderParts.indexOf(item) < 0 && index !== 0" >为保障您的权益请于{{deadlineTime}}前补齐<span @click="goPay" style="color:#00AFF2">尾款</span></div>
            </div>
          </div>
        </template>
      </div>
      <div class="code_wapp">
        <div class="text">识别下方二维码或长按保存图片，添加微信</div>
        <img class="qrCode" :src="qrCodeUrl" alt="">
        <!-- <button class="download" onclick="location.href='https://learn.kaikeba.com/browseropen'">下载开课吧APP</button> -->
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
  </div>
</template>


<script>
import { routeUrl,timestampToTimeYMDCommon } from "../../../assets/js/filter"
import { urlGetOrderStatus, } from "../../../api/api"
import { Toast } from "we-vue"
import QrcodeVue from "qrcode.vue"
import QRcode from "qrcode"

let rfailTimer
let requestTimer
let ApiLogParams = { orderNo: "", data: {} }
export default {
  data() {
    return {
      orderfail:false,
      orderfailLoad:false,
      counterTime: 10,
      counter: 0,
      courseCode:null,
      channelCode:null,
      sub_goods_id:null,
      orderNo: this.$route.query.orderId||this.$route.query.out_trade_no,
      groupOrderParts:[],
      nextPart:[],
      allPart:[],
      isWechat: false,
      qrCodeUrl:"https://img.kaikeba.com/a/71245170800202rxcj.jpg"

    }
  },
  components: {
    QrcodeVue,
    QRcode,
  },
  mounted() {

    this.handleOrder()
    this.getOrderNo()
  },
  methods: {
    goPay(){
      this.$router.push({
        path:`${routeUrl()}vipcourse/${this.courseCode}/${this.channelCode}`,
        query: {
          sell: 1,
          sub_goods_id:this.sub_goods_id
        }
      });
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
    getOrderNo() {
      let send = {
        orderNo: this.orderNo,
      }
      if (this.orderPartId) {
        send.orderPartId = this.orderPartId
      }
      urlGetOrderStatus(send).then((res) => {
        if (res.data.code === 0) {
          // debugger
          console.log(res.data.data)
          const resData = res.data.data
          this.courseCode = resData.courseCode
          this.channelCode = resData.channelCode
          this.sub_goods_id = typeof(resData.nextPart) === "object"?resData.nextPart.join(','):resData.nextPart
          this.nextPart = resData.nextPart // 定金模式的下一笔待付id
          this.groupOrderParts = resData.groupOrderParts||[] // 组合商品已支付成功的部分
          this.pendingParts = resData.pendingParts||[] // 组合商品未支付部分
          if(resData.qrCode){
            this.qrCodeUrl = `https://img.kaikeba.com/${resData.qrCode}`
          }
          if(this.groupOrderParts.length > 0){
            if(this.pendingParts || this.nextPart.length > 0){
              this.allPart = this.groupOrderParts.concat(this.pendingParts)
            }else{
              this.allPart = this.groupOrderParts
            }
            if(this.allPart.length === 1){
              this.allPart.push([1])
            }
            this.deadlineTime = timestampToTimeYMDCommon(resData.deadlineTime)
            this.handleOrderSuccess()
          }else{
            Toast.fail({
              duration: 1000,
              message: "订单未支付"
            });
          }
         

        }else{
          if (this.counter < 2) {
            let that = this
            requestTimer = setTimeout(function() {
              that.getOrderNo()
              that.counter += 1
            }, 3000)
          } else {
            clearTimeout(requestTimer)
          }
        }
      })
    },
  },
}
</script>


<style  scoped>
.speed_wapper{
  padding: 17px 18px 20px 18px;
  background: #fff;
  border-bottom:10px solid #eee
}
.speed_wapper .speed{
  display: flex;
}
.speed_wapper .speed.balance{
  padding-top: 28px;
}
.speed_wapper .speed .icon{
  width: 24px;
  height: 24px;
  background: #008fe5;
  border-radius: 50%;
  margin-right:10px;
  position: relative;
}
.speed_wapper .speed .icon .icon_img{
  width: 100%;
  height: 100%;
}
.speed_wapper .speed .icon .money_text{
  color: #fff;
  display: block;
  align-items: center;
  text-align: center;
}
.speed_wapper .speed .icon.unpaid{
  background:#ccc
}
.speed_wapper .speed.balance .icon::after{
  content: "";
  position: absolute;
  width: 2px;
  height: 22px;
  background: #008fe5;
  top:-22px;
  right:11px;
}
.speed_wapper .speed .icon.unpaid::after{
  background:#ccc
}
.speed_wapper .speed .icon::before{
  content: "";
  position: absolute;
  width: 2px;
  height: 28px;
  background: #008fe5;
  top:24px;
  right:11px;
}
.speed_wapper .speed .icon.unpaid::before{
  background:#ccc
}
.speed_wapper .speed:last-child .icon::before{
  display: none;
}

.text_wapper .title{
  height:25px;
  font-size:18px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(51,51,51,1);
  line-height:25px;
}
.text_wapper .sign{
  height:20px;
  font-size:14px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:20px;
}

.code_wapp{
  padding-top: 55px;
  text-align: center;
}
.code_wapp .text{
  height:17px;
  font-size:12px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:rgba(51,51,51,1);
  line-height:17px;
}
.download{
  background: #008fe5;
  color:#fff;
  border:none;
  padding:8px 10px;
  border-radius: 5px;
}
.qrCode{
  width: 189px;
  display: block;
  margin: 15px auto;
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
</style>