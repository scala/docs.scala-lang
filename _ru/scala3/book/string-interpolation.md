---
layout: multipage-overview
title: Интерполяция строк
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице представлена дополнительная информация о создании строк и использовании интерполяции строк.
language: ru
num: 18
previous-page: first-look-at-types
next-page: control-structures
---

## Введение

Интерполяция строк позволяет использовать внутри строк переменные.
Например:

{% tabs example-1 %}
{% tab 'Scala 2 и 3' for=example-1 %}

```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```

{% endtab %}
{% endtabs %}

Использование интерполяции строк заключается в том, что перед строковыми кавычками ставится символ `s`,
а перед любыми именами переменных ставится символ `$`.

### Другие интерполяторы

То `s`, что вы помещаете перед строкой, является лишь одним из возможных интерполяторов, предоставляемых Scala.

Scala по умолчанию предоставляет три метода интерполяции строк: `s`, `f` и `raw`.
Кроме того, строковый интерполятор — это всего лишь специальный метод, и вы можете определить свой собственный.
Например, некоторые библиотеки баз данных определяют интерполятор `sql`, возвращающий запрос к базе данных.

## Интерполятор `s` (`s`-строки)

Добавление `s` перед любым строковым литералом позволяет использовать переменные непосредственно в строке.
Вы уже здесь видели пример:

{% tabs example-2 %}
{% tab 'Scala 2 и 3' for=example-2 %}

```scala
val name = "James"
val age = 30
println(s"$name is $age years old")   // "James is 30 years old"
```

{% endtab %}
{% endtabs %}

Здесь переменные `$name` и `$age` заменяются в строке результатами вызова `name.toString` и `age.toString` соответственно.
`s`-строка будет иметь доступ ко всем переменным, в настоящее время находящимся в области видимости.

Хотя это может показаться очевидным, важно здесь отметить,
что интерполяция строк _не_ будет выполняться в обычных строковых литералах:

{% tabs example-3 %}
{% tab 'Scala 2 и 3' for=example-3 %}

```scala
val name = "James"
val age = 30
println("$name is $age years old")   // "$name is $age years old"
```

{% endtab %}
{% endtabs %}

Строковые интерполяторы также могут принимать произвольные выражения.
Например:

{% tabs example-4 %}
{% tab 'Scala 2 и 3' for=example-4 %}

```scala
println(s"2 + 2 = ${2 + 2}")   // "2 + 2 = 4"
val x = -1
println(s"x.abs = ${x.abs}")   // "x.abs = 1"
```

{% endtab %}
{% endtabs %}

Любое произвольное выражение может быть встроено в `${}`.

Некоторые специальные символы необходимо экранировать при встраивании в строку.
Чтобы указать символ "знак доллара", вы можете удвоить его `$$`, как показано ниже:

{% tabs example-5 %}
{% tab 'Scala 2 и 3' for=example-5 %}

```scala
println(s"New offers starting at $$14.99")   // "New offers starting at $14.99"
```

{% endtab %}
{% endtabs %}

Двойные кавычки также необходимо экранировать.
Это можно сделать с помощью тройных кавычек, как показано ниже:

{% tabs example-6 %}
{% tab 'Scala 2 и 3' for=example-6 %}

```scala
println(s"""{"name":"James"}""")     // `{"name":"James"}`
```

{% endtab %}
{% endtabs %}

Наконец, все многострочные строковые литералы также могут быть интерполированы.

{% tabs example-7 %}
{% tab 'Scala 2 и 3' for=example-7 %}

```scala
println(s"""name: "$name",
           |age: $age""".stripMargin)
```

Строка будет напечатана следующим образом:

```
name: "James"
age: 30
```

{% endtab %}
{% endtabs %}

## Интерполятор `f` (`f`-строки)

