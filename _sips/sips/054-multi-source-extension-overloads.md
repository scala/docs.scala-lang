---
layout: sip
number: 54
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Multi-Source Extension Overloads
---

**By: Sébastien Doeraene and Martin Odersky**

## History

| Date          | Version            |
|---------------|--------------------|
| Mar 10th 2023 | Initial Draft      |

## Summary

We propose to allow overload resolution of `extension` methods with the same name but imported from several sources.
For example, given the following definitions:

```scala
class Foo
class Bar

object A:
  extension (foo: Foo) def meth(): Foo = foo
  def normalMeth(foo: Foo): Foo = foo

object B:
  extension (bar: Bar) def meth(): Bar = bar
  def normalMeth(bar: Bar): Bar = bar
```

and the following use site:

```scala
import A.*
import B.*

val foo: Foo = ???
foo.meth() // works with this SIP; "ambiguous import" without it

// unchanged:
meth(foo)() // always ambiguous, just like
normalMeth(foo) // always ambiguous
```

## Motivation

Extension methods are a great, straightforward way to extend external classes with additional methods.
One classical example is to add a `/` operation to `Path`:

```scala
import java.nio.file.*

object PathExtensions:
  extension (path: Path)
    def /(child: String): Path = path.resolve(child).nn

def app1(): Unit =
  import PathExtensions.*
  val projectDir = Paths.get(".") / "project"
```

However, as currently specified, they do not compose, and effectively live in a single flat namespace.
This is understandable from the spec--the *mechanism**, which says that they are just regular methods, but is problematic from an intuitive point of view--the *intent*.

For example, if we also use another extension that provides `/` for `URI`s, we can use it in a separate scope as follows:

```scala
import java.net.URI

object URIExtensions:
  extension (uri: URI)
    def /(child: String): URI = uri.resolve(child)

def app2(): Unit =
  import URIExtensions.*
  val rootURI = new URI("https://www.example.com/")
  val projectURI = rootURI / "project/"
```

The above does not work anymore if we need to use *both* extensions in the same scope.
The code below does not compile:

```scala
def app(): Unit =
  import PathExtensions.*
  import URIExtensions.*

  val projectDir = Paths.get(".") / "project"
  val rootURI = new URI("https://www.example.com/")
  val projectURI = rootURI / "project/"
  println(s"$projectDir -> $projectURI")
end app
```

*Both* attempts to use `/` result in error messages of the form

```
Reference to / is ambiguous,
it is both imported by import PathExtensions._
and imported subsequently by import URIExtensions._
```

### Workarounds

The only workarounds that exist are unsatisfactory.

We can avoid using extensions with the same name in the same scope.
In the above example, that would be annoying enough to defeat the purpose of the extensions in the first place.

Another possibility is to *define* all extension methods of the same name in the same `object` (or as top-level definitions in the same file).
This is possible, although cumbersome, if they all come from the same library.
However, it is impossible to combine extension methods coming from separate libraries in this way.

Finally, there exists a trick with `given`s of empty refinements:

```scala
object PathExtensions:
  given pathExtensions: {} with
    extension (path: Path)
      def /(child: String): Path = path.resolve(child).nn

object URIExtensions:
  given uriExtensions: {} with
    extension (uri: URI)
      def /(child: String): URI = uri.resolve(child)
```

The empty refinement `: {}` prevents those `given`s from polluting the actual implicit scope.
`extension`s defined inside `given`s that are in scope can be used, so this trick allows to use `/` with the imports of `PathExtensions.*` and `URIExtensions.*`.
The `given`s must still have different names for the trick to work.
This workaround is however quite obscure.
It hides intent behind a layer of magic (and an additional indirection at run-time).

### Problem for migrating off of implicit classes

Scala 2 implicit classes did not suffer from the above issues, because they were disambiguated by the name of the implicit class (not the name of the method).
This means that there are libraries that cannot migrate off of implicit classes to use `extension` methods without significantly degrading their usability.

## Proposed solution

We propose to relax the resolution of extension methods, so that they can be resolved from multiple imported sources.
Instead of rejecting the `/` call outright because of ambiguous imports, the compiler should try the resolution from all the imports, and keep the only one (if any) for which the receiver type matches.

