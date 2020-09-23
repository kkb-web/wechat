<template>
    <div class="Closure-content">
        <wv-spinner v-show="qrCodeWaiting" color="#63acda" type="dot-circle" slot="ft" :size="40" class="qrcode-spin"></wv-spinner>
        <div :class="[headFlag ? headbg : '' ,headClass]">
            <ul class="ul-box">
                <li :style="{marginRight:$index == 0 ? '4px' : '10px'}" v-for="(item,$index) in itemList"
                    @click="selectStyle (item, $index)"
                    :class="{'active':item.active,'unactive':!item.active}">
                    <div class="ul-box-title">{{item.name}}</div>
                </li>
            </ul>
        </div>
        <div class="container">
            <div class="container-box">
                <ul v-if="visiberBox" id="container-ul" class="container-ul">
                    <div class="page-infinite-wrapper" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <wv-group
                                v-infinite-scroll="loadMore"
                                infinite-scroll-disabled="loading"
                                infinite-scroll-distance="50"
                        >
                            <li ref="scroll" @click="linkToOpencourse(item)" v-show="item.siteShow == 0" v-for="(item,index) in list">
                                <div v-if="index < 2" class="big">
                                    <img class="top-img" :src="handImg(item.siteThumbnail)"/>
                                    <div class="big-top">
                                        <p>{{item.openCourseName}}</p>
                                        <div class="starttime-one">
                                            <img class="timer-img" src="https://img.kaikeba.com/kkb_wx_opencourselist_timer01.png"/>
                                            <span class="sp2">{{timestampToTimeFn(item.schedule)}}</span>
                                        </div>
                                        <span v-if="item.liveStatus == 0" class="livestates2 stateinit">预约中</span>
                                        <span v-else-if="item.liveStatus == 1" class="livestates2 statelive big-living">正在直播<img src="http://img.kaikeba.com/live_gif.gif" /></span>
                                        <span v-else-if="item.liveStatus == 2"
                                              class="livestates2 stateliveend">直播结束</span>
                                        <span v-else-if="item.liveStatus == 3"
                                              class="livestates2 stateplayback">看回放</span>
                                        <span class="signupCount1">{{item.signupCount}}人报名</span>
                                    </div>
                                </div>
                                <div v-else class="small">
                                    <div class="img-small">
                                        <img style="border-radius: 2px" ref="topInfo" :src="handImg(item.siteThumbnail)">
                                    </div>
                                    <div ref="boxSmall" class="box-small">
                                        <p class="title-small">{{item.openCourseName}}</p>
                                        <div class="starttime">
                                            <img class="timer-img" src="https://img.kaikeba.com/kkb_wx_opencourselist_timer01.png"/>
                                            <span class="sp2">{{timestampToTimeFn(item.schedule)}}</span>
                                        </div>
                                        <span v-if="item.liveStatus == 0" class="livestates stateinit">预约中</span>
                                        <span v-else-if="item.liveStatus == 1" class="livestates statelive">正在直播</span>
                                        <span v-else-if="item.liveStatus == 2"
                                              class="livestates stateliveend">直播结束</span>
                                        <span v-else-if="item.liveStatus == 3"
                                              class="livestates stateplayback">看回放</span>
                                        <span class="signupCount2">{{item.signupCount}}人报名</span>
                                    </div>
                                </div>
                            </li>
                        </wv-group>
                        <p v-show="loading" class="loading-tips">
                            <wv-spinner type="snake" color="#444" :size="24"/>
                        </p>
                        <p v-show="showtips" class="showtips">{{bottomText}}</p>
                    </div>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {getSubjectList, getOpencourseList} from "../../api/api"
    import {timestampToTimeCommon,routeUrl} from "../../assets/js/filter";
    import {InfiniteScroll} from 'we-vue'
    let sendData = {
        size:10,
        current:1,
        condition:{}
    };
    export default {
        name: "opencourseAll",
        data() {
            return {
                firstState: true,
                active: true,
                itemList: [],
                list: [],
                sendData: {},
                subjectId: '',
                current: 1,
                loading: false,
                allLoaded: false,
                wrapperHeight: 0,
                total:'',
                showtips:false,
                qrCodeWaiting:true,
                headFlag:false,
                headClass:'head',
                headbg:'headbg',
                visiberBox:false,
                bottomText:''
            }
        },
        created() {
            this.getOpencourseListFn();
        },
        mounted() {
            this.getSubjectListFn();
            document.getElementById('container-ul').addEventListener('scroll', this.handleScroll)
        },
        methods: {
            handleScroll(){
                // var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || document.getElementsByClassName('container-ul').scrollTop;
                let offsetTop = document.getElementById('container-ul').scrollTop;
                if(offsetTop > 10 ){
                    this.headFlag = true;
                }else {
                    this.headFlag = false;
                }

            },
            //列表
            getOpencourseListFn() {
                this.visiberBox = true;
                getOpencourseList(sendData).then(res => {
                    if (res.data.code == 0) {
                        if(res.data.data.records.length == 0){
                            this.bottomText = '暂时没有公开课哦'
                        }else {
                            this.bottomText = '我是有底线的'
                        }
                        this.qrCodeWaiting = false;
                        this.list = res.data.data.records;
                        this.total = res.data.data.total;
                        sendData.current++;
                        this.$nextTick(() => {
                            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                        })
                    }
                }).catch(err => {

                });
            },
            //查询全部学科
            getSubjectListFn() {
                getSubjectList().then(res => {
                    if (res.data.code == 0) {
                        let data = res.data;
                        let itemList = data.data;
                        itemList.unshift({
                            id: 0,
                            name: '全部'
                        });
                        itemList[0].active = true;
                        this.itemList = itemList;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //选择学科更换样式
            selectStyle(item, index) {
                let that = this;
                this.qrCodeWaiting = true;
                this.$nextTick(function () {
                    that.itemList.forEach(function (item) {
                        that.$set(item, 'active', false);
                    });
                    that.$set(item, 'active', true);
                });
                this.showtips = false;
                this.handSubject(item.id)
            },
            //跳转到公开课详情
            linkToOpencourse(item){
                let url = '';
                if (process.env.NODE_ENV === 'development') {
                    url = 'http://192.168.87.190:8080';
                } else {
                    if (window.location.href.indexOf('wxpre') !== -1) {
                        url = 'https://wxpre.kaikeba.com';
                    } else if (window.location.href.indexOf('wxtest') !== -1){
                        url = 'https://wxtest.kaikeba.com';
                    }else if (window.location.href.indexOf('wxdev2') !== -1){
                        url = 'https://wxdev2.kaikeba.com';
                    } else if (window.location.href.indexOf('wxdev') !== -1){
                        url = 'https://wxdev.kaikeba.com';
                    } else {
                        url = 'https://wx.kaikeba.com';
                    }
                }
                // window.location = `${url}/${item.id}?channel=wechat`;
                window.location = `${url}/opencourse/${item.id}?channel=wechat`;
                // this.$router.push(routeUrl() +`opencourse/${item.id}?channel=wechat`)
            },
            //展示相应学科数据
            handSubject(id){
                if(id == 0){
                    sendData.condition = {}
                    sendData.current = 1
                }else {
                    sendData.condition.subject = id
                    sendData.current = 1
                }
                this.getOpencourseListFn()
            },
            //展现图片
            handImg(img) {
                return 'https://img.kaikeba.com/' + img
            },
            timestampToTimeFn(data) {
                return timestampToTimeCommon(data)
            },
            loadMore() {
                this.loading = true;
                let that = this;
                if(this.list.length >= this.total){
                    this.showtips = true;
                    that.loading = false
                    // that.$nextTick(() => {
                    //
                    // })
                }else {
                    setTimeout(() => {
                        getOpencourseList(sendData).then(res => {
                            if (res.data.code == 0) {
                                let data = res.data.data.records;
                                for (let i=0;i<data.length;i++){
                                    that.list.push(data[i]);
                                }
                                sendData.current++;
                                that.$nextTick(() => {
                                    that.loading = false
                                });
                                this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                            }
                        }).catch(err => {
                            console.log(err)
                        })
                    }, 2000)
                }
            }
        },
        destroyed(){
            this.wrapperHeight = 1000
            console.log(this.wrapperHeight)
            this.current = 1;
            console.log(this.current)
            this.visiberBox = false;
        }
    }
</script>

<style scoped>
    @font-face {
        font-family: 'OpenCourseFonts';
        src: url('../../assets/font-styles/fonts/font-styles.eot'); /* IE9 Compat Modes */
        src: url('../../assets/font-styles/fonts/font-styles.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */ url('../../assets/font-styles/fonts/font-styles.woff') format('woff'), /* Modern Browsers */ url('../../assets/font-styles/fonts/font-styles.ttf') format('truetype'), /* Safari, Android, iOS */ url('../../assets/font-styles/fonts/font-styles.svg#OpenCourseFonts') format('svg'); /* Legacy iOS */
        font-weight: normal;
        font-style: normal;
    }
    .Closure-content {
        width: 100%;
        max-width: 500px;
        height: auto;
        box-sizing: border-box;
        overflow: hidden;
        background: #EFF8F9;
        margin: 0 auto;
    }

    .head {
        width: 100%;
        max-width: 500px;
        background: #EFF8F9;
        position: fixed;
        right: 0;
        left: 0;
        z-index: 9999;
        padding-top: 15px;
        height: 41px;
        margin: 0 auto;
    }
    .headbg{
        background: #f2f2f2;
    }

    .ul-box {
        overflow-x: auto;
        list-style: none;
        white-space: nowrap;
        width: auto;
        padding: 0 10px;
    }

    .ul-box > li {
        /*margin-right: 10px;*/
        display: inline-block;
        border-radius: 50px;
        overflow: hidden;
    }

    .container {
        width: 100%;
        box-sizing: border-box;
    }

    .container-ul {

        list-style: none;
        height: 101%;
    }

    .container-ul li {
        text-align: left;
        background: #fff;
        padding: 4% 4% 4% 4%;
        border-radius: 10px;
        margin-bottom: 8px;
        overflow: hidden;
    }

    .container-ul li .top-img {
        border-radius: 2px;
        width: 100%;
        vertical-align: top;
    }
    .title{
        width: 100%;
    }

    .ul-box li.active {
        height: 26px;
        line-height: 24px;
        box-sizing: border-box;
        background-image: linear-gradient(to right, #04B1F3, #2ED2A6);
        background-size: contain;
        /*border: 1px solid rgba(0, 0, 0, 0);*/
        box-shadow: 0 2px 4px 0 #EFF8F9;
        color: #fff;
    }

    .ul-box li.unactive {
        color: #000;
        height: 26px;
        line-height: 24px;
        box-sizing: border-box;
        border: 1px solid #9DACAE;
        color: #9DACAE;
    }

    .ul-box-title {
        padding: 0px 17px;
    }

    .img-small {
        float: left;
        width: 41.5%;
        height: auto;
    }

    .img-small img {
        width: 100%;
        vertical-align: top;
    }

    .box-small {
        float: left;
        height: 88px;
        box-sizing: border-box;
        overflow: hidden;
        padding-left: 3%;
        width: 55.5%;
        font-size: 0;
        position: relative;
    }

    .small {
        width: 100%;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
    }

    .title-small {
        font-size: 14px;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient:vertical;
        /*! autoprefixer: on */
        -webkit-line-clamp: 2;
        display: -webkit-box;
    }

    .sp2 {
        font-size: 14px;
        color: #CCCCCC;
        font-family: OpenCourseFonts;
    }
    .livestates2{
        font-size: 12px;
        padding: 4px 5%;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
    }
    .livestates {
        font-size: 12px;
        padding: 1px 4%;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        position: absolute;
        left: 6%;
        bottom: 5px;
        /*line-height: 10px;*/
    }

    .statelive {
        color: #F43030;
        border: 1px solid #F43030;
    }

    .stateplayback {
        color: #23D2B9;
        border: 1px solid #23D2B9;
    }

    .stateinit {
        color: #00AFF2;
        border: 1px solid #00AFF2;
    }

    .stateliveend {
        color: #AEAEAE;
        border: 1px solid #AEAEAE;
    }

    .starttime {
        font-size: 0;
        position: absolute;
        left: 6%;
        bottom: 30%;
    }
    .starttime-one{
        font-size: 0;
    }

    .container-box {
        width: 100%;
        box-sizing: border-box;
        padding: 56px 14px 0 14px;
        -webkit-overflow-scrolling: touch;
    }

    @media screen and (max-width: 320px) {
        .box-small {
            height: 74px;
        }
    }
    .showtips{
        text-align: center;
        font-size: 14px;
        color: #00AFF2;
        margin-bottom: 20px;
        margin-top: 10px;
    }
    .timer-img{
        width: 14px;
        height: 12px;
        margin-right: 4px;
        vertical-align: sub;
    }
    .big{
        padding-bottom: 10px;
    }
    .big-top{
        padding: 10px 5px 0 5px;
    }
    .big-living{
        padding: 4px 5%;
        padding-left: 3%;
        padding-right: 5%;
    }
    .big-living img{
        vertical-align: text-top;
        margin-left: 3px;
    }
    .qrcode-spin{
        margin-left: calc(50% - 20px);
        position: fixed;
        top: 200px;
        left: 0;
        z-index: 999999;

    }
    .signupCount1{
        float: right;
        /*font-size: 15px;*/
        color: #606263;
        font-family: OpenCourseFonts;

    }
    .signupCount2{
        position: absolute;
        right: 0;
        bottom: 0;
        font-size: 15px;
        color: #606263;
        font-family: OpenCourseFonts;
    }
</style>
<style>
    .container-ul .weui-cells {
        background: #EFF8F9 !important;
        margin-top: 0px;
    }

    .container-ul .loading-tips {
        text-align: center;
        /*position: fixed;*/
        /*left: 50%;*/
        /*bottom: 5px;*/
    }
    .page-infinite-wrapper{
        overflow-y: auto;
    }
</style>
