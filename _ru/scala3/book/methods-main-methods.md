---
layout: multipage-overview
title: Main методы в Scala 3
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице описывается, как основные методы и аннотация @main работают в Scala 3.
language: ru
num: 25
previous-page: methods-most
next-page: methods-summary
---

<h5>Написание однострочных программ <span class="tag tag-inline">только в Scala 3</span></h5>

Scala 3 предлагает следующий способ определения программ, которые можно вызывать из командной строки: 
добавление аннотации `@main` к методу превращает его в точку входа исполняемой программы:

{% tabs method_1 %}
{% tab 'Только в Scala 3' for=method_1 %}

```scala
@main def hello() = println("Hello, World")
```

{% endtab %}
{% endtabs %}

Для запуска программы достаточно сохранить эту строку кода в файле с именем, например, _Hello.scala_ 
(имя файла необязательно должно совпадать с именем метода) и запустить с помощью `scala`:

```bash
$ scala Hello.scala
Hello, World
```

Аннотированный метод `@main` может быть написан либо на верхнем уровне (как показано), 
либо внутри статически доступного объекта. 
В любом случае имя программы - это имя метода без каких-либо префиксов объектов.

Узнайте больше об аннотации `@main`, прочитав следующие разделы или посмотрев это видео:

<div style="text-align: center">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/uVMGPrH5_Uc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

### Аргументы командной строки

Метод `@main` может обрабатывать аргументы командной строки с различными типами. 
Например, данный метод `@main`, который принимает параметры `Int`, `String` и дополнительные строковые параметры:

{% tabs method_2 %}
{% tab 'Только в Scala 3' for=method_2 %}

```scala
@main def happyBirthday(age: Int, name: String, others: String*) =
  val suffix = (age % 100) match
    case 11 | 12 | 13 => "th"
    case _ => (age % 10) match
      case 1 => "st"
      case 2 => "nd"
      case 3 => "rd"
      case _ => "th"

  val sb = StringBuilder(s"Happy $age$suffix birthday, $name")
  for other <- others do sb.append(" and ").append(other)
  println(sb.toString)
```

{% endtab %}
{% endtabs %}

После компиляции кода создается основная программа с именем `happyBirthday`, которая вызывается следующим образом:

```
$ scala happyBirthday 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

Как показано, метод `@main` может иметь произвольное количество параметров. 
Для каждого типа параметра должен существовать [given экземпляр][given] 
класса типа `scala.util.CommandLineParser.FromString`, который преобразует аргумент из `String` в требуемый тип параметра. 
Также, как показано, список параметров основного метода может заканчиваться повторяющимся параметром типа `String*`, 
который принимает все оставшиеся аргументы, указанные в командной строке.

Программа, реализованная с помощью метода `@main`, проверяет, 
что в командной строке достаточно аргументов для заполнения всех параметров, 
и что строки аргументов могут быть преобразованы в требуемые типы. 
Если проверка завершается неудачей, программа завершается с сообщением об ошибке:

```
$ scala happyBirthday 22
Illegal command line after first argument: more arguments expected

$ scala happyBirthday sixty Fred
Illegal command line: java.lang.NumberFormatException: For input string: "sixty"
```

## Детали

Компилятор Scala генерирует программу из `@main` метода `f` следующим образом:

- он создает класс с именем `f` в пакете, где был найден метод `@main`.
- класс имеет статический метод `main` с обычной сигнатурой Java `main` метода: 
  принимает `Array[String]` в качестве аргумента и возвращает `Unit`.
- сгенерированный `main` метод вызывает метод `f` с аргументами, 
  преобразованными с помощью методов в объекте `scala.util.CommandLineParser.FromString`.

Например, приведенный выше метод `happyBirthday` генерирует дополнительный код, эквивалентный следующему классу:

{% tabs method_3 %}
{% tab 'Только в Scala 3' for=method_3 %}

```scala
final class happyBirthday {
  import scala.util.{CommandLineParser as CLP}
  <static> def main(args: Array[String]): Unit =
    try
      happyBirthday(
          CLP.parseArgument[Int](args, 0),
          CLP.parseArgument[String](args, 1),
          CLP.parseRemainingArguments[String](args, 2)*)
    catch {
      case error: CLP.ParseError => CLP.showError(error)
    }
}
```

> Примечание: В этом сгенерированном коде модификатор `<static>` выражает, 
> что `main` метод генерируется как статический метод класса `happyBirthday`. 
> Эта функция недоступна для пользовательских программ в Scala. 
> Вместо неё обычные “статические” члены генерируются в Scala с использованием `object`.

{% endtab %}
{% endtabs %}

## Обратная совместимость со Scala 2

`@main` методы — это рекомендуемый способ создания программ, вызываемых из командной строки в Scala 3. 
Они заменяют предыдущий подход, который заключался в создании `object`, расширяющего класс `App`:

Прежняя функциональность `App`, основанная на "волшебном" `DelayedInit trait`, больше недоступна. 
`App` все еще существует в ограниченной форме, но не поддерживает аргументы командной строки и будет объявлен устаревшим в будущем.

Если программам необходимо выполнять перекрестную сборку между Scala 2 и Scala 3, 
вместо этого рекомендуется использовать `object` с явным методом `main` и одним аргументом `Array[String]`:

{% tabs method_4 %}
{% tab 'Scala 2 и 3' %}

```scala
object happyBirthday {
  private def happyBirthday(age: Int, name: String, others: String*) = {
    ... // тоже, что и раньше
  }
  def main(args: Array[String]): Unit =
    happyBirthday(args(0).toInt, args(1), args.drop(2).toIndexedSeq:_*)
}
```

> обратите внимание, что здесь мы используем `:_*` для передачи переменного числа аргументов, 
> который остается в Scala 3 для обратной совместимости.

{% endtab %}
{% endtabs %}

Если вы поместите этот код в файл с именем _happyBirthday.scala_, то сможете скомпилировать его с `scalac` 
и запустить с помощью `scala`, как показывалось ранее:

```bash
$ scalac happyBirthday.scala

$ scala happyBirthday 23 Lisa Peter
Happy 23rd Birthday, Lisa and Peter!
```

[given]: {% link _overviews/scala3-book/ca-given-using-clauses.md %}
