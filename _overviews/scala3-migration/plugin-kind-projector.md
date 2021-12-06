---
title: Kind Projector Migration
type: section
description: This section shows how to migrate from the kind-projector plugin to Scala 3 kind-projector syntax
num: 26
previous-page: plugin-intro
next-page: external-resources
---

In the future, Scala 3 will use the `_` underscore symbol for placeholders in type lambdas---just as the underscore is currently used for placeholders in (ordinary) term-level lambdas.

The new type lambda syntax is not enabled by default, to enable it, use a compiler flag `-Ykind-projector:underscores`. Note that enabling underscore type lambdas will disable usage of `_` as a wildcard, you will only be able to write wildcards using the `?` symbol. 

If you wish to cross-compile a project for Scala 2 & Scala 3 while using underscore type lambdas for both, you may do so starting with [kind-projector](https://github.com/typelevel/kind-projector) version `0.13.0` and up and Scala 2 versions `2.13.6` and `2.12.14`.
To enable it, add the compiler flags `-Xsource:3 -P:kind-projector:underscore-placeholders` to your build.
As in Scala 3, this will disable usage of `_` as a wildcard, however, the flag `-Xsource:3` will allow you to replace it with the `?` symbol. 

The following `sbt` configuration will set up the correct flags to cross-compile with new syntax:

```scala
ThisBuild / scalacOptions ++= {
  CrossVersion.partialVersion(scalaVersion.value) match {
    case Some((3, _)) => Seq("-Ykind-projector:underscores")
    case Some((2, 13)) | Some((2, 12)) => Seq("-Xsource:3", "-P:kind-projector:underscore-placeholders")
  }
}
```

## Migrating to New Syntax

To use underscores for type-lambdas in existing kind-projector enabled code, replace `*` or `?` type lambda placeholders with `_`.

In turn, you will also have to rewrite all usages of `_` as the wildcard to use `?` symbol.

For example the following usage of the wildcard:

```scala
def getWidget(widgets: Set[_ <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

Must be rewritten to:

```scala
def getWidget(widgets: Set[? <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

And the following usages of kind-projector's `*` placeholder:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

Must be rewritten to:

```scala
Tuple2[_, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +_]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-_, Long, +_]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## Compiling Existing Code

Even without migrating to underscore type lambdas, you will likely be able to compile most of it with Scala 3 without changes.

Use the flag `-Ykind-projector` to enable support for `*`-based type lambdas (without enabling underscore type lambdas), the following forms will now compile:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## Rewriting Incompatible Constructs

Scala 3's `-Ykind-projector` & `-Ykind-projector:underscores` implement only a subset of `kind-projector` syntax, in particular they do not implement:

* higher-kinded type lambda placeholders
* higher-kinded named type lambda parameters
* The `Lambda` keyword (`λ` is still supported)

You must rewrite ALL of the following forms:

```scala
// classic
EitherT[*[_], Int, *]    // equivalent to: type R[F[_], B] = EitherT[F, Int, B]
// underscores
EitherT[_[_], Int, _]    // equivalent to: type R[F[_], B] = EitherT[F, Int, B]
// named λ
λ[(F[_], A) => EitherT[F, Int, A]]
// named Lambda
Lambda[(F[_], A) => EitherT[F, Int, A]]
```

Into the following long-form to cross-compile with Scala 3:

```scala
type MyLambda[F[_], A] = EitherT[F, Int, A]
MyLambda
```

Alternatively you may use Scala 3's [Native Type Lambdas](https://dotty.epfl.ch/docs/reference/new-types/type-lambdas.html) if you do not need to cross-compile:

```scala
[F[_], A] =>> EitherT[F, Int, A]
```

For `Lambda` you must rewrite the following form:

```scala
Lambda[(`+E`, `+A`) => Either[E, A]]
```

To the following to cross-compile:

```scala
λ[(`+E`, `+A`) => Either[E, A]]
```

Or alternatively to Scala 3 type lambdas:

```scala
[E, A] =>> Either[E, A]
```

Note: Scala 3 type lambdas no longer need `-` or `+` variance markers on parameters, these are now inferred.
