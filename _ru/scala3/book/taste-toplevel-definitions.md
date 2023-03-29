---
layout: multipage-overview
title: Верхнеуровневые определения
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице представлено введение в определения верхнего уровня в Scala 3.
language: ru
num: 15
previous-page: taste-contextual-abstractions
next-page: taste-summary
---


В Scala 3 все виды определений могут быть записаны на “верхнем уровне” ваших файлов с исходным кодом. 
Например, вы можете создать файл с именем _MyCoolApp.scala_ и поместить в него следующее содержимое:

{% tabs toplevel_1 %}
{% tab 'Только в Scala 3' for=toplevel_1 %}
```scala
import scala.collection.mutable.ArrayBuffer

enum Topping:
  case Cheese, Pepperoni, Mushrooms

import Topping.*
class Pizza:
  val toppings = ArrayBuffer[Topping]()

val p = Pizza()

extension (s: String)
  def capitalizeAllWords = s.split(" ").map(_.capitalize).mkString(" ")

val hwUpper = "hello, world".capitalizeAllWords

type Money = BigDecimal

// по желанию здесь можно указать ещё больше определений ...

@main def myApp =
  p.toppings += Cheese
  println("show me the code".capitalizeAllWords)
```
{% endtab %}
{% endtabs %}

Как показано, нет необходимости помещать эти определения внутрь конструкции `package`, `class` или иной конструкции.

## Заменяет объекты пакета

Если вы знакомы со Scala 2, этот подход заменяет _объекты пакета_ (_package objects_). 
Но, будучи намного проще в использовании, они работают одинаково: 
когда вы помещаете определение в пакет с именем `foo`, 
вы можете получить доступ к этому определению во всех других пакетах в `foo`, например, в пакете `foo.bar`, 
как в этом примере:

{% tabs toplevel_2 %}
{% tab 'Только в Scala 3' for=toplevel_2 %}
```scala
package foo {
  def double(i: Int) = i * 2
}

package foo {
  package bar {
    @main def fooBarMain =
      println(s"${double(1)}")   // это работает
  }
}
```
{% endtab %}
{% endtabs %}

Фигурные скобки используются в этом примере, чтобы подчеркнуть вложенность пакета.

Преимуществом такого подхода является то, что можно размещать определения в пакете с именем `com.acme.myapp`, 
а затем можно ссылаться на эти определения в `com.acme.myapp.model`, `com.acme.myapp.controller` и т.д.
