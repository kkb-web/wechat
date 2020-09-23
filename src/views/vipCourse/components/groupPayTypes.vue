<template>
  <div id="PayTypes">
    <div class="title">
      <img @click="depositPayTypesMatHide" class="downt" src="../../../assets/img/right.png" alt="">
      <span>付款详情</span>
      <img @click="depositPayTypesMatHide" class="down" src="../../../assets/img/payImgs/pay_close.png" alt="">
    </div>
    <div>
      <template id v-for="(item,index) in payListNew" >
        <div :key="index" :class="['all-pay',item.cls]" @click="choosePaytype(item)">
          <div style="display: flex;align-items: center">
            <img
              class="pay_icon"
              :style="{marginRight:'12px'}"
              :src="`https://img.kaikeba.com/${item.icon}`"
              alt
            />
            <span>{{item.name}}</span>
          </div>
          <img class="right_icon" src="../../../assets/img/right.png" alt="" srcset="">
        </div>
      </template>
    </div>
  </div>
</template>


<script>
export default {
  methods:{
    depositPayTypesMatHide() {
      this.$emit("depositPayTypesMatHide");
    },
    // 选择支付方式
    choosePaytype(item){
      this.$emit("choosePaytype",item);
    }
  },
  props:['payListNew']
}
</script>


<style scoped>
#PayTypes{
  background: #fff;
  width: 100%;
  position: absolute;
  bottom: 50px;
  height: 500px;
}

#PayTypes .title{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ccc;
}
#PayTypes .title .downt{
  width: 30px;
  transform: rotate(180deg);
}
#PayTypes .title .down{
  width: 15px;
  /* visibility:hidden; */
}
.all-pay{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #ccc;
}
.pay_icon{
  width: 20px;
}
.all-pay .right_icon{
  width: 20px;
  height: 20px;
}
</style>