---
layout: multipage-overview
title: Структуры управления
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице представлено введение в структуры управления Scala, включая if/then/else, циклы for, выражения for, выражения match, try/catch/finally и циклы while.
language: ru
num: 18
previous-page: first-look-at-types
next-page: domain-modeling-intro
---


В Scala есть все структуры управления, которые вы ожидаете найти в языке программирования, в том числе:

- `if`/`then`/`else`
- циклы `for`
- циклы `while`
- `try`/`catch`/`finally`

Здесь также есть две другие мощные конструкции, которые вы, возможно, не видели раньше, 
в зависимости от вашего опыта программирования:

- `for` выражения (также известные как  _`for` comprehensions_)
- `match` выражения

Все они продемонстрированы в следующих разделах.


## Конструкция if/then/else

Однострочный Scala оператор `if` выглядит так:

{% tabs control-structures-1 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-1 %}
```scala
if (x == 1) println(x)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-1 %}
```scala
if x == 1 then println(x)
```
{% endtab %}
{% endtabs %}

Когда необходимо выполнить несколько строк кода после `if`, используется синтаксис:

{% tabs control-structures-2 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-2 %}
```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-2 %}
```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
```
{% endtab %}
{% endtabs %}

`if`/`else` синтаксис выглядит так:

{% tabs control-structures-3 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-3 %}
```scala
if (x == 1) {
  println("x is 1, as you can see:")
  println(x)
} else {
  println("x was not 1")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-3 %}
```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
else
  println("x was not 1")
```
{% endtab %}
{% endtabs %}

А это синтаксис `if`/`else if`/`else`:

{% tabs control-structures-4 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-4 %}
```scala
if (x < 0)
  println("negative")
else if (x == 0)
  println("zero")
else
  println("positive")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-4 %}
```scala
if x < 0 then
  println("negative")
else if x == 0 then
  println("zero")
else
  println("positive")
```
{% endtab %}
{% endtabs %}

### Утверждение `end if`

<blockquote class="help-info">
<i class="fa fa-info"></i>&nbsp;&nbsp;Это новое в Scala 3 и не поддерживается в Scala 2.
</blockquote>

При желании можно дополнительно включить оператор `end if` в конце каждого выражения:
```scala
if x == 1 then
  println("x is 1, as you can see:")
  println(x)
end if
```

### `if`/`else` выражения всегда возвращают результат

Сравнения `if`/`else` образуют _выражения_ - это означает, что они возвращают значение, которое можно присвоить переменной. 
Поэтому нет необходимости в специальном тернарном операторе:

{% tabs control-structures-6 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-6 %}
```scala
val minValue = if (a < b) a else b
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-6 %}
```scala
val minValue = if a < b then a else b
```
{% endtab %}
{% endtabs %}


Поскольку эти выражения возвращают значение, то выражения `if`/`else` можно использовать в качестве тела метода:

{% tabs control-structures-7 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-7 %}
```scala
def compare(a: Int, b: Int): Int =
  if (a < b)
    -1
  else if (a == b)
    0
  else
    1
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-7 %}
```scala
def compare(a: Int, b: Int): Int =
  if a < b then
    -1
  else if a == b then
    0
  else
    1
```
{% endtab %}
{% endtabs %}

### В сторону: программирование, ориентированное на выражения

Кратко о программировании в целом: когда каждое написанное вами выражение возвращает значение, 
такой стиль называется _программированием, ориентированным на выражения_, 
или EOP (_expression-oriented programming_). 
Например, это _выражение_:

{% tabs control-structures-8 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-8 %}
```scala
val minValue = if (a < b) a else b
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-8 %}
```scala
val minValue = if a < b then a else b
```
{% endtab %}
{% endtabs %}

И наоборот, строки кода, которые не возвращают значения, называются _операторами_ 
и используются для получения _побочных эффектов_. 
Например, эти строки кода не возвращают значения, поэтому они используются для побочных эффектов:

{% tabs control-structures-9 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-9 %}
```scala
if (a == b) action()
println("Hello")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-9 %}
```scala
if a == b then action()
println("Hello")
```
{% endtab %}
{% endtabs %}

