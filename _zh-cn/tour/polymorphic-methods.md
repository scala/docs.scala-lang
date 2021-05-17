---
layout: tour
title: 多态方法
partof: scala-tour

num: 26

language: zh-cn

next-page: type-inference
previous-page: implicit-conversions
---

Scala 中的方法可以按类型和值进行参数化。 语法和泛型类类似。 类型参数括在方括号中，而值参数括在圆括号中。

看下面的例子：

```scala mdoc
def listOfDuplicates[A](x: A, length: Int): List[A] = {
  if (length < 1)
    Nil
  else
    x :: listOfDuplicates(x, length - 1)
}
println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

方法 `listOfDuplicates` 具有类型参数 `A` 和值参数 `x` 和 `length`。 值 `x` 是 `A` 类型。 如果 `length < 1`，我们返回一个空列表。 否则我们将 `x` 添加到递归调用返回的重复列表中。 （注意，`::` 表示将左侧的元素添加到右侧的列表中。）

上例中第一次调用方法时，我们显式地提供了类型参数 `[Int]`。 因此第一个参数必须是 `Int` 类型，并且返回类型为 `List[Int]`。

上例中第二次调用方法，表明并不总是需要显式提供类型参数。 编译器通常可以根据上下文或值参数的类型来推断。 在这个例子中，`"La"` 是一个 `String`，因此编译器知道 `A` 必须是 `String`。
