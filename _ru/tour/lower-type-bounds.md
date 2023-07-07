---
layout: tour
title: Нижнее Ограничение Типа
partof: scala-tour
num: 21
language: ru
next-page: inner-classes
previous-page: upper-type-bounds
prerequisite-knowledge: upper-type-bounds, generics, variance
---

В то время как [верхнее ограничение типа](upper-type-bounds.html) ограничивает тип до подтипа стороннего типа, _нижнее ограничение типа_ объявляют тип супертипом стороннего типа. Термин `B >: A` выражает, то что параметр типа `B` или абстрактный тип `B` относится к супертипу типа `A`. В большинстве случаев `A` будет задавать тип класса, а `B` задавать тип метода.

Вот пример, где это полезно:

{% tabs upper-type-bounds_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds_1 %}

```scala mdoc:fail
trait List[+A] {
  def prepend(elem: A): NonEmptyList[A] = NonEmptyList(elem, this)
}

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```

{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds_1 %}

```scala
trait List[+A]:
  def prepend(elem: A): NonEmptyList[A] = NonEmptyList(elem, this)

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```

{% endtab %}
{% endtabs %}

В данной программе реализован связанный список. `Nil` представляет пустой список. Класс `NonEmptyList` - это узел, который содержит элемент типа `A` (`head`) и ссылку на остальную часть списка (`tail`). `trait List` и его подтипы ковариантны, потому что у нас указанно `+A`.

Однако эта программа _не компилируется_, потому что параметр `elem` в `prepend` имеет тип `A`, который мы объявили *ко*вариантным. Так это не работает, потому что функции *контр*вариантны в типах своих параметров и *ко*вариантны в типах своих результатов.

Чтобы исправить это, необходимо перевернуть вариантность типа параметра `elem` в `prepend`. Для этого мы вводим новый тип для параметра `B`, у которого тип `A` указан в качестве нижней границы типа.

{% tabs upper-type-bounds_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=upper-type-bounds_2 %}

```scala mdoc
trait List[+A] {
  def prepend[B >: A](elem: B): NonEmptyList[B] = NonEmptyList(elem, this)
}

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```

{% endtab %}
{% tab 'Scala 3' for=upper-type-bounds_2 %}

```scala
trait List[+A]:
  def prepend[B >: A](elem: B): NonEmptyList[B] = NonEmptyList(elem, this)

case class NonEmptyList[+A](head: A, tail: List[A]) extends List[A]

object Nil extends List[Nothing]
```

{% endtab %}
{% endtabs %}

Теперь мы можем сделать следующее:

{% tabs upper-type-bounds_3 %}
{% tab 'Scala 2 и 3' for=upper-type-bounds_3 %}

```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird

val africanSwallows: List[AfricanSwallow] = Nil.prepend(AfricanSwallow())
val swallowsFromAntarctica: List[Bird] = Nil
val someBird: Bird = EuropeanSwallow()

// присвоить птицам (birds) африканских ласточек (swallows)
val birds: List[Bird] = africanSwallows

// добавляем новую птицу к африканским ласточкам, `B` - это `Bird`
val someBirds = africanSwallows.prepend(someBird)

// добавляем европейскую ласточку к птицам
val moreBirds = birds.prepend(EuropeanSwallow())

// соединяем вместе различных ласточек, `B` - это `Bird`, потому что это общий супертип для обоих типов ласточек
val allBirds = africanSwallows.prepend(EuropeanSwallow())

// но тут ошибка! добавление списка птиц слишком расширяет тип аргументов. -Xlint предупредит!
val error = moreBirds.prepend(swallowsFromAntarctica)    // List[Object]
```

{% endtab %}
{% endtabs %}

Параметр ковариантного типа позволяет `birds` получать значение `africanSwallows`.

Тип, связанный с параметром типа `prepend`, позволяет добавлять различные разновидности ласточек и получать более абстрактный тип: вместо `List[AfricanSwallow]`, мы получаем `List[Bird]`.

Используйте `-Xlint`, чтобы предупредить, если аргумент предполагаемого типа слишком абстрактен.
