---
title: Type Inference
type: section
description: This chapter details the incompatibilities caused by the new type inference algorithm
num: 21
previous-page: incompat-type-checker
next-page: options-intro
---

The two incompatibilities described in this page are intentional changes in the type inference rules.

Other incompatibilities could be caused by the replacement of the type inference algorithm.
The new algorithm is better than the old one, but sometime it can fail where Scala 2.13 would succeed:

> It is always good practice to write the result types of all public values and methods explicitly.
> It prevents the public API of your library from changing with the Scala version, because of different inferred types.
> 
> This can be done prior to the Scala 3 migration by using the [ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html) rule in Scalafix.

## Return Type of an Override Method

In Scala 3 the return type of an override method is inferred by inheritance from the base method, whereas in Scala 2.13 it is inferred from the left hand side of the override method.

```scala
class Parent {
  def foo: Foo = new Foo
}

class Child extends Parent {
  override def foo = new RichFoo(super.foo)
}
```

In this example, `Child#foo` returns a `RichFoo` in Scala 2.13 but a `Foo` in Scala 3.
It can lead to compiler errors as demonstrated below.

```scala
class Foo

class RichFoo(foo: Foo) extends Foo {
  def show: String = ""
}

class Parent {
  def foo: Foo = new Foo
}

class Child extends Parent {
  override def foo = new RichFoo(super.foo)
}

(new Child).foo.show // Scala 3 error: value show is not a member of Foo
```

In some rare cases involving implicit conversions and runtime casting it could even cause a runtime failure.

The solution is to make the return type of the override method explicit:

{% highlight diff %}
class Child extends Parent {
-  override def foo = new RichFoo(super.foo)
+  override def foo: RichFoo = new RichFoo(super.foo)
}
{% endhighlight %}

## Reflective Type

Scala 2 reflective calls are dropped and replaced by the broader [Programmatic Structural Types](/scala3/reference/changed-features/structural-types.html).

Scala 3 can imitate Scala 2 reflective calls by making `scala.reflect.Selectable.reflectiveSelectable` available wherever `scala.language.reflectiveCalls` is imported.
However the Scala 3 compiler does not infer structural types by default, and thus fails at compiling:

```scala
import scala.language.reflectiveCalls

val foo = new {
  def bar: Unit = ???
}

foo.bar // Error: value bar is not a member of Object
```

The straightforward solution is to write down the structural type.

{% highlight diff %}
import scala.language.reflectiveCalls

- val foo = new {
+ val foo: { def bar: Unit } = new {
  def bar: Unit = ???
}

foo.bar
{% endhighlight %}
