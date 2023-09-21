---
layout: tour
title: Объекты Пакета
partof: scala-tour
num: 36
language: ru
previous-page: packages-and-imports
---

Часто бывает удобно иметь определения, доступные для всего пакета,
когда не нужно придумывать имя для оболочки `object`, которая их содержит.

{% tabs pkg-obj-vs-top-lvl_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_1 %}

Scala 2 предоставляет _объекты пакета_ (_package objects_) в виде удобного контейнера, общего для всего пакета.

Объекты пакета могут содержать произвольные виды выражений, а не только переменные и методы.
Например, они часто используются для хранения псевдонимов типа и наборов неявных преобразований доступных всему пакету.
Объекты пакета могут также наследоваться от классов и трейтов Scala.

> В будущей версии Scala 3 объекты пакета будут удалены в пользу определений верхнего уровня.

По соглашению, исходный код объекта пакета обычно помещается в файл под названием `package.scala`.

Каждому пакету разрешено иметь один объект пакета.
Любые выражения, содержащиеся в объекте пакета, считаются членами самого пакета.

{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_1 %}

В Scala 3 любое определение может быть объявлено на верхнем уровне пакета.
Например, классы, перечисления, методы и переменные.

Любые определения, размещенные на верхнем уровне пакета, считаются членами самого пакета.

> В Scala 2 верхнеуровневый метод, определения типов и переменных должны были быть заключены в **объект пакета**.
> Их все еще можно использовать в Scala 3 для обратной совместимости.
> Вы можете увидеть, как они работают, переключая вкладки.

{% endtab %}
{% endtabs %}

См. пример ниже. Предположим, есть старший класс `Fruit` и три наследуемых от него объекта `Fruit` в пакете.

`gardening.fruits`:

{% tabs pkg-obj-vs-top-lvl_2 %}
{% tab 'Scala 2 и 3' for=pkg-obj-vs-top-lvl_2 %}

```
// в файле gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

{% endtab %}
{% endtabs %}

Теперь предположим, что мы хотим поместить переменную `planted` и метод `showFruit` непосредственно в пакет `gardening`.
Вот как это делается:

{% tabs pkg-obj-vs-top-lvl_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_3 %}

```
// в файле gardening/fruits/package.scala
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_3 %}

```
// в файле gardening/fruits/package.scala
package gardening.fruits

val planted = List(Apple, Plum, Banana)
def showFruit(fruit: Fruit): Unit =
  println(s"${fruit.name}s are ${fruit.color}")
```

{% endtab %}
{% endtabs %}

Для примера, следующий объект `PrintPlanted` импортирует `planted` и `showFruit` точно так же, как с вариантом импорта класса `Fruit`,
используя групповой стиль импорта пакета `gardening.fruits`:

{% tabs pkg-obj-vs-top-lvl_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_4 %}

```
// в файле PrintPlanted.scala
import gardening.fruits._

object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_4 %}

```
// в файле PrintPlanted.scala
import gardening.fruits.*

@main def printPlanted(): Unit =
  for fruit <- planted do
    showFruit(fruit)
```

{% endtab %}
{% endtabs %}

### Объединение нескольких определений на уровне пакета

Часто в вашем проекте может быть несколько повторно используемых определений,
заданных в различных модулях, которые вы хотите агрегировать на верхнем уровне пакета.

Например, некоторые вспомогательные методы в трейте `FruitHelpers`
и некоторые псевдонимы терминов/типов в свойстве `FruitAliases`.
Вот как вы можете разместить все их определения на уровне пакета `fruit`:

{% tabs pkg-obj-vs-top-lvl_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=pkg-obj-vs-top-lvl_5 %}

Объекты пакета ведут себя также, как и любые другие объекты.
Это означает, что вы можете использовать наследование, при этом сразу нескольких трейтов:

```
package gardening

// `fruits` наследует свои элементы от родителей.
package object fruits extends FruitAliases with FruitHelpers
```

{% endtab %}
{% tab 'Scala 3' for=pkg-obj-vs-top-lvl_5 %}

В Scala 3 предпочтительно использовать `export` для объединения членов из нескольких объектов в единую область видимости.
Здесь мы определяем приватные объекты, которые смешиваются с вспомогательными трейтами,
а затем экспортируют их элементы на верхнем уровне:

```
package gardening.fruits

private object FruitAliases extends FruitAliases
private object FruitHelpers extends FruitHelpers

export FruitHelpers.*, FruitAliases.*
```

{% endtab %}
{% endtabs %}