Добавление `f` к любому строковому литералу позволяет создавать простые отформатированные строки,
аналогичные `printf` в других языках.
При использовании интерполятора `f` за всеми ссылками на переменные должна следовать строка формата в стиле `printf`, например `%d`.
Давайте посмотрим на пример:

{% tabs example-8 %}
{% tab 'Scala 2 и 3' for=example-8 %}

```scala
val height = 1.9d
val name = "James"
println(f"$name%s is $height%2.2f meters tall")  // "James is 1.90 meters tall"
```

{% endtab %}
{% endtabs %}

Интерполятор `f` типобезопасен.
Если вы попытаетесь передать в строку формата, который работает только для целых чисел,
значение `double`, компилятор выдаст ошибку. Например:

{% tabs f-interpolator-error class=tabs-scala-version %}

{% tab 'Scala 2' for=f-interpolator-error %}

```scala
val height: Double = 1.9d

scala> f"$height%4d"
<console>:9: error: type mismatch;
  found   : Double
  required: Int
            f"$height%4d"
              ^
```

{% endtab %}

{% tab 'Scala 3' for=f-interpolator-error %}

```scala
val height: Double = 1.9d

scala> f"$height%4d"
-- Error: ----------------------------------------------------------------------
1 |f"$height%4d"
  |   ^^^^^^
  |   Found: (height : Double), Required: Int, Long, Byte, Short, BigInt
1 error found

```

{% endtab %}
{% endtabs %}

Интерполятор `f` использует утилиты форматирования строк, доступные в Java.
Форматы, разрешенные после символа `%`, описаны в [Formatter javadoc][java-format-docs].
Если после определения переменной нет символа `%`, предполагается форматирование `%s` (`String`).

Наконец, как и в Java, используйте `%%` для получения буквенного символа `%` в итоговой строке:

{% tabs literal-percent %}
{% tab 'Scala 2 и 3' for=literal-percent %}

```scala
println(f"3/19 is less than 20%%")  // "3/19 is less than 20%"
```

{% endtab %}
{% endtabs %}

### Интерполятор `raw`

Интерполятор `raw` похож на интерполятор `s`,
за исключением того, что он не выполняет экранирование литералов внутри строки.
Вот пример обработанной строки:

{% tabs example-9 %}
{% tab 'Scala 2 и 3' for=example-9 %}

```scala
scala> s"a\nb"
res0: String =
a
b
```

{% endtab %}
{% endtabs %}

Здесь строковый интерполятор `s` заменил символы `\n` символом переноса строки.
Интерполятор `raw` этого не делает.

{% tabs example-10 %}
{% tab 'Scala 2 и 3' for=example-10 %}

```scala
scala> raw"a\nb"
res1: String = a\nb
```

{% endtab %}
{% endtabs %}

Интерполятор `raw` полезен тогда, когда вы хотите избежать преобразования таких выражений, как `\n`, в символ переноса строки.

В дополнение к трем строковым интерполяторам пользователи могут определить свои собственные.

## Расширенное использование

Литерал `s"Hi $name"` анализируется Scala как _обрабатываемый_ строковый литерал.
Это означает, что компилятор выполняет некоторую дополнительную работу с этим литералом.
Особенности обработанных строк и интерполяции строк описаны в [SIP-11][sip-11].
Вот краткий пример, который поможет проиллюстрировать, как они работают.

### Пользовательские интерполяторы

В Scala все обрабатываемые строковые литералы представляют собой простые преобразования кода.
Каждый раз, когда компилятор встречает обрабатываемый строковый литерал вида:

{% tabs example-11 %}
{% tab 'Scala 2 и 3' for=example-11 %}

```scala
id"string content"
```

{% endtab %}
{% endtabs %}

