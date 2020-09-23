<template>
    <div class="content">
        <button @click="cleanUserInfo">清除页面缓存</button>
    </div>
</template>

<script>
    import {Toast} from 'we-vue';
    export default {
        data(){
            return {}
        },
        mounted(){

        },
        methods: {
            cleanUserInfo(){
                localStorage.clear();
                Toast({
                    duration: 1500,
                    message: '清除缓存成功'
                })
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