---
title: Dependent Function Types
type: section
description: This section introduces and demonstrates dependent function types in Scala 3.
num: 57
previous-page: types-structural
next-page: types-others
---


<!-- TODO: Simplify more. -->

A *dependent function type* describes functions where the result type may depend on the function’s parameter values. For example:

```scala
trait Entry:
  type Key
  val key: Key

def extractKey(e: Entry): e.Key = e.key          // a dependent method
val extractor: (e: Entry) => e.Key = extractKey  // a dependent function value
//            ║   ⇓ ⇓ ⇓ ⇓ ⇓ ⇓ ⇓   ║
//            ║     Dependent        ║
//            ║   Function Type      ║
//            ╚══════════════════════╝
```

Scala already has *dependent methods*, i.e. methods where the result type refers to some of the parameters of the method. Method `extractKey` is an example. Its result type, `e.Key` refers to its parameter `e` (we also say, `e.Key` *depends* on `e`).

But until Scala 3 it wasn’t possible to turn such methods into function values, so they can be passed as parameters to other functions, or returned as results. Dependent methods could not be turned into functions simply because there was no type that could describe them.

In Scala 3 this is now possible. The type of the `extractor` value above is:

```scala
(e: Entry) => e.Key
```

This type describes function values that take any argument `e` of type `Entry` and return a result of type `e.Key`.

Recall that a normal function type `A => B` is represented as an instance of the `Function1` trait (i.e. `Function1[A, B]`) and analogously for functions with more parameters. Dependent functions are also represented as instances of these traits, but they get an additional refinement. In fact, the dependent function type above is just syntactic sugar for:

```scala
Function1[Entry, Entry#Key] {
  def apply(e: Entry): e.Key
}
```



