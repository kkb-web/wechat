<template>
    <div class="container">
        <div id="checkfail" class="checkfail" v-show="checkFailFlag">
            <img class="centericon" src="https://img.kaikeba.com/32346140300202vnmw.png"/>
            <p class="desctitle">扫码失败!</p>
            <p class="descm">当前微信号与学习中心绑定微信号不一致</p>
            <div class="line">
                <div class="left-line"></div>
                <div class="right-line"></div>
                <img class="laba" src="https://img.kaikeba.com/81407140300202ajmm.png"/>
            </div>
            <p class="p1">请使用正确的微信号</p>
            <p class="p2">扫描二维码!</p>
        </div>
    </div>
</template>

<script>
    import {getPayUrl,getPhoneByUid} from "../../api/api";
    import {getToken} from "../../assets/js/filter";
    import {Authorize} from "../../assets/js/userAuthorize"

    let authorize = new Authorize();
    export default {
        data() {
            return {
                code: this.$route.query.code,
                courseId: this.$route.query.courseid,
                chapterId: this.$route.query.chapterid,
                uid: this.$route.query.uid,
                checkFailFlag: false,
                isWechat: ''
            }
        },
        mounted() {
            this.isWechatFn()
            this.init()
        },
        methods: {
            isWechatFn() {
                let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
                if (version !== -1) {
                    // 微信环境
                    this.isWechat = true
                } else {
                    // 非微信环境
                    this.isWechat = false
                }
            },
            init() {
                if (this.isWechat) {
                    // 微信环境
                    if ((getToken('openid') && getToken('unionid'))) {
                        this.handleLink()
                    } else {
                        this.wxAuthor()
                    }
                } else {
                    // 非微信环境
                    this.handleLink()
                }
            },
            wxAuthor() {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.handleLink);
                }
            },
            handleLink() {
                let sendData = {}
                if (this.isWechat) {
                    sendData = {
                        courseId: this.courseId,
                        chapterId: this.chapterId,
                        uid: this.uid,
                        unionid: getToken('unionid')
                    }
                } else {
                    sendData = {
                        courseId: this.courseId,
                        chapterId: this.chapterId,
                        uid: this.uid,
                        unionid: ''
                    }
                }
                getPayUrl(sendData).then(res => {
                    if (res.data.code === 0) {
                        if(!this.isWechat){
                            getPhoneByUid(this.uid).then(userInfo=>{
                                let {code, data: { mobile: phone, uid } } = userInfo.data;
                                if(code === 0&&phone&&uid) {
                                    document.cookie = "auto_pay=1; domain=.kaikeba.com; path=/";
                                    document.cookie =
                                        `phone=${phone}; domain=.kaikeba.com; path=/`;
                                    document.cookie =
                                        `wx_uid=${uid}; domain=.kaikeba.com; path=/`;
                                    window.location.href = res.data.data.payUrl
                                } else {
                                    alert(res.data.msg);
                                }
                            });
                            return
                        }
                        if (res.data.data.isSame === 0) {
                            this.checkFailFlag = true
                            document.getElementById('checkfail').style.height = window.innerHeight + 'px';
                            return
                        }
                        window.location.href = res.data.data.payUrl
                    } else {
                        alert(res.data.msg)
                    }
                })
            }
        }
    }

</script>

<style scoped>
    .container {
        width: 100%;
    }

    .checkfail {
        width: 100%;
        background-image: url("https://img.kaikeba.com/15826140300202xijs.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-color: #369FEE;
        text-align: center;
    }

    .centericon {
        width: 95px;
        height: 95px;
        margin-top: 62px;
    }

    .desctitle {
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
        text-align: center;
        margin-top: 15px;
    }

    .descm {
        font-size: 14px;
        color: #ffffff;
        font-weight: 400;
        text-align: center;
        margin-top: 4px;
        position: relative;
    }

    .line {
        width: 68%;
        margin: 0 auto;
        margin-top: 52px;
    }

    .laba {
        width: 29px;
        height: 22px;
        position: relative;
        top: -10px;
    }

    .left-line {
        width: 40%;
        height: 1px;
        float: left;
        background: rgba(255, 255, 255, 0.2);
    }

    .right-line {
        width: 40%;
        height: 1px;
        float: right;
        background: rgba(255, 255, 255, 0.2);
    }

    .p1 {
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
    }

    .p2 {
        font-size: 16px;
        color: #ffffff;
        font-weight: 600;
    }
</style>
