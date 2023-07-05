---
layout: multipage-overview
title: Вариантность
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлена и демонстрируется вариантность в Scala 3.
language: ru
num: 54
previous-page: types-adts-gadts
next-page:
---

_Вариантность_ (_variance_) параметра типа управляет подтипом параметризованных типов (таких, как классы или трейты).

Чтобы объяснить вариантность, давайте рассмотрим следующие определения типов:

{% tabs types-variance-1 %}
{% tab 'Scala 2 и 3' %}

```scala
trait Item { def productNumber: String }
trait Buyable extends Item { def price: Int }
trait Book extends Buyable { def isbn: String }

```

{% endtab %}
{% endtabs %}

Предположим также следующие параметризованные типы:

{% tabs types-variance-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-2 %}

```scala
// пример инвариантного типа
trait Pipeline[T] {
  def process(t: T): T
}

// пример ковариантного типа
trait Producer[+T] {
  def make: T
}

// пример контрвариантного типа
trait Consumer[-T] {
  def take(t: T): Unit
}
```

{% endtab %}

{% tab 'Scala 3' for=types-variance-2 %}

```scala
// пример инвариантного типа
trait Pipeline[T]:
  def process(t: T): T

// пример ковариантного типа
trait Producer[+T]:
  def make: T

// пример контрвариантного типа
trait Consumer[-T]:
  def take(t: T): Unit
```

{% endtab %}
{% endtabs %}

В целом существует три режима вариантности (variance):

- **инвариант** (invariant) — значение по умолчанию, написанное как `Pipeline[T]`
- **ковариантный** (covariant) — помечен знаком `+`, например `Producer[+T]`
- **контравариантный** (contravariant) — помечен знаком `-`, как в `Consumer[-T]`

Подробнее рассмотрим, что означает и как используется эта аннотация.

### Инвариантные типы

По умолчанию такие типы, как `Pipeline`, инвариантны в своем аргументе типа (в данном случае `T`).
Это означает, что такие типы, как `Pipeline[Item]`, `Pipeline[Buyable]` и `Pipeline[Book]`, _не являются подтипами_ друг друга.

И это правильно! Предположим, что следующий метод использует два значения (`b1`, `b2`) типа `Pipeline[Buyable]`
и передает свой аргумент `b` методу `process` при его вызове на `b1` и `b2`:

{% tabs types-variance-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-3 %}

```scala
def oneOf(
  p1: Pipeline[Buyable],
  p2: Pipeline[Buyable],
  b: Buyable
): Buyable = {
  val b1 = p1.process(b)
  val b2 = p2.process(b)
  if (b1.price < b2.price) b1 else b2
 }
```

{% endtab %}

{% tab 'Scala 3' for=types-variance-3 %}

```scala
def oneOf(
  p1: Pipeline[Buyable],
  p2: Pipeline[Buyable],
  b: Buyable
): Buyable =
  val b1 = p1.process(b)
  val b2 = p2.process(b)
  if b1.price < b2.price then b1 else b2
```

{% endtab %}
{% endtabs %}

Теперь вспомните, что у нас есть следующие _отношения подтипов_ между нашими типами:

{% tabs types-variance-4 %}
{% tab 'Scala 2 и 3' %}

```scala
Book <: Buyable <: Item
```

{% endtab %}
{% endtabs %}

Мы не можем передать `Pipeline[Book]` методу `oneOf`,
потому что в реализации `oneOf` мы вызываем `p1` и `p2` со значением типа `Buyable`.
`Pipeline[Book]` ожидает `Book`, что потенциально может вызвать ошибку времени выполнения.

Мы не можем передать `Pipeline[Item]`, потому что вызов `process` обещает вернуть `Item`;
однако мы должны вернуть `Buyable`.

#### Почему Инвариант?

На самом деле тип `Pipeline` должен быть инвариантным,
так как он использует свой параметр типа `T` _и в качестве_ аргумента, _и в качестве_ типа возвращаемого значения.
По той же причине некоторые типы в библиотеке коллекций Scala, такие как `Array` или `Set`, также являются _инвариантными_.

### Ковариантные типы

В отличие от `Pipeline`, который является инвариантным,
тип `Producer` помечается как **ковариантный** (covariant) путем добавления к параметру типа префикса `+`.
Это допустимо, так как параметр типа используется только в качестве типа _возвращаемого_ значения.

