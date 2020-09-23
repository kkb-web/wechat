import * as crypto from "crypto";
//设置
export const setToken = (key, value) => {
    return localStorage.setItem(key, value)
};
//获取
export const getToken = (key) => {
    if (!key || key !== 'undefined') {
        return localStorage.getItem(key)
    } else {
        return false
    }
};
//删除
export const removeToken = (key) => {
    return localStorage.removeItem(key)
};

/**
 *
 *  获取加密后的uuid,截取八位;
 *  调用guid()方法生成uuid，再截取相应位数；
 */
export const randomRange = (courseid, channel,uuid,sharerunionid) => {
    let key = 'open_' + courseid + '_' + channel + '_' + uuid;
    if (sharerunionid) {
        key = key + '_' + sharerunionid;
    }
    return key;
};

/**
 *  生成32位uuid
 */
export const guid = () =>{
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};



//直播状态
export const livePlayStatus = (code) => {
    if (code === 0) {
        return {text: '已报名，等待直播中', status: 0};
    } else if (code === 1 || code === 70001) {
        return {text: '直播火热进行中，立即观看', status: 1};
    } else if (code === 2 || code === 70002) {
        return {text: '直播结束，回放生成中', status: 2};
    } else if (code === 3 || code === 70003) {
        return {text: '观看精彩直播回放', status: 3};
    } else if (code === 20001 || code === 70007 ) {
        return {text: '该课程已下架', status: 4};
    }else if(code === 20003){
        return {text: '已关注未报名', status: 3};
    } else {
        return {text: '该课程已下架', status: 4};
    }
};

export const filterEmoji = (username) => {
    let ranges = [
        '\ud83c[\udf00-\udfff]',
        '\ud83d[\udc00-\ude4f]',
        '\ud83d[\ude80-\udeff]'
    ];
    username = username.replace(new RegExp(ranges.join('|'), 'g'), '')
    return username
};
//对于emoji的表情处理
export const isEmojiCharacter = (substring) => {
    for (let i = 0; i < substring.length; i++) {
        let hs = substring.charCodeAt(i);
        if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
                let ls = substring.charCodeAt(i + 1);
                let uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                if (0x1d000 <= uc && uc <= 0x1f77f) {
                    return true;
                }
            }
        } else if (substring.length > 1) {
            let ls = substring.charCodeAt(i + 1);
            if (ls === 0x20e3) {
                return true;
            }
        } else {
            if (0x2100 <= hs && hs <= 0x27ff) {
                return true;
            } else if (0x2B05 <= hs && hs <= 0x2b07) {
                return true;
            } else if (0x2934 <= hs && hs <= 0x2935) {
                return true;
            } else if (0x3297 <= hs && hs <= 0x3299) {
                return true;
            } else if (hs === 0xa9 || hs === 0xae || hs === 0x303d || hs === 0x3030
                || hs === 0x2b55 || hs === 0x2b1c || hs === 0x2b1b
                || hs === 0x2b50) {
                return true;
            }
        }
    }
};
/*时间戳转换成时间*/
export const timestampToTime = (timestamp) => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
};
/*时间戳转换成时间*/
export const timestampToTimeCommon = (timestamp) => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes();
    var s = date.getSeconds();
    return Y + M + D + h + m;
};

/*时间戳转换成时间*/
export const timestampToTimeYMDCommon = (timestamp) => {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ?'0'+date.getDate() :date.getDate() 
    return Y + M + D
};
//直播链接
export const setLiveUrl = (url, username) => {
    let lastStr = url.charAt(url.length - 1);
    if (url.indexOf('view.csslcloud.net') !== -1) {
        if (lastStr === '?') {
            return url + 'autoLogin=true&viewername=' + encodeURIComponent(username) + '&viewertoken='
        } else {
            return url + '&autoLogin=true&viewername=' + encodeURIComponent(username) + '&viewertoken='
        }
    } else {
        return url
    }
};

// 判断是cc or classin
export const liveUrl = (url) => {
    if (url.indexOf('www.eeo.cn') !== -1) {
        return true
    } else {
        return false
    }
};

