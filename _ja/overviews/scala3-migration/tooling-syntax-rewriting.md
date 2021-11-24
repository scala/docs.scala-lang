---
title: Scala 3 シンタックスの書き換え
type: chapter
description: このセクションではScala 3のシンタックス書き換え機能について説明します 
num: 13
previous-page: tutorial-macro-mixing
next-page: incompatibility-table
language: ja
---

Scala 3では新しい制御構文と重要なインデント構文でScala言語のシンタックスが拡張されています。
どちらもオプションであるため、Scala 2コードスタイルはScala 3でも完全に有効です。

制御構造の新しいシンタックスにより、括弧を囲まずに、`if`式の条件、`while`ループの条件、または`for`式のジェネレータを記述することができます。 

重要なインデント構文として、クラスとメソッドの本体、`if`式、`match`式など、多くの場合に中括弧は不要となります。
完全な説明はScala3リファレンスウェブサイトの[オプションナルな中括弧](https://docs.scala-lang.org/scala3/reference/other-new-features/indentation.html) ページにあります。

既存のScalaコードを手動で新しい構文に変換するのは面倒で、エラーが発生しやすくなります。
この章では、コンパイラを使用して、コードを従来のScala 2スタイルから新しいコードスタイルに、またはその逆について、自動的に書き換える方法を示します。

## シンタックス書き換えオプション

目的を達成することが可能になるコンパイラオプションを見ましょう。
コマンドラインで`scalac`と入力するだけで、自由に使用できる全てのオプションが出力されます。
ここでは5つのオプションを使用します。:

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

最初の4つのオプションはそれぞれ、特定の構文に対応しています。:

| Syntax | Option |
| - | - |
| New Control Structures | `-new-syntax` |
| Old Control Structures | `-old-syntax` |

| Syntax | Compiler Option |
|-|-|
| Significant Indentation | `-indent` |
| Classical Braces | `-noindent` |


さらに詳しく説明するように、これらのオプションを`-rewrite` オプションと組み合わせて使用すると、特定の構文への変換を自動的にできます。
小さな例を使って、このオプションがどのように機能するか見てみましょう。

## 新しいシンタックスの書き換え

Scala 2スタイルで書かれたコードを下記に示します。

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

我々は２つのステップで自動的に新しい構文に移動させることが可能です。: まずはじめに、`-new-syntax -rewrite`オプションで新しい構文に、そして、重要なインデントに関しては`-indent -rewrite`を書きます。

> `-indent` オプションは既存の制御構文上では動きません。
> なので、2つのステップを正しい順序で実行するようにしてください。

> 残念ながら、コンパイラは両方の手順を同時に適用することはできません。: <del>`-indent -new-syntax -rewrite`</del>.

### 新しい制御構文

scalacのリストに追加することで `-new-syntax -rewrite` オプションを使う事ができます。

```scala
// build.sbt
scalacOptions ++= Seq("-new-syntax", "-rewrite")
```

コンパイル後のコードは、以下のような結果に見えるでしょう:

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

`n == maxValue` を囲む括弧と`i <- minValue to maxValue` 及び `j <- 0 to n` ジェネレーターを囲む中括弧が表示されなくなったことに注意してください。

### 重要なインデント構文

最初の書き換えの後、重要なインデント構文を使用して、残りの中括弧を削除できます。
これを行うには、`-indent` オプションを`-rewrite`オプションと組み合わせて使用します。
この組み合わせで、さらなるバージョンに導きます:

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

## 従来のシンタックスに切り戻す

コードサンプルの最新の状態から始めて、従来の状態に戻すことができます。

新しい制御構文を維持しながら、中括弧を使用してコードを書き直してみましょう。
`-no-indent -rewrite`オプションを使用してコンパイルすると、次の結果が得られます。:

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

`-old-syntax -rewrite`を使用してもう1度書き換えを適用すると、元のScala2スタイルのコードに戻ります。

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

この最後の書き直しで、完全に一周しました。

> #### 構文バージョンを循環するときにフォーマットが失われる
>
> [scalafmt](https://scalameta.org/scalafmt)などのフォーマットツールを使用してカスタムフォーマットをコードに適用するとき、異なるScala 3シンタックス変位で行ったり来たりすると、循環するときに差分が生じる可能性があります。

## 特定の構文の適用

古い構文と新しい構文を単一のコードベースに混在させることができます。
けれども読みやすさが低下し、コードの保守が難しくなるため、おすすめはしません。
よりよいアプローチは一つのスタイルを選択し、コードベース全体に一貫して適用することです。

`-no-indent`, `-new-syntax` と `-old-syntax` をスタンドアロンオプションとして使用して、一貫した構文を適用できます。

たとえば、 `-new-syntax`オプションを使用すると、コンパイラは、`if`条件を囲む括弧を検出するとエラーを発行します。 

{% highlight text %}
-- Error: /home/piquerez/scalacenter/syntax/example.scala:6:7 ------------------
6 |    if (n == maxValue)
  |       ^^^^^^^^^^^^^^^
  |This construct is not allowed under -new-syntax.
  |This construct can be rewritten automatically under -new-syntax -rewrite -source 3.0-migration.
{% endhighlight %}

> `-indent` シンタックスは常にオプショナルです、コンパイラによって強制することはできません