В первом примере метод `action` запускается как побочный эффект, когда `a` равно `b`. 
Второй пример используется для побочного эффекта печати строки в STDOUT. 
Когда вы узнаете больше о Scala, то обнаружите, что пишете больше _выражений_ и меньше _операторов_.

## Циклы `for`

В самом простом случае цикл `for` в Scala можно использовать для перебора элементов в коллекции. 
Например, имея последовательность целых чисел, 
вы можете перебрать ее элементы и вывести их значения следующим образом:

{% tabs control-structures-10 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-10 %}
```scala
val ints = Seq(1, 2, 3)
for (i <- ints) println(i)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-10 %}
```scala
val ints = Seq(1, 2, 3)
for i <- ints do println(i)
```
{% endtab %}
{% endtabs %}


Код `i <- ints` называется _генератором_.

Вот как выглядит результат в Scala REPL:

{% tabs control-structures-11 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for (i <- ints) println(i)
1
2
3
````
{% endtab %}
{% tab 'Scala 3' for=control-structures-11 %}
````
scala> val ints = Seq(1,2,3)
ints: Seq[Int] = List(1, 2, 3)

scala> for i <- ints do println(i)
1
2
3
````
{% endtab %}
{% endtabs %}


Если вам нужен многострочный блок кода после генератора `for`, используйте следующий синтаксис:

{% tabs control-structures-12 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-12 %}
```scala
for (i <- ints) {
  val x = i * 2
  println(s"i = $i, x = $x")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-12 %}
```scala
for i <- ints
do
  val x = i * 2
  println(s"i = $i, x = $x")
```
{% endtab %}
{% endtabs %}


### Несколько генераторов

Циклы `for` могут иметь несколько генераторов, как показано в этом примере:

{% tabs control-structures-13 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-13 %}
```scala
for {
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
} {
  println(s"i = $i, j = $j, k = $k")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-13 %}
```scala
for
  i <- 1 to 2
  j <- 'a' to 'b'
  k <- 1 to 10 by 5
do
  println(s"i = $i, j = $j, k = $k")
```
{% endtab %}
{% endtabs %}


Это выражение выводит следующее:

````
i = 1, j = a, k = 1
i = 1, j = a, k = 6
i = 1, j = b, k = 1
i = 1, j = b, k = 6
i = 2, j = a, k = 1
i = 2, j = a, k = 6
i = 2, j = b, k = 1
i = 2, j = b, k = 6
````

### "Стражники"

Циклы `for` также могут содержать операторы `if`, известные как _стражники_ (_guards_):

{% tabs control-structures-14 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-14 %}
```scala
for {
  i <- 1 to 5
  if i % 2 == 0
} {
  println(i)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-14 %}
```scala
for
  i <- 1 to 5
  if i % 2 == 0
do
  println(i)
```
{% endtab %}
{% endtabs %}


Результат этого цикла:

````
2
4
````

Цикл `for` может содержать столько стражников, сколько необходимо. 
В этом примере показан один из способов печати числа `4`:

{% tabs control-structures-15 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-15 %}
```scala
for {
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
} {
  println(i)
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-15 %}
```scala
for
  i <- 1 to 10
  if i > 3
  if i < 6
  if i % 2 == 0
do
  println(i)
```
{% endtab %}
{% endtabs %}

### Использование `for` с Maps

Вы также можете использовать циклы `for` с `Map`. 
Например, если задана такая `Map` с аббревиатурами штатов и их полными названиями:

{% tabs map %}
{% tab 'Scala 2 и 3' for=map %}
```scala
val states = Map(
  "AK" -> "Alaska",
  "AL" -> "Alabama", 
  "AR" -> "Arizona"
)
```
{% endtab %}
{% endtabs %}

, то можно распечатать ключи и значения, используя `for`. Например:

{% tabs control-structures-16 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-16 %}
```scala
for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-16 %}
```scala
for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
```
{% endtab %}
{% endtabs %}

