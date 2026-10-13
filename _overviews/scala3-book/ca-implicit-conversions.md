---
title: Implicit Conversions
type: section
description: This page demonstrates how to implement Implicit Conversions in Scala.
languages: [ru, zh-cn]
num: 67
previous-page: ca-multiversal-equality
next-page: ca-summary
---

Implicit conversions are a powerful Scala feature that allows users to supply an argument
of one type as if it were another type, to avoid boilerplate.

> Note that in Scala 2, implicit conversions were also used to provide additional members
> to closed classes (see [Implicit Classes]({% link _overviews/core/implicit-classes.md %})).
> In Scala 3, we recommend to address this use-case by defining [extension methods] instead
> of implicit conversions (although the standard library still relies on implicit conversions
> for historical reasons).

## Example

Consider for instance a method `findUserById` that takes a parameter of type `Long`:

{% tabs implicit-conversions-1 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
def findUserById(id: Long): Option[User]
~~~
{% endtab %}
{% endtabs %}

We omit the definition of the type `User` for the sake of brevity, it does not matter for
our example.

In Scala, it is possible to call the method `findUserById` with an argument of type `Int`
instead of the expected type `Long`, because the argument will be implicitly converted
into the type `Long`:

{% tabs implicit-conversions-2 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
val id: Int = 42
findUserById(id) // OK
~~~
{% endtab %}
{% endtabs %}

This code does not fail to compile with an error like “type mismatch: expected `Long`,
found `Int`” because there is an implicit conversion that converts the argument `id`
to a value of type `Long`.

## Detailed Explanation

This section describes how to define and use implicit conversions.

### Defining an Implicit Conversion

{% tabs implicit-conversions-3 class=tabs-scala-version %}

{% tab 'Scala 2' %}
In Scala 2, an implicit conversion from type `S` to type `T` is defined by an
[implicit class]({% link _overviews/core/implicit-classes.md %}) `T` that takes
a single constructor parameter of type `S`, an
[implicit value]({% link _overviews/scala3-book/ca-context-parameters.md %}) of
function type `S => T`, or by an implicit method convertible to a value of that type.

For example, the following code defines an implicit conversion from `Int` to `Long`:

~~~ scala
import scala.language.implicitConversions

implicit def int2long(x: Int): Long = x.toLong
~~~

This is an implicit method convertible to a value of type `Int => Long`.

See the section “Beware the Power of Implicit Conversions” below for an
explanation of the clause `import scala.language.implicitConversions`
at the beginning.
{% endtab %}

{% tab 'Scala 3' %}
In Scala 3, an implicit conversion from type `S` to type `T` is defined by a
[`given` instance]({% link _overviews/scala3-book/ca-context-parameters.md %})
of type `scala.Conversion[S, T]`. For compatibility with Scala 2, it can also
be defined by an implicit method (read more in the Scala 2 tab).

For example, this code defines an implicit conversion from `Int` to `Long`:

```scala
given int2long: Conversion[Int, Long]:
  def apply(x: Int): Long = x.toLong
```

Like other given definitions, implicit conversions can be anonymous:

~~~ scala
given Conversion[Int, Long]:
  def apply(x: Int): Long = x.toLong
~~~

Using an alias, this can be expressed more concisely as:

```scala
given Conversion[Int, Long] = (x: Int) => x.toLong
```
{% endtab %}

{% endtabs %}

### Using an Implicit Conversion

Implicit conversions are applied in two situations:

1. If an expression `e` is of type `S`, and `S` does not conform to the expression's expected type `T`.
2. In a selection `e.m` with `e` of type `S`, if the selector `m` does not denote a member of `S`
   (to support Scala-2-style [extension methods]).

In the first case, a conversion `c` is searched for, which is applicable to `e` and whose result type conforms to `T`.

In our example above, when we pass the argument `id` of type `Int` to the method `findUserById`,
the implicit conversion `int2long(id)` is inserted.

In the second case, a conversion `c` is searched for, which is applicable to `e` and whose result contains a member named `m`.

An example is to compare two strings `"foo" < "bar"`. In this case, `String` has no member `<`, so the implicit conversion `Predef.augmentString("foo") < "bar"` is inserted. (`scala.Predef` is automatically imported into all Scala programs.)

### How Are Implicit Conversions Brought Into Scope?

When the compiler searches for applicable conversions:

- first, it looks into the current lexical scope
  - implicit conversions defined in the current scope or the outer scopes
  - imported implicit conversions
  - implicit conversions imported by a wildcard import (Scala 2 only)
- then, it looks into the [companion objects] _associated_ with the argument
  type `S` or the expected type `T`. The companion objects associated with
  a type `X` are:
  - the companion object `X` itself
  - the companion objects associated with any of `X`’s inherited types
  - the companion objects associated with any type argument in `X`
  - if `X` is an inner class, the outer objects in which it is embedded

For instance, consider an implicit conversion `fromStringToUser` defined in an
object `Conversions`:

{% tabs implicit-conversions-4 class=tabs-scala-version %}
{% tab 'Scala 2' %}
~~~ scala
import scala.language.implicitConversions

object Conversions {
  implicit def fromStringToUser(name: String): User = User(name)
}
~~~
{% endtab %}
{% tab 'Scala 3' %}
~~~ scala
object Conversions:
  given fromStringToUser: Conversion[String, User] = (name: String) => User(name)
~~~
{% endtab %}
{% endtabs %}

The following imports would equivalently bring the conversion into scope:

{% tabs implicit-conversions-5 class=tabs-scala-version %}
{% tab 'Scala 2' %}
~~~ scala
import Conversions.fromStringToUser
// or
import Conversions._
~~~
{% endtab %}
{% tab 'Scala 3' %}
~~~ scala
import Conversions.fromStringToUser
// or
import Conversions.given
// or
import Conversions.{given Conversion[String, User]}
~~~

Note that in Scala 3, a wildcard import (ie `import Conversions.*`) does not import given
definitions.
{% endtab %}
{% endtabs %}

In the introductory example, the conversion from `Int` to `Long` does not require an import
because it is defined in the object `Int`, which is the companion object of the type `Int`.

Further reading:
[Where does Scala look for implicits? (on Stackoverflow)](https://stackoverflow.com/a/5598107).

### Beware the Power of Implicit Conversions

{% tabs implicit-conversions-6 class=tabs-scala-version %}
{% tab 'Scala 2' %}
Because implicit conversions can have pitfalls if used indiscriminately the compiler warns when compiling the implicit conversion definition.

To turn off the warnings take either of these actions:

* Import `scala.language.implicitConversions` into the scope of the implicit conversion definition
* Invoke the compiler with `-language:implicitConversions`

No warning is emitted when the conversion is applied by the compiler.
{% endtab %}
{% tab 'Scala 3' %}
Because implicit conversions can have pitfalls if used indiscriminately the compiler warns in two situations:
- when compiling a Scala 2 style implicit conversion definition.
- at the call site where a given instance of `scala.Conversion` is inserted as a conversion.

To turn off the warnings take either of these actions:

- Import `scala.language.implicitConversions` into the scope of:
  - a Scala 2 style implicit conversion definition
  - call sites where a given instance of `scala.Conversion` is inserted as a conversion.
- Invoke the compiler with `-language:implicitConversions`
{% endtab %}
{% endtabs %}

[extension methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[companion objects]: {% link _overviews/scala3-book/domain-modeling-tools.md %}#companion-objects
