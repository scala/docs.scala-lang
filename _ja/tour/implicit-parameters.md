---
layout: tour
title: 暗黙のパラメータ
language: ja

discourse: true

partof: scala-tour

num: 26
next-page: implicit-conversions
previous-page: self-types

redirect_from: "/tutorials/tour/implicit-parameters.html"
---

メソッドは _暗黙の_ パラメータのリストを持つことができ、パラメータリストの先頭には_implicit_キーワードで印をつけます。
もしそのパラメータリストの中のパラメータがいつものように渡らなければ、Scalaは正しい型の暗黙値を受け取ることができるかを確認し、可能であれば自動的に渡します。

Scalaがこれらのパラメータを探す場合は2つのカテゴリに分かれます。

* Scalaは暗黙のパラメータブロックを持つメソッドが呼び出された時点で、まず(プレフィックスなしに)に直接アクセスできる暗黙の定義と暗黙のパラメータを探します。
* そして全てのコンパニオンオブジェクトの中でimplicitで印をつけられ、暗黙に候補となる型と関連づけられたメンバーを探します。

より詳しいScalaがimplicitを探すガイドは[FAQ](//docs.scala-lang.org/tutorials/FAQ/finding-implicits.html)で見ることができます。

以下の例では、モノイドの`add`と`unit`の演算を使い、要素のリストの合計を計算するメソッド`sum`を定義しています。

```tut
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
`モノイド`はここでは`add`と呼ばれる演算子を定義します。演算子は`A`のペアを組み合わせ、別の`A`を返します。そしてそれは(特別な)`A`を作ることができる`unit`と呼ばれる演算子です。

どのように暗黙のパラメータが動くかを見るには、まずは文字列と整数のためにそれぞれモノイド`stringMonoid`と`intMonoid`を定義します。`implicit`キーワードは対応するオブジェクトは暗黙に使われうることを指し示します。

メソッド`sum`は`List[A]`を受け取り、`A`を返します。そしてメソッドは初期値`A`を`unit`から受け取り、リスト中でそれぞれ次の`A`を`add`メソッドで組み合わせます。ここでパラメータ`m`をimplicitにすることは、そのメソッドを呼び出すとき、暗黙のパラメータ`m`を使うためにScalaが暗黙の`Monoid[A]`を見つけることができるなら`xs`パラメータを提供するだけで良いことを意味します。

`main`メソッドにて`sum`を2回呼び出すと、`xs`パラメータだけが提供されます。そうなるとScalaは先に言及したスコープの中でimplicitを探します。最初の`sum`の呼び出しは`List[Int]`を`xs`を渡します。それは `A`が`Int`であることを意味します。`m`と暗黙のパラメータリストは省略しており、Scalaは`Monoid[Int]`型のimplictを探します。最初のルックアップのルールには以下のように書いています。

> Scalaは暗黙のパラメータブロックを持つメソッドが呼び出された時点で、まず(プレフィックスなしに)に直接アクセスできる暗黙の定義と暗黙のパラメータを探します。

`intMonoid`は`main`の中で直接アクセスされる暗黙の定義です。それ正しい型であり、`sum`メソッドに自動的に渡されます。

`sum`の2回目の呼び出しは`List[String]`を渡します。それは`A`は`String`であることを意味します。暗黙のルックアップは`Int`の時と同様に動きますが、この時は `stringMonoid`を見つけ、`m`として自動的に渡します。

そのプログラムは以下を出力します。
```
6
abc
```
