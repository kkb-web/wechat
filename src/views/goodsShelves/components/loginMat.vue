<template>
  <div class="login_mat_wapper">
    <div class="login_wapper">
      <div class="login_title">
        <span></span>
        <span>登陆</span>
        <img
          @click="closeMyself"
          class="close"
          src="https://img.kaikeba.com/60720070219102arlw.png"
          alt
        />
      </div>

      <div class="login_inner_wapper">
        <div class="input_wapper">
          <span>手机号</span>
          <input maxlength="11" type="text" v-model="mobile" />
        </div>
        <div class="input_wapper">
          <div class="code_text">验证码</div>
          <input type="text" v-model="code" />
          <button :disabled="isdisabled" @click="getCode">{{codeBtnText}}</button>
        </div>
        <button class="save_btn" :disabled="isdisabledpay" @click="immediatePayment">确认支付</button>
        <div class="count_down">
          剩余支付时间：
          <span>{{`${times}s`}}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import {
  getVerificode,
  checkVerificode,
} from "../../../api/api";
import { Toast } from "we-vue";

const timeNum = 60
export default {
  data(){
    return{
      mobile:"",
      code:"",
      isdisabledpay:false,
      isdisabled:false,
      codeinterval:Function,
      codetimes:timeNum,
      codeBtnText:"发送动态码"
    }
  },
  methods: {
    getCode(){
      let that = this;
      if(this.mobile){
        this.isdisabled = true  
        getVerificode(this.mobile).then(res=>{
          console.log(res)
        })
        that.codeinterval = setInterval(function() {
          that.codeBtnText = `${that.codetimes}s`
          if (that.codetimes-- <= 0) {
            that.isdisabled = false
            that.codetimes = timeNum
            that.codeBtnText = `发送动态码`
            clearInterval(that.codeinterval);
          }
        }, 1000);
      }
     
    },
    closeMyself() {
      this.$emit("onclose");
    },
    immediatePayment(){
      
      if(!this.mobile){
        Toast.text({
          duration: 2000,
          message: "请输入手机号"
        });
        return 0;
      }
      if(!this.code){
        Toast.text({
          duration: 2000,
          message: "请输入验证码"
        });
        return 0;
      }

      this.isdisabledpay = true
      checkVerificode(this.mobile,this.code).then(res=>{
        this.isdisabledpay = false
        if(res.data.code === 0){
            this.$emit("payment",{mobile:this.mobile});
        }else{
          Toast.text({
            duration: 2000,
            message: res.data.msg
          });
        }
      }).catch(err => {
        this.isdisabledpay = false
        console.log("wxPay", err);
      })
    }
  },
  beforeDestroy(){
    clearInterval(this.codeinterval)
  },
  props:["times"]
};
</script>

<style lang="css" scoped>
.login_mat_wapper {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
}
.login_wapper {
  width: 100%;
  /* height: 336px; */
  background: #fff;
  border-radius: 14px 14px 0px 0px;
  padding: 12px 16px 54px 16px;
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
}
.login_title {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}
.login_title .close {
  width: 11px;
  height: 11px;
}
.input_wapper {
  display: flex;
  align-items: center;
  height: 45px;
  border-bottom: 1px solid #ededed;
  margin-top: 30px;
}
.input_wapper .code_text {
  width: 42px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
}
.input_wapper input {
  flex: 1;
  height: 44px;
  line-height: 44px;
  border: none;
  padding: 0 10px;
  outline: none;
}
.input_wapper button {
  width: 70px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #bbb;
  line-height: 20px;
  border: none;
  background: #fff;
  outline: none;
}
.save_btn {
  width: 100%;
  height: 44px;
  background: rgba(0, 175, 242, 1);
  border-radius: 22px;
  border: none;
  margin-top: 48px;
  color: #fff;
  font-size: 16px;
  outline: none;
}
.count_down {
  text-align: center;
  font-size: 14px;
  margin-top: 16px;
}
.count_down span {
  color: #fc7552;
}
</style>