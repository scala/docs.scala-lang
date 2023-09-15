---
layout: tour
title: Выведение Типа
partof: scala-tour
num: 29
language: ru
next-page: operators
previous-page: polymorphic-methods
---

Компилятор Scala часто может вывести тип выражения, так что вам не нужно указывать его явным образом.

## Не указывая тип

{% tabs type-inference_1 %}
{% tab 'Scala 2 и 3' for=type-inference_1 %}

```scala mdoc
val businessName = "Montreux Jazz Café"
```

{% endtab %}
{% endtabs %}

Компилятор может определить, что тип константы `businessName` является `String`. Аналогичным образом это работает и для методов:

{% tabs type-inference_2 %}
{% tab 'Scala 2 и 3' for=type-inference_2 %}

```scala mdoc
def squareOf(x: Int) = x * x
```

{% endtab %}
{% endtabs %}

Компилятор может определить, что возвращаемый тип является `Int`, поэтому явного указания типа не требуется.

Для рекурсивных методов компилятор не в состоянии вывести тип. Вот программа, которая не скомпилируется по этой причине:

{% tabs type-inference_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=type-inference_3 %}

```scala mdoc:fail
def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
```

{% endtab %}
{% tab 'Scala 3' for=type-inference_3 %}

```scala
def fac(n: Int) = if n == 0 then 1 else n * fac(n - 1)
```

{% endtab %}
{% endtabs %}

Также необязательно указывать параметры типа при вызове [полиморфных методов](polymorphic-methods.html) или [обобщенных классов](generic-classes.html). Компилятор Scala определит тип параметра из контекста и из типов фактически передаваемых параметров метода/конструктора.

Вот два примера:

{% tabs type-inference_4 %}
{% tab 'Scala 2 и 3' for=type-inference_4 %}

```scala mdoc
case class MyPair[A, B](x: A, y: B)
val p = MyPair(1, "scala") // тип: MyPair[Int, String]

def id[T](x: T) = x
val q = id(1)              // тип: Int
```

{% endtab %}
{% endtabs %}

Компилятор использует типы аргументов `MyPair` для определения типа `A` и `B`. Тоже самое для типа `x`.

## Параметры

Для параметров компилятор никогда не выводит тип. Однако, в некоторых случаях, он может вывести типы для параметров анонимной функции при передаче ее в качестве аргумента.

{% tabs type-inference_5 %}
{% tab 'Scala 2 и 3' for=type-inference_5 %}

```scala mdoc
Seq(1, 3, 4).map(x => x * 2)  // List(2, 6, 8)
```

{% endtab %}
{% endtabs %}

Параметр у map - `f: A => B` (функциональный параметр переводящий тип из A в B). Поскольку мы разместили целые числа в нашей последовательности `Seq`, компилятор знает, что элемент `A` является `Int` (т.е. `x` является целым числом). Поэтому компилятор может определить из выражения `x * 2`, что результат (`B`) является типом `Int`.

## Когда _не следует_ полагаться на выведение типа

Обычно считается, наиболее удобочитаемым объявить тип членов, которые открыты для публичного использования через API. Поэтому мы рекомендуем вам явно указывать тип для любых API, которые будут доступны пользователям вашего кода.

Кроме того, выведение может иногда приводить к слишком специфичному типу. Предположим, мы напишем:

{% tabs type-inference_6 %}
{% tab 'Scala 2 и 3' for=type-inference_6 %}

```scala
var obj = null
```

{% endtab %}
{% endtabs %}

Тогда мы не сможем далее сделать это переназначение:

{% tabs type-inference_7 %}
{% tab 'Scala 2 и 3' for=type-inference_7 %}

```scala mdoc:fail
obj = new AnyRef
```

{% endtab %}
{% endtabs %}

Такое не будет компилироваться, потому что для `obj` предполагался тип `Null`. Поскольку единственным значением этого типа является `null`, то невозможно присвоить другое значение.
