---
layout: tour
title: Объекты Пакета

discourse: true

partof: scala-tour

num: 36
language: ru
previous-page: packages-and-imports
---

# Объекты Пакета

У каждого пакета может существовать связанный с этим пакетом объект (package object), общий для всех членов пакета. Такой объект может быть только один. Любые выражения, содержащиеся в объекте пакета, считаются членами самого пакета.

Объекты пакета могут содержать произвольные виды выражений, а не только переменные и методы. Например, они часто используются для хранения псевдонимов типа и наборов неявных преобразований доступных всему пакету. Объекты пакета могут также наследоваться от классов и трейтов Scala.

По соглашению, исходный код объекта пакета обычно помещается в файл под названием `package.scala`.

См. пример ниже. Предположим, есть старший класс `Fruit` и три наследуемых от него объекта `Fruit` в пакете.

`gardening.fruits`:

```
// в файле gardening/fruits/Fruit.scala
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

Теперь предположим, что мы хотим поместить переменную `planted` и метод `showFruit` непосредственно в пакет `gardening`.
Вот как это делается:

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

Для примера, следующий объект `PrintPlanted` импортирует `planted` и `showFruit` точно так же, как с вариантом импорта класса `Fruit`, используя групповой стиль импорта пакета gardening.fruits:

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

Объекты пакета ведут себя также, как и любые другие объекты. Это означает, что вы можете использовать наследование, при этом сразу нескольких трейтов:

```
package object fruits extends FruitAliases with FruitHelpers {
  // здесь располагаются вспомогательные классы и переменные
}
```