//判断pc端还是移动端
export const isMobile = () => {
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
};
//判断是不是ios
export const isIOS = ()=>{
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
        return false;
    }
    if (isIOS) {
        return true;
    }
};

/**
 * 创建和存储cookie
 * 函数中的参数分别为 cookie 的名称、值以及过期时间(秒为单位)
 */
export const setCookie = (c_name, value, expireseconds) => {
    var exdate = new Date();
    console.log((exdate.getTime() + expireseconds * 1000) / 1000);
    exdate.setTime(exdate.getTime() + expireseconds * 1000);
    document.cookie = c_name + "=" + escape(value) +
        ((expireseconds == null) ? "" : ";expires=" + exdate.toGMTString())
};

/**
 * 读取cookie值
 * 函数中的参数为 要获取的cookie键的名称
 */
export const getCookie = (c_name) => {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            let c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
};

// 设置cookie 带path
export const setCookiePath = (name, value, expires, path, domain, secure) => {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value)
    if (expires instanceof Date) {
        cookieText += '; expires=' + expires.toGMTString()
    }
    if (path) {
        cookieText += '; path=' + path
    }
    if (domain) {
        cookieText += '; domain=' + domain
    }
    if (secure) {
        cookieText += '; secure'
    }
    document.cookie = cookieText
}

//code
export const code = {
    "0": "成功",
    "51001": "账号已存在",
    "51002": "账号无效",
    "51003": "密码太简单",
    "51004": "验证失败",
    "51005": "账号不存在",
    "51006": "账号或密码错误",
    "51007": "登陆错误太多",
    "51008": "再次验证失败",
    "51009": "验证码发送失败",
    "51011": "报名失败",
    "51012": "最多修改三次",
};


export const baseUrl = () =>{
    if (process.env.NODE_ENV === 'development') {
        return  'https://consoletest.kaikeba.com';
    } else if (window.location.href.indexOf('wxtest') !== -1) {
        return 'https://consoletest.kaikeba.com';
    } else if (window.location.href.indexOf('wxpre') !== -1) {
        return 'https://consolepre.kaikeba.com';
    } else if (window.location.href.indexOf('wxdev2') !== -1) {
        return 'https://consoledev2.kaikeba.com';
    } else if (window.location.href.indexOf('wxdev') !== -1) {
        return 'https://consoledev.kaikeba.com';
    } else {
        return  'https://console.kaikeba.com';
    }
};

// 环境地址
export const projectEnv = () =>{
    if (process.env.NODE_ENV === 'development') {
        return  'dev';
    } else if (window.location.href.indexOf('wxtest') !== -1) {
        return  'test';
    }else if (window.location.href.indexOf('wxdev2') !== -1) {
        return  'dev2';
    }else if (window.location.href.indexOf('wxdev') !== -1) {
        return  'dev';
    } else if (window.location.href.indexOf('wxpre') !== -1) {
        return 'pre';
    } else {
        return  'prod';
    }
}


// 路由跳转拼接链接
export const routeUrl = () => {
    return '/';
    // if (process.env.NODE_ENV === 'development') {
    //     return '/';
    // } else {
    //     return '/courses/';
    // }

};

export const socketService = () => {
    return ["OPENCOURSE", "VIPCOURSE", "AD", "CONSOLE","MATERIALS"]
};
export const linkTowww = () =>{
    if (process.env.NODE_ENV === 'development') {
        return  'https://wwwtest.kaikeba.com/opencourses';
    } else if (window.location.href.indexOf('wxtest') !== -1) {
        return 'https://wwwtest.kaikeba.com/opencourses';
    } else if (window.location.href.indexOf('wxdev2') !== -1) {
        return 'https://wwwdev2.kaikeba.com/opencourses';
    } else if (window.location.href.indexOf('wxdev') !== -1) {
        return 'https://wwwdev.kaikeba.com/opencourses';
    } else if (window.location.href.indexOf('wxpre') !== -1) {
        return 'https://wwwpre.kaikeba.com/opencourses';
    } else {
        return  'https://www.kaikeba.com/opencourses';
    }
};
export const cashierLink = () =>{
    if (process.env.NODE_ENV === 'development') {
        return  'https://wxtest.kaikeba.com/';
    } else if (window.location.href.indexOf('wxtest') !== -1) {
        return 'https://wxtest.kaikeba.com/';
    } else if (window.location.href.indexOf('wxpre') !== -1) {
        return 'https://wxpre.kaikeba.com/';
    } else if (window.location.href.indexOf('wxdev2') !== -1) {
        return 'https://wxdev2.kaikeba.com/';
    } else if (window.location.href.indexOf('wxdev') !== -1) {
        return 'https://wxdev.kaikeba.com/';
    } else {
        return  'https://wx.kaikeba.com/';
    }
};

