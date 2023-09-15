---
layout: multipage-overview
title: Алгебраические типы данных
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены и демонстрируются алгебраические типы данных (ADT) в Scala 3.
language: ru
num: 53
previous-page: types-union
next-page: types-variance
versionSpecific: true
---

<span class="tag tag-inline">Только в Scala 3</span>

Алгебраические типы данных (ADT) могут быть созданы с помощью конструкции `enum`,
поэтому кратко рассмотрим перечисления, прежде чем рассматривать ADT.

## Перечисления

_Перечисление_ используется для определения типа, состоящего из набора именованных значений:

```scala
enum Color:
  case Red, Green, Blue
```

который можно рассматривать как сокращение для:

```scala
enum Color:
  case Red   extends Color
  case Green extends Color
  case Blue  extends Color
```

#### Параметры

Перечисления могут быть параметризованы:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
```

Таким образом, каждый из различных вариантов содержит параметр `rgb`,
которому присваивается соответствующее значение:

```scala
println(Color.Green.rgb) // выводит 65280
```

#### Пользовательские определения

Перечисления также могут содержать пользовательские определения:

```scala
enum Planet(mass: Double, radius: Double):

  private final val G = 6.67300E-11
  def surfaceGravity = G * mass / (radius * radius)
  def surfaceWeight(otherMass: Double) =  otherMass * surfaceGravity

  case Mercury extends Planet(3.303e+23, 2.4397e6)
  case Venus   extends Planet(4.869e+24, 6.0518e6)
  case Earth   extends Planet(5.976e+24, 6.37814e6)
  // остальные 5 или 6 планет ...
```

Подобно классам и `case` классам, вы также можете определить сопутствующий объект для перечисления:

```scala
object Planet:
  def main(args: Array[String]) =
    val earthWeight = args(0).toDouble
    val mass = earthWeight / Earth.surfaceGravity
    for (p <- values)
      println(s"Your weight on $p is ${p.surfaceWeight(mass)}")
```

## Алгебраические типы данных (ADTs)

Концепция `enum` является достаточно общей,
чтобы также поддерживать _алгебраические типы данных_ (ADT) и их обобщенную версию (GADT).
Вот пример, показывающий, как тип `Option` может быть представлен в виде АТД:

```scala
enum Option[+T]:
  case Some(x: T)
  case None
```

В этом примере создается перечисление `Option` с параметром ковариантного типа `T`,
состоящим из двух вариантов `Some` и `None`.
`Some` _параметризуется_ значением параметра `x`;
это сокращение для написания `case` класса, расширяющего `Option`.
Поскольку `None` не параметризуется, то он считается обычным enum значением.

Предложения `extends`, которые были опущены в предыдущем примере, также могут быть указаны явно:

```scala
enum Option[+T]:
  case Some(x: T) extends Option[T]
  case None       extends Option[Nothing]
```

Как и в случае с обычным `enum` значениями, варианты enum определяются в его сопутствующем объекте,
поэтому они называются `Option.Some` и `Option.None` (если только определения не «вытягиваются» при импорте):

```scala
scala> Option.Some("hello")
val res1: t2.Option[String] = Some(hello)

scala> Option.None
val res2: t2.Option[Nothing] = None
```

Как и в других случаях использования перечисления, АТД могут определять дополнительные методы.
Например, вот снова `Option`, с методом `isDefined` и конструктором `Option(...)` в сопутствующем объекте:

```scala
enum Option[+T]:
  case Some(x: T)
  case None

  def isDefined: Boolean = this match
    case None => false
    case Some(_) => true

object Option:
  def apply[T >: Null](x: T): Option[T] =
    if (x == null) None else Some(x)
```

Перечисления и АТД используют одну и ту же синтаксическую конструкцию,
поэтому их можно рассматривать просто как два конца спектра, и вполне допустимо создавать гибриды.
Например, приведенный ниже код реализует `Color` либо с тремя значениями перечисления,
либо с параметризованным вариантом, принимающим значение RGB:

```scala
enum Color(val rgb: Int):
  case Red   extends Color(0xFF0000)
  case Green extends Color(0x00FF00)
  case Blue  extends Color(0x0000FF)
  case Mix(mix: Int) extends Color(mix)
```

#### Рекурсивные перечисления

До сих пор все перечисления, которые мы определяли, состояли из различных вариантов значений или case классов.
Перечисления также могут быть рекурсивными, как показано в приведенном ниже примере кодирования натуральных чисел:

```scala
enum Nat:
  case Zero
  case Succ(n: Nat)
```

Например, значение `Succ(Succ(Zero))` представляет число `2` в унарной кодировке.
Списки могут быть определены похожим образом:

```scala
enum List[+A]:
  case Nil
  case Cons(head: A, tail: List[A])
```

## Обобщенные алгебраические типы данных (GADT)

Приведенная выше нотация для перечислений очень краткая
и служит идеальной отправной точкой для моделирования ваших типов данных.
Поскольку мы всегда можем быть более подробными, то можем выразить гораздо более мощные типы:
обобщенные алгебраические типы данных (GADT).

Вот пример GADT, в котором параметр типа (`T`) указывает на тип содержимого, хранящегося в `Box`:

```scala
enum Box[T](contents: T):
  case IntBox(n: Int) extends Box[Int](n)
  case BoolBox(b: Boolean) extends Box[Boolean](b)
```

Сопоставление с образцом с конкретным конструктором (`IntBox` или `BoolBox`) восстанавливает информацию о типе:

```scala
def extract[T](b: Box[T]): T = b match
  case IntBox(n)  => n + 1
  case BoolBox(b) => !b
```

Безопасно возвращать `Int` в первом случае, так как мы знаем из сопоставления с образцом, что ввод был `IntBox`.

## Дешугаризация перечислений

_Концептуально_ перечисления можно рассматривать как определение запечатанного класса вместе с сопутствующим ему объектом.
Давайте посмотрим на дешугаризацию нашего перечисления `Color`:

```scala
sealed abstract class Color(val rgb: Int) extends scala.reflect.Enum
object Color:
  case object Red extends Color(0xFF0000) { def ordinal = 0 }
  case object Green extends Color(0x00FF00) { def ordinal = 1 }
  case object Blue extends Color(0x0000FF) { def ordinal = 2 }
  case class Mix(mix: Int) extends Color(mix) { def ordinal = 3 }

  def fromOrdinal(ordinal: Int): Color = ordinal match
    case 0 => Red
    case 1 => Green
    case 2 => Blue
    case _ => throw new NoSuchElementException(ordinal.toString)
```

Заметьте, что вышеописанная дешугаризация упрощена, и мы намеренно опускаем [некоторые детали][desugar-enums].

В то время как перечисления можно кодировать вручную с помощью других конструкций,
использование перечислений является более кратким,
а также включает несколько дополнительных утилит (таких, как метод `fromOrdinal`).

[desugar-enums]: {{ site.scala3ref }}/enums/desugarEnums.html
