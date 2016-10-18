使用QWebEngineView程序退出时崩溃

先看堆栈图，如果您碰到跟我一样的问题可以继续往下看：
![此处输入图片的描述][1]


  [1]: http://i2.piimg.com/565738/d37bf82edab3a0a2.png

  Qt5.6请看官方的一个例子：webengine content manipulation engine
  直接运行，然后退出程序会输出下面错误信息：
  ```
  [0623/184240:FATAL:resource_scheduler.cc(891)] Check failed: client_map_.empty().
Backtrace:
	GetHandleVerifier [0x11A179B1+278177]
	QtWebEngineCore::UserScript::isNull [0x1196A18F+3795199]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x107BC3C6+6519606]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x10675B86+5182198]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x10675806+5181302]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x10688C20+5260176]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x10688B9A+5260042]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x1067E0ED+5216349]
	QtWebEngineCore::CookieMonsterDelegateQt::hasCookieMonster [0x12FB3A81+98977]
	QtWebEngineCore::FilePickerController::mode [0x11E8680A+760762]
	QtWebEngineCore::BrowserContextAdapter::customUrlSchemeHandlers [0x10C858EC+1208572]
	QtWebEngineCore::BrowserContextAdapter::customUrlSchemeHandlers [0x1118F81F+6492207]
	GetHandleVerifier [0x11A33F7D+394349]
	QtWebEngineCore::UserScript::isNull [0x11979BD8+3859272]
	QtWebEngineCore::UserScript::isNull [0x119782B4+3852836]
	QtWebEngineCore::UserScript::isNull [0x119787FD+3854189]
	GetHandleVerifier [0x11A366F2+404450]
	GetHandleVerifier [0x11A38192+411266]
	GetHandleVerifier [0x11A380FC+411116]
	QtWebEngineCore::UserScript::isNull [0x119799E7+3858775]
	QtWebEngineCore::UserScript::isNull [0x119A9336+4053670]
	QtWebEngineCore::UserScript::isNull [0x1197989D+3858445]
	QtWebEngineCore::UserScript::isNull [0x119BFCA6+4146198]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x105FE414+4692868]
	QtWebEngineCore::JavaScriptDialogController::qt_static_metacall [0x105FF22B+4696475]
	QtWebEngineCore::UserScript::isNull [0x119C07A9+4149017]
	QtWebEngineCore::UserScript::isNull [0x119C7536+4177062]
	BaseThreadInitThunk [0x760E338A+18]
	RtlInitializeExceptionChain [0x77119A02+99]
	RtlInitializeExceptionChain [0x771199D5+54]
  ```
  如果用的是vs2013打开退出就会触发断点堆栈如上面的截图。
  
  **解决方法**


 - 将main.cpp中的
 ```
MainWindow *browser = new MainWindow(url);
browser->show();
return app.exec();

 ```
 改为
 ```
MainWindow browser(url);
browser.show();
return app.exec();
 ```
 或者改为
 ```
MainWindow *browser = new MainWindow(url);
browser->show();
int code = app.exec();
delete browser;
return code;
 ```


 - 从解决方法可以知道，在exec事件循环终止后程序退出前要销毁掉使用QWebEngineView的对象才行。

*不知道Qt什么时候能修复这个问题！！！*
