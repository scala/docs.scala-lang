---
layout: tour
title: 隐式转换
partof: scala-tour

num: 25

language: zh-cn

next-page: polymorphic-methods
previous-page: implicit-parameters
---

一个从类型 `S` 到类型 `T` 的隐式转换由一个函数类型 `S => T` 的隐式值来定义，或者由一个可转换成所需值的隐式方法来定义。

隐式转换在两种情况下会用到：

* 如果一个表达式 `e` 的类型为 `S`， 并且类型 `S` 不符合表达式的期望类型 `T`。
* 在一个类型为 `S` 的实例对象 `e` 中调用 `e.m`， 如果被调用的 `m` 并没有在类型 `S` 中声明。

在第一种情况下，搜索转换 `c`，它适用于 `e`，并且结果类型为 `T`。
在第二种情况下，搜索转换 `c`，它适用于 `e`，其结果包含名为 `m` 的成员。

如果一个隐式方法 `List[A] => Ordered[List[A]]`，以及一个隐式方法 `Int => Ordered[Int]` 在上下文范围内，那么对下面两个类型为 `List[Int]` 的列表的操作是合法的：

```
List(1, 2, 3) <= List(4, 5)
```

在 `scala.Predef.intWrapper` 已经自动提供了一个隐式方法 `Int => Ordered[Int]`。下面提供了一个隐式方法 `List[A] => Ordered[List[A]]` 的例子。

```scala mdoc
import scala.language.implicitConversions

implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { 
    //replace with a more useful implementation
    def compare(that: List[A]): Int = 1
  }
```

自动导入的对象 `scala.Predef` 声明了几个预定义类型 (例如 `Pair`) 和方法 (例如 `assert`)，同时也声明了一些隐式转换。

例如，当调用一个接受 `java.lang.Integer` 作为参数的 Java 方法时，你完全可以传入一个 `scala.Int`。那是因为 Predef 包含了以下的隐式转换：

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

因为如果不加选择地使用隐式转换可能会导致陷阱，编译器会在编译隐式转换定义时发出警告。

要关闭警告，执行以下任一操作：

* 将 `scala.language.implicitConversions` 导入到隐式转换定义的上下文范围内
* 启用编译器选项 `-language:implicitConversions` 

在编译器应用隐式转换时不会发出警告。
