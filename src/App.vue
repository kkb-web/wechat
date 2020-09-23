<template>
  <div id="app" v-wechat-title="$route.meta.title">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted(){

  },
  created(){
  },
  errorCaptured(e){

  }


}
</script>

<style>
  html,body{
    width: 100%;
    height: 100%;
  }
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
