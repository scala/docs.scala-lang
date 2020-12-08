---
layout: tour
title: Составные Типы

discourse: true

partof: scala-tour

num: 24
language: ru
next-page: self-types
previous-page: abstract-type-members

---

Иногда необходимо выразить, то что тип объекта является подтипом нескольких других типов. В Scala это можно выразить с помощью *составных типов*, которые являются объединением нескольких типов объектов.

Предположим, у нас есть два трейта: `Cloneable` и `Resetable`:

```scala mdoc
trait Cloneable extends java.lang.Cloneable {
  override def clone(): Cloneable = {
    super.clone().asInstanceOf[Cloneable]
  }
}
trait Resetable {
  def reset: Unit
}
```

Теперь предположим, что мы хотим написать функцию `cloneAndReset`, которая берет объект, клонирует его и сбрасывает (Reset) состояние исходного объекта:

```
def cloneAndReset(obj: ?): Cloneable = {
  val cloned = obj.clone()
  obj.reset
  cloned
}
```

Возникает вопрос, какой тип параметр `obj` должна принимать наша объединённая функция. Если это `Cloneable`, то объект может использовать метод `clone`, но не `reset`; если это `Resetable` мы можем использовать метод `reset`, но нет операции `clone`. Чтобы избежать приведения типа в такой ситуации, мы можем указать, что тип `obj` является и `Cloneable`, и `Resetable`. Этот совместный тип в Scala записывается как: `Cloneable with Resetable`.

Вот обновленная функция:

```
def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
  //...
}
```

Составные типы могут состоять из нескольких типов объектов, и они могут содержать единый доработанный объект, в котором будут доработаны характеристики существующих членов объекта.
Общая форма записи: `A with B with C ... { доработанный объект }`

Пример использования таких доработок приведен на странице об [объединении классов с примесями](mixin-class-composition.html).
