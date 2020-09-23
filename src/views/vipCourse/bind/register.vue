<template>
    <div class="bind">
        <div class="head">
            <div class="default headActive">手机号注册</div>
            <div class="default" @click="toLogin()">手机号登录</div>
        </div>
        <div class="line">
            <div class="line-left"></div>
        </div>
        <div class="register">
            <div class="telephone">
                <input @blur="checkPhoneNum()" v-model="phoneNumber" class="input" type="tel" placeholder="请输入手机号" value="请输入手机号" :disabled="isCounting"/>
                <p class="tips" v-show="isRegister">
                    该手机号已注册，<span @click="toLogin()" style="color:#00AFF2">去登录</span>
                </p>
                <p class="tips" v-show="phoneErrMsg != ''" v-text="phoneErrMsg" />
            </div>
            <div class="code">
                <input @blur="checkCode()" v-model="captcha" class="input input-code" type="number" placeholder="请输入验证码" value="请输入验证码" />
                <button @click="getCode()" v-text="codeBtn" :class="{btnActive: !isClick}" class="btn-code">获取验证码</button>
                <p class="tips" v-show="codeErrMsg != ''" v-text="codeErrMsg"/>

            </div>
            <div class="password">
                <input @blur="checkPassword()" v-model="password" class="input" type="password" placeholder="设置安全密码，6-16位，字母区分大小写" value="设置安全密码，6-16位，字母区分大小写" />
                <p class="tips" v-show="pwdErrMsg != ''" v-text="pwdErrMsg" />
            </div>
            <button class="btn" @click="register()">完成报名</button>
        </div>
    </div>
</template>

