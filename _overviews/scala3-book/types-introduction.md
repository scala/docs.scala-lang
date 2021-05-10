---
title: Types and the Type System
type: chapter
description: This chapter provides an introduction to Scala 3 types and the type system.
num: 47
previous-page: fp-summary
next-page: types-inferred
---


Scala is a unique language in that it’s statically typed, but often _feels_ flexible and dynamic.
For instance, thanks to type inference you can write code like this without explicitly specifying the variable types:

```scala
val a = 1
val b = 2.0
val c = "Hi!"
```

That makes the code feel dynamically typed.
And thanks to new features, like [union types][union-types] in Scala 3, you can also write code like the following that expresses very concisely which values are expected as arguments and which types are returned:

```scala
def isTruthy(a: Boolean | Int | String): Boolean = ???
def dogCatOrWhatever(): Dog | Plant | Car | Sun = ???
```

As the example suggests, when using union types, the types don’t have to share a common hierarchy, and you can still accept them as arguments or return them from a method.

If you’re an application developer, you’ll use features like type inference every day and generics every week.
When you read the Scaladoc for classes and methods, you’ll also need to have some understanding of _variance_.
Hopefully you’ll see that using types can be relatively simple and also offers a lot of expressive power, flexibility, and control for library developers.


## Benefits of types

Statically-typed programming languages offer a number of benefits, including:

- Helping to provide strong IDE support
- Eliminating many classes of potential errors at compile time
- Assisting in refactoring
- Providing strong documentation that cannot be outdated since it is type checked


## Introducing features of Scala’s type system

Given that brief introduction, the following sections provide an overview of the features of Scala’s type system.

[union-types]: {% link _overviews/scala3-book/types-union.md %}
