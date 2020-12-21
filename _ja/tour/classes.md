---
layout: tour
title: クラス
language: ja

discourse: true

partof: scala-tour

num: 4
next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures

---

Scalaにおけるクラスはオブジェクトを作るための設計図です。
クラスはメソッド、値、変数、型、オブジェクト、トレイト、クラスを持ち、それらはまとめて _メンバー_ と呼ばれます。
型、オブジェクト、トレイトはツアーで後ほど取り扱います。

## クラスを定義する

最小のクラス定義は単純にキーワード`class`と識別子だけというものです。
クラス名は大文字から始まるべきです。

```scala mdoc
class User

val user1 = new User
```
`new`キーワードはクラスのインスタンスを作るために使われます。
`User`はコンストラクターが定義されていないので、引数なしのデフォルトコンストラクターを持ちます。
しかしながら、コンストラクターとクラス本体は頻繁に欲しくなるでしょう。
こちらは位置情報のクラス定義の例になります。

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // prints (2, 3)
```
この`Point`クラスは4つのメンバーを持ちます。
変数`x` と `y` そしてメソッド `move` と `toString`です。
多くの他の言語とは異なり、プライマリコンストラクタはクラスのシグネチャ`(var x: Int, var y: Int)`です。
`move` メソッドは2つの整数の引数を受け取り、情報を持たない Unit 値 `()` を返します。
これは大雑把に言えば、Javaのような言語における`void`に対応します。
その一方で`toString`は引数を受け取りませんが、`String`の値を返します。
`toString`は[`AnyRef`](unified-types.html)の`toString`をオーバーライドしているので、`override`キーワードのタグが付いています。

## コンストラクター

コンストラクターは次のようにデフォルト値を与えると省略可能なパラメーターを持つことができます。

```scala mdoc:reset
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x と y には共に0がセットされます。
val point1 = new Point(1)
println(point1.x)  // 1 が出力されます。
```
このバージョンの`Point`クラスでは、`x` と `y` はデフォルト値0を持ち、引数が必須ではありません。
しかしながらコンストラクタは引数を左から右に読み込むため、もし`y`の値だけを渡したい場合は、パラメーターに名前をつける必要があります。

```scala mdoc:reset
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // 2 が出力されます。
```

これは明快さを高めるための良い習慣でもあります。

## プライベートメンバーとゲッター/セッター構文
メンバーはデフォルトではパブリックになります。
クラスの外から隠したい場合は`private`アクセス修飾子を使いましょう。

```scala mdoc:reset
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // 警告が出力されます。
```
このバージョンの`Point`クラスでは、データはプライベート変数 `_x` と `_y` に保存されます。
プライベートなデータにアクセスするためのメソッド`def x` と `def y` があります。
`def x_=` と `def y_=` は `_x` と `_y` の値を検証し設定するためのものになります。
セッターのための特別な構文に注意してください。
セッターメソッドはゲッターメソッドの識別子に`_=`を追加し、その後ろにパラメーターを取ります。

プライマリコンストラクタの`val` と `var` を持つパラメーターはパブリックになります。
しかしながら`val` は不変となるため、以下のように記述することはできません。

```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- コンパイルされません。
```

`val` や `var` が存在しないパラメーターはクラス内でだけで参照できるプライベートな値や変数となります。

```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- コンパイルされません。
```
