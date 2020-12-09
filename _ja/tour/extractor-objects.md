---
layout: tour
title: 抽出子オブジェクト
language: ja

discourse: true

partof: scala-tour

num: 16
next-page: for-comprehensions
previous-page: regular-expression-patterns

---

抽出子オブジェクトは`unapply`メソッドを持つオブジェクトです。
`apply`メソッドが引数を取り、オブジェクトを作るコンストラクタであるように、`unapply`は1つのオブジェクトを受け取り、引数を返そうとします。
これはパターンマッチングと部分関数で最も頻繁に使われます。

```scala mdoc
import scala.util.Random

object CustomerID {

  def apply(name: String) = s"$name--${Random.nextLong}"

  def unapply(customerID: String): Option[String] = {
    val stringArray: Array[String] = customerID.split("--")
    if (stringArray.tail.nonEmpty) Some(stringArray.head) else None
  }
}

val customer1ID = CustomerID("Sukyoung")  // Sukyoung--23098234908
customer1ID match {
  case CustomerID(name) => println(name)  // prints Sukyoung
  case _ => println("Could not extract a CustomerID")
}
```

`apply`メソッドは`name`から`CustomerID`文字列を作ります。`unapply`は逆に`name`を返します。
 `CustomerID("Sukyoung")`は、`CustomerID.apply("Sukyoung")`を短く書く構文です。
 `case CustomerID(name) => println(name)`では、unapplyメソッドを呼んでいます。

値を定義する文で、パターン中に新しい変数を使うことができるので、抽出子は変数を初期化するのに使えます。この場合unapplyメソッドが初期値を与えます。

```scala mdoc
val customer2ID = CustomerID("Nico")
val CustomerID(name) = customer2ID
println(name)  // prints Nico
```
これは `val name = CustomerID.unapply(customer2ID).get`.と同じです。

```scala mdoc
val CustomerID(name2) = "--asdfasdfasdf"
```
もし一致しない場合`scala.MatchError`が投げられます。

```scala mdoc:crash
val CustomerID(name3) = "-asdfasdfasdf"
```

`unapply`の戻り値型は以下のように選ばれなければなりません。

* ただのテストであれば、`Boolean`を返します。例えば`case even()`。
* T型のサブバリュー1つを返すのであれば、`Option[T]`を返します。
* いくつかのサブバリュー`T1,...,Tn`を返したいのであれば、オプショナルタプル`Option[(T1,...,Tn)]`でグループ化します。

時々、抽出する値の数が確定せず、入力に応じて任意の数の値を返したいことがあります。
この場合は、`Option[Seq[T]]`を返す`unapplySeq`メソッドを持つ抽出子を定義することができます。
これらのパターンと同様の例として以下のものがあります。
`case List(x, y, z) =>`を使って`List`を分解する例や`case r(name, remainingFields @ _*) =>`.のように正規表現`Regex`を使って`String`を分解する例です。
