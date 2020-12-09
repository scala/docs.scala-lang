---
layout: tour
title: 抽象型メンバー
language: ja

discourse: true

partof: scala-tour
num: 23
next-page: compound-types
previous-page: inner-classes
topics: abstract type members
prerequisite-knowledge: variance, upper-type-bound

---

トレイトや抽象クラスのような抽象型は抽象型メンバーを持つことができます。
これは具体的な実装で実際の型を定義するという意味です。
こちらが例です。

```scala mdoc
trait Buffer {
  type T
  val element: T
}
```
こちらでは、抽象型`type T`を定義しています。それは`element`の型を記述するために使われます。このトレイトを抽象クラスで継承し、より具体的にするために上限型境界を`T`に追加することができます。

```scala mdoc
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
`T`の上限型境界の定義に出てきた、更に別の抽象型`U`の使い方に気をつけてください。この`class SeqBuffer`はこのバッファーの中にシーケンスのみを保持することができます。それは型`T`は新しい抽象型`U`を使った`Seq[U]`のサブタイプであると記述しているからです。

抽象型メンバーを持つトレイトと[クラス](classes.html)は無名クラスのインスタンス化と組み合わせてよく使われます。
これを説明するために、今から整数のリストを参照するシーケンスバッファーを扱うプログラムを見てみます。

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
ここで、ファクトリー`newIntSeqBuf`は抽象型`T`を具体的な型`List[Int]`に設定するために、`IntSeqBuf`(つまり`new IntSeqBuffer`)を無名クラスで実装します。

抽象型メンバーをクラスの型パラメータに変えることも、その逆も可能です。以下は上記コードの型パラメータのみを使うバージョンです。

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
ここでは(`+T <: Seq[U]`)をメソッド`newIntSeqBuf`から戻されるオブジェクトの具体的なシーケンス実装の型を隠すために [変位指定アノテーション](variances.html)を使わなければなりません。さらに、抽象型メンバをパラメータで置換することができないケースがあります。
