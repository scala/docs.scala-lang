---
layout: tour
title: Default Parameter Values
partof: scala-tour

num: 5
next-page: named-arguments
previous-page: classes
prerequisite-knowledge: named-arguments, function syntax

redirect_from: "/tutorials/tour/default-parameter-values.html"
---

Scala provides the ability to give parameters default values that can be used to allow a caller to omit those parameters.

{% tabs default-parameter-values-1 %}
{% tab 'Scala 2 and 3' for=default-parameter-values-1 %}
```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```
{% endtab %}
{% endtabs %}


The parameter `level` has a default value so it is optional. On the last line, the argument `"WARNING"` overrides the default argument `"INFO"`. Where you might do overloaded methods in Java, you can use methods with optional parameters to achieve the same effect. However, if the caller omits an argument, any following arguments must be named.

Place `optional parameters` (with default values) at the end of the parameter list. This ensures that callers using positional arguments can omit them without ambiguity. If a `mandatory parameter` appears after an optional one, it will still need to be provided, making the `optional parameter` effectively required in positional calls.

{% tabs default-parameter-values-2 %}
{% tab 'Scala 2 and 3' for=default-parameter-values-2 %}
```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
{% endtab %}
{% endtabs %}

Here we have to say `y = 1`.

Note that default parameters in Scala are not optional when called from Java code:

{% tabs default-parameter-values-3 %}
{% tab 'Scala 2 and 3' for=default-parameter-values-3 %}
```scala mdoc:reset
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```
{% endtab %}
{% endtabs %}

{% tabs default-parameter-values-4 %}
{% tab 'Java' for=default-parameter-values-4 %}
```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // does not compile
    }
}
```
{% endtab %}
{% endtabs %}

### Default Parameters for Overloaded Methods

Scala doesn't allow having two methods with default parameters and with the same name (overloaded).
An important reason why is to avoid the ambiguity that can be caused due to the existence of default parameters. To illustrate the problem, let's consider the method declarations provided below:

{% tabs default-parameter-values-5 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc:fail
object A {
  def func(x: Int = 34): Unit
  def func(y: String = "abc"): Unit
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
object A:
  def func(x: Int = 34): Unit
  def func(y: String = "abc"): Unit
```
{% endtab %}
{% endtabs %}

If we call `A.func()`, compiler cannot know whether the programmer intended to call `func(x: Int = 34)` or `func(y: String = "abc")`.
