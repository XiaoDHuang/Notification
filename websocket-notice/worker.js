
importScripts('./webSocket.js')

let handler = startWebSocket(onGetData);

this.onmessage = function(e) {
    let key = e.data;
    if (!handler[key]) return;

    handler[key]()
}

function onGetData(data) {
    postMessage(data);
}


