---
layout: multipage-overview
title: Структуры управления
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: Этот раздел демонстрирует структуры управления в Scala 3.
language: ru
num: 8
previous-page: taste-vars-data-types
next-page: taste-modeling
---


В Scala есть все структуры управления, которые вы найдете в других языках программирования, 
а также мощные `for` и `match` выражения:

- `if`/`else`
- `for` циклы и выражения
- `match` выражения
- `while` циклы
- `try`/`catch`

Эти структуры демонстрируются в следующих примерах.

## `if`/`else`

В Scala структура управления `if`/`else` похожа на аналогичные структуры в других языках.

{% tabs if-else class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else %}

```scala
if (x < 0) {
  println("negative")
} else if (x == 0) {
  println("zero")
} else {
  println("positive")
}
```

{% endtab %}

{% tab 'Scala 3' for=if-else %}

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

Обратите внимание, что это действительно _выражение_, а не _утверждение_. 
Это означает, что оно возвращает значение, поэтому вы можете присвоить результат переменной:

{% tabs if-else-expression class=tabs-scala-version %}
{% tab 'Scala 2' for=if-else-expression %}

```scala
val x = if (a < b) { a } else { b }
```

{% endtab %}

{% tab 'Scala 3' for=if-else-expression %}

```scala
val x = if a < b then a else b
```

{% endtab %}
{% endtabs %}

Как вы увидите в этой книге, _все_ управляющие структуры Scala могут использоваться как выражения.

> Выражение возвращает результат, а утверждение — нет. 
> Утверждения обычно используются для их побочных эффектов, таких как использование `println` для печати на консоли.

## `for` циклы и выражения

Ключевое слово `for` используется для создания цикла `for`. 
В этом примере показано, как напечатать каждый элемент в `List`:

{% tabs for-loop class=tabs-scala-version %}
{% tab 'Scala 2' for=for-loop %}

```scala
val ints = List(1, 2, 3, 4, 5)

for (i <- ints) println(i)
```

> Код `i <- ints` называется _генератором_, а код, следующий за закрывающими скобками генератора, является _телом_ цикла.

{% endtab %}

{% tab 'Scala 3' for=for-loop %}

```scala
val ints = List(1, 2, 3, 4, 5)

for i <- ints do println(i)
```

> Код `i <- ints` называется _генератором_, а код, следующий за ключевым словом `do`, является _телом_ цикла.

{% endtab %}
{% endtabs %}

### Guards

Вы также можете использовать одно или несколько `if` выражений внутри цикла `for`. 
Их называют _стражники_ (_guards_). 
В этом примере выводятся все числа `ints`, большие `2`:

{% tabs for-guards class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards %}

```scala
for (i <- ints if i > 2)
  println(i)
```

{% endtab %}

{% tab 'Scala 3' for=for-guards %}

```scala
for
  i <- ints
  if i > 2
do
  println(i)
```

{% endtab %}
{% endtabs %}

Вы можете использовать несколько генераторов и стражников. 
Этот цикл перебирает числа от `1` до `3`, и для каждого числа также перебирает символы от `a` до `c`. 
Однако у него также есть два стражника, поэтому оператор печати вызывается только тогда, 
когда `i` имеет значение `2` и `j` является символом `b`:

{% tabs for-guards-multi class=tabs-scala-version %}
{% tab 'Scala 2' for=for-guards-multi %}

```scala
for {
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
} {
  println(s"i = $i, j = $j")   // печатает: "i = 2, j = b"
}
```

{% endtab %}

{% tab 'Scala 3' for=for-guards-multi %}

```scala
for
  i <- 1 to 3
  j <- 'a' to 'c'
  if i == 2
  if j == 'b'
do
  println(s"i = $i, j = $j")   // печатает: "i = 2, j = b"
```

{% endtab %}
{% endtabs %}

### Выражения `for` 