Practically speaking, this means that the above `app()` example would compile and behave as expected.

### Non-goals

It is *not* a goal of this proposal to allow resolution of arbitrary overloads of regular methods coming from multiple imports.
Only `extension` method calls are concerned by this proposal.
The complexity budget of relaxing *all* overloads in this way is deemed too high, whereas it is acceptable for `extension` method calls.

For the same reason, we do not propose to change regular calls of methods that happen to be `extension` methods.

### Specification

We make two changes to the [specification of extension methods](https://docs.scala-lang.org/scala3/reference/contextual/extension-methods.html).

In the section [Translation of Extension Methods](https://docs.scala-lang.org/scala3/reference/contextual/extension-methods.html#translation-of-extension-methods), we make it clearer that the "desugared" version of the call site may require an explicit qualifier.
This is not strictly a novelty of this SIP, since it could already happen with `given`s and implicit scopes, but this SIP adds one more case where this can happen.

Previously:

> So, the definition of circumference above translates to the following method, and can also be invoked as such:
>
> `<extension> def circumference(c: Circle): Double = c.radius * math.Pi * 2`
>
> `assert(circle.circumference == circumference(circle))`

With this SIP:

> So, the definition of circumference above translates to the following method, and can also be invoked as such:
>
> `<extension> def circumference(c: Circle): Double = c.radius * math.Pi * 2`
>
> `assert(circle.circumference == circumference(circle))`
>
> or
>
> `assert(circle.circumference == qualifierPath.circumference(circle))`
>
> for some `qualifierPath` in which `circumference` is actually declared.
> Explicit qualifiers may be required when the extension method is resolved through `given` instances, implicit scopes, or disambiguated from several imports.

---

In the section [Translation of Calls to Extension Methods](https://docs.scala-lang.org/scala3/reference/contextual/extension-methods.html#translation-of-calls-to-extension-methods), we amend step 1. of "The precise rules for resolving a selection to an extension method are as follows."

Previously:

> Assume a selection `e.m[Ts]` where `m` is not a member of `e`, where the type arguments `[Ts]` are optional, and where `T` is the expected type.
> The following two rewritings are tried in order:
>
> 1. The selection is rewritten to `m[Ts](e)`.

With this SIP:

> 1. The selection is rewritten to `m[Ts](e)` and typechecked, using the following slight modification of the name resolution rules:
>
>    - If `m` is imported by several imports which are all on the same nesting level, try each import as an extension method instead of failing with an ambiguity.
>      If only one import leads to an expansion that typechecks without errors, pick that expansion.
>      If there are several such imports, but only one import which is not a wildcard import, pick the expansion from that import.
>      Otherwise, report an ambiguous reference error.

### Compatibility

The proposal only alters situations where the previous specification would reject the program with an ambiguous import.
Therefore, we expect it to be backward source compatible.

The resolved calls could previously be spelled out by hand (with fully-qualified names), so binary compatibility and TASTy compatibility are not affected.

### Other concerns

With this SIP, some calls that would be reported as *ambiguous* in their "normal" form can actually be written without ambiguity if used as extensions.
That may be confusing to some users.
Although specific error messages are not specified and therefore outside the SIP scope, we encourage the compiler implementation to enhance the "ambiguous" error message to address this confusion.
If some or all of the involved ambiguous targets are `extension` methods, the compiler should point out that the call might be resolved unambiguously if used as an extension.

## Alternatives

A number of alternatives were mentioned in [the Contributors thread](https://contributors.scala-lang.org/t/change-shadowing-mechanism-of-extension-methods-for-on-par-implicit-class-behavior/5831), but none that passed the bar of "we think this is actually implementable".

## Related work

- [Contributors thread acting as de facto Pre-SIP](https://contributors.scala-lang.org/t/change-shadowing-mechanism-of-extension-methods-for-on-par-implicit-class-behavior/5831)
- [Pull Request in dotty](https://github.com/lampepfl/dotty/pull/17050) to support it under an experimental import

## FAQ

This section will probably initially be empty. As discussions on the proposal progress, it is likely that some questions will come repeatedly. They should be listed here, with appropriate answers.
