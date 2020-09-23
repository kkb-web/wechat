/**
 * 当前文件的函数仅针对授权获取并保存openid和unionid以备其他页面使用, all by zqy
 * 用法：
 * 1.在使用页面的script中引入以下两句
 * import Authorize from '../assets/js/userAuthorize'
 var authorize = new Authorize();
 2.在mounted周期中
 mounted(){
      let opt=this.$route.query.code;
      authorize.judgeCode(opt);
    }
 3.获取openid或者unionid
 authorize.getOpenid()
 authorize.getUnionid()
 */

import {urlAccess,urlAccessOpen,urlUserInfoByOpen,urlUserInfoByUnion,getWechatCode} from '../../api/api'
import {getToken, getParam} from "./filter";
import {Toast} from 'we-vue'

class Authorize {
    constructor() {
        this.code = null;
        this.openid = getToken('openid');
        this.unionid = getToken('unionid');
        this.count = 0;
    }

    //判断空值和非空值
    isEmpty(param) {
        if (param == null || typeof(param) == "undefined" || param == '' || param == 'undefined') {
            return true;
        }
        return false;
    }

    //含有code 通过code获取openid
    codeGetAccess(code,fn1) {
        let sendData = {
            code: code
        };
        urlAccessOpen(sendData).then(response => {
            let resData = response.data.data;
            this.openid = resData.openid;
            fn1(resData.openid);
        }).catch(err => {
            console.log(err)
            // this.obtainGetCode();
        });
    }

    //没有code 则先通过请求获取code
    obtainGetCode(){
        let baseurl = '';
        if (process.env.NODE_ENV === 'development' || window.location.href.indexOf('wxtest') !== -1) {
            baseurl = '/api';
        } else {
            if (window.location.href.indexOf('wxpre') !== -1) {
                baseurl = '/api';
            }else if (window.location.href.indexOf('wxdev2') !== -1) {
                baseurl = '/opencourseapi';
            }else if (window.location.href.indexOf('wxdev') !== -1) {
                baseurl = '/opencourseapi';
            } else {
                baseurl = '/opencourseapi';
            }
        }

        let url = location.href;
        if(url.includes('?code')){
            console.log('无效的code');
            let pos = url.indexOf('?code');
            if (pos >= 0) {
                url = url.substr(0, pos);
            }
        }else {
            url = location.href;
        }
        if(getParam(url,'state') !== undefined){
            url = url.slice(0, url.lastIndexOf('state'));
        }
        const codeData = {
            scope:'snsapi_base',
            state:'kkb',
            redirectURI:url,
            appId:getToken('tenant')
        }
        getWechatCode(codeData).then(res=>{
            if(res.data.code === 0){
                window.location = res.data.data
            }
        })
    }

}
export {Authorize}
