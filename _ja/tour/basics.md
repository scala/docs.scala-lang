---
layout: tour
title: 基本
language: ja

discourse: true

partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala

---

このページでは、Scalaの基本を取り扱います。

## Scalaをブラウザで試してみる

ScalaFiddleを利用することでブラウザ上でScalaを実行することができます。

1. [https://scalafiddle.io](https://scalafiddle.io)を開きます。
2. 左側のパネルに`println("Hello, world!")`を貼り付けます。
3. "Run"ボタンを押すと、右側のパネルに出力が表示されます。

このサイトを使えば、簡単にセットアップせずScalaのコードの一部を試すことができます。

このドキュメントの多くのコードの例はScalaFiddleで開発されています。
そのため、サンプルコード内のRunボタンをクリックするだけで、そのまま簡単にコードを試すことができます。

## 式

式は計算可能な文です。

```scala mdoc
1 + 1
```
`println`を使うことで、式の結果を出力できます。

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### 値

`val`キーワードを利用することで、式の結果に名前を付けることができます。

```scala mdoc
val x = 1 + 1
println(x) // 2
```

ここでいうところの `x` のように、名前をつけられた結果は 値 と呼ばれます。
値を参照した場合、その値は再計算されません。

値は再代入することができません。

```scala mdoc:fail
x = 3 // この記述はコンパイルされません。
```

値の型は推測可能ですが、このように型を明示的に宣言することもできます。

```scala mdoc:nest
val x: Int = 1 + 1
```

型定義では`Int` は識別子`x`の後にくることに注意してください。そして`:`も必要となります。 

### 変数

再代入ができることを除けば、変数は値と似ています。
`var`キーワードを使うことで、変数は定義できます。

```scala mdoc:nest
var x = 1 + 1
x = 3 // "x"は"var"キーワードで宣言されているので、これはコンパイルされます。
println(x * x) // 9
```

値と同様に、型を宣言したければ、明示的に型を宣言することができます。

```scala mdoc:nest
var x: Int = 1 + 1
```


## ブロック

`{}`で囲むことで式をまとめることができます。これをブロックと呼びます。

ブロックの最後の式の結果はブロック全体の結果にもなります。

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## 関数

関数はパラメーターを受け取る式です。
ここでは与えられた数値に1を足す無名関数（すなわち名前が無い関数）を宣言しています。

```scala mdoc
(x: Int) => x + 1
```
`=>` の左側はパラメーターのリストです。右側はパラメーターを含む式です。

関数には名前をつけることもできます。

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

関数は複数のパラメーターをとることもできます。

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

またパラメーターを取らないこともありえます。

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## メソッド

メソッドは関数と見た目、振る舞いがとても似ていますが、それらには違いがいくつかあります。

メソッドは `def` キーワードで定義されます。 `def` の後ろには名前、パラメーターリスト、戻り値の型、処理の内容が続きます。

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

戻り値の型は引数リストとコロンの「後ろ」に宣言することに注意してください。`: Int`

メソッドは複数のパラメーターリストを受け取ることができます。

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

また、パラメーターリストを一切受け取らないこともあります。

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
メソッドと関数には他にも違いがありますが、今のところは同じようなものと考えて大丈夫です。

メソッドは複数行の式も持つことができます。

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

メソッド本体にある最後の式はメソッドの戻り値になります。(Scalaには`return`キーワードはありますが、めったに使われません。)

## クラス

`class` キーワードとその後ろに名前、コンストラクタパラメーターを続けることで、クラスを定義することができます。

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
`greet` メソッドの戻り値の型は`Unit`です。`Unit`は戻り値として意味がないことを示します。
それはJavaやC言語の`void`と似たような使われ方をします。（`void`との違いは、全てのScalaの式は値を持つ必要があるため、
実はUnit型のシングルトンで`()`と書かれる値があります。その値には情報はありません。）

`new` キーワードを使うことで、クラスのインスタンスを生成することができます。

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

クラスについては[後で](classes.html)詳しく取り扱います。

## ケースクラス

Scalaには"ケース"クラスという特別な種類のクラスがあります。デフォルトでケースクラスは不変であり、値で比較されます。
`case class` キーワードを利用して、ケースクラスを定義できます。

```scala mdoc
case class Point(x: Int, y: Int)
```
ケースクラスは、`new` キーワードなしでインスタンス化できます。

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

ケースクラスは値で比較されます。

```scala mdoc
if (point == anotherPoint) {
  println(point + " と " + anotherPoint + " は同じです。")
} else {
  println(point + " と " + anotherPoint + " は異なります。")
} // Point(1,2) と Point(1,2) は同じです。

if (point == yetAnotherPoint) {
  println(point + " と " + yetAnotherPoint + " は同じです。")
} else {
  println(point + " と " + yetAnotherPoint + " は異なります。")
} // Point(1,2) と Point(2,2) は異なります。
```

ケースクラスについて紹介すべきことはたくさんあり、あなたはケースクラスが大好きになると確信しています！
それらについては[後で](case-classes.html)詳しく取り扱います。

## オブジェクト

オブジェクトはそれ自体が定義である単一のインスタンスです。そのクラスのシングルトンと考えることもできます。

`object`キーワードを利用してオブジェクトを定義することができます。

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

名前を参照してオブジェクトにアクセスすることができます。

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

オブジェクトについては [後で](singleton-objects.html)詳しく取り扱います。

## トレイト

トレイトはいくつかのフィールドとメソッドを含む型です。複数のトレイトを結合することもできます。

`trait`キーワードでトレイトを定義することができます。

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

トレイトはデフォルトの実装を持つこともできます。

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

`extends`キーワードでトレイトを継承することも、`override` キーワードで実装をオーバーライドすることもできます。

```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

ここでは、`DefaultGreeter`は一つのトレイトだけを継承していますが、複数のトレイトを継承することもできます。

トレイトについては [後で](traits.html)詳しく取り扱います。

## メインメソッド

メインメソッドはプログラムの始点になります。Javaバーチャルマシーンは`main`と名付けられたメインメソッドが必要で、
それは文字列の配列を一つ引数として受け取ります。

オブジェクトを使い、以下のようにメインメソッドを定義することができます。

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
