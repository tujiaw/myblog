Swift是苹果新推出的编程语言，也是苹果首个开源语言。相比于原来的Objective-C，Swift要更轻便和灵活。笔者最近使用Swift实践了大量的算法（绝大部分是硅谷各大公司的面试题），将心得体会总结于下。此文并不是纯粹讨论Swift如何实现某一个具体的算法或者数据结构，如冒泡排序、深度优先遍历，或是树和栈，而是总结归纳一些Swift常用的语法和技巧，以便大家在解决面试题中使用。

**基本语法**

先来看下面一段代码：

```
func swap(chars:[Character],  p: Int, q: Int) {
  var temp = chars[p]
  chars[p] = chars[q]
  chars[q] = temp
}
// Assume array is a character array and it has enough elements
swap(array, p: 0, q: 1)
```
上面代码实现了一个非常简单的功能，就是交换一个数组中的两个值。乍一看非常正确，实际上存在以下几个问题：

- 在第一个参数前应该加上 inout 关键字。因为在Swift中，struct都是按值传递，class是按引用传递；数组和字典都是struct。所以要改变原来的chars数组，在其前部加入inout关键字，表示是按引用传递。
- p 和 q 之前应该加入下划线。Swift默认函数的第一个参数是局部（local）变量，而后续参数都是外部（external）变量，外部变量必须声明。如果在p和q前加上下划线，则在调用函数时无需声明外部变量，这样调用起来更简便。
- temp前的var应该改为let。let用于声明常量（constant），var用于声明变量（variable）。swap函数中，temp并未进行修改，所以应当视为常量，用let来声明。

修改过后的代码为
```
func swap(inout chars:[Character],  _ p: Int, _ q: Int) {
  let temp = chars[p]
  chars[p] = chars[q]
  chars[q] = temp
}
// Assume array is a character array and it has enough elements
swap(&array, 0, 1)
```

再来看一段代码
```
func toZero(x: Int) -> Int {
  while x > 0 {
    x -= 1
  }
  return x
}
```
这里在 x -= 1 处会报错。原因是函数中所有的参数是常量（let），是不可以修改的。解决的方法是在函数中写上var x = x，之后就可以对 x 进行修改了

**循环**

Swift循环分为for和while两种，注意他们的结构跟传统的 Java, C/C++有很大区别，笔者将其总结如下：

![](http://cc.cocimg.com/api/uploads/20160525/1464169650957754.png)

以上代码非常简单。需要说明的有两个，一个是 for _ in 0 ..< names.count { } 。当我们不需要数组中每一个具体的元素值时，我们就可以用下划线来代表序号。

另一个是是 repeat { } while i < names.count 。这个相当于我们熟悉（java）的 do { } while (i < names.length)。

另一个是是 repeat { } while i < names.count 。这个相当于我们熟悉（java）的 do { } while (i < names.length)。