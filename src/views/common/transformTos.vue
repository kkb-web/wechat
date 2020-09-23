<!--
 * @Author: starkwang
 * @Contact me: https://shudong.wang/about
 * @Date: 2019-12-09 22:50:32
 * @LastEditors: starkwang
 * @LastEditTime: 2019-12-09 22:52:46
 * @Description: file content
 -->
<template>
    <div></div>
</template>

<script>
    import {Authorize} from "../../assets/js/beforeAuthorizeTos"
    import {setToken, getToken, routeUrl,cashierLink, getParam} from "../../assets/js/filter";
    import {Toast} from 'we-vue'

    //实例化 authorize
    var authorize = new Authorize();

    export default {
        name: 'vipCourse',
        data() {
            return {
                code: this.$route.query.code,//获取授权code,
                appId: '',
                redirectURL: this.$route.query.redirectURL
            }
        },
        computed: {},
        components: {
            Toast
        },
        mounted() {
            this.handleUrl();
        },
        methods: {
            wxAuthor() {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.getVipcourseInfo);
                }
            },
            handleUrl() {
                let urlAppid = getParam(this.redirectURL, 'appId');
                this.appId = urlAppid;
                if (!this.code) {
                    setToken('tenant', urlAppid);
                    setToken('redirectURL', this.redirectURL);
                }
                //如果没有appid，直接跳转到二次授权;
                if (!urlAppid) {
                    window.location = `${cashierLink()}transformtostwo/null?redirectURL=${this.redirectURL}`;
                }else {
                    let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
                    //是微信内置浏览器需要授权
                    if (version !== -1) {
                        this.wxAuthor();
                    }
                }
            },
            getVipcourseInfo(openid) {
                this.$router.push({
                    path: `/transformtostwo/${openid}`,
                });
            }
        }

    }
</script>


<style lang="css" scoped>

</style>
