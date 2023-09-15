---
layout: multipage-overview
title: Моделирование ФП
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе представлено введение в моделирование предметной области с использованием ФП в Scala 3.
language: ru
num: 23
previous-page: domain-modeling-oop
next-page: methods-intro
---


В этой главе представлено введение в моделирование предметной области 
с использованием функционального программирования (ФП) в Scala 3.
При моделировании окружающего нас мира с помощью ФП обычно используются следующие конструкции Scala:

- Перечисления
- Case классы
- Trait-ы

> Если вы не знакомы с алгебраическими типами данных (ADT) и их обобщенной версией (GADT), 
> то можете прочитать главу ["Алгебраические типы данных"][adts], прежде чем читать этот раздел.

## Введение

В ФП *данные* и *операции над этими данными* — это две разные вещи; вы не обязаны инкапсулировать их вместе, как в ООП.

Концепция аналогична числовой алгебре. 
Когда вы думаете о целых числах, больших либо равных нулю, 
у вас есть *набор* возможных значений, который выглядит следующим образом:

````
0, 1, 2 ... Int.MaxValue
````

Игнорируя деление целых чисел, возможные *операции* над этими значениями такие:

````
+, -, *
````

Схема ФП реализуется аналогичным образом:

- описывается свой набор значений (данные)
- описываются операции, которые работают с этими значениями (функции)

> Как будет видно, рассуждения о программах в этом стиле сильно отличаются от объектно-ориентированного программирования. 
> Проще говоря о данных в ФП:
> Отделение функциональности от данных позволяет проверять свои данные, не беспокоясь о поведении.

В этой главе мы смоделируем данные и операции для “пиццы” в пиццерии. 
Будет показано, как реализовать часть “данных” модели Scala/ФП, 
а затем - несколько различных способов организации операций с этими данными.

## Моделирование данных

В Scala достаточно просто описать модель данных:

- если необходимо смоделировать данные с различными вариантами, то используется конструкция `enum` (или `case object` в Scala 2)
- если необходимо только сгруппировать сущности (или нужен более детальный контроль), то используются case class-ы

### Описание вариантов

Данные, которые просто состоят из различных вариантов, таких как размер корочки, тип корочки и начинка, 
кратко моделируются с помощью перечислений:

{% tabs data_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_1 %}

В Scala 2 перечисления выражаются комбинацией `sealed class` и нескольких `case object`, которые расширяют класс:

```scala
sealed abstract class CrustSize
object CrustSize {
  case object Small extends CrustSize
  case object Medium extends CrustSize
  case object Large extends CrustSize
}

sealed abstract class CrustType
object CrustType {
  case object Thin extends CrustType
  case object Thick extends CrustType
  case object Regular extends CrustType
}

sealed abstract class Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping
}
```

{% endtab %}
{% tab 'Scala 3' for=data_1 %}

В Scala 3 перечисления кратко выражаются конструкцией `enum`:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

{% endtab %}
{% endtabs %}

> Типы данных, которые описывают различные варианты (например, `CrustSize`), 
> также иногда называются суммированными типами (_sum types_).

### Описание основных данных

Пиццу можно рассматривать как _составной_ контейнер с различными атрибутами, указанными выше. 
Мы можем использовать `case class`, чтобы описать, 
что `Pizza` состоит из `crustSize`, `crustType` и, возможно, нескольких `toppings`:

{% tabs data_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_2 %}

```scala
import CrustSize._
import CrustType._
import Topping._

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

{% endtab %}
{% tab 'Scala 3' for=data_2 %}

```scala
import CrustSize.*
import CrustType.*
import Topping.*

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

{% endtab %}
{% endtabs %}

> Типы данных, объединяющие несколько компонентов (например, `Pizza`), также иногда называют типами продуктов (_product types_).

И все. Это модель данных для системы доставки пиццы в стиле ФП. 
Решение очень лаконично, поскольку оно не требует объединения модели данных с операциями с пиццей. 
Модель данных легко читается, как объявление дизайна для реляционной базы данных. 
Также очень легко создавать значения нашей модели данных и проверять их:

{% tabs data_3 %}
{% tab 'Scala 2 и 3' for=data_3 %}

```scala
val myFavPizza = Pizza(Small, Regular, Seq(Cheese, Pepperoni))
println(myFavPizza.crustType) // печатает Regular
```

{% endtab %}
{% endtabs %}

#### Подробнее о модели данных

Таким же образом можно было бы смоделировать всю систему заказа пиццы. 
Вот несколько других `case class`-ов, которые используются для моделирования такой системы:

{% tabs data_4 %}
{% tab 'Scala 2 и 3' for=data_4 %}

```scala
case class Address(
  street1: String,
  street2: Option[String],
  city: String,
  state: String,
  zipCode: String
)

case class Customer(
  name: String,
  phone: String,
  address: Address
)

case class Order(
  pizzas: Seq[Pizza],
  customer: Customer
)
```

{% endtab %}
{% endtabs %}

#### “Узкие доменные объекты”

В своей книге *Functional and Reactive Domain Modeling*, Debasish Ghosh утверждает, 
что там, где специалисты по ООП описывают свои классы как “широкие модели предметной области”, 
которые инкапсулируют данные и поведение, 
модели данных ФП можно рассматривать как “узкие объекты предметной области”. 
Это связано с тем, что, как показано выше, модели данных определяются как `case` классы с атрибутами, 
но без поведения, что приводит к коротким и лаконичным структурам данных.

## Моделирование операций

Возникает интересный вопрос: поскольку ФП отделяет данные от операций над этими данными, 
то как эти операции реализуются в Scala?

Ответ на самом деле довольно прост: пишутся функции (или методы), работающие со значениями смоделированных данных. 
Например, можно определить функцию, которая вычисляет цену пиццы.

{% tabs data_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match {
  case Pizza(crustSize, crustType, toppings) => {
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
  }
}
```

{% endtab %}

{% tab 'Scala 3' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match
  case Pizza(crustSize, crustType, toppings) =>
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
```

{% endtab %}
{% endtabs %}

Можно заметить, что реализация функции просто повторяет форму данных: поскольку `Pizza` является case class-ом, 
используется сопоставление с образцом для извлечения компонентов, 
а затем вызываются вспомогательные функции для вычисления отдельных цен.

{% tabs data_6 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match {
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
}
```

{% endtab %}

{% tab 'Scala 3' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
```

{% endtab %}
{% endtabs %}

Точно так же, поскольку `Topping` является перечислением, 
используется сопоставление с образцом, чтобы разделить варианты. 
Сыр и лук продаются по 50 центов за штуку, остальные — по 75.

{% tabs data_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match {
    // если размер корочки маленький или средний, тип не важен
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
  }
```

{% endtab %}

{% tab 'Scala 3' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match
    // если размер корочки маленький или средний, тип не важен
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
```

{% endtab %}
{% endtabs %}

Чтобы рассчитать цену корки, мы одновременно сопоставляем образцы как по размеру, так и по типу корки.

> Важным моментом во всех показанных выше функциях является то, что они являются чистыми функциями (_pure functions_): 
> они не изменяют данные и не имеют других побочных эффектов (таких, как выдача исключений или запись в файл). 
> Всё, что они делают - это просто получают значения и вычисляют результат.

## Как организовать функциональность?

При реализации функции `pizzaPrice`, описанной выше, не было сказано, _где_ ее определять.
Scala предоставляет множество отличных инструментов для организации логики в различных пространствах имен и модулях.

Существует несколько способов реализации и организации поведения:

- определить функции в сопутствующих объектах (companion object)
- использовать модульный стиль программирования
- использовать подход “функциональных объектов”
- определить функциональность в методах расширения

Эти различные решения показаны в оставшейся части этого раздела.

### Сопутствующий объект

Первый подход — определить поведение (функции) в сопутствующем объекте.

> Как обсуждалось в разделе [“Инструменты”][modeling-tools], 
> _сопутствующий объект_ — это `object` с тем же именем, что и у класса, и объявленный в том же файле, что и класс.

При таком подходе в дополнение к `enum` или `case class` также определяется сопутствующий объект с таким же именем, 
который содержит поведение (функции).

{% tabs org_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// сопутствующий объект для case class Pizza
object Pizza {
  // тоже самое, что и `pizzaPrice`
  def price(p: Pizza): Double = ...
}

sealed abstract class Topping

// сопутствующий объект для перечисления Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping

  // тоже самое, что и `toppingPrice`
  def price(t: Topping): Double = ...
}
```

{% endtab %}
{% tab 'Scala 3' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// сопутствующий объект для case class Pizza
object Pizza:
  // тоже самое, что и `pizzaPrice`
  def price(p: Pizza): Double = ...

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions

// сопутствующий объект для перечисления Topping
object Topping:
  // тоже самое, что и `toppingPrice`
  def price(t: Topping): Double = ...
```

{% endtab %}
{% endtabs %}

При таком подходе можно создать `Pizza` и вычислить ее цену следующим образом:

{% tabs org_2 %}
{% tab 'Scala 2 и 3' for=org_2 %}

```scala
val pizza1 = Pizza(Small, Thin, Seq(Cheese, Onions))
Pizza.price(pizza1)
```

{% endtab %}
{% endtabs %}

Группировка функциональности с помощью сопутствующих объектов имеет несколько преимуществ:

- связывает функциональность с данными и облегчает их поиск программистам (и компилятору).
- создает пространство имен и, например, позволяет использовать `price` в качестве имени метода, не полагаясь на перегрузку.
- реализация `Topping.price` может получить доступ к значениям перечисления, таким как `Cheese`, без необходимости их импорта.

Однако также есть несколько компромиссов, которые следует учитывать:

- модель данных тесно связывается с функциональностью. 
  В частности, сопутствующий объект должен быть определен в том же файле, что и `case class`.
- неясно, где определять такие функции, как `crustPrice`, 
  которые с одинаковым успехом можно поместить в сопутствующий объект `CrustSize` или `CrustType`.

## Модули

Второй способ организации поведения — использование “модульного” подхода. 
В книге _“Программирование на Scala”_ _модуль_ определяется как 
“небольшая часть программы с четко определенным интерфейсом и скрытой реализацией”. 
Давайте посмотрим, что это значит.

### Создание интерфейса `PizzaService`

Первое, о чем следует подумать, — это “поведение” `Pizza`. 
Делая это, определяем `trait PizzaServiceInterface` следующим образом:

{% tabs module_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_1 %}

```scala
trait PizzaServiceInterface {

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
}
```

{% endtab %}

{% tab 'Scala 3' for=module_1 %}

```scala
trait PizzaServiceInterface:

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
```

{% endtab %}
{% endtabs %}

Как показано, каждый метод принимает `Pizza` в качестве входного параметра вместе с другими параметрами, 
а затем возвращает экземпляр `Pizza` в качестве результата.

Когда пишется такой чистый интерфейс, можно думать о нем как о контракте, 
в котором говорится: “Все неабстрактные классы, расширяющие этот trait, должны предоставлять реализацию этих сервисов”.

На этом этапе также можно представить, что вы являетесь потребителем этого API. 
Когда вы это сделаете, будет полезно набросать некоторый пример “потребительского” кода, 
чтобы убедиться, что API выглядит так, как хотелось:

{% tabs module_2 %}
{% tab 'Scala 2 и 3' for=module_2 %}

```scala
val p = Pizza(Small, Thin, Seq(Cheese))

// как вы хотите использовать методы в PizzaServiceInterface
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)
```

{% endtab %}
{% endtabs %}

Если с этим кодом все в порядке, как правило, можно начать набрасывать другой API, например API для заказов, 
но, поскольку сейчас рассматривается только `Pizza`, перейдем к созданию конкретной реализации этого интерфейса.

> Обратите внимание, что обычно это двухэтапный процесс. 
> На первом шаге набрасывается контракт API в качестве _интерфейса_. 
> На втором шаге создается конкретная _реализация_ этого интерфейса. 
> В некоторых случаях в конечном итоге создается несколько конкретных реализаций базового интерфейса.

### Создание конкретной реализации

Теперь, когда известно, как выглядит `PizzaServiceInterface`, можно создать конкретную реализацию, 
написав тело для всех методов, определенных в интерфейсе:

{% tabs module_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface {

  def price(p: Pizza): Double =
    ... // реализация была дана выше

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```

{% endtab %}

{% tab 'Scala 3' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface:

  def price(p: Pizza): Double =
    ... // реализация была дана выше

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)

end PizzaService
```

{% endtab %}
{% endtabs %}

Хотя двухэтапный процесс создания интерфейса с последующей реализацией не всегда необходим, 
явное продумывание API и его использования — хороший подход.

Когда все готово, можно использовать `Pizza` и `PizzaService`:

{% tabs module_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_4 %}

```scala
import PizzaService._

val p = Pizza(Small, Thin, Seq(Cheese))

// использование методов PizzaService
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // печатает 8.75
```

{% endtab %}

{% tab 'Scala 3' for=module_4 %}

```scala
import PizzaService.*

val p = Pizza(Small, Thin, Seq(Cheese))

// использование методов PizzaService
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // печатает 8.75
```

{% endtab %}
{% endtabs %}

### Функциональные объекты

В книге _“Программирование на Scala”_ авторы определяют термин “Функциональные объекты” как 
“объекты, которые не имеют никакого изменяемого состояния”. 
Это также относится к типам в `scala.collection.immutable`. 
Например, методы в `List` не изменяют внутреннего состояния, а вместо этого в результате создают копию `List`.

Об этом подходе можно думать, как о “гибридном дизайне ФП/ООП”, потому что:

- данные моделируются, используя неизменяемые `case` классы.
- определяется поведение (методы) _того же типа_, что и данные.
- поведение реализуется как чистые функции: они не изменяют никакого внутреннего состояния; скорее - возвращают копию.

> Это действительно гибридный подход: как и в **дизайне ООП**, методы инкапсулированы в класс с данными, 
> но, как это обычно бывает **в дизайне ФП**, методы реализованы как чистые функции, которые данные не изменяют.

#### Пример

Используя этот подход, можно напрямую реализовать функциональность пиццы в `case class`:

{% tabs module_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
) {

  // операции этой модели данных
  def price: Double =
    pizzaPrice(this) // такая же имплементация, как и выше

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
}
```

{% endtab %}

{% tab 'Scala 3' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
):

  // операции этой модели данных
  def price: Double =
    pizzaPrice(this) // такая же имплементация, как и выше

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
```

{% endtab %}
{% endtabs %}

Обратите внимание, что в отличие от предыдущих подходов, поскольку это методы класса `Pizza`, 
они не принимают ссылку `Pizza` в качестве входного параметра. 
Вместо этого у них есть собственная ссылка на текущий экземпляр пиццы - `this`.

Теперь можно использовать этот новый дизайн следующим образом:

{% tabs module_6 %}
{% tab 'Scala 2 и 3' for=module_6 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

### Методы расширения

Методы расширения - подход, который находится где-то между первым (определение функций в сопутствующем объекте) 
и последним (определение функций как методов самого типа).

Методы расширения позволяют создавать API, похожий на API функционального объекта, 
без необходимости определять функции как методы самого типа. 
Это может иметь несколько преимуществ:

- модель данных снова _очень лаконична_ и не упоминает никакого поведения.
- можно _задним числом_ развить функциональность типов дополнительными методами, не изменяя исходного определения.
- помимо сопутствующих объектов или прямых методов типов, методы расширения могут быть определены _извне_ в другом файле.

Вернемся к примеру:

{% tabs module_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

implicit class PizzaOps(p: Pizza) {
  def price: Double =
    pizzaPrice(p) // такая же имплементация, как и выше

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```
В приведенном выше коде мы определяем различные методы для пиццы как методы в _неявном классе_ (_implicit class_). 
С `implicit class PizzaOps(p: Pizza)` тогда, где бы `PizzaOps` ни был импортирован,
его методы будут доступны в экземплярах `Pizza`. 
Получатель в этом случае `p`.

{% endtab %}
{% tab 'Scala 3' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

extension (p: Pizza)
  def price: Double =
    pizzaPrice(p) // такая же имплементация, как и выше

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
```
В приведенном выше коде мы определяем различные методы для пиццы как _методы расширения_ (_extension methods_). 
С помощью `extension (p: Pizza)` мы говорим, что хотим сделать методы доступными для экземпляров `Pizza`. 
Получатель в этом случае `p`.

{% endtab %}
{% endtabs %}

Используя наши методы расширения, мы можем получить тот же API, что и раньше:

{% tabs module_8 %}
{% tab 'Scala 2 и 3' for=module_8 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

При этом методы расширения можно определить в любом другом модуле. 
Как правило, если вы являетесь разработчиком модели данных, то определяете свои методы расширения в сопутствующем объекте. 
Таким образом, они уже доступны всем пользователям. 
В противном случае методы расширения должны быть импортированы явно, чтобы их можно было использовать.

## Резюме функционального подхода

Определение модели данных в Scala/ФП, как правило, простое: 
моделируются варианты данных с помощью перечислений и составных данных с помощью `case` классов. 
Затем, чтобы смоделировать поведение, определяются функции, которые работают со значениями модели данных. 
Были рассмотрены разные способы организации функций:

- можно поместить методы в сопутствующие объекты
- можно использовать модульный стиль программирования, разделяющий интерфейс и реализацию
- можно использовать подход “функциональных объектов” и хранить методы в определенном типе данных
- можно использовать методы расширения, чтобы снабдить модель данных функциональностью

[adts]: {% link _overviews/scala3-book/types-adts-gadts.md %}
[modeling-tools]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
