<template>
    <div class="content">
        <button @click="vaildateUnionid">验证是否含有unionid</button>
    </div>
</template>

<script>
    import {Toast} from 'we-vue';
    import {getToken} from "../../assets/js/filter";
    import {getToken} from "../../assets/js/filter";
    var authorize = new Authorize();

    export default {
        data(){
            return {
                unionId:getToken('unionid'),
            }
        },
        mounted(){

        },
        methods: {
            vaildateUnionid(){
                if(authorize.isEmpty(this.unionId)){
                    Toast({
                        duration: 1500,
                        message: '您当前unionid是空,请点击链接清除重新授权'
                    })
                }else{
                    Toast({
                        duration: 1500,
                        message: '您当前含有unionid,请返回后继续操作'
                    })
                }

            }
        }
    }
</script>

<style>
    .content {
        overflow: hidden;
        width: 100%;
        height: 100px;
        line-height: 60px;
        text-align: center;
        padding-top: 350px;
    }
    .content button{
        width: 140px;
        line-height: 38px;
        text-align: center;
        font-weight: bold;
        color: #fff;
        text-shadow:1px 1px 1px #333;
        border-radius: 5px;
        position: relative;
        overflow: hidden;

        color: #8c96a0;
        text-shadow:1px 1px 1px #fff;
        border:1px solid #dce1e6;
        box-shadow: 0 1px 2px #fff inset,0 -1px 0 #a8abae inset;
        background: -webkit-linear-gradient(top,#f2f3f7,#e4e8ec);
        background: -moz-linear-gradient(top,#f2f3f7,#e4e8ec);
        background: linear-gradient(top,#f2f3f7,#e4e8ec);
    }
</style>