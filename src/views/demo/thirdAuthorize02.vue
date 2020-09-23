<template>
    <div class="thirdpartyouth">

    </div>
</template>

<script>
    import {Authorize} from "../../assets/js/thirdouth"
    import {getToken,timestampToTime,setToken, routeUrl} from "../../assets/js/filter";
    import {thirdpartyouths,urlAccess} from "../../api/api"
    var authorize = new Authorize();
    export default {
        name: "thirdpartyauth",
        data(){
            return{
                code:this.$route.query.code,
                contains:'',
                url:'',
                appid:'',
                baseUrl:'',
                authorizeUrl:''
            }
        },
        mounted(){
            if (process.env.NODE_ENV === 'development') {
                this.baseUrl =   'https://wxtest.kaikeba.com';
            } else if (window.location.href.indexOf('wxtest') !== -1) {
                this.baseUrl = 'https://wxtest.kaikeba.com';
            } else if (window.location.href.indexOf('wxpre') !== -1) {
                this.baseUrl = 'https://wxpre.kaikeba.com';
            }  else if (window.location.href.indexOf('wxdev2') !== -1) {
                this.baseUrl = 'https://wxdev2.kaikeba.com';
            }  else if (window.location.href.indexOf('wxdev') !== -1) {
                this.baseUrl = 'https://wxdev.kaikeba.com';
            } else {
                this.baseUrl =  'https://wx.kaikeba.com';
            }
            this.thirdpartyouthFn();
        },
        methods:{
            returnURL(data,appid){
                return `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${appid}&pre_auth_code=${data}&redirect_uri=${baseUrl}`
            },
            thirdpartyouthFn(){
                thirdpartyouths(this.baseUrl).then(res=>{
                    if(res.data.code == 0){
                        window.location.href = res.data.data.url;
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>

    .thirdpartyouth{
        width: 100%;
        text-align: center;
        box-sizing: border-box;
        padding-top: 100px;
        color: red;
    }
    input{
        height: 25px;
        width: 300px;
    }
    a{
        margin-top: 25px;
        padding: 10px 25px;
        height: 40px;
        background-color:#1890ff;
        border-radius: 4px;
    }
    .top{
        margin-bottom: 25px;
    }
</style>
