<template>
    <div class="certificate-warp">
        <div class="certificate-top">
            <p class="certificate-top-title">分享课程证书</p>
            <div class="clear">
                <div class="left certificate-top-input clear">
                    <!--:style="{'width': isWx ? '100%' :'80%' }"-->
                    <p class="left">
                        <input type="text" readonly="readonly" v-model="url" id="input"/>
                    </p>
                    <span class="left" @click.stop="copyLink">复制</span>
                </div>
                <!--<p class="left certificate-top-down" @click.stop="downLoadImg"  v-show="!isWx">-->
                    <!--<img src="https://img.kaikeba.com/cert_download_white.png" alt="download">-->
                <!--</p>-->

            </div>
        </div>
        <div class="certificate-content">
            <img :src="imgSrc" alt="img" class="cert-img">
        </div>
        <p class="down-tip">长按图片保存至相册</p>
    </div>
</template>
<script>
    import {Toast} from 'we-vue';
    import {urlLearnCert} from "../../api/api";


    export default {
        data(){
            return {
                code:this.$route.params.random,
                isWx:null,
                realName:null,
                courseName:null,
                hashCode:null,
                imgSrc:'',
                url:''
            }
        },
        computed: {},
        mounted () {
            this.url = window.location.href;
            window.scrollTo(0,0)   //页面滚动到顶部
            this.validateCode();
            this.isWx = this.isWeiXin();
        },
        methods :{
            //判断是否是微信浏览器的函数
             isWeiXin(){
                //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、
                 // 浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
                let ua = window.navigator.userAgent.toLowerCase();
                //通过正则表达式匹配ua中是否含有MicroMessenger字符串
                if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                    return true;
                }else{
                    return false;
                }
            },
            validateCode(){
                let _this = this;
                if (this.code) {
                    urlLearnCert({
                        code: this.code
                    }).then(res => {
                        if (res.data.code == 0) {
                            _this.imgSrc = 'https://img.kaikeba.com/' + res.data.data.certImage;
                            _this.realName = res.data.data.realName;
                            _this.courseName = res.data.data.courseName;
                            _this.hashCode = res.data.data.hashCode;

                        }else{
                            _this.$router.push('/cert/student/404')
                        }
                    })
                }
            },
            copyLink(){
                let inputs = document.querySelector('#input');
                let inputLength = inputs.value.length;
                inputs.select();
                inputs.setSelectionRange(0,inputLength);
                document.execCommand('Copy');
                if (inputs.value !== '') {
                    Toast.success({
                        duration: 1500,
                        message: '复制成功'
                    })
                }
            },
        }
    }
</script>
<style scoped>
    .certificate-top{
        /*width: 100%;*/
        height: auto;
        padding: 10px 14px 16px;
        background: #48a3dd;
    }
    .certificate-top-title{
        color: #fff;
        font-size: 14px;
        margin-bottom: 4px;
    }
    .certificate-top-input{
        width: 100%;
        margin-right: 1%;
        font-size: 14px;
    }
    .certificate-top-input p{
        width: 80%;
    }
    .certificate-top-input input{
        width: 96%;
        height: 40px;
        background: #eeeeee;
        border: none;
        color: #707070;
        padding: 0 8px;
        font-size: 14px;
        border-top-left-radius:2px;
        border-bottom-left-radius:2px;
    }

    .certificate-top-input span{
        display: inline-block;
        width: 19%;
        height: 40px;
        background: #fff;
        color: #4d7494;
        text-align: center;
        line-height: 40px;
        border-top-right-radius:2px;
        border-bottom-right-radius:2px;
        font-weight: 600;
    }
    .certificate-top-down{
        width: 18%;
        text-align: center;
    }
    .certificate-top-down img{
        width: 30px;
        height: 26px;
        margin-top: 2px;
    }
    .certificate-content{
        padding: 20px 10px 0;
    }
    .certificate-content img{
        width: 100%;
    }
    .down-tip{
        text-align: center;
        margin-top: 10px;
        font-size: 14px;
        color: #999;
    }
</style>