Пометка типа как ковариантного означает, что мы можем передать (или вернуть) `Producer[Book]` там,
где ожидается `Producer[Buyable]`. И на самом деле, это разумно.
Тип `Producer[Buyable].make` только обещает _вернуть_ `Buyable`.
Но для пользователей `make`, так же допустимо принять `Book`, который является подтипом `Buyable`,
то есть это _по крайней мере_ `Buyable`.

Это иллюстрируется следующим примером, где функция `makeTwo` ожидает `Producer[Buyable]`:

{% tabs types-variance-5 %}
{% tab 'Scala 2 и 3' %}

```scala
def makeTwo(p: Producer[Buyable]): Int =
  p.make.price + p.make.price
```

{% endtab %}
{% endtabs %}

Допустимо передать в `makeTwo` производителя книг:

{% tabs types-variance-6 %}
{% tab 'Scala 2 и 3' %}

```scala
val bookProducer: Producer[Book] = ???
makeTwo(bookProducer)
```

{% endtab %}
{% endtabs %}

Вызов `price` в рамках `makeTwo` по-прежнему действителен и для `Book`.

#### Ковариантные типы для неизменяемых контейнеров

Ковариантность чаще всего встречается при работе с неизменяемыми контейнерами, такими как `List`, `Seq`, `Vector` и т.д.

Например, `List` и `Vector` определяются приблизительно так:

{% tabs types-variance-7 %}
{% tab 'Scala 2 и 3' %}

```scala
class List[+A] ...
class Vector[+A] ...
```

{% endtab %}
{% endtabs %}

Таким образом, можно использовать `List[Book]` там, где ожидается `List[Buyable]`.
Это также интуитивно имеет смысл: если ожидается коллекция вещей, которые можно купить,
то вполне допустимо получить коллекцию книг.
В примере выше у книг есть дополнительный метод `isbn`, но дополнительные возможности можно игнорировать.

### Контравариантные типы

В отличие от типа `Producer`, который помечен как ковариантный,
тип `Consumer` помечен как **контравариантный** (contravariant) путем добавления к параметру типа префикса `-`.
Это допустимо, так как параметр типа используется только _в позиции аргумента_.

Пометка его как контравариантного означает, что можно передать (или вернуть) `Consumer[Item]` там,
где ожидается `Consumer[Buyable]`.
То есть у нас есть отношение подтипа `Consumer[Item] <: Consumer[Buyable]`.
Помните, что для типа `Producer` все было наоборот, и у нас был `Producer[Buyable] <: Producer[Item]`.

И в самом деле, это разумно. Метод `Consumer[Item].take` принимает `Item`.
Как вызывающий `take`, мы также можем предоставить `Buyable`, который будет с радостью принят `Consumer[Item]`,
поскольку `Buyable` — это подтип `Item`, то есть, _по крайней мере_, `Item`.

#### Контравариантные типы для потребителей

Контравариантные типы встречаются гораздо реже, чем ковариантные типы.
Как и в нашем примере, вы можете думать о них как о «потребителях».
Наиболее важным типом, помеченным как контравариантный, с которым можно столкнуться, является тип функций:

{% tabs types-variance-8 class=tabs-scala-version %}
{% tab 'Scala 2' for=types-variance-8 %}

```scala
trait Function[-A, +B] {
  def apply(a: A): B
}
```

{% endtab %}

{% tab 'Scala 3' for=types-variance-8 %}

```scala
trait Function[-A, +B]:
  def apply(a: A): B
```

{% endtab %}
{% endtabs %}

Тип аргумента `A` помечен как контравариантный `A` — он использует значения типа `A`.
Тип результата `B`, напротив, помечен как ковариантный — он создает значения типа `B`.

Вот несколько примеров, иллюстрирующих отношения подтипов, вызванные аннотациями вариантности функций:

{% tabs types-variance-9 %}
{% tab 'Scala 2 и 3' %}

```scala
val f: Function[Buyable, Buyable] = b => b

// OK - допустимо вернуть Buyable там, где ожидается Item
val g: Function[Buyable, Item] = f

// OK - допустимо передать аргумент Book туда, где ожидается Buyable
val h: Function[Book, Buyable] = f
```

{% endtab %}
{% endtabs %}

## Резюме

В этом разделе были рассмотрены три различных вида вариантности:

- **Producers** обычно ковариантны и помечают свой параметр типа со знаком `+`.
  Это справедливо и для неизменяемых коллекций.
- **Consumers** обычно контравариантны и помечают свой параметр типа со знаком `-`.
- Типы, которые являются **одновременно** производителями и потребителями,
  должны быть инвариантными и не требуют какой-либо маркировки для параметра своего типа.
  В эту категорию, в частности, попадают изменяемые коллекции, такие как `Array`.
