<template>
    <div>

    </div>
</template>

<script>
    import {Authorize} from "../../assets/js/userAuthorizeTos";
    import {setToken, getToken, routeUrl} from "../../assets/js/filter";
    import {Toast} from 'we-vue'

    //实例化 authorize
    var authorize = new Authorize();

    export default {
        name: 'vipCourse',
        data() {
            return {
                code: this.$route.query.code,//获取授权code,
                appOpenid: this.$route.params.appopenid
            }
        },
        computed: {},
        components: {
            Toast
        },
        mounted() {
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            //是微信内置浏览器需要授权
            if (version !== -1) {
                this.wxAuthor();
            }
        },
        methods: {
            wxAuthor() {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.appOpenid, this.linkToTos);
                }
            },
            linkToTos(code) {
                let redirectURL = getToken('redirectURL');
                let flag = redirectURL.indexOf("?") != -1 ? '&' : '?';
                window.location = `${redirectURL}${flag}code=${code}`
            }
        }

    }
</script>


<style lang="css" scoped>

</style>
