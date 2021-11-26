---
title: シンタックスの変更
type: section
description: この章ではシンタックス変更に伴い生じたすべての非互換性について詳細化します
num: 15
previous-page: incompatibility-table
next-page: incompat-dropped-features
language: ja
---

Scala 3では括弧がオプションナルなシンタックスと新しい制御構造のシンタックスが導入されています。
これには、既存のシンタックスに最小限の制限があります。

他のシンタックスの変更は、意外性を減らし、一貫性を高めることを目的としています。

殆どの変更は、[Scala 3移行コンパイル](tooling-migration-mode.html)に自動的に処理できることに注意してください。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[制限された予約語](#制限された予約語)||✅||
|[手続き型シンタックス](#手続き型シンタックス)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Lambdaパラメータを囲む括弧](#lambdaパラメータを囲む括弧)||✅|[✅](https://github.com/ohze/scala-rewrites/tree/dotty/#fixscala213parensaroundlambda)|
|[引数を渡すための括弧のインデント](#引数を渡すための括弧のインデント)||✅||
|[間違ったインデント](#間違ったインデント)||||
|[型パラメータとしての`_`](#型パラメータとしての_)||||
|[型パラメータとしての`+`と`-`](#型パラメータとしてのと-)||||

## 制限された予約語

Scala 3予約語(キーワード)のリストは[ここ](https://dotty.epfl.ch/docs/internals/syntax.html#keywords)で見ることができます。
一般的な予約語を識別子として使用することはできませんが、半予約語は制限されていません。

Scala 2.13からScala 3への移行に関しては、新しい一般的な予約語の一部分のみが問題になります。
それらは下記に列挙されています。:
- `enum`
- `export`
- `given`
- `then`
- `=>>`
- `?=>`

次のコードはScala 2.13でコンパイルできますが、Scala 3ではコンパイルできません。

```scala
object given { // Error: given is now a keyword
  val enum = ??? // Error: enum is now a keyword

  println(enum) // Error: enum is now a keyword
}
```

[Scala 3移行コンパイル](tooling-migration-mode.html) では以下のようにコードが書き直されてます。:

{% highlight diff %}
-object given {
+object `given` {
-  val enum = ???
+  val `enum` = ???

-  println(enum)
+  println(`enum`)
}
{% endhighlight %}

## 手続き型シンタックス

手続き型シンタックスはしばらくの間非推奨になり、Scala 3では削除されました。
次のコードは現在使用できません。:

```scala
object Bar {
  def print() { // Error: Procedure syntax no longer supported; `: Unit =` should be inserted here
    println("bar")
  }
}
```

[Scala 3移行コンパイル](tooling-migration-mode.html)ではコードはこのように書き換わります。

{% highlight diff %}
object Bar {
-  def print() {
+  def print(): Unit = {
    println("bar")
  }
}
{% endhighlight %}

## Lambdaパラメータを囲む括弧

パラメータの型が続く場合、Lambdaのパラメータを括弧で囲む必要があります。
次のコードは無効です。

```scala
val f = { x: Int => x * x } // Error: parentheses are required around the parameter of a lambda
```

[Scala 3移行コンパイル](tooling-migration-mode.html)ではコードはこのように書き換わります:

{% highlight diff %}
-val f = { x: Int => x * x }
+val f = { (x: Int) => x * x }
{% endhighlight %}

## 引数を渡すための括弧のインデント

Scala 2では改行を中括弧で囲むことで、新しい行の後に引数を渡すことができます。
このスタイルのコーディングは有効ですが、[Scala style guide](https://docs.scala-lang.org/style) では推奨されておらず、Scala 3ではサポートされなくなりました。

このシンタックスは現在無効です。:
```scala
test("my test")
{ // Error: This opening brace will start a new statement in Scala 3.
  assert(1 == 1)
}
```

[Scala 3移行コンパイル](tooling-migration-mode.html)ではブロックの最初の行をインデントします。

{% highlight diff %}
test("my test")
-{
+  {
  assert(1 == 1)
}
{% endhighlight %}

この移行ルールは、改行の後に型を絞り込むなど、他のパターンに適用されます。

{% highlight diff %}
type Bar = Foo
- {
+   {
  def bar(): Int
}
{% endhighlight %}

望ましい解決策は次のように書くことです:

{% highlight diff %}
-test("my test")
-{
+test("my test") {
  assert(1 == 1)
}
{% endhighlight %}

## 間違ったインデント

Scala 3コンパイラは現状正しいインデントを求めます。
次のコードは、Scala 2.13ではコンパイルできたものですが、インデントを理由にコンパイルできないようになっています。

```scala
def bar: (Int, Int) = {
  val foo = 1.0
  val bar = foo // [E050] Type Error: value foo does not take parameters
    (1, 1)
} // [E007] Type Mismatch Error: Found Unit, Required (Int, Int)
```

このインデントは必ず修正しなければなりません。

{% highlight diff %}
def bar: (Int, Int) = {
  val foo = 1.0
  val bar = foo
-    (1, 1)
+  (1, 1)
}
{% endhighlight %}

これらのエラーは[scalafmt](https://scalameta.org/scalafmt/) や [IntelliJ Scala formatter](https://www.jetbrains.com/help/idea/reformat-and-rearrange-code.html)などのScalaフォーマットツールを使えば防ぐことができます。
これらのフォーマットツールはプロジェクトのコードスタイル全体を変更する可能性があるので注意してください。

## 型パラメータとしての`_`

Scala 2仕様で特段言及されたことがない場合でも、型パラメータとして`_`はScala 2.13では許容されていました。
これは[fastparse](https://index.scala-lang.org/lihaoyi/fastparse)のAPIで、コンテキストバインドと組み合わせて使用され、implicit パラメータを宣言します。


```scala
def foo[_: Foo]: Unit = ???
```

ここに、ワイルドカード記号としてではなく型パラメータとしての`_`と`Foo[_]`のimplictパラメータをとる`foo`メソッドがあります。

Martin Odersky このパターンを"scalacコンパイラのバグの巧妙な悪用"([ソース](https://www.reddit.com/r/scala/comments/fczcvo/mysterious_context_bounds_in_fastparse_2/fjecokn/))として説明していました。

Scala 3コンパイラはこのパターンを許容しません。: 

{% highlight text %}
-- [E040] Syntax Error: src/main/scala/anonymous-type-param.scala:4:10
4 |  def foo[_: Foo]: Unit = ()
  |          ^
  |          an identifier expected, but '_' found
{% endhighlight %}

解決方法としては、例えば、`T`のように有効な固有名詞を型パラメータとして与えることです。
このやり方ではバイナリ互換性は崩れないでしょう。

{% highlight diff %}
-def foo[_: Foo]: Unit = ???
+def foo[T: Foo]: Unit = ???
{% endhighlight %}

## 型パラメータとしての`+`と`-`

Scala 3の型パラメータとしては`+` と `-` は有効ではありません、なぜならこれらは変位指定のアノテーションとしての予約語だからです。

`def foo[+]` や `def foo[-]` は書くことができません。

{% highlight text %}
-- Error: src/main/scala/type-param-identifier.scala:2:10 
2 |  def foo[+]: +
  |          ^
  |          no `+/-` variance annotation allowed here
{% endhighlight %}

解決方法としては、例えば、`T`のように有効な固有名詞を型パラメータとして与えることです。

しかしながら、`+` と `-` は一般的に有効な型識別子です。
`type +`とは書くことができます。
