<template>
    <div class="dialog">
        <div class="dialog-cover back"  v-if="isShow"  @click="closeMyself"></div>
        <transition name="drop">
            <div class="dialog-content" :style="{top:topDistance+'%',width:widNum+'%',left:leftSite+'%',height:hNum+'px'}"  v-if="isShow">
                <div  class="foot_close">
                    <img @click="closeMyself" src="https://img.kaikeba.com/btn_wap_close_normal@3x.png">
                </div>
                <div class="dialog_box">
                    <div class="dialog_head back">
                        <slot name="header">提示信息</slot>
                    </div>
                    <div class="dialog_main" :style="{paddingTop:pdt+'px',paddingBottom:pdb+'px'}">
                        <slot name="main">弹窗内容</slot>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>


<script>
    /** 弹窗组件*/
    export default {
        name: "dialog",
        props: {
            isShow: {
                type: Boolean,
                default: false,
                required: true
            },
            widNum: {
                type: Number,
                default: 86.5
            },
            hNum: {
                type: Number,
                default: 428
            },
            leftSite: {
                // 左定位
                type: Number,
                default: 6.5
            },
            topDistance: {
                //top上边距
                type: Number,
                default: 13.1
            },
            pdt: {
                //上padding
                type: Number,
                default: 0
            },
            pdb: {
                //下padding
                type: Number,
                default: 0
            }
        },
        methods: {
            closeMyself() {
                this.$emit("on-close");
            }
        }
    };
</script>

<style lang="css" scoped>
    .drop-enter-active {
        transition: all 0.1s ease;
    }
    .drop-leave-active {
        transition: all 0.1s ease;
    }
    .drop-enter {
        /*opacity: 0;*/
        transform: translateY(-500px);
    }
    .drop-leave-active {
        transform: translateY(-500px);
        /*opacity: 0;*/
    }
    .dialog {
        position: relative;
        color: #2e2c2d;
        font-size: 16px;
    }
    .dialog-cover {
        background: rgba(0, 0, 0, 0.8);
        position: fixed;
        z-index: 200;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .dialog-content {
        position: fixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 300;
        background-color: #ffffff;
        border-radius: 8px;
        overflow-y: auto;
        box-sizing: border-box;
        padding-bottom: 16px;
        -webkit-overflow-scrolling: touch;
    }
    .dialog-content .dialog_head {
        width: 86.5%;
        /*height: 43px;*/
        display: flex;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 17px;
        color: #000000;
        line-height: 17px;
        font-weight: 500;
        margin: 0 auto;
        margin-top: 2px;
        margin-bottom: 12px;
    }
    .dialog-content .dialog_main {
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-content: center;
        width: 86.5%;
        padding: 22px 0 47px 0;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        margin: 0 auto;
    }
    .dialog-content .foot_close {
        width: 100%;
        height: 44px;
        background: #ffffff;
    }
    .dialog-content .foot_close img{
        width: 26.8px;
        height: 26.8px;
        margin-left: 12px;
        margin-top: 12px;

    }
    .dialog_box{
        width: 100%;
        height: auto;
        overflow-y: auto;
        padding-bottom: 20px;
    }
</style>