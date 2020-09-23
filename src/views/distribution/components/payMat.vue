<template>
  <div class="pay_mat_wapper">
    <div class="pay_wapper">
      <div class="pay_title">
        <span></span>
        <span>请选择支付方式</span>
        <img class="close" @click="closeMyself" src="https://img.kaikeba.com/60720070219102arlw.png" alt="">
      </div>

      <div class="pay_list wechat" @click="unityPay('WECHAT')">
        <img src="https://img.kaikeba.com/pay_wechat.png" alt="">
        <span>微信</span>
      </div>
      <div class="pay_list" @click="unityPay('ALIPAY')">
        <img src="https://img.kaikeba.com/pay_apli.png" alt="">
        <span>支付宝</span>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  methods:{
    closeMyself() {
      this.$emit("onclose");
    },
    unityPay(type){
      this.$emit("unityPay",type);
    }
  }
}
</script>

<style lang="css" scoped>
.pay_mat_wapper{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
}
.pay_wapper{
  width: 100%;
  height: 202px;
  background: #fff;
  border-radius:14px 14px 0px 0px;
  padding: 12px 36px  54px 36px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
}
.pay_title{
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size:16px;
  font-weight:500;
  color: #333;
}
.pay_title .close{
  width: 11px;
  height: 11px;
}

.pay_list{
  width: 100%;
  min-width:254px;
  height:44px;
  background:rgba(232,245,252,1);
  border-radius:18px;
  margin: 0 auto;
  text-align: center;
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pay_list img{
  width: 22px;
  height: 18px;
  margin-right: 13px;
}
.wechat{
  margin-top: 30px;
  background:rgba(235,250,236,1);
}
</style>