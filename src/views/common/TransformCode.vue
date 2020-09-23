<template>
    <div></div>
</template>

<script> 
    import { interfaceApi } from '../../api/api'
    export default {
        data() {
            return {
                code:  this.$route.query.code,
                appId: '',
                redirectURL: this.$route.query.redirectURL,
                url: window.location.href
            }
        },
        mounted() {
            this.handleUrl();
        },
        methods: {
            handleUrl() {
 

                if(this.code){
                    if(this.redirectURL.indexOf("?") !== -1){
                        window.location.href = `${this.redirectURL}&code=${this.code}`
                    } else {
                        window.location.href = `${this.redirectURL}?code=${this.code}`
                    }
                } else {
                    interfaceApi(this.url).then((res)=>{
                        let url = res.data.data.url
                        if(url){
                              window.location.href = url;
                        }
                    })     
                }
                 
             
                
            },
           changeUrlArg (url, arg, val){
            let pattern = `${arg}=([^&]*)`;
            let replaceText = `${arg}=${val}`;
            let defaultPattern = url.match(`[?]`)
                ? url + "&" + replaceText
                : url + "?" + replaceText;
            return url.match(pattern)
                ? url.replace(eval("/(" + arg + "=)([^&]*)/gi"), replaceText)
                : defaultPattern;
            }
        }

    }
</script>


<style lang="css" scoped>

</style>
