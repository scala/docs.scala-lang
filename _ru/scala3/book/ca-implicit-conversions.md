---
layout: multipage-overview
title: Неявное преобразование типов
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице демонстрируется, как реализовать неявное преобразование типов в Scala 3.
language: ru
num: 66
previous-page: ca-multiversal-equality
next-page: ca-summary
---

Неявные преобразования — это мощная функция Scala, позволяющая пользователям предоставлять аргумент одного типа,
как если бы он был другого типа, чтобы избежать шаблонного преобразования.

> Обратите внимание, что в Scala 2 неявные преобразования также использовались для предоставления дополнительных членов
> запечатанным классам (см. [Неявные классы]({% link _overviews/core/implicit-classes.md %})).
> В Scala 3 мы рекомендуем использовать эту функциональность, определяя методы расширения вместо неявных преобразований
> (хотя стандартная библиотека по-прежнему полагается на неявные преобразования по историческим причинам).

## Пример

Рассмотрим, например, метод `findUserById`, принимающий параметр типа `Long`:

{% tabs implicit-conversions-1 %}
{% tab 'Scala 2 и 3' %}

```scala
def findUserById(id: Long): Option[User]
```

{% endtab %}
{% endtabs %}

Для краткости опустим определение типа `User` - это не имеет значения для нашего примера.

В Scala есть возможность вызвать метод `findUserById` с аргументом типа `Int` вместо ожидаемого типа `Long`,
потому что аргумент будет неявно преобразован в тип `Long`:

{% tabs implicit-conversions-2 %}
{% tab 'Scala 2 и 3' %}

```scala
val id: Int = 42
findUserById(id) // OK
```

{% endtab %}
{% endtabs %}

Этот код не упадет с ошибкой компиляции “type mismatch: expected `Long`, found `Int`”,
потому что есть неявное преобразование, которое преобразует аргумент `id` в значение типа `Long`.

## Детальное объяснение

В этом разделе описывается, как определять и использовать неявные преобразования.

### Определение неявного преобразования

{% tabs implicit-conversions-3 class=tabs-scala-version %}

{% tab 'Scala 2' %}

В Scala 2 неявное преобразование из типа `S` в тип `T` определяется [неявным классом]({% link _overviews/core/implicit-classes.md %}) `T`,
который принимает один параметр конструктора типа `S`, [неявное значение]({% link _overviews/scala3-book/ca-context-parameters.md %})
типа функции `S => T` или неявный метод, преобразуемый в значение этого типа.

Например, следующий код определяет неявное преобразование из `Int` в `Long`:

```scala
import scala.language.implicitConversions

implicit def int2long(x: Int): Long = x.toLong
```

Это неявный метод, преобразуемый в значение типа `Int => Long`.

См. раздел "Остерегайтесь силы неявных преобразований" ниже для объяснения пункта `import scala.language.implicitConversions` в начале.
{% endtab %}

{% tab 'Scala 3' %}
В Scala 3 неявное преобразование типа `S` в тип `T` определяется [`given` экземпляром]({% link _overviews/scala3-book/ca-context-parameters.md %})
типа `scala.Conversion[S, T]`.
Для совместимости со Scala 2 его также можно определить неявным методом (подробнее читайте во вкладке Scala 2).

Например, этот код определяет неявное преобразование из `Int` в `Long`:

```scala
given int2long: Conversion[Int, Long] with
  def apply(x: Int): Long = x.toLong
```

Как и другие given определения, неявные преобразования могут быть анонимными:

```scala
given Conversion[Int, Long] with
  def apply(x: Int): Long = x.toLong
```

Используя псевдоним, это можно выразить более кратко:

```scala
given Conversion[Int, Long] = (x: Int) => x.toLong
```

{% endtab %}

{% endtabs %}

### Использование неявного преобразования

Неявные преобразования применяются в двух случаях:

1. Если выражение `e` имеет тип `S` и `S` не соответствует ожидаемому типу выражения `T`.
2. В выборе `e.m` с `e` типа `S`, где `S` не определяет `m`
   (для поддержки [методов расширения][extension methods] в стиле Scala-2).

