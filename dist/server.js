'use strict';

// var http = require("http");
// http.createServer(function (request, response) {
//
//
//     // 发送 HTTP 头部
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, {'Content-Type': 'text/plain'});
//     // 发送响应数据 "Hello World"
//     response.end('Hello World\n');
// }).listen(8003);

// 终端打印如下信息
// console.log('Server running at http://localhost:8003/');

var server = require('ws').Server;
var ws = new server({
    port: 8003,
    verifyClient: socketverify
});

function socketverify(info) {
    return true;
}

var num = [];
var dialogData = [{
    type: 'bot',
    msg: '你好',
    time: '2018-11-27 12:23:23'
}, {
    type: 'human',
    msg: '你好'
}, {
    type: 'bot',
    msg: '请问您最近需要贷款么',
    time: '2018-11-27 12:23:23'
}, {
    type: 'human',
    msg: '不需要'
}, {
    type: 'bot',
    msg: '本公司现在经营无抵押贷款业务，快速审核，快速放款，本公司现在经营无抵押贷款业务,' + '本公司现在经营无抵押贷款业务，快速审核，快速放款，本公司现在经营无抵押贷款业务',
    time: '2018-11-27 12:23:23'
}, {
    type: 'human',
    msg: '不好意思，不需要'
}, {
    type: 'bot',
    msg: '好的，打扰了，祝您生活愉快',
    time: '2018-11-27 12:23:23'
}, {
    type: 'human',
    msg: '不好意思，本公司现在经营无抵押贷款业务，快速审核，快速放款，本公司现在经营无抵押贷款业务,\' +\n' + '        \'本公司现在经营无抵押贷款业务'
}, {
    type: 'bot',
    msg: '好的，打扰了，祝您生活愉快',
    time: '2018-11-27 12:23:23'
}];

// 由于setInterval的定时代码是在全局作用域下执行的
var i = 0;

ws.on('connection', function (socket) {
    console.log('服务端链接成功！');
    socket.on('message', function (msg) {
        console.log('服务端收到消息', msg);
        console.log('开始向客户端发送数据');

        // 遍历dialogData
        var a = setInterval(function timeout() {
            socket.send(JSON.stringify(dialogData[i]));
            console.log('i', i);
            i = i + 1;
            if (i >= dialogData.length) {
                console.log('超过内容上限', i, dialogData.length);
                socket.send('close');
                clearInterval(a);
                i = 0;
            }
        }, 1200);

        // console.log('测试检测out', )
        // for(var i=0; i<dialogData.length;i++){
        //     console.log('测试检测+',i )
        //     socket.send(i)
        // }
        // function test() {
        //     console.log('测试检测in' )
        // }
        // test()
    });
    socket.on('close', close);
    socket.on('error', error);
    socket.on('open', function open() {
        console.log('服务端开始');
    });
});
function close() {
    console.log('服务端close');
}
function error(err) {
    console.log('服务端报错', err);
}
//# sourceMappingURL=server.js.map