---
layout: sip
number: 57
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
presip-thread: https://contributors.scala-lang.org/t/pre-sip-replace-non-sensical-unchecked-annotations/6342
stage: completed
status: shipped
title: Replace non-sensical @unchecked annotations
---

**By: Martin Odersky and Jamie Thompson**

## History

| Date          | Version            |
|---------------|--------------------|
| Dec 8th 2023  | Initial Draft      |
| Jan 19th 2024 | Clarification about current @unchecked behavior |
| Jun 3rd 2025  | Rename `.runtimeCheck` to `.runtimeChecked` |

## Summary

We propose to replace the mechanism to silence warnings for "unchecked" patterns, in the cases where silencing the warning will still result in the pattern being checked at runtime.

Currently, a user can silence warnings that a scrutinee may not be matched by a pattern, by annotating the scrutinee with the `@unchecked` annotation. This SIP proposes to use a new annotation `@RuntimeCheck` to replace `@unchecked` for this purpose. For convenience, an extension method will be added to `Predef` that marks the receiver with the annotation (used as follows: `foo.runtimeChecked`). Functionally it behaves the same as the old annotation, but improves readability at the callsite.

## Motivation

As described in [Scala 3 Reference: Pattern Bindings](https://docs.scala-lang.org/scala3/reference/changed-features/pattern-bindings.html), under `-source:future` it is an error for a pattern definition to be refutable. For instance, consider:
```scala
def xs: List[Any] = ???
val y :: ys = xs
```

This compiled without warning in 3.0, became a warning in 3.2, and we would like to make it an error by default in a future 3.x version.
As an escape hatch we recommend to use `@unchecked`:
```
-- Warning: ../../new/test.scala:6:16 ------------------------------------------
6 |  val y :: ys = xs
  |                ^^
  |pattern's type ::[Any] is more specialized than the right hand side expression's type List[Any]
  |
  |If the narrowing is intentional, this can be communicated by adding `: @unchecked` after the expression,
  |which may result in a MatchError at runtime.
```
Similarly for non-exhaustive `match` expressions, where we also recommend to put `@unchecked` on the scrutinee.

But `@unchecked` has several problems. First, it is ergonomically bad. For instance to fix the exhaustivity warning in
```scala
xs match
  case y :: ys => ...
```
we'd have to write
```
(xs: @unchecked) match
  case y :: ys => ...
```
Having to wrap the `@unchecked` in parentheses requires editing in two places, and arguably harms readability: both due to the churn in extra symbols, and because in this use case the `@unchecked` annotation poorly communicates intent.

Nominally, the purpose of the annotation is to silence warnings (_from the [API docs](https://www.scala-lang.org/api/3.3.1/scala/unchecked.html#)_):
> An annotation to designate that the annotated entity should not be considered for additional compiler checks.

_The exact meaning of this description is open to interpretation, leading to differences between Scala 2.13 and Scala 3.x. See the [misinterpretation](#misinterpretation-of-unchecked) annex for more._


In the following code however, the word `unchecked` is a misnomer, so could be confused for another meaning by an inexperienced user:

```scala
def xs: List[Any] = ???
val y :: ys = xs: @unchecked
```
 After all, the pattern `y :: ys` _is_ checked, but it is done at runtime (by looking at the runtime class), rather than statically.

As a direct contradiction, in the following usage of `unchecked`, the meaning is the opposite:
```scala
xs match
  case ints: List[Int @unchecked] =>
```
Here, `@unchecked` means that the `Int` parameter will _not_ be checked at runtime: The compiler instead trusts the user that `ints` is a `List[Int]`. This could lead to a `ClassCastException` in an unrelated piece of code that uses `ints`, possibly without leaving a clear breadcrumb trail of where the faulty cast originally occurred.

## Proposed solution

### High-level overview

This SIP proposes to fix the ergnomics and readability of `@unchecked` in the usage where it means "checked at runtime", by instead adding a new annotation `scala.internal.RuntimeCheck`.

```scala
package scala.annotation.internal

final class RuntimeCheck extends Annotation
```

In all usages where the compiler looks for `@unchecked` for this purpose, we instead change to look for `@RuntimeCheck`.

By placing the annotation in the `internal` package, we communicate that the user is not meant to directly use the annotation.

Instead, for convenience, we provide an extension method `Predef.runtimeChecked`, which can be applied to any expression.

The new usage to assert that a pattern is checked at runtime then becomes as follows:
```scala
def xs: List[Any] = ???
val y :: ys = xs.runtimeChecked
```

We also make `runtimeChecked` a transparent inline method. This ensures that the elaboration of the method defines its semantics. (i.e. `runtimeChecked` is not meaningful because it is immediately inlined at type-checking).

### Specification

The addition of a new `scala.Predef` method:

```scala
package scala

import scala.annotation.internal.RuntimeCheck

object Predef:
  extension [T](x: T)
    transparent inline def runtimeChecked: x.type =
      x: @RuntimeCheck
```

### Compatibility

This change carries the usual backward binary and TASTy compatibility concerns as any other standard library addition to the Scala 3 only library.

Considering backwards source compatibility, the following situation will change:

```scala
// source A.scala
package example

extension (predef: scala.Predef.type)
  transparent inline def runtimeChecked[T](x: T): x.type =
    println("fake runtimeChecked")
    x
```
```scala
// source B.scala
package example

@main def Test =
  val xs = List[Any](1,2,3)
  val y :: ys = Predef.runtimeChecked(xs)
  assert(ys == List(2, 3))
```

Previously this code would print `fake runtimeChecked`, however with the proposed change then recompiling this code will _succeed_ and no longer will print.

Potentially we could mitigate this if necessary with a migration warning when the new method is resolved (`@experimental` annotation would be a start)


In general however, the new `runtimeChecked` method will not change any previously linking method without causing an ambiguity compilation error.

### Other concerns

In 3.3 we already require the user to put `@unchecked` to avoid warnings, there is likely a significant amount of existing code that will need to migrate to the new mechanism. (We can leverage already exisiting mechanisms help migrate code automatically).

### Open questions

1) A large question was should the method or annotation carry semantic weight in the language. In this proposal we weigh towards the annotation being the significant element.
The new method elaborates to an annotated expression before the associated pattern exhaustivity checks occur.
2) Another point, where should the helper method go? In Predef it requires no import, but another possible location was the `compiletime` package. Requiring the extra import could discourage usage without consideration - however if the method remains in `Predef` the name itself (and documentation) should signal danger, like with `asInstanceOf`.

3) Should the `RuntimeCheck` annotation be in the `scala.annotation.internal` package?

### Misinterpretation of unchecked

We would further like to highlight that the `unchecked` annotation is unspecified except for its imprecise API documentation. This leads to a crucial difference in its behavior between Scala 2.13 and the latest Scala 3.3.1 release.

#### Scala 3 semantics

Say you have the following:
```scala
val xs = List(1: Any)
```

The following expression in Scala 3.3.1 yields two warnings:
```scala
xs match {
  case is: ::[Int] => is.head
}
```

```scala
2 warnings found
-- [E029] Pattern Match Exhaustivity Warning: ----------------------------------
1 |xs match {
  |^^
  |match may not be exhaustive.
  |
  |It would fail on pattern case: List(_, _*), Nil
  |
  | longer explanation available when compiling with `-explain`
val res0: Int = 1
-- Unchecked Warning: ----------------------------------------------------------
2 |  case is: ::[Int] => is.head
  |       ^
  |the type test for ::[Int] cannot be checked at runtime because its type arguments can't be determined from List[Any]
```

using `@unchecked` on `xs` has the effect of silencing any warnings that depend on checking `xs`, so no warnings will be emitted for the following change:

```scala
(xs: @unchecked) match {
  case is: ::[Int] => is.head
}
```

#### Scala 2.13 semantics

However, in Scala 2.13, this will only silence the `match may not be exhaustive` warning, and the user will still see the `type test for ::[Int] cannot be checked at runtime` warning:

```scala
scala> (xs: @unchecked) match {
     |   case is: ::[Int] => is.head
     | }          ^
On line 2: warning: non-variable type argument Int in type pattern scala.collection.immutable.::[Int] (the underlying of ::[Int]) is unchecked since it is eliminated by erasure
val res2: Int = 1
```

#### Aligning to Scala 2.13 semantics with `runtimeChecked`

with `xs.runtimeChecked` we should still produce an unchecked warning for `case is: ::[Int] =>`
```scala
scala> xs.runtimeChecked match {
     |   case is: ::[Int] => is.head
     | }
1 warning found
-- Unchecked Warning: ----------------------------------------------------------
2 |  case is: ::[Int] => is.head
  |       ^
  |the type test for ::[Int] cannot be checked at runtime because its type arguments can't be determined from List[Any]
val res13: Int = 1
```
This is because `xs.runtimeChecked` means trust the user as long as the pattern can be checked at runtime.

To fully avoid warnings, the `@unchecked` will be put on the type argument:
```scala
scala> xs.runtimeChecked match {
     |   case is: ::[Int @unchecked] => is.head
     | }
val res14: Int = 1
```
This has a small extra migration cost because if the scrutinee changes from `(xs: @unchecked)` to `xs.runtimeChecked` now some individual cases might need to add `@unchecked` on type arguments to avoid creating new warnings - however this cost is offset by perhaps revealing unsafe patterns previously unaccounted for.

Once again `@nowarn` can be used to fully restore any old behavior

## Alternatives

1) make `runtimeChecked` a method on `Any` that returns the receiver (not inline). The compiler would check for presence of a call to this method when deciding to perform static checking of pattern exhaustivity. This idea was criticised for being brittle with respect to refactoring, or automatic code transformations via macro.

2) `runtimeChecked` should elaborate to code that matches the expected type, e.g. to heal `t: Any` to `Int` when the expected type is `Int`. The problem is that this is not useful for patterns that can not be runtime checked by type alone. Also, it implies a greater change to the spec, because now `runtimeChecked` would have to be specially treated.

## Related work

- [Pre SIP thread](https://contributors.scala-lang.org/t/pre-sip-replace-non-sensical-unchecked-annotations/6342)
- [Scala 3 Reference: Pattern Bindings](https://docs.scala-lang.org/scala3/reference/changed-features/pattern-bindings.html),
- None of OCaml, Rust, Swift, or Java offer explicit escape hatches for non-exhaustive pattern matches (Haskell does not even warn by default). Instead the user must add a default case, (making it exhaustive) or use the equivalent of `@nowarn` when they exist.

## FAQ

N/A so far.
