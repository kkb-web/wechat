<template>
    <div class="upload_success">
        <div class="upload_success_warp">
            <img src="../../assets/img/upload_success.png" alt="img" class="upload_success_img">
            <p class="upload_success_des">上传成功</p>
        </div>

    </div>
</template>

<script>
    export default {
        name: "uploadSuccess"
    }
</script>

<style scoped>
    .upload_success{
        position: absolute;
        top: 0;
        left: 0;
        width:100%;
        height: 100%;
        background: #f8f8f8;
        text-align: center;
    }
    .upload_success_warp{
        width: 350px;
        height: 200px;
        background: #fff;
        border-radius: 6px;
        margin: 10px auto;
        box-shadow: 1px 1px 12px #eaeaea;
    }
    .upload_success_img{
        width: 60px;
        height: 60px;
        margin: 50px auto 0;
    }
    .upload_success_des{
        font-size: 14px;
        text-align: center;
    }
</style>
