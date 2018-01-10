---
layout: singlepage-overview
title: Implicit Classes

partof: implicit-classes

language: zh-cn

discourse: false
---

**Josh Suereth 著**

## 介绍

Scala 2.10引入了一种叫做隐式类的新特性。隐式类指的是用implicit关键字修饰的类。在对应的作用域内，带有这个关键字的类的主构造函数可用于隐式转换。

隐式类型是在[SIP-13](http://docs.scala-lang.org/sips/pending/implicit-classes.html)中提出的。

## 用法

创建隐式类时，只需要在对应的类前加上implicit关键字。比如：

    object Helpers {
      implicit class IntWithTimes(x: Int) {
        def times[A](f: => A): Unit = {
          def loop(current: Int): Unit =
            if(current > 0) {
              f
              loop(current - 1)
            }
          loop(x)
        }
      }
    }

这个例子创建了一个名为IntWithTimes的隐式类。这个类包含一个int值和一个名为times的方法。要使用这个类，只需将其导入作用域内并调用times方法。比如：

    scala> import Helpers._
    import Helpers._

    scala> 5 times println("HI")
    HI
    HI
    HI
    HI
    HI

使用隐式类时，类名必须在当前作用域内可见且无歧义，这一要求与隐式值等其他隐式类型转换方式类似。

## 限制条件

隐式类有以下限制条件：

1. 只能在别的trait/类/对象内部定义。

````
    object Helpers {
       implicit class RichInt(x: Int) // 正确！
    }
    implicit class RichDouble(x: Double) // 错误！
````

2. 构造函数只能携带一个非隐式参数。
````
    implicit class RichDate(date: java.util.Date) // 正确！
    implicit class Indexer[T](collecton: Seq[T], index: Int) // 错误！
    implicit class Indexer[T](collecton: Seq[T])(implicit index: Index) // 正确！
````

虽然我们可以创建带有多个非隐式参数的隐式类，但这些类无法用于隐式转换。

3. 在同一作用域内，不能有任何方法、成员或对象与隐式类同名。

注意：这意味着隐式类不能是case class。

    object Bar
    implicit class Bar(x: Int) // 错误！

    val x = 5
    implicit class x(y: Int) // 错误！

    implicit case class Baz(x: Int) // 错误！
