---
layout: tour
title: タプル
language: ja

discourse: true

partof: scala-tour

num: 6
next-page: mixin-class-composition
previous-page: traits
topics: tuples

redirect_from: "/tutorials/tour/tuples.html"
---

Scalaではタプルは決まった数の要素を含む値であり、各要素はそれぞれの型を持ちます。
タプルは不変です

タプルはメソッドから複数の値を返す際に特に役立ちます。

2つの要素を持つタプルは以下のように作ることができます。

```tut
val ingredient = ("Sugar" , 25)
```
ここでは`String`要素を1つと`Int`要素を1つ含むタプルを作っています。

`ingredient`の推論型は`(String, Int)`であり、これは`Tuple2[String, Int]`の簡単な表記法です。

タプルを表すためには、Scalaは`Tuple2`, `Tuple3`,から `Tuple22`までのクラス群を使います。
それぞれのクラスは要素の数と同じ数の型パラメータを持ちます。

## 要素へのアクセス

タプル要素へのアクセス方法の1つは位置の利用です。
個々の要素は`_1`、`_2`などと名付けられます。

```tut
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```
## タプルでのパターンマッチング
タプルはパターンマッチングを使って分解することもできます。

```tut
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```

ここでは`name`の型推論は`String`で、`quantity`の型推論は`Int`です。

こちらはタプルのパターンマッチングの他の例です。

```tut
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

または、`for`の中では

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## タプルとケースクラス
ユーザーは時々、タプルとケースクラスの選択を難しいと思うかもしれません。ケースクラスには名前付き要素があります。その名前はある種のコードの可読性改善します。
上記の惑星の例ではタプルを使うのではなく、`case class Planet(name: String, distance: Double)`の定義もできます。
