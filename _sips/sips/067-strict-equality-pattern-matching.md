---
layout: sip
number: 67
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
shipped: 3.10.0
presip-thread: https://contributors.scala-lang.org/t/pre-sip-better-strictequality-support-in-pattern-matching/6781
title: Strict-Equality pattern matching
---

**By: Matthias Berndt**

## History

| Date          | Version                                                   |
|---------------|-----------------------------------------------------------|
| Oct 3rd 2024  | Initial Draft                                             |
| Oct 3rd 2024  | Related Work                                              |
| Oct 4th 2024  | Add paragraph about using a type check instead of equals  |
| Oct 7th 2024  | Add paragraph about using `unapply` instead of equals     |
| Dec 3rd 2024  | Change the approach to a magic `CanEqual` instance        |
| Jan 3rd 2025  | Undo previous change, "magic `CanEqual`" has no benefits  |
| Mar 6th 2025  | Add examples                                              |
| Apr 11th 2026 | Incorporate feedback                                      |
## Summary

This proposal aims to make the `strictEquality` feature easier to adopt by making pattern matching
against singleton cases (e. g. `Nil` or `None`) work even when the relevant `sealed` or `enum` type
does not (or cannot) have a `derives CanEqual` clause.

## Motivation

The `strictEquality` feature is important to improve type safety. However due to the way that pattern matching in
Scala works, it requires a `CanEqual` instance when matching against an `object` or a singleton `enum` `case`.
This is problematic because it means that pattern matching doesn't work in the expected way for types where a
`derives CanEqual` clause is not desired.
By contrast, in languages like Haskell, an `Eq` instance is never required to perform pattern matching. It also
seems arbitrary that a `CanEqual` instance is required to match on types such as `Option` or `List` but not on
others such as `Either`.


A simple example is this code:

```scala
import scala.language.strictEquality

enum Nat:
  case Zero
  case Succ(n: Nat)

  def +(that: Nat): Nat =
    this match
      case Nat.Zero => that
      case Nat.Succ(x) => Nat.Succ(x + that)
```
This fails to compile with the following error message:

