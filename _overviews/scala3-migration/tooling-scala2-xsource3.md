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

There is also a variant, `-Xsource:3-cross`; see below. **Note: Enabling `-Xsource:3-cross` in Scala 2.13.13 breaks binary compatibility, follow [scala/bug#12961](https://github.com/scala/bug/issues/12961) for details.**

This page explains the details behind the flags. An overview is shown using `scalac -Xsource:help`.

## Migration vs cross-building

With Scala 2.13.13 and newer, the `-Xsource:3` flag comes in two variants:

  - `Xsource:3` enables warnings relevant for migrating a codebase to Scala 3.
    In addition to new warnings, the flag enables certain benign Scala 3 syntaxes such as `import p.*`.
  - `Xsource:3-cross` is useful for projects that cross-build between Scala 2 and 3.
    It is intended to reduce the maintenance burden of a cross-built project over time.
    Certain language constructs have been backported from Scala 3 in order to improve compatibility.
    Instead of warning about a behavior change in Scala 3, it adopts the new behavior.
    These features can be selectively enabled using `-Xsource-features` (since 2.13.14).

Details about individual warnings are listed below on this page.

## Warnings as errors, and quick fixes

By default, Scala 3 migration warnings emitted by Scala 2.13 are reported as errors,
using the default configuration, `-Wconf:cat=scala3-migration:e`.
That ensures that migration messaging is more visible.
Diagnostics can be emitted as warnings by specifying `-Wconf:cat=scala3-migration:w`.
Typically, emitting warnings instead of errors will cause more diagnostics to be reported.

The [`@nowarn` annotation](https://www.scala-lang.org/api/current/scala/annotation/nowarn.html) can be used in program sources to suppress individual warnings.
Diagnostics are suppressed before they are promoted to errors, so that `@nowarn` takes precedence over `-Wconf` and `-Werror`.

The Scala 2.13 compiler implements quick fixes for many Scala 3 migration warnings.
Quick fixes are displayed in Metals-based IDEs (not yet in IntelliJ), and they can be applied directly to the source code using the `-quickfix` flag, for example `-quickfix:cat=scala3-migration`.
See also `scalac -quickfix:help`.

## Enabled Scala 3 syntax

The `-Xsource:3` flag enables the following Scala 3 syntaxes in Scala 2:

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

The next paragraphs explain where the behavior changes between `-Xsource:3` and `-Xsource:3-cross`.

### Changes affecting binary encoding

As of Scala 2.13.13, there are 3 changes under `-Xsource:3-cross` that affect binary encoding of classfiles. For all of these changes a fatal warning is issued under `-Xsource:3`.

  1. The constructor modifiers of case classes (`case class C private[p] (x: Int)`) are copied to the synthetic `apply` and `copy` methods.
  1. The synthetic companion objects of case classes no longer extend `FunctionN`.
  1. Overriding methods without an explicit return type inherit the return type from the parent (instead of using the inferred type of the method body).

For projects that are already cross-building between Scala 2 and Scala 3 with existing releases for both, enabling `-Xsource:3-cross` breaks binary compatibility. For example, if a library defines

{% highlight scala %}
trait A { def f: Object }
class B extends A { def f = "hi" }
{% endhighlight %}

  - enabling `-Xsource:3-cross` breaks binary compatibility on Scala 2.13: existing releases have `A.f: String`, the new version will have `A.f: Object`
  - adding an explicit result type `A.f: String` breaks binary compatibility on Scala 3: existing releases have `A.f: Object`

It is possible to work around this using version-dependent source files, see [scala/scala-xml#675](https://github.com/scala/scala-xml/pull/675) as an example.

Working around the case companion `FunctionN` parent change is difficult in Scala 2.13.13.

From Scala 2.13.14, binary incompatible features can be selectively enabled under `-Xsource-features`, where the features can be enumerated.

### Changes in language semantics

The following table shows cases where `-Xsource:3-cross` adopts language feature semantics from Scala 3.
Optionally, they can be selected using `-Xsource-features`.
`-Xsource:3-cross` is a shorthand for `-Xsource:3 -Xsource-features:_`.
However, since the scope of available features may expand in future versions,
it is recommended to either specify them explicitly or fix them to the grouped features `-Xsource-features:v2.13.13` or `-Xsource-features:v2.13.14`.

| `-Xsource-features` | `-Xsource:3` | `-Xsource:3-cross` |
|--- |--- |--- |
| `(x: Any) + ""` is deprecated (`any2stringadd`) | deprecation warning | does not compile, implicit `any2stringadd` is not inferred |
| Unicode escapes in triple-quoted strings and raw interpolations (`"""\u0061"""`) (`unicode-escapes-raw`) | fatal warning, escape is processed | escape is not processed |
| Leading infix operators continue the previous line <sup>1</sup> (`leading-infix`) | fatal warning, second line is a separate expression | operation continues the previous line |
| Desugaring of string interpolators using `StringContext` (`string-context-scope`) | fatal warning if the interpolation references a `StringContext` in scope different from `scala.StringContext` | desugaring always uses `scala.StringContext` |
| An implicit for type `p.A` is found in the package prefix `p` (`package-prefix-implicits`) | fatal warning | the package prefix `p` is no longer part of the implicit search scope |
| Specificity during implicit search (`implicit-resolution`) | fatal warning | use Scala-3-style downwards comparisons for implicit search and overloading resolution |
| Modifiers of synthetic methods (`case-apply-copy-access`) | fatal warning | constructor modifiers are used for apply / copy methods of case classes |
| Companions are Functions (`case-companion-function`) | fatal warning at use site | synthetic case companion objects no longer extend FunctionN, but are adapted at use site with warning |
| Override type inference (`infer-override`) | fatal warning | inferred type of member uses type of overridden member |

Example 1:

{% highlight text %}
  def f =
    1
    + 2
{% endhighlight %}