Вот как это выглядит в REPL:

{% tabs control-structures-17 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-17 %}
```scala
scala> for ((abbrev, fullName) <- states) println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AR: Arizona
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-17 %}
```scala
scala> for (abbrev, fullName) <- states do println(s"$abbrev: $fullName")
AK: Alaska
AL: Alabama
AR: Arizona
```
{% endtab %}
{% endtabs %}

Когда цикл `for` перебирает мапу, каждая пара ключ/значение привязывается 
к переменным `abbrev` и `fullName`, которые находятся в кортеже:

```scala
(abbrev, fullName) <- states
```

По мере выполнения цикла переменная `abbrev` принимает значение текущего _ключа_ в мапе, 
а переменная `fullName` - соответствующему ключу _значению_.

## Выражение `for`

В предыдущих примерах циклов `for` все эти циклы использовались для _побочных эффектов_, 
в частности для вывода этих значений в STDOUT с помощью `println`.

Важно знать, что вы также можете создавать _выражения_ `for`, которые возвращают значения. 
Вы создаете выражение `for`, добавляя ключевое слово `yield` и возвращаемое выражение, например:

{% tabs control-structures-18 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-18 %}
```scala
val list =
  for (i <- 10 to 12)
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-18 %}
```scala
val list =
  for i <- 10 to 12
  yield i * 2

// list: IndexedSeq[Int] = Vector(20, 22, 24)
```
{% endtab %}
{% endtabs %}


После выполнения этого выражения `for` переменная `list` содержит `Vector` с отображаемыми значениями. 
Вот как работает выражение:

1. Выражение `for` начинает перебирать значения в диапазоне `(10, 11, 12)`. 
   Сначала оно работает со значением `10`, умножает его на `2`, затем выдает результат - `20`. 
2. Далее берет `11` — второе значение в диапазоне. Умножает его на `2`, а затем выдает значение `22`. 
   Можно представить эти полученные значения как накопление во временном хранилище. 
3. Наконец, цикл берет число `12` из диапазона, умножает его на `2`, получая число `24`. 
   Цикл завершается в этой точке и выдает конечный результат - `Vector(20, 22, 24)`.

Хотя целью этого раздела является демонстрация выражений `for`, полезно знать, 
что показанное выражение `for` эквивалентно вызову метода `map`:

{% tabs map-call %}
{% tab 'Scala 2 и 3' for=map-call %}
```scala
val list = (10 to 12).map(i => i * 2)
```
{% endtab %}
{% endtabs %}

Выражения `for` можно использовать в любой момент, когда вам нужно просмотреть все элементы в коллекции 
и применить алгоритм к этим элементам для создания нового списка.

Вот пример, который показывает, как использовать блок кода после `yield`:

{% tabs control-structures-19 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-19 %}
```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for (name <- names) yield { 
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName
}

// capNames: List[String] = List(Olivia, Walter, Peter)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-19 %}
```scala
val names = List("_olivia", "_walter", "_peter")

val capNames = for name <- names yield
  val nameWithoutUnderscore = name.drop(1)
  val capName = nameWithoutUnderscore.capitalize
  capName

// capNames: List[String] = List(Olivia, Walter, Peter)
```
{% endtab %}
{% endtabs %}

### Использование выражения `for` в качестве тела метода


Поскольку выражение `for` возвращает результат, его можно использовать в качестве тела метода, 
который возвращает полезное значение. 
Этот метод возвращает все значения в заданном списке целых чисел, которые находятся между `3` и `10`:

{% tabs control-structures-20 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-20 %}
```scala
def between3and10(xs: List[Int]): List[Int] =
  for {
    x <- xs
    if x >= 3
    if x <= 10
  } yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-20 %}
