### 混合开发
随着前端技术的发展，现在越来越多的桌面应用程序会嵌入一些Web技术来进行混合开发，好处当然是结合了web端和传统桌面软件各自的优点。常见的有使用开源的Chromium，Qt的QWebView以及最新的QWebEngineView。

### [Electron][1]

> 通过electron框架可以使用JavaScript，HTML，CSS来开发跨平台的桌面应用程序

> 国外资源很难下载到，可以到这里来下载[electron-v1.2.0-win32-x64 ][2]， 直接运行electron.exe就可以看到效果了，上面也介绍了怎么来运行自己的应用程序

### Hello，world

 1. 在electron.exe目录下创建demo/hello目录
 2. 使用命令行工具cd到hello目录
 3. npm init，使用默认的一路按Enter就可以，完成之后在当前目录下就生成了package.json文件，内容如下：
 ```
 {
  "name": "hello",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "description": ""
}

 ```
 4. 在当前目录下新建main.js文件，内容如下：
 ```
    const electron = require('electron')
    // 控制应用程序的整个生命周期
    const app = electron.app
    // 创建一个浏览器窗口
    const BrowserWindow = electron.BrowserWindow
    // 声明一个全局浏览器窗口对象，如果你不这样做，在JavaScript对象被垃圾回收的时候窗口会被自动关闭
    let win = null
    
    // 当electron完成初始化后这个事件回调会被调用，很多APIs必须在这之后才能使用，
    // 这这里创建浏览器窗口是个合适的时机
    app.on('ready', () => {
      win = new BrowserWindow({width: 700, height: 600})
      // 载入网页
      win.loadURL(`file://${__dirname}/index.html`)
      // 打开网页调试工具
      // win.webContents.openDevTools()
      // 当窗口关闭的时候回被触发
      win.on('closed', () => {
        // 解除对窗口对象的引用
        win = null
      })
    })
    
    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
    
    app.on('activate', function () {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        createWindow()
      }
    })
 ```
 5. 在当前目录下新建index.html文件，内容如下：
 ```
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>

 ```
 6. 回到electron目录下执行:electron ./demo/hello, 如下图：

 ![hello][3]

[1]: http://electron.atom.io/
[2]: http://download.csdn.net/detail/tujiaw/9533210
[3]: http://i4.buimg.com/a66cc87a38d02532.png