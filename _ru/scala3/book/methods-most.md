---
layout: multipage-overview
title: Особенности методов
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены методы Scala 3, включая main методы, методы расширения и многое другое.
language: ru
num: 24
previous-page: methods-intro
next-page: methods-main-methods
---

В этом разделе представлены различные аспекты определения и вызова методов в Scala 3.

## Определение методов

В Scala методы обладают множеством особенностей, в том числе:

- Generic (типовые) параметры
- Значения параметров по умолчанию
- Несколько групп параметров
- Контекстные параметры
- Параметры по имени
- и другие…

Некоторые из этих функций демонстрируются в этом разделе, но когда вы определяете “простой” метод, 
который не использует эти функции, синтаксис выглядит следующим образом:

{% tabs method_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_1 %}

```scala
def methodName(param1: Type1, param2: Type2): ReturnType = {
  // тело метода
  // находится здесь
}
```

{% endtab %}

{% tab 'Scala 3' for=method_1 %}

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // тело метода
  // находится здесь
end methodName   // опционально
```

{% endtab %}
{% endtabs %}

В этом синтаксисе:

- ключевое слово `def` используется для определения метода
- для наименования методов согласно стандартам Scala используется camel case convention
- у параметров метода необходимо всегда указывать тип
- возвращаемый тип метода указывать необязательно
- методы могут состоять как только из одной строки, так и из нескольких строк
- метку окончания метода `end methodName` указывать необязательно, её рекомендуется указывать только для длинных методов

Вот два примера однострочного метода с именем `add`, который принимает два входных параметра `Int`. 
Первая версия явно показывает возвращаемый тип метода - `Int`, а вторая - нет:

{% tabs method_2 %}
{% tab 'Scala 2 и 3' for=method_2 %}

```scala
def add(a: Int, b: Int): Int = a + b
def add(a: Int, b: Int) = a + b
```

{% endtab %}
{% endtabs %}

У публичных методов рекомендуется всегда указывать тип возвращаемого значения. 
Объявление возвращаемого типа может упростить его понимание при просмотре кода другого человека 
или своего кода спустя некоторое время.

## Вызов методов

Вызов методов прост:

{% tabs method_3 %}
{% tab 'Scala 2 и 3' for=method_3 %}

```scala
val x = add(1, 2)   // 3
```

{% endtab %}
{% endtabs %}

Коллекции Scala имеют десятки встроенных методов. 
Эти примеры показывают, как их вызывать:

{% tabs method_4 %}
{% tab 'Scala 2 и 3' for=method_4 %}

```scala
val x = List(1, 2, 3)

x.size          // 3
x.contains(1)   // true
x.map(_ * 10)   // List(10, 20, 30)
```

{% endtab %}
{% endtabs %}

Внимание:

- `size` не принимает аргументов и возвращает количество элементов в списке
- метод `contains` принимает один аргумент — значение для поиска
- `map` принимает один аргумент - функцию; в данном случае в него передается анонимная функция

## Многострочные методы

Если метод длиннее одной строки, начинайте тело метода со второй строки с отступом вправо:

{% tabs method_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_5 %}

```scala
def addThenDouble(a: Int, b: Int): Int = {
  // представим, что это тело метода требует несколько строк
  val sum = a + b
  sum * 2
}
```

{% endtab %}

{% tab 'Scala 3' for=method_5 %}

```scala
def addThenDouble(a: Int, b: Int): Int =
  // представим, что это тело метода требует несколько строк
  val sum = a + b
  sum * 2
