---
layout: tour
title: 抽象类型
partof: scala-tour

num: 21

language: zh-cn

next-page: compound-types
previous-page: inner-classes
---

特质和抽象类可以包含一个抽象类型成员，意味着实际类型可由具体实现来确定。例如：

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```
这里定义的抽象类型`T`是用来描述成员`element`的类型的。通过抽象类来扩展这个特质后，就可以添加一个类型上边界来让抽象类型`T`变得更加具体。

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
注意这里是如何借助另外一个抽象类型`U`来限定类型上边界的。通过声明类型`T`只可以是`Seq[U]`的子类（其中U是一个新的抽象类型），这个`SeqBuffer`类就限定了缓冲区中存储的元素类型只能是序列。

含有抽象类型成员的特质或类（[classes](classes.html)）经常和匿名类的初始化一起使用。为了能够阐明问题，下面看一段程序，它处理一个涉及整型列表的序列缓冲区。

```scala mdoc
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}


def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
  new IntSeqBuffer {
       type T = List[U]
       val element = List(elem1, elem2)
     }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```
这里的工厂方法`newIntSeqBuf`使用了`IntSeqBuf`的匿名类实现方式，其类型`T`被设置成了`List[Int]`。

把抽象类型成员转成类的类型参数或者反过来，也是可行的。如下面这个版本只用了类的类型参数来转换上面的代码：

```scala mdoc:nest
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}

def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
  new SeqBuffer[Int, List[Int]] {
    val element = List(e1, e2)
  }

val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

需要注意的是为了隐藏从方法`newIntSeqBuf`返回的对象的具体序列实现的类型，这里的[型变标号](variances.html)（`+T <: Seq[U]`）是必不可少的。此外要说明的是，有些情况下用类型参数替换抽象类型是行不通的。
