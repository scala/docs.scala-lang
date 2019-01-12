---
layout: tour
title: Значения Параметров По умолчанию

discourse: true

partof: scala-tour

num: 33
language: ru
next-page: named-arguments
previous-page: annotations
prerequisite-knowledge: named-arguments, function syntax

---

Scala предоставляет возможность задавать значения параметров по умолчанию, что позволяет лишний раз не описывать эти параметры. 

```tut
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // выведет "INFO: System starting"
log("User not found", "WARNING")  // выведет "WARNING: User not found"
```

У параметра `level` есть значение по умолчанию, поэтому он необязателен. В последней строке аргумент `"WARNING"` перекрывает аргумент по умолчанию `ИНФО`. Если вы можете использовать перегруженные методы в Java, вы можете использовать методы с дополнительными параметрами для достижения того же эффекта. Однако, если вызывающий абонент пропускает аргумент, должны быть названы следующие аргументы.

```tut
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```
Так мы можем указать что `y = 1`.

Обратите внимание, что параметры по умолчанию в Scala не являются необязательными при вызове из Java кода:

```tut
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
