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

---

Scalaではタプルは決まった数の要素を含む値であり、各要素はそれぞれの型を持ちます。
タプルは不変です。

タプルはメソッドから複数の値を返す際に特に役立ちます。

2つの要素を持つタプルは以下のように作ることができます。

```scala mdoc
val ingredient = ("Sugar" , 25)
```
ここでは`String`要素を1つと`Int`要素を1つ含むタプルを作っています。

推論される`ingredient`の型は`(String, Int)`であり、これは`Tuple2[String, Int]`の簡単な表記法です。

タプルを表すために、Scalaは`Tuple2`, `Tuple3` … `Tuple22`までのクラス群を使います。
それぞれのクラスは要素の数と同じ数の型パラメータを持ちます。

## 要素へのアクセス

タプルの要素へのアクセス方法の1つとして、位置があります。
個々の要素は`_1`、`_2`などと名付けられます。

```scala mdoc
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```
## タプルでのパターンマッチング
タプルはパターンマッチングを使って分解することもできます。

```scala mdoc
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```

ここでは`name`に推論される型は`String`で、`quantity`に推論される型は`Int`です。

こちらはタプルのパターンマッチングの他の例です。

```scala mdoc
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

また、`for`内包表記では以下のようになります。

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## タプルとケースクラス
ユーザーは時々、タプルとケースクラスの選択を難しいと思うかもしれません。ケースクラスには名前付き要素があります。それらの名前によってコードの可読性を改善できる場合があります。
上記の惑星の例ではタプルを使うより、`case class Planet(name: String, distance: Double)`を定義したほうがいいかもしれません。
