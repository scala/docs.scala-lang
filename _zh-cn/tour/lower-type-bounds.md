---
layout: tour
title: 类型下界
partof: scala-tour

num: 19

language: zh-cn

next-page: inner-classes
previous-page: upper-type-bounds
---

[类型上界](upper-type-bounds.html) 将类型限制为另一种类型的子类型，而 *类型下界* 将类型声明为另一种类型的超类型。 术语 `B >: A` 表示类型参数 `B` 或抽象类型 `B` 是类型 `A` 的超类型。 在大多数情况下，`A` 将是类的类型参数，而 `B` 将是方法的类型参数。

下面看一个适合用类型下界的例子：

```scala mdoc:fail
trait Node[+B] {
  def prepend(elem: B): Node[B]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
}
```

该程序实现了一个单链表。 `Nil` 表示空元素（即空列表）。 `class ListNode` 是一个节点，它包含一个类型为 `B` (`head`) 的元素和一个对列表其余部分的引用 (`tail`)。 `class Node` 及其子类型是协变的，因为我们定义了 `+B`。

但是，这个程序 _不能_ 编译，因为方法 `prepend` 中的参数 `elem` 是*协*变的 `B` 类型。 这会出错，因为函数的参数类型是*逆*变的，而返回类型是*协*变的。

要解决这个问题，我们需要将方法 `prepend` 的参数 `elem` 的型变翻转。 我们通过引入一个新的类型参数 `U` 来实现这一点，该参数具有 `B` 作为类型下界。

```scala mdoc
trait Node[+B] {
  def prepend[U >: B](elem: U): Node[U]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
}
```

现在我们像下面这么做：
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird


val africanSwallowList= ListNode[AfricanSwallow](AfricanSwallow(), Nil())
val birdList: Node[Bird] = africanSwallowList
birdList.prepend(EuropeanSwallow())
```
可以为 `Node[Bird]` 赋值 `africanSwallowList`，然后再加入一个 `EuropeanSwallow`。
