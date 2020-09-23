<template>
    <div :style={height:pageHeight} class="cashier-contains">
        <div class="box-item-detail">
            <div class="detail-left">
                <img :src="itemDetail.icon">
            </div>
            <div class="detail-right">
                <h2>{{itemDetail.name}}</h2>
                <p class="detail-right-d">{{itemDetail.description}}</p>
                <p class="detail-right-m">¥<span>{{itemDetail.price}}</span></p>
            </div>
        </div>
        <div class="box-item-discountlist">
            <div class="discountlist-left">
                <span>优惠</span>
            </div>
            <div class="discountlist-right">
                <p>
                    满6000减200
                    <span>></span>
                </p>
            </div>
        </div>
        <div class="box-item-payment">
            <div class="pay-select-title">支付方式</div>
            <template v-for="(item,index) in payList">
               <div :key="item.id" :class="{'pay-select':true,'line':!index==0}" @click="selectPay(item.code,index)">
                   <div class="pay-select-left">
                       <img :src="`https://img.kaikeba.com/${item.icon}`">
                       <span>{{item.name}}</span>
                   </div>
                   <div class="pay-select-right">
                       <div v-if="currentIndex === index"><wv-icon type="success"></wv-icon></div>
                       <div v-else class="pay-select-right-cricle"></div>
                   </div>
                   <span v-if="item.code == 'WECHAT'" class="pay-select-right-tips tips-wx">推荐</span>
                   <span v-if="item.code == 'CREDIT_CARD_INSTALMENT'" class="pay-select-right-tips tips-chess">免息分期得好礼</span>
               </div>
            </template>
        </div>
        <div class="box-item-fixed">
            <p class="pay-money-p">实付金额：<span class="pay-money">¥{{payMent}}</span></p>
            <p>点击支付即代表您已阅读并同意<span class="pay-agreement" @click="showDialog">《电子协议》</span></p>
            <div class="pay-button" @click="unityPay()">立即支付</div>
        </div>
        <dialogComponent :is-show="isShowPublish" @on-close="closeDialog">
            <div slot="header">电子协议</div>
            <div class="dialog_publish_main" slot="main">
                <p>甲方：北京开课吧科技有限公司</p>
                <p>通讯地址：北京市海淀区东北旺西路8号院40号楼</p>
                <p>乙方：待付费用户</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;开课吧是慧科集团旗下泛互联网人职业提升平台，整合全球顶尖IT和互联网企业一线师资及实战项目，满足用户多层次和个性化学习需求，实现职业提升和可持续成长。</p>
                <p>&nbsp;&nbsp;&nbsp;&nbsp;甲方为服务提供机构，乙方拟使用甲方提供的服务，故，甲乙双方就此经平等自愿友好协商达成如下条款，并签署本《服务协议》，以资遵守：</p>
                <p class="sub-title">一、 简历优化服务模式：</p>
                <p>1、乙方接受甲方提供的简历优化服务，并按照下列约定向甲方支付服务费用：甲乙双方签署本协议后个工作日内，乙方按甲方在网上公布的帐户及汇款方式一次性向甲方支付全部服务费用计人民币￥99.00（大写：玖拾玖元整），甲方在此服务费到帐后为乙方提供相关服务。</p>
                <p>2、简历优化服务有效期为：自购买之日30天（包含购买日）</p>
                <p>3、乙方购买服务后，可享受甲方提供的5次简历修改服务。</p>
                <p class="sub-title">二、双方方权利义务</p>
                <p>1、甲方负责收集、整理乙方提交的基本资料，与乙方沟通，梳理乙方过往工作经验；写作、修改完成正稿并简单排版。</p>
                <p>2、乙方有权享受甲方提供的所有简历修改服务，包括简历优化、简历修改、简历排版等；</p>
                <p>3、乙方允许甲方使用乙方肖像权和甲方服务成果等相关真实信息进行正当合法宣传；</p>
                <p>4、乙方承诺，乙方向甲方提供的简历撰写所需一切材料均真实可靠，乙方为前述材料的真实性负全部责任。因乙方提供材料不真实所造成的一切后果，由乙方自行承担，与甲方无关。</p>
                <p>5、甲方只负责修改、优化简历，不对乙方的求职结果做出任何承诺。</p>
                <p class="sub-title">三、 退款条款</p>
                <p>1、如乙方付费成功后未享受服务即要求取消服务，甲方有权收取相当于本合同总价款50%的费用，仅退还乙方相当于合同总价款剩余50%的费用；</p>
                <p>2、前述情况下，如乙方要求取消服务，请务必于付费后24小时内告知甲方，并提供乙方本人账号（还是原路返回）；甲方在接到乙方告知后48小时内为乙方办理取消业务，已付费超过48小时的，乙方无权要求甲方办理取消业务。</p>
                <p>3、如乙方已经开始使用甲方提供的服务，则乙方无权要求退款。</p>
                <p>4、甲方根据乙方提供的信息及资料撰写材料，乙方收到甲方修改后的简历正稿后三个日历日内未向甲方无异议，意味着乙方认可甲方撰写的材料符合乙方的真实情况。因乙方提供材料不真实所造成的一切后果，均由乙方承担，与甲方无关，乙方无权因此要求甲方退还费用。</p>
                <p class="sub-title">四、 保密及知识产权条款</p>
                <p>1、甲方尊重并保护乙方的隐私权，不向第三方透露乙方的个人信息。</p>
                <p>2、经甲方修改后的乙方简历，相关知识产权归甲方所有，乙方承诺不将甲方制作的简历用于求职之外的其它任何用途，否则乙方将承担由此给甲方造成的一切损失。本条款不因协议的终止而终止。</p>
                <p class="sub-title">五、 协议终止条件</p>
                <p>1、本协议生效期间出现不可抗力因素导致本协议无法继续履行达30日的，除双方另行协商一致外，本协议终止，双方进行结算，互不承担违约责任。</p>
                <p>2、若乙方恶意中伤或诽谤甲方，散布不实信息并给甲方造成恶劣影响的，或乙方行为涉嫌不正当竞争，甲方有权即时终止本协议，并无需退还乙方任何费用，同时，甲方保留进一步追究乙方法律责任的权利。</p>
                <p>3、如乙方未按照本合同约定及时履行付款义务，甲方有权单方面终止本协议，或者单方面停止履行本协议项下约定的一切义务。甲乙双方均同意，甲方前述行为并不构成违约。</p>
                <p class="sub-title">六、 争议解决办法</p>
                <p>1、在本合同履行过程中发生的或与本合同有关的任何争议或未尽事宜，应通过友好协商方式解决，协商解决不成的，双方均有权向北京仲裁委员会提起仲裁。</p>
                <p>2、在解决争议期间，除争议事项外，各方应继续履行本合同。</p>
                <p class="sub-title">七、 其他条款</p>
                <p>开课吧向您发出的通知、函件等，按您提供的身份证或您绑定的手机号，或以电子邮件、微信、qq等电子方式发送电子邮件后或向本协议所载明的您的电话号码发送短信后即视为送达。</p>
                <p class="sub-title">请阅读本协议，点击支付即代表您已阅读并同意本培训协议。</p>
            </div>
        </dialogComponent>
    </div>
