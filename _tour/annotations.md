---
layout: tour
title: Annotations
partof: scala-tour

num: 34
next-page: packages-and-imports
previous-page: by-name-parameters

redirect_from: "/tutorials/tour/annotations.html"
---

Annotations associate meta-information with definitions. For example, the annotation `@deprecated` before a method causes the compiler to print a warning if the method is used.

{% tabs annotations_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_1 %}
```scala mdoc:fail
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello
}
```
{% endtab %}
{% tab 'Scala 3' for=annotations_1 %}
```scala
object DeprecationDemo extends App:
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello
```
{% endtab %}
{% endtabs %}

This will compile but the compiler will print a warning: "there was one deprecation warning".

An annotation clause applies to the first definition or declaration following it. More than one annotation clause may precede a definition and declaration. The order in which these clauses are given does not matter.


## Annotations that ensure correctness of encodings
Certain annotations will actually cause compilation to fail if a condition(s) is not met. For example, the annotation `@tailrec` ensures that a method is [tail-recursive](https://en.wikipedia.org/wiki/Tail_call). Tail-recursion can keep memory requirements constant. Here's how it's used in a method which calculates the factorial:

{% tabs annotations_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_2 %}
```scala mdoc
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```
{% endtab %}
{% tab 'Scala 3' for=annotations_2 %}
```scala
import scala.annotation.tailrec

def factorial(x: Int): Int =

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int =
    if x == 1 then accumulator else factorialHelper(x - 1, accumulator * x)
  factorialHelper(x, 1)
```
{% endtab %}
{% endtabs %}

The `factorialHelper` method has the `@tailrec` which ensures the method is indeed tail-recursive. If we were to change the implementation of `factorialHelper` to the following, it would fail:

{% tabs annotations_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_3 %}
```scala mdoc:fail
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```
{% endtab %}
{% tab 'Scala 3' for=annotations_3 %}
```scala
import scala.annotation.tailrec

def factorial(x: Int): Int =
  @tailrec
  def factorialHelper(x: Int): Int =
    if x == 1 then 1 else x * factorialHelper(x - 1)
  factorialHelper(x)
```
{% endtab %}
{% endtabs %}

We would get the message "Recursive call not in tail position".

## Annotations affecting code generation

{% tabs annotations_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_4 %}

Some annotations like `@inline` affect the generated code (i.e. your jar file might have different bytes than if you hadn't used the annotation). Inlining means inserting the code in a method's body at the call site. The resulting bytecode is longer, but hopefully runs faster. Using the annotation `@inline` does not ensure that a method will be inlined, but it will cause the compiler to do it if and only if some heuristics about the size of the generated code are met.

{% endtab %}
{% tab 'Scala 3' for=annotations_4 %}

Some annotations like `@main` affect the generated code (i.e. your jar file might have different bytes than if you hadn't used the annotation). A `@main` annotation on a method generates an executable program that calls the method as an entry point.

{% endtab %}
{% endtabs %}

### Java Annotations ###
When writing Scala code which interoperates with Java, there are a few differences in annotation syntax to note.
**Note:** Make sure you use the `-target:jvm-1.8` option with Java annotations.

Java has user-defined metadata in the form of [annotations](https://docs.oracle.com/javase/tutorial/java/annotations/). A key feature of annotations is that they rely on specifying name-value pairs to initialize their elements. For instance, if we need an annotation to track the source of some class we might define it as

{% tabs annotations_5 %}
{% tab 'Java' for=annotations_5 %}
```java
@interface Source {
  public String url();
  public String mail();
}
```
{% endtab %}
{% endtabs %}

And then apply it as follows

{% tabs annotations_6 %}
{% tab 'Java' for=annotations_6 %}
```java
@Source(url = "https://coders.com/",
        mail = "support@coders.com")
public class MyJavaClass extends TheirClass ...
```
{% endtab %}
{% endtabs %}

An annotation application in Scala looks like a constructor invocation, but to instantiate a Java annotation one has to use named arguments:

{% tabs annotations_7 %}
{% tab 'Scala 2 and 3' for=annotations_7 %}
```scala
@Source(url = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```
{% endtab %}
{% endtabs %}

This syntax is quite tedious if the annotation contains only one element (without default value) so, by convention, if the name is specified as `value` it can be applied in Java using a constructor-like syntax:

{% tabs annotations_8 %}
{% tab 'Java' for=annotations_8 %}
```java
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```
{% endtab %}
{% endtabs %}

And then apply it as follows:

{% tabs annotations_9 %}
{% tab 'Java' for=annotations_9 %}
```java
@SourceURL("https://coders.com/")
public class MyJavaClass extends TheirClass ...
```
{% endtab %}
{% endtabs %}

In this case, Scala provides the same possibility:

{% tabs annotations_10 %}
{% tab 'Scala 2 and 3' for=annotations_10 %}
```scala
@SourceURL("https://coders.com/")
class MyScalaClass ...
```
{% endtab %}
{% endtabs %}

The `mail` element was specified with a default value so we need not explicitly provide a value for it.
However, if we need to provide one then in Java we must also explicitly name the `value` parameter:

{% tabs annotations_11 %}
{% tab 'Java' for=annotations_11 %}
```java
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyJavaClass extends TheirClass ...
```
{% endtab %}
{% endtabs %}

Scala provides more flexibility in this respect, so we can choose to only name the `mail` parameter:

{% tabs annotations_12 %}
{% tab 'Scala 2 and 3' for=annotations_12 %}
```scala
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
class MyScalaClass ...
```
{% endtab %}
{% endtabs %}
