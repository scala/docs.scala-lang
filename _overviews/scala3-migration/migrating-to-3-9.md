---
title: Migrating to Scala 3.9 and 3.10
type: chapter
description: Migrating code from Scala 3.3 to Scala 3.9 and 3.10
num: 5
previous-page: migrating-to-3-3
next-page: scala3-migrate
redirect_from:
  - /scala3/guides/migration/incompat-since-33.html
---

This step moves code that compiles with Scala 3.3 to Scala 3.9 (LTS) or 3.10 (Next).
Most of the changes are deprecations of Scala 2 syntax, which the compiler rewrites automatically.
The [Scala 3.9 announcement](https://www.scala-lang.org/news/3.9/) also describes this step.

## 1. Upgrade the JDK and the build

Scala 3.8 and later require JDK 17 or newer, both to compile and to run.
Upgrade the JDK first, if not done [while preparing](preparing.html), then sbt and its plugins, for example Scala.js.

## 2. Run the rewrites

The rewritten code no longer compiles with Scala 2.13.
Remove Scala 2.13 from the `crossScalaVersions` of the module first, or skip this step for modules that are still cross-built with Scala 2.13.

### Migration versions

`-source:3.x` sets the language version that the compiler applies; the default is the version of the compiler.
Each version has a migration variant, `-source:3.x-migration`:
- Changes that are errors in version 3.x are reported as migration warnings instead.
- Together with `-rewrite`, the compiler fixes the migration warnings that have a rewrite, and the deprecations of earlier versions that are not errors yet.

### The compilations

The rewrites run as a chain of compilations:

| Compiler | Options |
|-|-|
| Scala 3.7.4 | `-source:3.4-migration -rewrite`, then `-source:3.6-migration -rewrite`, then `-source:3.7-migration -rewrite` |
| Scala 3.9.0 | `-source:3.8-migration -rewrite`, then `-source:3.9-migration -rewrite` |
| Scala 3.10.0 | `-source:3.10-migration -rewrite` |

As with Scala 3.3, nothing is rewritten if a compilation reports an error: fix the errors by hand, then run the compilation again.
Commit after each compilation.
The `3.6-migration` and `3.7-migration` compilations also warn about changes in the [prioritization of givens](#prioritization-of-givens), which have no rewrite.

Scala 3.7.4 is only used to run the rewrites; the build does not have to be released or tested with it.
Scala 3.7 is the last version that uses the Scala 2.13 standard library.
In the Scala 3.8+ standard library, context bounds are `using` clauses, so an explicit argument such as `xs.toArray(ClassTag.Int)` is a type error that Scala 3.8 cannot rewrite.
On Scala 3.7.4, `-source:3.7-migration` rewrites it to `xs.toArray(using ClassTag.Int)`.

The Scala 3.9 announcement suggests running every version from `3.4-migration` to `3.9-migration`; `3.5-migration` adds no rewrite and can be skipped.

In sbt, run each compilation as follows, with the Scala version and `-source` option from the table:

{% highlight text %}
sbt:example> set example / scalaVersion := "3.7.4"
sbt:example> set example / scalacOptions ++= Seq("-source:3.4-migration", "-rewrite")
sbt:example> example / Test / compile
sbt:example> reload
{% endhighlight %}

### What is rewritten

| Change | Rewrite | Version |
|-|-|-|
| Explicit argument to a context bound defined in Scala 3 | `using` added | `3.4-migration` |
| `A with B` type | `A & B` | `3.4-migration` |
| `_` type wildcard, `xs: _*`, `f _`, `private[this]`, `var x = _`, alphanumeric infix operator | `?`, `xs*`, `f`, `private`, `uninitialized`, backticks | `3.4-migration` |
| Positional arguments to Java annotations | named arguments | `3.6-migration` |
| Infix arguments that are now named tuples | method call | `3.6-migration` (see [Known problems](#known-problems)) |
| Explicit argument to an implicit parameter, including context bounds of the Scala 2.13 standard library | `using` added | `3.7-migration` |
| `$` in names | backticks | `3.9-migration` |

A migration version without `-rewrite` can change the behavior of the code. For example:

```scala
val xs: List[Any] = List((1, 2), "x", (3, 4))
for ((a: Int, b: Int) <- xs) yield a + b
```

In Scala 2.13 and 3.3, this skips the elements that don't match the pattern and returns `List(3, 7)`.
In Scala 3.9 it is an error, and under `-source:3.4-migration` it compiles with a warning, but throws a `MatchError` at run time.
The rewrite, `for (case (a: Int, b: Int) <- xs)`, keeps the original behavior.

### Known problems

- Scala 3.7.4 rewrites `case x: A with B =>` to `case x: A & B =>`, which does not compile.
  Add parentheses by hand: `case x: (A & B) =>`.
- An infix call with a single named argument, `a ** (x = 2)`, is an error under `-source:3.6-migration` instead of a migration warning.
  It is rewritten by `-source:3.7-migration`, but positional arguments to Java annotations are only rewritten by `-source:3.6-migration`.
  If a module contains both, rewrite the infix calls by hand first, for example to `a.**(x = 2)`.

## 3. Changes without a rewrite

### Standard library

Since Scala 3.8:
- `scala.App` is deprecated.
  Scala 3.10 rewrites `object Main extends App { ... }` to an object with a `main` method under `-Yapp-to-main -rewrite`.
  It skips the cases it cannot rewrite safely, with a warning.
- Code that uses `scala.reflect.runtime.universe` (from `scala-reflect`) may fail to initialize at run time.

### Prioritization of givens

Since Scala 3.7, when several `given` instances match, the compiler chooses the most general one instead of the most specific one:

```scala
class A
class B extends A

given a: A = A()
given b: B = B()

summon[A] // `b` up to Scala 3.6, `a` since Scala 3.7
```

- When both candidates are Scala 2 `implicit` definitions, the compiler keeps choosing the most specific one, so code migrated from Scala 2.13 is not affected.
- When one candidate is an `implicit` and the other a `given`, the result can be an ambiguity error.

Compiling with `-source:3.6-migration` or `-source:3.7-migration` reports a warning wherever the result changes.
This also applies when converting `implicit` definitions to `given` instances, for example with `-Yimplicit-to-given -rewrite` (since Scala 3.7.2).

### Scala 3.10

The [release notes](https://github.com/scala/scala3/releases/tag/3.10.0) of Scala 3.10 list its breaking changes.

## 4. Switch the build

Set the `scalaVersion` to `3.9.0` or `3.10.0`, switch the libraries from their `_2.13` versions (`CrossVersion.for3Use2_13`) to `_3` versions, and run the tests.
