---
layout: tour
title: 基本
language: ja

discourse: true

partof: scala-tour

num: 2
next-page: unified-types
previous-page: tour-of-scala

redirect_from: "/tutorials/tour/basics.html"
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

```
1 + 1
```
`println`を使うことで、式の結果を出力できます。

{% scalafiddle %}
```tut
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### 値

`val`キーワードを利用することで、式の結果に名前を付けることができます。

```tut
val x = 1 + 1
println(x) // 2
```

ここでいうところの `x` のように、名前をつけられた結果は 値 と呼ばれます。
値を参照した場合、その値は再計算されません。

値は再代入することができません。

```tut:fail
x = 3 // この記述はコンパイルされません。
```

値の型は推測可能ですが、このように型を明示的に宣言することもできます。

```tut
val x: Int = 1 + 1
```

型定義では`Int` は識別子`x`の後にくることに注意してください。そして`:`も必要となります。 

### 変数

再代入ができおることを除けば、変数は値と似ています。
`var`キーワードを使うことで、変数は定義できます。

```tut
var x = 1 + 1
x = 3 // "x"は"var"キーワードで宣言されているので、これはコンパイルされます。
println(x * x) // 9
```

値と同様に、型を宣言したければ、明示的に型を宣言することができます。

```tut
var x: Int = 1 + 1
```


## ブロック

`{}`で囲むことで式をまとめることができます。これをブロックと呼びます。

ブロックの最後の式の結果はブロック全体の結果にもなります。

```tut
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## 関数

関数は引数を受け取る式です。
ここでは与えられた数値に1を足す無名関数（すなわち名前が無い関数）を宣言しています。

```tut
(x: Int) => x + 1
```
`=>` の左側は引数のリストになります。右側は引数を含む式になります。

関数には名前をつけることもできます。

{% scalafiddle %}
```tut
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

関数は複数の引数をとることもできます。

{% scalafiddle %}
```tut
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

また引数を取らないこともありえます。

```tut
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## メソッド

メソッドは関数と見た目、振る舞いがとても似ていますが、それらには違いがいくつかあります。

メソッドは `def` キーワードで定義されます。 `def` の後ろには名前、引数リスト、戻り値の型、処理の内容が続きます。

{% scalafiddle %}
```tut
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

戻り値の型は引数リストとコロンの「後ろ」に宣言することに注意してください。`: Int`

メソッドは複数のパラメーターリストを受け取ることができます。

{% scalafiddle %}
```tut
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

また、パラメーターリストを一切受け取らないこともあります。

```tut
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
メソッドと関数には他にも違いがありますが、今のところは同じようなものと考えて大丈夫です。

メソッドは複数行の式も持つことができます。
```tut
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
```
メソッド本体にある最後の式はメソッドの戻り値になります。(Scalaには`return`キーワードはありますが、めったに使われません。)

## クラス

`class` キーワードとその後ろに名前、コンストラクタ引数を続けることで、クラスを定義することができます。

```tut
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
`greet` メソッドの戻り値の型は`Unit`です。`Unit`は意味のある戻り値が存在しないことを意味します。
それはJavaやC言語の`void`と似たような使われ方をします。（`void`との違いは全てのScalaの式は値をを持たなければなりませんので、
戻り値はUnit型のシングルトンな値になります。その値には情報はありません。）

`new` キーワードを使うことで、クラスのインスタンスを生成することができます。

```tut
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

クラスについては[後で](classes.html)詳しく取り扱います。

## ケースクラス

Scalaには"ケース"クラスという特別な種類のクラスがあります。デフォルトでケースクラスは不変であり、値で比較されます。
`case class` キーワードを利用して、ケースクラスを定義できます。

```tut
case class Point(x: Int, y: Int)
```
`new` キーワードがなくても、ケースクラスのインスタンス化はできます。

```tut
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

ケースクラスは値で比較されます。

```tut
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) と Point(1,2) は同じになります。

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) と Point(2,2) は異なります。
```

ケースクラスについて紹介すべきことはたくさんあり、あなたはケースクラスが大好きになると確信しています。
それらについては[後で](case-classes.html)詳しく取り扱います。

## オブジェクト

オブジェクトはそれ自身が定義する単一のインスタンスです。それら自身のクラスのシングルトンと考えることができます。

`object`キーワードを利用してオブジェクトを定義することができます。

```tut
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

名前を参照することでオブジェクトにアクセスすることができます。

```tut
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

オブジェクトについては [後で](singleton-objects.html)詳しく取り扱います。

## トレイト

トレイトはいくつかのフィールドとメソッドを含む型です。複数のトレイトは結合することができます。

`trait`キーワードでトレイトを定義することができます。

```tut
trait Greeter {
  def greet(name: String): Unit
}
```

トレイトはデフォルトの実装を持つことができます。

{% scalafiddle %}
```tut
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

`extends`キーワードでトレイトを継承することも、`override` キーワードで実装をオーバーライドすることもできます。

```tut
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
それは文字列型を含む配列を一つ引数として受け取ります。

オブジェクトを使い、以下のようにメインメソッドを定義することができます。

```tut
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
