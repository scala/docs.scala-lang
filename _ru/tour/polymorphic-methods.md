---
layout: tour
title: Полиморфные методы
partof: scala-tour
num: 28
language: ru
next-page: type-inference
previous-page: implicit-conversions
prerequisite-knowledge: unified-types
---

Также как и у обобщенных классов, у методов есть полиморфизм по типу, с таким же синтаксисом (параметр типа указывается в квадратных скобках сразу после названия метода).

Вот пример:

{% tabs polymorphic-methods_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=polymorphic-methods_1 %}

```scala mdoc
def listOfDuplicates[A](x: A, length: Int): List[A] = {
  if (length < 1)
    Nil
  else
    x :: listOfDuplicates(x, length - 1)
}
println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

{% endtab %}
{% tab 'Scala 3' for=polymorphic-methods_1 %}

```scala
def listOfDuplicates[A](x: A, length: Int): List[A] =
  if length < 1 then
    Nil
  else
    x :: listOfDuplicates(x, length - 1)

println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

{% endtab %}
{% endtabs %}

Метод `listOfDuplicates` принимает параметр типа `A` и параметры значений `x` и `length`. Значение `x` имеет тип `A`. Если `length < 1` мы возвращаем пустой список. В противном случае мы добавляем `x`к списку, которые возвращаем через рекурсивный вызовов. (Обратите внимание, что `::` означает добавление элемента слева к списку справа).

В первом вызове метода мы явно указываем параметр типа, записывая `[Int]`. Поэтому первым аргументом должен быть `Int` и тип возвращаемого значения будет `List[Int]`.

Во втором вызове показано, что вам не всегда нужно явно указывать параметр типа. Часто компилятор сам может вывести тип исходя из контекста или типа передаваемых аргументов. В этом варианте `"La"` - это `String`, поэтому компилятор знает, что `A` должен быть `String`.
