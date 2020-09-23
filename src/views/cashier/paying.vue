<template>
    <div class="payPage">
        <img class="payingIcon" src="../../assets/img/payImgs/paying.png" alt="">
        <p class="payingState">交易正在处理</p>
        <p class="payingTip">请稍后查看</p>
    </div>
</template>

<script>
    import {cashierSearch,cashierPay} from '../../api/api'
    import {setToken} from "../../assets/js/filter";
    export default {
        name: "paying",
        data(){
            return{
                orderNo: this.$route.query.orderId
            }
        },
        mounted() {
            this.getPayData()
        },
        methods:{
            getPayData(){
                let _this = this;
                cashierSearch({no:this.$route.query.out_trade_no || this.orderNo}).then(res=>{
                    if(res.data.code ==0){
                        let version = navigator.userAgent.toLowerCase().indexOf('micromessenger');
                        //是微信内置浏览器需要授权
                        if (version !== -1) {
                            //是
                            _this.$router.push({
                                path: '/paySucceed'
                            });
                        }else{
                            //不是
                            let sendData = {
                                orderNo:res.data.data,
                                endpoint:'WX'
                            };
                            cashierPay(sendData).then(res=>{
                                if(res.data.code == 0){
                                    setToken('cashierReturnUrl',res.data.data.returnUrl);
                                    _this.$router.push({
                                        path: '/paySucceed'
                                    });
                                }
                            }).catch(err=>{
                                console.log(err,'cashierPay')
                            })
                        }
                    }else {
                        _this.$router.push({
                            path: '/payFail'
                        });
                    }
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }
</script>

<style scoped>
    .payPage{
        font-family: PingFangSC-Medium;
        letter-spacing: 0;
        text-align: center;
    }
    .payingIcon{
        display: block;
        width:246px;
        height:144px;
        margin:100px auto 0;

    }
    .payingState{
        font-size: 17px;
        color: #333333;
        line-height: 17px;
        text-align: center;
        margin-bottom: 8px;
    }
    .payingTip{
        font-size: 12px;
        color: #999;
        line-height: 17px;

    }
</style>