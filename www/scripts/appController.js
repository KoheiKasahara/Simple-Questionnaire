var appController = function($scope, $data) {
    
    // 初期処理
    $scope.initialize = function () {
        
        // データセット
        $scope.dataList = [];
   
        // webソケット初期化
        $scope.webSocket.onopen = onOpen;
        $scope.webSocket.onmessage = onMessage;
        $scope.webSocket.onclose = onClose;
        $scope.webSocket.onerror = onError;
    
        // 接続イベント
        function onOpen(event) {
            console.log("onOpen");
        };
        // メッセージ受信イベント
        function onMessage(event) {
            console.log("onMessage");
            if (event && event.data) {
                $scope.dataList.push(JSON.parse(event.data));
                $scope.$apply();
            };
        };
        // エラーイベント
        function onError(event) {
            console.log("onError");
        };
        // 切断イベント
        function onClose(event) {
            console.log("onClose");
            webSocket = null;
        };
    };
    
    // 挙手ボタンクリック時の処理
    $scope.click = function(){
        ons.notification.confirm({
          message: '送信してもよろしいですか？',
          modifier: 'material',
          callback: function(idx) {
            switch (idx) {
              case 0:
                // キャンセルメッセージ
                ons.notification.alert({
                  message: 'キャンセルしました',
                  modifier: 'material'
                });
                break;
              case 1:
                // 送信オブジェクト
                var obj = {
                    deviceId:device.uuid,
                    message:"Appealed",
                    time:getCurrentTime(),
                };
                // jsonにしてサーバに送信（webソケット）
                $scope.webSocket.send(JSON.stringify(obj));
                // 完了メッセージ
                ons.notification.alert({
                  message: '送信しました！',
                  modifier: 'material',
                });
                break;
            }
          }
        });
    };
    
    // キャンセルボタンクリック時の処理
    $scope.cancel = function(){
        // ログリストを初期化
        $scope.dataList = [];
    };
    
    // webソケット
    $scope.webSocket = new WebSocket('wss://diamonddust.au-syd.mybluemix.net/ws/simplequestionnaire');
            
    //現在時刻取得（yyyy/mm/dd hh:mm:ss）
    function getCurrentTime() {
        var now = new Date();
    	var res = "" + now.getFullYear() + "/" + padZero(now.getMonth() + 1) + 
    		"/" + padZero(now.getDate()) + " " + padZero(now.getHours()) + ":" + 
    		padZero(now.getMinutes()) + ":" + padZero(now.getSeconds());
    	return res;
    }
    
    //先頭ゼロ付加
    function padZero(num) {
    	var result;
    	if (num < 10) {
    		result = "0" + num;
    	} else {
    		result = "" + num;
    	}
    	return result;
    }
    
    // html読み込み後の処理
    function firstscript() {
        // ログエリアの高さ設定
        document.getElementById("logList").style["height"] = window.innerHeight - 300 + "px";
    }
    
    // 初期処理
    $scope.initialize();
    window.onload = firstscript;

    // ログ出力
    console.log("appController load");
};