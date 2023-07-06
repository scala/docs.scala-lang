---
layout: multipage-overview
title: Непрозрачные типы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены и демонстрируются непрозрачные типы в Scala 3.
language: ru
num: 55
previous-page: types-variance
next-page: types-structural
---

В Scala 3 _непрозрачные псевдонимы типов_ (_opaque type aliases_) обеспечивают абстракции типов без каких-либо **накладных расходов**.

## Накладные расходы на абстракцию

Предположим, что необходимо определить модуль,
предлагающий арифметические операции над числами, которые представлены их логарифмами.
Это может быть полезно для повышения точности, когда числовые значения очень большие или близкие к нулю.

Поскольку важно отличать "обычные" `Double` от чисел, хранящихся в виде их логарифмов, введем класс `Logarithm`:

```scala
class Logarithm(protected val underlying: Double):
  def toDouble: Double = math.exp(underlying)
  def + (that: Logarithm): Logarithm =
    // здесь используется метод apply сопутствующего объекта
    Logarithm(this.toDouble + that.toDouble)
  def * (that: Logarithm): Logarithm =
    new Logarithm(this.underlying + that.underlying)

object Logarithm:
  def apply(d: Double): Logarithm = new Logarithm(math.log(d))
```

Метод `apply` сопутствующего объекта позволяет создавать значения типа `Logarithm`,
которые можно использовать следующим образом:

```scala
val l2 = Logarithm(2.0)
val l3 = Logarithm(3.0)
println((l2 * l3).toDouble) // выводит 6.0
println((l2 + l3).toDouble) // выводит 4.999...
```

В то время как класс `Logarithm` предлагает хорошую абстракцию для значений `Double`,
которые хранятся в этой конкретной логарифмической форме,
это накладывает серьезные накладные расходы на производительность:
для каждой отдельной математической операции нужно извлекать значение `underlying`,
а затем снова обернуть его в новый экземпляр `Logarithm`.

## Модульные абстракции

Рассмотрим другой подход к реализации той же библиотеки.
На этот раз вместо того, чтобы определять `Logarithm` как класс, определяем его с помощью _псевдонима типа_.
Во-первых, зададим абстрактный интерфейс модуля:

```scala
trait Logarithms:

  type Logarithm

  // операции на Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm
  def mul(x: Logarithm, y: Logarithm): Logarithm

  // функции конвертации между Double и Logarithm
  def make(d: Double): Logarithm
  def extract(x: Logarithm): Double

  // методы расширения, для вызова `add` и `mul` в качестве "методов" на Logarithm
  extension (x: Logarithm)
    def toDouble: Double = extract(x)
    def + (y: Logarithm): Logarithm = add(x, y)
    def * (y: Logarithm): Logarithm = mul(x, y)
```

Теперь давайте реализуем этот абстрактный интерфейс, задав тип `Logarithm` равным `Double`:

```scala
object LogarithmsImpl extends Logarithms:

  type Logarithm = Double

  // операции на Logarithm
  def add(x: Logarithm, y: Logarithm): Logarithm = make(x.toDouble + y.toDouble)
  def mul(x: Logarithm, y: Logarithm): Logarithm = x + y

  // функции конвертации между Double и Logarithm
  def make(d: Double): Logarithm = math.log(d)
  def extract(x: Logarithm): Double = math.exp(x)
```

В рамках реализации `LogarithmsImpl` уравнение `Logarithm = Double` позволяет реализовать различные методы.

#### Дырявые абстракции

Однако эта абстракция немного "дырява".
Мы должны убедиться, что всегда программируем _только_ с абстрактным интерфейсом `Logarithms`
и никогда не используем `LogarithmsImpl` напрямую.
Прямое использование `LogarithmsImpl` сделало бы равенство `Logarithm = Double` видимым для пользователя,
который может случайно использовать `Double` там, где ожидается логарифмическое удвоение.
Например:

```scala
import LogarithmsImpl.*
val l: Logarithm = make(1.0)
val d: Double = l // проверка типов ДОЗВОЛЯЕТ равенство!
```

Необходимость разделения модуля на абстрактный интерфейс и реализацию может быть полезной,
но также требует больших усилий, чтобы просто скрыть детали реализации `Logarithm`.
Программирование с использованием абстрактного модуля `Logarithms` может быть очень утомительным
и часто требует использования дополнительных функций, таких как типы, зависящие от пути, как в следующем примере:

```scala
def someComputation(L: Logarithms)(init: L.Logarithm): L.Logarithm = ...
```

#### Накладные расходы упаковки/распаковки

Абстракции типов, такие как `type Logarithm`, [стираются](https://www.scala-lang.org/files/archive/spec/2.13/03-types.html#type-erasure)
в соответствии с их привязкой (`Any` - в нашем случае).
То есть, хотя нам не нужно вручную переносить и разворачивать значение `Double`,
все равно будут некоторые накладные расходы, связанные с упаковкой примитивного типа `Double`.

## Непрозрачные типы

Вместо того чтобы вручную разбивать компонент `Logarithms` на абстрактную часть и на конкретную реализацию,
можно просто использовать opaque типы для достижения аналогичного эффекта:

```scala
object Logarithms:
//vvvvvv это важное различие!
  opaque type Logarithm = Double

  object Logarithm:
    def apply(d: Double): Logarithm = math.log(d)

  extension (x: Logarithm)
    def toDouble: Double = math.exp(x)
    def + (y: Logarithm): Logarithm = Logarithm(math.exp(x) + math.exp(y))
    def * (y: Logarithm): Logarithm = x + y
```

Тот факт, что `Logarithm` совпадает с `Double`, известен только в области, где он определен,
которая в приведенном выше примере соответствует объекту `Logarithms`.
Равенство `Logarithm = Double` может использоваться для реализации методов (например, `*` и `toDouble`).

Однако вне модуля тип `Logarithm` полностью инкапсулирован или «непрозрачен».
Для пользователей `Logarithm`-а невозможно обнаружить, что `Logarithm` на самом деле реализован как `Double`:

```scala
import Logarithms.*
val log2 = Logarithm(2.0)
val log3 = Logarithm(3.0)
println((log2 * log3).toDouble) // выводит 6.0
println((log2 + log3).toDouble) // выводит 4.999...

val d: Double = log2 // ERROR: Found Logarithm required Double
```

Несмотря на то, что мы абстрагировались от `Logarithm`, абстракция предоставляется бесплатно:
поскольку существует только одна реализация, во время выполнения не будет накладных расходов
на упаковку для примитивных типов, таких как `Double`.

### Обзор непрозрачных типов

Непрозрачные типы предлагают надежную абстракцию над деталями реализации, не накладывая расходов на производительность.
Как показано выше, непрозрачные типы удобны в использовании и очень хорошо интегрируются с [функцией методов расширения][extension].

[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
