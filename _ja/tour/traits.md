---
layout: tour
title: トレイト
language: ja

discourse: true

partof: scala-tour

num: 5
next-page: tuples
previous-page: classes
topics: traits
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects

---

トレイトはクラス間でインターフェースとフィールドを共有するために使います。それらはJava 8のインターフェースと似ています。
クラスとオブジェクトはトレイトを継承することができますが、トレイトはインスタンス化ができません、したがってパラメータを持ちません。

## トレイトを定義する
最小のトレイトはキーワード `trait` と識別子だけというものです。

```scala mdoc
trait HairColor
```

トレイトはジェネリック型として、抽象メソッドとあわせて使うと特に便利です。
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

`trait Iterator[A]` を継承することは `A` 型と、`hasNext` と `next` メソッドの実装を必要とします。

## トレイトの使い方
トレイトを継承するには `extends` キーワードを使います。その際に、 `override` キーワードを利用しすべての抽象メンバーを実装します。
```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int =  {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
```
ここでの  `IntIterator` クラスは上限として引数 `to` を取ります。
`extends Iterator[Int]` は `next` メソッドは Int を返さなければならないことを意味します。

## サブタイピング
あるトレイトが必要とされている場所に、代りにそのトレイトのサブタイプを使うことができます。

```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // Prints Harry Sally
```
`trait Pet` が持つ抽象フィールド `name`は、Cat と Dog のコンストラクタで実装された。
最終行では、`Pet` トレイトの全てのサブタイプの中で実装される必要がある `pet.name` を呼んでいます。
