import {urlJsapisign} from '../../api/api'
import {routeUrl,getCaption,getToken,urlDelP, changeUrlArg} from "./filter";

export const share = {
    title: '开课吧服务号',
    desc: '国内顶级专业课程讲师授课，并提供卓越的课程学习服务，只为保障每位学员的学习效果。',
    link: location.href.split('#')[0],
    imgUrl: 'https://img.kaikeba.com/logo.png',
    wxConfig: {},
    url: '',
    isWeixinBrowser: function () {
        let ua = navigator.userAgent.toLowerCase();
        return (/micromessenger/.test(ua)) ? true : false;
    },
    init: function (t, d, k, fri_t,unionId,openCourseId, channelCode) {
        let courseid = openCourseId,
            channel = channelCode,
            title = t ? t : share.title ,
            desc = d ? d : share.desc,
            key = k,
            friend_title = fri_t ? fri_t : ( t ? t : share.title),
            unionid = unionId ? unionId : null,
            sharelink = window.location.href,
            sendData = {
                url: encodeURIComponent(sharelink)
            };

            console.log(sharelink,'sharelink')
        urlJsapisign(sendData).then(res=>{
            let resData = res.data.data;
            wx.config({
                debug: false,
                appId:resData.appId,
                timestamp: resData.timestamp,
                nonceStr: resData.nonceStr,
                signature: resData.signature,
                jsApiList: [
                    'onMenuShareAppMessage',  // 分享给朋友
                    'onMenuShareTimeline',     // 分享到朋友圈
                ]
            });
            let link = null,
                imgUrl = null;
            if(resData.url.indexOf("opencourse") >= 0){
                link = window.location.origin + routeUrl() + 'opencourse/' + courseid + '?channel=' + channel +'&sharerUnionId=' + unionid;
                if(key.indexOf('http')===0){
                    imgUrl = key + '!w1h1'
                }else{
                    imgUrl = 'https://img.kaikeba.com/' + key + '!w1h1';
                }
            }else if(resData.url.indexOf("paysuccess") >= 0){
                link=`${window.location.origin}/vipcourse/${courseid}/${channel}?source_unionid=${getToken('unionid')}`;
                if(key.indexOf('http')===0){
                    imgUrl = key + '!w1h1'
                }else{
                    imgUrl = 'https://img.kaikeba.com/' + key + '!w1h1';
                }
            }else{
                link = share.link;
                if(key.indexOf('http')===0){
                    imgUrl = key + '!w1h1'
                }else{
                    imgUrl = 'https://img.kaikeba.com/' + key + '!w1h1';
                }
            }
            if(window.location.pathname.indexOf('vipcourse') >= 0){
                let shareLinks = link;
                if(link.indexOf('tenant_unionid') >= 0){
                    shareLinks = urlDelP(shareLinks,'tenant_unionid');
                }
                if(link.indexOf('code') >= 0){
                    shareLinks = urlDelP(shareLinks,'code');
                }
                if(link.indexOf('state') >= 0){
                    shareLinks = urlDelP(shareLinks,'state');
                }
                let endUrl = changeUrlArg(shareLinks,'source_unionid',getToken('unionid'))
                if(getToken('seller_id')){
                    endUrl = changeUrlArg(endUrl,'seller_id',getToken('seller_id'))
                }
                link = endUrl
            }
            wx.ready(function () {
                console.log(link,'updateAppMessageShareData')
                // 分享给朋友 updateAppMessageShareData
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl,
                });
                // updateTimelineShareData 分享朋友圈 onMenuShareTimeline
                wx.onMenuShareTimeline({
                    title: friend_title,
                    // link:  resData.url +'&sharerUnionId=' + unionid,
                    link: link,
                    imgUrl: imgUrl
                });
            })
        }).catch(err =>{
            console.log(err,'urlJsapisign')
        })
    }
};
