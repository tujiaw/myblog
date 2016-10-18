### 使用Atom增加工程目录会把目录下的所有文件都显示到工程中，但是有些文件其实我们不会去编辑的如：图片。通过下面两步就可以过滤掉：

 1. 打开Settings，找到Ignored Names，如下：
 

> .git, .hg, .svn, .DS_Store, ._*, Thumbs.db

在后面添加我们需要过滤的文件后缀，如过滤png，增加后如下：

> .git, .hg, .svn, .DS_Store, ._\*, Thumbs.db，\*.png

 2. 通过第一步还不能生效，还需要在Settings中点击Packages搜索tree-view，点击tree-view上的Settings，勾选Hide Ignored Names就可以了。
 
![此处输入图片的描述][1]


  [1]: http://i4.buimg.com/3d3e95493871a554.png