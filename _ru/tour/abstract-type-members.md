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

Абстрактные типы, такие как трейты и абстрактные классы, могут содержать членов абстрактного типа.
Абстрактный означает, что только конкретный экземпляр определяет, каким именно будет тип.
Вот пример:

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```
Здесь мы определили абстрактный тип `T`, который используется для описания типа члена `element`. Мы можем расширить его в абстрактном классе, добавив верхнюю границу нового типа `U` связанного с `T`, делая описание типа более конкретным.

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
Обратите внимание, как мы можем использовать новый абстрактный тип `U` в качестве верхней границы типа. Класс `SeqBuffer` позволяет хранить в буфере только последовательности, указывая, что тип `T` должен быть подтипом `Seq[U]` для нового абстрактного типа `U`.

[Трейты](traits.html) или [классы](classes.html) с членами абстрактного типа часто используются в сочетании с анонимными экземплярами классов. Чтобы проиллюстрировать это рассмотрим программу, которая имеет дело с буфером, который ссылается на список целых чисел:

```scala mdoc
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
Здесь класс `newIntSeqBuf` создает экземпляры `IntSeqBuffer`, используя анонимную реализацию класса `IntSeqBuffer` (т.е. `new IntSeqBuffer`), устанавливая тип `T` как `List[Int]`.

Мы можем вывести тип класса из типа его членов и наоборот. Приведем версию кода, в которой выводится тип класса из типа его члена:

```scala mdoc:nest
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

Обратите внимание, что здесь необходимо использовать [вариантность в описании типа](variances.html) (`+T <: Seq[U]`) для того, чтобы скрыть конкретный тип реализации списка, возвращаемого из метода `newIntSeqBuf`. 