```

{% endtab %}
{% endtabs %}

В этом методе:

- `sum` — неизменяемая локальная переменная; к ней нельзя получить доступ вне метода
- последняя строка удваивает значение `sum` - именно это значение возвращается из метода

Когда вы вставите этот код в REPL, то увидите, что он работает как требовалось:

{% tabs method_6 %}
{% tab 'Scala 2 и 3' for=method_6 %}

```scala
scala> addThenDouble(1, 1)
res0: Int = 4
```

{% endtab %}
{% endtabs %}

Обратите внимание, что нет необходимости в операторе `return` в конце метода. 
Поскольку почти все в Scala является _выражением_ — то это означает, 
что каждая строка кода возвращает (или _вычисляет_) значение — нет необходимости использовать `return`.

Это видно на примере того же метода, но в более сжатой форме:

{% tabs method_7 %}
{% tab 'Scala 2 и 3' for=method_7 %}

```scala
def addThenDouble(a: Int, b: Int): Int = (a + b) * 2
```

{% endtab %}
{% endtabs %}

В теле метода можно использовать все возможности Scala:

- `if`/`else` выражения
- `match` выражения
- циклы `while`
- циклы `for` и `for` выражения
- присвоение переменных
- вызовы других методов
- определения других методов

В качестве ещё одного примера многострочного метода, 
`getStackTraceAsString` преобразует свой входной параметр `Throwable` в правильно отформатированную строку:

{% tabs method_8 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_8 %}

```scala
def getStackTraceAsString(t: Throwable): String = {
  val sw = new StringWriter()
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
}
```

{% endtab %}

{% tab 'Scala 3' for=method_8 %}

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = StringWriter()
  t.printStackTrace(PrintWriter(sw))
  sw.toString
```

{% endtab %}
{% endtabs %}

В этом методе:

- в первой строке переменная `sw` принимает значение нового экземпляра `StringWriter`
- вторая строка сохраняет содержимое трассировки стека в `StringWriter`
- третья строка возвращает строковое представление трассировки стека

## Значения параметров по умолчанию

Параметры метода могут иметь значения по умолчанию. 
В этом примере для параметров `timeout` и `protocol` заданы значения по умолчанию:

{% tabs method_9 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_9 %}

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") = {
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // здесь ещё какой-то код ...
}
```

{% endtab %}

{% tab 'Scala 3' for=method_9 %}

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // здесь ещё какой-то код ...
```

{% endtab %}
{% endtabs %}

Поскольку параметры имеют значения по умолчанию, метод можно вызвать следующими способами:

{% tabs method_10 %}
{% tab 'Scala 2 и 3' for=method_10 %}

```scala
makeConnection()                 // timeout = 5000, protocol = http
makeConnection(2_000)            // timeout = 2000, protocol = http
makeConnection(3_000, "https")   // timeout = 3000, protocol = https
```

{% endtab %}
{% endtabs %}

Вот несколько ключевых моментов об этих примерах:

- В первом примере аргументы не предоставляются, поэтому метод использует значения параметров по умолчанию: `5_000` и `http`
- Во втором примере для параметра `timeout` указывается значение `2_000`, 
  поэтому оно используется вместе со значением по умолчанию для `protocol`
- В третьем примере значения указаны для обоих параметров, поэтому используются они.

Обратите внимание, что при использовании значений параметров по умолчанию потребителю кажется, 
что он может работать с тремя разными переопределенными методами.

## Именованные параметры

При желании вы также можете использовать имена параметров метода при его вызове. 
Например, `makeConnection` может также вызываться следующими способами:

{% tabs method_11 %}
{% tab 'Scala 2 и 3' for=method_11 %}

```scala
makeConnection(timeout=10_000)
makeConnection(protocol="https")
makeConnection(timeout=10_000, protocol="https")
makeConnection(protocol="https", timeout=10_000)
```

{% endtab %}
{% endtabs %}

В некоторых фреймворках именованные параметры используются постоянно. 
Они также очень полезны, когда несколько параметров метода имеют один и тот же тип:

{% tabs method_12 %}
{% tab 'Scala 2 и 3' for=method_12 %}

```scala
engage(true, true, true, false)
```

{% endtab %}
{% endtabs %}

Без помощи IDE этот код может быть трудночитаемым, но так он становится намного понятнее и очевиднее:

