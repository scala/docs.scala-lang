---
layout: tour
title: Именованные Аргументы

discourse: true

partof: scala-tour

num: 34
language: ru
next-page: packages-and-imports
previous-page: default-parameter-values
prerequisite-knowledge: function-syntax

---

При вызове методов можно конкретно указывать название задаваемого аргумента следующим образом:

```scala mdoc
def printName(first: String, last: String): Unit = {
  println(first + " " + last)
}

printName("John", "Smith")  // Prints "John Smith"
printName(first = "John", last = "Smith")  // Prints "John Smith"
printName(last = "Smith", first = "John")  // Prints "John Smith"
```
Обратите внимание, что при указании имени параметра, порядок аргумента может быть изменен. Однако если какие-то аргументы именованного, а другие нет, то аргументы без имени должны стоять на первом месте и располагаться в том порядке, в котором описаны параметры метода.

```scala mdoc:fail
printName(last = "Smith", "john") // ошибка: позиция после именованного аргумента
```

Обратите внимание, что именованные аргументы не работают при вызове Java методов.
