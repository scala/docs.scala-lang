---
layout: tour
title: 泛型类
partof: scala-tour

num: 16

language: zh-cn

next-page: variances
previous-page: extractor-objects
---
泛型类指可以接受类型参数的类。泛型类在集合类中被广泛使用。

## 定义一个泛型类
泛型类使用方括号 `[]` 来接受类型参数。一个惯例是使用字母 `A` 作为参数标识符，当然你可以使用任何参数名称。
```scala mdoc
class Stack[A] {
  private var elements: List[A] = Nil
  def push(x: A): Unit =
    elements = x :: elements 
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```
上面的 `Stack` 类的实现中接受类型参数 `A`。 这表示其内部的列表，`var elements: List[A] = Nil`，只能够存储类型 `A` 的元素。方法 `def push` 只接受类型 `A` 的实例对象作为参数(注意：`elements = x :: elements` 将 `elements` 放到了一个将元素 `x` 添加到 `elements` 的头部而生成的新列表中)。

## 使用

要使用一个泛型类，将一个具体类型放到方括号中来代替 `A`。
```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop)  // prints 2
println(stack.pop)  // prints 1
```
实例对象 `stack` 只能接受整型值。然而，如果类型参数有子类型，子类型可以被传入：
```
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = new Stack[Fruit]
val apple = new Apple
val banana = new Banana

stack.push(apple)
stack.push(banana)
```
类 `Apple` 和类 `Banana` 都继承自类 `Fruit`，所以我们可以把实例对象 `apple` 和 `banana` 压入栈 `Fruit` 中。

_注意：泛型类型的子类型是*不可传导*的。这表示如果我们有一个字母类型的栈 `Stack[Char]`，那它不能被用作一个整型的栈 `Stack[Int]`。否则就是不安全的，因为它将使我们能够在字母型的栈中插入真正的整型值。结论就是，只有当类型 `B = A` 时， `Stack[A]` 是 `Stack[B]` 的子类型才成立。因为此处可能会有很大的限制，Scala 提供了一种 [类型参数注释机制](variances.html) 用以控制泛型类型的子类型的行为。_
