#### 方形图片使用QLabel显示成圆形

```
#ifndef MASKLABEL_H
#define MASKLABEL_H

#include <QLabel>

class MaskLabel : public QLabel
{
public:
    MaskLabel(QWidget *parent=0);

protected:
    void paintEvent(QPaintEvent *);
};

#endif // MASKLABEL_H


#include "masklabel.h"
#include <QPainter>

MaskLabel::MaskLabel(QWidget *parent) : QLabel(parent)
{
}

void MaskLabel::paintEvent(QPaintEvent *e)
{
    if(pixmap()){
        QPainter painter(this);
        painter.setRenderHints(QPainter::Antialiasing | QPainter::SmoothPixmapTransform);
        QPainterPath path;
        int round = qMin(width(), height());
        path.addEllipse(0, 0, round, round);
        painter.setClipPath(path);
        painter.drawPixmap(0, 0, width(), height(), *pixmap());
    }else{
        QLabel::paintEvent(e);
    }
}

```
