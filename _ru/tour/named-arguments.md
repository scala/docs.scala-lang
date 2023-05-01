---
layout: tour
title: Именованные Аргументы
partof: scala-tour
num: 34
language: ru
next-page: packages-and-imports
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax
---

При вызове методов можно конкретно указывать название задаваемого аргумента следующим образом:

{% tabs named-arguments-when-good %}

{% tab 'Scala 2 и 3' for=named-arguments-when-good %}
```scala mdoc
def printName(first: String, last: String): Unit =
  println(first + " " + last)

printName("John", "Smith")                 // выводит "John Smith"
printName(first = "John", last = "Smith")  // выводит "John Smith"
printName(last = "Smith", first = "John")  // выводит "John Smith"
```
{% endtab %}

{% endtabs %}


Обратите внимание, что при указании имени параметра, порядок аргумента может быть изменен. 
Однако если какие-то аргументы именованные, а другие нет, 
то аргументы без имени должны стоять на первом месте и располагаться в том порядке, в котором описаны параметры метода.

{% tabs named-arguments-when-error %}

{% tab 'Scala 2 и 3' for=named-arguments-when-error %}
```scala mdoc:fail
printName(last = "Smith", "john") // ошибка: позиция после именованного аргумента
```
{% endtab %}

{% endtabs %}

Именованные аргументы работают при вызове Java методов, но только в том случае, 
если используемая Java библиотека была скомпилирована с `-parameters`.
