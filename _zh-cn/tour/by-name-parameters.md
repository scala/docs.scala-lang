---
layout: tour
title: 传名参数
partof: scala-tour

num: 29

language: zh-cn

next-page: annotations
previous-page: operators
---

_传名参数_ 仅在被使用时触发实际参数的求值运算。 它们与 _传值参数_ 正好相反。 要将一个参数变为传名参数，只需在它的类型前加上 `=>`。
```scala mdoc
def calculate(input: => Int) = input * 37
```
传名参数的优点是，如果它们在函数体中未被使用，则不会对它们进行求值。 另一方面，传值参数的优点是它们仅被计算一次。
以下是我们如何实现一个 while 循环的例子：

```scala mdoc
def whileLoop(condition: => Boolean)(body: => Unit): Unit =
  if (condition) {
    body
    whileLoop(condition)(body)
  }

var i = 2

whileLoop (i > 0) {
  println(i)
  i -= 1
}  // prints 2 1
```
方法 `whileLoop` 使用多个参数列表来分别获取循环条件和循环体。 如果 `condition` 为 true，则执行 `body`，然后对 whileLoop 进行递归调用。 如果 `condition` 为 false，则永远不会计算 body，因为我们在 `body` 的类型前加上了 `=>`。

现在当我们传递 `i > 0` 作为我们的 `condition` 并且 `println(i); i-= 1` 作为 `body` 时，它表现得像许多语言中的标准 while 循环。

如果参数是计算密集型或长时间运行的代码块，如获取 URL，这种延迟计算参数直到它被使用时才计算的能力可以帮助提高性能。
