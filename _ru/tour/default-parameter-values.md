---
layout: tour
title: Значения Параметров По умолчанию
partof: scala-tour
num: 33
language: ru
next-page: named-arguments
previous-page: classes
prerequisite-knowledge: named-arguments, function syntax
---

Scala предоставляет возможность задавать значения параметров по умолчанию, что позволяет лишний раз не указывать параметры.

{% tabs default-parameter-values-1 %}
{% tab 'Scala 2 и 3' for=default-parameter-values-1 %}

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // выведет "INFO: System starting"
log("User not found", "WARNING")  // выведет "WARNING: User not found"
```

{% endtab %}
{% endtabs %}

У параметра `level` есть значение по умолчанию, поэтому он необязателен. В последней строке аргумент `"WARNING"` переназначает аргумент по умолчанию `"INFO"`. Вместо того чтоб использовать перегруженные методы в Java, вы можете просто указать дополнительные параметры как параметры по умолчанию для достижения того же эффекта. Однако, если при вызове пропущен хотя бы один аргумент, все остальные аргументы должны вызываться с указанием конкретного имени аргумента.

{% tabs default-parameter-values-2 %}
{% tab 'Scala 2 и 3' for=default-parameter-values-2 %}

```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```

{% endtab %}
{% endtabs %}

Так мы можем указать что `y = 1`.

Обратите внимание, что параметры по умолчанию в Scala, при вызове из Java кода, являются обязательными:

{% tabs default-parameter-values-3 %}
{% tab 'Scala 2 и 3' for=default-parameter-values-3 %}

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
        Point point = new Point(1);  // не скомпилируется
    }
}
```

{% endtab %}
{% endtabs %}

### Параметры по умолчанию для перегруженных методов

Scala не позволяет определять два метода с параметрами по умолчанию и с одинаковым именем (перегруженные методы).
Важная причина этого - избежание двусмысленности, которая может быть вызвана наличием параметров по умолчанию.
Чтобы проиллюстрировать проблему, давайте рассмотрим определение методов, представленных ниже:

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

Если мы вызываем `A.func()`, компилятор не может узнать,
намеревался ли программист вызвать `func(x: Int = 34)` или `func(y: String = "abc")`.
