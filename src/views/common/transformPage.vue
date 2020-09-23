<template>
</template>

<script>
    import {Authorize} from "../../assets/js/userAuthorize";
    import {getToken} from "../../assets/js/filter";
    var authorize = new Authorize();
    export default {
        data(){
            return {
                code: this.$route.query.code,
                baseUrl:''
            }
        },
        created(){
            this.checkEnvironmental()
            let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
            console.log(version,'version')
            if (version !== -1) {
                if (getToken('unionid')) {
                    window.location.href = this.baseUrl + getToken('unionid');
                } else {
                    if (authorize.isEmpty(this.code)) {
                        authorize.obtainGetCode();
                    } else {
                        authorize.codeGetAccess(this.code, this.linkToStudy);
                    }
                }
            }
        },
        methods: {
            linkToStudy(){
                window.location.href = this.baseUrl + getToken('unionid')
            },
            checkEnvironmental(){
                if (window.location.href.indexOf('wxtest') !== -1) {
                    this.baseUrl = 'https://studytest.kaikeba.com/indexmobile?socialId='
                }else if (window.location.href.indexOf('wxpre') !== -1){
                    this.baseUrl = 'https://studypre.kaikeba.com/indexmobile?socialId='
                }else if (window.location.href.indexOf('wxdev2') !== -1){
                    this.baseUrl = 'https://studydev2.kaikeba.com/indexmobile?socialId='
                }else if (window.location.href.indexOf('wxdev') !== -1){
                    this.baseUrl = 'https://studydev.kaikeba.com/indexmobile?socialId='
                }else {
                    this.baseUrl = 'https://study.kaikeba.com/indexmobile?socialId='
                }
            }
        }
    }
</script>

<style>

</style>
