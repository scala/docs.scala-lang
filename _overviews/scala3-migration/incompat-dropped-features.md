---
title: Dropped Features
type: section
description: This chapter details all the dropped features
num: 16
previous-page: incompat-syntactic
next-page: incompat-contextual-abstractions
---

Some features are dropped to simplify the language.
Most of these changes can be handled automatically during the [Scala 3 migration compilation](tooling-migration-mode.html).

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[Symbol literals](#symbol-literals)|Deprecation|✅||
|[`do`-`while` construct](#do-while-construct)||✅||
|[Auto-application](#auto-application)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[Value eta-expansion](#value-eta-expansion)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` conversion](#any2stringadd-conversion)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[Early initializer](#early-initializer)|Deprecation|||
|[Existential type](#existential-type)|Feature warning|||

## Symbol literals

The Symbol literal syntax is deprecated in Scala 2.13 and dropped in Scala 3.
But the `scala.Symbol` class still exists so that each string literal can be safely replaced by an application of `Symbol`.

This piece of code cannot be compiled with Scala 3:

```scala
val values: Map[Symbol, Int] = Map('abc -> 1)

val abc = values('abc) // Migration Warning: symbol literal 'abc is no longer supported
```

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites the code into:

{% highlight diff %}
val values: Map[Symbol, Int] = Map(Symbol("abc") -> 1)

-val abc = values('abc)
+val abc = values(Symbol("abc"))
{% endhighlight %}

Although the `Symbol` class is useful during the transition, beware that it is deprecated and will be removed from the `scala-library` in a future version.
You are recommended, as a second step, to replace every use of `Symbol` with a plain string literals `"abc"` or a custom dedicated class.

## `do`-`while` construct

The `do` keyword has acquired a different meaning in the [New Control Syntax]({% link _scala3-reference/other-new-features/control-syntax.md %}).

To avoid confusion, the traditional `do <body> while (<cond>)` construct is dropped.
It is recommended to use the equivalent `while ({ <body>; <cond> }) ()` that can be cross-compiled, or the new Scala 3 syntax `while { <body>; <cond> } do ()`.

The following piece of code cannot be compiled with Scala 3.

```scala
do { // Migration Warning: `do <body> while <cond>` is no longer supported
  i += 1
} while (f(i) == 0)
```

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into. 

```scala
while ({ {
  i += 1
} ; f(i) == 0}) ()
```

## Auto-application

Auto-application is the syntax of calling an empty-paren method such as `def toInt(): Int` without passing an empty argument list.
It is deprecated in Scala 2.13 and dropped in Scala 3.

The following code is invalid in Scala 3:

```scala
object Hello {
  def message(): String = "Hello"
}

println(Hello.message) // Migration Warning: method message must be called with () argument
```

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into:

{% highlight diff %}
object Hello {
  def message(): String = "Hello"
}

-println(Hello.message)
+println(Hello.message())
{% endhighlight %}

Auto-application is covered in detail in [this page](/scala3/reference/dropped-features/auto-apply.html) of the Scala 3 reference documentation.

## Value eta-expansion

Scala 3 introduces [Automatic Eta-Expansion](/scala3/reference/changed-features/eta-expansion-spec.html) which will deprecate the method to value syntax `m _`.
Furthermore Scala 3 does not allow eta-expansion of values to nullary functions anymore.

Thus, this piece of code is invalid in Scala 3:

```scala
val x = 1
val f: () => Int = x _ // Migration Warning: The syntax `<function> _` is no longer supported;
```

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into:

{% highlight diff %}
val x = 1
-val f: () => Int = x _
+val f: () => Int = (() => x)
{% endhighlight %}

## `any2stringadd` conversion

The implicit `Predef.any2stringadd` conversion is deprecated in Scala 2.13 and dropped in Scala 3.

This piece of code does not compile anymore.

```scala
val str = new AnyRef + "foo" // Error: value + is not a member of Object
```

The conversion to `String` must be applied explicitly, for instance with `String.valueOf`.

{% highlight diff %}
-val str = new AnyRef + "foo"
+val str = String.valueOf(new AnyRef) + "foo"
{% endhighlight %}

This rewrite can be applied by the `fix.scala213.Any2StringAdd` Scalafix rule in [`scala/scala-rewrites`](https://index.scala-lang.org/scala/scala-rewrites/scala-rewrites/0.1.2?target=_2.13).

## Early Initializer

Early initializers are deprecated in Scala 2.13 and dropped in Scala 3.
They were rarely used, and mostly to compensate for the lack of [Trait parameters](/scala3/reference/other-new-features/trait-parameters.html) which are now supported in Scala 3.

That is why the following piece of code does not compile anymore.

```scala
trait Bar {
  val name: String
  val size: Int = name.size
}

object Foo extends {
  val name = "Foo"
} with Bar
```

The Scala 3 compiler produces two error messages:

{% highlight text %}
-- Error: src/main/scala/early-initializer.scala:6:19 
6 |object Foo extends {
  |                   ^
  |                   `extends` must be followed by at least one parent
{% endhighlight %}

{% highlight text %}
-- [E009] Syntax Error: src/main/scala/early-initializer.scala:8:2 
8 |} with Bar
  |  ^^^^
  |  Early definitions are not supported; use trait parameters instead
{% endhighlight %}

It suggests to use trait parameters which would give us:

```scala
trait Bar(name: String) {
  val size: Int = name.size
}

object Foo extends Bar("Foo")
```

Since trait parameters are not available in Scala 2.13, it does not cross-compile.
If you need a cross-compiling solution you can use an intermediate class that carries the early initialized `val`s and `var`s as constructor parameters.

```scala
abstract class BarEarlyInit(val name: String) extends Bar

object Foo extends BarEarlyInit("Foo")
```

In the case of a class, it is also possible to use a secondary constructor with a fixed value, as shown by:

```scala
class Fizz private (val name: String) extends Bar {
  def this() = this("Fizz")
}
```

## Existential Type

Existential type is a [dropped feature](/scala3/reference/dropped-features/existential-types.html), which makes the following code invalid.

```scala
def foo: List[Class[T]] forSome { type T } // Error: Existential types are no longer supported
```

> Existential type is an experimental feature in Scala 2.13 that must be enabled explicitly either by importing `import scala.language.existentials` or by setting the `-language:existentials` compiler flag.

The proposed solution is to introduce an enclosing type that carries the dependent type:

```scala
trait Bar {
  type T
  val value: List[Class[T]]
}

def foo: Bar
```

Note that using a wildcard argument, `_` or `?`, is often simpler but is not always possible.
For instance you could replace `List[T] forSome { type  T }` by `List[?]`.
