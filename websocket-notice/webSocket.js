// 实现一个单例模式

function startWebSocket(callback = function() {}) {
    if (startWebSocket.isStart) return;

    var ws;
    var stock_request = { "stocks": ["AAPL", "MSFT", "AMZN", "GOOG", "YHOO"] };
    var stocks = {
        "AAPL": 0, "MSFT": 0, "AMZN": 0, "GOOG": 0, "YHOO": 0
    };

    return {
        stop() {
            if (!ws) return;

            ws.close();
            ws = null;
        },
        start() {
            if (ws) return; 

            init();
        }
    }

    function init() {
        ws = new WebSocket("ws://localhost:8181");

        ws.onopen = function (e) {
            console.log('Connection to server opened');
            ws.send(JSON.stringify(stock_request));
            console.log("sened a mesg");
        }

        ws.onmessage = function (e) {
            var stocksData = JSON.parse(e.data);
            console.log(stocksData);
            
            let resData = [];
            for (var symbol in stocksData) {
                if (stocksData.hasOwnProperty(symbol)) {
                    resData.push({key: symbol, prev: stocks[symbol], cur: stocksData[symbol]});
                    stocks[symbol] = stocksData[symbol];
                }
            }

            callback({
                type: 'dataList',
                dataList: resData
            });
        };

        ws.onclose = function (e) {
            console.log("Connection closed", e);
            ws = null;
        };
    }
}