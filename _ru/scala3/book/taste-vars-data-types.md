---
layout: multipage-overview
title: Переменные и типы данных
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: В этом разделе демонстрируются переменные val и var, а также некоторые распространенные типы данных Scala.
language: ru
num: 7
previous-page: taste-repl
next-page: taste-control-structures
---


В этом разделе представлен обзор переменных и типов данных Scala.

## Два вида переменных

Когда вы создаете новую переменную в Scala, то объявляете, является ли переменная неизменяемой или изменяемой:

<table>
  <thead>
    <tr>
      <th>Тип переменной</th>
      <th>Описание</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top"><code>val</code></td>
      <td valign="top">Создает <em>неизменяемую</em> переменную &mdash; как <code>final</code> в Java. Вы всегда должны создавать переменную с <code>val</code>, если нет причины, по которой вам нужна изменяемая переменная.</td>
    </tr>
    <tr>
      <td><code>var</code></td>
      <td>Создает <em>изменяемую</em> переменную и должна использоваться только в том случае, если содержимое переменной будет меняться с течением времени.</td>
    </tr>
  </tbody>
</table>

Эти примеры показывают, как создавать `val` и `var` переменные:

{% tabs var-express-1 %}
{% tab 'Scala 2 and 3' %}

```scala
// неизменяемая
val a = 0

// изменяемая
var b = 1
```
{% endtab %}
{% endtabs %}

В программе `val` переназначить нельзя. 
Появится ошибка компилятора, если попытаться её изменить:

{% tabs var-express-2 %}
{% tab 'Scala 2 and 3' %}

```scala
val msg = "Hello, world"
msg = "Aloha"   // ошибка "reassignment to val"; этот код не скомпилируется
```
{% endtab %}
{% endtabs %}

И наоборот, `var` можно переназначить:

{% tabs var-express-3 %}
{% tab 'Scala 2 and 3' %}

```scala
var msg = "Hello, world"
msg = "Aloha"   // этот код скомпилируется, потому что var может быть переназначена
```
{% endtab %}
{% endtabs %}

## Объявление типов переменных

Когда вы создаете переменную, то можете явно объявить ее тип или позволить компилятору его вывести:

{% tabs var-express-4 %}
{% tab 'Scala 2 and 3' %}

```scala
val x: Int = 1   // явно
val x = 1        // неявно; компилятор выводит тип
```
{% endtab %}
{% endtabs %}

Вторая форма известна как _вывод типа_, и это отличный способ сделать кратким код такого типа. 
Компилятор Scala обычно может определить тип данных за вас, как показано в выводе этих примеров REPL:

{% tabs var-express-5 %}
{% tab 'Scala 2 and 3' %}

```scala
scala> val x = 1
val x: Int = 1

scala> val s = "a string"
val s: String = a string

scala> val nums = List(1, 2, 3)
val nums: List[Int] = List(1, 2, 3)
```
{% endtab %}
{% endtabs %}

Вы всегда можете явно объявить тип переменной, если хотите, 
но в простых присваиваниях, подобных нижеследующим, в этом нет необходимости:

{% tabs var-express-6 %}
{% tab 'Scala 2 and 3' %}

```scala
val x: Int = 1
val s: String = "a string"
val p: Person = Person("Richard")
```
{% endtab %}
{% endtabs %}

Обратите внимание, что при таком подходе код кажется более многословным, чем необходимо.

## Встроенные типы данных

Scala поставляется со стандартными числовыми типами данных, которые вы ожидаете, 
и все они являются полноценными экземплярами классов. 
В Scala все является объектом.

Эти примеры показывают, как объявлять переменные числовых типов:

{% tabs var-express-7 %}
{% tab 'Scala 2 and 3' %}

```scala
val b: Byte = 1
val i: Int = 1
val l: Long = 1
val s: Short = 1
val d: Double = 2.0
val f: Float = 3.0
```
{% endtab %}
{% endtabs %}

