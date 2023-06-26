---
layout: multipage-overview
title: Определение типов
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены и демонстрируются выводимые типы в Scala 3.
language: ru
num: 49
previous-page: types-introduction
next-page: types-generics
---

Как и в других статически типизированных языках программирования,
в Scala тип можно _объявить_ при создании новой переменной:

{% tabs xy %}
{% tab 'Scala 2 и 3' %}

```scala
val x: Int = 1
val y: Double = 1
```

{% endtab %}
{% endtabs %}

В этих примерах типы _явно_ объявлены как `Int` и `Double` соответственно.
Однако в Scala обычно необязательно указывать тип при объявлении переменной:

{% tabs abm %}
{% tab 'Scala 2 и 3' %}

```scala
val a = 1
val b = List(1, 2, 3)
val m = Map(1 -> "one", 2 -> "two")
```

{% endtab %}
{% endtabs %}

Когда вы это сделаете, Scala сама _выведет_ типы, как показано в следующей сессии REPL:

{% tabs abm2 %}
{% tab 'Scala 2 и 3' %}

```scala
scala> val a = 1
val a: Int = 1

scala> val b = List(1, 2, 3)
val b: List[Int] = List(1, 2, 3)

scala> val m = Map(1 -> "one", 2 -> "two")
val m: Map[Int, String] = Map(1 -> one, 2 -> two)
```

{% endtab %}
{% endtabs %}

Действительно, большинство переменных определяются без указания типа,
и способность Scala автоматически определять его — это одна из особенностей,
которая делает Scala _похожим_ на язык с динамической типизацией.
