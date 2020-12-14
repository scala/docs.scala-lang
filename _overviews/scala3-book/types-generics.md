---
title: Generics
type: section
description: This section introduces and demonstrates generics in Scala 3.
num: 49
previous-page: types-inferred
next-page: types-intersection
---


Generic classes take a type as a parameter within square brackets `[]`. The Scala convention is to use the letter `A` for the first simple type parameter. That type is then used inside the class as needed to declare method parameters and return types:

```scala
class Stack[A]:
  private var elements: List[A] = Nil
  def push(x: A): Unit = { elements = x :: elements }
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

This implementation of a `Stack` class takes any type as a parameter. The beauty of generics is that you can now create a `Stack[Int]`, `Stack[String]`, and so on. This is how you create and use a `Stack[Int]`:

```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop)  // prints 2
println(stack.pop)  // prints 1
```

>See the [variance section](types-variance.md) for details on how to express variance with generic types.



{% comment %}
This subsection is good, but maybe too detailed for an overview.

The instance `stack` can only take integers. However, if the type argument had subtypes, those could be passed in:

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

Class `Apple` and `Banana` both extend `Fruit` so you can push instances `apple` and `banana` onto the stack of `Fruit`.

_Note: subtyping of generic types is *invariant*. This means that if we have a stack of characters of type `Stack[Char]` then it cannot be used as an integer stack of type `Stack[Int]`. This would be unsound because it would enable us to enter true integers into the character stack. To conclude, `Stack[A]` is only a subtype of `Stack[B]` if and only if `B = A`. Since this can be quite restrictive, Scala offers a [type parameter annotation mechanism](variances.html) to control the subtyping behavior of generic types._
{% endcomment %}



