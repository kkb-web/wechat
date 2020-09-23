<template>
    <div class="bind">
        <div class="head">
            <div class="default" @click="toRegister()">手机号注册</div>
            <div class="default headActive">手机号登录</div>
        </div>
        <div class="line">
            <div class="line-right"></div>
        </div>
        <div class="login">
            <div class="telephone">
                <input @blur="checkPhoneNum()" v-model="phoneNumber" class="input" type="tel" placeholder="请输入手机号"
                       value="请输入手机号"/>
                <p class="tips" v-show="!isRegister">
                    该手机号还不是开课吧账号，<span @click="toRegister()" style="color:#00AFF2">去注册</span>
                </p>
                <p class="tips" v-show="phoneErrMsg != ''" v-text="phoneErrMsg"/>
            </div>
            <div class="password">
                <input id="pwd" @blur="checkPassword()" v-model="password" class="input" type="password"
                       placeholder="请输入官网登录密码" value="请输入官网登录密码"/>
                <p class="tips" v-show="pwdErrMsg != ''" v-text="pwdErrMsg"/>
            </div>
            <button class="btn" @click="login()">完成报名</button>
        </div>
    </div>
</template>

<script>
    import {urlPhoneNum, urlPhoneLogin, urlBind} from '../../../api/api';
    import {Toast} from 'we-vue';
    import {code, routeUrl} from '../../../assets/js/filter';
    import {axiosHttp} from '../../../api/api';
    import {getToken} from "../../../assets/js/filter";
    import axios from 'axios';

    let counts = 0;
    export default {
        name: "login",
        data() {
            return {
                isRegister: true,
                phoneNumber: '',
                password: '',
                phoneErrMsg: '',
                pwdErrMsg: '',
                token: '',
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
                    }
                }

            }
        },
        methods: {
            // 切换到注册页面
            toRegister() {
                this.$router.push({path: routeUrl() + 'register', query: {orderId: this.orderId}});
            },
            // 验证手机号
            checkPhoneNum() {
                let value = this.rule['phoneNumber'];
                if (this.phoneNumber === '') {
                    this.phoneErrMsg = value.requiredMsg;
                    this.isRegister = true;
                    return false;
                } else if (!value.rule.test(this.phoneNumber)) {
                    this.phoneErrMsg = value.message;
                    this.isRegister = true;
                    return false;
                } else {
                    // 调接口验证用户输入的手机号是否已注册
                    let obj = {
                        username: this.phoneNumber
                    };
                    urlPhoneNum(obj).then(res => {
                        // 手机号未注册，提示去注册
                        if (res.data.error_code === 0) {
                            this.phoneErrMsg = '';
                            this.isRegister = false;
                            return false;
                        }
                        // 手机号已注册，直接输入密码
                        if (res.data.error_code === 51001) {
                            this.phoneErrMsg = '';
                            this.isRegister = true;
                            this.token = 'access_token'
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }
                return true;
            },
            // 验证密码输入是否为空
            checkPassword() {
                let value = this.rule['password'];
                if (this.password === '') {
                    this.pwdErrMsg = value.requiredMsg;
                    return false;
                } else if (!value.rule.test(this.password)) {
                    this.pwdErrMsg = value.message;
                    return false;
                }
                return true;
            },
            // 登录完成报名
            login() {
                if(this.phoneErrMsg || this.pwdErrMsg) {
                    if (!this.phoneNumber) {
                        let value = this.rule['phoneNumber'];
                        this.phoneErrMsg = value.requiredMsg;
                    }
                    if (!this.password) {
                        let value = this.rule['password'];
                        this.pwdErrMsg = value.requiredMsg;
                    }
                } else {
                    //  手机号和密码验证通过，点击完成报名提交
                    // 调接口验证用户输入的密码是否正确
                    counts++;
                    let obj = {
                        username: this.phoneNumber,
                        password: this.password,
                        orderid: this.orderId,
                    };
                    if (counts < 5) {
                        if (this.token === 'access_token') {
                            urlPhoneLogin(obj).then(res => {
                                // 密码正确，直接登录
                                if (res.data.error_code === 0) {
                                    let obj = {
                                        openid: getToken('openid'),
                                        orderid: this.orderId
                                    };
                                    // 登录成功，跳转绑定成功页面
                                    urlBind(obj).then(res => {
                                        this.$router.push({path: routeUrl() + 'bindsuccess', query: {username: this.phoneNumber,code:sessionStorage.getItem('courseCode'),channel:sessionStorage.getItem("channelCode")}});
                                    });
                                } else if (code[res.data.error_code]) {
                                    Toast.text({
                                        duration: 2000,
                                        message: code[res.data.error_code]
                                    });
                                    // 密码错误，选中密码，再次输入清空
                                    document.getElementById('pwd').select();
                                    this.pwdErrMsg = '密码错误，请重新输入';
                                } else {
                                    // 登录失败，跳转绑定失败页面
                                    this.$router.push({path: routeUrl() + 'bindfailure', query: {orderid: this.orderId}})
                                }
                            }).catch(err => {
                                console.log(err)
                            });
                        } else {
                            console.log('手机验证码出错');
                        }
                    } else {
                        Toast.text({
                            duration: 2000,
                            message: '请去官网找回密码！'
                        })
                    }
                }
            }
        },
        watch: {
            phoneNumber: function () {
                if (this.checkPhoneNum) {
                    this.phoneErrMsg = ''
                }
            },
            password: function () {
                if (this.checkPassword) {
                    this.pwdErrMsg = ''
                }
            },
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

    .telephone, .password {
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

</style>
