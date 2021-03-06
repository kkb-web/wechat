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

import {urlAccess,urlUserInfoByOpen,urlUserInfoByUnion} from '../../api/api'
import {getToken , setToken,auth_cc} from "./filter";
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

  //1.授权获取code 判断是否含有openid或者unionid,如果没有code则请求获取code，如果有code则获取 openid

  //含有code 通过code获取openid
  codeGetAccess(code,fn1) {
    let sendData = {
      code: code
    };
    // alert(code + '/' + "=========未请求的code");
    urlAccess(sendData).then(response => {
      let resData = response.data.data;
      console.log('resData',resData)
      // alert(resData.unionid)
      //   alert(resData.openid)
      // alert(code + '/' + JSON.stringify(response))
      //如果请求没有成功返回错误码则再去获取code
      if(this.isEmpty(resData.unionid) && this.isEmpty(resData.openid) ){
          this.obtainGetCode();
      }else{
          resData.unionid && setToken('unionid', resData.unionid);
          resData.openid && setToken('openid', resData.openid);
          resData.unionid && setToken('living-unionid', resData.unionid);
          resData.openid && setToken('living-openid', resData.openid);
      }
      this.openid = resData.openid;
      this.unionid = resData.unionid;
      this.getUserInfo(this.openid);
      fn1(this.openid);
      if(window.location.href.indexOf('opencourse') > -1){
          auth_cc();
      }
    }).catch(err => {
        this.obtainGetCode();
    });
  }



  //没有code 则先通过请求获取code
  obtainGetCode(){
    debugger
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
        //如果存在?code=CODE&state=STATE 应该去掉code(code只能使用一次，5分钟未被使用自动过期)
      if(url.includes('?code')){
          console.log('无效的code');
          let pos = url.indexOf('?code');
          if (pos >= 0) {
            url = url.substr(0, pos);
          }
      }else {
          url = location.href;
      }
      if (url.lastIndexOf('state') !== -1) {
          url = url.slice(0, url.lastIndexOf('state'));
      }
      let scopeType = 'snsapi_userinfo';
      if(url.indexOf('weightQrcode') > -1 || getToken('tenant_unionid_type') === 'snsapi_base'){
          scopeType = 'snsapi_base';
      }

      window.location = '//' + window.location.host  +  baseurl + '/wechat/redirect?scope='+ scopeType +'&state=kkb&redirectURI=' + encodeURIComponent(url);
  }

  //获取用户信息
  getUserInfo (id) {
    let sendData = {
      openid: id
    };
      urlUserInfoByOpen(sendData).then(res => {
        if (!res || res === 'undefined') {
            if (this.count > 3) {
                Toast({
                    duration: 1500,
                    message: '获取用户信息失败，请稍后再试！'
                })
            } else {
                this.getUserInfo();
                this.count++;
            }
        }
      //获取用户信息，在支付页面的错误显示中使用
      let nickname = res.data.nickname,
          headimgurl = res.data.headImgUrl;
      setToken('username', nickname);
      setToken('headimgurl', headimgurl);
    }).catch(err => {
      console.log('获取用户信息失败',err)
    })

  };

  getUserInfoByUnion(){
      let sendData = {
          unionid: getToken('unionid')
      };
      urlUserInfoByUnion(sendData).then(res =>{
          if (!res || res === 'undefined') {
              if (this.count > 3) {
                  Toast({
                      duration: 1500,
                      message: '获取用户信息失败，请稍后再试！'
                  })
              } else {
                  this.getUserInfo();
                  this.count++;
              }
          }
          //获取用户信息，在支付页面的错误显示中使用
          let nickname = res.data.nickname,
              headimgurl = res.data.headimgurl;

          setToken('username', nickname);
          setToken('headimgurl', headimgurl);
      }).catch(err =>{
          console.log('获取用户信息失败unionid',err)
      })
  }

}
export {Authorize}
