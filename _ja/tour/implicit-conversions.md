---
layout: tour
title: 暗黙の変換
language: ja

discourse: true

partof: scala-tour

num: 27
next-page: polymorphic-methods
previous-page: implicit-parameters

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

```scala mdoc
import scala.language.implicitConversions

implicit def list2ordered[A](x: List[A])
    (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
  new Ordered[List[A]] { 
    //replace with a more useful implementation
    def compare(that: List[A]): Int = 1
  }
```
暗黙にインポートされているオブジェクト`scala.Predef`は、頻繁に使われる型（例えば`scala.collection.immutable.Map`は`Map`と別名づけられます）とメソッド（例えば`assert`）といくつかの暗黙の型変換を宣言しています。

例えば、`java.lang.Integer`を受け取るようなJavaのメソッドを呼び出す時、自由に`scala.Int`を代わりに渡すことができます。それはPredefオブジェクトが以下の暗黙の変換をを含んでいるからです。

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

暗黙の変換は見境なく使われると落とし穴になり得るため、暗黙の変換の定義をコンパイルしている時にコンパイラは警告を出します。

警告をオフにするには、次のいずれかの措置を講じてください。

* 暗黙の変換定義のスコープに`scala.language.implicitConversions`をインポートする。
* コンパイラを`-language:implicitConversions`をつけて起動する

コンパイラにより変換が適用された時、警告は出ません。
