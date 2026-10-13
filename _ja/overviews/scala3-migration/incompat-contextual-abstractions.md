---
title: コンテキスト抽象化
type: section
description: この章ではコンテキスト抽象化の再設計に伴うすべての非互換性に関して詳細化します。
num: 17
previous-page: incompat-dropped-features
next-page: incompat-other-changes
language: ja
---

[コンテキスト抽象化]({% link _scala3-reference/contextual.md %})の再設計にはいくつかの非互換性をもたらす。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibiltiy|
|--- |--- |--- |--- |--- |
|[暗黙的定義の型](#暗黙的定義の型)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](#implicit-views)||||**Possible**|
|[View bounds](#view-bounds)|Deprecation||||
|[`A`と`=> A`でのあいまいな変換](#aと-aでのあいまいな変換)|||||

## 暗黙的定義の型

暗黙的定義の型 (`val` や`def`) は Scala 3 では明示的に与える必要がある。
これらを推論することはできなくなった。

[ohze/scala-rewrites](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes) のリポジトリの Scalafix ルールで `ExplicitImplicitTypes` と名付けられているものは、自動的に見逃してる型のアノテーションを付ける。

## Implicit Views

Scala 3 では、`implicit val ev: A => B` のような形の implicit 関数値からの暗黙的型変換をサポートしなくなった。

以下のコードは現在無効になる:

```scala
trait Pretty {
  val print: String
}

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // Error: value print is not a member of A
```

[Scala 3 マイグレーション・コンパイル](tooling-migration-mode.html)で、これらのケースについて警告を出すが、直すことはできない。

この非互換性により、実行時の非互換性を引き起こし、プログラムが破損する可能性があることに注意すべきだ。
実際、コンパイラはより広いスコープで別の暗黙的変換を見つけることができる。
これにより、実行時に望んでいない動作が発生する。

例として、次の場合を示す:

```scala
trait Pretty {
  val print: String
}

implicit def anyPretty(any: Any): Pretty = new Pretty { val print = "any" }

def pretty[A](a: A)(implicit ev: A => Pretty): String =
  a.print // always print "any"
```

解決される変換は、コンパイラのモードによって異なる:

  - `-source:3.0-migration`: `ev`変換を行う。
  - `-source:3.0`: `ev`変換は実行できないが、`anyPretty`は実行可能だ。ただし、これは望ましくない。

簡単な修正の一つとしては、正しい変換を明示的に提供することだ:

{% highlight diff %}
def pretty[A](a: A)(implicit ev: A => Pretty): String =
-  a.print
+  ev(a).print
{% endhighlight %}

## View Bounds

View Bounds は長い間非推奨になっていたが Scala 2.13 では未だサポートされている。
Scala 3ではコンパイルできない。

```scala
def foo[A <% Long](a: A): Long = a
```

例では下記のエラーを得る:

{% highlight text %}
-- Error: src/main/scala/view-bound.scala:2:12 
2 |  def foo[A <% Long](a: A): Long = a
  |            ^
  |          view bounds `<%' are deprecated, use a context bound `:' instead
{% endhighlight %}

このメッセージは context bound を view bounds の代わりに使うよう提案しているが、そうするとメソッドのシグネチャが変更してしまうだろう。
おそらくバイナリ互換性を維持するほうがより簡単で安全だろう。
そのため、暗黙的変換を宣言して明示的に呼び出す必要がある。

上記の[Implicit Views](#implicit-views)で説明した通り、実行時の非互換性によりプログラムが落ちる可能性があることに気をつけよう。

{% highlight diff %}
-def foo[A <% Long](a: A): Long = a
+def foo[A](a: A)(implicit ev: A => Long): Long = ev(a)
{% endhighlight %}

## `A`と`=> A`でのあいまいな変換

Scala 2.13 では `A` での暗黙的変換が `=> A` での暗黙的変換より優先される。
Scala3では優先されず、あいまい変換へ繋がる。

以下に例示する:

```scala
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

true.foo()
```

Scala 2.13 のコンパイラは `boolFoo` 変換を選択するが Scala 3 コンパイラはコンパイル失敗する。

{% highlight text %}
-- Error: src/main/scala/ambiguous-conversion.scala:4:19
9 |  true.foo()
  |  ^^^^
  |Found:    (true : Boolean)
  |Required: ?{ foo: ? }
  |Note that implicit extension methods cannot be applied because they are ambiguous;
  |both method boolFoo in object Foo and method lazyBoolFoo in object Foo provide an extension method `foo` on (true : Boolean)
{% endhighlight %}

一時的な解決策としては、明示的に変換を書き換えることだ。

{% highlight diff %}
implicit def boolFoo(bool: Boolean): Foo = ???
implicit def lazyBoolFoo(lazyBool:  => Boolean): Foo = ???

-true.foo()
+boolFoo(true).foo()
{% endhighlight %}
