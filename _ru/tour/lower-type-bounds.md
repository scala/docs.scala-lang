---
layout: tour
title: Нижнее Ограничение Типа

discourse: true

partof: scala-tour

num: 21
language: ru
next-page: inner-classes
previous-page: upper-type-bounds
prerequisite-knowledge: upper-type-bounds, generics, variance

---

В то время как [верхнее ограничение типа](upper-type-bounds.html) ограничивает тип до подтипа стороннего типа, *нижнее ограничение типа* объявляют тип супертипом стороннего типа. Термин  `B >: A` выражает, то что параметр типа `B` или абстрактный тип `B` относится к супертипу типа `A`. В большинстве случаев `A` будет задавать тип класса, а `B` задавать тип метода.

Вот пример, где это полезно:

```scala mdoc:fail
trait Node[+B] {
  def prepend(elem: B): Node[B]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend(elem: B): ListNode[B] = ListNode(elem, this)
}
```

В данной программе реализован связанный список. `Nil` представляет пустой список. Класс `ListNode` - это узел, который содержит элемент типа `B` (`head`) и ссылку на остальную часть списка (`tail`). Класс `Node` и его подтипы ковариантны, потому что у нас указанно `+B`.

Однако эта программа _не компилируется_, потому что параметр `elem` в `prepend` имеет тип `B`, который мы объявили *ко*вариантным. Так это не работает, потому что функции *контр*вариантны в типах своих параметров и *ко*вариантны в типах своих результатов.

Чтобы исправить это, необходимо перевернуть вариантность типа параметра `elem` в `prepend`. Для этого мы вводим новый тип для параметра `U`, у которого тип `B` указан в качестве нижней границы типа.

```scala mdoc
trait Node[+B] {
  def prepend[U >: B](elem: U): Node[U]
}

case class ListNode[+B](h: B, t: Node[B]) extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
  def head: B = h
  def tail: Node[B] = t
}

case class Nil[+B]() extends Node[B] {
  def prepend[U >: B](elem: U): ListNode[U] = ListNode(elem, this)
}
```

Теперь мы можем сделать следующее:
```scala mdoc
trait Bird
case class AfricanSwallow() extends Bird
case class EuropeanSwallow() extends Bird


val africanSwallowList= ListNode[AfricanSwallow](AfricanSwallow(), Nil())
val birdList: Node[Bird] = africanSwallowList
birdList.prepend(EuropeanSwallow())
```
`Node[Bird]` может быть присвоен `africanSwallowList` , но затем может добавлять и `EuropeanSwallow`.