Ключевое слово `for` содержит в себе еще большую силу: 
когда вы используете ключевое слово `yield` вместо `do`, то создаете _выражения_ `for`, 
которые используются для вычислений и получения результатов.

Несколько примеров демонстрируют это. 
Используя тот же список `ints`, что и в предыдущем примере, этот код создает новый список, 
в котором значение каждого элемента в новом списке в два раза превышает значение элементов в исходном:

{% tabs for-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expression_1 %}

````
scala> val doubles = for (i <- ints) yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}

{% tab 'Scala 3' for=for-expression_1 %}

````
scala> val doubles = for i <- ints yield i * 2
val doubles: List[Int] = List(2, 4, 6, 8, 10)
````

{% endtab %}
{% endtabs %}

Синтаксис структуры управления Scala является гибким, 
и это `for` выражение может быть записано несколькими другими способами, в зависимости от ваших предпочтений:

{% tabs for-expressioni_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_2 %}

```scala
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_2 %}

```scala
val doubles = for i <- ints yield i * 2     // стиль показан выше
val doubles = for (i <- ints) yield i * 2
val doubles = for (i <- ints) yield (i * 2)
val doubles = for { i <- ints } yield (i * 2)
```

{% endtab %}
{% endtabs %}

В этом примере показано, как сделать первый символ в каждой строке списка заглавными:

{% tabs for-expressioni_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for (name <- names) yield name.capitalize
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_3 %}

```scala
val names = List("chris", "ed", "maurice")
val capNames = for name <- names yield name.capitalize
```

{% endtab %}
{% endtabs %}

Наконец, нижеследующее выражение `for` перебирает список строк 
и возвращает длину каждой строки, но только если эта длина больше `4`:

{% tabs for-expressioni_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths =
  for (f <- fruits if f.length > 4) yield f.length

// fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}

{% tab 'Scala 3' for=for-expressioni_4 %}

```scala
val fruits = List("apple", "banana", "lime", "orange")

val fruitLengths = for
  f <- fruits
  if f.length > 4
yield
  // здесь можно использовать
  // несколько строк кода
  f.length

// fruitLengths: List[Int] = List(5, 6, 6)
```

{% endtab %}
{% endtabs %}

`for` циклы и выражения более подробно рассматриваются в разделах этой книги ["Структуры управления"][control] 
и в [справочной документации]({{ site.scala3ref }}/other-new-features/control-syntax.html).

## `match` выражения

В Scala есть выражение `match`, которое в своем самом простом использовании похоже на `switch` оператор Java:

{% tabs match class=tabs-scala-version %}
{% tab 'Scala 2' for=match %}

```scala
val i = 1

// позже в этом коде ...
i match {
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
}
```

{% endtab %}

{% tab 'Scala 3' for=match %}

```scala
val i = 1

// позже в этом коде ...
i match
  case 1 => println("one")
  case 2 => println("two")
  case _ => println("other")
```

{% endtab %}
{% endtabs %}

Однако `match` на самом деле это выражение, означающее, 
что оно возвращает результат на основе совпадения с шаблоном, который вы можете привязать к переменной:

{% tabs match-expression_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_1 %}

```scala
val result = i match {
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_1 %}

```scala
val result = i match
  case 1 => "one"
  case 2 => "two"
  case _ => "other"
```

{% endtab %}
{% endtabs %}

`match` не ограничивается работой только с целочисленными значениями, его можно использовать с любым типом данных:

{% tabs match-expression_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_2 %}

```scala
val p = Person("Fred")

// позже в этом коде ...
p match {
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
}
```

{% endtab %}

{% tab 'Scala 3' for=match-expression_2 %}

```scala
val p = Person("Fred")

// позже в этом коде ...
p match
  case Person(name) if name == "Fred" =>
    println(s"$name says, Yubba dubba doo")

  case Person(name) if name == "Bam Bam" =>
    println(s"$name says, Bam bam!")

  case _ => println("Watch the Flintstones!")
```

