---
layout: multipage-overview
title: Контекстные границы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе представлены контекстные границы в Scala 3.
language: ru
num: 62
previous-page: ca-context-parameters
next-page:
---

Во многих ситуациях имя [контекстного параметра]({% link _overviews/scala3-book/ca-context-parameters.md %}#context-parameters)
не нужно указывать явно, поскольку оно используется компилятором только в синтезированных аргументах для других параметров контекста.
В этом случае вам не нужно определять имя параметра, а можно просто указать тип.

## Предыстория

Например, рассмотрим метод `maxElement`, возвращающий максимальное значение в коллекции:

{% tabs context-bounds-max-named-param class=tabs-scala-version %}

{% tab 'Scala 2' %}

```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(ord))
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
def maxElement[A](as: List[A])(using ord: Ord[A]): A =
  as.reduceLeft(max(_, _)(using ord))
```

{% endtab %}

{% endtabs %}

Метод `maxElement` принимает _контекстный параметр_ типа `Ord[A]` только для того,
чтобы передать его в качестве аргумента методу `max`.

Для полноты приведем определения `max` и `Ord`
(обратите внимание, что на практике мы будем использовать существующий метод `max` для `List`,
но мы создали этот пример для иллюстрации):

{% tabs context-bounds-max-ord class=tabs-scala-version %}

{% tab 'Scala 2' %}

```scala
/** Определяет, как сравнивать значения типа `A` */
trait Ord[A] {
  def greaterThan(a1: A, a2: A): Boolean
}

/** Возвращает максимальное из двух значений */
def max[A](a1: A, a2: A)(implicit ord: Ord[A]): A =
  if (ord.greaterThan(a1, a2)) a1 else a2
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
/** Определяет, как сравнивать значения типа `A` */
trait Ord[A]:
  def greaterThan(a1: A, a2: A): Boolean

/** Возвращает максимальное из двух значений */
def max[A](a1: A, a2: A)(using ord: Ord[A]): A =
  if ord.greaterThan(a1, a2) then a1 else a2
```

{% endtab %}

{% endtabs %}

Обратите внимание, что метод `max` принимает контекстный параметр типа `Ord[A]`, как и метод `maxElement`.

## Пропуск контекстных аргументов

Так как `ord` - это контекстный параметр в методе `max`,
компилятор может предоставить его для нас в реализации `maxElement` при вызове `max`:

{% tabs context-bounds-context class=tabs-scala-version %}

{% tab 'Scala 2' %}

```scala
def maxElement[A](as: List[A])(implicit ord: Ord[A]): A =
  as.reduceLeft(max(_, _))
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
def maxElement[A](as: List[A])(using Ord[A]): A =
  as.reduceLeft(max(_, _))
```

Обратите внимание: поскольку нам не нужно явно передавать его методу `max`,
мы можем не указывать его имя в определении метода `maxElement`.
Это _анонимный параметр контекста_.

{% endtab %}

{% endtabs %}

## Границы контекста

Учитывая написанное выше, _привязка к контексту_ — это сокращенный синтаксис
для выражения шаблона "параметр контекста, применяемый к параметру типа".

Используя привязку к контексту, метод `maxElement` можно записать следующим образом:

{% tabs context-bounds-max-rewritten %}

{% tab 'Scala 2 и 3' %}

```scala
def maxElement[A: Ord](as: List[A]): A =
  as.reduceLeft(max(_, _))
```

{% endtab %}

{% endtabs %}

Привязка типа `: Ord` к параметру типа `A` метода или класса указывает на параметр контекста с типом `Ord[A]`.
Под капотом компилятор преобразует этот синтаксис в тот, который показан в разделе "Предыстория".

Дополнительные сведения о границах контекста см. в разделе ["Что такое границы контекста?"]({% link _overviews/FAQ/index.md %}#what-are-context-bounds) раздел FAQ по Scala.
