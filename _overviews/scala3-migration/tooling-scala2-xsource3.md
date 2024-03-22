---
title: Scala 2 with -Xsource:3
type: chapter
description: This section describes the Scala 2 compiler's -Xsource:3 flag
num: 7
previous-page: tooling-tour
next-page: tooling-migration-mode
---

The Scala 2.13 compiler issues helpful migration warnings with the `-Xsource:3` flag.

Before moving to the Scala 3 compiler, it is recommended to enable this flag in Scala 2 and address the new warnings.

This page explains the details behind the flags. An overview is shown using `scala -Xsource:help`.

## Migration vs cross-building

The `-Xsource:3` flag can be used for two scenarios:

  - Plain `Xsource:3` enables warnings relevant for *migrating* a codebase to Scala 3.
    In addition to new warnings, the flag enables certain benign Scala 3 syntaxes such as `import p.*`.
  - Adding the `-Xsource-features:...` option is useful for projects that *cross-build* between Scala 2 and 3 for a longer period of time.
    For certain language constructs that trigger a warning with plain `-Xsource:3`, the behavior changes to match Scala 3.

Details about individual warnings are listed below on this page.

## Fatal warnings and quick fixes

By default, Scala 3 migration warnings emitted by Scala 2.13 are fatal, i.e., they are reported as errors.
This can be changed using `-Wconf`, for example `-Wconf:cat=scala3-migration:w` changes them to be reported as warnings.

The [`@nowarn` annotation](https://www.scala-lang.org/api/current/scala/annotation/nowarn.html) can be used to suppress individual warnings, which also works with fatal warnings enabled.

The Scala 2.13 compiler implements quick fixes for many Scala 3 migration warnings.
Quick fixes are displayed in Metals-based IDEs (not yet in IntelliJ), or they can be applied directly to the source code using the `-quickfix` flag, for example `-quickfix:cat=scala3-migration`.
See also `scala -quickfix:help`.

## Enabled Scala 3 syntax

The `-Xsource:3` flag enables the following Scala 3 syntaxes in Scala 2:

  - `import p.*`
  - `import p.m as n`
  - `import p.{given, *}`
  - `case C(xs*)` as an alias for `case C(xs @ _*)`
  - `A & B` type intersection as an alias for `A with B`
  - Selecting a method `x.f` performs an eta-expansion (`x.f _`), even without an expected type

## Scala 3 migration warnings in detail

Many Scala 3 migration warnings are easy to understand, e.g., for implicit definitions without an explicit type:

{% highlight scala %}
scala> object O { implicit val s = "" }
                               ^
       error: Implicit definition must have explicit type (inferred String) [quickfixable]
{% endhighlight %}

## Scala 3 features in `-Xsource-features`

`scala -Xsource-features:help` explains how to enable Scala 3 behavior for certain language features.

When enabling a feature, the corresponding migration warning is no longer issued.

{% highlight scala %}
scala> raw"\u0061"
           ^
       warning: Unicode escapes in raw interpolations are deprecated; use literal characters instead
val res0: String = a

scala> :setting -Xsource:3

scala> raw"\u0061"
           ^
       error: Unicode escapes in raw interpolations are ignored in Scala 3 (or with -Xsource-features:unicode-escapes-raw); use literal characters instead
       Scala 3 migration messages are errors under -Xsource:3. Use -Wconf / @nowarn to filter them or add -Xmigration to demote them to warnings.
       Applicable -Wconf / @nowarn filters for this fatal warning: msg=<part of the message>, cat=scala3-migration, site=res1

scala> :setting -Xsource-features:unicode-escapes-raw

scala> raw"\u0061"
val res1: String = \u0061
{% endhighlight %}

It is recommended to enable specific features, for example `-Xsource-features:v2.13.14,-case-companion-function` (where `-x` disables `x`) instead of using `-Xsource-features:_`. This way, new features in future Scala versions are not silently adopted.

### Changes affecting binary encoding

As of Scala 2.13.14, there are 3 changes under `-Xsource-features` that affect binary encoding of classfiles. For all of these changes a fatal warning is issued under `-Xsource:3`.

  1. `case-apply-copy-access`: the constructor modifiers of case classes (`case class C private[p] (x: Int)`) are copied to the synthetic `apply` and `copy` methods.
  1. `case-companion-function`: the synthetic companion objects of case classes no longer extend `FunctionN`.
  1. `infer-override`: overriding methods without an explicit return type inherit the return type from the parent (instead of using the inferred type of the method body).

For projects that are already cross-building between Scala 2 and 3 with existing releases for both, enabling these features breaks binary compatibility. For example, if a library defines

{% highlight scala %}
trait A { def f: Object }
class B extends A { def f = "hi" }
{% endhighlight %}

  - enabling `infer-override` breaks binary compatibility on Scala 2.13: existing releases have `A.f: String`, the new version will have `A.f: Object`
  - adding an explicit result type `A.f: String` breaks binary compatibility on Scala 3: existing releases have `A.f: Object`

It is possible to work around this using version-dependent source files, see [scala/scala-xml#675](https://github.com/scala/scala-xml/pull/675) as an example, but the easiest option is to opt out of features affecting binary compatibility. Make sure to use [MiMa](https://github.com/lightbend/mima) to check binary compatibility of your releases.

### Changes in language semantics

The following table lists the remaining language features that change to Scala 3 semantics with `-Xsource-features`:

| Feature | `-Xsource:3` | `-Xsource-features:...` |
|--- |--- |--- |
| `any2stringadd`<br/>`(x: Any) + ""` is deprecated | fatal warning | does not compile, implicit `any2stringadd` is not inferred |
| `unicode-escapes-raw`<br/>Unicode escapes in triple-quoted strings and raw interpolations (`"""\u0061"""`) | fatal warning, escape is processed | escape is not processed |
| `string-context-scope`<br/>Desugaring of string interpolators using `StringContext` | fatal warning if the interpolation references a `StringContext` in scope different from `scala.StringContext` | desugaring always uses `scala.StringContext` |
| `leading-infix`<br/>Leading infix operators continue the previous line <sup>(example below)</sup> | fatal warning, second line is a separate expression | operation continues the previous line |
| `package-prefix-implicits`<br/>An implicit for type `p.A` is found in the package prefix `p` | fatal warning | the package prefix `p` is no longer part of the implicit search scope |
| `implicit-resolution` | no change | Scala-3-style downwards comparisons for implicit search and overloading resolution (see [scala/scala#6037](https://github.com/scala/scala/pull/6037)) |

Example for `leading-infix`:

{% highlight text %}
  def f =
    1
    + 2
{% endhighlight %}