</template>

<script>
    import {Toast, Button,Icon} from 'we-vue'
    import {urlPayCashier,cashierPay} from "../../api/api"
    import {routeUrl,cashierLink, setToken,compare} from "../../assets/js/filter";
    import dialogComponent from './../common/dialog'
    import {_AP} from '../../assets/js/urlencode'
    export default {
        name: 'cashier',
        data() {
            return {
                pageHeight: '',
                payType:'',
                openid:'',
                orderNo:this.$route.query.orderNo,
                payMent:'',
                itemDetail:{
                    // "price": 0.01,
                    // "name": "第一次测试APPLE",
                    // "icon": "https://img.kaikeba.com/web/protal/img_course_webjg.png",
                    // "description": "授课深度对标阿里 P6 级，进入BAT等一线大厂，成为大厂进阶稀缺人才",
                    // "id": 136,
                    // "skuId": 166
                },
                currentIndex: 0, // 默认选中第一个
                payList: [
                    // {
                    //     cls: "wechat-pay",
                    //     code: "WECHAT",
                    //     icon: "pay_wechat.png",
                    //     id: 2,
                    //     name: "微信",
                    //     online: 1,
                    //     payType: 1,
                    //     sort: 1,
                    //     status: null,
                    //     // paySelect:false
                    // },
                    // {
                    //     cls: "apli-pay",
                    //     code: "ALIPAY",
                    //     icon: "pay_apli.png",
                    //     id: 1,
                    //     name: "支付宝",
                    //     online: 1,
                    //     payType: 0,
                    //     sort: 2,
                    //     status: null,
                    //     // paySelect:false
                    // }
                ],
                isShowPublish:false,
                cashierReturnUrl:''
                // pageShow:false
            }
        },
        computed: {},
        components: {
            Toast,dialogComponent
        },
        mounted() {
            console.log(encodeURIComponent('http://test-tss.kaikeba.com/resume'))
            this.getData();
            this.handlePageHeight();
        },
        methods: {
            handlePageHeight() {
                let pageHeight = window.innerHeight;
                this.pageHeight = pageHeight + "px";
            },
            getData(){
                let sendData = {
                    orderNo:this.orderNo,
                    endpoint:'WX'
                };
                cashierPay(sendData).then(res=>{
                    if(res.data.code == 0){
                        this.openid = res.data.data.openId;
                        this.payMent = res.data.data.actualAmount;
                        this.itemDetail = res.data.data.item;
                        this.cashierReturnUrl = res.data.data.returnUrl;
                        setToken('cashierReturnUrl',res.data.data.returnUrl);
                        this.changePayList(res.data.data.payChannels);
                    }else if(res.data.code == 10001){
                        Toast.text({
                            duration: 8000,
                            message: '订单查询失败！请重新提交订单，进行支付。'
                        })
                    }
                }).catch(err=>{
                    console.log(err,'cashierPay')

                })
            },
            changePayList(list){
                let Arr = list.sort(compare);
                this.payType = Arr[0].code;
                this.payList = Arr;
            },
            selectPay(type,index){
                this.payType = type;
                this.currentIndex = index;
            },
            unityPay(){
                let type = this.payType;
                console.log(type)
                if(type == ''){
                    return
                }
                let isType;

                switch (type) {
                    case 'ALIPAY':
                        isType = 0;
                        break;
                    case 'WECHAT':
                        isType = 1;
                        break;
                    case 'LOAN':
                        isType = 2;
                        break;
                    case 'TENCENT':
                        isType = 3;
                        break;
                    case 'NETEASE':
                        isType = 4;
                        break;
                    case 'CHEESE':  // 信用卡分期
                        isType = 5;
                        break;
                    case 'KKB_ICBC':
                        isType = 6;
                        break;
                    case 'ALIPAY_OFFLINE':
                        isType = 7;
                        break;
                    case 'CREDIT_CARD_INSTALMENT': // 芝士分期
                        isType = 9;
                        break;
                    case 'WECHAT_OFFLINE':
                        isType = 8;
                        break;
                    default:
                        isType = 0;

                }
                if(isType === 0){
                    this.aliPay(isType)
                }else if(isType === 1){
                    this.wxPay(isType)
                }else {
                    this.stagesPay(isType)
                }
            },
            //支付宝支付
            aliPay(payType) {
                let sendData = {
                    order_no: this.orderNo,
                    pay_channel: payType,
                    return_url:`${cashierLink()}paying`,
                    endpoint:'WX'
                };
                //请求获取支付宝参数
                urlPayCashier(sendData).then(res => {
                    if (res.data.code == 0) {
                        top.location.href = routeUrl() + 'cashalipay/' + this.orderNo +
                            '?orderUrl=' + _AP.a_encode(encodeURIComponent(res.data.data.payUrl))
                    } else {
                        Toast.fail({
                            duration: 1000,
                            message: res.data.msg
                        })
                    }
                }).catch(err => {
                    console.log('aliPay', err);
                });
            },
            //微信支付
            wxPay(payType) {
                let wxPayParams = {},
                    //请求获取wxPayParams的具体值,请求成功后执行implementWxPay
                    sendData = {
                        order_no: this.orderNo,
                        pay_channel: payType,
                        return_url:`${cashierLink()}paying`,
                        endpoint:'WX'
                    };
                //请求获取wxPayParams
                urlPayCashier(sendData).then(res => {
                    if (res.data.code == 0) {
                        //获取jsApiParameData
                        wxPayParams.appId = res.data.data.appId; //公众号名称，由商户传入
                        wxPayParams.timeStamp = res.data.data.timeStamp; //时间戳，自1970年以来的秒数
                        wxPayParams.nonceStr = res.data.data.nonceStr; //随机串
                        wxPayParams.package = res.data.data.packageValue;
                        wxPayParams.signType = res.data.data.signType; //微信签名方式：
                        wxPayParams.paySign = res.data.data.paySign; //微信签名
                        implementWxPay()
                    } else if (res.data.code === 60008) {
                        Toast.fail({
                            duration: 1000,
                            message: '信息不一致，请重新授权'
                        });
                        this.wxAuthor();
                    } else {
                        Toast.fail({
                            duration: 1000,
                            message: res.data.msg
                        })
                    }
                }).catch(err => {
                    console.log('wxPay', err);
                });
                let _this = this;

                //H5调起微信支付
                let onBridgeReady = () => {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', wxPayParams,
                        function (res) {
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                _this.$router.push({
                                    path: routeUrl() + 'paying',
                                    query: {orderId: _this.orderNo}
                                });
                            }
                        }
                    );
                };

                let implementWxPay = () => {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                };
            },
            /*
            * 分期支付
            * 1、payType：9 -- 代表芝士分期；
            * 2、payType：5 -- 代表信用卡分期；
            * */
            stagesPay(payType){
                let sendData = {
                    order_no: this.orderNo,
                    pay_channel: payType,
                    return_url:`${cashierLink()}paying`,
                    endpoint:'WX'
                };
                urlPayCashier(sendData).then(res => {
                    if (res.data.code == 0) {
                        top.location.href = res.data.data.payUrl;
                    } else {
                        Toast.fail({
                            duration: 1000,
                            message: res.data.msg
                        })
                    }
                }).catch(err => {
                    console.log('stagesPay', err);
                });
            },
            //展示协议
            showDialog(){
                this.isShowPublish=true;
            },
            //关闭协议弹层
            closeDialog(){
                this.isShowPublish=false;
            },
        }

    }
