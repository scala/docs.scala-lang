---
layout: tour
title: Значения Параметров По умолчанию

discourse: true

partof: scala-tour

num: 33
language: ru
next-page: named-arguments
previous-page: classes
prerequisite-knowledge: named-arguments, function syntax

---

Scala предоставляет возможность задавать значения параметров по умолчанию, что позволяет лишний раз не указывать параметры. 

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // выведет "INFO: System starting"
log("User not found", "WARNING")  // выведет "WARNING: User not found"
```

У параметра `level` есть значение по умолчанию, поэтому он необязателен. В последней строке аргумент `"WARNING"` переназначает аргумент по умолчанию `"INFO"`. Вместо того чтоб использовать перегруженные методы в Java, вы можете просто указать дополнительные параметры как параметры по умолчанию для достижения того же эффекта. Однако, если при вызове пропущен хотя бы один аргумент, все остальные аргументы должны вызываться с указанием конкретного имени аргумента.

```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
Так мы можем указать что `y = 1`.

Обратите внимание, что параметры по умолчанию в Scala, при вызове из Java кода, являются обязательными:

```scala mdoc:reset
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // не скомпилируется
    }
}
```
