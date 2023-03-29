---
layout: multipage-overview
title: Eta расширение
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: На этой странице обсуждается Eta Expansion, технология Scala, которая автоматически и прозрачно преобразует методы в функции.
language: ru
num: 30
previous-page: fun-function-variables
next-page: fun-hofs
---


Если посмотреть на Scaladoc для метода `map` в классах коллекций Scala, 
то можно увидеть, что метод определен для приема _функции_:

```scala
def map[B](f: (A) => B): List[B]
           -----------
```

Действительно, в Scaladoc сказано: “`f` — это _функция_, применяемая к каждому элементу”. 
Но, несмотря на это, каким-то образом в `map` можно передать _метод_, и он все еще работает:

```scala
def times10(i: Int) = i * 10   // метод
List(1, 2, 3).map(times10)     // List(10,20,30)
```

Как это работает? Как можно передать _метод_ в `map`, который ожидает _функцию_?

Технология, стоящая за этим, известна как _Eta Expansion_. 
Она преобразует выражение _типа метода_ в эквивалентное выражение _типа функции_, и делает это легко и незаметно.


## Различия между методами и функциями

Исторически _методы_ были частью определения класса, хотя в Scala 3 методы могут быть вне классов, 
такие как [определения верхнего уровня][toplevel] и [методы расширения][extension].

В отличие от методов, _функции_ сами по себе являются полноценными объектами, что делает их объектами первого класса.

Их синтаксис также отличается. 
В этом примере показано, как задать метод и функцию, которые выполняют одну и ту же задачу, 
определяя, является ли заданное целое число четным:

```scala
def isEvenMethod(i: Int) = i % 2 == 0         // метод
val isEvenFunction = (i: Int) => i % 2 == 0   // функция
```

Функция действительно является объектом, поэтому ее можно использовать так же, 
как и любую другую переменную, например, помещая в список:

```scala
val functions = List(isEvenFunction)
```

И наоборот, технически метод не является объектом, поэтому в Scala 2 метод нельзя было поместить в `List`, 
по крайней мере, напрямую, как показано в этом примере:

```scala
// В этом примере показано сообщение об ошибке в Scala 2
val methods = List(isEvenMethod)
                   ^
error: missing argument list for method isEvenMethod
Unapplied methods are only converted to functions when a function type is expected.
You can make this conversion explicit by writing `isEvenMethod _` or `isEvenMethod(_)` instead of `isEvenMethod`.
```

Как показано в этом сообщении об ошибке, в Scala 2 существует ручной способ преобразования метода в функцию, 
но важной частью для Scala 3 является то, что технология Eta Expansion улучшена, 
поэтому теперь, когда попытаться использовать метод в качестве переменной, 
он просто работает — не нужно самостоятельно выполнять ручное преобразование:

```scala
val functions = List(isEvenFunction)   // работает
val methods = List(isEvenMethod)       // работает
```

Для целей этой вводной книги важно знать следующее:

- Eta Expansion — технология Scala, позволяющая использовать методы так же, как и функции
- Технология была улучшена в Scala 3, чтобы быть почти полностью бесшовной

Дополнительные сведения о том, как это работает, см. на [странице Eta Expansion][eta_expansion] в справочной документации.

[eta_expansion]: {{ site.scala3ref }}/changed-features/eta-expansion.html
[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
