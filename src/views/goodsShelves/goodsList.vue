<template>
  <div :class="wapperClassName">
    <template v-for="(item,index) in goodsList">
      <div @click="linkPay(item.url)" :key="index" class="goodslist_inner_wapper">
        <div class="goodslist">
          <div class="img_box" :style="{'background-image' : 'url(https://img.kaikeba.com/' + item.icon + ')'}"></div>
          <div class="goods_info">
            <div class="goods_title">{{item.courseName}}</div>
            <div class="money_wapper">
              <div class="price"><span>¥</span>{{item.price}}</div>
              <s>{{item.showPrice}}</s>
              <button class="but_wapper" @click="showPay(index)">{{isShowPayIndex == index?"收起":"购买"}}</button>
            </div>
          </div>
        </div>
        <div class="qrcode_wapper" :style="{height:isShowPayIndex == index ? '166px' : '0px'}">
          <div class="qrcode_inner_box">
            <div class="canvans_box">
              <qrcode-vue class="canvans" id="canvans" :size="104" :value="`${item.url}&HKYOperId=${HKYOperId}${goodShelvIdStr}`"></qrcode-vue>
            </div>
            <p>请用微信扫一扫查看当前课程</p>
          </div>
        </div>
      </div>
    </template>
    <div v-show="goodsList.length%2 !== 0 && isMobile" class="goodslist_inner_wapper"
         style="background: transparent"></div>
  </div>
</template>

<script>
  import {setToken, getCookie, guid, getToken} from "../../assets/js/filter";
  import {LEARNEDU_TOKEN} from "../../utils/const"
  import {isMobileLive, childrenPostMassage} from "../../utils"
  import QrcodeVue from "qrcode.vue"
  import {isLoginApp, getAccessToken,openPhoneWebView} from "../../utils/appAgreement"
  import {getIpsInfo, getGoodShelv, getGoodShelvPVandUV} from "../../api/api"

  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  // 如果不是顶级页面 接受postMessage

  export default {
    name: "goodslist",
    data() {
      return {
        isAppLogin: false,
        isMLogin: false,
        wapperClassName: 'm_goodslist_wapper',
        isShowPayIndex: null,
        isMobile: isMobile,
        mobile: '',
        isWechat: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? true : false,
        goodShelvId: this.$route.query.id,
        goodShelvIdStr:`&goodShelvId=${this.$route.query.id}`,
        goodsList: [],
        HKYOperId:this.$route.query.operId
      }
    },
    components: {
      QrcodeVue
    },
    mounted() {
      // 统计设置uv、pv 的参数
      if (!getToken('goodsKey')) {
        setToken('goodsKey', guid())
      }
      this.addEventOrder()
      this.childrenPostMassageFn()
      this.init()
      isMobile ? this.wapperClassName = 'm_goodslist_wapper' : this.wapperClassName = 'pc_goodslist_wapper'
    },
    methods: {
      init() {
        setToken('goodsListUrls', window.location.href) // 缓存货架列表地址，用于支付成功后跳转
        this.getCourseList()
        this.pvAndUv()
        const env = isMobileLive()
        if (env === 'AnniversaryP') { //pc端
          this.env = 'pc'
        } else if (env === 'AnniversaryM') { //M端
          this.env = 'Mobile'
        } else if (env === 'AnniversaryAPP') { //app端
          this.env = 'app'
        }
      },
      addEventOrder() { // 监听支付是否成功
        window.addEventListener('storage', function (e) {
          if (e.key === 'goodsLinkUrlOrderId') {
            window.parent.parent.postMessage({type: 'wx-pay', data: true}, '*')
            window.location.href = `${getToken('vipCurrentUrl')}&orderId=${e.newValue}`
          }
        })
      },
      childrenPostMassageFn() {
        if (!this.isWechat) {
          childrenPostMassage({success: 'childrenPageIsLoad'})
        }
      },
      MloginJudge(url) {
        let learnToken = getCookie(LEARNEDU_TOKEN)
        if (learnToken) {
          getIpsInfo(`h5:${learnToken}`).then(res => {
            if (res.data.code === 0) {
              this.mobile = res.data.data.mobile
              window.location.href = `${url}&isGoodsShelves=isTrue&mobile=${res.data.data.mobile}&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`
            }else {
              window.location.href = `${url}&isGoodsShelves=isTrue&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`
            }
          })
        }else {
          window.location.href = `${url}&isGoodsShelves=isTrue&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`
        }
      },
      getIpsInfoFn(token,url){
        getIpsInfo(`${token}`).then(res => {
          if (res.data.code === 0) {
            openPhoneWebView(`${url}&mobile=${res.data.data.mobile}&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`)
          }else {
            openPhoneWebView(`${url}&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`)
          }
        })
      },
      pvAndUv() {
        getGoodShelvPVandUV(this.goodShelvId, getToken('goodsKey'))
      },
      linkPay(url) {
        if (isMobile) {
          if (this.env !== 'pc' && this.env !== 'app') {
            if(this.isWechat){
              window.location = `${url}&isGoodsShelves=isTrue&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`
            }else {
              this.MloginJudge(url)
            }
          } else {
            // app跳转,调取app协议
            this.handAppLink(url)
          }
        }
      },
      async handAppLink(url) {
        this.isAppLogin = await isLoginApp()
        let token = await getAccessToken()
        if(this.isAppLogin){
          this.getIpsInfoFn(token.split('|')[1],url)
        }else {
          // 没有登录直接跳走
          openPhoneWebView(`${url}&HKYOperId=${this.HKYOperId}${this.goodShelvIdStr}`)
        }
      },
      getCourseList() {
        const id = this.$route.query.id
        getGoodShelv(id).then(res => {
          if (res.data.code === 0) {
            this.goodsList = res.data.data
          }
        })
      },
      showPay(index) {
        this.isShowPayIndex === index ? this.isShowPayIndex = null : this.isShowPayIndex = index
      }
    }
  }
