---
title: 構文の変更
type: section
description: この章では構文変更に伴い生じる全ての非互換性について詳細化します
num: 15
previous-page: incompatibility-table
next-page: incompat-dropped-features
language: ja
---

Scala 3では括弧がオプションナルな構文と新しい制御構造の構文が導入された。
この導入により、既存の構文にごく僅かな制限がある。

他の構文の変更は、意外性を減らし、一貫性を高めることを目的としている。

殆どの変更は、[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)に自動的に処理できることに注意すべきだ。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[制限された予約語](#制限された予約語)||✅||
|[手続き型構文](#手続き型構文)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Lambdaパラメータを囲む括弧](#lambdaパラメータを囲む括弧)||✅|[✅](https://github.com/ohze/scala-rewrites/tree/dotty/#fixscala213parensaroundlambda)|
|[引数を渡すための括弧のインデント](#引数を渡すための括弧のインデント)||✅||
|[間違ったインデント](#間違ったインデント)||||
|[型パラメータとしての`_`](#型パラメータとしての_)||||
|[型パラメータとしての`+`と`-`](#型パラメータとしてのと-)||||

## 制限された予約語

Scala 3 予約語(キーワード)のリストは[ここ](https://dotty.epfl.ch/docs/internals/syntax.html#keywords)で見ることができる。
一般的な予約語を識別子として使用することはできないが、半予約語は制限されていない。

Scala 2.13 から Scala 3 への移行に関しては、新しい一般的な予約語の一部分が問題になる。
問題になる予約語の一部を下記に列挙する:

- `enum`
- `export`
- `given`
- `then`
- `=>>`
- `?=>`

次のコードは Scala 2.13 でコンパイルできますが、Scala 3 ではコンパイルできない。

```scala
object given { // Error: given is now a keyword
  val enum = ??? // Error: enum is now a keyword

  println(enum) // Error: enum is now a keyword
}
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html) では以下のようにコードが書き直される:

{% highlight diff %}
-object given {
+object `given` {
-  val enum = ???
+  val `enum` = ???

-  println(enum)
+  println(`enum`)
}
{% endhighlight %}

## 手続き型構文

手続き型構文はしばらくの間非推奨になり、Scala 3 では削除された。
次のコードは現在使用できない:

```scala
object Bar {
  def print() { // Error: Procedure syntax no longer supported; `: Unit =` should be inserted here
    println("bar")
  }
}
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードはこのように書き換わる。

{% highlight diff %}
object Bar {
-  def print() {
+  def print(): Unit = {
    println("bar")
  }
}
{% endhighlight %}

## Lambdaパラメータを囲む括弧

パラメータの型が続く場合、Lambda のパラメータを括弧で囲む必要がある。
次のコードは無効だ。

```scala
val f = { x: Int => x * x } // Error: parentheses are required around the parameter of a lambda
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードはこのように書き換わる:

{% highlight diff %}
-val f = { x: Int => x * x }
+val f = { (x: Int) => x * x }
{% endhighlight %}

## 引数を渡すための括弧のインデント

Scala 2 では改行を中括弧で囲むことで、新しい行の後に引数を渡すことができる。
このスタイルのコーディングは有効だが、[Scala style guide](https://docs.scala-lang.org/style) では推奨されておらず、Scala 3 ではサポートされなくなった。

この構文は現在無効だ:
```scala
test("my test")
{ // Error: This opening brace will start a new statement in Scala 3.
  assert(1 == 1)
}
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではブロックの最初の行をインデントする。

{% highlight diff %}
test("my test")
-{
+  {
  assert(1 == 1)
}
{% endhighlight %}

この移行ルールは、改行の後に型を絞り込むなど、他のパターンに適用される。

{% highlight diff %}
type Bar = Foo
- {
+   {
  def bar(): Int
}
{% endhighlight %}

望ましい解決策は次のように書くことだ:

{% highlight diff %}
-test("my test")
-{
+test("my test") {
  assert(1 == 1)
}
{% endhighlight %}

## 間違ったインデント

Scala 3 コンパイラは現状正しいインデントを求める。
次のコードは、Scala 2.13 ではコンパイルできたが、Scala 3ではインデントを理由にコンパイルできないようになっている。

```scala
def bar: (Int, Int) = {
  val foo = 1.0
  val bar = foo // [E050] Type Error: value foo does not take parameters
    (1, 1)
} // [E007] Type Mismatch Error: Found Unit, Required (Int, Int)
```

このインデントは必ず修正しなければならない。

{% highlight diff %}
def bar: (Int, Int) = {
  val foo = 1.0
  val bar = foo
-    (1, 1)
+  (1, 1)
}
{% endhighlight %}

これらのエラーは[scalafmt](https://scalameta.org/scalafmt/) や [IntelliJ Scala formatter](https://www.jetbrains.com/help/idea/reformat-and-rearrange-code.html)などの Scala フォーマットツールを使えば防ぐことができる。
これらのフォーマットツールはプロジェクトのコードスタイル全体を変更する可能性があるので注意すべきです。

## 型パラメータとしての`_`

Scala 2 仕様で特段言及されたことがない場合でも、型パラメータとして `_` は Scala 2.13 では許容されていた。
これは[fastparse](https://index.scala-lang.org/lihaoyi/fastparse)の API で、コンテキストバインドと組み合わせて使用され、implicit パラメータを宣言する。


```scala
def foo[_: Foo]: Unit = ???
```

ここに、ワイルドカード記号としてではなく型パラメータとしての `_` と `Foo[_]` の implict パラメータをとる `foo` メソッドがある。

Martin Odersky このパターンを"scalac コンパイラのバグの巧妙な悪用"([ソース](https://www.reddit.com/r/scala/comments/fczcvo/mysterious_context_bounds_in_fastparse_2/fjecokn/))として説明していた。

Scala 3 コンパイラはこのパターンを許容しない: 

{% highlight text %}
-- [E040] Syntax Error: src/main/scala/anonymous-type-param.scala:4:10
4 |  def foo[_: Foo]: Unit = ()
  |          ^
  |          an identifier expected, but '_' found
{% endhighlight %}

解決方法は、例えば、`T` のように有効な固有名詞を型パラメータとして与えることだ。
このやり方ではバイナリ互換性は崩れないだろう。

{% highlight diff %}
-def foo[_: Foo]: Unit = ???
+def foo[T: Foo]: Unit = ???
{% endhighlight %}

## 型パラメータとしての`+`と`-`

Scala 3 の型パラメータとしては `+` と `-` は有効ではない。なぜならこれらは変位指定のアノテーションとしての予約語だからだ。

`def foo[+]` や `def foo[-]` は書くことができない。

{% highlight text %}
-- Error: src/main/scala/type-param-identifier.scala:2:10 
2 |  def foo[+]: +
  |          ^
  |          no `+/-` variance annotation allowed here
{% endhighlight %}

解決方法としては、例えば、`T` のように有効な固有名詞を型パラメータとして与えることだ。

しかしながら、`+` と `-` は一般的に有効な型識別子だ。
なので、`type +`とは書くことができる。
