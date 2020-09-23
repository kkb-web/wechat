<template>
    <div class="open-course-content">
        <div v-if="lowShelfFlag" class="open-course-img">
            <img src="../../assets/img/kkb_wx_low_shelf.png" alt="下架">
        </div>
        <div class="open-course-img" v-else>
            <img v-for="(item, idx) in openCourseImgList" :src="item" v-show="idx < 2"/>
            <img v-for="(item, idx) in openCourseImgList" v-lazy="item" v-show="idx >= 2"/>
        </div>

        <div v-if="judgeState"  class="opencourse-status-bottom default-state" @click="openMask">
            <p>免费报名</p>
        </div>
        <div v-else  :class="'liveStatus_' + liveStatusObj.status " class="opencourse-status-bottom" @click="toLiveClassRoom(liveStatusObj.status)">
            <p>{{liveStatusObj.text}}</p>
        </div>
        <!--遮罩层二维码的显示-->
        <div v-show="showMask" id="mask">
            <div class="popContainer-qrcode">
                <p class="open-couse-close" @click="closeMask">
                    <img src="../../assets/img/kkb_wx_opencourse_close.png" alt="close">
                </p>
                <!--pc端样式-->
                <div v-if="isPc">
                    <p class="qr-img-warp" style="margin-top: -6px;">
                        <img :src="tempQrUrl" alt="二维码" class="qr-img">
                    </p>
                    <p style="margin-top: -10px">微信扫描二维码，获取上课地址</p>
                </div>
                <!--微信浏览器样式-->
                <div v-else>
                    <p style="margin-top: 10px">长按二维码，获取上课地址</p>
                    <p class="qr-img-warp">
                        <img :src="tempQrUrl" alt="二维码分享" class="qr-img" v-if="sharerUnionId" @touchstart.stop="countImgTimesFn" @touchend.stop="mouseupFn">
                        <img :src="qrImg" alt="二维码" class="qr-img" v-else @touchstart.stop="countImgTimesFn" @touchend.stop="mouseupFn">
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>


