<template>
    <div class="bind-success">
        <div class="bind-status">
            <img src="../../../assets/img/bindImgs/bindsuccess.png"/>
            <p class="title">报名成功</p>
            <!--<p class="content-vip">您的官网账号 {{username}}</p>-->
        </div>
        <div class="results">
            <p style="color: #265F72;">已为您开通这门课的学习权限，下载开课吧app或电脑登录</p>
            <p>learn.kaikeba.com 开启学习之旅</p>
        </div>
        <div class="operation" v-if="!teacherQrCode&&showteacherQrCode">
            <p>识别下方二维码，下载开课吧app</p>
            <div style="position: relative">
                <img v-on:touchstart="handleIframe" v-on:touchend="handleIframeend" style="width: 100vw;height: 100vw;opacity: 0;position: absolute;bottom: 0;left: 0;z-index: 999;" src="https://img.kaikeba.com/00202292119102euaw.png" />
                <img v-on:touchstart="handleIframe" v-on:touchend="handleIframeend" src="https://img.kaikeba.com/00202292119102euaw.png" />
            </div>
        </div>
        <div class="operation" v-if="teacherQrCode&&showteacherQrCode">
            <p>识别下方二维码或长按保存图片，添加班主任微信</p>
            <div style="position: relative">
                <img v-on:touchstart="handleIframe" v-on:touchend="handleIframeend" style="width: 100vw;height: 100vw;opacity: 0;position: absolute;bottom: 0;left: 0;z-index: 999;" :src='"https://img.kaikeba.com/"+teacherQrCode' />
                <img v-on:touchstart="handleIframe" v-on:touchend="handleIframeend" :src='"https://img.kaikeba.com/"+teacherQrCode' />
            </div>
            <div><button class="download" onclick="window.open('https://mapp.kaikeba.com/invoke')">下载开课吧APP</button></div>
        </div>
        <div @click="linkToGoodsList" class="good_live" v-if="liveCloseAndBack">
            <img src="https://img.kaikeba.com/a/21749112800202eyxy.png" >
        </div>
    </div>
</template>

<script>
    import {urlGetVipcourseInfo} from "../../../api/api";
    import {getToken,isIOS} from "../../../assets/js/filter";
    import {childrenPostMassage} from "../../../utils"

    export default {
        name: "bind-success",
        data() {
            return {
                username: this.$route.query.username,
                courseCode: this.$route.query.code || sessionStorage.getItem('courseCode'),
                channelCode: this.$route.query.channel || sessionStorage.getItem("channelCode"),
                teacherQrCode: '',
                showteacherQrCode:0,
                isGoodsShelves:this.$route.query.isGoodsShelves, // 等于isTrue代表是直播间展示
                liveCloseAndBack:false,
                lichee:this.$route.query.lichee,
                isWechat: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? true : false,
                isIOS:isIOS()
            }
        },
        mounted() {
            this.handLiveBtn()
            if(this.courseCode&&this.courseCode !== 'undefined'&&this.courseCode !== 'null'&&this.channelCode&&this.channelCode !== 'undefined'&&this.channelCode !== 'null'){
                getToken('openid')===null?localStorage.setItem('openid','channelParams' + new Date().valueOf()+'150'):getToken('openid');
                getToken('unionid')===null?localStorage.setItem('unionid','channelParams' + new Date().valueOf()):getToken('unionid');
                let sendReqData = {
                    courseCode: this.courseCode,
                    channelCode: this.channelCode,
                    openid: getToken('openid'),
                    unionid: getToken('unionid')
                };
                urlGetVipcourseInfo(sendReqData).then(data=>{
                    this.showteacherQrCode = !0;
                    if(data&&data.data&&data.data.data&&data.data.data.teacherQrCode) {
                        this.teacherQrCode = data.data.data.teacherQrCode;
                    }
                });
            }
        },
        methods:{
            handleIframe() {
                let url = (!this.teacherQrCode && this.showteacherQrCode) ? 'https://mapp.kaikeba.com/invoke' : `https://img.kaikeba.com/${this.teacherQrCode}`
                if (!(window.self === window.top) && this.isWechat && this.isIOS) {
                    window.top.postMessage(JSON.stringify({state: 1, success: 'IdentifyImgStart', url: url }), "*")
                }
            },
            handleIframeend() {
                if (!(window.self === window.top) && this.isWechat && this.isIOS) {
                    window.top.postMessage(JSON.stringify({state: 2, success: 'IdentifyImgOver' }), "*")
                }
            },
            handLiveBtn(){
                if(this.lichee === 'lichee'){ // 直播间红包
                    if (this.isWechat){
                        this.liveCloseAndBack = false //微信内不需要展示
                    }else {
                        if(getToken('isShowLicheBtn') == '1'){
                            this.liveCloseAndBack = true // h5 需要展示
                        }
                    }
                }else {
                    if(this.isGoodsShelves === 'isTrue'){
                        this.liveCloseAndBack = true
                    }
                }
            },
            linkToGoodsList(){
                if(this.lichee === 'lichee'){
                    childrenPostMassage({success: 'closeLicheeBox'}) // 直播间通知顶层页面关闭红包弹窗（h5）
                }else {
                    window.location.href = getToken('goodsListUrls')
                }
            },
        }
    }
</script>

<style scoped>
    .bind-success {
        padding-top: 30px;
        background: rgba(0, 0, 0, .2);
    }

    .bind-status {
        width: 94.666%;
        background: #ffffff;
        overflow: hidden;
        box-sizing: border-box;
        margin: 0px auto 0;
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

    .content-vip {
        display: block;
        color: #7B7E7F;
        font-size: 12px;
        margin: 10px auto 12px;
    }

    .results {
        text-align: center;
        width: 100%;
        padding: 15px 0 15px 0;
    }

    .results p, .operation p {
        font-size: 12px;
        color: #7B7E7F;
    }

    .operation {
        width: 100%;
        background: #ffffff;
        padding-top: 12%;
        box-sizing: border-box;
        text-align: center;
    }

    .operation img {
        margin-top: 10px;
        width: 50vw;
        height: 50vw;
        max-height: 211px;
        max-width: 211px;
    }
    .download {
        padding: 11px 15px;
        background: #0099ee;
        border-radius: 5px;
        color: #f9f9f9;
        border: none;
        outline: none;
        margin: 25px 0;
        font-size: 16px;
    }
    .good_live{
        width: 25px;
        height: 25px;
        position: fixed;
        top: 15px;
        right: 15px;
        color: #000;
        font-size: 14px;
    }
    .good_live img{
        width: 100%;
    }
</style>
