<template>
    <div class="bind-fail">
        <div class="bind-status">
            <img src="../../../assets/img/bindImgs/bindfail.png">
            <p class="title">绑定失败</p>
            <p class="content">绑定失败，可能存在以下几个原因：</p>
            <p class="reason">1. 网络信息中断，请检查网络连接；</p>
            <p class="reason">2. 服务器开了小差，可再次尝试；</p>
        </div>
        <div class="operation">
            <button class="btn" @click="tryAgain()">再试一次</button>
        </div>
    </div>
</template>

<script>
    import {routeUrl} from '../../../assets/js/filter';
    export default {
        name: "bind-failure",
        data() {
          return {
              orderid: this.$route.query.orderid
          }
        },
        methods: {
            tryAgain() {
                this.$router.push({path: routeUrl() + 'login', query: {orderId: this.orderid}})
            }
        }
    }
</script>

<style scoped>

    .bind-fail {
        overflow: hidden;
        background: #F7F7F7;
    }
    .bind-status {
        width: 94.666%;
        background: #ffffff;
        overflow: hidden;
        box-sizing: border-box;
        margin: 15px auto;
        padding: 33px 0 28px;
        text-align: center;
        border-radius: 6px;
    }
    .bind-status img {
        width: 40px;
        height: 40px;
    }
    .title {
        font-size: 1.06rem;
        color: #000000;
        line-height: 27px;
        margin-top: 8px;
    }
    .bind-fail .content {
        color: #7B7E7F;
        font-size: 12px;
        line-height: 19px;
        margin: 10px auto 12px;
        padding-top: 0;
        height: auto;
    }
    .reason {
        color: #AFAFAF;
        font-size: 11px;
    }
    .operation {
        width: 100%;
        background: #ffffff;
        padding-top: 25px;
        box-sizing: border-box;
        text-align: center;
    }
    .btn {
        width: 80%;
        height: 36px;
        line-height: 36px;
        border: none;
        font-size: 14px;
        color: #ffffff;
        border-radius: 18px;
        background: linear-gradient(to right, rgb(32,178,240),rgb(59,209,167));
    }
</style>