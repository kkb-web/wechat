/*
 * @motto: motto
 * @Author: haichen
 * @Date: 2020-04-20 16:05:38
 * @LastEditors: haichen
 * @LastEditTime: 2020-05-21 14:29:18
 */
import { timestampToTime } from "../assets/js/filter"

// 根据value返回对象的key 使用方式：findKey(obj)(value)
export const findKey = (obj) => (value, compare = (a, b) => a === b) => Object.keys(obj).find((k) => compare(obj[k], value))

export const formatTime = (UnixTime) => {
  let date = new Date(UnixTime)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? `0${m}` : m
  let d = date.getDate()
  d = d < 10 ? `0${d}` : d
  let h = date.getHours()
  h = h < 10 ? `0${h}` : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? `0${minute}` : minute
  second = second < 10 ? `0${second}` : second
  return `${y}-${m}-${d} ${h}:${minute}:${second}`
}

export const checkServer = process.browser === false && typeof window === "undefined"

/*倒计时*/
export const countTime = () => {
  //获取当前时间
  let date = new Date(),
    now = date.getTime(),
    //设置截止时间
    endDate = new Date(timestampToTime(107822).replace(/-/g, "/")),
    end = endDate.getTime(),
    // 设置开始时间
    startDate = new Date(timestampToTime(this.vipInfo.startTime).replace(/-/g, "/")),
    start = startDate.getTime(),
    //时间差
    leftTime = now >= start ? end - now : start - now
  this.begin = now >= start ? true : false
  //定义变量 d,h,m,s保存倒计时的时间
  if (parseInt(leftTime / 1000) > 0) {
    console.log(now, start, end, parseInt(leftTime / 1000), this.data.second)
    this.data.days = Math.floor(leftTime / 1000 / 60 / 60 / 24)
    this.data.hourse = Math.floor((leftTime / 1000 / 60 / 60) % 24)
    this.data.minute = Math.floor((leftTime / 1000 / 60) % 60)
    this.data.second = Math.floor((leftTime / 1000) % 60)
    this.data.days = this.data.days < 10 ? "0" + this.data.days : this.data.days
    this.data.hourse = this.data.hourse < 10 ? "0" + this.data.hourse : this.data.hourse
    this.data.minute = this.data.minute < 10 ? "0" + this.data.minute : this.data.minute
    this.data.second = this.data.second < 10 ? "0" + this.data.second : this.data.second
    this.timer = setTimeout(this.countTime, 1000)
  } else {
    //  if (this.)
    //  alert(123);
    //  /*去除遮罩层*/
    // this.vipInfo.use = 0;
    // this.end = false;
    clearTimeout(this.timer)
    setTimeout(() => {
      this.getVipcourseInfo()
    }, 2000)
  }
}


//随机生成 min 到 max 之间的整数
function random(min,max){
  return Math.floor((max-min+1)*Math.random())+min;
}

// len:生成整数的数量   start:最小值   end:最大值
export const getRandomArr = (len,start,end) => { 
  let arr=[];
  while (arr.length<len){
      let num=random(start,end);
      if(arr.indexOf(num)==-1){
          arr.push(num);
      }
  }
  return arr;
} 


// 分销生成uuid

export const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  return uuid;
}

export const isMobileLive = () => {
  let ua = navigator.userAgent.toLowerCase();
  let is_mobile =
    ua.match(
      /(ipod|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i,
    ) != null;
  let is_kkbApp = ua.indexOf('kkbmobile') !== -1;
  // if (is_mobile) {
  //   return true
  // }
  if (is_mobile && !is_kkbApp) {
    return 'AnniversaryM';  // 移动端非app
  } else if (is_mobile && is_kkbApp) {
    return 'AnniversaryAPP'; // 移动端app
  } else {
    return 'AnniversaryP';   // pc端
  }
};


export const isTopWindow = window.self === window.top

export const postMassage = (data) => window.parent.postMessage(data,'*');
export const childrenPostMassage = (data) => window.top.postMessage(data,'*');
export const getMassage = (callback) => {
  window.addEventListener('message', function(e){
    callback(e)
  }, false);
}