</script>


<style lang="css" scoped>
    .cashier-contains {
        width: 100%;
        box-sizing: border-box;
        background-color: #F9F9F9;
    }

    /*底部悬浮box*/
    .box-item-fixed {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 64px;
        line-height: 50px;
        font-size: 1.06rem;
        overflow: hidden;
        background: #ffffff;
        text-align: left;
        box-sizing: border-box;
        background: #ffffff;
    }

    .box-item-fixed p {
        line-height: 17px;
        font-size: 12px;
        margin-left: 16px;
        color: #999999;
    }

    .box-item-fixed p.pay-money-p {
        margin-top: 14px;
        margin-bottom: 2px;
        color: #333333;
    }

    .box-item-fixed .pay-money {
        font-size: 16px;
        color: #F04444;
    }

    .box-item-fixed .pay-agreement {
        font-size: 12px;
        color: rgb(26, 167, 227);
    }

    .pay-button {
        width: 80px;
        height: 36px;
        border-radius: 5px;
        font-size: 14px;
        color: #ffffff;
        background-color: #00A5E3;
        position: absolute;
        right: 4.3%;
        top: 14px;
        line-height: 36px;
        text-align: center;
    }
    .pay-button:active{
        background-color: #0080B0;
    }

    /*商品详情*/
    .box-item-detail {
        width: 100%;
        box-sizing: border-box;
        padding:4.3%;
        background-color: #ffffff;
        overflow: hidden;
        height: 119px;
    }

    .detail-left {
        width: 35.7%;
        height: 20px;
        float: left;
    }

    .detail-right {
        width: 60.4%;
        float: left;
        margin-left: 8px;
    }

    .detail-left img {
        width: 100%;
        height: 87px;
    }

    .detail-right h2 {
        font-size: 16px;
        color: #333333;
        height: 22px;
        line-height: 22px;
        margin-top: 2px;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
        -webkit-line-clamp: 1;
        display: -webkit-box;
    }

    .detail-right-d {
        font-size: 13px;
        color: #999999;
        height: 34px;
        line-height: 17px;
        overflow: hidden;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /*! autoprefixer: on */
        -webkit-line-clamp: 2;
        display: -webkit-box;
        margin-top: 4px;
        margin-bottom: 4px;

    }

    .detail-right-m {
        font-size: 13px;
        color: #333333;
        line-height: 17px;
    }

    /*优惠*/
    .box-item-discountlist {
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        overflow: hidden;
        padding: 16px;
        margin: 28px 0;
        display: none;
    }

    .discountlist-left {
        float: left;
    }

    .discountlist-left span {
        font-size: 16px;
        color: #333333;
        line-height: 16px;
        font-weight: 600;
    }

    .discountlist-right {
        float: right;
    }

    .discountlist-right p {
        font-size: 14px;
        color: #333333;
        line-height: 16px;
        display: inline-block;
    }

    /*支付方式*/
    .box-item-payment {
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;
        margin-top: 28px;
    }
    .pay-select-title{
        width: 100%;
        box-sizing: border-box;
        padding-left: 16px;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 48px;
    }
    .pay-select{
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        padding-top: 11px;
        padding-bottom: 12px;
        position: relative;
    }
    .pay-select-left{
        float: left;
        padding-left: 16px;
        box-sizing: border-box;
    }
    .pay-select-left img{
        width: 22px;
        height: 18px;
        vertical-align: middle;
    }
    .pay-select-left span{
        font-size: 14px;
        color: #333333;
        line-height: 16px;
        margin-left: 4px;
    }
    .pay-select-right{
        float: right;
        margin-right: 16px;
        position: relative;
    }
    .pay-select-right-tips{
        height: 16px;
        border-radius: 8px;
        font-size: 12px;
        display: inline-block;
        text-align: center;
        line-height: 17px;
        position: absolute;
        top: 15px;
        right: 13%;
    }
    .tips-wx{
        width: 32px;
        border: 1px solid #00A5E3;
        color: #00A5E3;
    }
    .tips-chess{
        width: 82px;
        height: 18px;
        color: #ffffff;
        background: linear-gradient(#FD9D00, #FA6400);
        line-height: 18px;
    }
    .pay-select-right-cricle{
        width: 16px;
        height: 16px;
        border-radius: 18px;
        border: 1px solid #c9c9c9;
        margin-top: 3.6px;
    }
    .line::before{
        content: " ";
        position: absolute;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #e5e5e5;
        color: #e5e5e5;
        transform-origin: 0 0;
        transform: scaleY(.5);
        left: 16px;
        z-index: 2;
    }
    .sub-title {
        font-size: 14px;
        margin: 5px 0;
        font-weight: 600;
    }
    .dialog_publish_main p{
        font-size: 12px;
    }
</style>
<style>
    .pay-select-right .weui-icon-success{
        color: #00A5E3;
        font-size: 18px;
        line-height: 15px;
    }
    .pay-select-right .weui-icon-success::before{
        margin: 0;
    }
    .weui-toast.weui-toast_text{
        width: 62%;
    }
</style>
