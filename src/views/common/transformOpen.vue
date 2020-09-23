<template>
    <div>

    </div>
</template>

<script>
    import {Authorize} from "../../assets/js/beforeAuthorize"
    import {setToken, routeUrl} from "../../assets/js/filter";
    import {Toast} from 'we-vue'

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
                openid:''
            }
        },
        computed: {},
        components: {
            Toast
        },
        mounted() {
            setToken('tenant',this.tenant);
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            //是微信内置浏览器需要授权
            if (version !== -1) {
                if(this.tenant){
                    this.wxAuthor();
                }
            }else{
                window.location = 'http://study.kaikeba.com/wxlimit';
            }
        },
        methods: {
            wxAuthor() {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.getVipcourseInfo);
                }
            },
            getVipcourseInfo(openid){

                this.$router.push({
                    path: routeUrl() + `vipcourse/${this.courseCode}/${this.channelCode}?tenant=${this.tenant}_${openid}`,
                    query: {orderId: this.orderNo}
                });
            }
        }

    }
</script>


<style lang="css" scoped>

</style>
