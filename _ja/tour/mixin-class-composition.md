---
layout: tour
title: ミックスインを用いたクラス合成
language: ja

discourse: true

partof: scala-tour

num: 7
next-page: higher-order-functions
previous-page: tuples
prerequisite-knowledge: inheritance, traits, abstract-classes, unified-types

---
ミックスインはクラスを構成するのに使われるトレイトです。

```scala mdoc
abstract class A {
  val message: String
}
class B extends A {
  val message = "I'm an instance of class B"
}
trait C extends A {
  def loudMessage = message.toUpperCase()
}
class D extends B with C

val d = new D
println(d.message)  // I'm an instance of class B
println(d.loudMessage)  // I'M AN INSTANCE OF CLASS B
```
クラス`D`は スーパークラスを`B` とし、 ミックスイン`C`を持ちます。
クラスは1つだけしかスーパークラスを持つことができませんが、ミックスインは複数持つことができます(キーワードはそれぞれ`extends`と`with`を使います)。
ミックスインとスーパークラスは同じスーパータイプを持つことができます。

それでは抽象クラスから始まる興味深い例を見てみましょう。

```scala mdoc
abstract class AbsIterator {
  type T
  def hasNext: Boolean
  def next(): T
}
```
クラスは抽象型`T`と標準的なイテレーターのメソッドを持ちます。
次に、（全ての抽象メンバー`T`, `hasNext`, `next`が実装を持つ）具象クラスを実装します。

```scala mdoc
class StringIterator(s: String) extends AbsIterator {
  type T = Char
  private var i = 0
  def hasNext = i < s.length
  def next() = {
    val ch = s charAt i
    i += 1
    ch
  }
}
```
`StringIterator`は`String`を受け取り、そのStringを反復処理するために使われます。
（例：Stringに特定の文字が含まれているかを確認するために）

それでは`AbsIterator`を継承したトレイトも作ってみましょう。

```scala mdoc
trait RichIterator extends AbsIterator {
  def foreach(f: T => Unit): Unit = while (hasNext) f(next())
}
```
このトレイトは(`while (hasNext)`で)要素がある限り、与えられた関数 `f: T => Unit`を次の要素(`next()`)に対し連続して呼び出す`foreach`メソッドを実装しています。
`RichIterator`はトレイトなので、`RichIterator`はAbsIteratorの抽象メンバーを実装する必要がありません。

`StringIterator`と`RichIterator`の機能を1つのクラスに組み合わせてみましょう。
```scala mdoc
class RichStringIter extends StringIterator("Scala") with RichIterator
val richStringIter = new RichStringIter
richStringIter foreach println
```
新しいクラス`RichStringIter`は`StringIterator`をスーパークラスとし、`RichIterator`をミックスインとしています。

単一継承ではこのレベルの柔軟性を達成することはできないでしょう。
