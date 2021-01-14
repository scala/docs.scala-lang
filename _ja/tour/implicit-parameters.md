---
layout: tour
title: 暗黙のパラメータ
language: ja

discourse: true

partof: scala-tour

num: 26
next-page: implicit-conversions
previous-page: self-types

---

メソッドは _暗黙の_ パラメータのリストを持つことができ、パラメータリストの先頭には _implicit_ キーワードで印をつけます。
もしそのパラメータリストの中のパラメータがいつものように渡らなければ、Scalaは正しい型の暗黙値を受け取ることができるかを確認し、可能であればそれを自動的に渡します。

Scalaがこれらのパラメータを探す場所は2つのカテゴリに分かれます。

* Scalaはまず最初に暗黙のパラメータブロックを持つメソッドが呼び出されている箇所で、直接(プレフィックスなしに)アクセスできる暗黙の定義と暗黙のパラメータを探します。
* 次に、候補となる型に関連づけられた全てのコンパニオンオブジェクトの中でimplicitと宣言されているメンバーを探します。

Scalaがimplicitをどこから見つけるかについてのより詳しいガイドは[FAQ](//docs.scala-lang.org/tutorials/FAQ/finding-implicits.html)で見ることができます。

以下の例では、モノイドの`add`と`unit`の演算を使い、要素のリストの合計を計算するメソッド`sum`を定義しています。
implicitの値をトップレベルには置けないことに注意してください。

```scala mdoc
abstract class Monoid[A] {
  def add(x: A, y: A): A
  def unit: A
}

object ImplicitTest {
  implicit val stringMonoid: Monoid[String] = new Monoid[String] {
    def add(x: String, y: String): String = x concat y
    def unit: String = ""
  }
  
  implicit val intMonoid: Monoid[Int] = new Monoid[Int] {
    def add(x: Int, y: Int): Int = x + y
    def unit: Int = 0
  }
  
  def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
    if (xs.isEmpty) m.unit
    else m.add(xs.head, sum(xs.tail))
    
  def main(args: Array[String]): Unit = {
    println(sum(List(1, 2, 3)))       // intMonoidを暗に使用
    println(sum(List("a", "b", "c"))) // stringMonoidを暗に使用
  }
}
```
`Monoid`はここでは`add`と呼ばれる処理を定義します。この処理は`A`のペアを結合して、別の`A`を返します。また、(特定の)`A`を作ることができる`unit`と呼ばれる処理も定義します。

暗黙のパラメータがどのように働くかを見るため、まずは文字列と整数のためにそれぞれモノイド`stringMonoid`と`intMonoid`を定義します。`implicit`キーワードは対応するオブジェクトが暗黙に使われうることを指し示します。

メソッド`sum`は`List[A]`を受け取り、`A`を返します。このメソッドは初期値`A`を`unit`から受け取り、リスト中の`A`を順番に`add`メソッドで結合します。ここでパラメータ`m`をimplicitにしているのは、そのメソッドを呼び出すとき、Scalaが暗黙のパラメータ`m`として暗黙の`Monoid[A]`を見つけることができるなら、私達は`xs`パラメータを提供するだけで良いということです。

`main`メソッドでは`sum`を2回呼んでいて、`xs`パラメータだけを渡しています。するとScalaは先に言及したスコープの中でimplicitを探します。最初の`sum`の呼び出しは`xs`として`List[Int]`を渡します。それは `A`が`Int`であることを意味します。暗黙のパラメータリスト`m`が省略されているので、Scalaは暗黙の`Monoid[Int]`を探します。最初の探索ルールはこうでした。

> Scalaはまず最初に暗黙のパラメータブロックを持つメソッドが呼び出されている箇所で、直接(プレフィックスなしに)アクセスできる暗黙の定義と暗黙のパラメータを探します。

`intMonoid`は`main`の中で直接アクセスできる暗黙の定義です。型も一致しているので、`sum`メソッドに自動的に渡されます。

`sum`の2回目の呼び出しは`List[String]`を渡します。それは`A`は`String`であることを意味します。暗黙の値の探索は`Int`の時と同様に動きますが、今回は `stringMonoid`を見つけ、`m`として自動的に渡します。

そのプログラムは以下を出力します。
```
6
abc
```
