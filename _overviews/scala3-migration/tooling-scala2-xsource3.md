---
title: Scala 2 with -Xsource:3
type: chapter
description: This section describes the Scala 2 compiler's -Xsource:3 flag
num: 7
previous-page: tooling-tour
next-page: tooling-migration-mode
---

The Scala 2.13 compiler issues helpful migration warnings with the `-Xsource:3` flag.
Before moving to the Scala 3 compiler, it's recommended to enable this flag in Scala 2 and address the new warnings.
In addition to new warnigns, the flag enables certain benign Scala 3 syntax such as `import p.*`.

This page explains the details behind the flag, an overview is shown using `scalac -Xsource:help`.

## Migration vs cross-building

With Scala 2.13.13 and newer, the `-Xsource:3` flag comes in two variants:

  - `Xsource:3` enables warnings relevant for migrating a codebase to Scala 3.
  - `Xsource:3-cross` is useful for projects that cross-build between Scala 2 and 3 for a longer period of time.
    For certain language constructs that trigger a warning with `-Xsource:3`, the behavior changes to match Scala 3.

Details about individual warnings are listed below on this page.

## Fatal warnings and quick fixes

By default, Scala 3 migration warnings emitted by Scala 2.13 are fatal, i.e., they are reported as errors.
This can be changed using `-Wconf`, for example `-Wconf:cat=scala3-migration:w` changes them to be reported as warnings.
Alternatively, `-Xmigration` has the same effect.

The [`@nowarn` annotation](https://www.scala-lang.org/api/current/scala/annotation/nowarn.html) can be used to suppress individual warnings, which also works with fatal warnings enabled.

The Scala 2.13 compiler implements quick fixes for many Scala 3 migration warnings.
Quick fixes are displayed in Metals-based IDEs (not yet in IntelliJ), and they can be applied directly to the source code using the `-quickfix` flag, for example `-quickfix:cat=scala3-migration`.
See also `scalac -quickfix:help`.

## Enabled Scala 3 syntax

The `-Xsource:3` flag enables the following Scala 3 syntax in Scala 2:

  - `import p.*`
  - `import p.m as n`
  - `import p.{given, *}`
  - `case C(xs*)` as an alias for `case C(xs @ _*)`
  - `A & B` type intersection as an alias for `A with B`
  - Selecting a method `x.f` performs an eta-expansion (`x.f _`), even without an expected type


## Scala 3 migration warnings in detail

Many Scala 3 migration warnings are easy to understand and identical under `-Xsource:3` and `-Xsource:3-cross`, e.g., for implicit definitions without an explicit type:

{% highlight text %}
scala> object O { implicit val s = "" }
                               ^
       error: Implicit definition must have explicit type (inferred String) [quickfixable]
{% endhighlight %}

The following table explains warnings where where the behavior changes between `-Xsource:3` and `-Xsource:3-cross`.

| Feature | `-Xsource:3` | `-Xsource:3-cross` |
|--- |--- |--- |
| `(x: Any) + ""` is deprecated | deprecation warning | does not compile, implicit `any2stringadd` is not inferred |
| Unicode escapes in triple-quoted strings and raw interpolations (`"""\u0061"""`) | fatal warning, escape is processed | escape is not processed |
| Leading infix operators continue the previous line <sup>1</sup> | fatal warning, second line is a separate expression | operation continues the previous line |
| Desugaring of string interpolators using `StringContext` | fatal warning if the interpolation references a `StringContext` in scope different from `scala.StringContext` | desugaring always uses `scala.StringContext` |
| Modifiers of `apply` and `copy` methods of case classes with non-public constructors: `case class C private[p] (x: Int)` | fatal warning about the generated `apply` and `copy` being public | `apply` and `copy` inherit the access modifiers from the constructor |
| Inferred type of an overriding member <sup>2</sup> | fatal warning, the type of `B.f` is `String` | the type of `B.f` is `Object` |
| An implicit for type `p.A` is found in the package prefix `p` | fatal warning | the package prefix `p` is no longer part of the implicit search scope |

Example 1:

{% highlight text %}
  def f =
    1
    + 2
{% endhighlight %}

Example 2:

{% highlight text %}
trait A { def f: Object }
class B extends A { def f = "hi" }
{% endhighlight %}