Поскольку `Int` и `Double` являются числовыми типами по умолчанию, то обычно они создаются без явного объявления типа:

{% tabs var-express-8 %}
{% tab 'Scala 2 and 3' %}

```scala
val i = 123   // по умолчанию Int
val j = 1.0   // по умолчанию Double
```
{% endtab %}
{% endtabs %}

В своем коде вы также можете добавлять символы `L`, `D` и `F` (и их эквиваленты в нижнем регистре) к числам, 
чтобы указать, что они являются `Long`, `Double` или `Float` значениями:

{% tabs var-express-9 %}
{% tab 'Scala 2 and 3' %}

```scala
val x = 1_000L   // val x: Long = 1000
val y = 2.2D     // val y: Double = 2.2
val z = 3.3F     // val z: Float = 3.3
```
{% endtab %}
{% endtabs %}

Когда вам нужны действительно большие числа, используйте типы `BigInt` и `BigDecimal`:

{% tabs var-express-10 %}
{% tab 'Scala 2 and 3' %}

```scala
var a = BigInt(1_234_567_890_987_654_321L)
var b = BigDecimal(123_456.789)
```
{% endtab %}
{% endtabs %}

Где `Double` и `Float` - это приблизительные десятичные числа, а `BigDecimal` используется для точной арифметики.

В Scala также есть типы данных `String` и `Char`:

{% tabs var-express-11 %}
{% tab 'Scala 2 and 3' %}

```scala
val name = "Bill"   // String
val c = 'a'         // Char
```
{% endtab %}
{% endtabs %}

### Строки

Строки Scala похожи на строки Java, но у них есть две замечательные дополнительные функции:

- Они поддерживают интерполяцию строк
- Легко создавать многострочные строки

#### Строковая интерполяция

Интерполяция строк обеспечивает очень удобный способ использования переменных внутри строк. 
Например, учитывая эти три переменные:

{% tabs var-express-12 %}
{% tab 'Scala 2 and 3' %}

```scala
val firstName = "John"
val mi = 'C'
val lastName = "Doe"
```
{% endtab %}
{% endtabs %}

Вы можете объединить эти переменные в строку следующим образом:

{% tabs var-express-13 %}
{% tab 'Scala 2 and 3' %}

```scala
println(s"Name: $firstName $mi $lastName")   // "Name: John C Doe"
```
{% endtab %}
{% endtabs %}

Просто поставьте перед строкой букву `s`, а затем поставьте символ `$` перед именами переменных внутри строки.

Чтобы вставить произвольные выражения в строку, заключите их в фигурные скобки:

{% tabs var-express-14 %}
{% tab 'Scala 2 and 3' %}

``` scala
println(s"2 + 2 = ${2 + 2}")   // prints "2 + 2 = 4"

val x = -1
println(s"x.abs = ${x.abs}")   // prints "x.abs = 1"
```
{% endtab %}
{% endtabs %}

Символ `s`, помещенный перед строкой, является лишь одним из возможных интерполяторов. 
Если использовать `f` вместо `s`, можно использовать синтаксис форматирования в стиле `printf` в строке. 
Кроме того, интерполятор строк - это всего лишь специальный метод, и его можно определить самостоятельно. 
Например, некоторые библиотеки баз данных определяют очень мощный интерполятор `sql`.

#### Многострочные строки

Многострочные строки создаются путем включения строки в три двойные кавычки:

{% tabs var-express-15 %}
{% tab 'Scala 2 and 3' %}

```scala
val quote = """The essence of Scala:
               Fusion of functional and object-oriented
               programming in a typed setting."""
```
{% endtab %}
{% endtabs %}

> Дополнительные сведения о строковых интерполяторах и многострочных строках см. в главе [“Первое знакомство с типами”][first-look].

[first-look]: {% link _overviews/scala3-book/first-look-at-types.md %}
