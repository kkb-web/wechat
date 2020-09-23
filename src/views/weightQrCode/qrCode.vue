<template>
    <div class="body-box">
        <wv-spinner v-show="qrCodeWaiting" color="#63acda" type="dot-circle" slot="ft" :size="40"
                    class="qrcode-spin"></wv-spinner>
        <!--通用模板-->
        <div class="page-common" v-if="page === 1">
            <div class="page-common-wrap">
                <h1 class="page-common-title">扫码添加小助理微信</h1>
                <div class="page-common-inner">
                    <p class="page-common-word">再扫一次就可以添加我为好友啦～</p>
                    <img class="page-common-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                         @touchstart.stop="qrCodeTimesFn" @touchend.stop="mouseupFn"/>
                </div>
            </div>
        </div>
        <!--end-->
        <!--页面1-->
        <div class="page-a" v-if="false">
            <div class="page-a-warp">
                <img class="page-a-title" src="../../assets/img/page_a_title.png" alt="">
                <div>
                    <div class="page-a-inner">
                        <p class="page-a-word">再扫一次就可以添加我为好友啦</p>
                        <img class="page-a-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                             @touchstart.stop="qrCodeTimesFn" @touchend.stop="mouseupFn"/>
                    </div>
                    <p class="page-a-des">每天学习一点，你就真的会变得更好</p>
                </div>
            </div>

        </div>
        <!--end-->
        <!--页面2-->
        <div class="page-b" v-if="page === 2">
            <div class="page-b-warp">
                <div class="page-b-text">
                    <div class="page-b-num">
                        <span :style="isIOS ? 'margin-top: 5px' : ''">仅剩</span>
                        <div id="stage-1" class="stage stage-state-default">
                            <div class="stage-content">
                                <ul class="stage-2-icon" style="margin-left: 5px">
                                    <li v-if="!isIOS" v-for="item in 4" :class="`stage-2-icon-${item}`"><span
                                            class="stage-2-icon-top"></span><span class="stage-2-icon-bottom"></span>
                                    </li>
                                    <li v-if="isIOS" class="stage-2">
                                        <img v-for="(item, index) in minPic" v-if="index === 0"
                                             :src="`https://img.kaikeba.com/${item}.png`" alt="">
                                    </li>
                                </ul>
                                <ul class="stage-1-icon" id="sec"
                                    :style="isIOS ? 'margin-left: 5px' : 'margin-left: 50px'">
                                    <li v-if="!isIOS" v-for="item in 29" :class="`stage-1-icon-${item}`"><span
                                            class="stage-1-icon-top"></span><span class="stage-1-icon-bottom"></span>
                                    </li>
                                    <li v-if="isIOS" class="stage-1">
                                        <img v-for="(item, index) in secPic" v-if="index === 0"
                                             :src="`https://img.kaikeba.com/${item}.png`" alt="">
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <span :style="isIOS ? 'margin-left: 5px; margin-top: 5px' : 'margin-left: 93px'">个名额</span>
                    </div>
                    <p class="page-b-word">扫码添加小助理微信，获取福利</p>
                </div>
                <div class="page-b-inner">
                    <img class="page-b-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                         @touchstart.stop="qrCodeTimesFn" @touchend.stop="mouseupFn"/>
                    <img class="page-b-slogan" src="../../assets/img/page_b_text.png" alt="">
                </div>
                <div class="page-b-photo">
                    <img v-for="(item, index) in photos" v-if="index > photos.length - 6"
                         :src="`https://img.kaikeba.com/${item}.jpg!w1h1`" alt="">
                    <p>...已领取</p>
                </div>
            </div>
        </div>
        <!--end-->
        <!--页面3-->
        <div class="page-c" v-if="page === 3">
            <div class="page-c-warp">
                <div class="page-c-text">
                    <p class="page-c-word">扫码添加小助理微信，免费报名</p>
                    <p class="page-c-num">（ 添加人数有限，请尽快添加报名 ）</p>
                </div>
                <div class="page-c-rect">
                    <img class="page-c-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                         @touchstart.stop="qrCodeTimesFn" @touchend.stop="mouseupFn"/>
                </div>
                <!--<div class="page-c-slogan">-->
                <!--<p>拒绝平庸，逆转从此课开始！</p>-->
                <!--</div>-->
            </div>
        </div>
        <!--end-->
        <!--页面4-->
        <div class="page-d" v-if="page === 4">
            <div class="page-d-warp">
                <div>
                    <div class="page-d-inner">
                        <p class="page-d-word">长按二维码，小助理拉你进群</p>
                        <p class="page-d-num">（群成员仅限500人，加满即止）</p>
                        <img class="page-d-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                             @touchstart.stop="qrCodeTimesFn" @touchend.stop="mouseupFn"/>
                    </div>
                    <p class="page-d-des">加入靠谱的学习圈，与大牛同群一起成长</p>
                </div>
            </div>
        </div>
        <!--end-->
        <!--页面6-->
        <div class="page-e" v-if="page === 6">
            <img class="page-e-bg-img" src="https://img.kaikeba.com/7b142299-5f97-45b1-9e94-2682beaf946f.jpg">
            <img class="page-e-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`" @touchstart.stop="qrCodeTimesFn"
                 @touchend.stop="mouseupFn"/>
        </div>
        <!--end-->
        <!--页面8-->
        <div id="page-f" class="page-f" v-show="page === 8">
            <img class="page-f-log" src="https://img.kaikeba.com/90746191300202tnic.png"/>
            <div class="page-f-tips">添加教务老师微信</div>
            <div class="page-f-qrcode">
                <img src="https://img.kaikeba.com/63146191300202vgqc.png"/>
                <img class="page-f-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                     @touchstart.stop="qrCodeTimesFn"
                     @touchend.stop="mouseupFn"/>
            </div>
        </div>
        <!--end-->
        <!--页面9-->
        <div id="page-h" class="page-h" v-show="page === 9">
            <div class="page-h-qrcode">
                <h3>添加专属教务老师微信</h3>
                <img class="page-h-qrcode-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                     @touchstart.stop="qrCodeTimesFn"
                     @touchend.stop="mouseupFn"/>
            </div>
            <div class="page-h-log">
                <img src="https://img.kaikeba.com/53854162300202kwnx.png">
            </div>
        </div>
        <!--end-->
        <!--页面10-->
        <div id="page-i" class="page-i" v-show="page === 10">
            <div class="page-i-qrcode">
                <div class="page-i-qrcode-title">
                    <div class="page-i-qrcode-title-dom">
                        <h3>长按二维码 添加专属教务老师</h3>
                        <h3>领取免费试学权益</h3>
                    </div>
                    <div class="page-i-bg"></div>
                </div>
                <img class="page-i-qrcode-img" :src="`https://img.kaikeba.com/${qrCode}!qr_hub`"
                     @touchstart.stop="qrCodeTimesFn"
                     @touchend.stop="mouseupFn"/>
                <div class="page-i-qrcode-auth">
                    <img src="https://img.kaikeba.com/a/92731131500202quwh.png"/>
                    <p class="page-i-qrcode-desc">此二维码已通过安全认证，可放心添加</p>
                </div>
            </div>
            <div class="page-i-log">
                <div class="page-i-log-awator">
                    <template v-for="(item,index) in awatorList">
                        <img :key="index" :src="`${item.src}`" :class="generateClassName(index)"/>
                    </template>
                </div>
                <div class="page-i-log-awator-desc">已有<span class="awator-desc-span">841</span>人报名参加</div>
            </div>
        </div>
        <!--end-->
        <!--页面11-->
        <div id="page-j" class="page-j" v-show="page === 11">
            <div class="page-j-logo">
                <img src="https://img.kaikeba.com/a/41925191500202lfpr.png">
            </div>
            <div class="page-j-qrcode">
                <div class="page-j-qrcode-img">
                    <img :src="`https://img.kaikeba.com/${qrCode}!qr_hub`" @touchstart.stop="qrCodeTimesFn"
                         @touchend.stop="mouseupFn"/>
                    <div class="page-j-qrcode-auth">
                        <img src="https://img.kaikeba.com/a/92731131500202quwh.png"/>
                        <p class="page-j-qrcode-desc">此二维码已通过安全认证，可放心添加</p>
                    </div>
                </div>
                <h3 class="page-j-h3">生活想把你埋了，但你是颗种子</h3>
            </div>
        </div>
        <!--end-->
        <!--页面12-->
        <div id="page-k" class="page-k" v-show="page === 12">
            <div class="page-k-logo">
                <img src="https://img.kaikeba.com/a/45207191500202mkdb.png">
            </div>
            <div class="page-k-qrcode" :style="{backgroundImage: page === 11 ? 'url(https://img.kaikeba.com/a/53638191500202dgwv.png)' : 'url(https://img.kaikeba.com/a/04307191500202qqsi.png)'}">
                <div class="page-k-qrcode-img">
                    <img :src="`https://img.kaikeba.com/${qrCode}!qr_hub`" @touchstart.stop="qrCodeTimesFn"
                         @touchend.stop="mouseupFn"/>
                    <div class="page-k-qrcode-auth">
                        <p class="page-k-qrcode-desc">当前领取人数较多，先到先得～</p>
                    </div>
                </div>
                <h3 class="page-k-h3">Stay young, Stay foolish</h3>
            </div>
        </div>
        <!--end-->
    </div>