{% tabs method_13 %}
{% tab 'Scala 2 и 3' for=method_13 %}

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```

{% endtab %}
{% endtabs %}

## Рекомендации о методах, которые не принимают параметров

Когда метод не принимает параметров, говорят, что он имеет _arity_ уровень 0 (_arity-0_). 
Аналогично, если метод принимает один параметр - это метод с _arity-1_.

Когда создаются методы _arity-0_:

- если метод выполняет побочные эффекты, такие как вызов `println`, метод объявляется с пустыми скобками.
- если метод не выполняет побочных эффектов, например, получение размера коллекции, 
  что аналогично доступу к полю в коллекции, круглые скобки опускаются.

Например, этот метод выполняет побочный эффект, поэтому он объявлен с пустыми скобками:

{% tabs method_14 %}
{% tab 'Scala 2 и 3' for=method_14 %}

```scala
def speak() = println("hi")
```

{% endtab %}
{% endtabs %}

При вызове метода нужно обязательно указывать круглые скобки, если он был объявлен с ними:

{% tabs method_15 %}
{% tab 'Scala 2 и 3' for=method_15 %}

```scala
speak     // ошибка: "method speak must be called with () argument"
speak()   // печатает "hi"
```

{% endtab %}
{% endtabs %}

Хотя это всего лишь соглашение, его соблюдение значительно улучшает читаемость кода: 
с первого взгляда становится понятно, что метод с arity-0 имеет побочные эффекты.

## Использование `if` в качестве тела метода

Поскольку выражения `if`/`else` возвращают значение, их можно использовать в качестве тела метода. 
Вот метод с именем `isTruthy`, реализующий Perl-определения `true` и `false`:

{% tabs method_16 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_16 %}

```scala
def isTruthy(a: Any) = {
  if (a == 0 || a == "" || a == false)
    false
  else
    true
}
```

{% endtab %}

{% tab 'Scala 3' for=method_16 %}

```scala
def isTruthy(a: Any) =
  if a == 0 || a == "" || a == false then
    false
  else
    true
```

{% endtab %}
{% endtabs %}

Примеры показывают, как работает метод:

{% tabs method_17 %}
{% tab 'Scala 2 и 3' for=method_17 %}

```scala
isTruthy(0)      // false
isTruthy("")     // false
isTruthy("hi")   // true
isTruthy(1.0)    // true
```

{% endtab %}
{% endtabs %}

## Использование `match` в качестве тела метода

Довольно часто в качестве тела метода используются `match`-выражения. 
Вот еще одна версия `isTruthy`, написанная с `match` выражением:

{% tabs method_18 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_18 %}

```scala
def isTruthy(a: Any) = a match {
  case 0 | "" | false => false
  case _ => true
}
```

{% endtab %}

{% tab 'Scala 3' for=method_18 %}

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _ => true
```

> Этот метод работает точно так же, как и предыдущий, в котором использовалось выражение `if`/`else`. 
> Вместо `Any` в качестве типа параметра используется `Matchable`, чтобы принять любое значение, 
> поддерживающее сопоставление с образцом (pattern matching).

> См. дополнительную информацию о trait `Matchable` в [Справочной документации][reference_matchable].

