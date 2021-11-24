---
title: その他変更された機能
type: section
description: この章では機能変更に伴い生じたすべての非互換性に関して詳細化します。
num: 18
previous-page: incompat-contextual-abstractions
next-page: incompat-type-checker
language: ja
---

その他の機能は言語をより簡単、安全、または一貫性のあるものにするために簡略化または制限されています。

|Incompatibility|Scala 3 Migration Rewrite|
|--- |--- |
|[継承シャドウイング](#継承シャドウイング)|✅|
|[プライベートクラスのNon privateなコンストラクタ](#プライベートクラスのnon-privateなコンストラクタ)|Migration Warning|
|[抽象オーバーライド](#抽象オーバーライド)||
|[ケースクラスコンパニオン](#ケースクラスコンパニオン)||
|[明示的な`unapply`の呼び出し](#明示的なunapplyの呼び出し)||
|[見えないビーンプロパティ](#見えないビーンプロパティ)||
|[型パラメータとしての`=> T`](#型パラメータとしての-t)||
|[型引数のワイルドカード](#型引数のワイルドカード)||

## 継承シャドウイング

親クラスまたはトレイトからの継承されたメンバーは外部スコープで定義された識別子をシャドウイングすることができます。
このパターンのことを継承シャドウイングと呼びます。

```scala
object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
```

例として、以下のコードを与えてみます。Cの中にある単項式`x`は`x`のメンバー定義を外部クラス`B`から参照することができ、また親クラス`A`の`x`のメンバー定義しても参照できます。
どちらの参照かは`A`の定義に進むまでわかりません。

これはエラーが発生しやすいことで知られています。

そのため、Scala3では、親クラス`A`に実際にメンバー`x`がある場合、コンパイラは曖昧性解消を必要とします。

これにより、次のコードがコンパイルされなくなります。

```scala
class A {
  val x = 2
}

object B {
  val x = 1
  class C extends A {
    println(x)
  }
}
```

{% highlight text %}
-- [E049] Reference Error: src/main/scala/inheritance-shadowing.scala:9:14 
9 |      println(x)
  |              ^
  |              Reference to x is ambiguous,
  |              it is both defined in object B
  |              and inherited subsequently in class C
{% endhighlight %}

[Scala 3移行コンパイル](tooling-migration-mode.html) は`println(x)` を`println(this.x)`に置き換えることで自動的に曖昧性解消を行います。

## プライベートクラスのNon privateなコンストラクタ

Scala 3ではプライベートクラスのコンストラクタはプライベートである必要があります。

例としては、次のようになります。:

```scala
package foo

private class Bar private[foo] () {}
```

エラーメッセージはこのようになります。:
```
-- Error: /home/piquerez/scalacenter/scala-3-migration-guide/incompat/access-modifier/src/main/scala-2.13/access-modifier.scala:4:19 
4 |  private class Bar private[foo] ()
  |                   ^
  |      non-private constructor Bar in class Bar refers to private class Bar
  |      in its type signature (): foo.Foo.Bar
```

[Scala 3移行コンパイル](tooling-migration-mode.html) では自動的には書き換えが行われずWARNINGが与えられます。

クラスはプライベートであるため、この解決策としてはコンストラクタをプライベートにすることです。

## 抽象オーバーライド

Scala 3では、抽象defでdefをオーバーライドすると、サブクラスはdef抽象を考慮しますが、Scala 2では具象とみなされていました。

次のコードでは、`C`の`bar`メソッドはScala 2.13コンパイラでは具象であるとみなされていますが、Scala 3コンパイラでは抽象的であるとみなされてるため、次のエラーが発生します。

```scala
trait A {
  def bar(x: Int): Int = x + 3
}

trait B extends A {
  def bar(x: Int): Int
}

class C extends B // Error: def bar(x: Int): Int は定義されていませんので、class C は抽象である必要があります
```

この振る舞いは[Dotty issue #4770](https://github.com/lampepfl/dotty/issues/4770)で決定しました。

簡単な修正は、抽象defを削除することです。
これは、実際にはScala 2では効果がなかったためです。

## ケースクラスコンパニオン

ケースクラスのコンパニオンオブジェクトは`Function{0-23}`の特性を拡張しなくなりました。
特に、これらのメソッドは継承しなくなりました。: `tupled`, `curried`, `andThen`, `compose`...

例として、このコードは無効になります。:

```scala
case class Foo(x: Int, b: Boolean)

Foo.curried(1)(true)
Foo.tupled((2, false))
```

クロスコンパイルによるソリューションはメソッド`Foo.apply`を明示的にEta展開することです。

{% highlight diff %}
-Foo.curried(1)(true)
+(Foo.apply _).curried(1)(true)

-Foo.tupled((2, false))
+(Foo.apply _).tupled((2, false))
{% endhighlight %}

パフォーマンス上の理由から、中間間数値を導入することもできます。

```scala
val fooCtr: (Int, Boolean) => Foo = (x, b) => Foo(x, b)

fooCtr.curried(1)(true)
fooCtr.tupled((2, false))
```
## 明示的な`unapply`の呼び出し

Scalaにおいて、ケースクラスには自動生成された抽象メソッドがあり、コンパニオンオブジェクトで`unapply`と呼ばれます。
Scala 2.13とScala 3間でシグネチャが変わりました。

新しいシグネチャは、オプションがありません(参照として新しい[Pattern Matching](/scala3/reference/changed-features/pattern-matching.html)) 、これにより、`unapply`が明示的に呼び出されたときに非互換性が発生します。

この問題は、Scalaバージョン間でシグネチャが同じ状態のユーザが定義したエクストラクタには影響しないことに注意してください。

次のケースクラス定義があるとします。:

```scala
case class Location(lat: Double, long: Double)
```

Scala 2.13コンパイラでは `unapply` メソッドを生成します :

```scala
object Location {
  def unapply(location: Location): Option[(Double, Double)] = Some((location.lat, location.long))
}
```

一方でScala 3コンパイラでは以下のようにメソッドが生成されます:

```scala
object Location {
  def unapply(location: Location): Location = location
}
```

その結果、次のコードはコンパイルされなくなります。

```scala
def tuple(location: Location): (Int, Int) = {
  Location.unapply(location).get // [E008] Not Found Error: value get is not a member of Location
}
```

考えられる解決策は、パターンバインディングを使用することです。:

{% highlight diff %}
def tuple(location: Location): (Int, Int) = {
-  Location.unapply(location).get
+  val Location(lat, lon) = location
+  (lat, lon)
}
{% endhighlight %}

## 見えないビーンプロパティ

`BeanProperty`アノテーションにより生成されたgetterとsetterメソッドは、主なユースケースがJavaフレームワークと相互運用性があるため、Scala 3では表示されなくなりました。

例として下記に示します。:

```scala
class Pojo() {
  @BeanProperty var fooBar: String = ""
}

val pojo = new Pojo()

pojo.setFooBar("hello") // [E008] Not Found Error: value setFooBar is not a member of Pojo

println(pojo.getFooBar()) // [E008] Not Found Error: value getFooBar is not a member of Pojo
```

解決策は、より慣用的な`pojo.fooBar` getterとsetter呼び出すことです。

{% highlight diff %}
val pojo = new Pojo()

-pojo.setFooBar("hello")
+pojo.fooBar = "hello"

-println(pojo.getFooBar())
+println(pojo.fooBar)
{% endhighlight %}

## 型パラメータとしての`=> T`

この`=> T`ようなフォームでは型パラメータへの引数として使用できなくなりました。 

この決定はScala3ソースコードの[コメント](https://github.com/lampepfl/dotty/blob/0f1a23e008148f76fd0a1c2991b991e1dad600e8/compiler/src/dotty/tools/dotc/core/ConstraintHandling.scala#L144-L152)で説明しています。

例として、`Int => (=> Int) => Int`の関数は、型パラメータ`T2`に`=> Int` を割り当てるため、カリー化なしのメソッドにわたすことはできません。

```
-- [E134] Type Mismatch Error: src/main/scala/by-name-param-type-infer.scala:3:41
3 |  val g: (Int, => Int) => Int = Function.uncurried(f)
  |                                ^^^^^^^^^^^^^^^^^^
  |None of the overloaded alternatives of method uncurried in object Function with types
  | [T1, T2, T3, T4, T5, R]
  |  (f: T1 => T2 => T3 => T4 => T5 => R): (T1, T2, T3, T4, T5) => R
  | [T1, T2, T3, T4, R](f: T1 => T2 => T3 => T4 => R): (T1, T2, T3, T4) => R
  | [T1, T2, T3, R](f: T1 => T2 => T3 => R): (T1, T2, T3) => R
  | [T1, T2, R](f: T1 => T2 => R): (T1, T2) => R
  |match arguments ((Test.f : Int => (=> Int) => Int))
```

この解決策は状況に依存します。例として、いずれかを行うことができます。:
  - 適切なシグネチャを使用して、独自の`カリー化してない`メソッドを定義します。
  - `カリー化していない`実装をローカルでインライン化する。

## 型引数のワイルドカード

Scala 3ではワイルドカードの引数より種類の多い抽象型メンバーへの適用は減らすことができません。

この例では、コンパイルされません。

```scala
trait Example {
  type Foo[A]

  def f(foo: Foo[_]): Unit // [E043] Type Error: unreducible application of higher-kinded type Example.this.Foo to wildcard arguments 
}
```

型パラメータを使うことで修正できます。:

{% highlight diff %}
-def f(foo: Foo[_]): Unit
+def f[A](foo: Foo[A]): Unit
{% endhighlight %}

しかし、簡単な解決策では`Foo`が自身を型パラメータとして使われるときはうまくいきません。

```scala
def g(foos: Seq[Foo[_]]): Unit
```

このようなケースでは、`Foo`の周りをラップするクラスを使います。:

{% highlight diff %}
+class FooWrapper[A](foo: Foo[A])

-def g(foos: Seq[Foo[_]]): Unit
+def g(foos: Seq[FooWrapper[_]]): Unit
{% endhighlight %}
