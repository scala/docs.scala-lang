---
layout: tour
title: 暗黙の変換
language: ja

discourse: true

partof: scala-tour

num: 27
next-page: polymorphic-methods
previous-page: implicit-parameters

redirect_from: "/tutorials/tour/implicit-conversions.html"
---

型`S`から型`T`への暗黙の変換は`S => T`という型のimplicit値や、その型に一致するimplicitメソッドで定義されます。

暗黙の変換は2つの状況で適用されます。

* もし式`e`が型`S`であり、`S`は式の期待する型`T`に適合しない場合
* 型`S`の`e`を使う表記`e.m`があって、セレクター`m`が`S`のメンバーではない場合

最初のケースでは、`e`を渡せて、戻り値の型が`T`に適合するような変換`c`を検索します。
2つ目のケースでは、`e`を渡せて、戻り値が`m`というメンバーを持つような変換`c`を検索します。

implicitなメソッド`List[A] => Ordered[List[A]]`と`Int => Ordered[Int]`がスコープの中にあれば、`List[Int]`型の2つのリストにおける以下の処理は正当なものになります。

```
List(1, 2, 3) <= List(4, 5)
```
implicitなメソッド`Int => Ordered[Int]`は`scala.Predef.intWrapper`を通じて自動的に提供されます。implicitなメソッドの例`List[A] => Ordered[List[A]]`は以下にあります。

```tut
import scala.language.implicitConversions

implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { 
    //replace with a more useful implementation
    def compare(that: List[A]): Int = 1
  }
```
implicitなインポートされたオブジェクト`scala.Predef`は度々使われる型(例えば`scala.collection.immutable.Map`は`Map`と別名づけられます)とメソッド（例えば`assert`）にいくつかの別名を宣言しますが、暗黙のうちにいくつかの変換もします。

例えば、`java.lang.Integer`を期待してJavaのメソッドを呼び出す時、自由に`scala.Int`を代わりに渡すことができます。それはPredefオブジェクトが以下の暗黙の変換をを含んでいるからです。

```tut
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

暗黙の変換は落とし穴になり得るため、無差別に使えば、暗黙の変換の定義をコンパイルしている時にコンパイラは警告を出します。

警告をオフにするには、次のいずれかの操作を行います。

* 暗黙の変換定義のスコープに`scala.language.implicitConversions`をインポートする。
* コンパイラを`-language:implicitConversions`をつけて起動する

コンパイラにより変換が適用された時、警告は出ません。
