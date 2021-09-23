---
title: Compiler Types
type: section
description: This page discusses the representation of types in the compiler
num: 12
previous-page: arch-phases
next-page: arch-time
---

## Common Types and their Representation

Type representations in `dotc` derive from the class `dotty.tools.dotc.core.Types.Type`,
defined in [dotty/tools/dotc/core/Types.scala][1]

### Types of Definitions

> In the tables below we see the internal representation of Scala types in `dotc`,
> in fact, you can reproduce the results with a helper program [dotty.tools.printTypes][2],
> its usage and integration into your debugging workflow is [described here][3].

The following table describes definitions in Scala 3, followed by the `dotc` representation
of two types - a reference to the definition, and then its underlying type:

Definition              | Reference       | Underlying Type
------------------------|-----------------|-------------------------
`type Z >: A <: B`      | `TypeRef(p, Z)` | `RealTypeBounds(A, B)`
`type Z = A`            | `TypeRef(p, Z)` | `TypeAlias(A)`
`type F[T] = T match …` | `TypeRef(p, F)` | `MatchAlias([T] =>> T match …)`
`class C`               | `TypeRef(p, C)` | `ClassInfo(p, C, …)`
`trait T`               | `TypeRef(p, T)` | `ClassInfo(p, T, …)`
`object o`              | `TermRef(p, o)` | `TypeRef(p, o$)` where `o$` is a class
`def f(x: A): x.type`   | `TermRef(p, f)` | `MethodType(x, A, TermParamRef(x))`
`def f[T <: A]: T`      | `TermRef(p, f)` | `PolyType(T, <: A, TypeParamRef(T))`
`def f: A`              | `TermRef(p, f)` | `ExprType(A)`
`(x: => A)`             | `TermRef(p, x)` | `ExprType(A)` where `x` is a parameter
`val x: A`              | `TermRef(p, x)` | `A`

Note: in the types above `p` refers to the self-type of the enclosing scope of
the definition, or `NoPrefix` for local definitions and parameters.

### Types of Values

The following types may appear in part of the type of an expression:

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
`[T <: A] =>> T`          | `HKTypeLambda(T, <: A, TypeParamRef(T))`
`p.C[A, B]`               | `AppliedType(p.C, List(A, B))`
`p { type A = T }`        | `RefinedType(p, A, T)`
`p { type X = Y }`        | `RecType((z: RecThis) => p { type X = z.Y })`<br/>when `X` and `Y` are members of `p`
`super.x.type`            | `TermRef(SuperType(…), x)`

## Constructing Types

### Method Definition Types

We saw above that method definitions can have an underlying type of
either `PolyType`, `MethodType`, or `ExprType`. `PolyType` and `MethodType`
may be mixed recursively however, and either can appear as the result type of the other.

Take this example as given:

```scala
def f[A, B <: Seq[A]](x: A, y: B): Unit
```
it can be constructed by the following code:

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
- Proxy Types (inheriting from `TypeProxy` via either `CachedProxyType` or `UncachedProxyType`)

A Proxy Type is anything that can be considered to be an abstraction of another type,
which can be accessed by the `underlying` method of the `TypeProxy` class. It's dual, the
Ground Type has no meaningful underlying type, typically it is the type of method and class
definitions, but also union types and intersection types, along with utility types of the
compiler.

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
[2]: https://github.com/lampepfl/dotty/blob/master/compiler/test/dotty/tools/DottyTypeStealer.scala
[3]: {% link _overviews/scala3-contribution/procedures-inspection.md %}/#inspecting-representation-of-types
