---
title: Generics
type: section
description: This section introduces and demonstrates generics in Scala 3.
languages: [zh-cn]
num: 49
previous-page: types-inferred
next-page: types-intersection
---


Generic classes (or traits) take a type as _a parameter_ within square brackets `[...]`.
The Scala convention is to use a single letter (like `A`) to name those type parameters.
The type can then be used inside the class as needed for method instance parameters, or on return types:

{% tabs stack class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
// here we declare the type parameter A
//          v
class Stack[A] {
  private var elements: List[A] = Nil
  //                         ^
  //  Here we refer to the type parameter
  //          v
  def push(x: A): Unit =
    elements = elements.prepended(x)
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
// here we declare the type parameter A
//          v
class Stack[A]:
  private var elements: List[A] = Nil
  //                         ^
  //  Here we refer to the type parameter
  //          v
  def push(x: A): Unit =
    elements = elements.prepended(x)
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```
{% endtab %}
{% endtabs %}

This implementation of a `Stack` class takes any type as a parameter.
The beauty of generics is that you can now create a `Stack[Int]`, `Stack[String]`, and so on, allowing you to reuse your implementation of a `Stack` for arbitrary element types.

This is how you create and use a `Stack[Int]`:

{% tabs stack-usage class=tabs-scala-version %}
{% tab 'Scala 2' %}
```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // prints 2
println(stack.pop())  // prints 1
```
{% endtab %}
{% tab 'Scala 3' %}
```
val stack = Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // prints 2
println(stack.pop())  // prints 1
```
{% endtab %}
{% endtabs %}

> See the [Variance section][variance] for details on how to express variance with generic types.


[variance]: {% link _overviews/scala3-book/types-variance.md %}
