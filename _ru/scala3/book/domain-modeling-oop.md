---
layout: multipage-overview
title: Моделирование ООП
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе представлено введение в моделирование предметной области с использованием ООП в Scala 3.
language: ru
num: 22
previous-page: domain-modeling-tools
next-page: domain-modeling-fp
---

В этой главе представлено введение в моделирование предметной области с использованием
объектно-ориентированного программирования (ООП) в Scala 3.

## Введение

Scala предоставляет все необходимые инструменты для объектно-ориентированного проектирования:

- **Traits** позволяют указывать (абстрактные) интерфейсы, а также конкретные реализации.
- **Mixin Composition** предоставляет инструменты для создания компонентов из более мелких деталей.
- **Классы** могут реализовывать интерфейсы, заданные трейтами.
- **Экземпляры** классов могут иметь свое собственное приватное состояние.
- **Subtyping** позволяет использовать экземпляр одного класса там, где ожидается экземпляр его суперкласса.
- **Модификаторы доступа** позволяют управлять, к каким членам класса можно получить доступ с помощью какой части кода.

## Трейты

В отличие от других языков с поддержкой ООП, таких как Java, возможно,
основным инструментом декомпозиции в Scala являются не классы, а трейты. 
Они могут служить для описания абстрактных интерфейсов, таких как:

