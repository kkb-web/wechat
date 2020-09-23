import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let url = null;

if (process.env.NODE_ENV === 'development' || window.location.href.indexOf('wxtest') !== -1) {
    url = 'https://opentest.kaikeba.com';
} else {
    if (window.location.href.indexOf('wxpre') !== -1) {
        url = 'https://openpre.kaikeba.com';
    }else if (window.location.href.indexOf('wxdev2') !== -1) {
        url = 'https://opendev2.kaikeba.com';
    } else if (window.location.href.indexOf('wxdev') !== -1) {
        url = 'https://opendev.kaikeba.com';
    } else {
        url = 'https://open2.kaikeba.com';
    }
}
// http://192.168.86.98:9090

let stompClient = null,
    host = url + '/websocket',
    timesTamp = null,
    timesTampInterval = null,
    timer = null,
    courseIdGlobal = null,
    pageIdGlobal = null,
    keyGlobal = null,
    uinioIdGlobal = null,
    endPointGlobal = null;

//连接socket
export const contentSocket = (getCourseDetielMethod, uinioId, type, courseId, pageCode, endPoint, changeCourseStausMethod, getDetail_PC, reconnectSocket) => {
    if (courseId && pageCode && type && endPoint) {
        keyGlobal = type;
        courseIdGlobal = courseId;
        pageIdGlobal = pageCode;
        uinioIdGlobal = uinioId;
        endPointGlobal = endPoint;
    }
    // if (uinioId) {
    //     uinioIdGlobal = uinioId;
    // } else {
    //     uinioId = null;
    //     uinioIdGlobal = null;
    // }
    let headers = {
            key: uinioId,
            business: type,
            topic: courseId,
            code: pageCode,
            endpoint: endPoint,
            'http-equiv': 'X-Frame-Options'
        },
        socket = new SockJS(host);
    stompClient = Stomp.over(socket);
    stompClient.heartbeat.outgoing = 0; // 客户端不发送
    stompClient.heartbeat.incoming = 10000;     // 客户端每10s接收一次数据从
    stompClient.connect(headers, function () {
        // alert(JSON.stringify(headers) + `/kkb/queue/${headers.business}` + `/notice/${headers.business}/${headers.topic}/${headers.code}`);
        //全局
        stompClient.subscribe(`/kkb/queue/${headers.business}`, function (response) {
            console.log(response, '==========全局返回');
            if (typeof(response.body) == 'string') {
                response.body = JSON.parse(response.body)
            }
            let code = response.body.code;
            if (code == 70001 || code == 70002 || code == 70003 || code == 70007) {
                changeCourseStausMethod(code);
                // if (code == 70001 || code == 70002 || code == 70003) {
                //     let data = response.body.data;
                //     disConnect();
                //     setTimeout(() => {
                //         reconnectSocket(data)
                //     }, 1000)
                // }
            } else if (code == 70006) {
                let data = response.body.data;
                getDetail_PC(data);
                if (headers.endpoint === 'PC') {
                    // alert(data);
                    disConnect();
                    setTimeout(() => {
                        reconnectSocket(data)
                    }, 1000)
                }
            }
        });
        //点对点
        stompClient.subscribe(`/notice/${headers.business}/${headers.topic}`,
            function (response) {
                // alert(JSON.stringify(response)+ "/点对点返回");
                if (typeof(response.body) == 'string') {
                    response.body = JSON.parse(response.body)
                }
                // alert(JSON.stringify(response)+"/点对点");
                let code = response.body.code;

                if (code == 70001 || code == 70002 || code == 70003 || code == 70007) {
                    changeCourseStausMethod(code);
                    // if (code == 70001 || code == 70002 || code == 70003) {
                    //     let data = response.body.data;
                    //     disConnect();
                    //     setTimeout(() => {
                    //         reconnectSocket(data)
                    //     }, 1000)
                    // }
                } else if (code == 70006) {
                    let data = response.body.data;
                    getDetail_PC(data);
                    if (headers.endpoint === 'PC') {
                        disConnect();
                        setTimeout(() => {
                            reconnectSocket(data)
                        }, 1000)
                    }
                }

            });
    }, function (error) {
        // 连接失败时（服务器响应 ERROR 帧）的回调方法
        console.log('连接失败【' + error + '】');
        getCourseDetielMethod();
    });
    socket.onclose = function () {
        // alert(123);
        contentSocket(null, uinioIdGlobal, keyGlobal, courseIdGlobal, pageIdGlobal, endPointGlobal)
    };
    socket.onerror = function () {
        // alert(456)
        contentSocket(null, uinioIdGlobal, keyGlobal, courseIdGlobal, pageIdGlobal, endPointGlobal)
    };
};

// 判断是否连接状态
// timer = setInterval(function () {
    // timesTampInterval = new Date().getTime();
    // // alert(timesTampInterval + '==结束的时间戳'+ '/' + timesTamp + '==开始的时间戳');
    // if ((parseInt(timesTampInterval) - parseInt(timesTamp)) > 30000) {
    //     alert('断开');
    //     console.log('断开');
    //     contentSocket(null, uinioIdGlobal, keyGlobal, courseIdGlobal, pageIdGlobal, endPointGlobal);
    // }
// }, 30000);

// 检测断开
// timer = setInterval(() => {
    // try {
    //     stompClient.send("test");
    // } catch (err) {
    //     console.log("断线了: " + err);
    //     contentSocket(null, uinioIdGlobal, keyGlobal, courseIdGlobal, pageIdGlobal, endPointGlobal);
    // }
// }, 5000);

// 断开连接
export const disConnect = () => {
    if (stompClient != null) {
        stompClient.disconnect();
        stompClient = null;
    }
    console.log("Disconnected");
};





