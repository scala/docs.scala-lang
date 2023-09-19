---
layout: multipage-overview
title: Классы типов
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этой главе демонстрируется создание и использование классов типов.
language: ru
num: 64
previous-page: ca-given-imports
next-page: ca-multiversal-equality
---

Класс типов (_type class_) — это абстрактный параметризованный тип,
который позволяет добавлять новое поведение к любому закрытому типу данных без использования подтипов.
Если вы пришли с Java, то можно думать о классах типов как о чем-то вроде [`java.util.Comparator[T]`][comparator].

> В статье ["Type Classes as Objects and Implicits"][typeclasses-paper] (2010 г.) обсуждаются основные идеи,
> лежащие в основе классов типов в Scala.
> Несмотря на то, что в статье используется более старая версия Scala, идеи актуальны и по сей день.

Этот стиль программирования полезен во многих случаях, например:

- выражение того, как тип, которым вы не владеете, например, из стандартной или сторонней библиотеки, соответствует такому поведению
- добавление поведения к нескольким типам без введения отношений подтипов между этими типами (например, когда один расширяет другой)

Классы типов — это трейты с одним или несколькими параметрами,
реализации которых предоставляются в виде экземпляров `given` в Scala 3 или `implicit` значений в Scala 2.

## Пример

Например, `Show` - хорошо известный класс типов в Haskell, и в следующем коде показан один из способов его реализации в Scala.
Если предположить, что классы Scala не содержат метода `toString`, то можно определить класс типов `Show`,
чтобы добавить это поведение к любому типу, который вы хотите преобразовать в пользовательскую строку.

### Класс типов

Первым шагом в создании класса типов является объявление параметризованного trait, содержащего один или несколько абстрактных методов.
Поскольку `Showable` содержит только один метод с именем `show`, он записывается так:

{% tabs 'definition' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
// класс типов
trait Showable[A] {
  def show(a: A): String
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
// класс типов
trait Showable[A]:
  extension (a: A) def show: String
```

{% endtab %}
{% endtabs %}

Обратите внимание, что этот подход близок к обычному объектно-ориентированному подходу,
когда обычно trait `Show` определяется следующим образом:

{% tabs 'trait' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
// a trait
trait Show {
  def show: String
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
// a trait
trait Show:
  def show: String
```

{% endtab %}
{% endtabs %}

Следует отметить несколько важных моментов:

1. Классы типов, например, `Showable` принимают параметр типа `A`, чтобы указать, для какого типа мы предоставляем реализацию `show`;
   в отличие от классических трейтов, наподобие `Show`.
2. Чтобы добавить функциональность `show` к определенному типу `A`, классический трейт требует наследования `A extends Show`,
   в то время как для классов типов нам требуется реализация `Showable[A]`.
3. В Scala 3, чтобы разрешить один и тот же синтаксис вызова метода в обоих случаях `Showable`,
   который имитирует синтаксис `Show`, мы определяем `Showable.show` как метод расширения.

### Реализация конкретных экземпляров

Следующий шаг — определить, какие классы `Showable` должны работать в вашем приложении, а затем реализовать для них это поведение.
Например, для реализации `Showable` следующего класса `Person`:

{% tabs 'person' %}
{% tab 'Scala 2 и 3' %}

```scala
case class Person(firstName: String, lastName: String)
```

{% endtab %}
{% endtabs %}

необходимо определить одно _каноническое значение_ типа `Showable[Person]`, т.е. экземпляр `Showable` для типа `Person`,
как показано в следующем примере кода:

{% tabs 'instance' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
implicit val showablePerson: Showable[Person] = new Showable[Person] {
  def show(p: Person): String =
    s"${p.firstName} ${p.lastName}"
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
given Showable[Person] with
  extension (p: Person) def show: String =
    s"${p.firstName} ${p.lastName}"
```

{% endtab %}
{% endtabs %}

### Использование класса типов

Теперь вы можете использовать этот класс типов следующим образом:

{% tabs 'usage' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val person = Person("John", "Doe")
println(showablePerson.show(person))
```

Обратите внимание, что на практике классы типов обычно используются со значениями, тип которых неизвестен,
в отличие от type `Person`, как показано в следующем разделе.

{% endtab %}
{% tab 'Scala 3' %}

```scala
val person = Person("John", "Doe")
println(person.show)
```

{% endtab %}
{% endtabs %}

Опять же, если бы в Scala не было метода `toString`, доступного для каждого класса, вы могли бы использовать эту технику,
чтобы добавить поведение `Showable` к любому классу, который вы хотите преобразовать в `String`.

### Написание методов, использующих класс типов

Как и в случае с наследованием, вы можете определить методы, которые используют `Showable` в качестве параметра типа:

{% tabs 'method' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
def showAll[A](as: List[A])(implicit showable: Showable[A]): Unit =
  as.foreach(a => println(showable.show(a)))

showAll(List(Person("Jane"), Person("Mary")))
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
def showAll[A: Showable](as: List[A]): Unit =
  as.foreach(a => println(a.show))

showAll(List(Person("Jane"), Person("Mary")))
```

{% endtab %}
{% endtabs %}

### Класс типов с несколькими методами

Обратите внимание: если вы хотите создать класс типов с несколькими методами, исходный синтаксис выглядит следующим образом:

{% tabs 'multiple-methods' class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait HasLegs[A] {
  def walk(a: A): Unit
  def run(a: A): Unit
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
trait HasLegs[A]:
  extension (a: A)
    def walk(): Unit
    def run(): Unit
```

{% endtab %}
{% endtabs %}

### Пример из реального мира

В качестве примера из реального мира, как классы типов используются в Scala 3,
см. обсуждение `CanEqual` в [разделе Multiversal Equality][multiversal].

[typeclasses-paper]: https://infoscience.epfl.ch/record/150280/files/TypeClasses.pdf

[typeclasses-chapter]: {% link _overviews/scala3-book/ca-type-classes.md %}
[comparator]: https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
