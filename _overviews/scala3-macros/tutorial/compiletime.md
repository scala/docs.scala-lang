---
layout: multipage-overview
type: section

title: Scala Compile-time Operations

partof: scala3-macros
overview-name: Macros in Scala 3

scala3: true
num: 3

previous-page: inline
next-page: macros
---

Operations in [scala.compiletime][compiletime-api] are metaprogramming operations that can be used within an `inline` method.
These operation do cover some common use cases of macros without you needing to define a macro.

## Reporting

It is possible to emmit error messages when inlining code.

```scala
inline def doSomething(inline mode: Boolean): Unit =
  if mode then ...
  else if !mode then ...
  else error("Mode must be a know value")

doSomething(true)
doSomething(false)
val bool: Boolean = ...
doSomething(bool) // error: Mode must be a known value
```

If `error` is called outside an inline method the error will be emitted when compiling that call.
If the `error` is written inside an inline method, the error will be emitted only if after inlining the call in not removed as part of a dead branch.
In the previous example we used the value of `mode` is know we would only keep one of the first two branches.

If we want to include part the source code of the arguments in the error message we can use the `code` string interpolator.

```scala
inline def doSomething(inline mode: Boolean): Unit =
  if mode then ...
  else if !mode then ...
  else error(code"Mode must be a known value but got: $mode")

val bool: Boolean = ...
doSomething(bool) // error: Mode must be a known value but got: bool
```

## Summoning

There are two ways to summon values in inline methods, the first is with a `using` parameter and the second is with one of `summonInline`, `summonAll` or `summonFrom`.
`using` will summon the value at call site before inlining as if the method was not `inline`.
On the other hand, `summonInline` will summon after inlining if the call is not eliminated form a dead branch.
Summon all provides a way to summon multiple values at the same time from a tuple type.
`summonFrom` provides a way to try several implicit searches.

## Values
* `constValue`, `constValueOpt` and `constValueTuple`
* `S`
*Coming soon*

## Testing
* `testing.typeChecks` and `testing.typeCheckErrors`

## Assertions
* `byName`

*Coming soon*

## Inline Matching
* `erasedValue`

*Coming soon*

## Ops (scala.compiletime.ops)
*Coming soon*


[best-practices]: ../best-practices
[compiletime]: compiletime
[faq]: ../faq
[inline]: inline
[macros]: macros
[migration-status]: https://scalacenter.github.io/scala-3-migration-guide/docs/macros/migration-status.html
[quotes]: quotes
[references]: ../other-resources
[tasty]: tasty-reflection
[compiletime-api]: https://dotty.epfl.ch/api/scala/compiletime/index.html
