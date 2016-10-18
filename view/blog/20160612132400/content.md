对QWebView感兴趣的可以参考：[http://blog.csdn.net/tujiaw/article/details/50372892][1]

 - C++调用js很简单
 ```
 m_view->page()->runJavaScript("showAlert()");
 ```


 - js调用C++函数
 ```
     QWebChannel *channel = new QWebChannel(this);
    channel->registerObject("bridge", (QObject*)bridge::instance());
    m_view->page()->setWebChannel(channel);
 ```

>  注意这个bridget类最好是从QObject继承，不要直接使用Dialog，否则你会看到一些莫名其妙的错误日志，而且使用一个中间类也可以解耦C++与js/html之间的逻辑


源码如下，[地址][2]：
main.cpp
```
#include "dialog.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    Dialog w;
    w.show();

    return a.exec();
}

```
dialog.h
```
#ifndef DIALOG_H
#define DIALOG_H

#include <QDialog>

namespace Ui {
class Dialog;
}

class QWebEngineView;
class Dialog : public QDialog
{
    Q_OBJECT

public:
    explicit Dialog(QWidget *parent = 0);
    ~Dialog();

private:
    Ui::Dialog *ui;
    QWebEngineView *m_view;
};

#endif // DIALOG_H
```
dialog.cpp
```
#include "dialog.h"
#include "ui_dialog.h"
#include <QWebEngineView>
#include <QWebChannel>
#include <QDir>
#include <QDebug>
#include "bridge.h"

Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog)
{
    ui->setupUi(this);

    m_view = new QWebEngineView(this);
    QWebChannel *channel = new QWebChannel(this);
    channel->registerObject("bridge", (QObject*)bridge::instance());
    m_view->page()->setWebChannel(channel);
    m_view->page()->load(QUrl(QString("file:///%1/%2").arg(QApplication::applicationDirPath()).arg("index.html")));

    ui->viewLayout->addWidget(m_view);
    connect(ui->pbAlert, &QPushButton::clicked, [this]() {
        m_view->page()->runJavaScript("showAlert()");
    });
}

Dialog::~Dialog()
{
    delete ui;
}

```
bridge.h
```
#ifndef BRIDGE_H
#define BRIDGE_H

#include <QObject>

class bridge : QObject
{
Q_OBJECT
public:
    static bridge* instance();

public slots:
    void showMsgBox();

private:
    bridge();
};

#endif // BRIDGE_H

```
bridge.cpp
```
#include "bridge.h"
#include <QMessageBox>

bridge* bridge::instance()
{
    static bridge s_obj;
    return &s_obj;
}

bridge::bridge()
{
}

void bridge::showMsgBox()
{
    QMessageBox::aboutQt(0, tr("Qt"));
}

```
index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>test</title>
    <script src="./qwebchannel.js"></script>
  </head>
  <body style="background:#282c34;">
    <h3 style="color:#ffffff;">this is web page</h3>
    <input type="button" value="C++ function callback" onclick="onShowMsgBox()">
    <script>
      new QWebChannel(qt.webChannelTransport, function(channel) {
        window.bridge = channel.objects.bridge;
      })
      function onShowMsgBox() {
        if (bridge) {
          bridge.showMsgBox()
        }
      }

      function showAlert() {
        alert('this is web alert');
      }
    </script>
  </body>
</html>

```
qwebchannel.js是Qt提供的可以在这里下载：[https://code.csdn.net/tujiaw/webengineview/tree/master/qwebchannel.js][3]

> 运行的时候index.html和qwebchannel.js这两个文件放在与exe同级目录下

![此处输入图片的描述][4]


  [1]: http://blog.csdn.net/tujiaw/article/details/50372892
  [2]: https://code.csdn.net/tujiaw/webengineview/tree/master
  [3]: https://code.csdn.net/tujiaw/webengineview/tree/master/qwebchannel.js
  [4]: http://i4.buimg.com/24a84a88591ba0e9.png
