---
title: Types and the Type System
type: chapter
description: This chapter provides an introduction to Scala 3 types and the type system.
num: 25
previous-page: functional-programming
next-page: types-inferred
---


Scala is a unique language in that it’s strongly typed, but often feels flexible and dynamic. For instance, thanks to type inference you can write code like this without explicitly specifying the variable types:

```scala
val a = 1
val b = 2.0
val c = "Hi!"
```

That makes the code feel dynamically typed. And thanks to new features, like *union types* in Scala 3, you can also write code like this, with methods that take flexible parameters and return flexible types:

```scala
def isTrue(a: Int | String): Boolean = ???
def dogCatOrWhatever(): Dog | Plant | Car | Sun = ???
```

As you can infer from that last example, types don’t have to share a common hierarchy, and you can still return them from a method. Uses like these make Scala feel strongly typed, and also dynamic.

If you’re an application developer, you’ll use features like type inference every day and generics every week. When you read the Scaladoc for classes and methods you’ll also need to have some understanding of variance. Hopefully you’ll see that using types is relatively simple — on a par with Java — and it also offers much more power, flexibility, and control for library developers.


## Benefits of types

Statically-typed programming languages offer a number of benefits, including:

- Helping to provide strong IDE support
- Eliminating many classes of potential errors at compile time
- Assisting in refactoring
- Providing strong, automatic documentation


## Introducing features of Scala’s type system

Gien that brief introduction, the following sections provide an overview of the features of Scala’s type system. 




