---
title: Scala 3 構文の書き換え
type: chapter
description: このセクションではScala 3の構文書き換え機能について説明します 
num: 13
previous-page: tutorial-macro-mixing
next-page: incompatibility-table
language: ja
---

Scala 3 では新しい制御構文と重要なインデント構文で Scala 言語の構文が拡張されている。
どちらもオプショナルであるため、Scala 2 コードスタイルは Scala 3でも完全に有効だ。

制御構造の新しい構文により、括弧を囲まずに、`if` 式の条件、`while` ループの条件、または `for` 式のジェネレータを記述することができる。 

重要なインデント構文として、クラスとメソッドの本体、`if`式、`match` 式など、多くの場合に中括弧は不要だ。
完全な説明は Scala3 リファレンスウェブサイトの[オプションナルな中括弧](https://docs.scala-lang.org/scala3/reference/other-new-features/indentation.html) ページにある。

既存の Scala コードを手動で新しい構文に変換するのは面倒で、エラーが発生しやすくなる。
この章では、コンパイラを使用して、コードを従来の Scala 2 スタイルから新しいコードスタイルに、またはその逆について、自動的に書き換える方法を示す。

## 構文書き換えオプション

自動的な構文書き換えを達成するためのコンパイラオプションを見てみよう。
コマンドラインで `scalac` と入力するだけで、自由に使用できる全てのオプションが出力される。
ここでは5つのオプションを使用する:

{% highlight text %}
$ scalac
Usage: scalac <options> <source files>
where possible standard options include:
...
-indent</b>            Allow significant indentation
...
-new-syntax</b>        Require `then` and `do` in control expressions.
-no-indent</b>          Require classical {...} syntax, indentation is not significant.
...
-old-syntax</b>        Require `(...)` around conditions.
...
-rewrite</b>           When used in conjunction with a `...-migration` source version,
                       rewrites sources to migrate to new version.
...

{% endhighlight %}

最初の4つのオプションは、それぞれ特定の構文に対応している:

| Syntax | Option |
| - | - |
| New Control Structures | `-new-syntax` |
| Old Control Structures | `-old-syntax` |

| Syntax | Compiler Option |
|-|-|
| Significant Indentation | `-indent` |
| Classical Braces | `-noindent` |


さらに詳しく説明するように、これらのオプションを `-rewrite` オプションと組み合わせて使用すると、特定の構文への変換を自動的にできる。
小規模な例を使って、このオプションがどのように機能するか見てみよう。

## 新しい構文の書き換え

Scala 2 スタイルで書かれたコードを下記に示す。

```scala
case class State(n: Int, minValue: Int, maxValue: Int) {
  
  def inc: State =
    if (n == maxValue)
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    } println(i + j)
  }
}
```

2つのステップで自動的に新しい構文に移動させることが可能だ: まずはじめに、`-new-syntax -rewrite` オプションで新しい構文に、そして、重要なインデントに関しては `-indent -rewrite` オプションを使う。

> `-indent` オプションは既存の制御構文上では動かない。
> なので、2つのステップを正しい順序で実行すべきだ。

> 残念ながら、コンパイラは両方の手順を同時に適用することはできない: <del>`-indent -new-syntax -rewrite`</del>.

### 新しい制御構文

scalac のリストに追加することで `-new-syntax -rewrite` オプションを使う事ができる。

```scala
// build.sbt
scalacOptions ++= Seq("-new-syntax", "-rewrite")
```

コンパイル後のコードは、以下のような結果に見えるだろう:

```scala
case class State(n: Int, minValue: Int, maxValue: Int) {
  
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit = {
    println("Printing all")
    for
      i <- minValue to maxValue
      j <- 0 to n
    do println(i + j)
  }
}
```

`n == maxValue` を囲む括弧と `i <- minValue to maxValue` 及び `j <- 0 to n` ジェネレーターを囲む中括弧が表示されなくなったことに注意せよ。

### 重要なインデント構文

最初の書き換えの後、重要なインデント構文を使用して、残りの中括弧を削除できる。
これを行うには、`-indent` オプションを `-rewrite` オプションと組み合わせて使用する。
この組み合わせで、さらなる変更を与える:

```scala
case class State(n: Int, minValue: Int, maxValue: Int):
  
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit =
    println("Printing all")
    for
      i <- minValue to maxValue
      j <- 0 to n
    do println(i + j)
```

## 従来の構文に切り戻す

コードサンプルの最新の状態から始めて、従来の状態に戻すことができる。

新しい制御構文を維持しながら、中括弧を使用してコードを書き直してみよう。
`-no-indent -rewrite` オプションを使用してコンパイルすると、次の結果が得られる:

```scala
case class State(n: Int, minValue: Int, maxValue: Int) {
  
  def inc: State =
    if n == maxValue then
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    }
    do println(i + j)
  }
}
```

`-old-syntax -rewrite` を使用してもう1度書き換えの適用を行うと、元の Scala 2 スタイルのコードに戻る。

```scala
case class State(n: Int, minValue: Int, maxValue: Int) {
  
  def inc: State =
    if (n == maxValue)
      this
    else
      this.copy(n = n + 1)
  
  def printAll: Unit = {
    println("Printing all")
    for {
      i <- minValue to maxValue
      j <- 0 to n
    }
    println(i + j)
  }
}
```

この最後の書き直しで、完全に一巡した。

> #### 構文バージョンを循環するときにフォーマットが失われる
>
> [scalafmt](https://scalameta.org/scalafmt)などのフォーマットツールを使用してカスタムフォーマットをコードに適用する際、異なる Scala 3 構文変位で行ったり来たりすると、循環するときに差分が生じる可能性がある。

## 特定の構文の適用

古い構文と新しい構文を単一のコードベースに混在させることができる。
しかし可読性が低下し、コードの保守が難しくなるため、おすすめはしない。
よりよいアプローチは一つのスタイルを選択し、コードベース全体に一貫して適用することだ。

`-no-indent`, `-new-syntax` と `-old-syntax` をスタンドアロンオプションとして使用して、一貫した構文を適用できる。

たとえば、 `-new-syntax` オプションを使用すると、コンパイラは、`if` 条件を囲む括弧を検出するとエラーを発行する。 

{% highlight text %}
-- Error: /home/piquerez/scalacenter/syntax/example.scala:6:7 ------------------
6 |    if (n == maxValue)
  |       ^^^^^^^^^^^^^^^
  |This construct is not allowed under -new-syntax.
  |This construct can be rewritten automatically under -new-syntax -rewrite -source 3.0-migration.
{% endhighlight %}

> `-indent` 構文は常にオプショナルなので、コンパイラによって強制することはできない。
