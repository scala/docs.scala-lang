---
layout: tour
title: 隐式参数
partof: scala-tour

num: 24

language: zh-cn

next-page: implicit-conversions
previous-page: self-types
---

方法可以具有 _隐式_ 参数列表，由参数列表开头的 _implicit_ 关键字标记。 如果参数列表中的参数没有像往常一样传递， Scala 将查看它是否可以获得正确类型的隐式值，如果可以，则自动传递。

Scala 将查找这些参数的位置分为两类：

* Scala 在调用包含有隐式参数块的方法时，将首先查找可以直接访问的隐式定义和隐式参数 (无前缀)。
* 然后，它在所有伴生对象中查找与隐式候选类型相关的有隐式标记的成员。

更加详细的关于 Scala 到哪里查找隐式参数的指南请参考 [常见问题](//docs.scala-lang.org/tutorials/FAQ/finding-implicits.html)

在下面的例子中，我们定义了一个方法 `sum`，它使用 Monoid 类的 `add` 和 `unit` 方法计算一个列表中元素的总和。 请注意，隐式值不能是顶级值。

```scala mdoc
abstract class Monoid[A] {
  def add(x: A, y: A): A
  def unit: A
}

object ImplicitTest {
  implicit val stringMonoid: Monoid[String] = new Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  
  implicit val intMonoid: Monoid[Int] = new Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))
    
  def main(args: Array[String]): Unit = {
    println(sum(List(1, 2, 3)))       // uses IntMonoid implicitly
    println(sum(List("a", "b", "c"))) // uses StringMonoid implicitly
  }
}
```

类 `Monoid` 定义了一个名为 `add` 的操作，它将一对 `A` 类型的值相加并返回一个 `A`，以及一个名为 `unit` 的操作，用来创建一个（特定的）`A` 类型的值。

为了说明隐式参数如何工作，我们首先分别为字符串和整数定义 Monoid 实例， `StringMonoid` 和 `IntMonoid`。 `implicit` 关键字表示可以隐式使用相应的对象。

方法 `sum` 接受一个 `List[A]`，并返回一个 `A` 的值，它从 `unit` 中取初始的 `A` 值，并使用 `add` 方法依次将列表中的下一个 `A` 值相加。在这里将参数 `m` 定义为隐式意味着，如果 Scala 可以找到隐式 `Monoid[A]` 用于隐式参数 `m`，我们在调用 `sum` 方法时只需要传入 `xs` 参数。

在 `main` 方法中我们调用了 `sum` 方法两次，并且只传入参数 `xs`。 Scala 会在上例的上下文范围内寻找隐式值。 第一次调用 `sum` 方法的时候传入了一个 `List[Int]` 作为 `xs` 的值，这意味着此处类型 `A` 是 `Int`。 隐式参数列表 `m` 被省略了，因此 Scala 将查找类型为 `Monoid[Int]` 的隐式值。 第一查找规则如下

> Scala 在调用包含有隐式参数块的方法时，将首先查找可以直接访问的隐式定义和隐式参数 (无前缀)。

`intMonoid` 是一个隐式定义，可以在`main`中直接访问。 并且它的类型也正确，因此它会被自动传递给 `sum` 方法。

第二次调用 `sum` 方法的时候传入一个 `List[String]`，这意味着此处类型 `A` 是 `String`。 与查找 `Int` 型的隐式参数时类似，但这次会找到 `stringMonoid`，并自动将其作为 `m` 传入。

该程序将输出
```
6
abc
```
