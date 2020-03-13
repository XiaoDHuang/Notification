const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 8181 });

let stocks = {
    "AAPL": 95.0,
    "MSFT": 50.0,
    "AMZN": 300.0,
    "GOOG": 550.0,
    "YHOO": 35.0
};
let stockUpdater;

randomStockUpdater();

wss.on('connection', function (ws) {
    let clientStocks = [];
    let clientStockUpdater = setInterval(function () {
        sendStockUpdates(ws);
    }, 10000);

    ws.on('message', function (message) {
        let stockRequest = JSON.parse(message);
        console.log("收到消息", stockRequest);

        clientStocks = stockRequest['stocks'];
        sendStockUpdates(ws);
    });

    ws.on('close', function () {
        if (typeof clientStockUpdater !== 'undefined') {
            clearInterval(clientStockUpdater);
        }
    });

    function sendStockUpdates(ws) {
        if (ws.readyState == 1) {
            let stocksObj = {};

            clientStocks.forEach(key => {
                if (!stocks[key]) return;
                stocksObj[key] = stocks[key]
            });

            if (Object.keys(stocksObj).length === 0) return; 

            ws.send(JSON.stringify(stocksObj));
            console.log("更新", JSON.stringify(stocksObj));
        }
    }
});

function randomStockUpdater () {
    Object.keys(stocks).forEach(key => {
        let randomizedChange = randomInterval(-150, 150);
        let floatChange = randomizedChange / 100;
        stocks[key] += floatChange;
    });

    let randomMSTime = randomInterval(500, 2500);
    stockUpdater = setTimeout(() => {
        randomStockUpdater();
    }, randomMSTime);
}

function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}