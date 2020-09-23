<template>
    <div class="payPage">
        <img class="payIcon" src="../../assets/img/payImgs/paySucceed.png" alt="">
        <p class="payStatus">恭喜您，支付成功</p>
        <div @click="linkToTos" class="payEvent">
            完成
        </div>
    </div>
</template>

<script>
    import {getToken} from "../../assets/js/filter";
    export default {
        name: "paySucceed",
        mounted() {

        },
        methods:{
            linkToTos(){
                window.location = getToken('cashierReturnUrl');
            }
        }
    }
</script>

<style scoped>
    .payPage{
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
        font-family: PingFangSC-Medium;
        font-size: 17px;
        color: #333333;
        letter-spacing: 0;
        line-height: 17px;
    }
    .payEvent{
        position:fixed;
        width:289px;
        height:40px;
        line-height: 40px;
        background: #00A5E3;
        border-radius: 6px;
        color:#fff;
        bottom:50px;
        left:50%;
        transform: translateX(-50%);
    }
    .payEvent:active{
        background: #0080B0;
    }

</style>