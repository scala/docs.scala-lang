---
title: Types in dotc
type: chapter
description: This page discusses the representation of types in the compiler
num: 2
previous-page: contribution-intro
---

You can find the definition of the `dotc` types in [dotty/tools/dotc/core/Types.scala][1]

## Proxy Types and Ground Types
Types in `dotc` are divided into two semantic kinds:
- Ground Types (inheriting from either `CachedGroundType` or `UncachedGroundType`)
- Proxy Types (inheriting from either `CachedProxyType` or `UncachedProxyType`)

A Ground Type is considered atomic, and refers to ...

Here's a diagram, serving as the mental model of the most important and distinct types available after the `typer` phase, derived from [dotty/tools/dotc/core/Types.scala][1]:

```
Type -+- proxy_type --+- NamedType --------+- TypeRef
      |               |                     \
      |               +- SingletonType ----+- TermRef
      |               |                    +- ThisType
      |               |                    +- SuperType
      |               |                    +- ConstantType
      |               |                    +- TermParamRef
      |               |                    +- RecThis
      |               |                    +- SkolemType
      |               +- TypeParamRef
      |               +- RefinedOrRecType -+-- RefinedType
      |               |                   -+-- RecType
      |               +- AppliedType
      |               +- TypeBounds
      |               +- ExprType
      |               +- AnnotatedType
      |               +- TypeVar
      |               +- HKTypeLambda
      |               +- MatchType
      |
      +- ground_type -+- AndType
                      +- OrType
                      +- MethodOrPoly -----+-- PolyType
                      |                    +-- MethodType
                      +- ClassInfo
                      +- NoType
                      +- NoPrefix
                      +- ErrorType
                      +- WildcardType

```

## Representations of types

Type                      | Representation
------------------------- | -----------------------------
`p.x.type`                | `TermRef(p, x)`
`p#T`                     | `TypeRef(p, T)`
`p.x.T` and `p.x.type#T`  | `TypeRef(TermRef(p, x), T)`
`this.type`               | `ThisType(C)` where `C` is the enclosing class
`"hello"`                 | `ConstantType(Constant("hello"))`
`A & B`                   | `AndType(A, B)`
`A | B`                   | `OrType(A, B)`
`A @foo`                  | `AnnotatedType(A, @foo)`
`=> T`                    | `ExprType(T)`
`p.C[A, B]`               | `AppliedType(p.C, List(A, B))`
`p { type A = T }`        | `RefinedType(p, A, T)`
`p { type X = Y }`        | `RecType((z: RecThis) => p { type X = z.Y })`<br/>when `X` and `Y` are members of `p`
`super.x.type`            | `TermRef(SuperType(...), x)`
`type T >: A <: B`        | `TypeRef(p, T)`<br/>with underlying type `RealTypeBounds(A, B)`
`type T = A`              | `TypeRef(p, T)`<br/>with underlying type `TypeAlias(A)`
`class C`                 | `TypeRef(p, C)`<br/>with underlying type `ClassInfo(p, C, ...)`
`[T <: A] =>> T`          | `HKTypeLambda(T, <: A, TypeParamRef(T))`
`def f(x: A): x.type`     | `MethodType(x, A, TermParamRef(x))`
`def f[T <: A]: T`        | `PolyType(T, <: A, TypeParamRef(T))`

### Representation of methods ###
```scala
def f[A, B <: Ord[A]](x: A, y: B): Unit
```
is represented as:

```scala
val p = PolyType(List("A", "B"))(
  List(TypeBounds(Nothing, Any),
       TypeBounds(Nothing,
         RefinedType(Ordering,
           scala$math$Ordering$$T, TypeAlias(PolyParam(p, 0))))),
  m)

val m = MethodType(List("x", "y"),
  List(PolyParam(p, 0), PolyParam(p, 1)))(Unit)
```
(This is a slightly simplified version, e.g. we write `Unit` instead of
`TypeRef(TermRef(ThisType(TypeRef(NoPrefix,<root>)),scala),Unit)`).

Note that a PolyParam refers to a type parameter using its index (here A is 0
and B is 1).

## Subtyping checks ##
`topLevelSubType(tp1, tp2)` in [dotty/tools/dotc/core/TypeComparer.scala][4]
checks if `tp1` is a subtype of `tp2`.

### Type rebasing ###
**FIXME**: This section is no longer accurate because
https://github.com/lampepfl/dotty/pull/331 changed the handling of refined
types.

Consider [tests/pos/refinedSubtyping.scala][5]
```scala
class Test {

  class C { type T; type Coll }

  type T1 = C { type T = Int }

  type T11 = T1 { type Coll = Set[Int] }

  type T2 = C { type Coll = Set[T] }

  type T22 = T2 { type T = Int }

  var x: T11 = _
  var y: T22 = _

  x = y
  y = x

}
```
We want to do the subtyping checks recursively, since it would be nice if we
could check if `T22 <: T11` by first checking if `T2 <: T1`. To achieve this
recursive subtyping check, we remember that `T2#T` is really `T22#T`. This
procedure is called rebasing and is done by storing refined names in
`pendingRefinedBases` and looking them up using `rebase`.

## Type caching ##
TODO

## Type inference via constraint solving ##
TODO

[1]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Types.scala
[2]: https://github.com/samuelgruetter/dotty/blob/classdiagrampdf/dotty-types.pdf
[3]: https://github.com/samuelgruetter/scaladiagrams/tree/print-descendants
[4]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/TypeComparer.scala
[5]: https://github.com/lampepfl/dotty/blob/master/tests/pos/refinedSubtyping.scala
