<template>

</template>

<script>
    import {Toast} from 'we-vue';
    import {getToken} from "../../assets/js/filter";
    import {Authorize} from "../../assets/js/userAuthorize";

    //实例化 authorize
    var authorize = new Authorize();

    export default {
        data(){
            return {
                code: this.$route.query.code, //获取授权code
                linkurl:''
            }
        },
        created(){
            this.FnApiUrl();
            if (localStorage.getItem('openid') && localStorage.getItem('unionid')) {
                Toast.loading('loading');
                this.Fncourse()
            } else {
                if (authorize.isEmpty(this.code)) {
                    authorize.obtainGetCode();
                } else {
                    authorize.codeGetAccess(this.code, this.Fncourse);
                }
            }
        },
        methods: {
            FnApiUrl(){
                if (window.location.href.indexOf('test') !== -1) {
                    this.linkurl = 'https://studytest.kaikeba.com';
                }else if(window.location.href.indexOf('pre') !== -1){
                    this.linkurl = 'https://studypre.kaikeba.com';
                }else if(window.location.href.indexOf('wxdev2') !== -1){
                    this.linkurl = 'https://studydev2.kaikeba.com';
                }else if(window.location.href.indexOf('wxdev') !== -1){
                    this.linkurl = 'https://studydev.kaikeba.com';
                }else {
                    this.linkurl = 'https://study.kaikeba.com';
                }
            },
            Fncourse(){
                let courselink = location.href.split('#')[0];
                if (courselink.indexOf("opencourse") != -1) {
                    window.location = this.linkurl + '/mypublicourselist?socialId=' + getToken('unionid')
                }
                if (courselink.indexOf("vipcourse") != -1) {
                    window.location = this.linkurl + '/myvipcourselist?openid=' + getToken('openid')
                }
            },
        }
    }
</script>

<style>

</style>
