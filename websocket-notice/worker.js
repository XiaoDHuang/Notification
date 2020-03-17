
importScripts('./webSocket.js')

let handler = startWebSocket(onGetData);

this.onmessage = function(e) {
    let key = e.data;
    if (!handler[key]) return;

    handler[key]()
}

function onGetData(data) {
    notice(data);
}

function notice(data) {
    let title = "重要通知......"
    let options = {
        body: 'xxxx 股价更新了...', // 通知显示内容
        silent: true,
        sound: 'https://bs.xcang.xyz/voice/notice_test.mp3',
        requireInteraction: false, // 是否一直显示通知
        icon: 'https://bs.xcang.xyz/image/icon.jpeg' // 通知显示的图片
    };

    if (!('Notification' in this)) {
        alert('抱歉，该浏览器不支持Notification API');
    } else {
        let permission = Notification.permission;
        // 判断用户是否允许接受通知
        if (permission === 'granted') {
            // 同意
            let notice = new Notification(title, options);
            postMessage(data);
        } else if (permission === 'default') {
            // 继续向用户询问是否允许接受通知
            Notification.requestPermission().then((res) => {
                if (res === 'granted') {
                    let notice = new Notification(title, options);
                    postMessage(data);
                }
            });
        } else {
            // 拒绝
            console.log('用户拒绝了');
        }
    }
}
