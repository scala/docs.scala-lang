---
layout: tour
title: 提取器对象
partof: scala-tour

num: 14

language: zh-cn

next-page: generic-classes
previous-page: regular-expression-patterns
---

提取器对象是一个包含有 `unapply` 方法的单例对象。`apply` 方法就像一个构造器，接受参数然后创建一个实例对象，反之 `unapply` 方法接受一个实例对象然后返回最初创建它所用的参数。提取器常用在模式匹配和偏函数中。

```scala mdoc
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val stringArray: Array[String] = customerID.split("--")
    if (stringArray.tail.nonEmpty) Some(stringArray.head) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // prints Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```

这里 `apply` 方法用 `name` 创建一个 `CustomerID` 字符串。而 `unapply` 方法正好相反，它返回 `name` 。当我们调用 `CustomerID("Sukyoung")` ，其实是调用了 `CustomerID.apply("Sukyoung")` 的简化语法。当我们调用 `case CustomerID(name) => println(name)`，就是在调用提取器方法。

因为变量定义可以使用模式引入变量，提取器可以用来初始化这个变量，使用 unapply 方法来生成值。

```scala mdoc
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // prints Nico
```

上面的代码等价于 `val name = CustomerID.unapply(customer2ID).get`。

```scala mdoc
val CustomerID(name2) = "--asdfasdfasdf"
```

如果没有匹配的值，会抛出 `scala.MatchError`：

```scala
val CustomerID(name3) = "-asdfasdfasdf"
```

`unapply` 方法的返回值应当符合下面的某一条：

* 如果只是用来判断真假，可以返回一个 `Boolean` 类型的值。例如 `case even()`。
* 如果只是用来提取单个 T 类型的值，可以返回 `Option[T]`。
* 如果你想要提取多个值，类型分别为 `T1,...,Tn`，可以把它们放在一个可选的元组中 `Option[(T1,...,Tn)]`。

有时，要提取的值的数量不是固定的，因此我们想根据输入来返回随机数量的值。这种情况下，你可以用 `unapplySeq` 方法来定义提取器，此方法返回 `Option[Seq[T]]`。常见的例子有，用 `case List(x, y, z) =>` 来解构一个列表 `List`，以及用一个正则表达式 `Regex` 来分解一个字符串 `String`，例如 `case r(name, remainingFields @ _*) =>`。
