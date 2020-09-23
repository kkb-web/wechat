<template>
    <div class="presaledata-content">
        <wv-spinner v-show="qrCodeWaiting" color="#63acda" type="dot-circle" slot="ft" :size="40" class="qrcode-spin"></wv-spinner>
        <div v-show="showContaines" class="show-content">
            <div @click="handleCollection" v-if="showCollectionBtn"
                 :class="`${isscroll ? 'rightbutton' : 'rightbutton-active'}`">
                <img class="xingxing" src="https://img.kaikeba.com/kke_wx_presaledata_limit_start_blue.png"/>
                <p>收藏</p>
            </div>
            <div v-if="isPc" class="page-container-pc" v-html="pageContainer"></div>
            <div v-else class="page-container-mobile" v-html="pageContainer"></div>
        </div>
        <div v-show="showMask" id="mask-predata">
            <div v-if="showMaskContent == 1" :class="[isPc ? 'popContainer-qrcode-pc' : 'popContainer-qrcode']">
                <div v-if="!isPc">
                    <p class="open-couse-close" @click="closeMask">
                        <img class="closeimg" src="../../assets/img/kkb_wx_opencourse_close.png" alt="close">
                    </p>
                    <!--微信浏览器样式-->
                    <div>
                        <p style="margin-top: 10px">长按二维码，获取资料地址</p>
                        <p class="qr-img-warp">
                            <img :src="tempQrUrl" alt="二维码分享" class="qr-img" v-if="sharerUnionId"
                                 @touchstart.stop="countImgTimesFn" @touchend.stop="mouseupFn">
                            <img :src="qrcodeUrl" alt="二维码" class="qr-img" v-else @touchstart.stop="countImgTimesFn"
                                 @touchend.stop="mouseupFn">
                        </p>
                    </div>
                </div>
                <!--pc端-->
                <div v-else>
                    <div class="qrcode-pc-block">
                        <p class="qrcode-pc-p">微信扫码即可领取资料</p>
                        <img class="qrcode-pc-img" :src="tempQrUrl" alt="二维码"/>
                    </div>
                </div>
            </div>
            <!--移动端非微信浏览器-->
            <div v-else-if="showMaskContent == 2" class="popContainer-notwx">
                <img class="image-top" src="https://img.kaikeba.com/kke_wx_presaledata_limit_false.png">
                <p class="sp1">暂不支持该浏览器打开</p>
                <p class="p-select">可以用以下方式打开</p>
                <div class="opentype">
                    <p>
                        <img class="wechat-open" src="https://img.kaikeba.com/kke_wx_presaledata_limit_wecht.png"/>
                        <span>微信</span>
                    </p>
                    <p class="opentype-p2">
                        <img class="pc-open" src="https://img.kaikeba.com/kke_wx_presaledata_limit_browser.png"/>
                        <span>电脑端浏览器</span>
                    </p>
                </div>
                <p class="p-bottom">请在微信或电脑端浏览器中打开链接并查看资料</p>
            </div>
            <!--微信内收藏-->
            <div v-else-if="showMaskContent == 3" class="popContainer-collection">
                <img class="arrow_right" src="https://img.kaikeba.com/kke_wx_presaledata_limit_arrow_right.png"/>
                <p>点击右上角<img class="shouzhi" src="https://img.kaikeba.com/kke_wx_presaledata_limit_click.png"/>后选择收藏即可</p>
                <img @click="closeMask" class="close"
                     src="https://img.kaikeba.com/kke_wx_presaledata_limit_close01.png"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        guid,
        getToken,
        setToken,
        isMobile,
        setCookie,
        getCookie,
        setLiveUrl,
        filterEmoji,
        livePlayStatus,
        timestampToTime,
        isEmojiCharacter,
        liveUrl,
        routeUrl,
        socketService,
        linkTowww
    } from "../../assets/js/filter";
    import {Authorize} from "../../assets/js/userAuthorize";
    import {contentSocket, disConnect} from "../../assets/js/socket";
    import {urlGetQrcode, getPreSaleDataDetail, getPreSaleContainer,sendvideoWatchTime} from "../../api/api";
    import {share} from "../../assets/js/share";
    import md5 from 'js-md5';

    let timer = null; //视频观看计时器
    let t1 = 0;       //观看时长变量
    let topValue = 0,// 上次滚动条到顶部的距离
        interval = null;//页面滚动定时器
    var authorize = new Authorize();
    export default {
        name: "PreSaleData",
        data() {
            return {
                code: this.$route.query.code,
                endPoint: '',  //环境变量
                isPc: '',     //判断是否pc端
                showMask: false,
                showContaines: false,
                showMaskContent: 0, //遮罩层里的内容切换
                showCollectionBtn: true, //收藏按钮
                isscroll: true,
                time01: 0,
                randomKey: md5(guid()).substring(0, 8),   //随机串
                preSaleDataId: parseInt(this.$route.params.id),  //资料id
                channel: this.$route.query.channel,   //渠道
                tempQrUrl: '',     //临时二维码
                qrcodeUrl: '',       ////二维码地址
                timerQr: null,         //每隔5分钟去请求后端的二维码的定时器
                pageContainer: '',
                sharerUnionId: this.$route.query.sharerUnionId ? this.$route.query.sharerUnionId : null, //分享者unionid
                qrCodeWaiting:true,
                websocketFlag:true   //websocket开关
            }
        },
        created() {
            this.isPc = !isMobile();
        },
        mounted() {
            window.oncontextmenu=function(){return false;}
            window.onkeydown = window.onkeyup = window.onkeypress = function () {
                window.event.returnValue = false;
                return false;
            };
            window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
            window.addEventListener('unload', e => this.unloadHandler(e));
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            if (version !== -1) {
                this.endPoint = 'WX';
                this.ListenerToScroll();
                this.scrollTopFn();
                /**
                 * 含有shareUnionid请求临时二维码
                 */
                // setToken('username', '小蛮子');
                // setToken('unionid', 'oBB9ps5gjG5U5Xzuar0xsStUXi0E');
                // setToken('openid', 'o0IXit5sD40P6oay9Z_3RmC68FyA');
                // this.handleSocketAndGetDetail();
                if (getToken('openid') && getToken('unionid')) {
                    this.handleSocketAndGetDetail();
                } else {
                    if (authorize.isEmpty(this.code)) {
                        authorize.obtainGetCode();
                    } else {
                        authorize.codeGetAccess(this.code, this.handleSocketAndGetDetail);
                    }
                }
            } else {
                //移动端不是微信内置浏览器
                if (isMobile()) {
                    this.handleMobileNotWx();
                    this.showCollectionBtn = false;
                    this.qrCodeWaiting = false;
                } else {
                    //pc端
                    this.endPoint = 'PC';
                    this.showCollectionBtn = false;
                    if(!authorize.isEmpty(getCookie('unionid')) && getCookie(String(this.preSaleDataId)) == this.preSaleDataId){
                        //七天内同一个资料不需要扫码
                        //七天有效期可以续；
                        setCookie('unionid', getCookie('unionid'),604800);
                        setCookie(this.preSaleDataId,this.preSaleDataId,604800);
                        this.getPreSaleDataDetail();
                    }else {
                        this.websocketFlag = false;
                        this.getQrUrlFn();
                        this.refreshQrUrl();
                        contentSocket(this.getPreSaleDataDetail, this.randomKey, socketService()[4], this.preSaleDataId, 'HOME', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                    }
                }
            }
        },
        methods: {
            getPreSaleDataDetail() {
                //调用接口获取资料详情
                let unionId = this.isPc ? getCookie('unionid') : getToken('unionid');
                let sendData = {
                    materialsId: this.preSaleDataId,
                    channelCode: this.channel ? this.channel : this.endPoint.toLowerCase(),
                    unionId: unionId
                };
                /*有分享者unionid就需要sharerUnionId参数，没有就不传*/
                if (this.sharerUnionId) {
                    sendData.sharerUnionId = this.sharerUnionId;
                }
                if (sendData.materialsId && sendData.channelCode) {
                    getPreSaleDataDetail(sendData).then(res => {
                        /*修改页面title*/
                        if(this.timerQr){
                            clearInterval(this.timerQr);
                        }
                        setToken('liveDetail', JSON.stringify(res.data));
                        this.loadPageInfo();
                        this.qrCodeWaiting = false
                    }).catch(err => {
                        console.log(err)
                        this.qrCodeWaiting = false
                    })
                }
            },
            //
            handleSocketAndGetDetail() {
                let unionid = getToken('unionid') || getCookie('unionid') || this.PC_unionid;
                contentSocket(this.getPreSaleDataDetail, unionid, socketService()[4], this.preSaleDataId, 'HOME', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                if (getToken('unionid') || getCookie('unionid') || !authorize.isEmpty(this.PC_unionid)) {
                    this.getPreSaleDataDetail();
                }
            },
            //加载页面
            loadPageInfo() {
                let jsonOpenDetailData = JSON.parse(getToken('liveDetail'));
                if (jsonOpenDetailData.code == 0) {
                    document.title = jsonOpenDetailData.data.name;
                    if (!this.isPc) {
                        share.init(
                            jsonOpenDetailData.data.groupShareTitle,
                            jsonOpenDetailData.data.shareDescription,
                            jsonOpenDetailData.data.shareCoverImage,
                            jsonOpenDetailData.data.friendCircleTitle,
                            getToken('unionid'),
                            this.preSaleDataId,
                            jsonOpenDetailData.data.channelCode);
                    }
                    if (jsonOpenDetailData.data.status === 20004 || jsonOpenDetailData.data.status === 70006) {
                        //pc端不扫码链接websocket
                        if(this.isPc && this.websocketFlag){
                            contentSocket(this.getPreSaleDataDetail, getCookie('unionid'), socketService()[4], this.preSaleDataId, 'HOME', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                        }
                        //展示页面
                        this.showMask = false;
                        this.showContaines = true;
                        let sendData = {
                            materialsId: this.preSaleDataId,
                        };
                        getPreSaleContainer(sendData).then(res => {
                            let that = this;
                            this.pageContainer = res.data;
                            this.$nextTick(function () {
                                that.videoStatus();
                                var blocks = document.getElementsByTagName('video');
                                for (var i=0;i<blocks.length;i++) {
                                    blocks[i].style.background ='#000';
                                    blocks[i].style.backgroundSize='100%';
                                }
                                that.handleauditor();
                            })
                        }).catch(err => {
                            console.log(err)
                        });
                    } else {
                        //展示二维码
                        if (this.isPc) {
                            this.getQrUrlFn();
                            this.refreshQrUrl();
                            //pc端扫码链接websocket
                            contentSocket(this.getPreSaleDataDetail, this.randomKey, socketService()[4], this.preSaleDataId, 'HOME', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                        } else {
                            this.qrcodeUrl = jsonOpenDetailData.data.qrUrl;
                            this.showMask = true;
                            this.showMaskContent = 1;
                            document.body.style.overflow = 'hidden';
                        }
                    }
                }
            },
            /*处理soket返回的状态码*/
            liveActualGetStatus(data) {
                if (getToken('unionid') || getCookie('unionid')) {
                    this.getPreSaleDataDetail();
                }
            },
            /**
             * 处理PC端soket返回的unionid
             * 用Cookie缓存unionid
             * 请求详情handleSocketAndGetDetail
             */
            handlePcWebSocket(data) {
                console.log(data, 'websokcet返回的unionid01');
                console.log(data.unionId, 'websokcet返回的unionid02');
                setCookie('unionid', data.unionId, 604800);
                setCookie(this.preSaleDataId,this.preSaleDataId,604800);
                clearInterval(this.timerQr); //清除定时刷新二维码
                if (!authorize.isEmpty(getCookie('unionid'))) {
                    this.getPreSaleDataDetail();
                }
            },
            /**
             * 重连socket
             * */
            reconnectSocket(data) {
                console.log(data.unionId, 'websokcet返回的unionid02');
                contentSocket(this.getPreSaleDataDetail, getToken('unionid') || getCookie('unionid') || data.unionId, socketService()[4], this.preSaleDataId, 'HOME', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
            },
            /*获取临时二维码api*/
            getQrUrlFn() {
                //获取临时二维码
                let sendData = {
                    courseType: 'materials',
                    materialsId: this.preSaleDataId,
                    qrKey: this.randomKey,
                    channelCode: this.channel ? this.channel : this.endPoint.toLowerCase(),
                    expireSeconds: 300000   //5分钟 = 300秒
                };
                sendData.shareSocialId = this.sharerUnionId ? `${this.sharerUnionId}|` : '';
                let params = `materials|${this.preSaleDataId}|${sendData.channelCode}|${this.randomKey}|${sendData.shareSocialId}&expire=2592000`;
                urlGetQrcode(encodeURI(params)).then(res => {
                    this.qrCodeWaiting = false
                    if (res.data.code == 0) {
                        this.tempQrUrl = res.data.data;
                        this.showMask = true;
                        this.showMaskContent = 1;
                    }
                }).catch(err => {
                    this.qrCodeWaiting = false
                    console.log(err, 'urlGetQrcode')
                })
                //end
            },
            /*规定时间刷新临时二维码*/
            refreshQrUrl() {
                let _this = this;
                this.timerQr = setInterval(function () {
                    _this.getQrUrlFn();
                }, 270000);
            },
            Statistics() {
                t1 += 1;
                console.log('总观看时长', t1);
                this.time01 = t1
            },
            //页面video标签播放状态
            /**
             * 播放时长统计规则：
             * 1、页面全局设置定时器，点击页面任一视频，开启定时器。
             * 2、暂停页面任一视频或任一视频播放结束，清除定时器，上报时长给后台。重置时长。
             * 3、关闭页面、离开页面时，上报时长给后台并重置时长和定时器。
             * 注：1、同一页面只能播放一个视频，不能同时播放多个视频 2、页面切换到后台后视频会自动暂停
             */
            videoStatus() {
                let videoList = document.getElementsByTagName('video');
                console.log(videoList,'count')
                let that = this;
                for (let i = 0; i < videoList.length; i++) {
                    // 视频开始播放-先把定时期停了，防止页面多个视频时，当前视频没有点暂时时，又去点另外一个视频，此时当前视频点状态还是处于播放状态得，但是页面呈现是暂停；
                    videoList[i].onplay = function () {
                        window.clearInterval(timer);
                        timer = setInterval(function () {
                            that.Statistics()
                        }, 1000)
                    };
                    //视频暂停
                    videoList[i].onpause = function () {
                        console.log('暂停');
                        window.clearInterval(timer);
                        that.handleSendvideoWatchTime();
                        t1 = 0;
                    };
                    //视频结束
                    videoList[i].onended = function () {
                        console.log(i, '结束');
                        window.clearInterval(timer)
                        that.handleSendvideoWatchTime();
                        t1 = 0;
                    }
                    videoList[i].setAttribute("controlsList", "nodownload");
                }
            },
            //发送观看时长
            handleSendvideoWatchTime(){
                let send = {
                    materialsId:this.preSaleDataId,
                    channelCode:this.channel ? this.channel : this.endPoint.toLowerCase(),
                    watchTime:t1,
                    unionId:getCookie('unionid') || getToken('unionid')
                };
                sendvideoWatchTime(send)
            },
            //监听页面滚动函数
            ListenerToScroll() {
                let that = this;
                window.addEventListener('scroll', function () {
                    that.isscroll = false;
                })
            },
            // 开始滚动执行函数
            scrollTopFn() {
                let that = this;
                document.onscroll = function () {
                    if (interval == null)// 未发起时，启动定时器，1秒1执行
                        interval = setInterval(function () {
                            that.scrollTopHandle()
                        }, 1000);
                    topValue = document.documentElement.scrollTop;
                }
            },
            //停止滚动执行函数
            scrollTopHandle() {
                this.isscroll = true;
                clearInterval(interval);
                interval = null;
            },


            //关闭遮罩层
            closeMask() {
                this.showMask = false;
                this.showContaines = true;
                document.body.style.overflow = 'scroll'; //页面恢复滑动
                this.handleauditor()
            },
            //点击收藏按钮展示遮罩层
            handleCollection() {
                this.showMask = true;
                this.showMaskContent = 3;
                this.showContaines = false
                document.body.style.overflow = 'hidden'; //页面不能滑动
            },
            //处理移动端非微信浏览器
            handleMobileNotWx() {
                this.showContaines = false;
                this.showMask = true;
                this.showMaskContent = 2;
                document.body.style.overflow = 'hidden'; //页面不能滑动
            },
            //关闭页面时执行同步请求
            sendWatchDurtion(){
                let baseURL = '';
                if (process.env.NODE_ENV === 'development' || window.location.href.indexOf('wxtest') !== -1) {
                    baseURL = '/opencourseapi';
                } else {
                    if (window.location.href.indexOf('wxpre') !== -1) {
                        console.log('pre环境');
                        baseURL = '/api';
                    } else if (window.location.href.indexOf('wxdev2') !== -1) {
                        console.log('pre环境');
                        baseURL = '/opencourseapi';
                    } else if (window.location.href.indexOf('wxdev') !== -1) {
                        console.log('pre环境');
                        baseURL = '/opencourseapi';
                    } else {
                        console.log('正式环境');
                        baseURL = '/opencourseapi';
                    }
                }
                let send = {
                    materialsId:this.preSaleDataId,
                    channelCode:this.channel ? this.channel : this.endPoint.toLowerCase(),
                    watchTime:t1,
                    unionId:getCookie('unionid') || getToken('unionid')
                };
                var xhr=new XMLHttpRequest();
                xhr.open("GET",baseURL+ '/materials/watch/' + send.materialsId + '/' + send.channelCode + '/' + send.watchTime +'/' + send.unionId,false);
                xhr.onreadystatechange = function(){
                    if(xhr.readyState == 4 && xhr.status == 200){
                        console.log(xhr.responseText);
                    }
                }
                xhr.send(null);
            },
            beforeunloadHandler(){
                this._beforeUnload_time=new Date().getTime();
            },
            unloadHandler(e){
                this._gap_time=new Date().getTime()-this._beforeUnload_time;
                debugger
                //判断是窗口关闭还是刷新
                if(this._gap_time<=5){
                    //如果是登录状态，关闭窗口前，移除用户
                    this.sendWatchDurtion();
                }
            },
            //处理后台内容
            handleauditor(){
                let imglist = document.getElementsByTagName('img');
                console.log(imglist);
                for(let i=0;i<imglist.length;i++){
                    console.log(imglist[i].width,"1212");
                    if(imglist[i].width > 300){
                        imglist[i].style.width='100%'
                    }
                }
            },
        },
        beforeDestroy() {
            disConnect();
            window.clearInterval(timer)
            clearInterval(this.timerQr);
            t1 = 0;
        },
        destroyed(){
            window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
            window.removeEventListener('unload', e => this.unloadHandler(e))
        }
    }
</script>

<style scoped>
    >>> video::-internal-media-controls-download-button {
        display:none;
    }
    >>> video::-webkit-media-controls-enclosure {
        overflow:hidden;
    }
    >>> video::-webkit-media-controls-panel {
        width: calc(100% + 50px);
    }
    >>> video {
        width: 100% !important;
    }
    >>> a{
        color: blue;
    }
    >>> img{
        /*width: 100% !important;*/
    }
    >>> p{
        width: 100%!important;
        box-sizing: border-box;
        word-wrap: break-word;
        word-break: break-all;
    }
    .xingxing{
        width: 19px!important;
        height: 18.375px!important;
    }
    .closeimg{
        margin-right: 25px;
    }
    .presaledata-content {
        width: 100%;
        /*padding: 15px 15px 0 15px;*/
        box-sizing: border-box;
        padding-bottom: 20px;
    }

    .show-content {
        width: 100%;
    }

    .page-container-pc {
        width: 100%;
        max-width: 375px;
        padding: 0 15px;
        margin: 0 auto;
    }

    .page-container-mobile {
        width: 100%;
        padding: 0 15px;
        box-sizing: border-box;
        /*max-width: 375px;*/
    }

    #mask-predata {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.9);
        z-index: 999;
    }

    .rightbutton {
        position: fixed;
        bottom: 70px;
        right: 10px;
        width: 55px;
        height: 55px;
        border-radius: 50px;
        text-align: center;
        background: #fff;
        box-shadow: 0 0 11px 0 rgba(0, 0, 0, .1);
        z-index: 100000;
        transition: all .4s;
        z-index: 888;
    }

    .rightbutton img {
        width: 19px;
        height: 18.39px;
        vertical-align: -webkit-baseline-middle;
    }

    .rightbutton p {
        font-size: 12px;
        color: #4F4F4F;
        margin-top: 2px;
    }

    .rightbutton-active {
        position: fixed;
        bottom: 70px;
        right: 0px;
        width: 80px;
        height: 25px;
        text-align: center;
        border-bottom-left-radius: 5px;
        border-top-left-radius: 5px;
        z-index: 100000;
        transition: all .4s;
        right: -80px;
        z-index: 888;
    }

    .rightbutton-active img {
        width: 19px;
        height: 18.39px;
        vertical-align: -webkit-baseline-middle;
    }

    .rightbutton-active p {
        font-size: 12px;
        color: #4F4F4F;
        margin-top: 2px;
    }

    .qrcode-pc-block {
        width: 240px;
        height: 268px;
        background: #fff;
        border-radius: 3px;
        box-sizing: border-box;
        margin: 0 auto;
        text-align: center;
        padding-top: 36px;
        font-size: 0;
    }

    .qrcode-pc-img {
        width: 150px!important;
        height: 150px!important;
    }

    .qrcode-pc-p {
        color: #494949;
        font-size: 14px;
        margin-bottom: 18px;
    }

    .popContainer-qrcode {
        width: 74%;
        height: 304px;
        background: #fff;
        position: absolute;
        top: -10%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
    }

    .popContainer-qrcode-pc {
        width: 416px;
        height: 304px;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
    }


    .popContainer-notwx {
        width: 74%;
        height: 500px;
        position: absolute;
        top: 0px;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
        margin-top: 44px;
    }

    .popContainer-notwx img.image-top {
        width: 49px!important;
        height: 49px!important;
        text-align: center;
        vertical-align: top;
        margin-bottom: 12px;
    }

    .popContainer-notwx p.sp1 {
        font-size: 14px;
        color: #fff;
        margin-bottom: 89px;
    }

    .p-select {
        font-size: 14px;
        color: #00AFF2;
        margin-bottom: 16px;
    }

    .opentype {
        width: 100%;
    }

    .opentype p {
        width: 100%;
        display: inline;
    }

    .opentype-p2 {
        margin-left: 34px;
    }

    .opentype p img {
        width: 21px;
        height: 21px;
    }

    .opentype p span {
        font-size: 13px;
        color: #fff;
        vertical-align: super;
    }

    .p-bottom {
        font-size: 13px;
        color: #fff;
        margin-top: 5px;
    }

    .popContainer-collection {
        width: 74%;
        height: 80%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        text-align: right;
        box-sizing: border-box;
        margin-top: 23px;
    }

    .arrow_right {
        width: 19px!important;
        height: 19px!important;
        text-align: right;
        vertical-align: top;
        margin-bottom: 12px;
    }

    .popContainer-collection p {
        font-size: 14px;
        color: #ffffff;
        text-align: right;
    }

    .popContainer-collection p img {
        width: 33px;
        height: 36px;
        vertical-align: text-top;
        margin: 0 6px;
    }

    .popContainer-collection img.close {
        width: 14px!important;
        height: 14px!important;
        text-align: center;
        position: absolute;
        left: 49%;
        bottom: 0;

    }

    /*兼容pc端样式*/
    @media screen and (min-width: 640px) {
        /*遮罩层*/
        #mask .popContainer-qrcode {
            position: absolute;
            width: 280px;
            height: 300px;
            background: #fff;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border-radius: 4px;
        }

        #mask .popContainer-notwx {
            position: absolute;
            width: 280px;
            height: 300px;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            border-radius: 4px;
        }
    }

    .open-couse-close {
        text-align: right;
        height: 30px;
        margin: 14px 14px 0 0;
    }

    .open-couse-close img {
        width: 12px;
        height: 12px;
    }

    .qr-img-warp img {
        width: 150px!important;
        height: 150px!important;
        margin: 20px auto;
    }
    .qrcode-spin{
        margin-left: calc(50% - 20px);
        position: fixed;
        top: 200px;
        left: 0;
        z-index: 999999;
    }
    .shouzhi{
        width: 33px!important;
        height: 36px!important;
    }
    .wechat-open{
        width: 21px!important;
        height: 21px!important;
    }
    .pc-open{
        width: 21px!important;
        height: 21px!important;
    }
</style>
