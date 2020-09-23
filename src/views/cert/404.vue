<template>
    <div class="certificate-404">
        <div class="certificate-404-cont">
            <img src="https://img.kaikeba.com/cert_404.png" alt="img"/>
            <p class="certificate-tip">该证书不存在，请确认证书编号是否正确</p>
            <p class="certificate-back-home" @click="goToHome">返回首页</p>
        </div>
    </div>
</template>
<script>

    export default {
        data(){
            return {

            }
        },
        computed: {},
        mounted () {
            window.scrollTo(0,0)   //页面滚动到顶部
        },
        methods :{
            goToHome(){
                this.$router.push('/cert/student')
            }
        }
    }
</script>
<style scoped>
    .certificate-404{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0,0,0,.05);
    }
    .certificate-404-cont{
        width:100%;
        height: auto;
        margin: 80px auto 0;
        text-align: center;
    }
    .certificate-404-cont img{
        width: 100%;
        height: 240px;
        text-align: center;
    }
    .certificate-tip{
        color: #c5c5c5;
        font-size: 14px;
        text-align: center;
        margin-top: 20px;
    }
    .certificate-back-home{
        width: 120px;
        height: 30px;
        font-size: 16px;
        text-align: center;
        line-height: 30px;
        border-radius: 20px;
        color: #fff;
        background:#61bfe6;
        margin: 30px auto 0;
        cursor: pointer;
    }
</style>