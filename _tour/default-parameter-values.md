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

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```

The parameter `level` has a default value so it is optional. On the last line, the argument `"WARNING"` overrides the default argument `"INFO"`. Where you might do overloaded methods in Java, you can use methods with optional parameters to achieve the same effect. However, if the caller omits an argument, any following arguments must be named.

```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
Here we have to say `y = 1`.

Note that default parameters in Scala are not optional when called from Java code:

```scala mdoc:reset
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // does not compile
    }
}
```
