---
title: Type Checker
type: section
description: This chapter details the unsoundness fixes in the type checker
num: 19
previous-page: incompat-other-changes
next-page: incompat-type-inference
---

The Scala 2.13 type checker is unsound in some specific cases.
This can lead to surprising runtime errors in places we would not expect.
Scala 3 being based on stronger theoretical foundations, these unsoundness bugs in the type checker are now fixed.

## Unsoundness Fixes in Variance checks

In Scala 2, default parameters and inner-classes are not subject to variance checks.
It is unsound and might cause runtime failures, as demonstrated by this [test](https://github.com/lampepfl/dotty/blob/10526a7d0aa8910729b6036ee51942e05b71abf6/tests/neg/variances.scala) in the Scala 3 repository.

The Scala 3 compiler does not permit this anymore.

```scala
class Foo[-A](x: List[A]) {
  def f[B](y: List[B] = x): Unit = ???
}

class Outer[+A](x: A) {
  class Inner(y: A)
}
```

```text
-- Error: src/main/scala/variance.scala:2:8 
2 |  def f[B](y: List[B] = x): Unit = y
  |        ^^^^^^^^^^^^^^^^^
  |contravariant type A occurs in covariant position in type [B] => List[A] of method f$default$1
-- Error: src/main/scala/variance.scala:6:14 
6 |  class Inner(y: A)
  |              ^^^^
  |covariant type A occurs in contravariant position in type A of parameter y
```

Each problem of this kind needs a specific care.
You can try the following options on a case-by-case basis:
- Make type `A` invariant
- Add a lower or an upper bound on a type parameter `B`
- Add a new method overload

In our example, we can opt for these two solutions:

```diff
class Foo[-A](x: List[A]) {
-  def f[B](y: List[B] = x): Unit = ???
+  def f[B](y: List[B]): Unit = ???
+  def f(): Unit = f(x)
}

class Outer[+A](x: A) {
-  class Inner(y: A)
+  class Inner[B >: A](y: B)
}
```

Or, as a temporary solution, you can also use the `uncheckedVariance` annotation:

```diff
class Outer[+A](x: A) {
-  class Inner(y: A)
+  class Inner(y: A @uncheckedVariance)
}
```

## Unsoundness Fixes in Pattern Matching

Scala 3 fixes some unsoundness bugs in pattern matching, preventing some semantically wrong match expressions to type check.

For instance, the match expression in `combineReq` can be compiled with Scala 2.13 but not with Scala 3.

```scala
trait Request
case class Fetch[A](ids: Set[A]) extends Request

object Request {
  def combineFetch[A](x: Fetch[A], y: Fetch[A]): Fetch[A] = Fetch(x.ids ++ y.ids)

  def combineReq(x: Request, y: Request): Request = {
    (x, y) match {
      case (x @ Fetch(_), y @ Fetch(_)) => combineFetch(x, y)
    }
  }
}
```

The error message is:

```text
-- [E007] Type Mismatch Error: src/main/scala/pattern-match.scala:9:59 
9 |      case (x @ Fetch(_), y @ Fetch(_)) => combineFetch(x, y)
  |                                                           ^
  |                                                Found:    (y : Fetch[A$2])
  |                                                Required: Fetch[A$1]
```

Which is right, there is no proof that `x` and `y` have the same type paramater `A`.

Coming from Scala 2, this is clearly an improvement to help us locate mistakes in our code.
To solve this incompatibility it is better to find a solution that can be checked by the compiler.
It is not always easy and sometimes it is even not possible, in which case the code is likely to fail at runtime.

In this example, we can relax the constraint on `x` and `y` by stating that `A` is a common ancestor of both type arguments.
This makes the compiler type-check the code successfully.

```scala
def combineFetch[A](x: Fetch[_ <: A], y: Fetch[_ <: A]): Fetch[A] = Fetch(x.ids ++ y.ids)
```

Alternatively, a general but unsafe solution is to cast.
