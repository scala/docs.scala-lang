---
layout: tour
title: 通过混入（mixin）来组合类
partof: scala-tour

num: 6

language: zh-cn

next-page: higher-order-functions
previous-page: tuples
---

当某个特质被用于组合类时，被称为混入。

```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "I'm an instance of class B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```

类`D`有一个父类`B`和一个混入`C`。一个类只能有一个父类但是可以有多个混入（分别使用关键字`extends`和`with`）。混入和某个父类可能有相同的父类。

现在，让我们看一个更有趣的例子，其中使用了抽象类：

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```

该类中有一个抽象的类型`T`和标准的迭代器方法。

接下来，我们将实现一个具体的类（所有的抽象成员`T`、`hasNext`和`next`都会被实现）：

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```

`StringIterator`带有一个`String`类型参数的构造器，可用于对字符串进行迭代。（例如查看一个字符串是否包含某个字符）：

现在我们创建一个特质，也继承于`AbsIterator`。

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```

该特质实现了`foreach`方法——只要还有元素可以迭代（`while (hasNext)`），就会一直对下个元素(`next()`) 调用传入的函数`f: T => Unit`。因为`RichIterator`是个特质，可以不必实现`AbsIterator`中的抽象成员。

下面我们要把`StringIterator`和`RichIterator` 中的功能组合成一个类。

```scala mdoc
object StringIteratorTest extends App {
  class RichStringIter extends StringIterator("Scala") with RichIterator
  val richStringIter = new RichStringIter
  richStringIter foreach println
}
```

新的类`RichStringIter`有一个父类`StringIterator`和一个混入`RichIterator`。如果是单一继承，我们将不会达到这样的灵活性。