</script>

<style scoped>
  .iframe {
    margin: 0;
    padding: 0;
    border: none;
    width: 100%;
    height: 100vh
  }

  .pc_goodslist_wapper, .m_goodslist_wapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    /* max-width: 450px; */
    width: 100%;
    margin: 0 auto;
  }

  .pc_goodslist_wapper {
    padding: 0 16px;
    box-sizing: border-box;
  }

  .pc_goodslist_wapper .goodslist_inner_wapper {
    border-radius: 4px;
    overflow: hidden;
    margin-top: 16px;
    background: rgba(48, 48, 48, 1);
    transition: .5s;
    width: 100%;
  }

  .m_goodslist_wapper .goodslist_inner_wapper {
    border-radius: 4px;
    overflow: hidden;
    margin-top: 16px;
    background: rgba(48, 48, 48, 1);
    width: 43%;
  }

  .m_goodslist_wapper .goodslist {
    background: rgba(48, 48, 48, 1);
    border-radius: 4px;
    overflow: hidden;
  }

  .pc_goodslist_wapper .goodslist {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    height: 110px;
    display: flex;
  }

  .m_goodslist_wapper .img_box {
    width: 100%;
    padding-bottom: 100%;
    background: #161619;
    background-size: 100%;
  }

  .pc_goodslist_wapper .img_box {
    width: 88px;
    height: 88px;
    background: #161619;
    background-size: 100%;
  }

  .m_goodslist_wapper .goods_info {
    height: 93px;
    padding: 12px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .pc_goodslist_wapper .goods_info {
    height: 88px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 6px;
    box-sizing: border-box;
  }

  .m_goodslist_wapper .goods_title {
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 22px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .pc_goodslist_wapper .goods_title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 22px;
    color: #fff;
    padding: 0 4px 0 16px;
    box-sizing: border-box;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .m_goodslist_wapper .money_wapper {
    display: flex;
    align-items: flex-end;
  }

  .pc_goodslist_wapper .money_wapper {
    display: flex;
    align-items: flex-end;
    padding: 0 4px 0 16px;
  }

  .m_goodslist_wapper .price {
    font-size: 22px;
    font-family: DIN-Bold, DIN;
    font-weight: bold;
    color: rgba(255, 96, 23, 1);
    line-height: 22px;
    margin-right: 6px;
  }

  .pc_goodslist_wapper .price {
    font-size: 20px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(255, 96, 23, 1);
    line-height: 20px;
  }

  .m_goodslist_wapper .price span {
    margin-right: 3px;
    font-size: 14px;
    color: rgba(255, 96, 23, 1);
    line-height: 14px;
  }

  .pc_goodslist_wapper .price span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 96, 23, 1);
    line-height: 14px;
    margin-right: 2px;
  }

  .m_goodslist_wapper .money_wapper s {
    font-size: 14px;
    font-family: DIN-Bold, DIN;
    font-weight: bold;
    color: rgba(85, 85, 85, 1);
    line-height: 17px;
  }

  .pc_goodslist_wapper .money_wapper s {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(85, 85, 85, 1);
    line-height: 20px;
    margin-left: 7px;
    flex: 1
  }

  .m_goodslist_wapper .but_wapper {
    display: none;
  }

  .pc_goodslist_wapper .but_wapper {
    width: 50px;
    height: 24px;
    background: rgba(255, 96, 23, 1);
    border-radius: 2px;
    color: #fff;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 20px;
    outline: none;
    border: none;
    cursor: pointer;
  }

  .m_goodslist_wapper .qrcode_wapper {
    display: none;
  }

  .pc_goodslist_wapper .qrcode_wapper {
    padding: 0 8px;
    box-sizing: border-box;
    transition: 0.5s;
    height: 0;
  }

  .pc_goodslist_wapper .qrcode_inner_box {
    width: 100%;
    text-align: center;
    padding: 15px 0;
    box-sizing: border-box;
    border-top: 1px solid rgba(255, 255, 255, .1);
  }

  .canvans_box {
    width: 116px;
    height: 116px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #fff;
    padding: 6px;
    margin-bottom: 10px;
  }

  .pc_goodslist_wapper .qrcode_inner_box img {
    width: 116px;
    height: 116px;
    border-radius: 4px;
  }

  .pc_goodslist_wapper .qrcode_inner_box p {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 12px;
  }
</style>