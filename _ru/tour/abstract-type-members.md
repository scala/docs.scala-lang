---
layout: tour
title: Члены Абстрактного Типа

discourse: true

partof: scala-tour
num: 23
language: ru
next-page: compound-types
previous-page: inner-classes
topics: abstract type members
prerequisite-knowledge: variance, upper-type-bound

---

Абстрактные типы, такие как трейты и абстрактные классы, которые могут содержать членов абстрактного типа.
Это означает, что только конкретный экземпляр определяет, каким именно будет этот тип.
Вот пример:

```tut
trait Buffer {
  type T
  val element: T
}
```
Здесь мы определили абстрактный вариант тип `T`, который используется для описания типа `element`. Мы можем расширить его в абстрактном классе, добавив верхнюю границу связанного с `T` типа, чтобы сделать его более конкретным.

```tut
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
Обратите внимание, как мы можем использовать еще один абстрактный тип `type U` в качестве верхней границы типа. Класс `SeqBuffer` позволяет хранить в буфере только последовательности, указывая, что тип `T` должен быть подтипом `Seq[U]` для нового абстрактного типа `U`.

[Трейты](traits.html) или [классы](classes.html) с абстрактными членами типа часто используются в сочетании с анонимными экземплярами классов. Чтобы проиллюстрировать это рассмотрим программу, которая имеет дело с буфером, который ссылается на список целых чисел:

```tut
abstract class IntSeqBuffer extends SeqBuffer {
  type U = Int
}


def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
  new IntSeqBuffer {
       type T = List[U]
       val element = List(elem1, elem2)
     }
val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```
Здесь класс `newIntSeqBuf` является создателем экземпляров `IntSeqBuffer`, использует анонимную реализацию класса `IntSeqBuffer` (т.е. `new IntSeqBuffer`), устанавливая тип `T` как `List[Int]`.

Мы можем выводить тип класса из типа его членов и наоборот наоборот. Приведем версию кода, в которой выводится тип класса из типа его члена:

```tut
abstract class Buffer[+T] {
  val element: T
}
abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
  def length = element.length
}

def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
  new SeqBuffer[Int, List[Int]] {
    val element = List(e1, e2)
  }

val buf = newIntSeqBuf(7, 8)
println("length = " + buf.length)
println("content = " + buf.element)
```

Обратите внимание, что здесь нам необходимо использовать [вариантность в описании типа](variances.html) (`+T <: Seq[U]`) для того, чтобы скрыть конкретный тип реализации последовательности объектов, возвращаемых из метода `newIntSeqBuf`. 