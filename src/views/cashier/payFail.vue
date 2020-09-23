<template>
    <div class="payPage">
        <img class="payIcon" src="../../assets/img/payImgs/payFail.png" alt="">
        <p class="payStatus">抱歉，支付失败</p>
        <div class="payEventBox">
            <div class="payEvent">
                重试
            </div>
            <p class="systemTip">点击重试到达课程页面，重新下单</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: "payFail"
    }
</script>

<style scoped>
    .payPage{
        font-family: PingFangSC-Medium;
        text-align: center;
        position: relative;
    }
    .payIcon{
        display: block;
        width:246px;
        height:144px;
        margin:100px auto 0;
    }
    .payStatus{
        font-size: 17px;
        color: #333333;
        letter-spacing: 0;
        line-height: 17px;
    }
    .payEventBox{
        position:fixed;
        width:100%;
        left:0;
        bottom:25px;
    }
    .payEvent{
        width:289px;
        height:40px;
        line-height: 40px;
        background: #00A5E3;
        border-radius: 6px;
        color:#fff;
        margin:0 auto;
    }
    .payEvent:active{
        background: #0080B0;
    }
    .systemTip{
        font-size: 12px;
        color: #999;
        line-height: 17px;
        margin-top:8px;
    }
</style>