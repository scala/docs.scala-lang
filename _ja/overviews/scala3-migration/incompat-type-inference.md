---
title: 型推論
type: section
description: この章では新しい型推論アルゴリズムにより生じる非互換性に関して詳細化します
num: 20
previous-page: incompat-type-checker
next-page: options-intro
language: ja
---

型インタフェースに伴うルールの内部的変更による、2つの非互換性についてこのページでは説明します。

他の非互換性に関しては型インタフェースのアルゴリズムの書き換えにより生じてしまいます。
新しいアルゴリズムは古いやつよりも良いのですが、一部Scala 2.13で成功していたものが落ちてしまうときがあります。:

> 明示的にメソッドやパブリックな変数に対して返り値の型を書くことは常に良い習慣であります。
> 推測される型が異なる場合があるため、ライブラリのパブリックAPIがScalaバージョンにより変更されるのを防ぎます。
> 
> これはScalafixの[ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)のルールを使用してScala3の移行前に行うことができます。

## オーバーライドしたメソッドの返り値の型

Scala 3でオーバーライドメソッドの返却値の型はベースメソッドからの継承により推論されますが、Scala 2.13では、オーバーライドメソッドの左側から推測されます。

```scala
class Parent {
  def foo: Foo = new Foo
}

class Child extends Parent {
  override def foo = new RichFoo(super.foo)
}
```

この例では、Scala 2.13では`Child#foo`メソッドは`RichFoo`を返却しますが、Scala 3では`Foo`を返却します。
以下に示すように、コンパイラエラーが発生する可能性があります。

```scala
class Foo

class RichFoo(foo: Foo) extends Foo {
  def show: String = ""
}

class Parent {
  def foo: Foo = new Foo
}

class Child extends Parent {
  override def foo = new RichFoo(super.foo)
}

(new Child).foo.show // Scala 3 error: value show is not a member of Foo
```

In some rare cases involving implicit conversions and runtime casting it could even cause a runtime failure.

The solution is to make the return type of the override method explicit:

{% highlight diff %}
class Child extends Parent {
-  override def foo = new RichFoo(super.foo)
+  override def foo: RichFoo = new RichFoo(super.foo)
}
{% endhighlight %}

## リフレクションの型

Scala 2のリフレクションの呼び出しは削除され、より広範な[プログラマティック構造型](/scala3/reference/changed-features/structural-types.html)に置き換えられています。

Scala 3は`scala.language.reflectiveCalls`がインポートされている場所ならどこでも`scala.reflect.Selectable.reflectiveSelectable`を利用可能にすることで、Scala 2のリフレクションの呼び出しを模倣することができます。
ただし、Scala 3コンパイラーはデフォルトでは構造型を推測しないため、コンパイルに失敗します。:

```scala
import scala.language.reflectiveCalls

val foo = new {
  def bar: Unit = ???
}

foo.bar // Error: value bar is not a member of Object
```

簡単な解決策は、構造タイプを明示的に書き留めておくことです。

{% highlight diff %}
import scala.language.reflectiveCalls

- val foo = new {
+ val foo: { def bar: Unit } = new {
  def bar: Unit = ???
}

foo.bar
{% endhighlight %}