[reference_matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
{% endtab %}
{% endtabs %}

## Контроль видимости методов в классах

В классах, объектах, trait-ах и enum-ах методы Scala по умолчанию общедоступны, 
поэтому созданный здесь экземпляр `Dog` может получить доступ к методу `speak`:

{% tabs method_19 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_19 %}

```scala
class Dog {
  def speak() = println("Woof")
}

val d = new Dog
d.speak()   // печатает "Woof"
```

{% endtab %}

{% tab 'Scala 3' for=method_19 %}

```scala
class Dog:
  def speak() = println("Woof")

val d = new Dog
d.speak()   // печатает "Woof"
```

{% endtab %}
{% endtabs %}

Также методы можно помечать как `private`. 
Это делает их закрытыми в текущем классе, поэтому их нельзя вызвать или переопределить в подклассах:

{% tabs method_20 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_20 %}
```scala
class Animal {
  private def breathe() = println("I’m breathing")
}

class Cat extends Animal {
  // этот метод не скомпилируется
  override def breathe() = println("Yo, I’m totally breathing")
}
```

{% endtab %}

{% tab 'Scala 3' for=method_20 %}

```scala
class Animal:
  private def breathe() = println("I’m breathing")

class Cat extends Animal:
  // этот метод не скомпилируется
  override def breathe() = println("Yo, I’m totally breathing")
```

{% endtab %}
{% endtabs %}

Если необходимо сделать метод закрытым в текущем классе, но разрешить подклассам вызывать или переопределять его, 
метод помечается как `protected`, как показано в примере с методом `speak`:

{% tabs method_21 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_21 %}

```scala
class Animal {
  private def breathe() = println("I’m breathing")
  def walk() = {
    breathe()
    println("I’m walking")
  }
  protected def speak() = println("Hello?")
}

class Cat extends Animal {
  override def speak() = println("Meow")
}

val cat = new Cat
cat.walk()
cat.speak()
cat.breathe()   // не скомпилируется, потому что private
```

{% endtab %}

{% tab 'Scala 3' for=method_21 %}

```scala
class Animal:
  private def breathe() = println("I’m breathing")
  def walk() =
    breathe()
    println("I’m walking")
  protected def speak() = println("Hello?")

class Cat extends Animal:
  override def speak() = println("Meow")

val cat = new Cat
cat.walk()
cat.speak()
cat.breathe()   // не скомпилируется, потому что private
```

{% endtab %}
{% endtabs %}

Настройка `protected` означает:

- к методу (или полю) могут обращаться другие экземпляры того же класса
- метод (или поле) не виден в текущем пакете
- он доступен для подклассов

## Методы в объектах

Ранее было показано, что trait-ы и классы могут иметь методы. 
Ключевое слово `object` используется для создания одноэлементного класса, и объект также может содержать методы. 
Это хороший способ сгруппировать набор “служебных” методов. 
Например, этот объект содержит набор методов, которые работают со строками:

{% tabs method_22 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_22 %}

```scala
object StringUtils {

  /**
   * Returns a string that is the same as the input string, but
   * truncated to the specified length.
   */
  def truncate(s: String, length: Int): String = s.take(length)

  /**
    * Returns true if the string contains only letters and numbers.
    */
  def lettersAndNumbersOnly_?(s: String): Boolean =
    s.matches("[a-zA-Z0-9]+")

  /**
   * Returns true if the given string contains any whitespace
   * at all. Assumes that `s` is not null.
   */
  def containsWhitespace(s: String): Boolean =
    s.matches(".*\\s.*")

}
```

{% endtab %}

{% tab 'Scala 3' for=method_22 %}

```scala
object StringUtils:

  /**
   * Returns a string that is the same as the input string, but
   * truncated to the specified length.
   */
  def truncate(s: String, length: Int): String = s.take(length)

  /**
    * Returns true if the string contains only letters and numbers.
    */
  def lettersAndNumbersOnly_?(s: String): Boolean =
    s.matches("[a-zA-Z0-9]+")

  /**
   * Returns true if the given string contains any whitespace
   * at all. Assumes that `s` is not null.
   */
  def containsWhitespace(s: String): Boolean =
    s.matches(".*\\s.*")

end StringUtils
```

{% endtab %}
{% endtabs %}

## Методы расширения

Есть много ситуаций, когда необходимо добавить функциональность к закрытым классам. 
Например, представьте, что у вас есть класс `Circle`, но вы не можете изменить его исходный код. 
Это может быть определено в сторонней библиотеке так:

{% tabs method_23 %}
{% tab 'Scala 2 и 3' for=method_23 %}

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

{% endtab %}
{% endtabs %}

Если вы хотите добавить методы в этот класс, то можете определить их как методы расширения, например:

{% tabs method_24 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_24 %}

```scala
implicit class CircleOps(c: Circle) {
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
}
```
В Scala 2 используйте `implicit class`, подробности [здесь](/overviews/core/implicit-classes.html).

{% endtab %}
{% tab 'Scala 3' for=method_24 %}

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```
В Scala 3 используйте новую конструкцию `extension`. 
Дополнительные сведения см. [в главах этой книги][extension] или [в справочнике по Scala 3][reference-ext].

[reference-ext]: {{ site.scala3ref }}/contextual/extension-methods.html
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
{% endtab %}
{% endtabs %}

Теперь, когда у вас есть экземпляр `Circle` с именем `aCircle`, 
то вы можете вызывать эти методы следующим образом:

{% tabs method_25 %}
{% tab 'Scala 2 и 3' for=method_25 %}

```scala
aCircle.circumference
aCircle.diameter
aCircle.area
```

{% endtab %}
{% endtabs %}

## Дальнейшее изучение

Есть много чего, что можно узнать о методах, в том числе:

- Вызов методов в суперклассах
- Определение и использование параметров по имени
- Написание метода, который принимает параметр функции
- Создание встроенных методов
- Обработка исключений
- Использование входных параметров vararg
- Написание методов с несколькими группами параметров (частично применяемые функции).
- Создание методов с параметрами универсального типа.

Дополнительные сведения об этих функциях см. в других главах этой книги.

[reference_extension_methods]: {{ site.scala3ref }}/contextual/extension-methods.html
[reference_matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
