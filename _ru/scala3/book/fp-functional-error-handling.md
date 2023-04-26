---
layout: multipage-overview
title: Функциональная обработка ошибок
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлено введение в функциональную обработку ошибок в Scala 3.
language: ru
num: 45
previous-page: fp-functions-are-values
next-page: fp-summary
---



Функциональное программирование похоже на написание ряда алгебраических уравнений, 
и поскольку алгебра не имеет null значений или исключений, они не используются и в ФП. 
Что поднимает интересный вопрос: как быть в ситуациях, в которых вы обычно используете null значение или исключение программируя в ООП стиле?

Решение Scala заключается в использовании конструкций, основанных на классах типа `Option`/`Some`/`None`.
Этот урок представляет собой введение в использование такого подхода. 

Примечание:

- классы `Some` и `None` являются подклассами `Option`
- вместо того чтобы многократно повторять “`Option`/`Some`/`None`”, 
  следующий текст обычно просто ссылается на “`Option`” или на “классы `Option`”


## Первый пример

Хотя этот первый пример не имеет дело с `null` значениями, это хороший способ познакомиться с классами `Option`.

Представим, что нужно написать метод, который упрощает преобразование строк в целочисленные значения. 
И нужен элегантный способ обработки исключения, которое возникает, 
когда метод получает строку типа `"Hello"` вместо `"1"`. 
Первое предположение о таком методе может выглядеть следующим образом:

