# Notification
## 前言

之前在浏览Youtube时，突然看到浏览器右上角弹出一个通知，点击就就进到了指定视频界面，感觉很是不错，如果加上**语音效果**结合WebSocket，正好可以用到自己的毕业设计之中。

## 关于Notification API

在[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/notification)上的介绍是：**用于向用户配置和显示桌面通知**，使用的时候必须是在**Web Worker**中使用。更为详细的介绍可以去看看[HTML5 桌面通知：Notification API](https://juejin.im/post/59ed37f5f265da431e15eaac)，这位大佬已经写的很详细了，线上demo：[线上demo](https://bs.xcang.xyz/notice/)。

## 展示效果

![notice](https://user-gold-cdn.xitu.io/2019/3/8/1695b577f57742fd?w=828&h=222&f=png&s=70197)

## 构造方法

`let notification = new Notification(title, options)`
### 参数
> `title`：显示的通知标题  
> `options`：设置通知的对象：其属性包含如下：  

 属性 | 作用
 ---------| -------------
 dir | 控制文字的方向，自动：`auto`、从左到右：`ltr`、从右到左：`rtl`
 lang | 指定通知中所使用的语言
 body | 显示的文本内容
 tag | 主键ID
 icon | 显示的图片地址
### 兼容性


![](https://user-gold-cdn.xitu.io/2019/3/8/1695b8c80bdbe2eb?w=2078&h=228&f=png&s=52227)

## 实现语音

在[简单了解HTML5中的Web Notification桌面通知](https://www.zhangxinxu.com/wordpress/2016/07/know-html5-web-notification/)中作者列出了`silent`和`sound`属性可用于语音播放，但亲测后并不生效。
```javascript
// new Notification(title, options)
let options = {
    // 通知显示内容
    body: content, 
    // 通知出现的时候，是否要有声音。默认false, 表示无声。（测试无效）
    silent: true,
    // 字符串。音频地址。表示通知出现要播放的声音资源。（测试无效）
    sound: 'https://bs.xcang.xyz/voice/notice_test.mp3', 
    // 是否一直显示通知
    requireInteraction: false,
    // 通知显示的图片
    icon: 'https://bs.xcang.xyz/image/icon.jpeg'
};
```
因此我换了一种思路，代码如下：
```javascript
let audio = document.createElement('audio');
// 音频地址
audio.src = 'https://bs.xcang.xyz/voice/notice_test.mp3';
```
我在设置完options后，直接新建一个`audio`元素，在用户允许通知后操作`play()`就可以播放语音了，代码如下：
```javascript
// 先检查浏览器是否支持该API
if (!('Notification' in window)) {
    alert('抱歉，该浏览器不支持Notification API');
} else {
  let permission = Notification.permission;
  // 判断用户是否允许接受通知
  if (permission === 'granted') {
    // 允许通知
    let notice = new Notification(title, options);
    play && audio.play();
  } else if (permission === 'default') {
    // 继续向用户询问是否允许接受通知
    Notification.requestPermission().then((res) => {
      if (res === 'granted') {
    	// 允许通知
    	let notice = new Notification(title, options);
        play && audio.play();
      }
    });
  } else {
  // 拒绝
  console.log('用户拒绝了');
  }
}
```
### 语音资源合成
[百度广播开放平台](https://developer.baidu.com/vcast)

https://wangchujiang.com/iNotify/

## 关于audio自动播放问题
```javascript
  // 此代码可以放入 source 面板 Snippets 中运行， 不要放入控制台去运行， 控制台可以直接播放
  let audio = document.createElement('audio');
  audio.autoplay="autoplay";
  audio.meted = false;
  audio.src = 'http://127.0.0.1:3003/notice_test.mp3';
  audio.play(); 

  // Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first.
```
发现谷歌浏览器在高版本中禁用 声音的自动播放问题，必须人为的去触发事件， 鼠标事件或键盘事件等还有控制台， 直接执行上面代码会直接报错

在w3c 网站上去查看audio autoplay 属性时， 发现点击链接打开页面可以进行自动播放。 但刷新页面时， 不会再次播放。 还有一个规律就是， 只要首次播放了声音， javascript 代码就可以完成上述代码的直接播放。 出于好奇， 模拟了w3c代码实现, 代码如下

```sh
# 涉及表单提交 启动服务
npx http-server . -p $port
```
```html
  <form id="codeForm" autocomplete="off" style="margin:0px;display:none;" action="/b.html" method="get" accept-charset="utf-8" target="iframeResult">
      <input type="hidden" name="code" id="code" value=""/>
  </form> 
  <div id="iframecontainer"> 
    <div id="iframe">
         <div id="iframewrapper">
        <iframe frameborder="0" id="iframeResult" name="iframeResult"></iframe>
      </div>
    </div>
  </div>
  <script>
    submitTryit();

    function submitTryit() {
        if (window.editor) {window.editor.save();}
        let text = document.getElementById("textareaCode").value;

        let ifr = document.createElement("iframe");
        ifr.setAttribute("frameborder", "0");
        ifr.setAttribute("id", "iframeResult");
        ifr.setAttribute("name", "iframeResult");  
        document.getElementById("iframewrapper").innerHTML = "";
        document.getElementById("iframewrapper").appendChild(ifr);

        let  t = text;
        t=t.replace(/=/gi,"w3equalsign");
        t=t.replace(/\+/gi,"w3plussign");

        //document.write(t);
        var pos=t.search(/script/i);

        while (pos>0) {
          t=t.substring(0,pos) + "w3" + t.substr(pos,3) + "w3" + t.substr(pos+3,3) + "tag" + t.substr(pos+6);
          pos=t.search(/script/i);
        }

        document.getElementById("code").value=t;
        document.getElementById("codeForm").action = "/b.html";
        document.getElementById('codeForm').method = "get";
        document.getElementById('codeForm').acceptCharset = "utf-8";
        document.getElementById('codeForm').target = "iframeResult";
        document.getElementById("codeForm").submit();
    }
  </script>
```

