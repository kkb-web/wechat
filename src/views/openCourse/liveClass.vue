<template>
    <div id="contains" class="contains">
        <wv-spinner v-show="qrCodeWaiting" color="#63acda" type="dot-circle" slot="ft" :size="40" class="qrcode-spin"></wv-spinner>
        <iframe id="show-iframe" v-if="isPc ? true : showIframe" allowfullscreen="true" frameborder="0" :src="liveUrl"></iframe>
        <div v-if="isLoading && !isPc" class="loading-style">
            <img src="../../assets/img/bg_live_num_large.png" alt="">
            <p>有点拥挤，请刷新重试</p>
            <button @click="reloadFn">刷新</button>
        </div>
        <div v-if="networkError && !isPc" class="loading-style">
            <img src="../../assets/img/live_class_network_error.png" alt="">
            <p>加载失败，请检查网络设置</p>
            <button @click="reloadFn">重新加载</button>
        </div>
        <!--<div style="height: 100%">-->
            <!--<iframe v-if="isPc ? true : showIframe" id="show-iframe" width="100%" height="100%" frameborder="0"-->
                    <!--allowfullscreen="true"-->
                    <!--webkitallowfullscreen="true"-->
                    <!--mozallowfullscreen="true" oallowfullscreen="true" msallowfullscreen="true"-->
                    <!--:src="liveUrl"></iframe>-->
            <div v-show="showPopContainer" :class="[isPc ? 'live-bg-pc' : 'live-bg']">
                <div id="mask">
                    <!--statusFlag为0时是倒计时，已报名-->
                    <div v-if="statusFlag == 0" :class="[isPc ? 'popContainer-countdown-pc' : 'popContainer-countdown']">
                        <div class="countdown-pc" v-if="isPc">
                            <p style="margin-top: 48px;height: 13px;line-height: 12px;font-size: 14px; color: #494949">
                                距离开播还剩：</p>
                            <div class="countdown-content">
                                <img style="width: 34px;height: 31px" class="left img"
                                     src="../../assets/img/kkb_wx_opencourse_clock.png"/>
                                <div class="countdown-clock" style="margin-top: 22px">
                                    <span class="clock-top-pc" style="margin-left: 20.4px;">{{data.days}}</span>
                                    <span class="span-time">天</span>
                                    <span class="clock-top-pc">{{data.hourse}}</span>
                                    <span class="span-time">时</span>
                                    <span class="clock-top-pc">{{data.minute}}</span>
                                    <span class="span-time">分</span>
                                    <span class="clock-top-pc">{{data.second}}</span>
                                    <span class="span-time">秒</span>
                                </div>
                            </div>
                        </div>
                        <div class="countdown-moble" v-else>
                            <p style="margin-top: 35px;height: 13px;line-height: 12px">距离开播还剩：</p>
                            <div class="countdown-content">
                                <img class="left img" src="../../assets/img/kkb_wx_opencourse_clock.png"/>
                                <div class="countdown-clock">
                                    <span class="clock-top" style="margin-left: 5px">{{data.days}}</span>
                                    <span class="span-time-moble">天</span>
                                    <span class="clock-top">{{data.hourse}}</span>
                                    <span class="span-time-moble">时</span>
                                    <span class="clock-top">{{data.minute}}</span>
                                    <span class="span-time-moble">分</span>
                                    <span class="clock-top">{{data.second}}</span>
                                    <span class="span-time-moble">秒</span>
                                </div>
                            </div>
                        </div>
                        <p @click="linkToOpencourseList" :class="`${isPc ? 'guidefrontpc' : 'guidefront'}`">先去看看其他精彩公开课  ></p>
                    </div>
                    <!--statusFlag为1时是二维码，未报名-->
                    <div v-else-if="statusFlag == 1" :class="[isPc ? 'popContainer-qrcode-pc' : 'popContainer-qrcode']">
                        <div v-if="isPc">
                            <div class="qrcode-pc-block">
                                <p class="qrcode-pc-p">微信扫码即可观看</p>
                                <img class="qrcode-pc-img" :src="tempQrUrl" alt="二维码"/>
                            </div>
                        </div>
                        <div v-else>
                            <img :src="tempQrUrl" alt="二维码" class="qr-img" v-if="sharerUnionId">
                            <img :src="qrcodeUrl" alt="二维码" class="qr-img" v-else>
                            <p>长按识别二维码，获取上课地址</p>
                        </div>
                    </div>
                    <!--statusFlag为2时是直播状态，已报名-->
                    <div v-else-if="statusFlag == 2">
                        <div v-if="liveStatus ==2" :class="[isPc ? 'live-status-generate-pc' : 'live-status-generate']">
                            <img src="../../assets/img/kkb_wx_opencourse_video.png"/>
                            <p style="margin-top: 17px">直播结束，回放视频生成中</p>
                            <p>......</p>
                            <p @click="linkToOpencourseList" style="color: #fff;" :class="`${isPc ? 'guidepc' : 'guide'}`">先去看看其他精彩公开课  ></p>
                        </div>
                        <div v-else-if="liveStatus == 4" :class="[isPc ? 'live-status-lower-pc' : 'live-status-lower']">
                            <img src="../../assets/img/kkb_wx_opencourse_video02.png"/>
                            <p style="margin-top: 15px">该课程已下架</p>
                        </div>
                    </div>
                    <!--statusFlag5时，表示此课程禁止报名-->
                    <div v-else-if="statusFlag == 5" :class="[isPc ? 'live-status-generate-pc' : 'live-status-generate']">
                        <p class="limit-p1">该课程的报名通道已关闭</p>
                        <p class="limit-p2">关注「开课吧服务号」获取课程资讯</p>
                    </div>
                </div>
            </div>
        <!--</div>-->

    </div>