{% tabs fp-java-try class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def makeInt(s: String): Int =
  try {
    Integer.parseInt(s.trim)
  } catch {
    case e: Exception => 0
  }
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def makeInt(s: String): Int =
  try
    Integer.parseInt(s.trim)
  catch
    case e: Exception => 0
```
{% endtab %}

{% endtabs %}

Если преобразование работает, метод возвращает правильное значение `Int`, но в случае сбоя метод возвращает `0`. 
Для некоторых целей это может быть хорошо, но не совсем точно. 
Например, метод мог получить `"0"`, но мог также получить `"foo"`, `"bar"` 
или бесконечное количество других строк, которые выдадут исключение. 
Это реальная проблема: как определить, когда метод действительно получил `"0"`, а когда получил что-то еще? 
При таком подходе нет способа узнать правильный ответ наверняка.


## Использование Option/Some/None

Распространенным решением этой проблемы в Scala является использование классов, 
известных как `Option`, `Some` и `None`. 
Классы `Some` и `None` являются подклассами `Option`, поэтому решение работает следующим образом:

- объявляется, что `makeInt` возвращает тип `Option`
- если `makeInt` получает строку, которую он _может_ преобразовать в `Int`, ответ помещается внутрь `Some`
- если `makeInt` получает строку, которую _не может_ преобразовать, то возвращает `None`

Вот доработанная версия `makeInt`:

{% tabs fp--try-option class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
def makeInt(s: String): Option[Int] =
  try {
    Some(Integer.parseInt(s.trim))
  } catch {
    case e: Exception => None
  }
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
def makeInt(s: String): Option[Int] =
  try
    Some(Integer.parseInt(s.trim))
  catch
    case e: Exception => None
```
{% endtab %}

{% endtabs %}

Этот код можно прочитать следующим образом: 
“Когда данная строка преобразуется в целое число, верните значение `Int`, заключенное в `Some`, например `Some(1)`. 
Когда строка не может быть преобразована в целое число и генерируется исключение, метод возвращает значение `None`.”

Эти примеры показывают, как работает `makeInt`:

{% tabs fp-try-option-example %}

{% tab 'Scala 2 и 3' %}
```scala
val a = makeInt("1")     // Some(1)
val b = makeInt("one")   // None
```
{% endtab %}

{% endtabs %}

Как показано, строка `"1"` приводится к `Some(1)`, а строка `"one"` - к `None`. 
В этом суть альтернативного подхода к обработке ошибок. 
Данная техника используется для того, чтобы методы могли возвращать _значения_ вместо _исключений_. 
В других ситуациях значения `Option` также используются для замены `null` значений.

Примечание:

- этот подход используется во всех классах библиотеки Scala, а также в сторонних библиотеках Scala.
- ключевым моментом примера является то, что функциональные методы не генерируют исключения; 
  вместо этого они возвращают такие значения, как `Option`.


## Потребитель makeInt

Теперь представим, что мы являемся потребителем метода `makeInt`. 
Известно, что он возвращает подкласс `Option[Int]`, поэтому возникает вопрос: 
как работать с такими возвращаемыми типами?

Есть два распространенных ответа, в зависимости от потребностей:

- использование `match` выражений
- использование `for` выражений

## Использование `match` выражений

Одним из возможных решений является использование выражения `match`:

{% tabs fp-option-match class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
makeInt(x) match {
  case Some(i) => println(i)
  case None => println("That didn’t work.")
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
makeInt(x) match
  case Some(i) => println(i)
  case None => println("That didn’t work.")
```
{% endtab %}

{% endtabs %}

В этом примере, если `x` можно преобразовать в `Int`, вычисляется первый вариант в правой части предложения `case`; 
если `x` не может быть преобразован в `Int`, вычисляется второй вариант в правой части предложения `case`.


## Использование `for` выражений

Другим распространенным решением является использование выражения `for`, то есть комбинации `for`/`yield`. 
Например, представим, что необходимо преобразовать три строки в целочисленные значения, а затем сложить их. 
Решение задачи с использованием выражения `for`:

{% tabs fp-for-comprehension class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val y = for {
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
} yield {
  a + b + c
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val y = for
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```
{% endtab %}

{% endtabs %}

После выполнения этого выражения `y` может принять одно из двух значений:

- если _все_ три строки конвертируются в значения `Int`, `y` будет равно `Some[Int]`, т.е. целым числом, обернутым внутри `Some`
- если _какая-либо_ из трех строк не может быть преобразована в `Int`, `y` равен `None`

Это можно проверить на примере:

{% tabs fp-for-comprehension-evaluation class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val stringA = "1"
val stringB = "2"
val stringC = "3"

val y = for {
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
} yield {
  a + b + c
}
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val stringA = "1"
val stringB = "2"
val stringC = "3"

val y = for 
  a <- makeInt(stringA)
  b <- makeInt(stringB)
  c <- makeInt(stringC)
yield
  a + b + c
```
{% endtab %}

{% endtabs %}

С этими демонстрационными данными переменная `y` примет значение `Some(6)`.

Чтобы увидеть негативный кейс, достаточно изменить любую из строк на что-то, что нельзя преобразовать в целое число. 
В этом случае `y` равно `None`:

{% tabs fp-for-comprehension-failure-result %}

{% tab 'Scala 2 и 3' %}
```scala
y: Option[Int] = None
```
{% endtab %}

{% endtabs %}


## Восприятие Option, как контейнера

Для лучшего восприятия `Option`, его можно представить как _контейнер_:

- `Some` представляет собой контейнер с одним элементом
- `None` не является контейнером, в нем ничего нет

Если предпочтительнее думать об `Option` как о ящике, то `None` подобен пустому ящику. 
Что-то в нём могло быть, но нет.


## Использование `Option` для замены `null`

Возвращаясь к значениям `null`, место, где `null` значение может незаметно проникнуть в код, — класс, подобный этому:

{% tabs fp=case-class-nulls %}

{% tab 'Scala 2 и 3' %}
```scala
class Address(
  var street1: String,
  var street2: String,
  var city: String,
  var state: String,
  var zip: String
)
```
{% endtab %}

{% endtabs %}

Хотя каждый адрес имеет значение `street1`, значение `street2` не является обязательным. 
В результате полю `street2` можно присвоить значение `null`:

{% tabs fp-case-class-nulls-example class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val santa = new Address(
  "1 Main Street",
  null,               // <-- О! Значение null!
  "North Pole",
  "Alaska",
  "99705"
)
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val santa = Address(
  "1 Main Street",
  null,               // <-- О! Значение null!
  "North Pole",
  "Alaska",
  "99705"
)
```
{% endtab %}

{% endtabs %}

Исторически сложилось так, что в этой ситуации разработчики использовали пустые строки и значения `null`, 
оба варианта это “костыль” для решения основной проблемы: `street2` - _необязательное_ поле. 
В Scala и других современных языках правильное решение состоит в том, 
чтобы заранее объявить, что `street2` является необязательным:


{% tabs fp-case-class-with-options %}

{% tab 'Scala 2 и 3' %}
```scala
class Address(
  var street1: String,
  var street2: Option[String],   // необязательное значение
  var city: String, 
  var state: String, 
  var zip: String
)
```
{% endtab %}

{% endtabs %}

Теперь можно написать более точный код:

{% tabs fp-case-class-with-options-example-none class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val santa = new Address(
  "1 Main Street",
  None,           // 'street2' не имеет значения
  "North Pole",
  "Alaska",
  "99705"
)
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val santa = Address(
  "1 Main Street",
  None,           // 'street2' не имеет значения
  "North Pole",
  "Alaska",
  "99705"
)
```
{% endtab %}

{% endtabs %}

или так:

{% tabs fp-case-class-with-options-example-some class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
val santa = new Address(
  "123 Main Street",
  Some("Apt. 2B"),
  "Talkeetna",
  "Alaska",
  "99676"
)
```
{% endtab %}

{% tab 'Scala 3' %}
```scala
val santa = Address(
  "123 Main Street",
  Some("Apt. 2B"),
  "Talkeetna",
  "Alaska",
  "99676"
)
```
{% endtab %}

{% endtabs %}



## `Option` — не единственное решение

В этом разделе основное внимание уделялось `Option` классам, но у Scala есть несколько других альтернатив.

Например, три класса, известные как `Try`/`Success`/`Failure`, работают также, 
но (а) эти классы в основном используются, когда код может генерировать исключения, 
и (б) когда желательно использовать класс `Failure`, потому что он дает доступ к сообщению об исключении. 
Например, классы `Try` обычно используются при написании методов, которые взаимодействуют с файлами, 
базами данных или интернет-службами, поскольку эти функции могут легко создавать исключения.


## Краткое ревью

Этот раздел был довольно большим, поэтому давайте подведем краткое ревью:

- функциональные программисты не используют `null` значения
- основной заменой `null` значениям является использование классов `Option`
- функциональные методы не выдают исключений; вместо этого они возвращают такие значения, как `Option`, `Try` или `Either`
- распространенными способами работы со значениями `Option` являются выражения `match` и `for`
- `Option` можно рассматривать как контейнеры с одним элементом (`Some`) и без элементов (`None`)
- `Option` также можно использовать для необязательных параметров конструктора или метода
