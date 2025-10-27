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

Usage information is shown with `scalac -Xsource:help`.

## Migration vs cross-building

With Scala 2.13.14 and newer, the `-Xsource:3` flag supports two scenarios:

  - `Xsource:3` enables warnings relevant for migrating a codebase to Scala 3.
    In addition to new warnings, the flag enables certain benign Scala 3 syntaxes such as `import p.*`.
  - Adding the `-Xsource-features:<features>` flag is useful to reduce the maintenance burden of projects that cross-build between Scala 2 and 3.
    Certain language constructs have been backported from Scala 3 in order to improve compatibility.
    Instead of warning about a behavior change in Scala 3, it adopts the new behavior.

## Warnings as errors, and quick fixes

By default, Scala 3 migration warnings emitted by Scala 2.13 are reported as errors, using the default configuration, `-Wconf:cat=scala3-migration:e`.
This ensures that migration messaging is more visible.
Diagnostics can be emitted as warnings by specifying `-Wconf:cat=scala3-migration:w`.
Typically, emitting warnings instead of errors will cause more diagnostics to be reported.

The [`@nowarn` annotation](https://www.scala-lang.org/api/current/scala/annotation/nowarn.html) can be used in program sources to suppress individual warnings.
Diagnostics are suppressed before they are promoted to errors, so that `@nowarn` takes precedence over `-Wconf` and `-Werror`.

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

## Scala 3 migration warnings in detail

Many Scala 3 migration warnings are easy to understand, e.g., for implicit definitions without an explicit type:

{% highlight scala %}
scala> object O { implicit val s = "" }
                               ^
       error: Implicit definition must have explicit type (inferred String) [quickfixable]
{% endhighlight %}

## Enabling Scala 3 features with `-Xsource-features`

Certain Scala 3 language changes have been backported and can be enabled using `-Xsource-features`; usage and available features are shown with `-Xsource-features:help`.

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

For every such language feature, a migration warning is issued under plain `-Xsource:3`.
Enabling the feature silences the warning and adopts the changed behavior.
To avoid silent language changes when upgrading to a new Scala 2.13 version, it is recommended to enable features explicitly or use a group (e.g., `-Xsource-features:v2.13.14`).

`-Xsource:3-cross` is a shorthand for `-Xsource:3 -Xsource-features:_`.

### Changes in language semantics

The following table shows backported Scala 3 language semantics available in `-Xsource-features` / `-Xsource:3-cross`.

| Feature flag | `-Xsource:3` behavior | `-Xsource-features` / `-Xsource:3-cross` behavior |
|--- |--- |--- |
| `any2stringadd`: `(x: Any) + ""` is deprecated | deprecation warning | does not compile, implicit `any2stringadd` is not inferred |
| `unicode-escapes-raw`: unicode escapes in triple-quoted strings and raw interpolations (`"""\u0061"""`) | fatal warning, escape is processed | escape is not processed |
| `leading-infix`: leading infix operators continue the previous line <sup>1</sup> | fatal warning, second line is a separate expression | operation continues the previous line |
| `string-context-scope`: desugaring of string interpolators using `StringContext` | fatal warning if the interpolation references a `StringContext` in scope different from `scala.StringContext` | desugaring always uses `scala.StringContext` |
| `package-prefix-implicits`: an implicit for type `p.A` is found in the package prefix `p` | fatal warning | the package prefix `p` is no longer part of the implicit search scope |
| `implicit-resolution`: specificity during implicit search | fatal warning | use Scala-3-style [downwards comparisons](https://github.com/scala/scala/pull/6037) for implicit search and overloading resolution |
| `case-apply-copy-access`: modifiers of synthetic methods | fatal warning | constructor modifiers are used for apply / copy methods of case classes |
| `case-companion-function`: companions are Functions | fatal warning at use site | synthetic case companion objects no longer extend FunctionN, but are adapted at use site with warning |
| `infer-override`: override type inference | fatal warning | inferred type of member uses type of overridden member |
| `double-definitions`: definitions differing in empty parens <sup>2</sup> | fatal warning | double definition error |
| `eta-expand-always`: `x.f` eta-expands (`x.f _`) even without an expected type | compilation error ("missing argument list") | `x.f` expands to a function value |

Example 1:

{% highlight scala %}
  def f =
    1
    + 2
{% endhighlight %}

Example 2:

{% highlight scala %}
class C(x: Int) {
  def x(): Int = x // allowed in Scala 2, double definition error in Scala 3
}
{% endhighlight %}

### Changes affecting binary encoding

As of Scala 2.13.17, there are 3 changes in `-Xsource-features` that affect binary encoding of classfiles:

  1. `case-apply-copy-access`: the constructor modifiers of case classes (`case class C private[p] (x: Int)`) are copied to the synthetic `apply` and `copy` methods.
  1. `case-companion-function`: the synthetic companion objects of case classes no longer extend `FunctionN`.
  1. `infer-override`: overriding methods without an explicit return type inherit the return type from the parent (instead of using the inferred type of the method body).

For projects that are already cross-building between Scala 2 and 3 with existing releases for both, enabling these changes breaks binary compatibility (make sure to use [MiMa to detect such changes](https://github.com/lightbend/mima)). For example, if a library defines

{% highlight scala %}
trait A { def f: Object }
class B extends A { def f = "hi" }
{% endhighlight %}

  - enabling `-Xsource-features:infer-override` breaks binary compatibility on Scala 2.13: existing releases have `A.f: String`, the new version will have `A.f: Object`
  - adding an explicit result type `A.f: String` breaks binary compatibility on Scala 3: existing releases have `A.f: Object`

It is possible to work around this using version-dependent source files, see [scala/scala-xml#675](https://github.com/scala/scala-xml/pull/675) as an example.

Instead of implementing such workarounds, it might be easier not to enable changes affecting binary encoding (`-Xsource-features:v2.13.14,-case-apply-copy-access,-case-companion-function,-infer-override`).
