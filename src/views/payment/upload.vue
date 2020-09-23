<template>
    <div class="upload_bg">
        <div v-show="showUpload">
            <p class="upload_warp">
                <input type="file" accept="image" class="upload_file"  @change="upload" multiple>
                <img src="../../assets/img/upload_img.png" alt="img" class="upload_img">
            </p>
            <p class="upload_des">选择付款截图</p>
        </div>
        <div v-show="showPicture">
            <p>
                <input type="file" accept="image" class="upload_file_again" @change="upload">
                <img src="../../assets/img/upload_again.png" alt="img" class="upload_img_again">
            </p>
            <div class="upload_picture" :style="'backgroundImage:url('+headerImage+')'"></div>
            <p class="upload_btn" @click="postImg">上传</p>
            <wv-spinner v-show="uploadWaiting" color="#C2C2C2" type="dot-circle" slot="ft" :size="40" class="spin"></wv-spinner>
        </div>

    </div>
</template>

<script>
    import {Toast} from 'we-vue';
    import {requestData} from "../../assets/js/qiniu";
    import {uploadPayPicture} from "../../api/api";
    import {routeUrl} from "../../assets/js/filter";
    export default {
        name:"upload",
        data () {
            return {
                headerImage: '',
                picValue: '',
                showUpload: true,
                showPicture: false,
                uploadWaiting: false
            }
        },
        mounted () {
        },
        methods: {
            upload (e) {
                let files = e.target.files || e.dataTransfer.files;
                if (!files.length) return;
                this.picValue = files[0];
                if(this.picValue){
                    this.imgPreview(this.picValue);
                }
            },
            imgPreview (file) {
                let _this = this;
                // 看支持不支持FileReader
                if (!file || !window.FileReader) return;
                console.log(file.type);
                if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
                    // 创建一个reader
                    let reader = new FileReader();
                    // 将图片2将转成 base64 格式
                    reader.readAsDataURL(file);
                    // 读取成功后的回调
                    reader.onloadend = function () {
                        let result = this.result;
                        let img = new Image();
                        img.src = result;
                        _this.headerImage = this.result;
                        _this.showPicture = true;
                        _this.showUpload = false;
                    }
                } else {
                    Toast.fail({
                        duration: 1500,
                        message: '请上传格式为png/jpg的图片'
                    })
                }
            },
            postImg () {
                this.uploadWaiting = true;
                // 图片上传到七牛，同时插到数据库
                requestData(this.picValue).then(res => {
                    this.uploadWaiting = false;
                    if (res.data.key) {
                        console.log(this.$route.params.id);
                        uploadPayPicture({
                            uuid: this.$route.params.id,
                            certificate: res.data.key
                        }).then(res => {
                            if (res.data.code === 0) {
                                this.$router.push({path: routeUrl() + 'uploadsuccess'})
                            } else {
                                Toast.fail({
                                    duration: 1500,
                                    message: res.data.msg
                                })
                            }
                        })
                    }
                });
            },
        }
    }
</script>

<style>
    .upload_bg{
        width:100%;
        height: 100%;
        background: #f8f8f8;
    }
    .upload_warp{
        width: 122px;
        height: 122px;
        margin: 0 auto 0;
        padding-top: 192px;
    }
    .upload_file{
        position: absolute;
        width: 120px;
        height: 120px;
        opacity: 0;
        z-index: 100;
    }
    .upload_img{
        position: absolute;
        width: 120px;
        height: 120px;
        /*margin-top: 192px;*/
    }
    .upload_des{
        text-align: center;
        color: #B4B4B4;
        font-size: 14px;
        margin-top: 6px;
    }
    .upload_picture{
        width: 342px;
        height: 342px;
        /*border: 1px solid #979797;*/
        box-shadow: 1px 1px 10px #b8b8b8;
        border-radius: 6px;
        margin: 10px auto;
        padding: 6px;
        background-repeat: no-repeat;
        background-size: cover;
    }
    .upload_btn{
        width: 334px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        background: -webkit-linear-gradient(left, #2ED2A6 , #08B4EB); /* Safari 5.1 - 6.0 */
        background: linear-gradient(to right, #2ED2A6 , #08B4EB); /* 标准的语法 */
        border-radius: 30px;
        font-size: 14px;
        color: #fff;
        margin: 36px auto;
    }
    .upload_file_again{
        position: absolute;
        width: 34px;
        height: 34px;
        opacity: 0;
        z-index: 100;
        right: 20px;
        top: 20px;
    }
    .upload_img_again{
        position: absolute;
        width: 34px;
        height: 34px;
        right: 20px;
        top: 20px;
    }
    .spin{
        position: fixed;
        margin-left: calc(50% - 20px);
        top: 150px;
        z-index: 100;
    }
</style>
