---
layout: multipage-overview
title: Контекстные абстракции
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлено введение в контекстные абстракции в Scala 3.
language: ru
num: 14
previous-page: taste-collections
next-page: taste-toplevel-definitions
---


При определенных обстоятельствах вы можете опустить некоторые параметры вызовов методов, которые считаются повторяющимися.

Эти параметры называются _параметрами контекста_ (_Context Parameters_), 
поскольку они выводятся компилятором из контекста, окружающего вызов метода.

Например, рассмотрим программу, которая сортирует список адресов по двум критериям: 
название города, а затем название улицы.

{% tabs contextual_1 %}
{% tab 'Scala 2 and 3' for=contextual_1 %}

```scala
val addresses: List[Address] = ...

addresses.sortBy(address => (address.city, address.street))
```

{% endtab %}
{% endtabs %}

Метод `sortBy` принимает функцию, которая возвращает для каждого адреса значение, чтобы сравнить его с другими адресами. 
В этом случае мы передаем функцию, которая возвращает пару, содержащую название города и название улицы.

Обратите внимание, что мы только указываем, _что_ сравнивать, но не _как_ выполнять сравнение. 
Откуда алгоритм сортировки знает, как сравнивать пары `String`?

На самом деле метод `sortBy` принимает второй параметр — параметр контекста, который выводится компилятором. 
Его нет в приведенном выше примере, поскольку он предоставляется компилятором.

Этот второй параметр реализует _способ_ сравнения. 
Его удобно опустить, потому что мы знаем, что `String`-и обычно сравниваются в лексикографическом порядке.

Однако также возможно передать параметр явно:

{% tabs contextual_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(Ordering.Tuple2(Ordering.String, Ordering.String))
```

{% endtab %}
{% tab 'Scala 3' for=contextual_2 %}

```scala
addresses.sortBy(address => (address.city, address.street))(using Ordering.Tuple2(Ordering.String, Ordering.String))
```

в Scala 3 `using` в списке аргументов сигнализирует `sortBy` о явной передаче параметра контекста, избегая двусмысленности.

{% endtab %}
{% endtabs %}

В этом случае экземпляр `Ordering.Tuple2(Ordering.String, Ordering.String)` — это именно тот экземпляр, 
который в противном случае выводится компилятором. 
Другими словами, оба примера создают одну и ту же программу.

_Контекстные абстракции_ используются, чтобы избежать повторения кода. 
Они помогают разработчикам писать фрагменты кода, которые являются расширяемыми и в то же время лаконичными.

Дополнительные сведения см. в [главе "Контекстные абстракции"][contextual] этой книги, а также в [справочной документации][reference].

[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[reference]: {{ site.scala3ref }}/overview.html
