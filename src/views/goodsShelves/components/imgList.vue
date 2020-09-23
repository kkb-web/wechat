<template>
  <div
    :class="(vipInfo.type == 1  && vipInfo.use == 1) ? 'show-img show-img-bottom' :'show-img'"
  >
    <img
    v-for="(item, idx) in vipInfo.vipCourseImgList"
    :src="item"
    v-if="idx < 2"
    :key="idx"
    />
    <img
    v-for="(item, idx) in vipInfo.vipCourseImgList"
    v-if="idx >= 2"
    :key="idx"
    :src="item"
    />
  </div>
</template>

<script>
  export default {
    name: 'imglist',
    props: ['env','vipInfo'],
    data(){
      return {
      }
    },
    mounted(){

    },
    methods: {

    }
  }
</script>

<style lang="css" scoped>
  .show-img {
    width: 100%;
    padding-bottom: 50px;
  }

  .show-img-bottom {
    padding-bottom: 90px;
  }

  .show-img img {
    width: 100%;
    display: block;
  }

  .addfilter {
    -webkit-filter: blur(15px);
    filter: blur(15px);
  }
</style>