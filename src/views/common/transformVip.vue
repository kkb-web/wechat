<template>
  <div>

  </div>
</template>

<script>
  import {Authorize} from "../../assets/js/beforeAuthorize"
  import {setToken, isPcDingTalkWS, setCookiePath, getToken, cashierLink, getCookie} from "../../assets/js/filter";
  import {Toast} from 'we-vue'
  import {wwwUrl} from "../../utils/const"
  import {getUuid} from "../../api/api"

  //实例化 authorize
  var authorize = new Authorize();

    export default {
        name: 'vipCourse',
        data() {
            return {
                courseCode: this.$route.params.code,
                channelCode: this.$route.params.channel,
                code: this.$route.query.code,//获取授权code,
                tenant:this.$route.query.tenant,
                openid:'',
                custom_data:this.$route.query.custom_data ? this.$route.query.custom_data : null,
                tenant_unionid:this.$route.query.tenant_unionid ? this.$route.query.tenant_unionid : null,
                source_unionid: this.$route.query.source_unionid ? this.$route.query.source_unionid : null,
                seller_id:this.$route.query.seller_id ? this.$route.query.seller_id : null,
                auto_pay:this.$route.query.auto_pay ? this.$route.query.auto_pay : null,
                phone:this.$route.query.phone ? this.$route.query.phone : null,
                wx_uid:this.$route.query.wx_uid ? this.$route.query.wx_uid : null,
                officialChannel: this.$route.query.officialChannel ? this.$route.query.officialChannel : null,
                cmsCourseType: this.$route.query.cmsCourseType ? parseInt(this.$route.query.cmsCourseType) : null,
                officialChannelFalg:false,
                isGoodsShelves: this.$route.query.isGoodsShelves,
                thirdPartyMobile:this.$route.query.mobile,
                lichee:this.$route.query.lichee,
                HKYOperId:this.$route.query.HKYOperId, //直播间红包或者直播间货架带过来的
                contentId:this.$route.query.contentId, // 直播间红包带过来的
                goodShelvId:this.$route.query.goodShelvId //直播间货架带过来的
            }
        },
        computed: {},
        components: {
            Toast
        },
        mounted() {
            this.checChannelType()
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            setToken('tenant',this.tenant);
            this.handleTenant_unionid()
            if (version !== -1) {
                if(this.tenant){
                    if(this.auto_pay && this.auto_pay == 1) {
                      setCookiePath('auto_pay',this.auto_pay,86400,'/','.kaikeba.com')
                    }
                    if (getToken('goodsAppOpenid') && getToken('openid') && getToken('unionid')) {
                      this.getVipcourseInfo(getToken('goodsAppOpenid'))
                    } else {
                      this.wxAuthor();
                    }
                }
            }else{
                if(this.auto_pay && this.auto_pay == 1 && this.phone && this.wx_uid){
                    setCookiePath('auto_pay',this.auto_pay,86400,'/','.kaikeba.com')
                    setCookiePath('phone',this.phone,86400,'/','.kaikeba.com')
                    setCookiePath('wx_uid',this.wx_uid,86400,'/','.kaikeba.com')
                }
                if(!localStorage.getItem('openid')) {
                    localStorage.setItem('openid', 'channelParams'+Math.ceil(Math.random()*1000000));
                }
                if(!localStorage.getItem('unionid')) {
                    localStorage.setItem('unionid', 'channelParams'+new Date().valueOf());
                }
                if (getCookie('auto_pay') && getCookie('auto_pay') == 1 && getCookie('phone') && getCookie('wx_uid')) {
                    localStorage.setItem('openid', 'channelParamsMB'+getCookie('phone'));
                    localStorage.setItem('unionid', 'channelParamsMB'+getCookie('phone'));
                }
                let query = location.search.slice(1).split("?")[0].split('&');
                let queryObject = {};
                query.forEach(item => {
                    queryObject[item.split('=')[0]] = item.split('=')[1];
                });
                if(queryObject.gdt_vid) {
                    queryObject.utm_source = 'wechat_moments';
                    queryObject.utm_content = location.href;
                    queryObject.utm_medium = location.href;
                    queryObject.utm_term = queryObject.gdt_vid;
                }else{
                    if(!queryObject.utm_source || queryObject.utm_source === 'undefined') {
                        queryObject.content = document.referrer;
                        queryObject.utm_source = 'natural';
                    }
                }
                // h5 如果有第三方手机号，不要手机登录
                if(this.thirdPartyMobile && this.thirdPartyMobile !== ''){
                  getUuid(this.thirdPartyMobile).then((res) => {
                    if (res.data.code === 0) {
                      localStorage.setItem("openid", "channelParamsMB" + this.thirdPartyMobile)
                      localStorage.setItem("unionid", "channelParamsMB" + this.thirdPartyMobile)
                      sessionStorage.setItem("phone", this.thirdPartyMobile)
                      sessionStorage.setItem("wx_uid", res.data.data.uid)
                      setCookiePath('auto_pay', 0, 86400, '/', '.kaikeba.com')
                    }
                    this.getVipcourseInfo(localStorage.getItem('openid'), encodeURIComponent(JSON.stringify(queryObject)));
                  })
                  return
                }
                this.getVipcourseInfo(localStorage.getItem('openid'), encodeURIComponent(JSON.stringify(queryObject)));
            }
        },
        methods: {
            checChannelType(){
                // officialChannel 是标示是否该课程被官网包装过，如果被包装过，跳到官网，如果没有，继续往下走。1是mos后台指定写死的值
                if(this.officialChannel){
                    this.officialChannelFalg = true
                }
            },
            handleTenant_unionid() {
                if (this.tenant_unionid) {
                    setToken('unionid',this.tenant_unionid)
                    setToken('tenant_unionid_type','snsapi_base')
                }
            },
            wxAuthor() {
                if(isPcDingTalkWS()){
                    window.location = 'http://study.kaikeba.com/wxlimit';
                }else if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    // setToken('tenant',this.tenant);
                    authorize.codeGetAccess(this.code, this.getVipcourseInfo);
                }
            },

            /**
             *
             * title:新公开课跳转到官网逻辑判断
             * @param openid
             * @param cmsCourseType:cms平台课程类型（1公开课，2直播课）
             *
             */
            handleNewOpnecourseLink(openid){
                if(this.cmsCourseType === 1){
                    window.location = `${wwwUrl}/open/item?c=${this.officialChannel}&appid=${this.tenant}&openid=${openid}&courseCode=${this.courseCode}&channelCode=${this.channelCode}`
                }
                if(this.cmsCourseType === 2){
                    window.location = `${wwwUrl}/live/items?c=${this.officialChannel}&courseCode=${this.courseCode}&channelCode=${this.channelCode}`
                }
            },

            getVipcourseInfo(openid,channelParams = encodeURIComponent(JSON.stringify({
                content: document.referrer,
                utm_source: 'natural'
            }))){
                let url = '';
                let orderSelectParamsCopy = channelParams
                if (process.env.NODE_ENV === 'development') {
                    // url = 'http://192.168.87.190:8080';
                    // url = 'https://wxtest.kaikeba.com';
                    // url = 'http://10.20.29.81:8080'
                    url='http://localhost:8080'
                } else {
                    if (window.location.href.indexOf('wxpre') !== -1) {
                        url = 'https://wxpre.kaikeba.com';
                    } else if (window.location.href.indexOf('wxtest') !== -1){
                        url = 'https://wxtest.kaikeba.com';
                    } else if (window.location.href.indexOf('wxdev2') !== -1){
                      url = 'https://wxdev2.kaikeba.com';
                    } else if (window.location.href.indexOf('wxdev') !== -1){
                      url = 'https://wxdev.kaikeba.com';
                    } else {
                        url = 'https://wx.kaikeba.com';
                    }
                }
                let query = location.search.slice(1).split("?")[0].split('&');
                let queryObject = {query};
                query.forEach(item => {
                    queryObject[item.split('=')[0]] = item.split('=')[1];
                });
                if(queryObject.gdt_vid) {
                    queryObject.utm_source = 'wechat_moments';
                    queryObject.utm_content = location.href;
                    queryObject.utm_medium = '';
                    queryObject.utm_term = queryObject.gdt_vid;
                    orderSelectParamsCopy=encodeURIComponent(JSON.stringify(queryObject));
                }
                let custom_data = (this.custom_data ? `&custom_data=${this.custom_data}` : ``);
                let source_unionid = (this.source_unionid ? `&source_unionid=${this.source_unionid}` : ``);
                let seller_id = (this.seller_id ? `&seller_id=${this.seller_id}` : '');
                if(this.officialChannelFalg){
                    this.handleNewOpnecourseLink(openid)
                    return
                }
                let HKYOperId = this.HKYOperId ? `&HKYOperId=${this.HKYOperId}` : ''
                let contentId = this.contentId ? `&contentId=${this.contentId}` : ''
                let goodShelvId = this.goodShelvId ? `&goodShelvId=${this.goodShelvId}` : ''
                let isGoodsShelves = (this.isGoodsShelves && this.isGoodsShelves === 'isTrue') ? '&isGoodsShelves=isTrue' : '' // 直播间货架参数
                let lichee = (this.lichee && this.lichee === 'lichee') ? '&lichee=lichee' : '' //直播间红包参数
                window.location = `${url}/vipcourse/${this.courseCode}/${this.channelCode}?tenant=${this.tenant}_${openid}${isGoodsShelves}${lichee}${HKYOperId}${contentId}${goodShelvId}&channelParams=${orderSelectParamsCopy}${custom_data}${source_unionid}${seller_id}&sell=${queryObject.sell || 0}&sub_goods_id=${queryObject.sub_goods_id || ''}`;
            }
        }

    }
</script>


<style lang="css" scoped>

</style>