<script>
    import {urlPhoneNum, urlPhoneRegister, urlGetCaptcha, urlcheckCaptcha, urlBind} from '../../../api/api';
    import {Toast} from 'we-vue';
    import {code, routeUrl, getToken} from '../../../assets/js/filter';
    export default {
        name: "register",
        data() {
            return {
                isRegister: false,
                isClick: false,
                isCounting: false,
                phoneErrMsg: '',
                pwdErrMsg: '',
                codeErrMsg: '',
                phoneNumber: '',
                captcha: '',
                password: '',
                token: '',
                codeBtn: '获取验证码',
                orderId: this.$route.query.orderId,
                rule: {
                    phoneNumber: {
                        rule: /^1[1-9][0-9]\d{8}$/,
                        message: '手机号格式不正确',
                        requiredMsg: '手机号不能为空'
                    },
                    password: {
                        rule: /^\S{6,16}$/,
                        message: '请输入6-16位密码，不能使用空格！',
                        requiredMsg: '密码不能为空'
                    },
                    captcha: {
                        rule: /^(\d){4}$/,
                        message: '验证码格式不正确',
                        requiredMsg: '验证码不能为空'
                    }
                }
            }
        },
        methods: {
            // 跳转到登录页面
            toLogin() {
                this.$router.push({path: routeUrl() + 'login', query: {orderId: this.orderId}});
            },
            // 验证手机号
            checkPhoneNum() {
                let value = this.rule['phoneNumber'];
                if(this.phoneNumber === '') {
                    this.phoneErrMsg = value.requiredMsg;
                    this.isRegister = false;
                    this.isClick = false;
                    return false;
                } else if(!value.rule.test(this.phoneNumber)) {
                    this.phoneErrMsg = value.message;
                    this.isRegister = false;
                    this.isClick = false;
                    return false;
                } else {
                    // 调接口验证用户输入的手机号是否已注册
                    let obj = {
                        username: this.phoneNumber
                    };
                    urlPhoneNum(obj).then(res => {
                        // 手机号未注册，可以获取验证码
                        if(res.data.error_code === 0) {
                            this.phoneErrMsg = '';
                            this.isRegister = false;
                            this.isClick = true;
                            console.log('3',this.isClick);
                        }
                        // 已注册，提示跳转登录页面
                        if(res.data.error_code === 51001) {
                            this.phoneErrMsg = '';
                            this.isRegister = true;
                            this.isClick = false;
                            this.token = 'access_token'
                            return false;
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
                return true;
            },
            // 验证手机验证码
            checkCode() {
                let value = this.rule['captcha'];
                if(this.captcha === '') {
                    this.codeErrMsg = value. requiredMsg;
                    return false;
                } else if(!value.rule.test(this.captcha)) {
                    this.codeErrMsg = value.message;
                    return false;
                } else {
                    // 调接口验证用户输入的验证码是否正确
                    let obj = {
                        mobile: this.phoneNumber,
                        code: this.captcha
                    };
                    urlcheckCaptcha(obj).then(res => {
                        // 验证码正确，去设置密码
                        if(res.data.error_code === 0) {
                            this.codeErrMsg = '';
                        } else if(res.data.error_code === 51004) {
                            // 验证码不正确
                            this.codeErrMsg = '验证码有误，请再次输入';
                            return false;
                        }
                    }).catch(err => {
                        console.log(err);
                    })
                }
                return true;

            },
            // 获取手机验证码
            getCode() {
                // 调接口获取验证码
                if (!this.isClick) {
                    return false
                }
                let obj = {
                    mobile: this.phoneNumber
                };
                urlGetCaptcha(obj).then(res => {
                    if (res.data.error_code === 0) {
                        // 60s倒计时
                        this.countDown();
                    }else if (res.data.error_code === 51009) {
                        Toast.text({
                            duration: 2000,
                            message: '验证码发送失败'
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 60s倒计时
            countDown() {
                let that = this;
                let num = 60;
                this.isCounting = true;
                this.isClick = false;
                clearInterval(that.timer);
                this.timer = setInterval(function () {
                    that.codeBtn = num + 's后重试';
                    num--;
                    if(num <= 0) {
                        that.isCounting = false;
                        that.isClick = true;
                        that.codeBtn = '重新获取';
                        clearInterval(that.timer);
                        console.log('4',this.isClick);
                        return true;
                    }
                }, 1000);
                return false;
            },
            // 验证用户密码格式
            checkPassword() {
                let value = this.rule['password'];
                if(this.password === '') {
                    this.pwdErrMsg = value.requiredMsg;
                    return false;
                } else if (!value.rule.test(this.password)) {
                    this.pwdErrMsg = value.message;
                    return false;
                }
                return true;
            },
            // 注册完成报名
            register() {
                // 手机号，验证码，密码为空时，点击完成报名时提示XXX不能为空
                if(!this.phoneNumber || !this.captcha || !this.password) {
                    if(!this.phoneNumber) {
                        let value = this.rule['phoneNumber'];
                        this.phoneErrMsg = value.requiredMsg;
                    }
                    if(!this.captcha) {
                        let value = this.rule['captcha'];
                        this.codeErrMsg = value.requiredMsg;
                    }
                    if(!this.password) {
                        let value = this.rule['password'];
                        this.pwdErrMsg = value.requiredMsg
                    }
                } else if(this.checkPhoneNum && this.checkPassword && this.checkCode) {
                    //  手机号、验证码和密码验证通过，点击完成报名提交
                    let obj = {
                        username: this.phoneNumber,
                        password: this.password,
                        verifycode: this.captcha,
                        orderid: this.orderId,
                    };
                    urlPhoneRegister(obj).then(res => {
                        if(res.data.error_code === 0) {
                            let obj = {
                                openid: getToken('openid'),
                                orderid: this.orderid
                            };
                            // 注册成功，跳转绑定成功页面
                            urlBind(obj).then(res => {
                                this.$router.push({path: routeUrl() + 'bindsuccess', query: {username: this.phoneNumber}});
                            });
                        } else if (code[res.data.error_code]) {
                            Toast.text({
                                duration: 2000,
                                message: code[res.data.error_code]
                            });
                        } else {
                            // 注册失败，跳转绑定失败页面
                            this.$router.push({path: routeUrl() + 'bindfailure', query: {orderid: this.orderId}})
                        }
                    });
                }
            }
        },
        watch: {
            phoneNumber: function (e) {
                if(e.length >= 11 && this.checkPhoneNum(e) ) {
                    this.phoneErrMsg = '';
                        this.isClick = true;
                        console.log('5',this.isClick);
                    } else {
                        this.isClick = false;
                    }

            },
            password: function () {
                if(this.checkPassword) {
                    this.pwdErrMsg = ''
                }
            },
            captcha: function () {
                if(this.checkCode) {
                    this.codeErrMsg = ''
                }
            }
        }
    }
</script>

<style scoped>
    .bind {
        padding: 6% 10%;
    }
    .head {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        border-bottom: 1px solid #EDEDED;
    }
    .default {
        width: 50%;
        font-size: 1rem;
        text-align: center;
        padding: 20px 10px;
        font-weight: 700;
    }
    .headActive {
        color: #04B1F3;
    }
    .line {
        width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        margin-bottom: 32px;
        position: relative;
        top: -2.5px;
        left: 0;
    }
    .line-left {
        width: 50%;
        float: left;
        height: 5px;
        background: #00AFF2;
        border-radius: 3px;
    }
    .line-right {
        width: 50%;
        float: right;
        height: 5px;
        background: #00AFF2;
        border-radius: 3px;
    }

    .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        border: none;
        border-radius: 21px;
        font-size: 14px;
        color: #ffffff;
        margin-top: 20%;
        background: -webkit-linear-gradient(#00AFF2, #3DC8FD); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(#00AFF2, #3DC8FD); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(#00AFF2, #3DC8FD); /* Firefox 3.6 - 15 */
        background: linear-gradient(#00AFF2, #3DC8FD); /* 标准的语法 */
        font-weight: 700;
    }
    .telephone, .code, .password {
        height: 36px;
        margin-bottom: 24px;
        position: relative;
        line-height: 0;
    }
    .tips {
        position: absolute;
        top: 48px;
        left: 18px;
        color: red;
        font-size: 12px;
        text-align: left;
    }
    .input {
        width: 100%;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        height: 36px;
        border-radius: 20px;
        padding-left: 6%;
        outline: none;
        text-align: left;
        background-color: #F6F6F6;
        border: none;
        font-size: 14px;
    }
    .btnActive {
        background-color: #C3C3C3 !important;
    }
    .btn-code {
        position: absolute;
        right: 0;
        top: 0px;
        height: 36px;
        border-radius: 20px;
        width: 38%;
        height: 36px;
        line-height: 36px;
        margin-top: 0;
        font-size: 14px;
        border: none;
        background-color: #00AFF2;
        color: #ffffff;
    }


</style>