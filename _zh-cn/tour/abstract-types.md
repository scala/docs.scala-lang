---
layout: tour
title: 抽象类型

discourse: false

partof: scala-tour

num: 21

language: zh-cn

next-page: compound-types
previous-page: inner-classes
---
特征(Trait)和抽象类(abstract class)可以包含一个抽象类型成员，意味着实际类型可由具体实现来确定。示例如下：
```$scala
trait Buffer {
  type T
  val element: T
}
```
这里我们定义了一个抽象类型 `tpye T`，用于修饰`element`的类型。
如示例，我们可以用抽象类继承特征，并增加类型边界上限把`T`描述的更加具体。
```$scala
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
注意这里是如何借助另外一个抽象类型U来限定类型边界上限(upper-type-bound)。通过声明类型T只可以是Seq[U]的子类（其中U是一个新的抽象类型），这个SeqBuffer类就限定了缓冲区中存储的元素类型只能是序列。

特征和抽象类经常和匿名类一起使用。示例如下，我们现在看一个程序，它处理一个引用整数列表的序列Buffer：

```$scala
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

这里工厂方法`newIntSeqBuf`创建了IntSeqBuf的匿名类实例(i.e. `new IntSeqBuffer`),
并设置抽象类型`type T`为`List[Int]`



也可以将抽象类型成员转换为类的类型参数，反之亦然。这是上面代码的一个版本，它只使用类型参数：
```$scala
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

注意这里我们使用了[变异标记(Variance Annotations)](https://docs.scala-lang.org/zh-cn/tour/variances.html)(`+T <: Seq[U]`)隐藏方法`newIntSeqBuf`返回对象的具体序列的实现类型。
此外，有些情况下无法用类型参数替换抽象类型。
