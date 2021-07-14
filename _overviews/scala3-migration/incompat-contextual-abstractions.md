---
title: Contextual Abstractions
type: section
description: This chapter details all incompatibilities caused by the redesign of contextual abstractions
num: 17
previous-page: incompat-dropped-features
next-page: incompat-other-changes
---

The redesign of [contextual abstractions]({% link _scala3-reference/contextual.md %}) brings some incompatibilities.

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibiltiy|
|--- |--- |--- |--- |--- |
|[Type of implicit def](#type-of-implicit-definition)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](#implicit-views)||||**Possible**|
|[View bounds](#view-bounds)|Deprecation||||
|[Ambiguous conversion on `A` and `=> A`](#ambiguous-conversion-on-a-and--a)|||||

## Type Of Implicit Definition

The type of implicit definitions (`val` or `def`) needs to be given explicitly in Scala 3.
They cannot be inferred anymore.

The Scalafix rule named `ExplicitImplicitTypes` in [ohze/scala-rewrites](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes) repository can write the missing type annotations automatically.

## Implicit Views

Scala 3 does not support implicit conversion from an implicit function value, of the form `implicit val ev: A => B`.

The following piece of code is now invalid:

```scala
trait Pretty {
  val print: String
}

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // Error: value print is not a member of A
```

The [Scala 3 migration compilation](tooling-migration-mode.html) can warn you about those cases, but it does not try to fix it.

Be aware that this incompatibility can produce a runtime incompatibility and break your program.
Indeed the compiler can find another implicit conversion from a broader scope, which would eventually cause an undesired behavior at runtime.

This example illustrates the case:

```scala
trait Pretty {
  val print: String
}

implicit def anyPretty(any: Any): Pretty = new Pretty { val print = "any" }

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // always print "any"
```

The resolved conversion depends on the compiler mode:
  - `-source:3.0-migration`: the compiler performs the `ev` conversion
  - `-source:3.0`: the compiler cannot perform the `ev` conversion but it can perform the `anyPretty`, which is undesired

One simple fix is to supply the right conversion explicitly:

{% highlight diff %}
def pretty[A](a: A)(implicit ev: A => Pretty): String =
-  a.print
+  ev(a).print
{% endhighlight %}

## View Bounds

View bounds have been deprecated for a long time but they are still supported in Scala 2.13.
They cannot be compiled with Scala 3 anymore.

```scala
def foo[A <% Long](a: A): Long = a
```

In this example we get:

{% highlight text %}
-- Error: src/main/scala/view-bound.scala:2:12 
2 |  def foo[A <% Long](a: A): Long = a
  |            ^
  |          view bounds `<%' are deprecated, use a context bound `:' instead
{% endhighlight %}

The message suggests to use a context bound instead of a view bound but it would change the signature of the method.
It is probably easier and safer to preserve the binary compatibility.
To do so the implicit conversion must be declared and called explicitly.

Be careful not to fall in the runtime incompatibility described above, in [Implicit Views](#implicit-views).

{% highlight diff %}
-def foo[A <% Long](a: A): Long = a
+def foo[A](a: A)(implicit ev: A => Long): Long = ev(a)
{% endhighlight %}

## Ambiguous Conversion On `A` And `=> A`

In Scala 2.13 the implicit conversion on `A` wins over the implicit conversion on `=> A`.
It is not the case in Scala 3 anymore, and leads to an ambiguous conversion. 

For instance, in this example:

```scala
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

true.foo()
```

The Scala 2.13 compiler chooses the `boolFoo` conversion but the Scala 3 compiler fails to compile.

{% highlight text %}
-- Error: src/main/scala/ambiguous-conversion.scala:4:19
9 |  true.foo()
  |  ^^^^
  |Found:    (true : Boolean)
  |Required: ?{ foo: ? }
  |Note that implicit extension methods cannot be applied because they are ambiguous;
  |both method boolFoo in object Foo and method lazyBoolFoo in object Foo provide an extension method `foo` on (true : Boolean)
{% endhighlight %}

A temporary solution is to write the conversion explicitly.

{% highlight diff %}
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

-true.foo()
+boolFoo(true).foo()
{% endhighlight %}
