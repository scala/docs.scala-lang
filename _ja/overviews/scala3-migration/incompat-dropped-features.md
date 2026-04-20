---
title: 廃止された機能
type: section
description: この章ではすべての廃止された機能について詳細化します
num: 16
previous-page: incompat-syntactic
next-page: incompat-contextual-abstractions
language: ja
---

一部の機能は言語の簡略化のため削除した。
殆どの変更は、[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)中に自動的に処理できることに注意してください。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[シンボリックリテラル](#シンボリックリテラル)|Deprecation|✅||
|[`do`-`while` 機能](#do-while-機能)||✅||
|[自動適用](#自動適用)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[イータ展開の値](#イータ展開の値)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` 変換](#any2stringadd-変換)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[先行初期化](#先行初期化)|Deprecation|||
|[存在型](#存在型)|Feature warning|||

## シンボリックリテラル

シンボリックリテラル構文は Scala 2.13 では非推奨とされていたが Scala 3 で廃止された。
しかし、`scala.Symbol` クラスは引き続き存在するため、各文字列リテラルを `Symbol` のアプリケーションで安全に置き換えすることができる。

このコードは Scala 3 ではコンパイルできない:

```scala
val values: Map[Symbol, Int] = Map('abc -> 1)

val abc = values('abc) // Migration Warning: symbol literal 'abc is no longer supported
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードを以下のように書き換える:

{% highlight diff %}
val values: Map[Symbol, Int] = Map(Symbol("abc") -> 1)

-val abc = values('abc)
+val abc = values(Symbol("abc"))
{% endhighlight %}

`Symbol` クラスは変換期では非常に便利だが、`scala-library` の future バージョンでは非推奨になり、やがて廃止されることに注意してください。
2番目のステップとして、`Symbol` を使用するたびに、プレーンな文字列リテラル `"abc"` または、カスタム専用クラスに置き換えすることを勧める。

## `do`-`while` 機能

`do` の予約語は[新しい制御構文]({% link _scala3-reference/other-new-features/control-syntax.md %})で従来と異なる意味を持つ。

この混乱を防ぐため、伝統的な `do <body> while (<cond>)` 機能は廃止した。
それと等価である `while ({ <body>; <cond> }) ()` を使うことを勧める。そして、このフォームはクロスコンパイルできる。また Scala  3 の構文では、`while { <body>; <cond> } do ()` のようになる。

Scala 3 ではこのコードはコンパイルできない

```scala
do { // Migration Warning: `do <body> while <cond>` is no longer supported
  i += 1
} while (f(i) == 0)
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードを以下のように書き換える:

```scala
while ({ {
  i += 1
} ; f(i) == 0}) ()
```

## 自動適用

自動適用は `def toInt(): Int` のような空の親メソッドを呼ぶときに呼び出す構文だ。
Scala 2.13 で非推奨になり、Scala 3 で削除された。

Scala 3ではこのコードは無効だ:

```scala
object Hello {
  def message(): String = "Hello"
}

println(Hello.message) // Migration Warning: method message must be called with () argument
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードを以下のように書き換える:

{% highlight diff %}
object Hello {
  def message(): String = "Hello"
}

-println(Hello.message)
+println(Hello.message())
{% endhighlight %}

自動適用は、Scala 3 ドキュメンテーションの[このページ](/scala3/reference/dropped-features/auto-apply.html)でも詳細がカバーされている。

## イータ展開の値

Scala 3 では[自動的なイータ展開](/scala3/reference/changed-features/eta-expansion-spec.html)を導入しており、これにより、構文 `m _` を評価するメソッドが非推奨になる。
更に Scala 3 では、値を null 関数に拡張することはできなくなった。

したがって、このコードはScala 3では無効だ:

```scala
val x = 1
val f: () => Int = x _ // Migration Warning: The syntax `<function> _` is no longer supported;
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)ではコードを以下のように書き換える:

{% highlight diff %}
val x = 1
-val f: () => Int = x _
+val f: () => Int = (() => x)
{% endhighlight %}

## `any2stringadd` 変換

implicit `Predef.any2stringadd` 変換は Scala 2.13 で非推奨となり、Scala 3では廃止された。

これらのコードはコンパイルできない。

```scala
val str = new AnyRef + "foo" // Error: value + is not a member of Object
```

この `String` への変換は必ず明示的に `String.valueOf` などに適用する必要がある。

{% highlight diff %}
-val str = new AnyRef + "foo"
+val str = String.valueOf(new AnyRef) + "foo"
{% endhighlight %}

この書き換えは[`scala/scala-rewrites`](https://index.scala-lang.org/scala/scala-rewrites/scala-rewrites/0.1.2?target=_2.13)にある Scalafix ルールの `fix.scala213.Any2StringAdd` により適用できる。

## 先行初期化

先行初期化は Scala 2.13 では非推奨となり、Scala 3 では廃止された。
稀に使われていたが、その殆どが Scala 3 で現在サポートされている[Trait parameters](/scala3/reference/other-new-features/trait-parameters.html)の不足を補うためのものだ。

なので、以下のコードはコンパイルできない。

```scala
trait Bar {
  val name: String
  val size: Int = name.size
}

object Foo extends {
  val name = "Foo"
} with Bar
```

Scala 3 コンパイラでは2つのエラーを出す:

{% highlight text %}
-- Error: src/main/scala/early-initializer.scala:6:19 
6 |object Foo extends {
  |                   ^
  |                   `extends` must be followed by at least one parent
{% endhighlight %}

{% highlight text %}
-- [E009] Syntax Error: src/main/scala/early-initializer.scala:8:2 
8 |} with Bar
  |  ^^^^
  |  Early definitions are not supported; use trait parameters instead
{% endhighlight %}

トレイトパラメータを以下のように使うことが提案される:

```scala
trait Bar(name: String) {
  val size: Int = name.size
}

object Foo extends Bar("Foo")
```

Scala 2.13 でトレイトパラメータは使用できないので、これはクロスコンパイルできない。
もしクロスコンパイル方法が必要であれば、初期化された `val` と `var` をコンストラクタパラメータとして運ぶような中間クラスを使用する。

```scala
abstract class BarEarlyInit(val name: String) extends Bar

object Foo extends BarEarlyInit("Foo")
```

このクラスのケースでは、次のように固定値の2次コンストラクタを使用することもできる:

```scala
class Fizz private (val name: String) extends Bar {
  def this() = this("Fizz")
}
```

## 存在型

存在型は[廃止された機能](/scala3/reference/dropped-features/existential-types.html)で、以下のコードは無効だ。

```scala
def foo: List[Class[T]] forSome { type T } // Error: Existential types are no longer supported
```

> 存在型は Scala 2.13 の実験的な機能で、`import scala.language.existentials` するか、コンパイラフラグとして `-language:existentials` を設定することにより、明示的に有効にする必要がある。

解決策の提案として、依存型を運ぶ型を導入する:

```scala
trait Bar {
  type T
  val value: List[Class[T]]
}

def foo: Bar
```

常に可能であるとは限りらないが、ワイルドカード引数、`_` または `?` を使用するほうが簡単な場合が多い。
例えば、`List[T] forSome { type  T }` を `List[?]` に置き換えることができる。