```
[error] ./nat.scala:9:10
[error] Values of types Nat and Nat cannot be compared with == or !=
[error]     case Nat.Zero => r
[error]          ^^^^^^^^
```
### Possible fixes today
 - add a `derives CanEqual` clause to the ADT definition. This is unsatisfactory for multiple reasons:
   - it is additional boilerplate code that needs to be added in potentially many places when enabling this option, thus hindering adoption
   - the ADT might not be under the user's control, e. g. defined in a 3rd party library
   - one might not *want* a `CanEqual` instance to be available for this type because one doesn't want this type to be compared with the `==`
     operator. For example, when one of the fields in the `enum` is a function, it actually isn't possible to perform a meaningful equality check.
     Functions inside ADTs are not uncommon, examples can be found for example in
     [ZIO](https://github.com/zio/zio/blob/65a35bcba47bdc1720fd86c612fc6573c84b460d/core/shared/src/main/scala/zio/ZIO.scala#L6075),
     [cats](https://github.com/typelevel/cats/blob/1cc04eca9f2bc934c869a7c5054b15f6702866fb/free/src/main/scala/cats/free/Free.scala#L219) or
     [cats-effect](https://github.com/typelevel/cats-effect/blob/eb918fa59f85543278eae3506fda84ccea68ad7c/core/shared/src/main/scala/cats/effect/IO.scala#L2235)
     It should be possible to match on such types without requiring a `CanEqual` instance that couldn't possibly work correctly in the general case.
 - turn the no-argument-list cases into empty-argument-list cases:
   ```scala
   enum Nat:
     case Zero() // notice the parens
     case Succ(n: Nat)
   ```
   The downsides are similar to the previous point:
   - doesn't work for ADTs defined in a library
   - hinders adoption in existing code bases by requiring new syntax (even more so, because now you not only need to change the `enum` definition
   but also every `match` and `PartialFunction` literal)
   - uglier than before
   - pointless overhead: can have more than one `Zero()` object at run-time
 - perform a type check instead:
   ```scala
    this match
      case _: Nat.Zero.type => that
      case Nat.Succ(x) => Nat.Succ(x + that)
   ```
   But like the previous solutions:
   - hinders adoption in existing code bases by requiring new syntax
   - looks uglier than before (even more so than the empty-argument-list thing)
     
For these reasons the current state of affairs is unsatisfactory and needs to improve in order to encourage adoption of `strictEquality` in existing code bases.
## Proposed solution

### Specification

The proposed solution is to not require a `CanEqual` instance during pattern matching when:
 - the pattern is an `object` that extends the scrutinee's type, or
 - the pattern is an `enum case` without a parameter list (e. g. `Nat.Zero`) and the scrutinee has that `enum` type (or a supertype thereof)

The semantics of pattern matching against a constant are otherwise unchanged, that is, `equals` will continue
to be invoked.

### Examples

#### Example 1

```scala
def foo(vector: Vector[Int]) =
  vector match
    case Nil => 0
```
This example is not affected by this SIP: `Vector[Int]` is not a supertype of `Nil.type`. `CanEqual` is still required.
(Note: This code produces an unreachable code warning, but the branch is nevertheless taken ([compiler bug #25933](https://github.com/scala/scala3/issues/25933))).

#### Example 2
```scala
def foo(list: List[Int]) =
  list match
    case Nil => 0
```
This example is affected by this SIP. `List[Int]` is a supertype of `Nil.type`, and `Nil` is a case object, hence no
`CanEqual` instance is required (Note: the example still compiles without this SIP because that `CanEqual` instance
is available. But with this SIP, pattern matching will no longer require it)

#### Example 3

```scala
val TheAnswer = 42

def foo(i: Int) =
  i match
    case TheAnswer => 0
```
This example is not affected by this SIP: `TheAnswer` is not an `object` or `enum case`, `CanEqual` is required like before.

#### Example 4
```scala
def foo(either: Either[String, Int]) =
  either match
    case Left(_) => "l"
    case Right(_) => "r"
```
This example is not affected by this SIP. It never required `CanEqual` as matching is performed using `unapply`.


#### Example 5
```scala
enum Foo:
  case Bar
  case Baz

def foo(x: Any) =
  x match
    case Foo.Bar => 0
```
This example is affected by this SIP: `Any` is a supertype of `Foo` and `Foo.Bar` is an `enum case` without a parameter list, hence no `CanEqual` instance is required. 

### Compatibility

This change creates no new compatibility issues and improves the compatibility of the `strictEquality` feature with existing code bases.

## Alternatives

1. It was proposed to instead change the `enum` feature so that it always includes an implicit `derives CanEqual` clause. This is unsatisfactory for many reasons:
   - doesn't work for sealed types
   - doesn't work for 3rd party libraries compiled with an older compiler
   - `CanEqual` might be undesirable for that type – doing general `==` comparisons is a more powerful operation than pattern matching, which can only compare
     for equality with the singleton `case`s, and hence pattern matching is possible for many types where a general `==` operation can not be implemented correctly.

1. It was proposed to change the behaviour of pattern matching from an `==` comparison to a type check, i. e. make `case Foo =>` equivalent to `case _: Foo.type =>`.
   - pro: the behaviour would be more consistent between `case class` and `case object` matching as matching against a `case class` also does a type check
   - contra: it is a backward incompatible change. A prominent example is `Nil`, whose `equals` method is overridden to return true for empty collections, even if these
     collections aren't of type `List`. Changing the behaviour would break such code
   - the author's opinion is that, while this is an approach that he might have chosen in a new language, the practical benefits over the existing behaviour are marginal and that therefore the compatibility concerns outweigh them in this case
1. It was proposed to change the behaviour of `case object` so that it adds a suitable `def unapply(n: Nat): Boolean` method and to have `case Foo =>` invoke the `unapply` method (like `case Foo() =>` does today) if one exists, falling back to `==` otherwise
   - pro: more consistent behaviour between `case object` and `case class` as `unapply` would be used in both cases
   - contra: behaviour of `match` statements now depends on *both* the version of the compiler that you're using *and* the compiler used to compile the ADT.
   - contra: incompatible change. If your `case object` has an overridden `equals` method (like e. g. `Nil` does), you now need to define an `unapply` method that delegates to `equals`, otherwise your code will break. 
   - authors opinion: same as for 2. Fine if this was a new language, but the benefits aren't huge and practical compatibility concerns matter more.
1. It was proposed to drop the requirement for a `CanEqual` instance during pattern matching
   entirely and rely solely on the unreachability warning that the compiler emits when the scrutinee
   type isn't a supertype of the pattern type.
   The author's opinion is that this does not provide sufficient safety around the `equals` method.
   As was explained above, `CanEqual` is not supposed to be available for types that cannot be
   meaningfully tested for equality, such as `Int => Int`. This proposal trivially allows equality
   comparisons between such types:
   ```
   val x: Int => Int = ???
   val y: Int => Int = ???
   x match
     case `y` => true
     case _ => false
   ```
   `strictEquality` currently prevents this from compiling, and that is a feature, not a bug.
   It should also be pointed out that adding a `: Any` type ascription will make all such
   comparisons compile, regardless of the type of the pattern. This is unfortunate as type
   ascriptions are normally a fairly safe and innocuous operation.
   The "philosophical" justification for nevertheless allowing matching against `case object`
   and singleton `enum case`s is that in an ideal world, we wouldn't even need to call `equals`
   to test for equality with these – the only thing that is equal to a singleton is the
   singleton itself, and hence we could in principle use reference equality for these cases
   (the fact that we don't is a mere concession to backward compatibility).
## Feedback …

- https://contributors.scala-lang.org/t/feedback-thread-for-strictequalitypatternmatching-new-in-3-8/7379
- https://users.scala-lang.org/t/your-experience-with-strictequalitypatternmatching-new-in-3-8/12208
- https://contributors.scala-lang.org/t/pre-sip-relaxed-strictequality-for-and/7356
- https://www.reddit.com/r/scala/comments/1r0ppxb/strictequalitypatternmatching_does_it_work_for_you/

The Feedback for the first iteration of this feature has been positive. If anything, the people who tried this wanted more of it. Specifically:
 - For the cases specified above (case objects and singleton enum cases) it was suggested to get rid of the `CanEqual` requirement for `==` comparisons as well
   - I personally don't see anything wrong with this idea, but I would consider it a distinct feature that should be discussed separately
 - It was suggested to also make this feature work with `object`s that lack a `case` modifier
   - I agree with this. It was originally specified only for `case object`s because `sealed trait`/`case class`/`case object` is the traditional encoding of ADTs in Scala, but limiting it to objects with `case` ultimately serves no discernable purpose.
   - after positive feedback from the committee, I've now modified the specification accordingly

### … and the conclusions I draw from it
Given the positive feedback, I would like to propose to the SIP committee:
 - slightly relax the conditions when this feature applies: a `case` modifier for `object`s should not be required
   - I've implemented the change here: https://github.com/scala/scala3/pull/25850
 - promote this feature to stable (i. e. make it the default behaviour when `strictEquality` is enabled) in either 3.9 or 3.10, at the committee's discretion
 

## Related Work
 - https://contributors.scala-lang.org/t/pre-sip-better-strictequality-support-in-pattern-matching/6781
 - https://contributors.scala-lang.org/t/how-to-improve-strictequality/6722
 - https://contributors.scala-lang.org/t/enumeration-does-not-derive-canequal-for-strictequality/5280
 - Implementation: https://github.com/scala/scala3/pull/23803
 - Implementation (stage 2) https://github.com/scala/scala3/pull/25850
