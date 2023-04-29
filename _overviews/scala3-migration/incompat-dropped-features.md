---
title: Dropped Features
type: section
description: This chapter details all the dropped features
num: 17
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
|[@specialized](#specialized)|Deprecation|||

## Symbol literals

The Symbol literal syntax is deprecated in Scala 2.13 and dropped in Scala 3.
But the `scala.Symbol` class still exists so that each string literal can be safely replaced by an application of `Symbol`.

This piece of code cannot be compiled with Scala 3:

{% tabs scala-2-literals_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
val values: Map[Symbol, Int] = Map('abc -> 1)

val abc = values('abc) // In Scala 3, Migration Warning: symbol literal 'abc is no longer supported
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites the code into:
{% highlight diff %}
val values: Map[Symbol, Int] = Map(Symbol("abc") -> 1)

-val abc = values('abc)
+val abc = values(Symbol("abc"))
{% endhighlight %}

Although the `Symbol` class is useful during the transition, beware that it is deprecated and will be removed from the `scala-library` in a future version.
You are recommended, as a second step, to replace every use of `Symbol` with a plain string literals `"abc"` or a custom dedicated class.

## `do`-`while` construct

The `do` keyword has acquired a different meaning in the [New Control Syntax]({{ site.scala3ref }}/other-new-features/control-syntax.html).

To avoid confusion, the traditional `do <body> while (<cond>)` construct is dropped.
It is recommended to use the equivalent `while ({ <body>; <cond> }) ()` that can be cross-compiled, or the new Scala 3 syntax `while { <body>; <cond> } do ()`.

The following piece of code cannot be compiled with Scala 3.

{% tabs scala-2-do_while_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
do { // In Scala 3, Migration Warning: `do <body> while <cond>` is no longer supported
  i += 1
} while (f(i) == 0)
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into. 
{% tabs scala-3-do_while_2 %}
{% tab 'Scala 3 Only' %}
~~~ scala
while ({ {
  i += 1
} ; f(i) == 0}) ()
~~~
{% endtab %}
{% endtabs %}

## Auto-application

Auto-application is the syntax of calling an empty-paren method such as `def toInt(): Int` without passing an empty argument list.
It is deprecated in Scala 2.13 and dropped in Scala 3.

The following code is invalid in Scala 3:

{% tabs scala-2-auto_application_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
object Hello {
  def message(): String = "Hello"
}

println(Hello.message) // In Scala 3, Migration Warning: method message must be called with () argument
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into:
{% highlight diff %}
object Hello {
  def message(): String = "Hello"
}

-println(Hello.message)
+println(Hello.message())
{% endhighlight %}

Auto-application is covered in detail in [this page]({{ site.scala3ref }}/dropped-features/auto-apply.html) of the Scala 3 reference documentation.

## Value eta-expansion

Scala 3 introduces [Automatic Eta-Expansion]({{ site.scala3ref }}/changed-features/eta-expansion-spec.html) which will deprecate the method to value syntax `m _`.
Furthermore Scala 3 does not allow eta-expansion of values to nullary functions anymore.

Thus, this piece of code is invalid in Scala 3:

{% tabs scala-2-eta_expansion_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
val x = 1
val f: () => Int = x _ // In Scala 3, Migration Warning: The syntax `<function> _` is no longer supported;
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites it into:
{% highlight diff %}
val x = 1
-val f: () => Int = x _
+val f: () => Int = (() => x)
{% endhighlight %}

## `any2stringadd` conversion

The implicit `Predef.any2stringadd` conversion is deprecated in Scala 2.13 and dropped in Scala 3.

This piece of code does not compile anymore in Scala 3.

{% tabs scala-2-any2stringadd_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
val str = new AnyRef + "foo" // In Scala 3, Error: value + is not a member of Object
~~~
{% endtab %}
{% endtabs %}

The conversion to `String` must be applied explicitly, for instance with `String.valueOf`.
{% highlight diff %}
-val str = new AnyRef + "foo"
+val str = String.valueOf(new AnyRef) + "foo"
{% endhighlight %}

This rewrite can be applied by the `fix.scala213.Any2StringAdd` Scalafix rule in [`scala/scala-rewrites`](https://index.scala-lang.org/scala/scala-rewrites/scala-rewrites/0.1.2?target=_2.13).

## Early Initializer

Early initializers are deprecated in Scala 2.13 and dropped in Scala 3.
They were rarely used, and mostly to compensate for the lack of [Trait parameters]({{ site.scala3ref }}/other-new-features/trait-parameters.html) which are now supported in Scala 3.

That is why the following piece of code does not compile anymore in Scala 3.

{% tabs scala-2-initializer_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
trait Bar {
  val name: String
  val size: Int = name.size
}

object Foo extends {
  val name = "Foo"
} with Bar
~~~
{% endtab %}
{% endtabs %}

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

{% tabs scala-3-initializer_2 %}
{% tab 'Scala 3 Only' %}
~~~ scala
trait Bar(name: String) {
  val size: Int = name.size
}

object Foo extends Bar("Foo")
~~~
{% endtab %}
{% endtabs %}

Since trait parameters are not available in Scala 2.13, it does not cross-compile.
If you need a cross-compiling solution you can use an intermediate class that carries the early initialized `val`s and `var`s as constructor parameters.

{% tabs shared-initializer_4 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
abstract class BarEarlyInit(val name: String) extends Bar

object Foo extends BarEarlyInit("Foo")
~~~ 

In the case of a class, it is also possible to use a secondary constructor with a fixed value, as shown by:
~~~ scala
class Fizz private (val name: String) extends Bar {
  def this() = this("Fizz")
}
~~~
{% endtab %}
{% endtabs %}

## Existential Type

Existential type is a [dropped feature]({{ site.scala3ref }}/dropped-features/existential-types.html), which makes the following code invalid.
  
{% tabs scala-2-existential_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
def foo: List[Class[T]] forSome { type T } // In Scala 3, Error: Existential types are no longer supported
~~~
{% endtab %}
{% endtabs %}

> Existential type is an experimental feature in Scala 2.13 that must be enabled explicitly either by importing `import scala.language.existentials` or by setting the `-language:existentials` compiler flag.

In Scala 3, the proposed solution is to introduce an enclosing type that carries the dependent type:

{% tabs shared-existential_1 %}
{% tab 'Scala 2 and 3' %}
~~~ scala
trait Bar {
  type T
  val value: List[Class[T]]
}

def foo: Bar
~~~
{% endtab %}
{% endtabs %}

Note that using a wildcard argument, `_` or `?`, is often simpler but is not always possible.
For instance you could replace `List[T] forSome { type  T }` by `List[?]`.

## Specialized

The `@specialized` annotation from Scala 2 is ignored in Scala 3.

However, there is limited support for specialized `Function` and `Tuple`.

Similar benefits can be derived from `inline` declarations.

