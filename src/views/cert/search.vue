<template>
    <div class="search-warp">
        <div class="search-content">
            <div>
                <p class="search-logo">
                    <img src="https://img.kaikeba.com/learn_logo.png" alt="img"/>
                </p>
                <p class="search-title">开课吧学员证书查询系统</p>
            </div>
            <!--搜索框-->
            <div class="search-cont clear">
            <p class="search-input left">
              <input type="text" name="" class="text-input" maxLength="255" placeholder="请输入证书编号" v-model="inputVal"/>
            </p>
            <p class="search-btn left">
              <input  type="submit" value="查询" @click="searchCert"/>
            </p>
            </div>
        </div>
    </div>
</template>
<script>
    import {urlLearnCert} from "../../api/api";

    export default {
        data(){
            return {
                inputVal:null,

            }
        },
        computed: {},
        mounted () {
            document.body.addEventListener('focusout', function () {
                window.scrollTo(0,0);
            });
        },
        methods :{
            searchCert(){
                if (this.inputVal) {
                    let sendData = {
                        code: this.inputVal
                    };
                    urlLearnCert(sendData).then(res => {
                        if (res.data.code === 0) {
                            this.$router.push({path:`/cert/student/${this.inputVal}`});
                        } else {
                            this.$router.push({path:'/cert/student/404'});
                        }
                    }).catch(error => {
                        this.$router.push({path:'/cert/student/404'});
                    })
                }
            }
        }
    }
</script>
<style scoped>
    /*搜索页面*/
    .search-warp{
        width: 100%;
        overflow: hidden;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .search-content{
        margin: 80px auto 0;
        padding: 14px;
    }
    .search-logo{
        text-align: center;
    }
    .search-logo img{
        width: 150px;
        height: 46px;
    }
    .search-title{
        font-size: 16px;
        margin:16px auto 50px;
        text-align: center;
        color: #555;
    }
    .search-cont{
        width: 100%;
    }
    .search-cont span{
        margin: 0;
        padding: 0;
    }
    .search-cont input{
        border: 0;
        padding: 0;
    }
    .search-input{
        border: 1px solid #b6b6b6;
        background: #fff;
        display: inline-block;
        vertical-align:top;
        width:79%;
        height:44px;
        overflow: hidden;

    }

    .text-input{
        width: 95%;
        height: 34px;
        font: 14px arial;
        line-height: 18px;
        margin: 6px 0 0 7px;
        padding: 0;
        outline: 0;
    }
    .search-btn{
        width: 19%;
        background: #49a4de;
        border: 1px solid #49a4de;
        letter-spacing: 1px;
        cursor: pointer;
        height: 44px;
        text-align: center;
        line-height: 44px;
    }
    .search-btn input{
        color: #fff;
        font-size: 16px;
        background: none;
    }


</style>