</template>

<script>
    import {awatorList} from '../../utils/const'
    import {guid, setToken, getToken} from "../../assets/js/filter";
    import {Authorize} from "../../assets/js/beforeAuthorize"
    import {statisticsUVAndPV, qrCodeLongPress} from "../../api/api";
    import {Toast} from 'we-vue';

    let authorize = new Authorize();

    export default {
        data() {
            return {
                id: this.$route.params.id ? this.$route.params.id : 1,
                qrCode: '15300933533103021',
                qrCodeWaiting: true,
                isIOS: false,
                isActives: false,
                noCourse: '',
                count: 0,
                page: 0,
                timer: null, //定时器
                photos: [41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
                secPic: [0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 8, 7, 6, 5, 4, 3, 2],
                minPic: [3, 2, 1, 0],
                code: this.$route.query.code,//获取授权code,
                awatorList: awatorList
            }
        },
        created() {
            setToken('tenant', null);
            //授权操作
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            if (version !== -1) {
                //授权获取code
                if (getToken('qrcodeOpenid')) {
                    this.inin()
                } else {
                    this.wxAuthor()
                }
            } else {
                window.location = 'http://study.kaikeba.com/wxlimit';
            }
        },
        mounted() {

        },
        methods: {
            generateClassName(index) {
                return "awator awator" + (index + 1);
            },
            inin() {
                this.judgeIOS();
                if (!getToken('uuid')) setToken('uuid', guid());
                this.statisticsUVAndPV();
            },
            handlePageHeight() {
                let pageHeight = document.documentElement.clientHeight;
                let contentHeight = document.getElementById('page-f').offsetHeight;
                if (pageHeight > contentHeight) {
                    document.getElementById('page-f').style.height = document.documentElement.clientHeight + 'px';
                }
            },
            handlePageHeightNice() {
                let pageHeight = document.documentElement.clientHeight;
                let contentHeight = document.getElementById('page-h').offsetHeight;
                if (parseInt(pageHeight - contentHeight) > 48) {
                    document.getElementById('page-h').style.height = document.documentElement.clientHeight + 'px';
                }
            },
            handlePageHeightNice2() {
                let pageHeight = document.documentElement.clientHeight;
                let contentHeight = document.getElementById('page-i').offsetHeight;
                if (pageHeight > contentHeight) {
                    document.getElementById('page-i').style.height = document.documentElement.clientHeight + 'px';
                }
            },
            handlePageHeighCom(dom) {
                let pageHeight = document.documentElement.clientHeight;
                let contentHeight = document.getElementById(dom).offsetHeight;
                let qrcodeImgBoxClss = (this.page === 11 ? 'page-j-qrcode' : 'page-k-qrcode')
                let qrcodeHeight = document.getElementsByClassName(qrcodeImgBoxClss)[0].offsetHeight
                if (pageHeight > contentHeight) {
                    let diffHeight = pageHeight - contentHeight;
                    document.getElementsByClassName(qrcodeImgBoxClss)[0].style.height = (qrcodeHeight + diffHeight) + 'px'
                    document.getElementById(dom).style.height = pageHeight + 'px'
                }
            },
            wxAuthor() {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.inin);
                }
            },
            // 判断是否是ios
            judgeIOS() {
                let u = navigator.userAgent;
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isiOS) {
                    this.isIOS = true
                }
            },
            // 统计图片长按次数
            qrCodeTimesFn() {
                let _this = this;
                this.timer = setTimeout(function () {
                    let sendData = {
                        id: _this.id,
                        qrCode: _this.qrCode,
                        openid: getToken('qrcodeOpenid'),
                        unionid: null
                    };
                    qrCodeLongPress(sendData)
                }, 1000);
            },
            // 清除定时器
            mouseupFn() {
                clearTimeout(this.timer);
            },
            // 统计pv/uv
            statisticsUVAndPV() {
                let sendData = {
                    id: this.id,
                    uuid: getToken('uuid'),
                    openid: getToken('qrcodeOpenid'),
                    unionid: null
                }
                statisticsUVAndPV(sendData).then(res => {
                    this.qrCodeWaiting = false;
                    if (res.data.code === 0) {
                        this.qrCode = res.data.data.qrCode;
                        this.page = parseInt(res.data.data.templateId) ? parseInt(res.data.data.templateId) : 1;
                        if (this.page === 2) {
                            let timer = setInterval(() => {
                                if (this.photos.length > 9) {
                                    if (this.isIOS) {
                                        if (this.secPic[0] === 0) {
                                            this.minPic.shift();
                                        }
                                        this.secPic.shift();
                                    }
                                    this.photos.pop();
                                } else {
                                    clearInterval(timer)
                                }
                            }, 4000);
                        }
                        if (this.page === 8) {
                            let _this = this;
                            this.$nextTick(function () {
                                _this.handlePageHeight()
                            })
                        }
                        if (this.page === 9) {
                            let _this = this;
                            this.$nextTick(function () {
                                _this.handlePageHeightNice()
                            })
                        }
                        if (this.page === 10) {
                            let _this = this;
                            this.$nextTick(function () {
                                _this.handlePageHeightNice2()
                            })
                        }
                        if (this.page === 11 || this.page === 12) {
                            let _this = this;
                            this.$nextTick(function () {
                                let dom = (this.page === 11 ? 'page-j' : 'page-k')
                                _this.handlePageHeighCom(dom)
                            })
                        }
                    } else {
                        Toast.fail({
                            duration: 1500,
                            message: res.data.msg
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .page-k {
        width: 100%;
        text-align: center;
        background-color: #fff;
        background-image: url("https://img.kaikeba.com/a/04207191500202mrkh.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: -1px;
        overflow: hidden;
        box-sizing: border-box;
    }

    .page-k-logo {
        width: 100%;
        text-align: right;
    }

    .page-k-logo img {
        width: 85px;
        height: 36px;
        vertical-align: top;
        margin-top: 13px;
        margin-bottom: 63px;
        margin-right: 19px;
    }

    .page-k-qrcode {
        width: 100%;
        height: 403px;
        overflow: hidden;
        background-image: url("https://img.kaikeba.com/a/04307191500202qqsi.png");
        background-repeat: no-repeat;
        background-size: 101%;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        margin-top: 40.8%;
    }

    .page-k-qrcode-img {
        width: 267px;
        height: 294px;
        background-color: #fff;
        box-shadow: 0px 0px 8px 1px rgba(72, 187, 235, 0.25);
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 31px;
        text-align: center;
    }

    .page-k-qrcode-img img {
        width: 215px;
        height: 215px;
        margin-top: 25px;
    }

    .page-k-qrcode-auth {
        text-align: center;
    }

    .page-k-qrcode-auth img {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        margin: 0;
    }

    .page-k-qrcode-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 17px;
        margin-top: 4px;
        color:rgba(93,184,171,1);
        display: inline-block;
    }

    .page-k-h3 {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color:rgba(1,113,137,1);
        margin-top: 24px;
    }


    .page-j {
        width: 100%;
        text-align: center;
        background-color: rgb(163,198,253);
        background-image: url("https://img.kaikeba.com/a/81725191500202ciok.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: -1px;
        overflow: hidden;
        box-sizing: border-box;
    }

    .page-j-logo {
        width: 100%;
        text-align: right;
    }

    .page-j-logo img {
        width: 85px;
        height: 36px;
        vertical-align: top;
        margin-top: 13px;
        margin-bottom: 63px;
        margin-right: 19px;
    }

    .page-j-qrcode {
        width: 100%;
        height: 403px;
        overflow: hidden;
        background-image: url("https://img.kaikeba.com/a/53638191500202dgwv.png");
        background-repeat: no-repeat;
        background-size: 101%;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        margin-top: 40.8%;
    }

    .page-j-qrcode-img {
        width: 267px;
        height: 294px;
        background-color: #fff;
        box-shadow: 0px 0px 8px 1px rgba(72, 187, 235, 0.25);
        border-radius: 5px;
        margin: 0 auto;
        margin-top: 31px;
        text-align: center;
    }

    .page-j-qrcode-img img {
        width: 215px;
        height: 215px;
        margin-top: 25px;
    }

    .page-j-qrcode-auth {
        text-align: center;
    }

    .page-j-qrcode-auth img {
        width: 12px;
        height: 12px;
        vertical-align: middle;
        margin: 0;
    }

    .page-j-qrcode-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 17px;
        margin-top: 4px;
        color: #5DB8AB;
        display: inline-block;
    }

    .page-j-h3 {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 114, 203, 1);
        margin-top: 24px;
    }


    .page-i {
        width: 100%;
        text-align: center;
        background-color: #F7F9FA;
        background-image: url("https://img.kaikeba.com/a/23824121500202dcen.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position-y: -1px;
        overflow: hidden;
        box-sizing: border-box;
    }

    .page-i-qrcode {
        width: 268px;
        height: 363px;
        background: rgba(246, 249, 255, 1);
        box-shadow: 0px 0px 20px 0px rgba(32, 62, 66, 0.11);
        border-radius: 8px;
        margin: 0 auto;
        margin-top: 61.6%;
        overflow: hidden;
    }

    .page-i-qrcode-title {
        width: 100%;
        height: 81px;
        background: rgba(255, 255, 255, 1);
        position: relative;
        box-sizing: border-box;
        padding-top: 15px;
    }

    .page-i-qrcode-title-dom {
        position: relative;
        z-index: 10;
    }

    .page-i-qrcode-title h3 {
        font-size: 16px;
        color: rgba(51, 51, 51, 1);
    }

    .page-i-bg {
        width: 138px;
        height: 8px;
        background-color: #FFDE00;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        z-index: 9;
        margin-top: 54px;
    }

    .page-i-qrcode-img {
        width: 206px;
        height: 206px;
        margin-top: 20px;
    }

    .page-i-qrcode-desc {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        line-height: 17px;
        margin-top: 4px;
        display: inline-block;
    }

    .page-i-log-awator {
        width: 247px;
        height: 26px;
        margin: 0 auto;
        margin-top: 26px;
        position: relative;
    }

    .page-i-log {
        margin-bottom: 73px;
    }

    .page-i-log-awator img {
        width: 26px;
        height: 26px;
        border-radius: 26px;
    }

    .awator {
        position: absolute;
        z-index: 99;
    }

    .awator.awator1 {
        left: 0;
        top: 0;
    }

    .awator.awator2 {
        left: 33px;
        top: 0;
    }

    .awator.awator3 {
        left: 66px;
        top: 0;
    }

    .awator.awator4 {
        left: 99px;
        top: 0;
    }

    .awator.awator5 {
        left: 132px;
        top: 0;
    }

    .awator.awator6 {
        left: 165px;
        top: 0;
    }

    .awator.awator7 {
        left: 195px;
        top: 0;
        z-index: 9;
    }

    .awator.awator8 {
        width: 24px;
        height: 24px;
        left: 203px;
        top: 1px;
        z-index: 8;
    }

    .awator.awator9 {
        width: 24px;
        height: 24px;
        left: 211px;
        top: 1px;
        z-index: 7;
    }

    .awator.awator10 {
        width: 24px;
        height: 24px;
        left: 218px;
        top: 1px;
        z-index: 6;
    }

    .awator.awator11 {
        width: 24px;
        height: 24px;
        left: 226px;
        top: 1px;
        z-index: 5;
    }

    .page-i-log-awator-desc {
        width: 243px;
        height: 20px;
        margin: 0 auto;
        background-image: url("https://img.kaikeba.com/a/93157121500202fcyz.png");
        background-repeat: no-repeat;
        background-size: 100%;
        background-position-y: 10px;
        color: #333333;
        font-size: 14px;
        margin-top: 9px;
    }

    .awator-desc-span {
        margin: 0 5px;
        color: #FF3F3F;
    }

    .page-i-qrcode-auth {
        text-align: center;
    }

    .page-i-qrcode-auth img {
        width: 12px;
        height: 12px;
        vertical-align: middle;
    }


    .page-h {
        width: 100%;
        text-align: center;
        background-color: #227bef;
        background-image: url("https://img.kaikeba.com/74144162300202xnny.png");
        background-size: 100%;
        background-repeat: no-repeat;
        overflow: hidden;
    }

    .page-h-qrcode {
        width: 333px;
        height: 453px;
        background-image: url("https://img.kaikeba.com/83654162300202vfzq.png");
        background-size: 100%;
        background-repeat: no-repeat;
        overflow: hidden;
        margin: 0 auto;
        margin-top: 90px;
    }

    .page-h-qrcode h3 {
        font-size: 19px;
        color: rgba(27, 125, 233, 1);
        line-height: 18px;
        margin-bottom: 23px;
        margin-top: 140px;
    }

    .page-h-qrcode-img {
        width: 190px;
        height: 190px;
        border: 1px solid rgba(186, 186, 186, 1);
    }

    .page-h-log {
        width: 100%;
        text-align: center;
        margin-top: 28px;
        margin-bottom: 48px;
    }

    .page-h-log img {
        width: 32%;
        vertical-align: middle;
    }

    @media screen and (max-width: 330px) {
        .page-h-qrcode {
            width: 280px;
            height: 381px;
            background-image: url("https://img.kaikeba.com/83654162300202vfzq.png");
            background-size: 100%;
            background-repeat: no-repeat;
            overflow: hidden;
            margin: 0 auto;
            margin-top: 90px;
        }

        .page-h-qrcode h3 {
            margin-bottom: 23px;
            margin-top: 115px;
        }

        .page-h-qrcode-img {
            width: 160px;
            height: 160px;
            border: 1px solid rgba(186, 186, 186, 1);
        }

        /*.page-i-qrcode{*/
        /*margin-top: 195px;*/
        /*}*/
    }


    .qrcode-spin {
        margin-left: calc(50% - 20px);
        margin-top: 200px;
    }

    /*通用页面样式*/
    .page-common-wrap {
        margin: 0 auto;
        padding-top: 36px;
        width: 100%;
        height: calc(100vh - 36px);
        text-align: center;
        position: relative;
        background: rgb(247, 247, 247);
    }

    .page-common-title {
        color: #df0a0a;
        font-size: 21px;
        margin-bottom: 32.5px;
    }

    .page-common-inner {
        margin: 0 auto;
        width: 304px;
        height: 373px;
        background: #fff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .1);
        border-radius: 15px;
    }

    .page-common-word {
        color: #333;
        font-size: 15px;
        padding-top: 33px;
    }

    .page-common-img {
        width: 225px;
        height: 225px;
        margin: 0 auto;
        padding-top: 29px;
    }

    /*页面A的样式*/
    .page-a {
        text-align: center;
    }

    .page-a-warp {
        width: 100%;
        height: 100vh;
        background: url("../../assets/img/page_a_bg.png") center no-repeat;
        background-size: cover;
    }

    .page-a-title {
        max-width: 260px;
        width: 76%;
        margin-top: 30px;
    }

    .page-a-inner {
        /*250px 320px*/
        width: 290px;
        height: 360px;
        background: url("../../assets/img/page_a_inner.png") no-repeat;
        background-size: cover;
        margin: 0 auto;
        text-align: center;
    }

    .page-a-word {
        font-size: 14px;
        line-height: 110px;
    }

    .page-a-img {
        width: 66%;
        height: 52%;
    }

    .page-a-des {
        font-size: 16px;
        color: #63acda;
        text-align: center;
        margin-top: -6px;
    }

    /*页面B的样式*/
    .page-b-warp {
        width: 100%;
        height: 100vh;
        background: url("../../assets/img/page_b_bg.png") center no-repeat;
        background-size: cover;
        text-align: center;
    }

    .page-b-text {
        color: #fff;
    }

    .page-b-num {
        width: 213px;
        margin: 0 auto;
        font-size: 24px;
        padding-top: 50px;
        padding-bottom: 15px;
        overflow: hidden;
    }

    .page-b-num span {
        font-weight: 500;
        float: left;
    }

    .page-b-word {
        font-size: 14px;
        /*padding-top: 10px;*/
    }

    .page-b-inner {
        width: 310px;
        height: 290px;
        background: #fff;
        border-radius: 5px;
        box-shadow: 0 0 66px rgba(51, 125, 138, 0.2);
        margin: 20px auto;
    }

    .page-b-img {
        width: 170px;
        height: 165px;
        margin-top: 50px;
    }

    .page-b-slogan {
        width: 70%;
        margin-top: 20px;
    }

    .page-b-photo {
        width: 305px;
        height: 80px;
        background: #F3FDFF;
        border-radius: 8px;
        box-shadow: 0 0 66px rgba(51, 125, 138, 0.1);
        margin: 24px auto;
        padding-left: 5px;
    }

    .page-b-photo img {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        float: left;
        margin-left: 10px;
        margin-top: 22px;
    }

    .page-b-photo p {
        color: #292929;
        font-size: 15px;
        padding-top: 30px;
    }

    .page-c {
        width: 100%;
        height: 100vh;
        background: #F3FDFF;
        /*padding-top: 35px;*/
    }

    .page-c-warp {
        width: 100%;
        height: 100%;
        background: url("../../assets/img/page_c_inner.png") no-repeat;
        background-size: 100%;
        background-position: 0 30px;
    }

    .page-c-text {
        text-align: center;
        padding-top: 60px;
    }

    .page-c-word {
        font-size: 18px;
        color: #00AFF2;
        font-weight: bold;
        margin-top: 30px;
    }

    .page-c-num {
        font-size: 14px;
        color: #9A9A9A;
    }

    .page-c-rect {
        width: 200px;
        height: 200px;
        background: url("../../assets/img/page_c_rectangle.png") center no-repeat;
        background-size: 100%;
        margin: 7% auto;
    }

    .page-c-img {
        width: 92%;
        height: 92%;
        margin-left: 4%;
        margin-top: 4%;
    }

    /*.page-c-slogan p{*/
    /*font-size: 14px;*/
    /*color: #292929;*/
    /*text-align: center;*/
    /*margin-top: 15%;*/
    /*}*/

    /*页面A的样式*/
    .page-d {
        text-align: center;
    }

    .page-d-warp {
        width: 100%;
        height: 100vh;
        background: url("../../assets/img/page_d_bg.png") center no-repeat;
        background-size: cover;
        max-width: 500px;
        margin: 0 auto;
    }

    .page-d-title {
        max-width: 260px;
        width: 76%;
        margin-top: 30px;
    }

    .page-d-inner {
        /*250px 320px*/
        width: 290px;
        /*height: 360px;*/
        margin: 0 auto;
        text-align: center;
    }

    .page-d-word {
        font-size: 16px;
        color: #fff;
        font-weight: 500;
        padding-top: 80px;
    }

    .page-d-num {
        font-size: 12px;
        color: #fff;
        margin-bottom: 20px;
    }

    .page-d-img {
        width: 66%;
        height: 52%;
    }

    .page-d-des {
        font-size: 13px;
        color: #282828;
        text-align: center;
        margin-top: 20px;
    }

    /*页面E的样式*/
    .page-e {
        width: 100%;
        height: 100vh;
        position: relative;
        background-color: #0c1439;
    }

    .page-e-bg-img {
        vertical-align: top;
        width: 100%;
    }

    .page-e-img {
        width: 46%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        margin-top: 77%;
    }

    .page-f {
        width: 100%;
        text-align: center;
        background-color: black;
        background-image: url("https://img.kaikeba.com/64250191300202yuat.jpg");
        background-size: 100%;
        background-repeat: repeat;
        overflow: hidden;
    }

    .page-f-qrcode {
        width: 285px;
        height: 350px;
        margin: 0 auto;
        margin-top: 11.6%;
        margin-bottom: 100px;
        position: relative;
    }

    .page-f-qrcode img {
        width: 100%;
    }

    .page-f-log {
        width: 23%;
        margin-top: 43px;
    }

    .page-f-tips {
        width: 73.3%;
        height: 55px;
        margin: 0 auto;
        background-color: #63d5df;
        border-radius: 10px;
        margin-top: 12%;
        font-size: 22px;
        color: #124850;
        text-align: center;
        line-height: 55px;
        font-weight: 600;
    }

    .page-f-qrcode .page-f-img {
        width: 171px;
        height: 171px;
        position: absolute;
        top: 106px;
        left: 51px;
    }

    /*@media all and (min-height:500px) and (max-height:568px){*/
    /*.page-e-img{*/
    /*margin-top: 65%;*/
    /*}*/
    /*}*/
    /*@media all and (min-height:737px) and (max-height:799px){*/
    /*.page-e-img{*/
    /*margin-top: 75%;*/
    /*}*/
    /*}*/

    /*@media all and (min-height:800px) and (max-height:820px){*/
    /*.page-e-img{*/
    /*margin-top: 85%;*/
    /*}*/
    /*}*/
    /*@media all and (min-height:821px) and (max-height:826px){*/
    /*.page-e-img{*/
    /*margin-top: 76%;*/
    /*}*/
    /*}*/


    @media screen and (min-width: 500px) {
        .page-a-warp, .page-b-warp {
            background-size: contain;
        }

        .page-c {
            width: 400px;
            margin: 0 auto;
        }
    }

    /*倒计时翻页*/
    #stage-1 .stage-content {
        margin: 0 auto 0 auto;
    }

    .stage-1, .stage-2 {
        background: #fff;
        width: 39px;
        height: 50px;
        border-radius: 8px;
        position: relative;
        float: left;
    }

    .stage-1 img, .stage-2 img {
        width: 70%;
        height: 70%;
        margin-top: 15%;
    }

    .stage-1-icon, .stage-2-icon {
        float: left;
        margin: 0 auto 0;
        position: relative;
        -webkit-perspective: 900px;
    }

    .stage-1-icon-top, .stage-1-icon-bottom, .stage-2-icon-top, .stage-2-icon-bottom {
        width: 23px;
        position: absolute;
        left: 0;
        background-color: #fff;
        background-repeat: no-repeat;
        -webkit-transform-style: preserve-3d;
    }

    .stage-1-icon-top, .stage-2-icon-top {
        height: 17px;
        padding: 8px 8px 0;
        top: -8px;
        background-position: center 9px;
        -webkit-transform-origin: center bottom;
        -moz-transform-origin: center bottom;
        -ms-transform-origin: center bottom;
        -o-transform-origin: center bottom;
        transform-origin: center bottom;
        background-size: 50%;
        border-radius: 8px 8px 0 0;
    }

    .stage-1-icon-bottom, .stage-2-icon-bottom {
        height: 17px;
        top: 17px;
        padding: 0 8px 8px;
        background-position: center -16px;
        -webkit-transform-origin: center top;
        -moz-transform-origin: center top;
        -ms-transform-origin: center top;
        -o-transform-origin: center top;
        transform-origin: center top;
        background-size: 50%;
        border-radius: 0 0 8px 8px;
    }

    .stage-2-icon-1 .stage-2-icon-top, .stage-2-icon-1 .stage-2-icon-bottom {
        z-index: 10;
        background-image: url(../../assets/img/3.png)
    }

    .stage-2-icon-2 .stage-2-icon-top, .stage-2-icon-2 .stage-2-icon-bottom {
        z-index: 9;
        background-image: url(../../assets/img/2.png)
    }

    .stage-2-icon-3 .stage-2-icon-top, .stage-2-icon-3 .stage-2-icon-bottom {
        z-index: 8;
        background-image: url(../../assets/img/1.png)
    }

    .stage-2-icon-4 .stage-2-icon-top, .stage-2-icon-4 .stage-2-icon-bottom {
        z-index: 7;
        background-image: url(../../assets/img/0.png)
    }

    .stage-1-icon-1 .stage-1-icon-top, .stage-1-icon-1 .stage-1-icon-bottom {
        z-index: 30;
        background-image: url(../../assets/img/0.png)
    }

    .stage-1-icon-2 .stage-1-icon-top, .stage-1-icon-2 .stage-1-icon-bottom {
        z-index: 29;
        background-image: url(../../assets/img/9.png)
    }

    .stage-1-icon-3 .stage-1-icon-top, .stage-1-icon-3 .stage-1-icon-bottom {
        z-index: 28;
        background-image: url(../../assets/img/8.png)
    }

    .stage-1-icon-4 .stage-1-icon-top, .stage-1-icon-4 .stage-1-icon-bottom {
        z-index: 27;
        background-image: url(../../assets/img/7.png)
    }

    .stage-1-icon-5 .stage-1-icon-top, .stage-1-icon-5 .stage-1-icon-bottom {
        z-index: 26;
        background-image: url(../../assets/img/6.png)
    }

    .stage-1-icon-6 .stage-1-icon-top, .stage-1-icon-6 .stage-1-icon-bottom {
        z-index: 25;
        background-image: url(../../assets/img/5.png)
    }

    .stage-1-icon-7 .stage-1-icon-top, .stage-1-icon-7 .stage-1-icon-bottom {
        z-index: 24;
        background-image: url(../../assets/img/4.png)
    }

    .stage-1-icon-8 .stage-1-icon-top, .stage-1-icon-8 .stage-1-icon-bottom {
        z-index: 23;
        background-image: url(../../assets/img/3.png)
    }

    .stage-1-icon-9 .stage-1-icon-top, .stage-1-icon-9 .stage-1-icon-bottom {
        z-index: 22;
        background-image: url(../../assets/img/2.png)
    }

    .stage-1-icon-10 .stage-1-icon-top, .stage-1-icon-10 .stage-1-icon-bottom {
        z-index: 21;
        background-image: url(../../assets/img/1.png)
    }

    .stage-1-icon-11 .stage-1-icon-top, .stage-1-icon-11 .stage-1-icon-bottom {
        z-index: 20;
        background-image: url(../../assets/img/0.png)
    }

    .stage-1-icon-12 .stage-1-icon-top, .stage-1-icon-12 .stage-1-icon-bottom {
        z-index: 19;
        background-image: url(../../assets/img/9.png)
    }

    .stage-1-icon-13 .stage-1-icon-top, .stage-1-icon-13 .stage-1-icon-bottom {
        z-index: 18;
        background-image: url(../../assets/img/8.png)
    }

    .stage-1-icon-14 .stage-1-icon-top, .stage-1-icon-14 .stage-1-icon-bottom {
        z-index: 17;
        background-image: url(../../assets/img/7.png)
    }

    .stage-1-icon-15 .stage-1-icon-top, .stage-1-icon-15 .stage-1-icon-bottom {
        z-index: 16;
        background-image: url(../../assets/img/6.png)
    }

    .stage-1-icon-16 .stage-1-icon-top, .stage-1-icon-16 .stage-1-icon-bottom {
        z-index: 15;
        background-image: url(../../assets/img/5.png)
    }

    .stage-1-icon-17 .stage-1-icon-top, .stage-1-icon-17 .stage-1-icon-bottom {
        z-index: 14;
        background-image: url(../../assets/img/4.png)
    }

    .stage-1-icon-18 .stage-1-icon-top, .stage-1-icon-18 .stage-1-icon-bottom {
        z-index: 13;
        background-image: url(../../assets/img/3.png)
    }

    .stage-1-icon-19 .stage-1-icon-top, .stage-1-icon-19 .stage-1-icon-bottom {
        z-index: 12;
        background-image: url(../../assets/img/2.png)
    }

    .stage-1-icon-20 .stage-1-icon-top, .stage-1-icon-20 .stage-1-icon-bottom {
        z-index: 11;
        background-image: url(../../assets/img/1.png)
    }

    .stage-1-icon-21 .stage-1-icon-top, .stage-1-icon-21 .stage-1-icon-bottom {
        z-index: 10;
        background-image: url(../../assets/img/0.png)
    }

    .stage-1-icon-22 .stage-1-icon-top, .stage-1-icon-22 .stage-1-icon-bottom {
        z-index: 9;
        background-image: url(../../assets/img/9.png)
    }

    .stage-1-icon-23 .stage-1-icon-top, .stage-1-icon-23 .stage-1-icon-bottom {
        z-index: 8;
        background-image: url(../../assets/img/8.png)
    }

    .stage-1-icon-24 .stage-1-icon-top, .stage-1-icon-24 .stage-1-icon-bottom {
        z-index: 7;
        background-image: url(../../assets/img/7.png)
    }

    .stage-1-icon-25 .stage-1-icon-top, .stage-1-icon-25 .stage-1-icon-bottom {
        z-index: 6;
        background-image: url(../../assets/img/6.png)
    }

    .stage-1-icon-26 .stage-1-icon-top, .stage-1-icon-26 .stage-1-icon-bottom {
        z-index: 5;
        background-image: url(../../assets/img/5.png)
    }

    .stage-1-icon-27 .stage-1-icon-top, .stage-1-icon-27 .stage-1-icon-bottom {
        z-index: 4;
        background-image: url(../../assets/img/4.png)
    }

    .stage-1-icon-28 .stage-1-icon-top, .stage-1-icon-28 .stage-1-icon-bottom {
        z-index: 3;
        background-image: url(../../assets/img/3.png)
    }

    .stage-1-icon-29 .stage-1-icon-top, .stage-1-icon-29 .stage-1-icon-bottom {
        z-index: 2;
        background-image: url(../../assets/img/2.png)
    }

    .stage-1-icon-30 .stage-1-icon-top, .stage-1-icon-30 .stage-1-icon-bottom {
        z-index: 1;
        background-image: url(../../assets/img/1.png)
    }

    @-webkit-keyframes flipover-top {
        0% {
            z-index: 31;
            background-color: #fff;
            -webkit-transform: rotateX(0);
        }
        50% {
            z-index: 31;
            background-color: #efefef;
            -webkit-transform: rotateX(-90deg);
        }
        51% {
            z-index: 30;
            opacity: 1;
        }
        100% {
            z-index: 30;
            background-color: #fff;
            opacity: 0;
            -webkit-transform: rotateX(-180deg);
        }
    }

    @-moz-keyframes flipover-top {
        0% {
            z-index: 31;
            background-color: #fff;
            -moz-transform: rotateX(0);
        }
        50% {
            z-index: 31;
            background-color: #efefef;
            -moz-transform: rotateX(-90deg);
        }
        51% {
            z-index: 30;
            opacity: 1;
        }
        100% {
            z-index: 30;
            background-color: #fff;
            opacity: 0;
            -moz-transform: rotateX(-180deg);
        }
    }

    @-ms-keyframes flipover-top {
        0% {
            z-index: 31;
            background-color: #fff;
            -ms-transform: rotateX(0);
        }
        50% {
            z-index: 31;
            background-color: #efefef;
            -ms-transform: rotateX(-90deg);
        }
        51% {
            z-index: 30;
            opacity: 1;
        }
        100% {
            z-index: 30;
            background-color: #fff;
            opacity: 0;
            -ms-transform: rotateX(-180deg);
        }
    }

    @-o-keyframes flipover-top {
        0% {
            z-index: 31;
            background-color: #fff;
            -o-transform: rotateX(0);
        }
        50% {
            z-index: 31;
            background-color: #efefef;
            -o-transform: rotateX(-90deg);
        }
        51% {
            z-index: 30;
            opacity: 1;
        }
        100% {
            z-index: 30;
            background-color: #fff;
            opacity: 0;
            -o-transform: rotateX(-180deg);
        }
    }

    @keyframes flipover-top {
        0% {
            z-index: 31;
            background-color: #fff;
            transform: rotateX(0);
        }
        50% {
            z-index: 31;
            background-color: #efefef;
            transform: rotateX(-90deg);
        }
        51% {
            z-index: 30;
            opacity: 1;
        }
        100% {
            z-index: 30;
            background-color: #fff;
            opacity: 0;
            transform: rotateX(-180deg);
        }
    }

    @-webkit-keyframes flipover-bottom {
        0% {
            z-index: 30;
            background-color: #fff;
            -webkit-transform: rotateX(180deg);
        }
        50% {
            z-index: 30;
            background-color: #efefef;
            -webkit-transform: rotateX(90deg);
        }
        51% {
            z-index: 31;
        }
        100% {
            z-index: 31;
            background-color: #fff;
            -webkit-transform: rotateX(0);
        }
    }

    @-moz-keyframes flipover-bottom {
        0% {
            z-index: 30;
            background-color: #fff;
            -moz-transform: rotateX(180deg);
        }
        50% {
            z-index: 30;
            background-color: #efefef;
            -moz-transform: rotateX(90deg);
        }
        51% {
            z-index: 31;
        }
        100% {
            z-index: 31;
            background-color: #fff;
            -moz-transform: rotateX(0);
        }
    }

    @-ms-keyframes flipover-bottom {
        0% {
            z-index: 30;
            background-color: #fff;
            -ms-transform: rotateX(180deg);
        }
        50% {
            z-index: 30;
            background-color: #efefef;
            -ms-transform: rotateX(90deg);
        }
        51% {
            z-index: 31;
        }
        100% {
            z-index: 31;
            background-color: #fff;
            -ms-transform: rotateX(0);
        }
    }

    @-o-keyframes flipover-bottom {
        0% {
            z-index: 30;
            background-color: #fff;
            -o-transform: rotateX(180deg);
        }
        50% {
            z-index: 30;
            background-color: #efefef;
            -o-transform: rotateX(90deg);
        }
        51% {
            z-index: 31;
        }
        100% {
            z-index: 31;
            background-color: #fff;
            -o-transform: rotateX(0);
        }
    }

    @keyframes flipover-bottom {
        0% {
            z-index: 30;
            background-color: #fff;
            transform: rotateX(180deg);
        }
        50% {
            z-index: 30;
            background-color: #efefef;
            transform: rotateX(90deg);
        }
        51% {
            z-index: 31;
        }
        100% {
            z-index: 31;
            background-color: #fff;
            transform: rotateX(0);
        }
    }

    @-webkit-keyframes fadein-from-bottom {
        0% {
            opacity: 0;
            -webkit-transform: translateY(300px);
        }
        100% {
            opacity: 1;
            -webkit-transform: translateY(0);
        }
    }

    @-moz-keyframes fadein-from-bottom {
        0% {
            opacity: 0;
            -moz-transform: translateY(300px);
        }
        100% {
            opacity: 1;
            -moz-transform: translateY(0);
        }
    }

    @-ms-keyframes fadein-from-bottom {
        0% {
            opacity: 0;
            -ms-transform: translateY(300px);
        }
        100% {
            opacity: 1;
            -ms-transform: translateY(0);
        }
    }

    @-o-keyframes fadein-from-bottom {
        0% {
            opacity: 0;
            -o-transform: translateY(300px);
        }
        100% {
            opacity: 1;
            -o-transform: translateY(0);
        }
    }

    @keyframes fadein-from-bottom {
        0% {
            opacity: 0;
            transform: translateY(300px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    #stage-1.stage-state-default {
        z-index: 1
    }

    #stage-1.stage-state-default .stage-1-icon-bottom, #stage-1.stage-state-default .stage-2-icon-bottom {
        -webkit-transform: translateX(0) translateY(0) translateZ(0) rotateX(180deg) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -moz-transform: translateX(0) translateY(0) translateZ(0) rotateX(180deg) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -ms-transform: translateX(0) translateY(0) translateZ(0) rotateX(180deg) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -o-transform: translateX(0) translateY(0) translateZ(0) rotateX(180deg) rotateY(0) rotateZ(0) rotate(0) scale(1);
        transform: translateX(0) translateY(0) translateZ(0) rotateX(180deg) rotateY(0) rotateZ(0) rotate(0) scale(1)
    }

    #stage-1.stage-state-default .stage-1-icon-1 .stage-1-icon-bottom, #stage-1.stage-state-default .stage-2-icon-1 .stage-2-icon-bottom {
        -webkit-transform: translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -moz-transform: translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -ms-transform: translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0) rotate(0) scale(1);
        -o-transform: translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0) rotate(0) scale(1);
        transform: translateX(0) translateY(0) translateZ(0) rotateX(0) rotateY(0) rotateZ(0) rotate(0) scale(1)
    }

    #stage-1.stage-state-default .stage-2-icon-1 .stage-2-icon-top {
        -webkit-animation: flipover-top .35s linear 4s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 4s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 4s 1 normal forwards;
        -o-animation: flipover-top .35s linear 4s 1 normal forwards;
        animation: flipover-top .35s linear 4s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-2-icon-2 .stage-2-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        animation: flipover-bottom .35s linear 4s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-2-icon-2 .stage-2-icon-top {
        -webkit-animation: flipover-top .35s linear 44s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 44s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 44s 1 normal forwards;
        -o-animation: flipover-top .35s linear 44s 1 normal forwards;
        animation: flipover-top .35s linear 44s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-2-icon-3 .stage-2-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        animation: flipover-bottom .35s linear 44s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-2-icon-3 .stage-2-icon-top {
        -webkit-animation: flipover-top .35s linear 84s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 84s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 84s 1 normal forwards;
        -o-animation: flipover-top .35s linear 84s 1 normal forwards;
        animation: flipover-top .35s linear 84s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-2-icon-4 .stage-2-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        animation: flipover-bottom .35s linear 84s 1 normal forwards
    }


    /*sec*/
    #stage-1.stage-state-default .stage-1-icon-1 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 4s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 4s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 4s 1 normal forwards;
        -o-animation: flipover-top .35s linear 4s 1 normal forwards;
        animation: flipover-top .35s linear 4s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-2 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 4s 1 normal forwards;
        animation: flipover-bottom .35s linear 4s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-2 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 8s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 8s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 8s 1 normal forwards;
        -o-animation: flipover-top .35s linear 8s 1 normal forwards;
        animation: flipover-top .35s linear 8s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-3 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 8s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 8s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 8s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 8s 1 normal forwards;
        animation: flipover-bottom .35s linear 8s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-3 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 12s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 12s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 12s 1 normal forwards;
        -o-animation: flipover-top .35s linear 12s 1 normal forwards;
        animation: flipover-top .35s linear 12s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-4 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 12s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 12s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 12s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 12s 1 normal forwards;
        animation: flipover-bottom .35s linear 12s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-4 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 16s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 16s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 16s 1 normal forwards;
        -o-animation: flipover-top .35s linear 16s 1 normal forwards;
        animation: flipover-top .35s linear 16s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-5 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 16s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 16s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 16s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 16s 1 normal forwards;
        animation: flipover-bottom .35s linear 16s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-5 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 20s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 20s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 20s 1 normal forwards;
        -o-animation: flipover-top .35s linear 20s 1 normal forwards;
        animation: flipover-top .35s linear 20s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-6 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 20s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 20s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 20s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 20s 1 normal forwards;
        animation: flipover-bottom .35s linear 20s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-6 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 24s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 24s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 24s 1 normal forwards;
        -o-animation: flipover-top .35s linear 24s 1 normal forwards;
        animation: flipover-top .35s linear 24s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-7 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 24s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 24s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 24s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 24s 1 normal forwards;
        animation: flipover-bottom .35s linear 24s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-7 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 28s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 28s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 28s 1 normal forwards;
        -o-animation: flipover-top .35s linear 28s 1 normal forwards;
        animation: flipover-top .35s linear 28s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-8 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 28s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 28s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 28s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 28s 1 normal forwards;
        animation: flipover-bottom .35s linear 28s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-8 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 32s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 32s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 32s 1 normal forwards;
        -o-animation: flipover-top .35s linear 32s 1 normal forwards;
        animation: flipover-top .35s linear 32s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-9 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 32s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 32s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 32s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 32s 1 normal forwards;
        animation: flipover-bottom .35s linear 32s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-9 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 36s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 36s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 36s 1 normal forwards;
        -o-animation: flipover-top .35s linear 36s 1 normal forwards;
        animation: flipover-top .35s linear 36s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-10 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 36s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 36s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 36s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 36s 1 normal forwards;
        animation: flipover-bottom .35s linear 36s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-10 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 40s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 40s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 40s 1 normal forwards;
        -o-animation: flipover-top .35s linear 40s 1 normal forwards;
        animation: flipover-top .35s linear 40s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-11 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 40s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 40s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 40s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 40s 1 normal forwards;
        animation: flipover-bottom .35s linear 40s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-11 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 44s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 44s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 44s 1 normal forwards;
        -o-animation: flipover-top .35s linear 44s 1 normal forwards;
        animation: flipover-top .35s linear 44s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-12 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 44s 1 normal forwards;
        animation: flipover-bottom .35s linear 44s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-12 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 48s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 48s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 48s 1 normal forwards;
        -o-animation: flipover-top .35s linear 48s 1 normal forwards;
        animation: flipover-top .35s linear 48s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-13 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 48s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 48s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 48s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 48s 1 normal forwards;
        animation: flipover-bottom .35s linear 48s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-13 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 52s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 52s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 52s 1 normal forwards;
        -o-animation: flipover-top .35s linear 52s 1 normal forwards;
        animation: flipover-top .35s linear 52s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-14 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 52s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 52s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 52s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 52s 1 normal forwards;
        animation: flipover-bottom .35s linear 52s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-14 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 56s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 56s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 56s 1 normal forwards;
        -o-animation: flipover-top .35s linear 56s 1 normal forwards;
        animation: flipover-top .35s linear 56s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-15 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 56s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 56s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 56s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 56s 1 normal forwards;
        animation: flipover-bottom .35s linear 56s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-15 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 60s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 60s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 60s 1 normal forwards;
        -o-animation: flipover-top .35s linear 60s 1 normal forwards;
        animation: flipover-top .35s linear 60s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-16 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 60s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 60s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 60s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 60s 1 normal forwards;
        animation: flipover-bottom .35s linear 60s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-16 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 64s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 64s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 64s 1 normal forwards;
        -o-animation: flipover-top .35s linear 64s 1 normal forwards;
        animation: flipover-top .35s linear 64s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-17 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 64s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 64s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 64s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 64s 1 normal forwards;
        animation: flipover-bottom .35s linear 64s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-17 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 68s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 68s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 68s 1 normal forwards;
        -o-animation: flipover-top .35s linear 68s 1 normal forwards;
        animation: flipover-top .35s linear 68s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-18 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 68s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 68s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 68s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 68s 1 normal forwards;
        animation: flipover-bottom .35s linear 68s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-18 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 72s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 72s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 72s 1 normal forwards;
        -o-animation: flipover-top .35s linear 72s 1 normal forwards;
        animation: flipover-top .35s linear 72s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-19 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 72s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 72s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 72s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 72s 1 normal forwards;
        animation: flipover-bottom .35s linear 72s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-19 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 76s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 76s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 76s 1 normal forwards;
        -o-animation: flipover-top .35s linear 76s 1 normal forwards;
        animation: flipover-top .35s linear 76s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-20 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 76s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 76s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 76s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 76s 1 normal forwards;
        animation: flipover-bottom .35s linear 76s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-20 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 80s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 80s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 80s 1 normal forwards;
        -o-animation: flipover-top .35s linear 80s 1 normal forwards;
        animation: flipover-top .35s linear 80s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-21 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 80s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 80s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 80s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 80s 1 normal forwards;
        animation: flipover-bottom .35s linear 80s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-21 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 84s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 84s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 84s 1 normal forwards;
        -o-animation: flipover-top .35s linear 84s 1 normal forwards;
        animation: flipover-top .35s linear 84s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-22 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 84s 1 normal forwards;
        animation: flipover-bottom .35s linear 84s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-22 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 88s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 88s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 88s 1 normal forwards;
        -o-animation: flipover-top .35s linear 88s 1 normal forwards;
        animation: flipover-top .35s linear 88s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-23 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 88s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 88s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 88s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 88s 1 normal forwards;
        animation: flipover-bottom .35s linear 88s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-23 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 92s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 92s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 92s 1 normal forwards;
        -o-animation: flipover-top .35s linear 92s 1 normal forwards;
        animation: flipover-top .35s linear 92s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-24 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 92s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 92s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 92s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 92s 1 normal forwards;
        animation: flipover-bottom .35s linear 92s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-24 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 96s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 96s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 96s 1 normal forwards;
        -o-animation: flipover-top .35s linear 96s 1 normal forwards;
        animation: flipover-top .35s linear 96s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-25 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 96s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 96s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 96s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 96s 1 normal forwards;
        animation: flipover-bottom .35s linear 96s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-25 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 100s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 100s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 100s 1 normal forwards;
        -o-animation: flipover-top .35s linear 100s 1 normal forwards;
        animation: flipover-top .35s linear 100s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-26 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 100s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 100s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 100s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 100s 1 normal forwards;
        animation: flipover-bottom .35s linear 100s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-26 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 104s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 104s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 104s 1 normal forwards;
        -o-animation: flipover-top .35s linear 104s 1 normal forwards;
        animation: flipover-top .35s linear 104s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-27 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 104s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 104s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 104s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 104s 1 normal forwards;
        animation: flipover-bottom .35s linear 104s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-27 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 108s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 108s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 108s 1 normal forwards;
        -o-animation: flipover-top .35s linear 108s 1 normal forwards;
        animation: flipover-top .35s linear 108s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-28 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 108s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 108s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 108s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 108s 1 normal forwards;
        animation: flipover-bottom .35s linear 108s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-28 .stage-1-icon-top {
        -webkit-animation: flipover-top .35s linear 112s 1 normal forwards;
        -moz-animation: flipover-top .35s linear 112s 1 normal forwards;
        -ms-animation: flipover-top .35s linear 112s 1 normal forwards;
        -o-animation: flipover-top .35s linear 112s 1 normal forwards;
        animation: flipover-top .35s linear 112s 1 normal forwards
    }

    #stage-1.stage-state-default .stage-1-icon-29 .stage-1-icon-bottom {
        -webkit-animation: flipover-bottom .35s linear 112s 1 normal forwards;
        -moz-animation: flipover-bottom .35s linear 112s 1 normal forwards;
        -ms-animation: flipover-bottom .35s linear 112s 1 normal forwards;
        -o-animation: flipover-bottom .35s linear 112s 1 normal forwards;
        animation: flipover-bottom .35s linear 112s 1 normal forwards
    }

    /*#stage-1.stage-state-default .stage-1-icon-29 .stage-1-icon-top {*/
    /*-webkit-animation: flipover-top .35s linear 58s 1 normal forwards;*/
    /*-moz-animation: flipover-top .35s linear 58s 1 normal forwards;*/
    /*-ms-animation: flipover-top .35s linear 58s 1 normal forwards;*/
    /*-o-animation: flipover-top .35s linear 58s 1 normal forwards;*/
    /*animation: flipover-top .35s linear 58s 1 normal forwards*/
    /*}*/
    /*#stage-1.stage-state-default .stage-1-icon-30 .stage-1-icon-bottom {*/
    /*-webkit-animation: flipover-bottom .35s linear 58s 1 normal forwards;*/
    /*-moz-animation: flipover-bottom .35s linear 58s 1 normal forwards;*/
    /*-ms-animation: flipover-bottom .35s linear 58s 1 normal forwards;*/
    /*-o-animation: flipover-bottom .35s linear 58s 1 normal forwards;*/
    /*animation: flipover-bottom .35s linear 58s 1 normal forwards*/
    /*}*/
</style>
