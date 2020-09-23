<!--
 * @motto: motto
 * @Author: haichen
 * @Date: 2020-05-15 10:58:56
 * @LastEditors: haichen
 * @LastEditTime: 2020-05-30 21:16:16
 -->
<template>
  <div class="container">
    <div class="cash-bg">
      <div class="suc-ct">
        <img
          class="suc-icon"
          src="https://img.kaikeba.com/a/13121151500202hhyz.png?imageView2/0/interlace/1/q/90|imageslim"
          alt
        />
        <p class="info">恭喜你，支付成功</p>
      </div>
    </div>
    <!-- 合同上线以后放开 -->

    <div v-if="type === 1" @click="goCashier" class="pay-btn">去支付尾款</div>
    <p v-if="type === 1" class="pay-tips">为保障您的权益，尾款请于</p>
    <p v-if="type === 1" class="pay-tips">{{time}}前完成支付</p>
  </div>
</template>
<script>
import { getOrderPart, orderPartPay } from "../../../api/api";
import { formatTime } from "../../../utils";
import { routeUrl } from "../../../assets/js/filter";
export default {
  name: "success",
  data() {
    return {
      type: parseInt(this.$route.query.type),
      orderNo: this.$route.query.orderId,
      deadlineTime: this.$route.query.deadlineTime,
      time: ""
    };
  },
  mounted() {
    if (this.type === 1) {
      // 清除deposit-payId
      if(sessionStorage.getItem('deposit-payId')){
        sessionStorage.removeItem('deposit-payId')
      }
      this.getOrderInfo();
      this.time = formatTime(this.deadlineTime * 1000);
    }
  },
  methods: {
    goCashier() {
      this.$router.push({
        path: routeUrl() + "downCash",
        query: { orderId: this.orderNo }
      });
    },
    getOrderInfo() {
      const orderNo = this.orderNo.split(",")[0];
      getOrderPart(orderNo).then(res => {
        const data = res.data;
        if (data.code === 0 && data.msg == "Success") {
          data.data.startTime && data.data.endTime && this.payCountTime();
          this.payLeftTime = data.data.timeLeftSecond;
        } else {
          alert("服务错误，请重试");
        }
      });
    },
    payCountTime() {
      if (!this.payLeftTime) {
        return;
      }
      this.payLeftTime -= 1;

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
    }
  }
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
  padding-top: 20px;
  background: url("https://img.kaikeba.com/a/80704141500202ierl.png?imageView2/0/interlace/1/q/90|imageslim")
    center center;
}
.suc-ct {
  width: 89%;
  height: 189px;
  margin: 0 auto;
  background: #fff;
  border-radius: 10px 15px 15px 15px;
  text-align: center;
}
.suc-icon {
  width: 98px;
  height: 89px;
  margin-top: 25px;
}
.info {
  font-size: 16px;
  color: #333;
  line-height: 16px;
  margin-top: 10px;
}
/* .suc-ct {
  width: 98px;
  height: 89px;
  background: url("https://img.kaikeba.com/a/13121151500202hhyz.png?imageView2/0/interlace/1/q/90|imageslim")
    center center;
} */
.pay-btn {
  width: 89%;
  height: 40px;
  margin: 40px auto 13px;
  border-radius: 21px;
  background: #00aff2;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
.pay-tips {
  font-size: 12px;
  color: #333;
  text-align: center;
  line-height: 16px;
}
</style>