---
title: コンテキスト抽象化
type: section
description: この章ではコンテキスト抽象化の再設計に伴うすべての非互換性に関して詳細化します。
num: 17
previous-page: incompat-dropped-features
next-page: incompat-other-changes
language: ja
---

[コンテキスト抽象化]({% link _scala3-reference/contextual.md %})の再設計にはいくつかの非互換性をもたらします。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibiltiy|
|--- |--- |--- |--- |--- |
|[暗黙的定義の型](#暗黙的定義の型)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](#implicit-views)||||**Possible**|
|[View bounds](#view-bounds)|Deprecation||||
|[`A`と`=> A`でのあいまいな変換](#aと-aでのあいまいな変換)|||||

## 暗黙的定義の型

暗黙的定義の型 (`val` や`def`) はScala 3では明示的に与える必要があります。
これらを推論することはできなくなりました。

[ohze/scala-rewrites](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes) のリポジトリのScalafixルールで`ExplicitImplicitTypes`と名付けられているものでは、自動的に見逃してる型のアノテーションを付けてくれます。

## Implicit Views

Scala 3では、`implicit val ev: A => B`のような形のimplicit関数値からの暗黙的型変換をサポートしなくなりました。

以下のコードは現在無効になります。:

```scala
trait Pretty {
  val print: String
}

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // Error: value print is not a member of A
```

[Scala 3移行コンパイル](tooling-migration-mode.html)これらのケースについてWARNINGを出してくれまが、直すことはできません。

この非互換性により、実行時の非互換性を引き起こし、プログラムが破損する可能性があることに注意してください。
実際、コンパイラはより広いスコープで別の暗黙的変換を見つけることができます。
これにより、実行時の望んでいない動作が発生します。

この例は、次の場合を示しています。:

```scala
trait Pretty {
  val print: String
}

implicit def anyPretty(any: Any): Pretty = new Pretty { val print = "any" }

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // always print "any"
```

解決される変換は、コンパイラのモードによって異なります。:
  - `-source:3.0-migration`: `ev`変換を行います。
  - `-source:3.0`: `ev`変換の実行はできませんが、`anyPretty`は実行できます。ただこれは望ましくありません。

簡単な修正の一つとしては、正しい変換を明示的に提供することです。:

{% highlight diff %}
def pretty[A](a: A)(implicit ev: A => Pretty): String =
-  a.print
+  ev(a).print
{% endhighlight %}

## View Bounds

View Boundsは長い間非推奨担っていましたがScala 2.13では未だサポートされています。
Scala 3ではコンパイルできないです。

```scala
def foo[A <% Long](a: A): Long = a
```

この例では下記のエラーを取得します。:

{% highlight text %}
-- Error: src/main/scala/view-bound.scala:2:12 
2 |  def foo[A <% Long](a: A): Long = a
  |            ^
  |          view bounds `<%' are deprecated, use a context bound `:' instead
{% endhighlight %}

このメッセージはcontext boundをview boundsの代わりに使うよう提案していますが、メソッドのシグネチャが変更してしまうでしょう。
おそらくバイナリ互換性を維持するほうがより簡単で安全でしょう。
そのため、暗黙的変換を宣言して明示的に呼び出す必要があります。

上記の[Implicit Views](#implicit-views)で説明した通り、実行時の非互換性により落ちる可能性があることに気をつけましょう。

{% highlight diff %}
-def foo[A <% Long](a: A): Long = a
+def foo[A](a: A)(implicit ev: A => Long): Long = ev(a)
{% endhighlight %}

## `A`と`=> A`でのあいまいな変換

Scala 2.13では`A`での暗黙的変換が`=> A`での暗黙的変換より優先されてます。
Scala3ではそうではなく、あいまい変換に繋がります。

以下に例示します。:

```scala
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

true.foo()
```

Scala 2.13のコンパイラは`boolFoo`変換を選択しますがScala 3コンパイラはコンパイル失敗します。

{% highlight text %}
-- Error: src/main/scala/ambiguous-conversion.scala:4:19
9 |  true.foo()
  |  ^^^^
  |Found:    (true : Boolean)
  |Required: ?{ foo: ? }
  |Note that implicit extension methods cannot be applied because they are ambiguous;
  |both method boolFoo in object Foo and method lazyBoolFoo in object Foo provide an extension method `foo` on (true : Boolean)
{% endhighlight %}

一時的な解決策としては、明示的に変換を書き換えることです。

{% highlight diff %}
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

-true.foo()
+boolFoo(true).foo()
{% endhighlight %}
