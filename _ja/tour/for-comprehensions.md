---
layout: tour
title: for内包表記
language: ja

discourse: true

partof: scala-tour

num: 17
next-page: generic-classes
previous-page: extractor-objects

redirect_from: "/tutorials/tour/for-comprehensions.html"
---

Scalaは*シーケンス内包表記*を表現するための軽量記法を提供します。
`enumerators`がセミコロンで区切られたEnumeratorのリストを参照する場合、内含表記には`for (enumerators) yield e`の形式があります。
1つの*enumerator*は新しい変数を導き出すジェネレータかフィルタのどちらかです。
内包表記は本体`e`をenumeratorsにより生成された各バインディングとして評価され、これら値の列を返します。

こちらは例になります。

```tut
case class User(name: String, age: Int)

val userBase = List(User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings = for (user <- userBase if (user.age >=20 && user.age < 30))
  yield user.name  // すなわちこれをリストに追加する

twentySomethings.foreach(name => println(name))  // prints Travis Dennis
```
`yield`文と使われるfor`ループ`は実は`List`を生成します。
`yield user.name`と言ったので、それは`List[String]`です。
`user <- userBase`はジェネレータであり、`if (user.age >=20 && user.age < 30)`は20代ではないユーザーをフィルターするガードです。

こちらは2つのジェネレータを使ったより複雑な例です。
合計が与えられた値`v`と等しくなる、`0`から`n-1`の全てのペアを計算します。

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   yield (i, j)

foo(10, 10) foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // prints (1, 9) (2, 8) (3, 7) (4, 6) (5, 5) (6, 4) (7, 3) (8, 2) (9, 1)
}

```
ここで`n == 10`と`v == 10`の場合、最初のイテレータでは`i == 0`と`j == 0`となり、`i + j != v`となるので、何も得られません。
`i`が`1`に増加する前に、`j`はあと9回にインクリメントされます。`if`ガードがなければ、単純に以下の内容が表示されます。

```

(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 0) ...
```
内包表記はリストに制限されまん。
演算子`withFilter`、`map`、そして (適切な型を持った)`flatMap`をサポートした全てのデータ型はシーケンス内包表記で使うことができます。
内包表記の中では`yield`を省略することができます。その場合、内包表記は`Unit`を返します。
これは副作用をもたらす必要があるときに役立ちます。
こちらは先に出たプログラムと同等のものですが、`yield`を使っていません。

```tut
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   println(s"($i, $j)")

foo(10, 10)
```
