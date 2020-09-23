<template>
  <div class="erroe_429_box" :data-a="modalShow" v-if="modalShow">
    <div class="login-form">
      <div class="down_img"><img @click="onClose" src="../../assets/img/payImgs/pay_close.png" alt=""></div>
      <div class="content_error">
        <div class="title">亲，现在参与人数过多，请稍后再来试一试吧!</div>
        <img class="modal-error-img" src="https://img.kaikeba.com/a/05056181800202uydo.gif" alt="">
        <button class="erroe-down" @click="onClose">重试</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:['modalShow'],
  methods:{
    onClose(){
      this.modalShow = false
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.erroe_429_box{
  position: fixed;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  top: 0;
  left: 0;
  z-index: 9999999;
}
.login-form{
  width: 80%;
  height: 312px;
  background: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
  border-radius: 10px;
  box-sizing: border-box;
  text-align: center;
}
.content_error{
  padding: 0 30px;
  height: 260px;
  box-sizing: border-box;
}
.title{
  font-size: 15px;
  color: #333;
}
.modal-error-img{
  width: 150px;
  margin: 10px auto;
  display: block;
}
.erroe-down{
  border: none;
  width: 100%;
  font-size: 18px;
  height: 40px;
  color: #ffffff;
  border-radius: 25px;
  background-color: #00aff2;
  outline: none;
}
.down_img{
  text-align: right;
  padding: 10px 20px 0 20px;
  box-sizing: border-box;
  height: 35px;
}
.down_img img{
  width: 15px;
}
</style>