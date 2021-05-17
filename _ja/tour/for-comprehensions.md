---
layout: tour
title: for内包表記
language: ja

discourse: true

partof: scala-tour

num: 17
next-page: generic-classes
previous-page: extractor-objects

---

Scalaは*シーケンス内包表記*を表現するための軽量な記法を提供します。
内含表記は`for (enumerators) yield e`という形をとります。`enumerators`はセミコロンで区切られたEnumeratorのリストを指します。
1つの*enumerator*は新しい変数を導き出すジェネレータかフィルタのどちらかです。
内包表記はenumeratorsが生成する束縛一つ一つについて本体`e`を評価し、これらの値のシーケンスを返します。

こちらは例です。

```scala mdoc
case class User(name: String, age: Int)

val userBase = List(User("Travis", 28),
  User("Kelly", 33),
  User("Jennifer", 44),
  User("Dennis", 23))

val twentySomethings = for (user <- userBase if (user.age >=20 && user.age < 30))
  yield user.name  // これをリストに追加する

twentySomethings.foreach(name => println(name))  // prints Travis Dennis
```
この`yield`文と一緒に使われている`for`ループは実際には`List`を生成します。
`yield user.name`を返しているので、型は`List[String]`になります。
`user <- userBase`はジェネレータであり、`if (user.age >=20 && user.age < 30)`は20代ではないユーザーをフィルターするガードです。

こちらは2つのジェネレータを使ったより複雑な例です。
合計が与えられた値`v`と等しくなる、`0`から`n-1`の全てのペアを計算します。

```scala mdoc
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   yield (i, j)

foo(10, 10) foreach {
  case (i, j) =>
    println(s"($i, $j) ")  // prints (1, 9) (2, 8) (3, 7) (4, 6) (5, 5) (6, 4) (7, 3) (8, 2) (9, 1)
}

```
この例では`n == 10`で`v == 10`です。最初のイテレーションでは`i == 0`かつ`j == 0`で、`i + j != v`となるので、何も生成されません。
`i`が`1`にインクリメントされるまでに、`j`はあと9回インクリメントされます。`if`ガードがなければ、単純に以下の内容が表示されます。

```

(0, 0) (0, 1) (0, 2) (0, 3) (0, 4) (0, 5) (0, 6) (0, 7) (0, 8) (0, 9) (1, 0) ...
```
内包表記はリストだけのものではありません。
操作 `withFilter`、`map`、`flatMap`を（適切な型で）サポートする全てのデータ型は、シーケンス内包表記で使うことができます。

内包表記の中では`yield`を省略することができます。その場合、内包表記は`Unit`を返します。
これは副作用をもたらす必要があるときに役立ちます。
こちらは先に出たプログラムと同等のものですが、`yield`を使っていません。

```scala mdoc:nest
def foo(n: Int, v: Int) =
   for (i <- 0 until n;
        j <- 0 until n if i + j == v)
   println(s"($i, $j)")

foo(10, 10)
```