```scala
def between3and10(xs: List[Int]): List[Int] =
  for
    x <- xs
    if x >= 3
    if x <= 10
  yield x

between3and10(List(1, 3, 7, 11))   // : List[Int] = List(3, 7)
```
{% endtab %}
{% endtabs %}

## Циклы `while`

Синтаксис цикла `while` в Scala выглядит следующим образом:

{% tabs control-structures-21 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-21 %}
```scala
var i = 0

while (i < 3) {
  println(i)
  i += 1
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-21 %}
```scala
var i = 0

while i < 3 do
  println(i)
  i += 1
```
{% endtab %}
{% endtabs %}

## `match` выражения

Сопоставление с образцом (_pattern matching_) является основой функциональных языков программирования. 
Scala включает в себя pattern matching, обладающий множеством возможностей.

В самом простом случае можно использовать выражение `match`, подобное оператору Java `switch`, 
сопоставляя на основе целочисленного значения. 
Как и предыдущие структуры, сопоставление с образцом - это действительно выражение, поскольку оно вычисляет результат:

{% tabs control-structures-22 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-22 %}
```scala
// `i` is an integer
val day = i match {
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // по умолчанию, перехватывает остальное
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-22 %}
```scala
// `i` is an integer
val day = i match
  case 0 => "Sunday"
  case 1 => "Monday"
  case 2 => "Tuesday"
  case 3 => "Wednesday"
  case 4 => "Thursday"
  case 5 => "Friday"
  case 6 => "Saturday"
  case _ => "invalid day"   // по умолчанию, перехватывает остальное
```
{% endtab %}
{% endtabs %}


В этом примере переменная `i` сопоставляется с заданными числами. 
Если она находится между `0` и `6`, `day` принимает значение строки, представляющей день недели. 
В противном случае она соответствует подстановочному знаку, представленному символом `_`, 
и `day` принимает значение строки `"invalid day"`.

Поскольку сопоставляемые значения рассматриваются в том порядке, в котором они заданы, 
и используется первое совпадение, 
случай по умолчанию, соответствующий любому значению, должен идти последним. 
Любые сопоставляемые случаи после значения по умолчанию будут помечены как недоступные и будет выведено предупреждение.

> При написании простых выражений соответствия, подобных этому, рекомендуется использовать аннотацию `@switch` для переменной `i`. 
> Эта аннотация содержит предупреждение во время компиляции, если switch не может быть скомпилирован в `tableswitch` 
> или `lookupswitch`, которые лучше подходят с точки зрения производительности.


### Использование значения по умолчанию

Когда необходимо получить доступ к универсальному значению по умолчанию в `match` выражении, 
просто укажите вместо `_` имя переменной в левой части оператора `case`, 
а затем используйте это имя переменной в правой части оператора при необходимости:

{% tabs control-structures-23 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-23 %}
```scala
i match {
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-23 %}
```scala
i match
  case 0 => println("1")
  case 1 => println("2")
  case what => println(s"You gave me: $what")
```
{% endtab %}
{% endtabs %}

Имя, используемое в шаблоне, должно начинаться со строчной буквы. 
Имя, начинающееся с заглавной буквы, не представляет собой новую переменную, 
но соответствует значению в области видимости:

{% tabs control-structures-24 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-24 %}
```scala
val N = 42
i match {
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-24 %}
```scala
val N = 42
i match
  case 0 => println("1")
  case 1 => println("2")
  case N => println("42")
  case n => println(s"You gave me: $n" )
```
{% endtab %}
{% endtabs %}

Если `i` равно `42`, то оно будет соответствовать `case N` и напечатает строку `"42"`. 
И не достигнет случая по умолчанию.

### Обработка нескольких возможных совпадений в одной строке

