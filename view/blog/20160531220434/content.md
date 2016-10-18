### QFrame与QWidget的区别

QFrame是基本控件的基类，QWidget是QFrame基类，关系如下：

> QPushButton,QLabel... -> QFrame -> QWidget

我们经常会从QFrame或者QWidget继承然后自定义一个复杂的widget，在设置样式表的时候它们就有一个大的区别。
*dialog.h*
```
#ifndef DIALOG_H
#define DIALOG_H

#include <QDialog>
#include <QFrame>
namespace Ui {
class Dialog;
}

class MyWidget : public QWidget {
    Q_OBJECT
public:
    MyWidget(QWidget *parent = 0) : QWidget(parent) {
        this->setStyleSheet("QWidget{background:#ff0000;} QWidget:hover{background:#00ff00;}");
    }
};

class MyFrame : public QFrame {
    Q_OBJECT
public:
    MyFrame(QWidget *parent = 0) : QFrame(parent) {
        this->setStyleSheet("QWidget{background:#ff0000;} QWidget:hover{background:#00ff00;}");
    }
};

class Dialog : public QDialog
{
    Q_OBJECT

public:
    explicit Dialog(QWidget *parent = 0);
    ~Dialog();

private:
    Ui::Dialog *ui;
};

#endif // DIALOG_H

```
*dialog.cpp*
```
#include "dialog.h"
#include "ui_dialog.h"

Dialog::Dialog(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::Dialog)
{
    ui->setupUi(this);

    MyWidget *widget = new MyWidget(this);
    MyFrame *frame = new MyFrame(this);
    widget->setFixedSize(50, 50);
    frame->setFixedSize(50, 50);
    widget->move(0, 0);
    frame->move(0, 50);
}

Dialog::~Dialog()
{
    delete ui;
}

```
如下图，发现从QWidget继承过来的MyWidget并没有显示出样式来
![此处输入图片的描述][1]
 
 具体原因还不是很清楚，不过下面一段话可能对我们有些帮助：
 *QWidget Supports only the background, background-clip and background-origin properties.
If you subclass from QWidget, you need to provide a paintEvent for your custom QWidget as below:*
```
void CustomWidget::paintEvent(QPaintEvent *)
{
    QStyleOption opt;
    opt.init(this);
    QPainter p(this);
    style()->drawPrimitive(QStyle::PE_Widget, &opt, &p, this);
}
```
*The above code is a no-operation if there is no stylesheet set.
Warning: Make sure you define the Q_OBJECT macro for your custom widget.*

  [1]: http://i4.buimg.com/0c42276bac9976a1.png