---
title: 廃止された機能
type: section
description: この章ではすべての廃止された機能について詳細化します
num: 16
previous-page: incompat-syntactic
next-page: incompat-contextual-abstractions
language: ja
---

一部の機能は言語の簡略化のため削除しました。
殆どの変更は、[Scala 3 migration compilation](tooling-migration-mode.html)中に自動的に処理できることに注意してください。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[Symbol literals](#symbol-literals)|Deprecation|✅||
|[`do`-`while` construct](#do-while-construct)||✅||
|[Auto-application](#auto-application)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[Value eta-expansion](#value-eta-expansion)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` conversion](#any2stringadd-conversion)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[Early initializer](#early-initializer)|Deprecation|||
|[Existential type](#existential-type)|Feature warning|||

## シンボリックリテラル

シンボリックリテラル構文はScala 2.13では非推奨とされていましたがScala 3で廃止されました。
しかし、`scala.Symbol` クラスは引き続き存在するため、各文字列リテラルを`Symbol`のアプリケーションで安全に置き換えすることができます。

このコードはScala 3ではコンパイルできません。:

```scala
val values: Map[Symbol, Int] = Map('abc -> 1)

val abc = values('abc) // Migration Warning: symbol literal 'abc is no longer supported
```

[Scala 3移行コンパイル](tooling-migration-mode.html)ではコードは以下のように書き換えられます。:

{% highlight diff %}
val values: Map[Symbol, Int] = Map(Symbol("abc") -> 1)

-val abc = values('abc)
+val abc = values(Symbol("abc"))
{% endhighlight %}

`Symbol`クラスは変換期では非常に便利ではありますが、`scala-library`のfuture バージョンでは非推奨になりやがて廃止されることに注意してください。
2番目のステップとして、`Symbol`を使用するたびに、プレーンな文字列リテラル`"abc"` または、カスタム専用クラスに置き換えすることをおすすめします。

## `do`-`while` 構造

`do` の予約後は[新しい制御構文]({% link _scala3-reference/other-new-features/control-syntax.md %})で従来と異なる意味を持つようになりました。

この混乱を防ぐため、伝統的な`do <body> while (<cond>)`構造は廃止します。
それと等価である`while ({ <body>; <cond> }) ()`を使うことをおすすめします。そして、それはクロスコンパイルできます。またScala 3のシンタックスでは、`while { <body>; <cond> } do ()`のようになります。

Scala 3ではこのコードはコンパイルできません。

```scala
do { // Migration Warning: `do <body> while <cond>` is no longer supported
  i += 1
} while (f(i) == 0)
```

[Scala 3移行コンパイル](tooling-migration-mode.html) では以下のように書き換えます。 

```scala
while ({ {
  i += 1
} ; f(i) == 0}) ()
```

## 自動適用

自動適用は`def toInt(): Int`のような空の親メソッドを呼ぶときに呼び出すシンタックスです。
Scala 2.13で非推奨になり、Scala 3で削除されました。

Scala 3ではこのコードは無効です。:

```scala
object Hello {
  def message(): String = "Hello"
}

println(Hello.message) // Migration Warning: method message must be called with () argument
```

[Scala 3移行コンパイル](tooling-migration-mode.html) では以下のように書き換えます。:

{% highlight diff %}
object Hello {
  def message(): String = "Hello"
}

-println(Hello.message)
+println(Hello.message())
{% endhighlight %}

自動適用は、Scala 3ドキュメンテーションの[このページ](/scala3/reference/dropped-features/auto-apply.html)でも詳細がカバーされています

## Eta展開の値

Scala 3では[自動的なEta展開](/scala3/reference/changed-features/eta-expansion-spec.html)を導入しており、これにより、シンタックス`m _`を評価するメソッドが非推奨になります。
さらにScala 3では、値をnull関数に拡張することはできなくなりました。

したがって、このコードはScala 3では無効です。:

```scala
val x = 1
val f: () => Int = x _ // Migration Warning: The syntax `<function> _` is no longer supported;
```

[Scala 3移行コンパイル](tooling-migration-mode.html) では以下のように書き換えます。:

{% highlight diff %}
val x = 1
-val f: () => Int = x _
+val f: () => Int = (() => x)
{% endhighlight %}

## `any2stringadd` 変換

implicit `Predef.any2stringadd` 変換はScala 2.13で非推奨となり、Scala 3では廃止されます。

これらのコードはコンパイルできません。

```scala
val str = new AnyRef + "foo" // Error: value + is not a member of Object
```

この`String`への変換は必ず明示的に`String.valueOf`などで適用する必要があります。

{% highlight diff %}
-val str = new AnyRef + "foo"
+val str = String.valueOf(new AnyRef) + "foo"
{% endhighlight %}

この書き換えは[`scala/scala-rewrites`](https://index.scala-lang.org/scala/scala-rewrites/scala-rewrites/0.1.2?target=_2.13)にあるScalafixルールの`fix.scala213.Any2StringAdd`により適用できます。

## 先行初期化

先行初期化はScala 2.13では非推奨となり、Scala 3では廃止されます。
まれに使われいましたが、その殆どがScala3で現在サポートされている[Trait parameters](/scala3/reference/other-new-features/trait-parameters.html)の不足を補うためのものです。

そういうわけで、以下のコードはコンパイルできません。

```scala
trait Bar {
  val name: String
  val size: Int = name.size
}

object Foo extends {
  val name = "Foo"
} with Bar
```

Scala 3コンパイラでは2つのエラーを出します。:

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

トレイトパラメータを以下のように使うことが提案されています:

```scala
trait Bar(name: String) {
  val size: Int = name.size
}

object Foo extends Bar("Foo")
```

Scala 2.13でトレイトパラメータは使用できないので、これはクロスコンパイルできません。
もしクロスコンパイル方法が必要であれば、初期化された`val`と`var`をコンストラクタパラメータとして運ぶような中間クラスを使用します。

```scala
abstract class BarEarlyInit(val name: String) extends Bar

object Foo extends BarEarlyInit("Foo")
```

このクラスのケースでは、次のように固定値の2次コンストラクタを使用することもできます:

```scala
class Fizz private (val name: String) extends Bar {
  def this() = this("Fizz")
}
```

## 存在型

存在型は[廃止された機能](/scala3/reference/dropped-features/existential-types.html)で、以下のコードは無効です。

```scala
def foo: List[Class[T]] forSome { type T } // Error: Existential types are no longer supported
```

> 存在型はScala 2.13の実験的な機能で、`import scala.language.existentials`するか、コンパイラフラグとして`-language:existentials`を設定することにより、明示的に有効にする必要があります。

提案された解決策として、依存型を運ぶ方を導入することです。:

```scala
trait Bar {
  type T
  val value: List[Class[T]]
}

def foo: Bar
```

常に可能であるとは限りませんが、ワイルドカード引数、 `_` または `?`を使用するほうが簡単な場合が多いのです。
例えば、`List[T] forSome { type  T }`を`List[?]`に置き換えることができます。
