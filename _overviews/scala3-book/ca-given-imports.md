---
title: Given Imports
type: section
description: This page demonstrates how 'given' import statements work in Scala 3.
languages: [zh-cn]
num: 62
previous-page: ca-context-bounds
next-page: ca-type-classes
scala3: true
versionSpecific: true
---


To make it more clear where givens in the current scope are coming from, a special form of the `import` statement is used to import `given` instances.
The basic form is shown in this example:

{% tabs given1 %}
{% tab 'Scala 3 Only' %}
```scala
object A:
  class TC
  given tc: TC = ???
  def f(using TC) = ???

object B:
  import A.*       // import all non-given members
  import A.given   // import the given instance
```
{% endtab %}
{% endtabs %}

In this code the `import A.*` clause of object `B` imports all members of `A` *except* the `given` instance, `tc`.
Conversely, the second import, `import A.given`, imports *only* that `given` instance.
The two `import` clauses can also be merged into one:

{% tabs given2 %}
{% tab 'Scala 3 Only' %}
```scala
object B:
  import A.{given, *}
```
{% endtab %}
{% endtabs %}

## Discussion

The wildcard selector `*` brings all definitions other than givens or extensions into scope, whereas a `given` selector brings all *givens*---including those resulting from extensions---into scope.

These rules have two main benefits:

- It’s more clear where givens in the current scope are coming from.
  In particular, it’s not possible to hide imported givens in a long list of other wildcard imports.
- It enables importing all givens without importing anything else.
  This is important because givens can be anonymous, so the usual use of named imports is not practical.

More examples of the “import given” syntax are shown in the [Packaging and Imports chapter][imports].


[imports]: {% link _overviews/scala3-book/packaging-imports.md %}
