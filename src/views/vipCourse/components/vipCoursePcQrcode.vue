<template>
  <div class="modalcontain">
    <div id="cover"></div>
    <div class="qrcoedmodal">
      <h2>{{dataInfo.name}}</h2>
      <qrcode-vue class="qrcode-form" :size="158" :value="dataInfo.url"></qrcode-vue>
    </div>
  </div>
</template>
<script>
    import QrcodeVue from "qrcode.vue"

    export default {
        name: "QrCoedModal",
        props:['dataInfo'],
        data() {
            return {
            };
        },
        components: {
            QrcodeVue
        },
        mounted(){}
    };
</script>
<style scoped>
  .modalcontain {
    width: 100%;
    height: 100%;
    background: black;
    overflow: hidden;
  }

  #cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: black;
    z-index: 20;
    opacity: 0.7;
  }

  .qrcoedmodal {
    width: 540px;
    height: 420px;
    background-color:#fff;
    position: absolute;
    top: -8%;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 4px;
    box-sizing: border-box;
    padding: 0 38px;
    z-index: 999;
    background-image: url("https://img.kaikeba.com/95249141700202nbpd.png");
    background-size: 100%;

  }
  .qrcoedmodal h2{
    font-size: 24px;
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    top: 56px;
    margin: auto;
  }
  .qrcode-form{
    text-align: center;
    margin-left: 10px;
    margin-top: 159px;
  }
</style>