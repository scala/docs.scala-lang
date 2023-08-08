---
layout: multipage-overview
title: Методы расширения
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе представлена работа методов расширения в Scala 3.
language: ru
num: 60
previous-page: ca-contextual-abstractions-intro
next-page: ca-context-parameters
versionSpecific: true
---

В Scala 2 аналогичного результата можно добиться с помощью [неявных классов]({% link _overviews/core/implicit-classes.md %}).

---

Методы расширения позволяют добавлять методы к типу после того, как он был определен,
т.е. они позволяют добавлять новые методы в закрытые классы.
Например, представьте, что кто-то создал класс `Circle`:

{% tabs ext1 %}
{% tab 'Scala 2 и 3' %}

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

{% endtab %}
{% endtabs %}

Теперь представим, что необходим метод `circumference`, но нет возможности изменить исходный код `Circle`.
До того как концепция вывода терминов была введена в языки программирования,
единственное, что можно было сделать, это написать метод в отдельном классе или объекте, подобном этому:

{% tabs ext2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object CircleHelpers {
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
object CircleHelpers:
  def circumference(c: Circle): Double = c.radius * math.Pi * 2
```

{% endtab %}
{% endtabs %}

Затем этот метод можно было использовать следующим образом:

{% tabs ext3 %}
{% tab 'Scala 2 и 3' %}

```scala
val aCircle = Circle(2, 3, 5)

// без использования метода расширения
CircleHelpers.circumference(aCircle)
```

{% endtab %}
{% endtabs %}

Но методы расширения позволяют создать метод `circumference` для работы с экземплярами `Circle`:

{% tabs ext4 %}
{% tab 'Только в Scala 3' %}

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
```

{% endtab %}
{% endtabs %}

В этом коде:

- `Circle` — это тип, к которому будет добавлен метод расширения `circumference`
- Синтаксис `c: Circle` позволяет ссылаться на переменную `c` в методах расширения

Затем в коде метод `circumference` можно использовать так же, как если бы он был изначально определен в классе `Circle`:

{% tabs ext5 %}
{% tab 'Только в Scala 3' %}

```scala
aCircle.circumference
```

{% endtab %}
{% endtabs %}

### Импорт методов расширения

Представим, что `circumference` определен в пакете `lib` - его можно импортировать с помощью

{% tabs ext6 %}
{% tab 'Только в Scala 3' %}

```scala
import lib.circumference

aCircle.circumference
```

{% endtab %}
{% endtabs %}

Если импорт отсутствует, то компилятор выводит подробное сообщение об ошибке, подсказывая возможный импорт, например так:

```text
value circumference is not a member of Circle, but could be made available as an extension method.

The following import might fix the problem:

   import lib.circumference
```

## Обсуждение

Ключевое слово `extension` объявляет о намерении определить один или несколько методов расширения для типа, заключенного в круглые скобки.
Чтобы определить для типа несколько методов расширения, используется следующий синтаксис:

{% tabs ext7 %}
{% tab 'Только в Scala 3' %}

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

{% endtab %}
{% endtabs %}
