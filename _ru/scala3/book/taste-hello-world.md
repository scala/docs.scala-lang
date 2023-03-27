---
layout: multipage-overview
title: Пример 'Hello, World!'
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом примере демонстрируется пример 'Hello, World!' на Scala 3.
language: ru
num: 5
previous-page: taste-intro
next-page: taste-repl
---

> **Подсказка**: в следующих примерах попробуйте выбрать предпочтительную для вас версию Scala. 
> <noscript><span style="font-weight: bold;">Info</span>: JavaScript is currently disabled, code tabs will still work, but preferences will not be remembered.</noscript>

## Ваша первая Scala-программа


Пример “Hello, World!” на Scala выглядит следующим образом.
Сначала поместите этот код в файл с именем _hello.scala_:

<!-- Display Hello World for each Scala Version -->
{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}
```scala
object hello {
  def main(args: Array[String]) = {
    println("Hello, World!")
  }
}
```
> В этом коде мы определили метод с именем `main` внутри Scala `object`-а с именем `hello`. 
> `object` в Scala похож на `class`, но определяет экземпляр singleton, который можно передать. 
> `main` принимает входной параметр с именем `args`, который должен иметь тип `Array[String]` 
> (`args` пока можно игнорировать).

{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}
```scala
@main def hello() = println("Hello, World!")
```
> В этом коде `hello` - это метод. 
> Он определяется с помощью `def` и объявляется в качестве основного метода с помощью аннотации `@main`. 
> Он выводит строку "Hello, World!" на стандартный вывод (STDOUT) с помощью метода `println`.

{% endtab %}

{% endtabs %}
<!-- End tabs -->

Затем скомпилируйте код с помощью `scalac`:

```bash
$ scalac hello.scala
```

Если вы переходите на Scala с Java: `scalac` похоже на `javac`, эта команда создает несколько файлов:

<!-- Display Hello World compiled outputs for each Scala Version -->
{% tabs hello-world-outputs class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-outputs %}
```bash
$ ls -1
hello$.class
hello.class
hello.scala
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-outputs %}
```bash
$ ls -1
hello$package$.class
hello$package.class
hello$package.tasty
hello.scala
hello.class
hello.tasty
```
{% endtab %}

{% endtabs %}
<!-- End tabs -->

Как и Java, файлы _.class_ представляют собой файлы байт-кода, и они готовы к запуску в JVM.

Теперь вы можете запустить метод `hello` командой `scala`:

```bash
$ scala hello
Hello, World!
```

Если запуск прошел успешно, поздравляем, вы только что скомпилировали и запустили свое первое приложение Scala.

> Дополнительную информацию о sbt и других инструментах, упрощающих разработку на Scala, можно найти в главе [Инструменты Scala][scala_tools].

## Запрос пользовательского ввода

В нашем следующем примере давайте спросим имя пользователя, прежде чем приветствовать его!

Есть несколько способов прочитать ввод из командной строки, но самый простой способ — 
использовать метод `readLine` из объекта _scala.io.StdIn_. 
Чтобы использовать этот метод, вам нужно сначала его импортировать, например:

{% tabs import-readline %}
{% tab 'Scala 2 и 3' for=import-readline %}
```scala
import scala.io.StdIn.readLine
```
{% endtab %}
{% endtabs %}

Чтобы продемонстрировать, как это работает, давайте создадим небольшой пример. 
Поместите этот исходный код в файл с именем _helloInteractive.scala_:

<!-- Display interactive Hello World application for each Scala Version -->
{% tabs hello-world-interactive class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-interactive %}
```scala
import scala.io.StdIn.readLine

object helloInteractive {

  def main(args: Array[String]) = {
    println("Please enter your name:")
    val name = readLine()

    println("Hello, " + name + "!")
  }

}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-interactive %}
```scala
import scala.io.StdIn.readLine

@main def helloInteractive() =
  println("Please enter your name:")
  val name = readLine()

  println("Hello, " + name + "!")
```
{% endtab %}

{% endtabs %}
<!-- End tabs -->

В этом коде мы сохраняем результат из `readLine` в переменную с именем `name`, 
затем используем оператор над строками `+` для соединения `"Hello, "` с `name` и `"!"`, создавая одно единственное строковое значение.

> Вы можете узнать больше об использовании val, прочитав главу [Переменные и типы данных](/scala3/book/taste-vars-data-types.html).

Затем скомпилируйте код с помощью `scalac`:

```bash
$ scalac helloInteractive.scala
```

Затем запустите его с помощью `scala helloInteractive`. На этот раз программа сделает паузу после запроса вашего имени 
и подождет, пока вы не наберете имя и не нажмете клавишу возврата на клавиатуре.
Выглядит это так:

```bash
$ scala helloInteractive
Please enter your name:
▌
```

Когда вы вводите свое имя в "приглашении", окончательное взаимодействие должно выглядеть так:

```bash
$ scala helloInteractive
Please enter your name:
Alvin Alexander
Hello, Alvin Alexander!
```

### Примечание об импорте

Как вы ранее видели, иногда определенные методы или другие типы определений, которые мы увидим позже, недоступны, 
если вы не используете подобное предложение `import`:

{% tabs import-readline-2 %}
{% tab 'Scala 2 и 3' for=import-readline-2 %}
```scala
import scala.io.StdIn.readLine
```
{% endtab %}
{% endtabs %}

Импорт помогает писать и распределять код несколькими способами:
  - вы можете поместить код в несколько файлов, чтобы избежать беспорядка и облегчить навигацию в больших проектах.
  - вы можете использовать библиотеку кода, возможно, написанную кем-то другим, которая имеет полезную функциональность.
  - вы видите, откуда берется определенное определение (особенно если оно не было записано в текущем файле).

[scala_tools]: {% link _overviews/scala3-book/scala-tools.md %}
