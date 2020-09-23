<template>
  <div class="zx-content">
    <div v-if="showPageFlag == 1" class="pay-successful">
      <div class="pay-success">
        <div class="back">
          <div class="top">
            <img class="icon-success" src="https://img.kaikeba.com/success_icon.png" alt />
            <span class="text-success">恭喜你，支付成功</span>
          </div>
          <div class="middle">
            <img class="icon-line" src="https://img.kaikeba.com/line.png" alt />
          </div>
          <div class="bottom">
            <img class="icon-tele" src="https://img.kaikeba.com/Oval.png" alt />
            <div class="next">
              <span class="text-next">距离报名成功，仅剩最后一步</span>
              <p class="text-hint">绑定开课吧账号才能完成报名哦</p>
            </div>
          </div>
        </div>
        <!--<div v-if="signUpBtn" class="button" @click="goBindAccount">-->
        <!--去完成报名-->
        <!--</div>-->
        <!--<div v-else class="button02">-->
        <!--去完成报名（{{this.handleAcount()}}）-->
        <!--</div>-->
      </div>
    </div>
    <div v-else-if="showPageFlag == 2" class="pay-error">
      <p>支付结果异常,</p>
      <p>请联系你的咨询老师 ：）</p>
    </div>
    <wv-spinner
      v-show="qrCodeWaiting"
      color="#63acda"
      type="dot-circle"
      slot="ft"
      :size="40"
      class="qrcode-spin"
    ></wv-spinner>
  </div>
</template>
<script>
import { getToken, routeUrl, cashierLink } from "../../../assets/js/filter";
import { urlGetOrderStatusZS, urlGetOrderStatus } from "../../../api/api";
import { _AP } from "../../../assets/js/urlencode";
import { Toast } from "we-vue";
export default {
  data() {
    return {
      showPageFlag: 0,
      qrCodeWaiting: true,
      orderNo: "",
      batchNo: this.$route.params.batchNo,
      orderUrl: this.$route.query.orderUrl,
      openId: getToken("openid"),
      interval: null,
      userImg: getToken("headimgurl"),
      nickName:
        getToken("username") == "" ? "亲爱的学员" : getToken("username"),
      signUpBtn: false,
      acount: 0
    };
  },

  mounted() {
    this.getOrderStatus();
    clearInterval(this.interval);
    this.interval = setInterval(this.getOrderStatus, 1000);
  },
  methods: {
    //查询订单倒计时
    handleAcount() {
      if (this.acount < 6) {
        return 6 - this.acount;
      } else {
        return 0;
      }
    },
    getOrderStatus() {
      this.acount++;
      if (this.acount < 11) {
        let batchNoIndex = this.batchNo.lastIndexOf("=");
        let orderNoIndex = this.batchNo.lastIndexOf("&");
        let orderNo = this.batchNo.substring(0, orderNoIndex);
        let sendStr = this.batchNo.substring(
          batchNoIndex + 1,
          this.batchNo.length
        );
        let sendData = {
          orderNo: sendStr
        };
        let sendData02 = {
          orderNo: orderNo
        };
        urlGetOrderStatusZS(sendData)
          .then(res => {
            this.qrCodeWaiting = false;
            //判断订单状态
            if (res.data.code === 0) {
              urlGetOrderStatus(sendData02)
                .then(respond => {
                  if (respond.data.code == 0) {
                    // this.orderNo = respond.data.data.no;
                    // this.signUpBtn = true;
                    clearInterval(this.interval);
                    window.location.href =
                      `${cashierLink()}bindsuccess?code=` +
                      sessionStorage.getItem("courseCode") +
                      "&channel=" +
                      sessionStorage.getItem("channelCode");
                    return;
                  } else {
                    // Toast.fail({
                    //     duration: 2000,
                    //     message: '数据不存在！'
                    // })
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              this.showPageFlag = 1;
            } else {
              this.showPageFlag = 2;
            }
          })
          .catch(err => {
            this.qrCodeWaiting = false;
            Toast.fail({
              duration: 2000,
              message: "服务器错误，请稍后再试！"
            });
          });
      } else {
        clearInterval(this.interval);
        Toast.text({
          duration: 6000,
          message: "支付结果处理中，请稍后再试或联系你的咨询老师：）"
        });
      }
    },
    goBindAccount() {
      this.$router.push({
        path: routeUrl() + "register",
        query: { orderId: this.orderNo }
      });
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval); //关闭
    }
  }
};
</script>

<style scoped>
.qrcode-spin {
  margin-left: calc(50% - 20px);
  position: fixed;
  top: 200px;
  left: 0;
  z-index: 999999;
}

.pay-success {
  width: 100%;
}
.pay-error {
  text-align: center;
  font-size: 16px;
  padding-top: 160px;
  color: #999;
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
.button02 {
  width: 80%;
  height: 40px;
  /*background-image: url("https://img.kaikeba.com/bing_button_icon.png");*/
  background-size: 100% 100%;
  margin: 0 auto;
  color: #fff;
  margin-top: 30px;
  font-size: 14px;
  font-weight: bold;
  line-height: 45px;
  text-align: center;
  cursor: pointer;
  background-color: #999;
  border-radius: 25px;
}
</style>

