---
layout: tour
title: Составные Типы
partof: scala-tour
num: 24
language: ru
next-page: self-types
previous-page: abstract-type-members
---

Иногда необходимо выразить, то что тип объекта является подтипом нескольких других типов.

В Scala это можно выразить с помощью _типов пересечений_ (или _составных типов_ в Scala 2),
которые являются объединением нескольких типов объектов.

Предположим, у нас есть два трейта: `Cloneable` и `Resetable`:

{% tabs compound-types_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_1 %}

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = { // создает публичный метод 'clone'
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

{% endtab %}
{% tab 'Scala 3' for=compound-types_1 %}

```scala
trait Cloneable extends java.lang.Cloneable:
  override def clone(): Cloneable =  // создает публичный метод 'clone'
    super.clone().asInstanceOf[Cloneable]
trait Resetable:
  def reset: Unit
```

{% endtab %}
{% endtabs %}

Теперь предположим, что мы хотим написать функцию `cloneAndReset`, которая берет объект, клонирует его и сбрасывает (Reset) состояние исходного объекта:

{% tabs compound-types_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_2 %}

```scala mdoc:fail
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

{% endtab %}
{% tab 'Scala 3' for=compound-types_2 %}

```scala
def cloneAndReset(obj: ?): Cloneable =
  val cloned = obj.clone()
  obj.reset
  cloned
```

{% endtab %}
{% endtabs %}

Возникает вопрос, какой тип параметра `obj` должна принимать наша объединённая функция. Если это `Cloneable`, то объект может использовать метод `clone`, но не `reset`; если это `Resetable` мы можем использовать метод `reset`, но нет операции `clone`. Чтобы избежать приведения типа в такой ситуации, мы можем указать, что тип `obj` является и `Cloneable`, и `Resetable`.

{% tabs compound-types_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=compound-types_3 %}
Этот совместный тип в Scala записывается как: `Cloneable with Resetable`.

Вот обновленная функция:

```scala mdoc:fail
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

Обратите внимание, что у вас может быть более двух типов: `A with B with C with ...`.
Это означает то же самое, что и: `(...(A with B) with C) with ... )`

{% endtab %}
{% tab 'Scala 3' for=compound-types_3 %}
Этот совместный тип в Scala записывается как: `Cloneable & Resetable`.

Вот обновленная функция:

```scala
def cloneAndReset(obj: Cloneable & Resetable): Cloneable = {
  //...
}
```

Обратите внимание, что у вас может быть более двух типов: `A & B & C & ...`.
`&` является ассоциативным, поэтому скобки могут быть добавлены вокруг любой части без изменения значения.
{% endtab %}
{% endtabs %}