{% endtab %}
{% endtabs %}

На самом деле `match` выражение можно использовать для проверки переменной на множестве различных типов шаблонов. 
В этом примере показано (а) как использовать `match` выражение в качестве тела метода и (б) как сопоставить все показанные различные типы:

{% tabs match-expression_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=match-expression_3 %}

```scala
// getClassAsString - метод, принимающий один параметр любого типа.
def getClassAsString(x: Any): String = x match {
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[_] => "List"
  case _ => "Unknown"
}

// примеры
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

Поскольку метод `getClassAsString` принимает значение параметра типа `Any`, его можно разложить по любому шаблону.

{% endtab %}
{% tab 'Scala 3' for=match-expression_3 %}

```scala
// getClassAsString - метод, принимающий один параметр любого типа.
def getClassAsString(x: Matchable): String = x match
  case s: String => s"'$s' is a String"
  case i: Int => "Int"
  case d: Double => "Double"
  case l: List[?] => "List"
  case _ => "Unknown"

// примеры
getClassAsString(1)               // Int
getClassAsString("hello")         // 'hello' is a String
getClassAsString(List(1, 2, 3))   // List
```

Метод `getClassAsString` принимает в качестве параметра значение типа [Matchable]({{ site.scala3ref }}/other-new-features/matchable.html), 
которое может быть любым типом, поддерживающим сопоставление с образцом 
(некоторые типы не поддерживают сопоставление с образцом, поскольку это может нарушить инкапсуляцию).

{% endtab %}
{% endtabs %}

Сопоставление с образцом в Scala гораздо _шире_. 
Шаблоны могут быть вложены друг в друга, результаты шаблонов могут быть связаны, 
а сопоставление шаблонов может даже определяться пользователем. 
Дополнительные сведения см. в примерах сопоставления с образцом в главе ["Структуры управления"][control].

## `try`/`catch`/`finally`

Структура управления Scala `try`/`catch`/`finally` позволяет перехватывать исключения. 
Она похожа на аналогичную структуру в Java, но её синтаксис соответствует `match` выражениям:

{% tabs try class=tabs-scala-version %}
{% tab 'Scala 2' for=try %}

```scala
try {
  writeTextToFile(text)
} catch {
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
} finally {
  println("Clean up your resources here.")
}
```

{% endtab %}

{% tab 'Scala 3' for=try %}

```scala
try
  writeTextToFile(text)
catch
  case ioe: IOException => println("Got an IOException.")
  case nfe: NumberFormatException => println("Got a NumberFormatException.")
finally
  println("Clean up your resources here.")
```

{% endtab %}
{% endtabs %}

## Циклы `while`

В Scala также есть конструкция цикла `while`. 
Его однострочный синтаксис выглядит так:

{% tabs while_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_1 %}

```scala
while (x >= 0) { x = f(x) }
```

{% endtab %}

{% tab 'Scala 3' for=while_1 %}

```scala
while x >= 0 do x = f(x)
```
Scala 3 по-прежнему поддерживает синтаксис Scala 2 для обратной совместимости.

{% endtab %}
{% endtabs %}

Синтаксис `while` многострочного цикла выглядит следующим образом:

{% tabs while_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=while_2 %}

```scala
var x = 1

while (x < 3) {
  println(x)
  x += 1
}
```

{% endtab %}

{% tab 'Scala 3' for=while_2 %}

```scala
var x = 1

while
  x < 3
do
  println(x)
  x += 1
```

{% endtab %}
{% endtabs %}

## Пользовательские структуры управления

Благодаря таким функциям, как параметры по имени, инфиксная нотация, плавные интерфейсы, необязательные круглые скобки, 
методы расширения и функции высшего порядка, вы также можете создавать свой собственный код, 
который работает так же, как управляющая структура. 
Вы узнаете об этом больше в разделе ["Структуры управления"][control].

[control]: {% link _overviews/scala3-book/control-structures.md %}