он преобразует его в вызов метода (`id`) для экземпляра [StringContext](https://www.scala-lang.org/api/current/scala/StringContext.html).
Этот метод также может быть доступен в неявной области видимости.
Чтобы определить собственную интерполяцию строк, нужно создать неявный класс (Scala 2)
или метод расширения (Scala 3), который добавляет новый метод для `StringContext`.

В качестве простого примера предположим, что у нас есть простой класс `Point`
и мы хотим создать собственный интерполятор, который преобразует `p"a,b"` в объект `Point`.

{% tabs custom-interpolator-1 %}
{% tab 'Scala 2 и 3' for=custom-interpolator-1 %}

```scala
case class Point(x: Double, y: Double)

val pt = p"1,-2"     // Point(1.0,-2.0)
```

{% endtab %}
{% endtabs %}

Мы бы создали собственный интерполятор `p`,
сначала внедрив расширение `StringContext`, например, так:

{% tabs custom-interpolator-2 class=tabs-scala-version %}

{% tab 'Scala 2' for=custom-interpolator-2 %}

```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Any*): Point = ???
}
```

**Примечание**. Важно расширить `AnyVal` в Scala 2.x,
чтобы предотвратить создание экземпляра класса во время выполнения при каждой интерполяции.
Дополнительную информацию см. в документации по [value class]({% link _overviews/core/value-classes.md %}).

{% endtab %}

{% tab 'Scala 3' for=custom-interpolator-2 %}

```scala
extension (sc: StringContext)
  def p(args: Any*): Point = ???
```

{% endtab %}

{% endtabs %}

Как только это расширение окажется в области видимости и компилятор Scala обнаружит `p"some string"`,
то превратит `some string` в токены String, а каждую встроенную переменную в аргументы выражения.

Например, `p"1, $someVar"` превратится в:

{% tabs extension-desugaring class=tabs-scala-version %}

{% tab 'Scala 2' for=extension-desugaring %}

```scala
new StringContext("1, ", "").p(someVar)
```

Затем неявный класс используется для перезаписи следующим образом:

```scala
new PointHelper(new StringContext("1, ", "")).p(someVar)
```

{% endtab %}

{% tab 'Scala 3' for=extension-desugaring %}

```scala
StringContext("1, ", "").p(someVar)
```

{% endtab %}

{% endtabs %}

В результате каждый из фрагментов обработанной строки отображается в элементе `StringContext.parts`,
а любые значения выражений в строке передаются в параметр метода `args`.

### Пример реализации

Простая реализация метода интерполяции для нашего `Point` может выглядеть примерно так, как показано ниже,
хотя более детализированный метод может иметь более точный контроль
над обработкой строки `parts` и выражения `args` вместо повторного использования интерполятора `s`.

{% tabs naive-implementation class=tabs-scala-version %}

{% tab 'Scala 2' for=naive-implementation %}

```scala
implicit class PointHelper(val sc: StringContext) extends AnyVal {
  def p(args: Double*): Point = {
    // переиспользование интерполятора `s` и затем разбиение по ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }
}

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```

{% endtab %}

{% tab 'Scala 3' for=naive-implementation %}

```scala
extension (sc: StringContext)
  def p(args: Double*): Point = {
    // переиспользование интерполятора `s` и затем разбиение по ','
    val pts = sc.s(args: _*).split(",", 2).map { _.toDoubleOption.getOrElse(0.0) }
    Point(pts(0), pts(1))
  }

val x=12.0

p"1, -2"        // Point(1.0, -2.0)
p"${x/5}, $x"   // Point(2.4, 12.0)
```

{% endtab %}
{% endtabs %}

Хотя строковые интерполяторы изначально использовались для создания нескольких строковых форм,
использование пользовательских интерполяторов, как указано выше,
может обеспечить более мощное синтаксическое сокращение,
и сообщество уже использует этот синтаксис для таких вещей,
как расширение цвета терминала ANSI, выполнение SQL-запросов,
магические представления `$"identifier"` и многие другие.

[java-format-docs]: https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html#detail

[value-class]: {% link _overviews/core/value-classes.md %}
[sip-11]: {% link _sips/sips/011-string-interpolation.md %}
