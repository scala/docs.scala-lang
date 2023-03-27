---
layout: multipage-overview
title: REPL
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлено введение в Scala REPL.
language: ru
num: 6
previous-page: taste-hello-world
next-page: taste-vars-data-types
---

Scala REPL (“Read-Evaluate-Print-Loop”) - это интерпретатор командной строки, 
который используется в качестве “игровой площадки” для тестирования Scala кода. 
Для того чтобы запустить сеанс REPL, надо выполнить команду `scala` или `scala3` в зависимости от операционной системы, 
затем будет выведено приглашение “Welcome”, подобное этому:

{% tabs command-line class=tabs-scala-version %}

{% tab 'Scala 2' for=command-line %}
```bash
$ scala
Welcome to Scala {{site.scala-version}} (OpenJDK 64-Bit Server VM, Java 1.8.0_342).
Type in expressions for evaluation. Or try :help.

scala> _
```
{% endtab %}

{% tab 'Scala 3' for=command-line %}
```bash
$ scala
Welcome to Scala {{site.scala-3-version}} (1.8.0_322, Java OpenJDK 64-Bit Server VM).
Type in expressions for evaluation. Or try :help.

scala> _
```
{% endtab %}

{% endtabs %}

REPL — это интерпретатор командной строки, поэтому он ждет, пока вы что-нибудь наберете. 
Теперь можно вводить выражения Scala, чтобы увидеть, как они работают:

{% tabs expression-one %}
{% tab 'Scala 2 и 3' for=expression-one %}
````
scala> 1 + 1
val res0: Int = 2

scala> 2 + 2
val res1: Int = 4
````
{% endtab %}
{% endtabs %}

Как показано в выводе, если не присваивать переменную результату выражения, 
REPL автоматически создает для вас переменные с именами `res0`, `res1` и т.д. 
Эти имена переменных можно использовать в последующих выражениях:

{% tabs expression-two %}
{% tab 'Scala 2 и 3' for=expression-two %}
````
scala> val x = res0 * 10
val x: Int = 20
````
{% endtab %}
{% endtabs %}

Обратите внимание, что в REPL output также показываются результаты выражений.

В REPL можно проводить всевозможные эксперименты. 
В этом примере показано, как создать, а затем вызвать метод `sum`:

{% tabs expression-three %}
{% tab 'Scala 2 и 3' for=expression-three %}
````
scala> def sum(a: Int, b: Int): Int = a + b
def sum(a: Int, b: Int): Int

scala> sum(2, 2)
val res2: Int = 4
````
{% endtab %}
{% endtabs %}

Также можно использовать игровую среду на основе браузера [scastie.scala-lang.org](https://scastie.scala-lang.org).

Если вы предпочитаете писать код в текстовом редакторе, а не в консоли, то можно использовать [worksheet].

[worksheet]: {% link _overviews/scala3-book/tools-worksheets.md %}
