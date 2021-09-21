---
title: Types in dotc
type: chapter
description: This page discusses the representation of types in the compiler
num: 2
previous-page: contribution-intro
---

## Common Types and their Representation

Type representations in `dotc` derive from the class `dotty.tools.dotc.core.Types.Type`,
defined in [dotty/tools/dotc/core/Types.scala][1]

### Types of Definitions

The following table describes definitions in Scala 3, followed by the `dotc` representation of a reference
to the definition, followed by the `dotc` representation of the underlying type of the definition:

Type                    | Reference       | Underlying Type
------------------------|-----------------|-------------------------
`type Z >: A <: B`      | `TypeRef(p, Z)` | `RealTypeBounds(A, B)`
`type Z = A`            | `TypeRef(p, Z)` | `TypeAlias(A)`
`type F[T] = T match …` | `TypeRef(p, F)` | `MatchAlias([T] =>> T match …)`
`class C`               | `TypeRef(p, C)` | `ClassInfo(p, C, …)`
`trait T`               | `TypeRef(p, T)` | `ClassInfo(p, T, …)`
`object o`              | `TermRef(p, o)` | `TypeRef(p, o$)`<br/>where `o$` is a class with inner definitions of `o`
`def f(x: A): x.type`   | `TermRef(p, f)` | `MethodType(x, A, TermParamRef(x))`
`def f[T <: A]: T`      | `TermRef(p, f)` | `PolyType(T, <: A, TypeParamRef(T))`
`def f: T`              | `TermRef(p, f)` | `ExprType(T)`
`val x: T`              | `TermRef(p, x)` | `T`

Note: in the types above `p` refers to the self-type of the enclosing scope of the definition.

### Types of Values

Type                      | Representation
--------------------------|------------------------------
`p.x.type`                | `TermRef(p, x)`
`p#T`                     | `TypeRef(p, T)`
`p.x.T` and `p.x.type#T`  | `TypeRef(TermRef(p, x), T)`
`this.type`               | `ThisType(C)` where `C` is the enclosing class
`"hello"`                 | `ConstantType(Constant("hello"))`
`A & B`                   | `AndType(A, B)`
`A | B`                   | `OrType(A, B)`
`A @foo`                  | `AnnotatedType(A, @foo)`
`=> T`                    | `ExprType(T)`
`[T <: A] =>> T`          | `HKTypeLambda(T, <: A, TypeParamRef(T))`
`p.C[A, B]`               | `AppliedType(p.C, List(A, B))`
`p { type A = T }`        | `RefinedType(p, A, T)`
`p { type X = Y }`        | `RecType((z: RecThis) => p { type X = z.Y })`<br/>when `X` and `Y` are members of `p`
`super.x.type`            | `TermRef(SuperType(…), x)`

### Method Definition Types

We saw above that method types can be represented

```scala
def f[A, B <: Seq[A]](x: A, y: B): Unit
```
can be constructed by:

```scala
import dotty.tools.dotc.core.Types.*
import dotty.tools.dotc.core.Symbols.*
import dotty.tools.dotc.core.Contexts.*
import dotty.tools.dotc.core.Decorators.*

given Context = … // contains the definitions of the compiler

val f: Symbol = … // def f[A, B <: Seq[A]](x: A, y: B): Unit

f.info = PolyType(
  List("A".toTypeName, "B".toTypeName))(
  pt => List(
    TypeBounds(defn.NothingType, defn.AnyType),
    TypeBounds(defn.NothingType, AppliedType(defn.SeqType, List(pt.newParamRef(0))))
  ),
  pt => MethodType(
    List("x".toTermName, "y".toTermName))(
    mt => List(pt.newParamRef(0), pt.newParamRef(1)),
    mt => defn.UnitType
  )
)
```

Note that `pt.newParamRef(0)` and `pt.newParamRef(1)` refers to the
type parameters `A` and `B` respectively.

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

[1]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/Types.scala
[4]: https://github.com/lampepfl/dotty/blob/master/compiler/src/dotty/tools/dotc/core/TypeComparer.scala
