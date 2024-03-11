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
  println(s"$first $last")

printName("John", "Public")                 // выводит "John Public"
printName(first = "John", last = "Public")  // выводит "John Public"
printName(last = "Public", first = "John")  // выводит "John Public"
printName("Elton", last = "John")           // выводит "Elton John"
```

{% endtab %}

{% endtabs %}

Это полезно, когда два параметра имеют один и тот же тип и аргументы могут быть случайно перепутаны.

Обратите внимание, что именованные аргументы могут быть указаны в любом порядке.
Однако, если аргументы расположены не в порядке параметров метода (читается слева направо),
остальные аргументы должны быть названы.

В следующем примере именованные аргументы позволяют опустить параметр `middle`.
В случае ошибки, если первый аргумент не на своем месте, необходимо будет указать второй аргумент.

{% tabs named-arguments-when-error %}

{% tab 'Scala 2 и 3' for=named-arguments-when-error %}

```scala mdoc:fail
def printFullName(first: String, middle: String = "Q.", last: String): Unit =
  println(s"$first $middle $last")

printFullName(first = "John", last = "Public")      // выводит "John Q. Public"
printFullName("John", last = "Public")              // выводит "John Q. Public"
printFullName("John", middle = "Quincy", "Public")  // выводит "John Quincy Public"
printFullName(last = "Public", first = "John")      // выводит "John Q. Public"
printFullName(last = "Public", "John")              // ошибка: позиция после именованного аргумента
```

{% endtab %}

{% endtabs %}

Именованные аргументы работают при вызове Java методов, но только в том случае,
если используемая Java библиотека была скомпилирована с флагом `-parameters`.
