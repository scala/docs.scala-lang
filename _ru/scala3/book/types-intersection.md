---
layout: multipage-overview
title: Пересечение типов
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены пересечение типов в Scala 3.
language: ru
num: 51
previous-page: types-generics
next-page: types-union
---

<span class="tag tag-inline">Только в Scala 3</span>

Используемый для типов оператор `&` создает так называемый _тип пересечения_ (_intersection type_).
Тип `A & B` представляет собой значения, которые **одновременно** относятся как к типу `A`, так и к типу `B`.
Например, в следующем примере используется тип пересечения `Resettable & Growable[String]`:

{% tabs intersection-reset-grow %}

{% tab 'Только в Scala 3' %}

```scala
trait Resettable:
  def reset(): Unit

trait Growable[A]:
  def add(a: A): Unit

def f(x: Resettable & Growable[String]): Unit =
  x.reset()
  x.add("first")
```

{% endtab %}

{% endtabs %}

В методе `f` в этом примере параметр `x` должен быть _одновременно_ как `Resettable`, так и `Growable[String]`.

Все _члены_ типа пересечения `A & B` являются типом `A` и типом `B`.
Следовательно, как показано, для `Resettable & Growable[String]` доступны методы `reset` и `add`.

Пересечение типов может быть полезно для _структурного_ описания требований.
В примере выше для `f` мы прямо заявляем, что нас устраивает любое значение для `x`,
если оно является подтипом как `Resettable`, так и `Growable`.
**Нет** необходимости создавать _номинальный_ вспомогательный trait, подобный следующему:

{% tabs normal-trait class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Both[A] extends Resettable with Growable[A]
def f(x: Both[String]): Unit
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Both[A] extends Resettable, Growable[A]
def f(x: Both[String]): Unit
```

{% endtab %}
{% endtabs %}

Существует важное различие между двумя вариантами определения `f`:
в то время как оба позволяют вызывать `f` с экземплярами `Both`,
только первый позволяет передавать экземпляры,
которые являются подтипами `Resettable` и `Growable[String]`, _но не_ `Both[String]`.

> Обратите внимание, что `&` _коммутативно_: `A & B` имеет тот же тип, что и `B & A`.
