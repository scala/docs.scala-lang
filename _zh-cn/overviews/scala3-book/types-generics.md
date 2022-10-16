---
title: 泛型
type: section
description: This section introduces and demonstrates generics in Scala 3.
num: 49
previous-page: types-inferred
next-page: types-intersection

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---


泛型类（或 traits）把在方括号 `[...]` 中的类型作为_参数_进行调用。
Scala 约定是使用单个字母（如 `A`）来命名这些类型参数。
然后当需要时，该类型可以在类中用于方法实例参数，或返回类型：

```scala
// here we declare the type parameter A
//          v
class Stack[A]:
  private var elements: List[A] = Nil
  //                         ^
  //  Here we refer to the type parameter
  //          v
  def push(x: A): Unit = { elements = elements.prepended(x) }
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

`Stack` 类的这个实现采用任何类型作为参数。
泛型的美妙之处在于您现在可以创建一个 `Stack[Int]`、`Stack[String]` 等，允许您将 `Stack` 的实现重复用于任意元素类型。

这是创建和使用 `Stack[Int]` 的方式：

```
val stack = Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // prints 2
println(stack.pop())  // prints 1
```

> 有关如何用泛型类型表达可变的详细信息，请参阅[型变（Variance）部分][variance]。

[variance]: {% link _zh-cn/overviews/scala3-book/types-variance.md %}