<script>
    import {urlGetOpenCourseInfo ,urlGetQrcode} from "../../api/api"
    import {getToken, isMobile, livePlayStatus, setToken, guid, routeUrl} from "../../assets/js/filter";
    import {share} from "../../assets/js/share";
    import {contentSocket,disConnect} from "../../assets/js/socket";
    import {Authorize} from "../../assets/js/userAuthorize"
    import {socketService} from "../../assets/js/filter";
    import { Toast } from 'we-vue'
    import md5 from 'js-md5';

    //实例化 authorize
    var authorize = new Authorize();

    export default {
        data(){
            return {
                showMask: false, //遮罩层二维码
                judgeState:true, //显示状态判断
                openCourseImgList:[],
                PCUnionid: this.$route.query.PC_unionid || null,
                openCourseId:parseInt(this.$route.params.id) ,//url携带的课程id  parseInt(this.$route.params.id)
                code:this.$route.query.code,//获取授权code
                channel:this.$route.query.channel , //url携带的channel this.$route.query.channel
                qrImg: null, // 二维码地址
                isPc: false,
                liveStatusObj:{
                    status:null,
                    text:null
                },//获取直播状态的文字
                sharerUnionId: this.$route.query.sharerUnionId,
                randomKey:md5(guid()).substring(0,8), //生成8位随机数
                endPoint:null,//判断是哪个渠道
                timer: null,
                tempQrUrl:null, //临时二维码
                lowShelfFlag:false,//下架的状态
                openTimeoutImg:null,//二维码长按次数
            }
        },
        components: {},
        created(){
            disConnect();
        },
        mounted () {
            // setToken('unionid','oBB9ps7LhZDgso7aS5mPfUGKwvFs');
            // this.getOpenDetail();
            /**
             * 请求临时二维码的情况：
             * 含有shareUnionid、
             * 从官网进来、
             * 直接输入地址进入页面
             */
            let isMobileStr = isMobile();
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            //是微信内置浏览器需要授权
            if (version !== -1) {
                this.endPoint = 'WX';
                /**
                 * A.含有shareUnionid 请求临时二维码
                 */
                if(this.sharerUnionId){
                    console.log('含有分享，但是不能没有详情');
                    this.getQrUrlFn();
                    this.refreshQrUrl();
                }
                if ((getToken('living-openid') && getToken('living-unionid')) || this.sharerUnionId) {
                    console.log('分享和含有unionud都进来');
                    authorize.getUserInfo(getToken('living-openid'));
                    this.getOpenDetail();
                    contentSocket(this.getOpenDetail, getToken('living-unionid'), socketService()[0], this.openCourseId, 'HOME', this.endPoint, this.actualGetStatus, null, null);
                }else{
                    if (authorize.isEmpty(this.code)) {
                        authorize.obtainGetCode();
                    }else{
                        authorize.codeGetAccess(this.code,this.getOpenDetail);
                    }
                    setTimeout(() => {
                        // alert(getToken('unionid'));
                        contentSocket(this.getOpenDetail, getToken('living-unionid'), socketService()[0], this.openCourseId, 'HOME', this.endPoint, this.actualGetStatus, null, null);
                    }, 1000);
                }

                //     先连接socket
                //     let unionid = getToken('unionid') ? getToken('unionid') : null;
                //     alert(unionid);
                //     contentSocket( this.getOpenDetail,unionid,'opencourse',this.openCourseId,'HOME',this.actualGetStatus);

            } else {
                //不是微信内置浏览器
                if (isMobileStr) {
                    //手机上的浏览器 给出提示页面
                    window.location = 'http://study.kaikeba.com/wxlimit';
                } else {
                    this.endPoint = 'PC';
                    //pc 浏览器 二维码样式有特殊性
                    this.isPc = true;
                    /**
                     * B.C 从官网进来、以及直接输入地址进入页面 请求临时二维码
                     */
                    //刷新请求二维码
                    this.getQrUrlFn();
                    this.refreshQrUrl();
                    this.getOpenDetail();
                    console.log('pc点连接');
                    //pc端链接socket 获取unionid 为了再请求一遍详情增加pv和uv
                    contentSocket(this.getOpenDetail, this.randomKey, socketService()[0], this.openCourseId, 'HOME', this.endPoint, null, this.handlePcDetailSocket, this.reconnectSocket);
                }
            }
        },
        methods: {
            /**
             * 重连socket
             * */
            reconnectSocket (data) {
                console.log(data.unionId, 'websokcet返回的unionid02');
                // alert(JSON.stringify(data));
                let unionId;
                if(this.isPc){
                    unionId = data.unionId
                }else {
                    unionId = getToken('living-unionid') || data.unionId
                }
                contentSocket(this.getOpenDetail, unionId, socketService()[0], this.openCourseId, 'HOME', this.endPoint, this.actualGetStatus, this.handlePcDetailSocket, null);
            },
            /**
             * 处理PC端soket返回的unionid,
             * 取到之后要把"免费报名'的状态切换成'已报名'
             * 把遮罩层去掉
             */
            handlePcDetailSocket(data){
                if (!authorize.isEmpty(data.unionId)) {
                    this.showMask = false;
                    this.PCUnionid = data.unionId;
                    this.getOpenDetail(data.unionId);
                }
            },
            //获取临时二维码
            getQrUrlFn(){
                let sendData = {
                    courseType:'open',
                    courseId:this.openCourseId,
                    qrKey:this.randomKey,
                    channelCode: this.channel ? this.channel :this.endPoint.toLowerCase(),
                    expireSeconds:300000   //5分钟 = 300秒
                };

                sendData.shareSocialId = this.sharerUnionId ? `${this.sharerUnionId}|` : '';
                let params = `open|${this.openCourseId}|${sendData.channelCode}|${this.randomKey}|${sendData.shareSocialId}&expire=2592000`;
                urlGetQrcode(encodeURI(params)).then(res =>{
                    if(res.data.code == 0){
                        this.tempQrUrl = res.data.data;
                    }
                }).catch(err =>{
                    console.log(err,'urlGetQrcode')
                })
            },
            //刷新二维码
            refreshQrUrl(){
                let _this = this;
                this.timer = setInterval(function(){
                    _this.getQrUrlFn();
                },270000);
            },
            actualGetStatus(code){
                this.judgeState = false;
                this.liveStatusObj = livePlayStatus(code);
            },
            //获取公开课详情
            getOpenDetail(unionid){
                //处理详情接口
                let sendData = {
                    courseId:this.openCourseId,
                    pageCode:'HOME',
                    endpoint:this.endPoint,
                    channelCode:this.channel ? this.channel :this.endPoint.toLowerCase()
                };
                if(this.sharerUnionId){
                    sendData.sharerUnionId = this.sharerUnionId;
                };

                if(this.isPc){
                    if(this.PCUnionid || unionid){
                        sendData.unionId = this.PCUnionid || unionid;
                    }
                }else {
                    if(getToken('living-unionid') || this.PCUnionid || unionid){
                        sendData.unionId = getToken('living-unionid') || this.PCUnionid || unionid;
                    };
                }
                if(sendData.courseId && sendData.pageCode && sendData.endpoint) {
                    urlGetOpenCourseInfo(sendData).then(res => {
                        if (res.data.code == 0) {
                            if (JSON.stringify(res.data.data) !== "{}") {
                                setToken('opencourseDetail', JSON.stringify(res.data.data));
                            }
                            this.loadOpencourseInfo();
                        } else if (res.data.code == 10001) {
                            Toast({
                                duration: 1500,
                                message: '链接出错啦，可以到“开课吧服务号”去报名观看哦！'
                            })
                        }else if(res.data.code == 20001){
                            //已经报名，把"免费报名"隐藏，下架状态展示出来
                            this.judgeState = false;
                            this.lowShelfFlag = true;//下架状态更改为显示
                            this.liveStatusObj = livePlayStatus(20001);
                        }else if(res.data.code == 20005){
                            if (authorize.isEmpty(this.code)) {
                                authorize.obtainGetCode();
                            }else{
                                authorize.codeGetAccess(this.code,this.handleSocketAndGetDetail);
                            }
                        }

                    }).catch(err => {
                        if (err.response.status === 500 || err.response.status === 502) {
                            //用户进入直播间报错次数
                            console.log(this.openCourseId,'用户进入直播间报错次数')
                            gio('track', 'livehouse_error', {'opencourseId':this.openCourseId});

                            if(getToken('opencourseDetail') && getToken('opencourseDetail') !=''){
                                this.loadOpencourseInfo();
                            }

                        }
                    })
                }
            },
            loadOpencourseInfo(){
                let jsonOpenDetailData = JSON.parse(getToken('opencourseDetail'));
                //判断是否报名
                if (jsonOpenDetailData.status === 20004) {
                    //把"免费报名"隐藏，状态展示出来
                    this.judgeState = false;
                    this.liveStatusObj = livePlayStatus(jsonOpenDetailData.liveStatus);

                } else{
                    //未报名，把"免费报名"显示
                    this.judgeState = true;
                    this.qrImg = jsonOpenDetailData.qrUrl;
                }
                /*     详情图片加载规则
                * 例：后台返回 15431979156332253_01_03，03表示图片总数，01表示图片顺序；
                * 需解析成 https://img.kaikeba.com/15431979156332253_01_03,
                *         https://img.kaikeba.com/15431979156332253_02_03,
                *         https://img.kaikeba.com/15431979156332253_03_03;
                * */
                let imgKey = jsonOpenDetailData.contentImage,
                    imgUrl = imgKey.substring(0, imgKey.length - 6),
                    imgCount = imgKey.substring(imgKey.length, imgKey.length - 2);
                this.openCourseImgList = [];
                for (let i = 1; i <= parseInt(imgCount); i++) {
                    if(i>9){
                        this.openCourseImgList.push('https://img.kaikeba.com/' + imgUrl + '_' + i + '_' + imgCount + '!w750')
                    }else {
                        this.openCourseImgList.push('https://img.kaikeba.com/' + imgUrl + '_0' + i + '_' + imgCount + '!w750')
                    }
                }

                //分享
                share.init(jsonOpenDetailData.groupShareTitle, jsonOpenDetailData.shareDescription,
                    jsonOpenDetailData.shareCoverImage, jsonOpenDetailData.friendCircleTitle,
                    getToken('living-unionid'),this.openCourseId,jsonOpenDetailData.channelCode);
            },

            //打开遮罩层
            openMask(){
                if(authorize.isEmpty(this.qrImg) && authorize.isEmpty(this.tempQrUrl)){
                    Toast.text({
                        duration: 1000,
                        message: '服务器出了点小故障，刷新试试吧！'
                    })
                }else {
                    this.showMask = true;

                    console.log(this.openCourseId,'打开this.openCourseId')
                    gio('track', 'opencourse_details_codeframe_ejt', {'opencourseId':this.openCourseId});
                }
            },
            //关闭遮罩层
            closeMask(){
                this.showMask = false;

                console.log(this.openCourseId,'关闭this.openCourseId')
                gio('track', 'opencourse_details_codeframe_clsbtn_clk', {'opencourseId':this.openCourseId});
            },
            // 点击下面状态进入直播间
            toLiveClassRoom (status) {
                console.log(this.openCourseId,'底部按钮被点击次数')
                gio('track', 'opencourse_details_btn_clk', {'opencourseId':this.openCourseId});

                if (status == 1 || status == 3) {
                    if(authorize.isEmpty(this.PCUnionid)){
                        this.$router.push(routeUrl() +`liveclass/${this.openCourseId}?channel=${this.channel}`)
                    }else{
                        this.$router.push(routeUrl() +`liveclass/${this.openCourseId}?channel=${this.channel}&PC_unionid=${this.PCUnionid}`)
                    }

                }
            },
            //统计图片长按次数
            countImgTimesFn(){
                this.openTimeoutImg = setTimeout(function() {
                    console.log(this.openCourseId,'长按次数id');
                    gio('track', 'codeframe_long_press', {'opencourseId':this.openCourseId});
                }, 1000);
            },
            //清除定时器
            mouseupFn() {
                clearTimeout(this.openTimeoutImg);
            },

        },
        destroyed () {
            // disConnect();
            clearInterval(this.timer)
        }
    }
