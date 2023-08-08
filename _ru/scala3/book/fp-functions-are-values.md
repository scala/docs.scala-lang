---
layout: multipage-overview
title: Функции — это значения
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: section
description: В этом разделе рассматривается использование функций в качестве значений в функциональном программировании.
language: ru
num: 45
previous-page: fp-pure-functions
next-page: fp-functional-error-handling
---


Хотя каждый когда-либо созданный язык программирования, вероятно, позволяет писать чистые функции, 
вторая важная особенность ФП на Scala заключается в том, что _функции можно создавать как значения_, 
точно так же, как создаются значения `String` и `Int`.

Эта особенность даёт много преимуществ, опишем наиболее распространенные из них:
(a) можно определять методы, принимающие в качестве параметров функции
и (b) можно передавать функции в качестве параметров в методы.

Такой подход можно было наблюдать в предыдущих главах, когда демонстрировались такие методы, как `map` и `filter`:

{% tabs fp-function-as-values-anonymous %}

{% tab 'Scala 2 и 3' %}
```scala
val nums = (1 to 10).toList

val doubles = nums.map(_ * 2)           // удваивает каждое значение
val lessThanFive = nums.filter(_ < 5)   // List(1,2,3,4)
```
{% endtab %}

{% endtabs %}

В этих примерах анонимные функции передаются в `map` и `filter`.

> Анонимные функции также известны как _лямбды_ (_lambdas_).

Помимо передачи анонимных функций в `filter` и `map`, в них также можно передать _методы_:

{% tabs fp-function-as-values-defined %}

{% tab 'Scala 2 и 3' %}
```scala
// два метода
def double(i: Int): Int = i * 2
def underFive(i: Int): Boolean = i < 5

// передача этих методов в filter и map
val doubles = nums.filter(underFive).map(double)
```
{% endtab %}

{% endtabs %}

Возможность обращаться с методами и функциями как со значениями — мощное свойство, 
предоставляемое языками функционального программирования.

> Технически функция, которая принимает другую функцию в качестве входного параметра, известна как _функция высшего порядка_.
> (Если вам нравится юмор, как кто-то однажды написал, это все равно, что сказать, 
> что класс, который принимает экземпляр другого класса в качестве параметра конструктора, 
> является классом высшего порядка.)


## Функции, анонимные функции и методы

В примерах выше анонимная функция это:

{% tabs fp-anonymous-function-short %}

{% tab 'Scala 2 и 3' %}
```scala
_ * 2
```
{% endtab %}

{% endtabs %}

Как было показано в обсуждении [функций высшего порядка][hofs], `_ * 2` - сокращенная версия синтаксиса:

{% tabs fp-anonymous-function-full %}

{% tab 'Scala 2 и 3' %}
```scala
(i: Int) => i * 2
```
{% endtab %}

{% endtabs %}

Такие функции называются “анонимными”, потому что им не присваивается определенное имя. 
Для того чтобы это имя задать, достаточно просто присвоить его переменной:

{% tabs fp-function-assignement %}

{% tab 'Scala 2 и 3' %}
```scala
val double = (i: Int) => i * 2
```
{% endtab %}

{% endtabs %}

Теперь появилась именованная функция, назначенная переменной `double`. 
Можно использовать эту функцию так же, как используется метод:

{% tabs fp-function-used-like-method %}

{% tab 'Scala 2 и 3' %}
```scala
double(2)   // 4
```
{% endtab %}

{% endtabs %}

В большинстве случаев не имеет значения, является ли `double` функцией или методом; 
Scala позволяет обращаться с ними одинаково. 
За кулисами технология Scala, которая позволяет обращаться с методами так же, 
как с функциями, известна как [Eta Expansion][eta].

Эта способность беспрепятственно передавать функции в качестве переменных 
является отличительной чертой функциональных языков программирования, таких как Scala. 
И, как было видно на примерах `map` и `filter`, 
возможность передавать функции в другие функции помогает создавать код, 
который является кратким и при этом читабельным — _выразительным_.

Вот еще несколько примеров:

{% tabs fp-function-as-values-example %}

{% tab 'Scala 2 и 3' %}
```scala
List("bob", "joe").map(_.toUpperCase)   // List(BOB, JOE)
List("bob", "joe").map(_.capitalize)    // List(Bob, Joe)
List("plum", "banana").map(_.length)    // List(4, 6)

val fruits = List("apple", "pear")
fruits.map(_.toUpperCase)       // List(APPLE, PEAR)
fruits.flatMap(_.toUpperCase)   // List(A, P, P, L, E, P, E, A, R)

val nums = List(5, 1, 3, 11, 7)
nums.map(_ * 2)         // List(10, 2, 6, 22, 14)
nums.filter(_ > 3)      // List(5, 11, 7)
nums.takeWhile(_ < 6)   // List(5, 1, 3)
nums.sortWith(_ < _)    // List(1, 3, 5, 7, 11)
nums.sortWith(_ > _)    // List(11, 7, 5, 3, 1)

nums.takeWhile(_ < 6).sortWith(_ < _)   // List(1, 3, 5)
```
{% endtab %}

{% endtabs %}


[hofs]: {% link _overviews/scala3-book/fun-hofs.md %}
[eta]: {% link _overviews/scala3-book/fun-eta-expansion.md %}