//加载cc授权代码
export const auth_cc = () =>{
    let head = document.getElementsByTagName('head')[0],
        scripts = document.createElement('script');
    scripts.type = 'text/javascript';
    scripts.src = 'https://view.csslcloud.net/js/_fix_.js';
    head.appendChild(scripts);
};
export const getCaption = (obj,state,Symbol)=>{
    let index=obj.indexOf(Symbol);
    if(state==0){
        obj=obj.substring(0,index);
    }else {
        obj=obj.substring(index+1,obj.length);
    }
    return obj;
};
//数组对象排序
export const compare = (obj1,obj2)=>{
    var val1 = obj1.sort;
    var val2 = obj2.sort;
    if(val1 < val2){
        return -1;
    }else if(val1 > val2){
        return 1;
    }else{
        return 0;
    }
};
export function isPcDingTalkWS(){
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0&&userAgentInfo.indexOf('DingTalk') === -1) {
            flag = false;
            break;
        }
    }
    return flag;
}

// 删除url指定参数
export function urlDelP(url,name){
    var urlArr = url.split('?');
    if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
        var query = urlArr[1];
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return urlte;
    }else{
        return url;
    }
}


export const changeUrlArg = (url, arg, val) => {
    let pattern = `${arg}=([^&]*)`;
    let replaceText = `${arg}=${val}`;
    let defaultPattern = url.match(`[?]`)
        ? url + "&" + replaceText
        : url + "?" + replaceText;
    return url.match(pattern)
        ? url.replace(eval("/(" + arg + "=)([^&]*)/gi"), replaceText)
        : defaultPattern;
};

export const getParam = (url, name)=> {
    if(url.indexOf('?') === -1){
        return null
    }else {
        let urlsearch = url.split('?');
        let pstr = urlsearch[1].split('&');
        for (let i = pstr.length - 1; i >= 0; i--) {
            let tep = pstr[i].split("=");
            if (tep[0] == name) {
                return tep[1];
            }
        }
    }
}
// 创建加密算法
export const aseEncode = data => {
    const algorithm = "aes-192-cbc";
    const password = "kkb-fe";
    const iv = Buffer.alloc(16, 0);
    const key = crypto.pbkdf2Sync(password, "kkb", 1000, 24, "sha512");
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

// 学习中心通过环境判断passpord API
export const statyPassPortApi = ()=>{
    if (process.env.NODE_ENV === 'development') {
        return 'https://test-api-passport.kaikeba.com';
    } else if (window.location.href.indexOf('wxtest') !== -1) {
        return 'https://test-api-passport.kaikeba.com';
    } else if (window.location.href.indexOf('wxpre') !== -1) {
        return 'https://test-api-passport.kaikeba.com';
    } else if (window.location.href.indexOf('wxdev2') !== -1) {
        return 'https://dev2-api-passport.kaikeba.com';
    } else if (window.location.href.indexOf('wxdev') !== -1) {
        return 'https://dev-api-passport.kaikeba.com';
    } else {
        return 'https://api-passport.kaikeba.com';
    }
}


export const payLogUrl = ['https://wxtest.kaikeba.com/opencourseapi/vipcourse/order/data/report','https://wx.kaikeba.com/opencourseapi/vipcourse/order/data/report']


// api错误上报
export const apiWarn = (data) =>{
    try {
        apm.apiWarnSpare(data)
    }catch (e) {
        apm.apiWarnSpare({
            project:data.project,
            env:data.env,
            api:data.api,
            notice:true,
            content:{
                method:data.content.method,
                status:data.content.status,
                request:'未知',
                response:data.content.response
            }
        })
    }
}
