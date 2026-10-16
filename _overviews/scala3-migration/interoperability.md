---
title: Interoperability
type: chapter
description: How Scala 2.13 and Scala 3 modules and libraries can depend on each other
num: 2
previous-page: planning
next-page: preparing
redirect_from:
  - /scala3/guides/migration/compatibility-classpath.html
  - /scala3/guides/migration/compatibility-runtime.html
---

To use a module or library, the compiler reads the signatures of its definitions from the class files.
Scala 2.13 stores the signatures in the Pickle format, Scala 3 in the TASTy format.

## Scala 3 Can Use Scala 2.13 Binaries

The Scala 3 compiler reads the Scala 2.13 Pickle format, so a Scala 3 module can depend on modules and libraries compiled with Scala 2.13.
This works with every Scala 3 version.

![Scala 3 module depending on a Scala 2.13 artifact](/resources/images/scala3-migration/compatibility-3-to-213.svg)

In sbt:

```scala
// build.sbt
lazy val foo = project.in(file("foo"))
  .settings(scalaVersion := "3.9.0")
  .dependsOn(bar)

lazy val bar = project.in(file("bar"))
  .settings(scalaVersion := "2.13.18")
```

For a published Scala 2.13 library, `CrossVersion.for3Use2_13` makes sbt resolve `bar_2.13` instead of `bar_3`:

```scala
lazy val foo = project.in(file("foo"))
  .settings(
    scalaVersion := "3.9.0",
    libraryDependencies += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for3Use2_13)
  )
```

The Scala 3 compiler cannot expand Scala 2 macros, see [Macro Libraries](macros.html).

### The Standard Library

Up to 3.7, Scala 3 uses the Scala 2.13 standard library.
Since 3.8, the standard library is compiled with Scala 3. It is binary compatible with the 2.13 standard library, so code compiled with an earlier Scala 3 version or Scala 2.13 continues to work.

## Scala 2.13 Can Use Scala 3 Binaries

With the `-Ytasty-reader` option, Scala 2.13 can read the TASTy format of Scala 3 up to version 3.7.
It cannot read code compiled with Scala 3.8 or later.

![Scala 2 module depending on a Scala 3 artifact](/resources/images/scala3-migration/compatibility-213-to-3.svg)

In sbt:

```scala
// build.sbt
lazy val foo = project.in(file("foo"))
  .settings(
    scalaVersion := "2.13.18",
    scalacOptions += "-Ytasty-reader"
  )
  .dependsOn(bar)

lazy val bar = project.in(file("bar"))
  .settings(scalaVersion := "3.3.8")
```

### Supported Features

The TASTy reader supports all the traditional language features as well as the following Scala 3 features:
- [Enumerations]({{ site.scala3ref }}/enums/enums.html)
- [Intersection Types]({{ site.scala3ref }}/new-types/intersection-types.html)
- [Opaque Type Aliases]({{ site.scala3ref }}/other-new-features/opaques.html)
- [Type Lambdas]({{ site.scala3ref }}/new-types/type-lambdas.html)
- [Contextual Abstractions]({{ site.scala3ref }}/contextual) (new syntax)
- [Open Classes]({{ site.scala3ref }}/other-new-features/open-classes.html) (and inheritance of super traits)
- [Export Clauses]({{ site.scala3ref }}/other-new-features/export.html)

It partially supports:
- [Top-Level Definitions]({{ site.scala3ref }}/dropped-features/package-objects.html): they are only accessible through their synthetic object, for example `p.File$package.f` for a definition `f` in `p/File.scala`.
- [Extension Methods]({{ site.scala3ref }}/contextual/extension-methods.html)

It does not support the more advanced features:
- [Context Functions]({{ site.scala3ref }}/contextual/context-functions.html)
- [Polymorphic Function Types]({{ site.scala3ref }}/new-types/polymorphic-function-types.html)
- [Trait Parameters]({{ site.scala3ref }}/other-new-features/trait-parameters.html)
- `@static` Annotation
- `@alpha` Annotation
- [Functions and Tuples larger than 22 parameters]({{ site.scala3ref }}/dropped-features/limit22.html)
- [Match Types]({{ site.scala3ref }}/new-types/match-types.html)
- [Union Types]({{ site.scala3ref }}/new-types/union-types.html)
- [Multiversal Equality]({{ site.scala3ref }}/contextual/multiversal-equality.html) (unless explicit)
- [Inline]({{ site.scala3ref }}/metaprogramming/inline.html) (including Scala 3 macros)
- [Kind Polymorphism]({{ site.scala3ref }}/other-new-features/kind-polymorphism.html) (the `scala.AnyKind` upper bound)

Using an unsupported definition is an error at the use site; other definitions of the same module can still be used.

## Mixing Scala 2.13 and Scala 3 Modules

During a migration, a build can contain both Scala 2.13 and Scala 3 modules that depend on each other in both directions.

![Sandwich pattern](/resources/images/scala3-migration/compatibility-sandwich.svg)

A library can only be on the classpath once: either as `foo_2.13` or as `foo_3`, not both.
sbt reports an error when a build resolves both.
While the build is mixed, the project will use the `_2.13` artifacts of all Scala libraries, using `CrossVersion.for3Use2_13` in the Scala 3 modules.

For example, if the project uses `cats_2.13` in some 2.13 module, downstream dependencies such as `http4s` need to stay on `_2.13` too, even if they are only used in Scala 3 modules.

> #### Disclaimer for library maintainers
>
> Unless you know exactly what you are doing, it is discouraged to publish a Scala 3 library that depends on a Scala 2.13 library (the scala-library being excluded) or vice versa.
> The reason is to prevent library users from ending up with two conflicting versions `foo_2.13` and `foo_3` of the same foo library in their classpath, this problem being unsolvable in some cases.
