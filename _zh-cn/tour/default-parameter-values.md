---
layout: tour
title: 默认参数值
partof: scala-tour

num: 31

language: zh-cn

next-page: named-arguments
previous-page: annotations
---

Scala具备给参数提供默认值的能力，这样调用者就可以忽略这些具有默认值的参数。

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```

上面的参数level有默认值，所以是可选的。最后一行中传入的参数`"WARNING"`重写了默认值`"INFO"`。在Java中，我们可以通过带有可选参数的重载方法达到同样的效果。不过，只要调用方忽略了一个参数，其他参数就必须要带名传入。

```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
这里必须带名传入`y = 1`。

注意从Java代码中调用时，Scala中的默认参数则是必填的（非可选），如：

```scala mdoc:nest
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