{% tabs traits_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Showable {
  def show: String
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Showable:
  def show: String
```
{% endtab %}
{% endtabs %}

а также могут содержать конкретные реализации:

{% tabs traits_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Showable {
  def show: String
  def showHtml = "<p>" + show + "</p>"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Showable:
  def show: String
  def showHtml = "<p>" + show + "</p>"
```
{% endtab %}
{% endtabs %}

На примере видно, что метод `showHtml` определяется в терминах абстрактного метода `show`.

[Odersky и Zenger][scalable] представляют _сервис-ориентированную компонентную модель_ и рассматривают:

- **абстрактные члены** как _требуемые_ службы: их все еще необходимо реализовать в подклассе.
- **конкретные члены** как _предоставляемые_ услуги: они предоставляются подклассу.

Это видно на примере со `Showable`: определяя класс `Document`, который расширяет `Showable`, 
все еще нужно определить `show`, но `showHtml` уже предоставляется:

{% tabs traits_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Document(text: String) extends Showable {
  def show = text
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Document(text: String) extends Showable:
  def show = text
```

{% endtab %}
{% endtabs %}

#### Абстрактные члены

Абстрактными в `trait` могут оставаться не только методы. 
`trait` может содержать:

- абстрактные методы (`def m(): T`)
- абстрактные переменные (`val x: T`)
- абстрактные типы (`type T`), потенциально с ограничениями (`type T <: S`)
- абстрактные given (`given t: T`) <span class="tag tag-inline">только в Scala 3</span>

Каждая из вышеперечисленных функций может быть использована для определения той или иной формы требований к реализатору `trait`.

## Смешанная композиция

Кроме того, что `trait`-ы могут содержать абстрактные и конкретные определения, 
Scala также предоставляет мощный способ создания нескольких `trait`: 
структура, которую часто называют _смешанной композицией_.

Предположим, что существуют следующие два (потенциально независимо определенные) `trait`-а:

{% tabs traits_4 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait GreetingService {
  def translate(text: String): String
  def sayHello = translate("Hello")
}

trait TranslationService {
  def translate(text: String): String = "..."
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait GreetingService:
  def translate(text: String): String
  def sayHello = translate("Hello")

trait TranslationService:
  def translate(text: String): String = "..."
```

{% endtab %}
{% endtabs %}

Чтобы скомпоновать два сервиса, можно просто создать новый `trait`, расширяющий их:

{% tabs traits_5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait ComposedService extends GreetingService with TranslationService
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait ComposedService extends GreetingService, TranslationService
```

{% endtab %}
{% endtabs %}

Абстрактные элементы в одном `trait`-е (например, `translate` в `GreetingService`) 
автоматически сопоставляются с конкретными элементами в другом `trait`-е. 
Это работает не только с методами, как в этом примере, но и со всеми другими абстрактными членами, 
упомянутыми выше (то есть типами, переменными и т.д.).

## Классы

`trait`-ы отлично подходят для модуляции компонентов и описания интерфейсов (обязательных и предоставляемых). 
Но в какой-то момент возникнет необходимость создавать их экземпляры. 
При разработке программного обеспечения в Scala часто бывает полезно рассмотреть возможность 
использования классов только на начальных этапах модели наследования:

{% tabs table-traits-cls-summary class=tabs-scala-version %}
{% tab 'Scala 2' %}
| Трейты           | `T1`, `T2`, `T3`
| Составные трейты | `S1 extends T1 with T2`, `S2 extends T2 with T3`
| Классы           | `C extends S1 with T3`
| Экземпляры       | `new C()`
{% endtab %}
{% tab 'Scala 3' %}
| Трейты           | `T1`, `T2`, `T3`
| Составные трейты | `S1 extends T1, T2`, `S2 extends T2, T3`
| Классы           | `C extends S1, T3`
| Экземпляры       | `C()`
{% endtab %}
{% endtabs %}

Это еще более актуально в Scala 3, где трейты теперь также могут принимать параметры конструктора, 
что еще больше устраняет необходимость в классах.

#### Определение класса

Подобно `trait`-ам, классы могут расширять несколько `trait`-ов (но только один суперкласс):

{% tabs class_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class MyService(name: String) extends ComposedService with Showable {
  def show = s"$name says $sayHello"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class MyService(name: String) extends ComposedService, Showable:
  def show = s"$name says $sayHello"
```

{% endtab %}
{% endtabs %}

#### Подтипы

Экземпляр `MyService` создается следующим образом:

{% tabs class_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val s1: MyService = new MyService("Service 1")
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val s1: MyService = MyService("Service 1")
```

{% endtab %}
{% endtabs %}

С помощью подтипов экземпляр `s1` можно использовать везде, где ожидается любое из расширенных свойств:

{% tabs class_3 %}
{% tab 'Scala 2 и 3' %}

```scala
val s2: GreetingService = s1
val s3: TranslationService = s1
val s4: Showable = s1
// ... и так далее ...
```
{% endtab %}
{% endtabs %}

#### Планирование расширения

Как упоминалось ранее, можно расширить еще один класс:

{% tabs class_4 %}
{% tab 'Scala 2 и 3' %}

```scala
class Person(name: String)
class SoftwareDeveloper(name: String, favoriteLang: String)
  extends Person(name)
```

{% endtab %}
{% endtabs %}

Однако, поскольку `trait`-ы разработаны как основное средство декомпозиции,
то не рекомендуется расширять класс, определенный в одном файле, из другого файла.

<h5>Открытые классы <span class="tag tag-inline">только в Scala 3</span></h5>

В Scala 3 расширение неабстрактных классов в других файлах ограничено. 
Чтобы разрешить это, базовый класс должен быть помечен как `open`:

{% tabs class_5 %}
{% tab 'Только в Scala 3' %}

```scala
open class Person(name: String)
```
{% endtab %}
{% endtabs %}

Маркировка классов с помощью [`open`][open] - это новая функция Scala 3. 
Необходимость явно помечать классы как открытые позволяет избежать многих распространенных ошибок в ООП. 
В частности, это требует, чтобы разработчики библиотек явно планировали расширение 
и, например, документировали классы, помеченные как открытые.

## Экземпляры и приватное изменяемое состояние

Как и в других языках с поддержкой ООП, трейты и классы в Scala могут определять изменяемые поля:

{% tabs instance_6 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Counter {
  // получить значение можно только с помощью метода `count`
  private var currentCount = 0

  def tick(): Unit = currentCount += 1
  def count: Int = currentCount
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Counter:
  // получить значение можно только с помощью метода `count`
  private var currentCount = 0

  def tick(): Unit = currentCount += 1
  def count: Int = currentCount
```

{% endtab %}
{% endtabs %}

Каждый экземпляр класса `Counter` имеет собственное приватное состояние, 
которое можно получить только через метод `count`, как показано в следующем взаимодействии:

{% tabs instance_7 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val c1 = new Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val c1 = Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

{% endtab %}
{% endtabs %}

#### Модификаторы доступа

По умолчанию все определения элементов в Scala общедоступны. 
Чтобы скрыть детали реализации, можно определить элементы (методы, поля, типы и т.д.) в качестве `private` или `protected`. 
Таким образом, вы можете управлять доступом к ним или их переопределением. 
Закрытые (`private`) элементы видны только самому классу/трейту и его сопутствующему объекту. 
Защищенные (`protected`) элементы также видны для подклассов класса.

## Дополнительный пример: сервис-ориентированный дизайн

Далее будут проиллюстрированы некоторые расширенные возможности Scala и показано, 
как их можно использовать для структурирования более крупных программных компонентов. 
Примеры взяты из статьи Мартина Одерски и Маттиаса Зенгера ["Scalable Component Abstractions"][scalable]. 
Пример в первую очередь предназначен для демонстрации того, 
как использовать несколько функций типа для создания более крупных компонентов.

Цель состоит в том, чтобы определить программный компонент с семейством типов, 
которые могут быть уточнены позже при реализации компонента. 
Конкретно, следующий код определяет компонент `SubjectObserver` как `trait` с двумя членами абстрактного типа, 
`S` (для субъектов) и `O` (для наблюдателей):

{% tabs example_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait SubjectObserver {

  type S <: Subject
  type O <: Observer

  trait Subject { self: S =>
    private var observers: List[O] = List()
    def subscribe(obs: O): Unit = {
      observers = obs :: observers
    }
    def publish() = {
      for ( obs <- observers ) obs.notify(this)
    }
  }

  trait Observer {
    def notify(sub: S): Unit
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait SubjectObserver:

  type S <: Subject
  type O <: Observer

  trait Subject:
    self: S =>
      private var observers: List[O] = List()
      def subscribe(obs: O): Unit =
        observers = obs :: observers
      def publish() =
        for obs <- observers do obs.notify(this)

  trait Observer:
    def notify(sub: S): Unit
```

{% endtab %}
{% endtabs %}

Есть несколько вещей, которые нуждаются в объяснении.

#### Члены абстрактного типа

Тип объявления `S <: Subject` говорит, что внутри trait `SubjectObserver` можно ссылаться на 
некоторый _неизвестный_ (то есть абстрактный) тип, который называется `S`. 
Однако этот тип не является полностью неизвестным: мы знаем, по крайней мере, что это какой-то подтип `Subject`. 
Все trait-ы и классы, расширяющие `SubjectObserver`, могут свободно выбирать любой тип для `S`, 
если выбранный тип является подтипом `Subject`. 
Часть `<: Subject` декларации также упоминается как верхняя граница на `S`.

#### Вложенные trait-ы

_В рамках_ trait-а `SubjectObserver` определяются два других trait-а. 
trait `Observer`, который определяет только один абстрактный метод `notify` с одним аргументом типа `S`. 
Как будет видно, важно, чтобы аргумент имел тип `S`, а не тип `Subject`.

Второй trait, `Subject`, определяет одно приватное поле `observers` для хранения всех наблюдателей, 
подписавшихся на этот конкретный объект. Подписка на объект просто сохраняет объект в списке. 
Опять же, тип параметра `obs` - это `O`, а не `Observer`.

#### Аннотации собственного типа

Наконец, что означает `self: S =>` в trait-е `Subject`? Это называется аннотацией собственного типа. 
И требует, чтобы подтипы `Subject` также были подтипами `S`. 
Это необходимо, чтобы иметь возможность вызывать `obs.notify` с `this` в качестве аргумента, 
поскольку для этого требуется значение типа `S`. 
Если бы `S` был конкретным типом, аннотацию собственного типа можно было бы заменить на `trait Subject extends S`.

### Реализация компонента

Теперь можно реализовать вышеуказанный компонент и определить члены абстрактного типа как конкретные типы:

{% tabs example_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object SensorReader extends SubjectObserver {
  type S = Sensor
  type O = Display

  class Sensor(val label: String) extends Subject {
    private var currentValue = 0.0
    def value = currentValue
    def changeValue(v: Double) = {
      currentValue = v
      publish()
    }
  }

  class Display extends Observer {
    def notify(sub: Sensor) =
      println(s"${sub.label} has value ${sub.value}")
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
object SensorReader extends SubjectObserver:
  type S = Sensor
  type O = Display

  class Sensor(val label: String) extends Subject:
    private var currentValue = 0.0
    def value = currentValue
    def changeValue(v: Double) =
      currentValue = v
      publish()

  class Display extends Observer:
    def notify(sub: Sensor) =
      println(s"${sub.label} has value ${sub.value}")
```

{% endtab %}
{% endtabs %}

В частности, мы определяем _singleton_ `object SensorReader`, который расширяет `SubjectObserver`. 
В реализации `SensorReader` говорится, что тип `S` теперь определяется как тип `Sensor`, 
а тип `O` определяется как тип `Display`. 
И `Sensor`, и `Display` определяются как вложенные классы в `SensorReader`, 
реализующие trait-ы `Subject` и `Observer` соответственно.

Помимо того, что этот код является примером сервис-ориентированного дизайна, 
он также освещает многие аспекты объектно-ориентированного программирования:

- Класс `Sensor` вводит свое собственное частное состояние (`currentValue`) 
  и инкапсулирует изменение состояния за методом `changeValue`.
- Реализация `changeValue` использует метод `publish`, определенный в родительском trait-е.
- Класс `Display` расширяет trait `Observer` и реализует отсутствующий метод `notify`.

Важно отметить, что реализация `notify` может безопасно получить доступ только к `label` и значению `sub`, 
поскольку мы изначально объявили параметр типа `S`.

### Использование компонента

Наконец, следующий код иллюстрирует, как использовать компонент `SensorReader`:

{% tabs example_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import SensorReader._

// настройка сети
val s1 = new Sensor("sensor1")
val s2 = new Sensor("sensor2")
val d1 = new Display()
val d2 = new Display()
s1.subscribe(d1)
s1.subscribe(d2)
s2.subscribe(d1)

// распространение обновлений по сети
s1.changeValue(2)
s2.changeValue(3)

// печатает:
// sensor1 has value 2.0
// sensor1 has value 2.0
// sensor2 has value 3.0

```

{% endtab %}

{% tab 'Scala 3' %}

```scala
import SensorReader.*

// настройка сети
val s1 = Sensor("sensor1")
val s2 = Sensor("sensor2")
val d1 = Display()
val d2 = Display()
s1.subscribe(d1)
s1.subscribe(d2)
s2.subscribe(d1)

// распространение обновлений по сети
s1.changeValue(2)
s2.changeValue(3)

// печатает:
// sensor1 has value 2.0
// sensor1 has value 2.0
// sensor2 has value 3.0
```

{% endtab %}
{% endtabs %}

Имея под рукой все утилиты объектно-ориентированного программирования, в следующем разделе будет продемонстрировано, 
как разрабатывать программы в функциональном стиле.

[scalable]: https://doi.org/10.1145/1094811.1094815
[open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
