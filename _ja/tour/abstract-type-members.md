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

redirect_from: "/tutorials/tour/abstract-types.html"
redirect_from: "/tour/abstract-types.html"
---

トレイトや抽象クラスのような抽象型は抽象型メンバーを持つことができます。
これは具体的な実装で実際の型を定義するという意味です。
こちらが例です。

```tut
trait Buffer {
  type T
  val element: T
}
```
こちらでは、抽象型`type T`を定義しています。それは`element`の型を記述するために使われます。このトレイトを抽象クラスで継承し、より具体的にするために上限型境界を`T`に追加することができます。

```tut
abstract class SeqBuffer extends Buffer {
  type U
  type T <: Seq[U]
  def length = element.length
}
```
`T`の上限型境界の定義に出てきた、更に別の抽象型`U`の使い方に気をつけてください。

この`class SeqBuffer`はバッファーの中のシーケンスのみを保存することができます。それは新しい抽象型`U`により型`T`は`Seq[U]`のサブタイプである必要があることを明言しているからです。

抽象型メンバーを持つトレイトと[クラス](classes.html)は無名クラスのインスタンス化と組み合わせてよく使います。
これを説明するために、今から整数のリストを参照するシーケンスバッファーを扱うプログラムを見てみます。

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
こちらでは抽象型`T`を具体的な型`List[Int]`に設定するために、ファクトリー`newIntSeqBuf`は`IntSeqBuf`(つまり`new IntSeqBuffer`)の無名クラスの実装を使います。

これにより抽象型メンバーをクラスの型パラメータに変換したり、その逆も可能となります。以下は上記コードの型パラメータのみを使うバージョンです。

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
ここでは(`+T <: Seq[U]`)をメソッド`newIntSeqBuf`から戻されるオブジェクトの具体的なシーケンス実装の型を隠すために [変位指定アノテーション](variances.html)を使わなければなりません。さらに、抽象型メンバをパラメータで置換することができないケースがあります。
