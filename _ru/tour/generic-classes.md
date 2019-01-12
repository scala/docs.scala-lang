---
layout: tour
title: Обобщенные Классы

discourse: true

partof: scala-tour

num: 18
language: ru
next-page: variances
previous-page: for-comprehensions
assumed-knowledge: classes unified-types

---
Обобщенные классы - это классы, которые принимают тип в качестве параметра. Они особенно полезны для создания коллекций классов.

## Объявление обобщенного класса
Обобщенные классы принимают тип в качестве параметра в квадратных скобках `[]`. По соглашению обычно используют буквы `A` в качестве имени параметра типа, хотя можно использовать любое имя.
```tut
class Stack[A] {
  private var elements: List[A] = Nil
  def push(x: A) { elements = x :: elements }
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```
Данная реализация класса `Stack` принимает в качестве параметра любой тип `A`. Это означает что список, `var elements: List[A] = Nil`, может хранить только элементы типа `A`. Процедура `def push` принимает только объекты типа `A` (примечание:  `elements = x :: elements` переназначает `elements` в новый список, созданный путем добавления `x`а к текущим `elements`).

## Использование

Чтобы использовать обобщенный класс, поместите тип в квадратные скобки вместо `A`.
```
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop)  // выведет 2
println(stack.pop)  // выведет 1
```
Экземпляр `stack` может принимать только Ints. Однако, если тип имеет подтипы, то они также могут быть переданы:
```
class Fruit
class Apple extends Fruit
class Banana extends Fruit

val stack = new Stack[Fruit]
val apple = new Apple
val banana = new Banana

stack.push(apple)
stack.push(banana)
```
Классы `Apple` и `Banana` наследуются от `Fruit` так, что мы можем засунуть экземпляры `Apple` и `Banana` в пачку `Fruit`.

_Примечание: подтипы обобщенных типов - *инвариантны*. Это означает, что если у нас есть стэк символов типа `Stack[Char]`, то он не может быть использован как стек интов типа `Stack[Int]`. Это нежелательное поведение, потому как позволило бы нам добавлять в стек символов целые числа. В заключение, `Stack[A]` является подтипом `Stack[B]` тогда и только тогда, когда `B = A`. Поскольку это может быть довольно строгим ограничением, Scala предлагает [механизм вариативного описания параметров типа](variances.html) для контроля за поведением подтипов обобщенных типов._