</script>

<style scoped>
    .open-course-content {
        width: 100%;
        background: #fff;
        max-width: 416px;
        margin: 0 auto;
        padding: 0;
        text-align: center;
    }

    .open-course-img {
        margin: 0 auto;
        width: 100%;
        height: 100%;
        margin-bottom: 48px;
        text-align: center;
    }

    .open-course-img img {
        width: 100%;
        display: block;
    }

    .opencourse-status-bottom {
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 1.06rem;
        font-weight: bold;
        overflow: hidden;
        color: #fff;
        background-repeat: no-repeat;
        background-size: 100%;
        cursor: pointer;
        box-shadow: 0 0 15px 0 rgba(50, 50, 50, 0.15);
    }

    .default-state {
        background: url("https://img.kaikeba.com/bottom_03_phone.png") left bottom;
    }
    /*已报名直播前 蓝色*/
    .liveStatus_0 {
        background: url("https://img.kaikeba.com/bottom_04_phone.png") left bottom;
    }
    /*火热进行中 红色*/
    .liveStatus_1 {
        background: url("https://img.kaikeba.com/bottom_01_phone.png") left bottom;
    }
    /*下架、生成回放 灰色*/
    .liveStatus_2, .liveStatus_4 {
        background: url("https://img.kaikeba.com/bottom_02_phone.png") left bottom;
    }
    /*看回放 绿色*/
    .liveStatus_3 {
        background: url("https://img.kaikeba.com/bottom_05_phone.png") left bottom;
    }
    /*兼容pc端样式*/
    @media screen and (min-width: 640px) {
        /*遮罩层*/
        #mask .popContainer-qrcode{
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
        .default-state {
            background: url("https://img.kaikeba.com/bottom_03.png") left bottom;
        }

        .liveStatus_0 {
            background: url("https://img.kaikeba.com/bottom_04.png") left bottom;
        }

        .liveStatus_1 {
            background: url("https://img.kaikeba.com/bottom_01.png") left bottom;
        }

        .liveStatus_2, .liveStatus_4{
            background: url("https://img.kaikeba.com/bottom_02.png") left bottom;
        }

        .liveStatus_3 {
            background: url("https://img.kaikeba.com/bottom_05.png") left bottom;
        }

    }

    img[lazy=loading] {
        width: 50px;
        display: block;
        height: 550px;
        text-align: center;
        margin: 0 auto;
    }
    .open-couse-close{
        text-align: right;
        height: 30px;
        margin: 14px 14px 0 0;
    }
    .open-couse-close img{
        width: 12px;
        height: 12px;
    }
    .qr-img-warp , .qrImg{
        width: 150px;
        height: 150px;
        margin: 20px auto;
    }
</style>
