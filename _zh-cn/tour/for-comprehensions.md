---
layout: tour
title: For 循环推导

discourse: false

partof: scala-tour

num: 15

language: zh-cn

next-page: generic-classes
previous-page: extractor-objects
---

Scala 提供一个轻量级的标记方式用来表达 *序列推导*。推导使用以下形式 `for (enumerators) yield e`，此处 `enumerators` 指一组以分号分隔的迭代器。一个 *enumerator* 要么是一个产生新变量的构造器，要么是一个过滤器。推导在循环的每一次迭代中都会计算 `e` 值，并保存在集合中，循环结束后返回该集合。

看下例：

```tut
case class User(name: String, age: Int)

val userBase = List(User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings = for (user <- userBase if (user.age >=20 && user.age < 30))
  yield user.name  // i.e. add this to a list

twentySomethings.foreach(name => println(name))  // prints Travis Dennis
```
这里 `for` 循环后面使用的 `yield` 语句实际上会创建一个 `List`。因为当我们说 `yield user.name` 的时候，它实际上是一个 `List[String]`。 `user <- userBase` 是循环迭代器，`if (user.age >=20 && user.age < 30)` 是循环守卫用来过滤掉那些年龄不是20多岁的人。

下面这个例子复杂一些，使用了两个迭代器。它计算了 `0` 到 `n-1` 的所有两两求和为 `v` 的数字的组合：

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- i until n if i + j == v)
   yield (i, j)

foo(10, 10) foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // prints (1, 9) (2, 8) (3, 7) (4, 6) (5, 5)
}

```
这里 `n == 10` 和 `v == 10`。在第一次迭代时，`i == 0` 并且 `j == 0` 所以 `i + j != v` 因此没有返回值被生成。在 `i` 的值递增到 `1` 之前，`j` 的值又递增了 9 次。如果没有 `if` 守护语句，上面的例子只会打印出如下的结果：
```

(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 1) ...
```

注意推导并不局限于使用列表。任何数据类型只要支持 `withFilter`，`map`，和 `flatMap` 操作（不同数据类型可能支持不同的操作）都可以用来做序列推导。

你可以在使用推导时省略 `yield` 语句。此时推导会返回 `Unit`。当你想要执行一些副作用的时候这很有用。下面的例子输出和上面相同的结果，但是没有使用 `yield`：

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- i until n if i + j == v)
   println(s"($i, $j)")

foo(10, 10)
```
