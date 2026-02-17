---
title: Syntactic Changes
type: section
description: This chapter details all the incompatibilities caused by syntactic changes
num: 17
previous-page: incompatibility-table
next-page: incompat-dropped-features
---

Scala 3 introduces the optional-braces syntax and the new control structure syntax.
It comes at the cost of some minimal restrictions in the preexisting syntax.

Other syntactic changes are intended to make the syntax less surprising and more consistent.

It is worth noting that most of the changes can be automatically handled during the [Scala 3 migration compilation](tooling-migration-mode.html).

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[Restricted keywords](#restricted-keywords)||✅||
|[Procedure syntax](#procedure-syntax)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Parentheses around lambda parameter](#parentheses-around-lambda-parameter)||✅||
|[Open brace indentation for passing an argument](#open-brace-indentation-for-passing-an-argument)||✅||
|[Wrong indentation](#wrong-indentation)||||
|[`_` as a type parameter](#_-as-a-type-parameter)||||
|[`+` and `-` as type parameters](#-and---as-type-parameters)||||

## Restricted Keywords

The list of Scala 3 keywords can be found [here](https://nightly.scala-lang.org/docs/internals/syntax.html#keywords).
_Regular_ keywords cannot be used as identifiers, whereas _soft_ keywords are not restricted.

For the matter of migrating from Scala 2.13 to Scala 3, only the subset of new _regular_ keywords are problematic.
It is composed of:
- `enum`
- `export`
- `given`
- `then`
- `=>>`
- `?=>`

{% tabs scala-2-keywords_1 %}
{% tab 'Scala 2 Only' %}

For instance, the following piece of code can be compiled with Scala 2.13 but not with Scala 3.
~~~ scala
object given { // In Scala 3, Error: given is now a keyword.
  val enum = ??? // In Scala 3, Error: enum is now a keyword.

  println(enum) // In Scala 3, Error: enum is now a keyword.
}
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites the code into:
{% highlight diff %}
-object given {
+object `given` {
-  val enum = ???
+  val `enum` = ???

-  println(enum)
+  println(`enum`)
 }
{% endhighlight %}

## Procedure Syntax

Procedure syntax has been deprecated for a while and it is dropped in Scala 3.

{% tabs scala-2-procedure_1 %}
{% tab 'Scala 2 Only' %}

The following pieces of code are now illegal:
~~~ scala
object Bar {
  def print() { // In Scala 3, Error: Procedure syntax no longer supported; `: Unit =` should be inserted here.
    println("bar")
  }
}
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites the code into.
{% highlight diff %}
 object Bar {
-  def print() {
+  def print(): Unit = {
     println("bar")
   }
 }
{% endhighlight %}

## Parentheses Around Lambda Parameter

When followed by its type, the parameter of a lambda is now required to be enclosed in parentheses.
The following piece of code is invalid.

{% tabs scala-2-lambda_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
val f = { x: Int => x * x } // In Scala 3, Error: parentheses are required around the parameter of a lambda.
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compilation](tooling-migration-mode.html) rewrites the code into:
{% highlight diff %}
-val f = { x: Int => x * x }
+val f = { (x: Int) => x * x }
{% endhighlight %}

## Open Brace Indentation For Passing An Argument

In Scala 2 it is possible to pass an argument after a new line by enclosing it into braces.
Although valid, this style of coding is not encouraged by the [Scala style guide](https://docs.scala-lang.org/style) and is no longer supported in Scala 3.

{% tabs scala-2-brace_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
test("my test")
{ // In Scala 3, Error: This opening brace will start a new statement.
  assert(1 == 1)
}
~~~
{% endtab %}
{% endtabs %}

The [Scala 3 migration compiler](tooling-migration-mode.html) indents the first line of the block.
{% highlight diff %}
 test("my test")
-{
+  {
   assert(1 == 1)
 }
{% endhighlight %}

This migration rule applies to other patterns as well, such as refining a type after a new line.

{% highlight diff %}
 type Bar = Foo
-{
+  {
   def bar(): Int
 }
{% endhighlight %}

A preferable solution is to write:
{% highlight diff %}
-test("my test")
-{
+test("my test") {
   assert(1 == 1)
 }
{% endhighlight %}

## Wrong indentation

The Scala 3 compiler now requires correct indentation.
The following piece of code, that was compiled in Scala 2.13, does not compile anymore because of the indentation.

{% tabs scala-2-indentation_1 %}
{% tab 'Scala 2 Only' %}

~~~ scala
def bar: (Int, Int) = {
  val foo = 1.0
  val bar = foo // [E050] In Scala 3, type Error: value foo does not take parameters.
    (1, 1)
} // [E007] In Scala 3, type Mismatch Error: Found Unit, Required (Int, Int).
~~~
{% endtab %}
{% endtabs %}

The indentation must be fixed.
{% highlight diff %}
 def bar: (Int, Int) = {
   val foo = 1.0
   val bar = foo
-    (1, 1)
+  (1, 1)
 }
{% endhighlight %}

These errors can be prevented by using a Scala formatting tool such as [scalafmt](https://scalameta.org/scalafmt/) or the [IntelliJ Scala formatter](https://www.jetbrains.com/help/idea/reformat-and-rearrange-code.html).
Beware that these tools may change the entire code style of your project.

## `_` As A Type Parameter

The usage of the `_` identifier as a type parameter is permitted in Scala 2.13, even if it has never been mentioned in the Scala 2 specification.
It is used in the API of [fastparse](https://index.scala-lang.org/lihaoyi/fastparse), in combination with a context bound, to declare an implicit parameter.

{% tabs scala-2-identifier_1 %}
{% tab 'Scala 2 Only' %}
~~~ scala
def foo[_: Foo]: Unit = ???
~~~
{% endtab %}
{% endtabs %}

Here, the method `foo` takes a type parameter `_` and an implicit parameter of type `Foo[_]` where `_` refers to the type parameter, not the wildcard symbol.

Martin Odersky described this pattern as a "clever exploit of a scalac compiler bug" ([source](https://www.reddit.com/r/scala/comments/fczcvo/mysterious_context_bounds_in_fastparse_2/fjecokn/)).

The Scala 3 compiler does not permit this pattern anymore: 

{% highlight text %}
-- [E040] Syntax Error: src/main/scala/anonymous-type-param.scala:4:10
4 |  def foo[_: Foo]: Unit = ()
  |          ^
  |          an identifier expected, but '_' found
{% endhighlight %}

The solution is to give the parameter a valid identifier name, for instance `T`.
This will not break the binary compatibility.

{% highlight diff %}
-def foo[_: Foo]: Unit = ???
+def foo[T: Foo]: Unit = ???
{% endhighlight %}

## `+` And `-` As Type Parameters

`+` and `-` are not valid identifiers for type parameters in Scala 3, since they are reserved for variance annotation.

You cannot write `def foo[+]` or `def foo[-]` anymore.

{% highlight text %}
-- Error: src/main/scala/type-param-identifier.scala:2:10 
2 |  def foo[+]: +
  |          ^
  |          no `+/-` variance annotation allowed here
{% endhighlight %}

The solution is to choose another valid identifier, for instance `T`.

However, `+` and `-` still are valid type identifiers in general.
You can write `type +`.