В первом случае ищется конверсия `c`, применимая к `e` и тип результата которой соответствует `T`.

В примере выше, когда мы передаем аргумент `id` типа `Int` в метод `findUserById`,
вставляется неявное преобразование `int2long(id)`.

Во втором случае ищется преобразование `c`, применимое к `e` и результат которого содержит элемент с именем `m`.

Примером является сравнение двух строк `"foo" < "bar"`.
В этом случае `String` не имеет члена `<`, поэтому вставляется неявное преобразование `Predef.augmentString("foo") < "bar"`
(`scala.Predef` автоматически импортируется во все программы Scala.).

### Как неявные преобразования становятся доступными?

Когда компилятор ищет подходящие преобразования:

- во-первых, он смотрит в текущую лексическую область
  - неявные преобразования, определенные в текущей области или во внешних областях
  - импортированные неявные преобразования
  - неявные преобразования, импортированные с помощью импорта подстановочных знаков (только в Scala 2)
- затем он просматривает [сопутствующие объекты][companion objects], _связанные_ с типом аргумента `S` или ожидаемым типом `T`.
  Сопутствующие объекты, связанные с типом `X`:
  - сам объект-компаньон `X`
  - сопутствующие объекты, связанные с любым из унаследованных типов `X`
  - сопутствующие объекты, связанные с любым аргументом типа в `X`
  - если `X` - это внутренний класс, внешние объекты, в которые он встроен

Например, рассмотрим неявное преобразование `fromStringToUser`, определенное в объекте `Conversions`:

{% tabs implicit-conversions-4 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import scala.language.implicitConversions

object Conversions {
  implicit def fromStringToUser(name: String): User = (name: String) => User(name)
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
object Conversions:
  given fromStringToUser: Conversion[String, User] = (name: String) => User(name)
```

{% endtab %}
{% endtabs %}

Следующие операции импорта эквивалентно передают преобразование в область действия:

{% tabs implicit-conversions-5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import Conversions.fromStringToUser
// или
import Conversions._
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
import Conversions.fromStringToUser
// или
import Conversions.given
// или
import Conversions.{given Conversion[String, User]}
```

Обратите внимание, что в Scala 3 импорт с подстановочными знаками (т.е. `import Conversions.*`)
не импортирует given определения.

{% endtab %}
{% endtabs %}

Во вводном примере преобразование из `Int` в `Long` не требует импорта, поскольку оно определено в объекте `Int`,
который является сопутствующим объектом типа `Int`.

Дополнительная литература:
[Где Scala ищет неявные значения? (в Stackoverflow)](https://stackoverflow.com/a/5598107).

### Остерегайтесь силы неявных преобразований

{% tabs implicit-conversions-6 class=tabs-scala-version %}
{% tab 'Scala 2' %}

Поскольку неявные преобразования могут иметь подводные камни, если используются без разбора,
компилятор предупреждает при компиляции определения неявного преобразования.

Чтобы отключить предупреждения, выполните одно из следующих действий:

- Импорт `scala.language.implicitConversions` в область определения неявного преобразования
- Вызвать компилятор с командой `-language:implicitConversions`

Предупреждение не выдается, когда компилятор применяет преобразование.
{% endtab %}
{% tab 'Scala 3' %}
Поскольку неявные преобразования могут иметь подводные камни, если они используются без разбора,
компилятор выдает предупреждение в двух случаях:

- при компиляции определения неявного преобразования в стиле Scala 2.
- на стороне вызова, где given экземпляр `scala.Conversion` вставляется как конверсия.

Чтобы отключить предупреждения, выполните одно из следующих действий:

- Импортировать `scala.language.implicitConversions` в область:
  - определения неявного преобразования в стиле Scala 2
  - стороны вызова, где given экземпляр `scala.Conversion` вставляется как конверсия.
- Вызвать компилятор с командой `-language:implicitConversions`
  {% endtab %}
  {% endtabs %}

[extension methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[companion objects]: {% link _overviews/scala3-book/domain-modeling-tools.md %}#companion-objects
