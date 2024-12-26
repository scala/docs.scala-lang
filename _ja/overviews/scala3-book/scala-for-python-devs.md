---
title: Scala for Python Developers
type: chapter
description: This page is for Python developers who are interested in learning about Scala 3.
languages: [zh-cn, ja]
num: 76
previous-page: scala-for-javascript-devs
next-page: where-next
---

{% include_relative scala4x.css %}

<div markdown="1" class="scala3-comparison-page">

{% comment %}

NOTE: Hopefully someone with more Python experience can give this a thorough review.

NOTE: On this page (https://contributors.scala-lang.org/t/feedback-sought-optional-braces/4702/10), Li Haoyi comments: “Python’s success also speaks for itself; beginners certainly don’t pick Python because of performance, ease of installation, packaging, IDE support, or simplicity of the language’s runtime semantics!” I’m not a Python expert, so these points are good to know, though I don’t want to go negative in any comparisons.
It’s more like thinking, “Python developers will appreciate Scala’s performance, ease of installation, packaging, IDE support, etc.”
{% endcomment %}

{% comment %}
TODO: We should probably go through this document and add links to our other detail pages, when time permits.
{% endcomment %}

This section provides a comparison between the Python and Scala programming languages.
It’s intended for programmers who know Python and want to learn about Scala, specifically by seeing examples of how Python language features compare to Scala.

## はじめに

例に入る前に、この最初のセクションでは、後に続くセクションの簡単な紹介と概要を提供します。
まず、2つの言語を高レベルで比較し、その後、日常的なプログラミングレベルでの比較を行います。

### 高レベルでの類似点

高レベルで見ると、ScalaはPythonと以下のような *類似点* を共有しています。

- 高水準プログラミング言語であり、ポインタや手動でのメモリ管理といった低レベルの概念を気にする必要がありません。
- 比較的シンプルで簡潔な構文を持ちます。
- [関数型プログラミングスタイル][fp-intro]をサポートしています。
- オブジェクト指向プログラミング（OOP）言語です。
- 内包表記（comprehensions）をサポートしています。Pythonにはリスト内包表記があり、Scalaには`for`内包表記があります。
- ラムダ式と[高階関数][hofs]をサポートしています。
- [Apache Spark](https://spark.apache.org)を用いたビッグデータ処理に使用できます。
- 優れたライブラリが豊富に使用できます。

### 高レベルでの相違点

高レベルで見ると、PythonとScalaの間には以下のような _相違点_ があります：

- Python は動的型付け言語であり、Scala は静的型付け言語です。
  - Pythonは動的型付けですが、型ヒントによる「段階的型付け」をサポートしており、`mypy`のような静的型チェッカーで検証できます。
  - Scalaは静的型付けですが、型推論のような機能により動的言語のような感覚で書けます。
- Pythonはインタプリタ型で実行され、Scalaのコードはコンパイルされて _.class_ ファイルになり、Java仮想マシン（JVM）上で動作します。
- JVMでの実行に加えて、[Scala.js](https://www.scala-js.org)によりScalaをJavaScriptの代替として使用することもできます。
- [Scala Native](https://scala-native.org/)では、「システムレベル」のコードを記述し、ネイティブ実行ファイルにコンパイルできます。
- Scalaではすべてが _式_ である：`if`文、`for`ループ、`match`式、さらには`try`/`catch`式でさえも、戻り値を持ちます。
- Scalaのイディオムはデフォルトで不変性を推奨する：不変変数や不変コレクションを使用することが推奨されています。
- Scalaは[並行・並列プログラミング][concurrency]のサポートが優れています。

### プログラミングレベルでの類似点

このセクションでは、PythonとScalaでコードを書く際に日常的に見られる類似点を紹介します。

- Scalaの型推論により、動的型付け言語のような感覚でコーディングできます。
- どちらの言語も式の末尾にセミコロンを使用しません。
- 中括弧や括弧ではなく、インデントを重要視した記述がサポートされています。
- メソッド定義の構文が似ています。
- 両方ともリスト、辞書（マップ）、セット、タプルをサポートしています。
- マッピングやフィルタリングに対応した内包表記を備えています。
- 優れたIDEサポートがあります。
- Scala 3の[トップレベル定義][toplevel]を利用することで、メソッドやフィールド、その他の定義をどこにでも記述できます。
  - 一方で、Pythonはメソッドを1つも宣言しなくても動作できますが、Scala 3ではトップレベルですべてを実現することはできません。たとえば、Scalaアプリケーションを開始するには[mainメソッド][main-method]（`@main def`）が必要です。

### プログラミングレベルでの違い

プログラミングレベルでも、コードを書く際に日常的に見られるいくつかの違いがあります：

- Scalaでのプログラミングは非常に一貫性があります：
  - フィールドやパラメータを定義する際に、`val`と`var`が一貫して使用されます
  - リスト、マップ、セット、タプルはすべて同様に作成・アクセスされます。たとえば、他のScalaクラスを作成するのと同様に、すべてのタイプを作成するために括弧が使用されます---`List(1,2,3)`, `Set(1,2,3)`, `Map(1->"one")`
  - [コレクションクラス][collections-classes] は一般的にほとんど同じ高階関数を持っています
  - パターンマッチングは言語全体で一貫して使用されます
  - メソッドに渡される関数を定義するために使用される構文は、匿名関数を定義するために使用される構文と同じです
- Scalaの変数やパラメータは`val`（不変）または `var`（可変）キーワードで定義されます
- Scalaのイディオムは不変データ構造を好みます
- コメント： Pythonはコメントに `#` を使用しますが、ScalaはC、C++、Javaスタイルの `//`、`/*...*/`、および `/**...*/` を使用します
- 命名規則： Pythonの標準は `my_list` のようにアンダースコアを使用しますが、Scalaは `myList` を使用します
- Scalaは静的型付けであるため、メソッドパラメータ、メソッドの戻り値、その他の場所で型を宣言します
- パターンマッチングと `match` 式はScalaで広範に使用されており、コードの書き方を変えるでしょう
- トレイト（Traits）： Scalaではトレイトが多用され、Pythonではインターフェースや抽象クラスがあまり使用されません
- Scalaの[コンテキスト抽象][contextual]と _型推論_ は、さまざまな機能のコレクションを提供します：
  - [拡張メソッド][extension-methods] により、明確な構文を使用してクラスに新しい機能を簡単に追加できます
  - [多元的等価性][multiversal] により、コンパイル時に意味のある比較にのみ等価比較を制限できます
- Scalaには最先端のオープンソース関数型プログラミングライブラリがあります（[“Awesome Scala”リスト](https://github.com/lauris/awesome-scala)を参照）
-  オブジェクト、名前渡しパラメータ、中置表記、オプションの括弧、拡張メソッド、高階関数などの機能により、独自の「制御構造」やDSLを作成できます
-  ScalaコードはJVM上で実行でき、[Scala Native](https://github.com/scala-native/scala-native)や[GraalVM](https://www.graalvm.org)を使用してネイティブイメージにコンパイルすることも可能で、高性能を実現します
-  その他多くの機能：コンパニオンクラスとオブジェクト、マクロ、数値リテラル、複数のパラメータリスト、[交差型][intersection-types]、型レベルプログラミングなど

### 機能の比較と例

この導入に基づき、以下のセクションではPythonとScalaのプログラミング言語機能を並べて比較します。

{% comment %} TODO: Pythonの例をスペース四つに更新します。開始しましたが、別のPRで行う方が良いと思いました。 {% endcomment %}

## コメント

Pythonはコメントに # を使用しますが、Scalaのコメント構文はC、C++、Javaなどの言語と同じです。

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># a comment</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// a comment
        <br>/* ... */
        <br>/** ... */</code>
      </td>
    </tr>
  </tbody>
</table>

## 変数の割り当て

これらの例は、PythonとScalaで変数を作成する方法を示しています。

### 整数変数,文字列変数

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = 1
        <br>x = "Hi"
        <br>y = """foo
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bar
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; baz"""</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = 1
        <br>val x = "Hi"
        <br>val y = """foo
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; bar
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; baz"""</code>
      </td>
    </tr>
  </tbody>
</table>

### リスト

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = List(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### 辞書/マップ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = {
        <br>&nbsp; "Toy Story": 8.3,
        <br>&nbsp; "Forrest Gump": 8.8,
        <br>&nbsp; "Cloud Atlas": 7.4
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = Map(
        <br>&nbsp; "Toy Story" -&gt; 8.3,
        <br>&nbsp; "Forrest Gump" -&gt; 8.8,
        <br>&nbsp; "Cloud Atlas" -&gt; 7.4
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

### 集合

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = {1,2,3}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### タプル

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = (11, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = (11, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

Scalaのフィールドが可変になる場合は、変数定義に `val` の代わりに `var` を使います。

```scala
var x = 1
x += 1
```

しかし、Scalaの慣習として、特に変数を変更する必要がない限り、常に`val`を使います。

## 関数型プログラミングスタイルのレコード

Scalaのケース・クラスはPythonのフローズン・データクラスに似ています。

### 構造体の定義

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>from dataclasses import dataclass, replace
        <br>
        <br>@dataclass(frozen=True)
        <br>class Person:
        <br>&nbsp; name: str
        <br>&nbsp; age: int</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>case class Person(name: String, age: Int)</code>
      </td>
    </tr>
  </tbody>
</table>

### インスタンスを作成して使用する

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>p = Person("Alice", 42)
        <br>p.name&nbsp;&nbsp; # Alice
        <br>p2 = replace(p, age=43)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val p = Person("Alice", 42)
        <br>p.name&nbsp;&nbsp; // Alice
        <br>val p2 = p.copy(age = 43)</code>
      </td>
    </tr>
  </tbody>
</table>

## オブジェクト指向プログラミングスタイルのクラスとメソッド

このセクションでは、オブジェクト指向プログラミングスタイルのクラスとメソッドに関する機能の比較を行います。

### クラスとプライマリーコンストラクタ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>class Person(object):
        <br>&nbsp; def __init__(self, name):
        <br>&nbsp;&nbsp;&nbsp; self.name = name
        <br>
        <br>&nbsp; def speak(self):
        <br>&nbsp;&nbsp;&nbsp; print(f'Hello, my name is {self.name}')</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>class Person (var name: String):
        <br>&nbsp; def speak() = println(s"Hello, my name is $name")</code>
      </td>
    </tr>
  </tbody>
</table>

### インスタンスを作成して使用する

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>p = Person("John")
        <br>p.name&nbsp;&nbsp; # John
        <br>p.name = 'Fred'
        <br>p.name&nbsp;&nbsp; # Fred
        <br>p.speak()</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val p = Person("John")
        <br>p.name&nbsp;&nbsp; // John
        <br>p.name = "Fred"
        <br>p.name&nbsp;&nbsp; // Fred
        <br>p.speak()</code>
      </td>
    </tr>
  </tbody>
</table>

### 1行メソッド

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def add(a, b): return a + b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def add(a: Int, b: Int): Int = a + b</code>
      </td>
    </tr>
  </tbody>
</table>

### 複数行のメソッド

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def walkThenRun():
        <br>&nbsp; print('walk')
        <br>&nbsp; print('run')</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def walkThenRun() =
        <br>&nbsp; println("walk")
        <br>&nbsp; println("run")</code>
      </td>
    </tr>
  </tbody>
</table>

## インターフェース、トレイト、継承

Java 8以降をご存じであれば、ScalaのtraitはJavaのインターフェースに似ていることがお分かりいただけるかと思います。
Pythonのインターフェース（プロトコル）や抽象クラスがあまり使われないのに対して、Scalaではトレイトが常に使われています。
したがって、この例では両者を比較するのではなく、Scalaのトレイトを使って数学のちょっとした問題を解く方法を紹介します：

```scala
trait Adder:
  def add(a: Int, b: Int) = a + b

trait Multiplier:
  def multiply(a: Int, b: Int) = a * b

// create a class from the traits
class SimpleMath extends Adder, Multiplier
val sm = new SimpleMath
sm.add(1,1)        // 2
sm.multiply(2,2)   // 4
```

クラスやオブジェクトでtraitを使う方法は他にも[たくさんあります][modeling-intro]、 
しかし、これは概念を論理的な動作のグループに整理して、完全な解答を作成するために必要に応じてそれらを統合するために、どのように使うことができるかのちょっとしたアイデアを与えてくれます。

## 制御構文

ここではPythonとScalaの[制御構文][control-structures]を比較する。
どちらの言語にも `if`/`else`, `while`, `for` ループ、 `try` といった構文がある。
加えて、Scala には `match` 式がある。

### `if` 文, 1行

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x == 1: print(x)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` 文, 複数行

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x == 1:
        <br>&nbsp; print("x is 1, as you can see:")
        <br>&nbsp; print(x)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x == 1 then
        <br>&nbsp; println("x is 1, as you can see:")
        <br>&nbsp; println(x)</code>
      </td>
    </tr>
  </tbody>
</table>

### if, else if, else:

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>if x &lt; 0:
        <br>&nbsp; print("negative")
        <br>elif x == 0:
        <br>&nbsp; print("zero")
        <br>else:
        <br>&nbsp; print("positive")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>if x &lt; 0 then
        <br>&nbsp; println("negative")
        <br>else if x == 0 then
        <br>&nbsp; println("zero")
        <br>else
        <br>&nbsp; println("positive")</code>
      </td>
    </tr>
  </tbody>
</table>

### `if` 文からの戻り値

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>min_val = a if a &lt; b else b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val minValue = if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### メソッドの本体としての`if`

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>def min(a, b):
        <br>&nbsp; return a if a &lt; b else b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>def min(a: Int, b: Int): Int =
        <br>&nbsp; if a &lt; b then a else b</code>
      </td>
    </tr>
  </tbody>
</table>

### `while` ループ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>i = 1
        <br>while i &lt; 3:
        <br>&nbsp; print(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>var i = 1
        <br>while i &lt; 3 do
        <br>&nbsp; println(i)
        <br>&nbsp; i += 1</code>
      </td>
    </tr>
  </tbody>
</table>

### rangeを指定した`for` ループ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(0,3):
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- 0 until 3 do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- 0 until 3) println(i)
        <br>
        <br>// multiline syntax
        <br>for
        <br>&nbsp; i &lt;- 0 until 3
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### リスト範囲内の`for` ループ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>for i &lt;- ints do println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 複数行での`for` ループ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints:
        <br>&nbsp; x = i * 2
        <br>&nbsp; print(f"i = {i}, x = {x}")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- ints
        <br>do
        <br>&nbsp; val x = i * 2
        <br>&nbsp; println(s"i = $i, x = $x")</code>
      </td>
    </tr>
  </tbody>
</table>

### 複数の “range” ジェネレーター

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,3):
        <br>&nbsp; for j in range(4,6):
        <br>&nbsp;&nbsp;&nbsp; for k in range(1,10,3):
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(f"i = {i}, j = {j}, k = {k}")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 2
        <br>&nbsp; j &lt;- 4 to 5
        <br>&nbsp; k &lt;- 1 until 10 by 3
        <br>do
        <br>&nbsp; println(s"i = $i, j = $j, k = $k")</code>
      </td>
    </tr>
  </tbody>
</table>

### ガード付きジェネレータ (`if` 式)

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0:
        <br>&nbsp;&nbsp;&nbsp; if i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0
        <br>&nbsp; if i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 行ごとに複数の`if`条件

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in range(1,11):
        <br>&nbsp; if i % 2 == 0 and i &lt; 5:
        <br>&nbsp;&nbsp;&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for
        <br>&nbsp; i &lt;- 1 to 10
        <br>&nbsp; if i % 2 == 0 &amp;&amp; i &lt; 5
        <br>do
        <br>&nbsp; println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

### 内包表記

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>xs = [i * 10 for i in range(1, 4)]
        <br># xs: [10,20,30]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val xs = for i &lt;- 1 to 3 yield i * 10
        <br>// xs: Vector(10, 20, 30)</code>
      </td>
    </tr>
  </tbody>
</table>

### `match` 条件式

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># From 3.10, Python supports structural pattern matching
        <br># You can also use dictionaries for basic “switch” functionality
        <br>match month:
        <br>&nbsp; case 1:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "January"
        <br>&nbsp; case 2:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "February"
        <br>&nbsp; case _:
        <br>&nbsp;&nbsp;&nbsp; monthAsString = "Other"</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val monthAsString = month match
        <br>&nbsp; case 1 =&gt; "January"
        <br>&nbsp; case 2 =&gt; "February"
        <br>&nbsp; _ =&gt; "Other"</code>
      </td>
    </tr>
  </tbody>
</table>

### switch/match

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code># Only from Python 3.10
        <br>match i:
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "even"
        <br>&nbsp; case _:
        <br>&nbsp;&nbsp;&nbsp; numAsString = "too big"</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val numAsString = i match
        <br>&nbsp; case 1 | 3 | 5 | 7 | 9 =&gt; "odd"
        <br>&nbsp; case 2 | 4 | 6 | 8 | 10 =&gt; "even"
        <br>&nbsp; case _ =&gt; "too big"</code>
      </td>
    </tr>
  </tbody>
</table>

### try, catch, finally

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>try:
        <br>&nbsp; print(a)
        <br>except NameError:
        <br>&nbsp; print("NameError")
        <br>except:
        <br>&nbsp; print("Other")
        <br>finally:
        <br>&nbsp; print("Finally")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>try
        <br>&nbsp; writeTextToFile(text)
        <br>catch
        <br>&nbsp; case ioe: IOException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(ioe.getMessage)
        <br>&nbsp; case fnf: FileNotFoundException =&gt;
        <br>&nbsp;&nbsp;&nbsp; println(fnf.getMessage)
        <br>finally
        <br>&nbsp; println("Finally")</code>
      </td>
    </tr>
  </tbody>
</table>

Match expressions and pattern matching are a big part of the Scala programming experience, but only a few `match` expression features are shown here. See the [Control Structures][control-structures] page for many more examples.

## コレクションクラス

This section compares the [collections classes][collections-classes] that are available in Python and Scala, including lists, dictionaries/maps, sets, and tuples.

### リスト

Where Python has its list, Scala has several different specialized mutable and immutable sequence classes, depending on your needs.
Because the Python list is mutable, it most directly compares to Scala’s `ArrayBuffer`.

### Pythonリスト &amp; Scalaの列(Seq)

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a = [1,2,3]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// use different sequence classes
        <br>// as needed
        <br>val a = List(1,2,3)
        <br>val a = Vector(1,2,3)
        <br>val a = ArrayBuffer(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

### リストの要素へのアクセス

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>a[0]<br>a[1]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>a(0)<br>a(1)</code>   // just like all other method calls
      </td>
    </tr>
  </tbody>
</table>

### リストの要素の更新

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>a[0] = 10
        <br>a[1] = 20</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// ArrayBuffer is mutable
        <br>a(0) = 10
        <br>a(1) = 20</code>
      </td>
    </tr>
  </tbody>
</table>

### 2つのリストの結合

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>c = a + b</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val c = a ++ b</code>
      </td>
    </tr>
  </tbody>
</table>

### リストの反復処理

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for i in ints: print(i)
        <br>
        <br>for i in ints:
        <br>&nbsp; print(i)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>// preferred
        <br>for i &lt;- ints do println(i)
        <br>
        <br>// also available
        <br>for (i &lt;- ints) println(i)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala の主な列(Seq)クラスは `List`、`Vector`、`ArrayBuffer` です。
`List` と `Vector` は不変な列が必要なときに使うメインクラスで、 `ArrayBuffer` は可変な列が必要なときに使うメインクラスです。
(Scala における 「バッファ」 とは、大きくなったり小さくなったりする配列のことです。)

### 辞書/マップ

Python の辞書はScala の `Map` クラスのようなものです。
しかし、Scala のデフォルトのマップは _immutable_ であり、新しいマップを簡単に作成するための変換メソッドを持っています。

#### 辞書/マップ の作成

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>my_dict = {
        <br>&nbsp; 'a': 1,
        <br>&nbsp; 'b': 2,
        <br>&nbsp; 'c': 3
        <br>}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val myMap = Map(
        <br>&nbsp; "a" -&gt; 1,
        <br>&nbsp; "b" -&gt; 2,
        <br>&nbsp; "c" -&gt; 3
        <br>)</code>
      </td>
    </tr>
  </tbody>
</table>

#### 辞書/マップの要素へのアクセス

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>my_dict['a']&nbsp;&nbsp; # 1</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>myMap("a")&nbsp;&nbsp; // 1</code>
      </td>
    </tr>
  </tbody>
</table>

#### `for` ループでの辞書/マップ

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>for key, value in my_dict.items():
        <br>&nbsp; print(key)
        <br>&nbsp; print(value)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>for (key,value) &lt;- myMap do
        <br>&nbsp; println(key)
        <br>&nbsp; println(value)</code>
      </td>
    </tr>
  </tbody>
</table>

Scala has other specialized `Map` classes for different needs.

### 集合

The Python set is similar to the _mutable_ Scala `Set` class.

#### 集合の作成

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>set = {"a", "b", "c"}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val set = Set(1,2,3)</code>
      </td>
    </tr>
  </tbody>
</table>

#### 重複する要素

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>set = {1,2,1}
        <br># set: {1,2}</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val set = Set(1,2,1)
        <br>// set: Set(1,2)</code>
      </td>
    </tr>
  </tbody>
</table>

Scalaには、他にも様々なニーズに特化した`Set`クラスがあります。

### タプル

PythonとScalaのタプルも似ています。

#### タプルの作成

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val t = (11, 11.0, "Eleven")</code>
      </td>
    </tr>
  </tbody>
</table>

#### タプルの要素へのアクセス

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>t[0]&nbsp;&nbsp; # 11
        <br>t[1]&nbsp;&nbsp; # 11.0</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>t(0)&nbsp;&nbsp; // 11
        <br>t(1)&nbsp;&nbsp; // 11.0</code>
      </td>
    </tr>
  </tbody>
</table>

## コレクションクラスでのメソッド

PythonとScalaには、同じ関数型メソッドがいくつかあります。

- `map`
- `filter`
- `reduce`

Pythonのラムダ式でこれらのメソッドを使うのに慣れていれば、Scalaがコレクション・クラスのメソッドで同じようなアプローチを持っていることがわかるだろう。
この機能を実証するために、ここに2つのサンプルリストを示します。

```scala
numbers = [1,2,3]           // python
val numbers = List(1,2,3)   // scala
```

これらのリストは以下の表で使用され、マップ処理とフィルター処理のアルゴリズムを適用する方法を示している。

### マップ処理の内包表記

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i * 10 for i in numbers]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = for i &lt;- numbers yield i * 10</code>
      </td>
    </tr>
  </tbody>
</table>

### フィルター処理の内包表記

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>evens = [i for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val evens = numbers.filter(_ % 2 == 0)
      <br>// or
      <br>val evens = for i <- numbers if i % 2 == 0 yield i</code>
      </td>
    </tr>
  </tbody>
</table>

### マップ、フィルター処理の内包表記

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>x = [i * 10 for i in numbers if i % 2 == 0]</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>val x = numbers.filter(_ % 2 == 0).map(_ * 10)
        <br>// or
        <br>val x = for i <- numbers if i % 2 == 0 yield i * 10</code>
      </td>
    </tr>
  </tbody>
</table>

### マップ処理

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>x = map(lambda x: x * 10, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.map(_ * 10)</code>
      </td>
    </tr>
  </tbody>
</table>

### フィルター処理

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>f = lambda x: x &gt; 1
        <br>x = filter(f, numbers)</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>val x = numbers.filter(_ &gt; 1)</code>
      </td>
    </tr>
  </tbody>
</table>


### Scalaのコレクションメソッド

Scalaのコレクションクラスには100以上の関数メソッドがあり、コードを簡単にすることができます。
Python では、これらの関数の一部は `itertools` モジュールで利用できます。
`map`、`filter`、`reduce` に加えて、Scala でよく使われるメソッドを以下に示す。
これらのメソッドの例では

- `c` はコレクションです。
- `p` は述語です。
- `f` は関数、無名関数、またはメソッドです。
- `n` は整数値です。

これらは利用可能なフィルタリング方法の一部です。

|メソッド|説明|
| -------------- | ------------- |
| `c1.diff(c2)`  | `c1` と `c2` の要素の差分を返します。|
| `c.distinct`   | `c` の重複しない要素を返します。|
| `c.drop(n)`    | 最初の `n` 要素を除くコレクションのすべての要素を返します。|
| `c.filter(p)`  | コレクションから、その述語が `true` となるすべての要素を返します。|
| `c.head`       | コレクションの最初の要素を返します。 (コレクションが空の場合は `NoSuchElementException` をスローします。)|
| `c.tail`       | コレクションから最初の要素を除くすべての要素を返します。 (コレクションが空の場合は `UnsupportedOperationException` をスローします。)|
| `c.take(n)`    | コレクション `c` の最初の `n` 個の要素を返します。
以下に、いくつかのトランスフォーマメソッドを示します。|
|メソッド| 説明 |
| --------------- | -------------
| `c.flatten`     | コレクションのコレクション（リストのリストなど）を単一のコレクション（単一のリスト）に変換します。|
| `c.flatMap(f)`  | コレクション `c` のすべての要素に `f` を適用し（`map` のような動作）、その結果のコレクションの要素を平坦化して、新しいコレクションを返します。|
| `c.map(f)`      | コレクション `c` のすべての要素に `f` を適用して、新しいコレクションを作成します。|
| `c.reduce(f)`   | 「リダクション」関数 `f` を `c` の連続する要素に適用し、単一の値を生成します。|
| `c.sortWith(f)` | 比較関数 `f` によってソートされた `c` のバージョンを返します。|
よく使われるグループ化メソッド：
| メソッド          | 説明  |
| ---------------- | -------------
| `c.groupBy(f)`   | コレクションを `f` に従って分割し、コレクションの `Map` を作成します。|
| `c.partition(p)` | 述語 `p` に従って2つのコレクションを返します。|
| `c.span(p)`      | 2つのコレクションからなるコレクションを返します。1つ目は `c.takeWhile(p)` によって作成され、2つ目は `c.dropWhile(p)` によって作成されます。|
| `c.splitAt(n)`   | コレクション `c` を要素 `n` で分割して、2つのコレクションからなるコレクションを返します。|
情報および数学的なメソッド：
| メソッド  | 説明  |
| -------------- | ------------- |
| `c1.containsSlice(c2)` | `c1` がシーケンス `c2` を含む場合に `true` を返します。|
| `c.count(p)`           | `p` が `true` である `c` の要素数を数えます。|
| `c.distinct`           | `c` の一意な要素を返します。|
| `c.exists(p)`          | コレクション内のいずれかの要素に対して `p` が `true` であれば `true` を返します。|
| `c.find(p)`            | `p` に一致する最初の要素を返します。 要素は `Option[A]` として返されます。|
| `c.min`                | コレクションから最小の要素を返します。 (_java.lang.UnsupportedOperationException_例外が発生する場合があります。)|
| `c.max`                | コレクションから最大の要素を返します。 (_java.lang.UnsupportedOperationException_例外が発生する場合があります。)|
| `c slice(from, to)`    | 要素 `from` から始まり、要素 `to` で終わる要素の範囲を返します。|
| `c.sum`                | コレクション内のすべての要素の合計を返しますw。 (コレクション内の要素に対して `Ordering` を定義する必要があります。)|

以下に、これらのメソッドがリスト上でどのように機能するかを説明する例をいくつか示します。

```scala
val a = List(10, 20, 30, 40, 10)      // List(10, 20, 30, 40, 10)
a.distinct                            // List(10, 20, 30, 40)
a.drop(2)                             // List(30, 40, 10)
a.dropRight(2)                        // List(10, 20, 30)
a.dropWhile(_ < 25)                   // List(30, 40, 10)
a.filter(_ < 25)                      // List(10, 20, 10)
a.filter(_ > 100)                     // List()
a.find(_ > 20)                        // Some(30)
a.head                                // 10
a.headOption                          // Some(10)
a.init                                // List(10, 20, 30, 40)
a.intersect(List(19,20,21))           // List(20)
a.last                                // 10
a.lastOption                          // Some(10)
a.slice(2,4)                          // List(30, 40)
a.tail                                // List(20, 30, 40, 10)
a.take(3)                             // List(10, 20, 30)
a.takeRight(2)                        // List(40, 10)
a.takeWhile(_ < 30)                   // List(10, 20)
```

これらのメソッドは、Scalaにおける共通のパターンを示しています。オブジェクト上で利用可能な機能メソッドです。
これらの方法はいずれも、初期リスト `a` を変更しません。代わりに、コメントの後に示されているデータをすべて返します。
利用可能なメソッドは他にもたくさんありますが、これらの説明と例が、組み込みのコレクションメソッドの持つ力を実感する一助となれば幸いです。

## 列挙

このセクションでは、PythonとScala 3の列挙型を比較します。

### 列挙型の作成

<table>
  <tbody>
    <tr>
      <td class="python-block">
        <code>from enum import Enum, auto
        <br>class Color(Enum):
        <br>&nbsp;&nbsp;&nbsp; RED = auto()
        <br>&nbsp;&nbsp;&nbsp; GREEN = auto()
        <br>&nbsp;&nbsp;&nbsp; BLUE = auto()</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color:
        <br>&nbsp; case Red, Green, Blue</code>
      </td>
    </tr>
  </tbody>
</table>

### 値とその比較

<table>
  <tbody>
    <tr>
      <td class="python-block">
      <code>Color.RED == Color.BLUE&nbsp; # False</code>
      </td>
    </tr>
    <tr>
      <td class="scala-block">
      <code>Color.Red == Color.Blue&nbsp; // false</code>
      </td>
    </tr>
  </tbody>
</table>

### パラメータ化された列挙型

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Color(val rgb: Int):
        <br>&nbsp; case Red&nbsp;&nbsp; extends Color(0xFF0000)
        <br>&nbsp; case Green extends Color(0x00FF00)
        <br>&nbsp; case Blue&nbsp; extends Color(0x0000FF)</code>
      </td>
    </tr>
  </tbody>
</table>

### ユーザー定義による列挙メンバー

<table>
  <tbody>
    <tr>
      <td class="python-block">
        N/A
      </td>
    </tr>
    <tr>
      <td class="scala-block">
        <code>enum Planet(
        <br>&nbsp;&nbsp;&nbsp; mass: Double,
        <br>&nbsp;&nbsp;&nbsp; radius: Double
        <br>&nbsp; ):
        <br>&nbsp; case Mercury extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(3.303e+23, 2.4397e6)
        <br>&nbsp; case Venus extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(4.869e+24, 6.0518e6)
        <br>&nbsp; case Earth extends
        <br>&nbsp;&nbsp;&nbsp;&nbsp;Planet(5.976e+24, 6.37814e6)
        <br>&nbsp; // more planets ...
        <br>
        <br>&nbsp; // fields and methods
        <br>&nbsp; private final val G = 6.67300E-11
        <br>&nbsp; def surfaceGravity = G * mass /
        <br>&nbsp;&nbsp;&nbsp;&nbsp;(radius * radius)
        <br>&nbsp; def surfaceWeight(otherMass: Double)
        <br>&nbsp;&nbsp;&nbsp;&nbsp;= otherMass * surfaceGravity</code>
      </td>
    </tr>
  </tbody>
</table>

## Scala 独自の概念

Scalaには、Pythonには現在同等の機能がない概念が他にもあります。
詳細は以下のリンクを参照してください。
- 拡張メソッド（extension methods）、型クラス（type classes）、暗黙的値（implicit values）など、文脈依存の抽象化（contextual abstractions）に関連するほとんどの概念
- Scalaでは複数のパラメータリストを使用できるため、部分適用関数などの機能や独自のDSLを作成することが可能
- 独自の制御構造や DSL を作成できる機能
- [多様等価][多様等価]: どの等価比較が意味を持つかをコンパイル時に制御できる機能
- インフィックスメソッド
- マクロ

## Scala と仮想環境

Scalaでは、Pythonの仮想環境に相当するものを明示的に設定する必要はありません。デフォルトでは、Scalaのビルドツールがプロジェクトの依存関係を管理するため、ユーザーは手動でパッケージをインストールする必要がありません。例えば、`sbt`ビルドツールを使用する場合、`build.sbt`ファイルの`libraryDependencies`設定で依存関係を指定し、

```
cd myapp
sbt compile
```

以上のコマンドを実行することで、その特定のプロジェクトに必要なすべての依存関係が自動的に解決されます。ダウンロードされた依存関係の場所は、主にビルドツールの実装の詳細であり、ユーザーはこれらのダウンロードされた依存関係と直接やりとりする必要はありません。例えば、sbtの依存関係キャッシュ全体を削除した場合、プロジェクトの次のコンパイル時には、sbtが自動的に必要な依存関係をすべて解決し、ダウンロードし直します。
これはPythonとは異なります。Pythonではデフォルトで依存関係がシステム全体またはユーザー全体のディレクトリにインストールされるため、プロジェクトごとに独立した環境を取得するには、対応する仮想環境を作成する必要があります。例えば、`venv`モジュールを使用して、特定のプロジェクト用に次のように仮想環境を作成できます。

```
cd myapp
python3 -m venv myapp-env
source myapp-env/bin/activate
pip install -r requirements.txt
```

これにより、プロジェクトの `myapp/myapp-env` ディレクトリにすべての依存関係がインストールされ、シェル環境変数 `PATH` が変更されて、依存関係が `myapp-env` から参照されるようになります。
Scalaでは、このような手動での作業は一切必要ありません。

[collections-classes]: {% link _overviews/scala3-book/collections-classes.md %}
[concurrency]: {% link _overviews/scala3-book/concurrency.md %}
[contextual]: {% link _overviews/scala3-book/ca-contextual-abstractions-intro.md %}
[control-structures]: {% link _overviews/scala3-book/control-structures.md %}
[extension-methods]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[fp-intro]: {% link _overviews/scala3-book/fp-intro.md %}
[hofs]: {% link _overviews/scala3-book/fun-hofs.md %}
[intersection-types]: {% link _overviews/scala3-book/types-intersection.md %}
[main-method]: {% link _overviews/scala3-book/methods-main-methods.md %}
[modeling-intro]: {% link _overviews/scala3-book/domain-modeling-intro.md %}
[multiversal]: {% link _overviews/scala3-book/ca-multiversal-equality.md %}
[toplevel]: {% link _overviews/scala3-book/taste-toplevel-definitions.md %}
[type-classes]: {% link _overviews/scala3-book/ca-type-classes.md %}
[union-types]: {% link _overviews/scala3-book/types-union.md %}
</div>
