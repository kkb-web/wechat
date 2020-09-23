<!--
 * @motto: motto
 * @Author: haichen
 * @Date: 2020-05-27 19:45:43
 * @LastEditors: haichen
 * @LastEditTime: 2020-05-27 19:45:55
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
    <!-- <div class="pay-btn">去支付尾款</div> -->
    <p class="pay-tips">为保障您的权益，尾款请于</p>
    <p class="pay-tips">2020.03.18 11:59:59前完成支付</p>
  </div>
</template>
<script>
export default {};
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