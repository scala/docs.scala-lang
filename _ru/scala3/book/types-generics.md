---
layout: multipage-overview
title: Параметризованные типы
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе представлены параметризованные типы в Scala 3.
language: ru
num: 49
previous-page: types-inferred
next-page:
---

Универсальные (_generic_) классы (или trait-ы) принимают тип в качестве _параметра_ в квадратных скобках `[...]`.
Для обозначения параметров типа согласно конвенции Scala используется одна заглавная буква (например, `A`).
Затем этот тип можно использовать внутри класса по мере необходимости
для параметров экземпляра метода или для возвращаемых типов:

{% tabs stack class=tabs-scala-version %}

{% tab 'Scala 2' %}

```scala
// здесь мы объявляем параметр типа A
//          v
class Stack[A] {
  private var elements: List[A] = Nil
  //                         ^
  //  здесь мы ссылаемся на этот тип
  //          v
  def push(x: A): Unit =
    elements = elements.prepended(x)
  def peek: A = elements.head
  def pop(): A = {
    val currentTop = peek
    elements = elements.tail
    currentTop
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
// здесь мы объявляем параметр типа A
//          v
class Stack[A]:
  private var elements: List[A] = Nil
  //                         ^
  //  здесь мы ссылаемся на этот тип
  //          v
  def push(x: A): Unit =
    elements = elements.prepended(x)
  def peek: A = elements.head
  def pop(): A =
    val currentTop = peek
    elements = elements.tail
    currentTop
```

{% endtab %}
{% endtabs %}

Эта реализация класса `Stack` принимает любой тип в качестве параметра.
Прелесть параметризованных типов состоит в том,
что теперь можно создавать `Stack[Int]`, `Stack[String]` и т.д.,
что позволяет повторно использовать реализацию `Stack` для произвольных типов элементов.

Пример создания и использования `Stack[Int]`:

{% tabs stack-usage class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val stack = new Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // выводит 2
println(stack.pop())  // выводит 1
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
val stack = Stack[Int]
stack.push(1)
stack.push(2)
println(stack.pop())  // выводит 2
println(stack.pop())  // выводит 1
```

{% endtab %}
{% endtabs %}

> Подробности о том, как выразить вариантность с помощью универсальных типов,
> см. в разделе ["Вариантность"][variance].

[variance]: {% link _overviews/scala3-book/types-variance.md %}
