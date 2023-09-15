---
layout: tour
title: Верхнее Ограничение Типа
partof: scala-tour
categories: tour
num: 20
language: ru
next-page: lower-type-bounds
previous-page: variances
---

В Scala [параметры типа](generic-classes.html) и [члены абстрактного типа](abstract-type-members.html) могут быть ограничены определенными диапазонами. Такие диапазоны ограничивают конкретные значение типа и, возможно, предоставляют больше информации о членах таких типов. _Верхнее ограничение типа_ `T <: A` указывает на то что тип `T` относится к подтипу типа `A`.
Приведем пример, демонстрирующий верхнее ограничение для типа класса `PetContainer`:

{% tabs upper-type-bounds class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds %}

```scala mdoc
abstract class Animal {
 def name: String
}

abstract class Pet extends Animal {}

class Cat extends Pet {
  override def name: String = "Cat"
}

class Dog extends Pet {
  override def name: String = "Dog"
}

class Lion extends Animal {
  override def name: String = "Lion"
}

class PetContainer[P <: Pet](p: P) {
  def pet: P = p
}

val dogContainer = new PetContainer[Dog](new Dog)
val catContainer = new PetContainer[Cat](new Cat)
```

{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds %}

```scala
abstract class Animal:
  def name: String

abstract class Pet extends Animal

class Cat extends Pet:
  override def name: String = "Cat"

class Dog extends Pet:
  override def name: String = "Dog"

class Lion extends Animal:
  override def name: String = "Lion"

class PetContainer[P <: Pet](p: P):
  def pet: P = p

val dogContainer = PetContainer[Dog](Dog())
val catContainer = PetContainer[Cat](Cat())
```

{% endtab %}
{% endtabs %}

{% tabs upper-type-bounds_error class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds_error %}

```scala mdoc:fail
// это не скомпилируется
val lionContainer = new PetContainer[Lion](new Lion)
```

{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds_error %}

```scala
// это не скомпилируется
val lionContainer = PetContainer[Lion](Lion())
```

{% endtab %}
{% endtabs %}

Класс `PetContainer` принимает тип `P`, который должен быть подтипом `Pet`. `Dog` и `Cat` - это подтипы `Pet`, поэтому мы можем создать новые `PetContainer[Dog]` и `PetContainer[Cat]`. Однако, если мы попытаемся создать `PetContainer[Lion]`, то получим следующую ошибку:

`type arguments [Lion] do not conform to class PetContainer's type parameter bounds [P <: Pet]`

Это потому, что `Lion` не является подтипом `Pet`.