</template>

<script>
    import {urlGetOpenCourseInfo, urlGetQrcode,urlUserInfoByUnion} from "../../api/api";
    import {contentSocket, disConnect} from "../../assets/js/socket";
    import {Authorize} from "../../assets/js/userAuthorize";
    import {share} from "../../assets/js/share";
    import {Toast} from 'we-vue';
    import md5 from 'js-md5';
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
        linkTowww,
        isIOS
    } from "../../assets/js/filter";

    //实例化 authorize
    var authorize = new Authorize();

    export default {
        data(){
            return {
                isLoading: false,
                networkError: false,
                PC_unionid:this.$route.query.PC_unionid,                //study传过来的uinonid
                channel: this.$route.query.channel, //url携带的channel this.$route.query.channel
                sharerUnionId: this.$route.query.sharerUnionId ? this.$route.query.sharerUnionId : null, //分享者unionid
                openCourseId: parseInt(this.$route.params.id), //课程id
                code: this.$route.query.code, //获取授权code
                liveUrl: undefined,             //直播、回放地址
                liveStatus: '',         //直播间状态标识
                liveStatusObj: {},     //接口返回的直播状态
                shareChannel: '',     //分享渠道
                username: '',        //微信昵称
                isSignUp: '',       //是否报名
                qrcodeUrl: '',     //二维码地址
                showIframe: false, //ifrme展示
                showPopContainer: false,     //背景蒙层
                showQrcodePc: false,       //pc端二维码展示状态
                statusFlag: -1,           // 0 -->倒计时  1 -->二维码 2
                isPc: '',                // 是否pc端
                timer: '',              //倒计时ID
                timeStamp: '',         //直播时间
                openid: '',           //用户openid
                data: {              //倒计时天、时、分、秒
                    days: '00',
                    hourse: '00',
                    minute: '00',
                    second: '00'
                },
                randomKey: md5(guid()).substring(0, 8),        //生成8位随机数 by zqy
                timerQr: null,         //每隔5分钟去请求后端的二维码的定时器
                tempQrUrl: null,      //临时二维码
                websocketFlag: true,  // websocket开关
                endPoint: null,      //判断是哪个渠道，
                qrCodeWaiting:true,
                loadingPageTimer: null
            }
        },
        components: {},
        created(){
            disConnect();
            // this.iosLayout();
            this.isPc = !isMobile();
            /**
             * 如果含有shareUnionid、从官网进来、以及直接输入地址进入页面 则是请求临时二维码
             */
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            if (version !== -1) {
                this.endPoint = 'WX';
                // this.liveUrl = 'https://view.csslcloud.net/api/view/index?roomid=9C5D9ADAF7A0B22C9C33DC5901307461&userid=7488FF1B7810DE53'
                /**
                 * 含有shareUnionid请求临时二维码
                 */
                if (this.sharerUnionId) {
                    this.getQrUrlFn();
                    this.refreshQrUrl();
                }
                /*设置3s后未加载展示拥挤页*/
                this.loadingPageTimer = setTimeout(() => {
                    this.isLoading = true;
                    this.qrCodeWaiting = false;
                }, 3000);
                // setToken('username', '小蛮子');
                // setToken('unionid', 'oBB9ps5gjG5U5Xzuar0xsStUXi0E');
                // setToken('openid', 'o0IXit5sD40P6oay9Z_3RmC68FyA');
                // this.handleSocketAndGetDetail();
                if (getToken('living-openid') && getToken('living-unionid')) {
                    authorize.getUserInfo(getToken('living-openid'));
                    this.auth_cc();
                    this.handleSocketAndGetDetail();
                } else {
                    if (authorize.isEmpty(this.code)) {
                        authorize.obtainGetCode();
                    } else {
                        authorize.codeGetAccess(this.code, this.handleSocketAndGetDetail);
                    }
                }
            } else {
                //不是微信内置浏览器
                if (isMobile()) {
                    window.location = 'http://study.kaikeba.com/wxlimit'
                } else {
                    this.endPoint = 'PC';
                    this.auth_cc();
                    // setCookie('living-unionid', 'oBB9ps5gjG5U5Xzuar0xsStUXi0E', 171000);
                    /**
                     * 如果Cookie中没有unionid，则链接websocket获取unionid，
                     * handleSocketAndGetDetail方法中不再链接websocket；
                     * Cookie中有unionid，直接请求详情,
                     * getOpenCoursDetail方法中链接websocket获取直播状态；
                     * PC_unionid是从study传过来的；有的话直接请求详情
                     */
                    if (authorize.isEmpty(getCookie('living-unionid')) && authorize.isEmpty(this.PC_unionid)) {
                        this.showPopContainer = true;
                        this.websocketFlag = false;
                        this.getQrUrlFn();
                        this.refreshQrUrl();
                        contentSocket(this.getOpenDetail, this.randomKey, socketService()[0], this.openCourseId, 'CLASSROOM', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                    } else {
                        //第二次及以后进来执行的方法  Cookie中有unionid，链接socket，获取直播状态
                        //此处判断username是因为url上有unionid的话需要获取username
                        if (getToken("username")) {
                            this.handleSocketAndGetDetail();
                        } else {
                            this.getUserInfoByUnionid()
                        }
                    }
                }
            }
        },
        mounted(){

        },
        methods: {
            getIsIphonex () {
                var u = navigator.userAgent;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                if (isIOS) {
                    if (screen.height == 812 && screen.width == 375) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            //刷新当前页面
            reloadFn(){
                location.reload();
            },

            /**
             * 处理PC端soket返回的unionid
             * 用Cookie缓存unionid
             * 请求详情handleSocketAndGetDetail
             */
            handlePcWebSocket(data){
                console.log(data, 'websokcet返回的unionid01');
                console.log(data.unionId, 'websokcet返回的unionid02');
                setCookie('living-unionid', data.unionId, 171000);
                if (!authorize.isEmpty(getCookie('living-unionid'))) {
                    if(getToken("username")){
                        this.handleSocketAndGetDetail();
                    }else {
                        this.getUserInfoByUnionid()
                    }
                }
            },
            /*获取临时二维码api*/
            getQrUrlFn(){
                //获取临时二维码
                let sendData = {
                    courseType:'open',
                    courseId: this.openCourseId,
                    qrKey: this.randomKey,
                    channelCode: this.channel ? this.channel : this.endPoint.toLowerCase(),
                    expireSeconds: 300000   //5分钟 = 300秒
                };
                sendData.shareSocialId = this.sharerUnionId ? `${this.sharerUnionId}|` : '';
                let params = `open|${this.openCourseId}|${sendData.channelCode}|${this.randomKey}|${sendData.shareSocialId}&expire=2592000`;
                urlGetQrcode(encodeURI(params)).then(res => {
                    if (res.data.code == 0) {
                        this.tempQrUrl = res.data.data;
                        this.statusFlag = 1;
                        this.qrCodeWaiting = false;
                    }
                }).catch(err => {
                    console.log(err, 'urlGetQrcode')
                })
                //end
            },
            /*规定时间刷新临时二维码*/
            refreshQrUrl(){
                let _this = this;
                this.timerQr = setInterval(function () {
                    _this.getQrUrlFn();
                }, 270000);
            },
            //获取公开课详情
            handleSocketAndGetDetail(){
                //先连接socket
                let unionid = this.isPc ? getCookie('living-unionid') || this.PC_unionid : getToken('living-unionid') || getCookie('living-unionid') || this.PC_unionid
                if (this.websocketFlag) {
                    contentSocket(this.getOpenDetail, unionid, socketService()[0], this.openCourseId, 'CLASSROOM', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
                }
                if (getToken('living-unionid') || getCookie('living-unionid') || !authorize.isEmpty(this.PC_unionid)) {
                    this.getOpenDetail();
                }
            },
            getOpenDetail(){
                let unionId = this.isPc ? getCookie('living-unionid') || this.PC_unionid : getToken('living-unionid');
                let sendData = {
                    courseId: this.openCourseId,
                    pageCode: 'CLASSROOM',
                    channelCode: this.channel ? this.channel : this.endPoint.toLowerCase(),
                    endpoint: this.endPoint,
                    unionId: unionId
                };
                /*有分享者unionid就需要sharerUnionId参数，没有就不传*/
                if (this.sharerUnionId) {
                    sendData.sharerUnionId = this.sharerUnionId;
                };
                if (sendData.courseId && sendData.pageCode && sendData.endpoint) {
                    urlGetOpenCourseInfo(sendData).then(res => {
                        /*修改页面title*/
                        setToken('liveDetail', JSON.stringify(res.data));
                        this.loadPageInfo();
                        this.qrCodeWaiting = true;
                    }).catch(err => {
                        let that = this;
                        this.isLoading = false;
                        clearTimeout(this.loadingPageTimer);
                        setTimeout(function () {
                            that.qrCodeWaiting = false
                        },1000);
                        console.log(err.message, "========报错");
                        if (err.indexOf('Network Error') !== -1) {
                            this.networkError = true;
                        } else if (err.response.status === 500 || err.response.status === 502) {
                            if (getToken('liveDetail')) {
                                this.loadPageInfo();
                            }
                        }
                    })
                }
            },

            /*加载页面信息*/
            loadPageInfo(){
                let that = this;
                let jsonOpenDetailData = JSON.parse(getToken('liveDetail'));
                if (jsonOpenDetailData.code == 0) {
                    document.title = jsonOpenDetailData.data.name;
                    /*分享*/
                    if(!this.isPc){
                        share.init(
                            jsonOpenDetailData.data.groupShareTitle,
                            jsonOpenDetailData.data.shareDescription,
                            jsonOpenDetailData.data.shareCoverImage,
                            jsonOpenDetailData.data.friendCircleTitle,
                            getToken('living-unionid'),
                            this.openCourseId,
                            jsonOpenDetailData.data.channelCode);
                    }
                    let currentStatus = this.isPc ? 20004 || 20003 : 20004;
                    if (jsonOpenDetailData.data.status === currentStatus) {
                        /*不弹出二维码*/
                        this.liveStatusObj = livePlayStatus(jsonOpenDetailData.data.liveStatus);
                        this.checkLiveStatus(jsonOpenDetailData.data);
                        /*不展示二维码的时候要把定时器关闭*/
                        clearInterval(this.timerQr);
                    } else {
                        if(jsonOpenDetailData.data.limit == 0){
                            this.showPopContainer = true;
                            this.isLoading = false;
                            clearTimeout(this.loadingPageTimer);
                            setTimeout(function () {
                                that.qrCodeWaiting = false;
                            },0)
                            /*弹出二维码*/
                            if (this.isPc) {
                                this.getQrUrlFn();
                                this.refreshQrUrl();
                            } else {
                                this.qrcodeUrl = jsonOpenDetailData.data.qrUrl;
                                this.statusFlag = 1;
                            }
                        }else {
                            let that = this;
                            this.isLoading = false;
                            clearTimeout(this.loadingPageTimer);
                            this.showPopContainer = true;
                            this.statusFlag = 5;
                            setTimeout(function () {
                                that.qrCodeWaiting = false;
                            },0)
                        }
                    }
                } else if (jsonOpenDetailData.code == 10001) {
                    this.isLoading = false;
                    clearTimeout(this.loadingPageTimer);
                    setTimeout(function () {
                        that.qrCodeWaiting = false;
                    },0)
                    console.log("数据不存在")
                } else if (jsonOpenDetailData.code == 20005) {
                    this.isLoading = false;
                    clearTimeout(this.loadingPageTimer);
                    setTimeout(function () {
                        that.qrCodeWaiting = false;
                    },0)
                    if (authorize.isEmpty(this.code)) {
                        authorize.obtainGetCode();
                    } else {
                        authorize.codeGetAccess(this.code, this.handleSocketAndGetDetail);
                    }
                } else {
                    /*处理课程已下架*/
                    this.showPopContainer = true;
                    this.statusFlag = 2;
                    this.liveStatus = 4;
                    this.isLoading = false;
                    clearTimeout(this.loadingPageTimer);
                    setTimeout(function () {
                        that.qrCodeWaiting = false;
                    },0)
                }
            },

            /*处理soket返回的状态码*/
            liveActualGetStatus(data){
                if (getToken('living-unionid') || getCookie('living-unionid')) {
                    this.getOpenDetail();
                }
                // this.getOpenDetail()
                // this.liveStatusObj = livePlayStatus(data);
                // let socketData = JSON.parse(getToken('liveDetail'));
                // this.checkLiveStatus(socketData.data)
            },
            /*直播时cc授权代码*/
            auth_cc(){
                let head = document.getElementsByTagName('head')[0],
                    scripts = document.createElement('script');
                scripts.type = 'text/javascript';
                scripts.src = 'https://view.csslcloud.net/js/_fix_.js';
                head.appendChild(scripts);
            },
            classinAuth() {
                let head = document.getElementsByTagName('head')[0],
                    scripts = document.createElement('script');
                scripts.type = 'text/javascript';
                scripts.src = 'https://www.eeo.cn/js/live/eeolive_fix.js';
                head.appendChild(scripts);
            },
            classinStyle() {
                let head = document.getElementsByTagName('head')[0],
                    scripts = document.createElement('script');
                scripts.type = 'text/javascript';
                scripts.src = 'https://img.kaikeba.com/classin_rem.js';
                head.appendChild(scripts);
            },
            iosLayout(){
                let head = document.getElementsByTagName('head')[0],
                    scripts = document.createElement('script'),
                    meta = document.getElementsByTagName('meta')[1];
                meta.name = '';
                scripts.type = 'text/javascript';
                scripts.src = 'https://img.kaikeba.com/lib.js';
                head.appendChild(scripts)
            },
            /*处理直播间学员名称*/
            setUserName(){
                this.username = getToken("username");
                if (isEmojiCharacter(getToken("username"))) {
                    this.username = filterEmoji(getToken("username"));
                }
                this.checkUserName();
            },
            /*处理直播间学员名称*/
            checkUserName(){
                let usernameid = Math.floor(Math.random() * 100);
                if (this.username === " " || this.username === 'undefined' || this.username === "") {
                    this.username = '学员' + usernameid
                }
            },

            /*根据url不同加载不同js*/
            judgeUrl(url) {
                if (liveUrl(url)) {
                    if (isMobile()) {
                        // this.iosLayout();
                    }
                    //先删除自己的meta，再加载classin的meta
                    let head = document.getElementsByTagName('head')[0];
                    let meta = document.getElementsByTagName('meta');
                    head.removeChild(meta[1]);
                    this.classinStyle();
                    this.classinAuth();
                }
            },

            /*处理直播链接*/
            getLivingUrl(data){
                let that = this;
                this.judgeUrl(data);
                setTimeout(function () {
                    that.liveUrl = setLiveUrl(data, that.username);
                },0)
            },

            /*处理获取回放链接*/
            getReplayUrl(data){
                let that = this;
                this.judgeUrl(data);
                setTimeout(function () {
                    that.liveUrl = setLiveUrl(data, that.username);
                },0)
            },

            /**
             *  处理直播状态
             *  0 ——直播前，需处理：开启倒计时、处理用户昵称，处理直播链接；
             *  1 ——直播中，，需处理：直接展示iframe；
             *  2 ——直播结束，生成回放中，需处理：出现视屏生成中的弹层；
             *  3 ——直播回放，，需处理：直接展示iframe；
             */
            checkLiveStatus(data){
                let that = this;
                this.setUserName(getToken("username"));
                setTimeout(function () {
                    that.getLivingUrl(data.liveUrl);
                },1100);
                this.isLoading = false;
                clearTimeout(this.loadingPageTimer);
                if (this.liveStatusObj.status == 0) {
                    /*直播前，展示倒计时*/
                    setTimeout(function () {
                        that.qrCodeWaiting = false;
                    },200)
                    this.showIframe = false;
                    this.showPopContainer = true;
                    this.statusFlag = 0;
                    this.timeStamp = data.schedule;
                    this.countTime();
                } else if (this.liveStatusObj.status == 1) {
                    /*直播中，展示iframe*/
                    that.showPopContainer = false;
                    that.showIframe = true;
                    that.qrCodeWaiting = false;
                    setTimeout(function () {
                        that.showPopContainer = false;
                        that.showIframe = true;
                        that.qrCodeWaiting = false;
                    },1000)
                } else if (this.liveStatusObj.status == 2) {
                    /*处理---直播结束，回放生成中*/
                    setTimeout(function () {
                        that.qrCodeWaiting = false;
                    },200)
                    this.showIframe = false;
                    this.showPopContainer = true;
                    this.statusFlag = 2;
                    this.liveStatus = 2;
                    this.qrCodeWaiting = false
                } else if (this.liveStatusObj.status == 3) {
                    /*处理---观看精彩直播回放*/
                    setTimeout(function () {
                        that.getReplayUrl(data.replayUrl);
                    },1200);
                    this.showIframe = true;
                    this.showPopContainer = false;
                    this.qrCodeWaiting = false;
                } else {
                    /*处理直播状态接口的其他msg*/
                    console.log("aa");
                }
                setTimeout(function () {
                    that.qrCodeWaiting = false;
                },1000)
            },
            /*倒计时*/
            countTime(){
                //获取当前时间
                let date = new Date(),
                    now = date.getTime(),
                    //设置截止时间
                    endDate = new Date(timestampToTime(this.timeStamp).replace(/-/g, "/")),
                    end = endDate.getTime(),
                    //时间差
                    leftTime = end - now;
                //定义变量 d,h,m,s保存倒计时的时间
                if (leftTime > 0) {
                    this.data.days = Math.floor(leftTime / 1000 / 60 / 60 / 24);
                    this.data.hourse = Math.floor(leftTime / 1000 / 60 / 60 % 24);
                    this.data.minute = Math.floor(leftTime / 1000 / 60 % 60);
                    this.data.second = Math.floor(leftTime / 1000 % 60);
                    this.data.days = this.data.days < 10 ? '0' + this.data.days : this.data.days;
                    this.data.hourse = this.data.hourse < 10 ? '0' + this.data.hourse : this.data.hourse;
                    this.data.minute = this.data.minute < 10 ? '0' + this.data.minute : this.data.minute;
                    this.data.second = this.data.second < 10 ? '0' + this.data.second : this.data.second;
                } else {
                    /*去除遮罩层，展示直播iframe*/
                    this.statusFlag = -1;
                    this.showIframe = true;
                    this.showPopContainer = false;
                    clearTimeout(this.timer);
                    return false;
                }
                this.timer = setTimeout(this.countTime, 1000);
            },
            /*获取用户信息unionid机制*/
            /**
             * 在pc端的直播间，当没有username的时候，会请求一次，然后缓存username.
             * 下次进入到直播间，缓存中有username，就不再请求这个接口;
             */
            getUserInfoByUnionid(){
                let unionid = getCookie('living-unionid') || this.PC_unionid;
                let sendData = {
                    unionid: unionid
                };
                urlUserInfoByUnion(sendData).then(res =>{
                    if (!res || res === 'undefined') {
                        if (this.count > 3) {
                            Toast({
                                duration: 1500,
                                message: '获取用户信息失败，请稍后再试！'
                            })
                        } else {
                            this.getUserInfo();
                            this.count++;
                        }
                    }
                    //获取用户信息，在支付页面的错误显示中使用
                    setToken('username', res.data.nickname);
                    setToken('headimgurl', res.data.headimgurl);
                    this.handleSocketAndGetDetail();
                }).catch(err =>{
                    console.log('获取用户信息失败unionid',err)
                })
            },
            /**
            * 重连socket
            * */
            reconnectSocket (data) {
                console.log(data.unionId, 'websokcet返回的unionid02');
                let unionId = this.isPc ? getCookie('living-unionid') || this.PC_unionid || data.unionId : getToken('living-unionid') || getCookie('living-unionid') || this.PC_unionid || data.unionId
                contentSocket(this.getOpenDetail, unionId, socketService()[0], this.openCourseId, 'CLASSROOM', this.endPoint, this.liveActualGetStatus, this.handlePcWebSocket, this.reconnectSocket);
            },
            linkToOpencourseList(){
                if(this.isPc){
                    window.location= linkTowww();
                }else {
                    this.$router.push(routeUrl() +`opencourseall`)
                }
            }
        },
        beforeDestroy () {
            disConnect();
            clearInterval(this.timerQr);
        }
    }
</script>

<style scoped>
    .limit-p1{
        color: rgb(249,170,98) !important;
        font-size: 16px!important;
        margin-top: 40px;
        margin-bottom: 15px;
    }
    .limit-p2{

    }
    .loading-style{
        position: fixed;
        left: 0;
        top: 0;
        background: #fff;
        width: 100%;
        height: 100%;
        z-index: 999;
        font-size: 14px;
        text-align: center;
        color: #666666;
    }
    .loading-style img{
        width: 70%;
        margin-top: 90px;

    }
    .loading-style p{
        margin-top: 10px;
    }
    .loading-style button{
        font-size: 16px;
        display: inline-block;
        border: none;
        width: 160px;
        height: 90px;
        line-height: 90px;
        color: #fff;
        background: url('../../assets/img/live_class_btn.png') 0 2px no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
        cursor: pointer;
    }
    .contains {
        width: 100%;
        height: 100%;
        background: #fff;
        margin: 0 auto;
        overflow: hidden;
    }

    #show-iframe {
        position:absolute;
        width:100%;
        height: 100%;
        /*min-height: 450px;*/
        /*background: black;*/
        margin-bottom: -4px;
    }

    .popContainer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
    }

    .popContainer-countdown {
        width: 80%;
        height: 119px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 14%;
    }

    .popContainer-countdown-pc {
        width: 318px;
        height: 164px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 0 38px;
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

    .popContainer-qrcode img {
        width: 150px;
        height: 150px;
        margin-top: 18%;
    }

    .popContainer-qrcode p {
        font-size: 14px;
        color: #4F4F4F;
        margin-top: 20px;
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
        width: 150px;
        height: 150px;
    }

    .qrcode-pc-p {
        color: #494949;
        font-size: 14px;
        margin-bottom: 18px;
    }

    .button_img {
        position: absolute;
        top: 50px;
        background: url("https://img.kaikeba.com/icon_button.png") no-repeat;
        background-size: 416px auto;
        cursor: pointer;
    }

    .button_img p {
        width: 416px;
        height: 120px;
        line-height: 90px;
        font-size: 20px;
    }

    .content_img img {
        width: 100%;
        display: block;
    }

    .logo_text {
        font-size: 24px;
        color: #fff;
        margin-top: 40px;
        font-weight: bold;
    }

    .popContainer-status {
        width: 80%;
        height: 140px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        line-height: 80px;
    }

    .popContainer-status-pc {
        width: 40%;
        height: 80px;
        background: #fff;
        position: absolute;
        top: -10%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        line-height: 80px;
    }

    .live-bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgb(115,115,115) url("../../assets/img/kkb_wx_opencourse_pageBg.png") center no-repeat;
        background-size: 100%;
        background-position: 0 -64px;
    }

    .live-bg-pc {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #72AFDA;
        /*background: url("../../assets/img/kkb_wx_opencourse_pageBg.png")center no-repeat;*/
        /*background-size:100%;*/
        /*background-position:0 -64px;*/
    }

    /*直播结束，视频生成中*/
    .live-status-generate-pc {
        width: 318px;
        height: 164px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
    }

    .live-status-generate-pc img {
        width: 34px;
        height: 28px;
        margin-top: 40px;
    }

    .live-status-generate-pc p {
        line-height: 18px;
    }

    .live-status-generate {
        width: 80%;
        height: 141px;
        background: #fff;
        position: absolute;
        top: -20%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        font-size: 0;
    }

    .live-status-generate img {
        width: 35px;
        height: 29px;
        margin-top: 35px;
    }

    .live-status-generate p {
        font-size: 14px;
        color: #4F4F4F;
        line-height: 15px;
    }


    /*iPhoneX的适配*/
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        .live-status-generate p {
            font-size: 16px;
        }
        .live-status-generate img {
            width: 40px;
            height: 34px;
            margin-top: 35px;
        }
    }


    /*视频已下架*/
    .live-status-lower-pc {
        width: 318px;
        height: 150px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
    }

    .live-status-lower-pc img {
        width: 34px;
        height: 31px;
        margin-top: 40px;
    }

    .live-status-lower-pc p {
        font-size: 14px;
        color: #4F4F4F;
        line-height: 15px;
    }

    .live-status-lower {
        width: 80%;
        height: 130px;
        background: #fff;
        position: absolute;
        top: -24%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        font-size: 0;
    }

    .live-status-lower img {
        width: 35.5px;
        height: 31.5px;
        margin-top: 34px;
    }

    .live-status-lower p {
        font-size: 14px;
        color: #4F4F4F;
        line-height: 15px;
    }

    /*直播刚结束*/
    .live-status-end-pc {
        width: 318px;
        height: 248px;
        background: #fff;
        position: absolute;
        top: -24%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        font-size: 0;
    }

    .live-status-end {
        width: 56%;
        height: 180px;
        background: #fff;
        position: absolute;
        top: -15%;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        border-radius: 4px;
        box-sizing: border-box;
        text-align: center;
        font-size: 0;
    }

    .status-end-top {
        width: 100%;
        height: 110px;
        background: url("../../assets/img/kkb_wx_opencourse_replay_bg.png") left top no-repeat;
        background-size: 100%;
        overflow: hidden;
    }

    .status-end-top-pc {
        width: 100%;
        height: 142px;
        background: url("../../assets/img/kkb_wx_opencourse_replay_bg_pc.png") left top no-repeat;
        background-size: 100%;
        overflow: hidden;
    }

    .status-end-top-pc p {
        font-size: 18px;
        color: #fff;
    }

    .status-end-top-pc p.p1 {
        font-size: 18px;
        color: #fff;
        margin-top: 42px;
    }

    .status-end-top p {
        font-size: 14px;
        color: #fff;
    }

    .status-end-top p.p1 {
        font-size: 14px;
        color: #fff;
        margin-top: 35px;
    }

    .status-end-bottom {
        width: 100%;
    }

    .status-end-bottom p {
        font-size: 12px;
        color: #494949;
    }

    .status-end-bottom p.p2 {
        margin-top: 14px;
    }

    .status-end-bottom-pc {
        width: 100%;
    }

    .status-end-bottom-pc p {
        font-size: 14px;
        color: #494949;
    }

    .status-end-bottom-pc p.p2 {
        margin-top: 30px;
    }

    .countdown-moble {
        width: 100%;
        line-height: 0;
        overflow: hidden;
        padding-left: 5px;
    }

    .countdown-moble p {
        font-size: 14px;
        color: #494949;
    }

    .countdown-content {
        margin-top: 13px;
    }

    .countdown-content img {
        width: 25px;
        height: 23px;

    }

    .countdown-clock {
        line-height: 23px;
        padding-left: 38px;
    }

    .countdown-clock span {
        color: #00AFF2;
        font-size: 20px;
        float: left;
        display: block;
        line-height: 20px;
    }

    .clock-top {
        margin-top: 4px;
        font-family: OpenCourseFonts;
    }

    .countdown-pc {

    }

    .countdown-clock span.span-time {
        margin: 0 6px;
        color: #909090;
        font-size: 16px;
        margin-top: 4px;
        line-height: 24px;
    }

    .countdown-clock span.span-time-moble {
        margin: 0 5px;
        color: #909090;
        font-size: 12px;
        line-height: 24px;
    }
    .qrcode-spin{
        margin-left: calc(50% - 20px);
        position: fixed;
        top: 200px;
        left: 0;
        z-index: 999999;
    }

    .clock-top-pc {
        margin-top: 9px;
        font-family: OpenCourseFonts;
        font-size: 24px;
    }
    .guidefront{
        text-align: center;
        color: #fff;
        font-size: 14px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0 auto;
        margin-top: 155px;
    }
    .guidefrontpc{
        color: #fff;
        font-size: 14px;
        position: absolute;
        top: 200px;
        left: 72px;
        cursor: pointer;
    }
    .guide{
        text-align: center;
        color: #fff;
        font-size: 14px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: 0 auto;
        margin-top: 180px;
    }
    .guidepc{
        color: #fff;
        font-size: 14px;
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        margin-top: 200px;
        cursor: pointer;
    }
    .qrcode-spin{
        margin-left: calc(50% - 20px);
        position: fixed;
        top: 200px;
        left: 0;
        z-index: 999999;

    }
    @media screen  and (max-width: 320px) {
        .popContainer-countdown {
            padding: 0 10%;
        }
    }

    @media screen  and (max-width: 360px) {
        .countdown-clock {
            padding-left: 34px;
        }
    }

    @font-face {
        font-family: 'OpenCourseFonts';
        src: url('../../assets/font-styles/fonts/font-styles.eot'); /* IE9 Compat Modes */
        src: url('../../assets/font-styles/fonts/font-styles.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('../../assets/font-styles/fonts/font-styles.woff') format('woff'), /* Modern Browsers */ url('../../assets/font-styles/fonts/font-styles.ttf') format('truetype'), /* Safari, Android, iOS */ url('../../assets/font-styles/fonts/font-styles.svg#OpenCourseFonts') format('svg'); /* Legacy iOS */
        font-weight: normal;
        font-style: normal;
    }
</style>