Как уже упоминалось, `match` выражения многофункциональны. 
В этом примере показано, как в каждом операторе `case` использовать несколько возможных совпадений:

{% tabs control-structures-25 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-25 %}
```scala
val evenOrOdd = i match {
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-25 %}
```scala
val evenOrOdd = i match
  case 1 | 3 | 5 | 7 | 9 => println("odd")
  case 2 | 4 | 6 | 8 | 10 => println("even")
  case _ => println("some other number")
```
{% endtab %}
{% endtabs %}

### Использование `if` стражников в `case` предложениях 

В case выражениях также можно использовать стражников. 
В этом примере второй и третий case используют стражников для сопоставления нескольких целочисленных значений:

{% tabs control-structures-26 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-26 %}
```scala
i match {
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-26 %}
```scala
i match
  case 1 => println("one, a lonely number")
  case x if x == 2 || x == 3 => println("two’s company, three’s a crowd")
  case x if x > 3 => println("4+, that’s a party")
  case _ => println("i’m guessing your number is zero or less")
```
{% endtab %}
{% endtabs %}


Вот еще один пример, который показывает, как сопоставить заданное значение с диапазоном чисел:

{% tabs control-structures-27 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-27 %}
```scala
i match {
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-27 %}
```scala
i match
  case a if 0 to 9 contains a => println(s"0-9 range: $a")
  case b if 10 to 19 contains b => println(s"10-19 range: $b")
  case c if 20 to 29 contains c => println(s"20-29 range: $c")
  case _ => println("Hmmm...")
```
{% endtab %}
{% endtabs %}


#### Case классы и сопоставление с образцом

Вы также можете извлекать поля из `case` классов — и классов, которые имеют корректно написанные методы `apply`/`unapply` — 
и использовать их в своих условиях. 
Вот пример использования простого case класса `Person`:

{% tabs control-structures-28 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-28 %}
```scala
case class Person(name: String)

def speak(p: Person) = p match {
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")
}

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-28 %}
```scala
case class Person(name: String)

def speak(p: Person) = p match
  case Person(name) if name == "Fred" => println(s"$name says, Yubba dubba doo")
  case Person(name) if name == "Bam Bam" => println(s"$name says, Bam bam!")
  case _ => println("Watch the Flintstones!")

speak(Person("Fred"))      // "Fred says, Yubba dubba doo"
speak(Person("Bam Bam"))   // "Bam Bam says, Bam bam!"
```
{% endtab %}
{% endtabs %}

### Использование `match` выражения в качестве тела метода

Поскольку `match` выражения возвращают значение, их можно использовать в качестве тела метода. 
Метод `isTruthy` принимает в качестве входного параметра значение `Matchable` 
и возвращает `Boolean` на основе сопоставления с образцом:

{% tabs control-structures-29 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-29 %}
```scala
def isTruthy(a: Matchable) = a match {
  case 0 | "" | false => false
  case _              => true
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-29 %}
```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _              => true
```
{% endtab %}
{% endtabs %}

Входной параметр `a` имеет [тип `Matchable`][matchable], являющийся основой всех типов Scala, 
для которых может выполняться сопоставление с образцом. 
Метод реализован путем сопоставления на входе в метод, обрабатывая два варианта: 
первый проверяет, является ли заданное значение целым числом `0`, пустой строкой или `false` и в этом случае возвращается `false`.
Для любого другого значения в случае по умолчанию мы возвращаем `true`. 
Примеры ниже показывают, как работает этот метод:

{% tabs is-truthy-call %}
{% tab 'Scala 2 и 3' for=is-truthy-call %}
```scala
isTruthy(0)      // false
isTruthy(false)  // false
isTruthy("")     // false
isTruthy(1)      // true
isTruthy(" ")    // true
isTruthy(2F)     // true
```
{% endtab %}
{% endtabs %}

Использование сопоставления с образцом в качестве тела метода очень распространено.

#### Использование различных шаблонов в сопоставлении с образцом

Для выражения `match` можно использовать множество различных шаблонов. 
Например:

- Сравнение с константой (такое как `case 3 =>`)
- Сравнение с последовательностями (такое как `case List(els : _*) =>`)
- Сравнение с кортежами (такое как `case (x, y) =>`)
- Сравнение с конструктором класса (такое как `case Person(first, last) =>`)
- Сравнение по типу (такое как `case p: Person =>`)

Все эти виды шаблонов показаны в следующем методе `pattern`, 
который принимает входной параметр типа `Matchable` и возвращает `String`:

{% tabs control-structures-30 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-30 %}
```scala
def pattern(x: Matchable): String = x match {

  // сравнение с константой
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // сравнение с последовательностями
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // сравнение с кортежами
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // сравнение с конструктором класса
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // сравнение по типу
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // значение по умолчанию с подстановочным знаком
  case _ => "Unknown"
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-30 %}
```scala
def pattern(x: Matchable): String = x match

  // сравнение с константой
  case 0 => "zero"
  case true => "true"
  case "hello" => "you said 'hello'"
  case Nil => "an empty List"

  // сравнение с последовательностями
  case List(0, _, _) => "a 3-element list with 0 as the first element"
  case List(1, _*) => "list, starts with 1, has any number of elements"
  case Vector(1, _*) => "vector, starts w/ 1, has any number of elements"

  // сравнение с кортежами
  case (a, b) => s"got $a and $b"
  case (a, b, c) => s"got $a, $b, and $c"

  // сравнение с конструктором класса
  case Person(first, "Alexander") => s"Alexander, first name = $first"
  case Dog("Zeus") => "found a dog named Zeus"

  // сравнение по типу
  case s: String => s"got a string: $s"
  case i: Int => s"got an int: $i"
  case f: Float => s"got a float: $f"
  case a: Array[Int] => s"array of int: ${a.mkString(",")}"
  case as: Array[String] => s"string array: ${as.mkString(",")}"
  case d: Dog => s"dog: ${d.name}"
  case list: List[?] => s"got a List: $list"
  case m: Map[?, ?] => m.toString

  // значение по умолчанию с подстановочным знаком
  case _ => "Unknown"
```
{% endtab %}
{% endtabs %}

## try/catch/finally

Как и в Java, в Scala есть конструкция `try`/`catch`/`finally`, позволяющая перехватывать исключения и управлять ими. 
Для обеспечения согласованности Scala использует тот же синтаксис, что и выражения `match`, 
и поддерживает сопоставление с образцом для различных возможных исключений.

В следующем примере `openAndReadAFile` - это метод, который выполняет то, что следует из его названия: 
он открывает файл и считывает из него текст, присваивая результат изменяемой переменной `text`:

{% tabs control-structures-31 class=tabs-scala-version %}
{% tab 'Scala 2' for=control-structures-31 %}
```scala
var text = ""
try {
  text = openAndReadAFile(filename)
} catch {
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
} finally {
  // здесь необходимо закрыть ресурсы
  println("Came to the 'finally' clause.")
}
```
{% endtab %}
{% tab 'Scala 3' for=control-structures-31 %}
```scala
var text = ""
try
  text = openAndReadAFile(filename)
catch
  case fnf: FileNotFoundException => fnf.printStackTrace()
  case ioe: IOException => ioe.printStackTrace()
finally
  // здесь необходимо закрыть ресурсы
  println("Came to the 'finally' clause.")
```
{% endtab %}
{% endtabs %}

Предполагая, что метод `openAndReadAFile` использует Java `java.io.*` классы для чтения файла 
и не перехватывает его исключения, попытка открыть и прочитать файл может привести как к `FileNotFoundException`, 
так и к `IOException`, и эти два исключения перехватываются в блоке `catch` этого примера.

[matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
