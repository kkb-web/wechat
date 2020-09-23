<template>
    <div class="vipcourseall">
        <div class="list">
            <ul class="list-ul">
                <li @click="linkToVipcourse(item)" v-for="(item,$index) in list"
                    class="list-li">
                    <img class="img" :src="handImgs(item.icon)"/>
                    <p class="name">{{item.name}}</p>
                    <!--<div class="information">-->
                    <!--<p class="price">价格：<span>{{item.price}}元</span></p>-->
                    <!--<span class="orderStatus yes" v-if="item.orderStatus == 1">已报名</span>-->
                    <!--<span class="orderStatus no" v-else>去报名</span>-->
                    <!--</div>-->
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {Authorize} from "../../assets/js/userAuthorize"
    import {getToken, routeUrl} from "../../assets/js/filter";
    import {getVipcourseList} from "../../api/api"
    //实例化 authorize
    var authorize = new Authorize();
    let sendData = {
        size: 10,
        current: 1,
        condition: {}
    };
    export default {
        name: "vipcourseAll",
        data() {
            return {
                testData: [
                    {
                        id: 2,
                        name: 'cds',
                        url: 'vv822j9gwk/fztp780zuu',
                        icon: 'https://img.kaikeba.com/web_vip.png'
                    },
                    {
                        id: 3,
                        name: '江海燕',
                        url: '20o31gzd4k/t341n83dj8',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },
                    {
                        id: 4,
                        name: '测试整体流程1',
                        url: 'l7dnkklyqf/2lvp4zpmzh',
                        icon: 'https://img.kaikeba.com/million.png'
                    },
                    {
                        id: 5,
                        name: '测试整体流程',
                        url: 't31zwxjxw4/i0wf4d7g4c',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },{
                        id: 6,
                        name: '测试渠道推广PVUV，请勿操作此条数据',
                        url: 'edpxxre5fz/d3vtkmlekb',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },{
                        id: 7,
                        name: '测试支付金额',
                        url: 'g8l601ar80/qal2jbnnzb',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },{
                        id: 8,
                        name: '测试PV、UV',
                        url: '6qh2tjdt51/s7qrt4kf40',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },{
                        name: 'Web前端高级工程师',
                        url: '2i5e4am5dp/46u7cn7qm0',
                        icon: 'https://img.kaikeba.com/javascript_bg02.png'
                    },{
                        name: 'JavaEE 企业级开发工程师',
                        url: 'frmg47ptn7/5dqwfqyyey',
                        icon: 'https://img.kaikeba.com/javascript_bg02.png' // 缺
                    },
                ],
                preData:[

                ],
                data: [
                    {
                        name: 'Web全栈架构师',
                        url: '9qni5vi6s6/7byjwbcurx',
                        icon: 'https://img.kaikeba.com/web_vip.png'
                    },
                    {
                        name: 'JavaEE 企业级分布式高级架构师',
                        url: 'ckbeln6rwn/n5eipzrrnh',
                        icon: 'https://img.kaikeba.com/java_vip.png'
                    },
                    {
                        name: '百万架构师',
                        url: '29yy2x45re/5f364dm1cl',
                        icon: 'https://img.kaikeba.com/million.png'
                    },
                    {
                        name: 'UXD全栈设计师实战课',
                        url: 'w6bsn53tin/fmqct0zwl1',
                        icon: 'https://img.kaikeba.com/new_logo/uxd.png'
                    },
                    {
                        name: '产品经理核心能力训练营',
                        url: '690qd9zkjw/rd56zufmip',
                        icon: 'https://img.kaikeba.com/kkb_www_index_pm_bg.png'
                    },
                    {
                        name: '数据分析全栈工程师',
                        url: 'r6dk3mxa9k/ljh2nl0nrh',
                        icon: 'https://img.kaikeba.com/python_vip_new.png'
                    },
                    {
                        name: '大数据开发高级工程师',
                        url: 'g1xvz7j3h8/z0kj7d0qh0',
                        icon: 'https://img.kaikeba.com/kkb_wx_vipcourse_dashuju02.png'
                    },
                    {
                        name: 'Web前端高级工程师',
                        url: '2i5e4am5dp/46u7cn7qm0',
                        icon: 'https://img.kaikeba.com/new_logo/senior_web.png'
                    },
                    {
                        name: 'JavaEE 企业级开发工程师',
                        url: 'frmg47ptn7/5dqwfqyyey',
                        icon: 'https://img.kaikeba.com/new_logo/javaee_logo.png'
                    },
                    {
                        name: '数据挖掘工程师实战',
                        url: 'zywbbv01s3/k13i8fz0w1',
                        icon: 'https://img.kaikeba.com/cd2cb0dd-3d0f-47a3-a4b9-7a88b3fe9895.png'
                    },
                    {
                        name: '全能UI设计精品班',
                        url: 'nzl7c2f55e/chghxk77ww',
                        icon: 'https://img.kaikeba.com/new_logo/new_ui.png'
                    },
                    {
                        name: '人工智能专项进阶课程',
                        url: 'e1uq6wpinf/oay4xgcgru',
                        icon: 'https://img.kaikeba.com/new_logo/ai_senior.png'
                    },
                    {
                        name: '百度官方认证资深AI工程师',
                        url: '14jg88osak/n102927nz0',
                        icon: 'https://img.kaikeba.com/new_logo/ai_new.png'
                    },
                    {
                        name: '互联网设计师插画实战班',
                        url: 'siekkcp0e3/61t5apeyfd',
                        icon: 'https://img.kaikeba.com/Illustration.png'
                    }
                ],
                list: []
            }
        },
        created() {

        },
        mounted() {
            if (process.env.NODE_ENV === 'development' || window.location.href.indexOf('wxtest') !== -1) {
                this.list = this.data;
            } else {
                if (window.location.href.indexOf('wxpre') !== -1) {
                    this.list = this.data;
                } else {
                    this.list = this.data;
                }
            }
            // if (getToken('unionid') && getToken('openid')) {
            //     this.getVipcourseList();
            // } else {
            //     if (authorize.isEmpty(this.code)) {
            //         authorize.obtainGetCode();
            //     } else {
            //         authorize.codeGetAccess(this.code, this.getVipcourseList);
            //     }
            // }
        },
        methods: {
            //展现图片
            handImgs(imgs) {
                return imgs;
            },
            //请求列表
            getVipcourseList() {
                let data = {
                    id: getToken('unionid'),
                    data: sendData
                };
                getVipcourseList(data).then(res => {
                    if (res.data.code == 0) {
                        this.list = res.data.data.records
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            //跳转到vip课详情页面
            linkToVipcourse(item) {
                let url = '';
                if (process.env.NODE_ENV === 'development') {
                    // url = 'http://192.168.87.190:8080';
                    // url = 'https://wxtest.kaikeba.com';
                    url = location.origin
                } else {
                    if (window.location.href.indexOf('wxpre') !== -1) {
                        url = 'https://wxpre.kaikeba.com';
                    } else if (window.location.href.indexOf('wxtest') !== -1){
                        url = 'https://wxtest.kaikeba.com';
                    } else if (window.location.href.indexOf('wxdev2') !== -1){
                        url = 'https://wxdev2.kaikeba.com';
                    } else if (window.location.href.indexOf('wxdev') !== -1){
                        url = 'https://wxdev.kaikeba.com';
                    } else {
                        url = 'https://wx.kaikeba.com';
                    }
                }
                window.location = `${url}/vipcourse/${item.url}`;
            },
        }
    }
</script>

<style scoped>
    .vipcourseall {
        width: 100%;
        box-sizing: border-box;
        background: #EEF7F8;
    }

    .list {
        width: 100%;
        box-sizing: border-box;
        padding: 18px 14px 20px 14px;
    }

    .list-ul {
        list-style: none;
    }

    .list-li {
        text-align: center;
        margin-bottom: 8px;
        box-sizing: border-box;
        padding: 11px;
        background: #fff;
        border-radius: 10px;
        padding-bottom: 10px;
    }

    .img {
        vertical-align: top;
        width: 100%;
    }

    .list-li p.name {
        font-size: 15px;
        color: #343434;
        text-align: left;
        margin-left: 7px;
        box-sizing: border-box;
        margin-top: 10px;
        margin-bottom: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap
    }

    .information {
        width: 100%;
        box-sizing: border-box;
        text-align: left;
        font-size: 0;
        padding-left: 7px;
    }

    p.price {
        display: inline;
        font-size: 14px;
    }

    .orderStatus {
        float: right;
        color: #fff;
        padding: 2px 10px;
        font-size: 12px;
        border-radius: 4px;
    }

    .orderStatus.yes {
        background: #5dcc9e;
    }

    .orderStatus.no {
        background: #00b3ed;
    }
</style>
