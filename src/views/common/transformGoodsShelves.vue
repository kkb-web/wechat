<template>
  <div></div>
</template>

<script>
  import {Authorize} from "../../assets/js/beforeAuthorize"
  import {setToken, isPcDingTalkWS, getToken, cashierLink} from "../../assets/js/filter";
  import { defaultAppid } from "../../utils/const"

  //实例化 authorize
  var authorize = new Authorize();

  export default {
    name: 'goodsTsf',
    data() {
      return {
        code: this.$route.query.code,
        isWechat: navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1 ? true : false,
        liveUrl:this.$route.query.url
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        setToken('tenant', defaultAppid);
        if (this.isWechat) {
          if (!getToken('goodsAppOpenid')) {
            this.wxAuthor();
          } else {
            this.getGoodsAppOpenid(getToken('goodsAppOpenid'))
          }
        } else {
          window.location.href = `${cashierLink()}goodsshelves?liveUrl=${this.liveUrl}`
        }

      },
      wxAuthor() {
        if (isPcDingTalkWS()) {
          window.location = 'http://study.kaikeba.com/wxlimit';
        } else if (authorize.isEmpty(this.code)) {
          authorize.obtainGetCode();
        } else {
          authorize.codeGetAccess(this.code, this.getGoodsAppOpenid);
        }
      },

      getGoodsAppOpenid(openid) {
        if (!getToken('goodsAppOpenid')) {
          setToken('goodsAppOpenid', openid)
        }
        window.location.href = `${cashierLink()}goodsshelves?liveUrl=${this.liveUrl}`
      }
    }

  }
</script>


<style lang="css" scoped>

</style>
