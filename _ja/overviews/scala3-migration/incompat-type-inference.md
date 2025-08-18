---
title: 型推論
type: section
description: この章では新しい型推論アルゴリズムにより生じる非互換性に関して詳細化します
num: 20
previous-page: incompat-type-checker
next-page: options-intro
language: ja
---

型推論に関するルールの内部的変更による、2つの非互換性についてこのページでは説明する。

他の非互換性に関しては型推論のアルゴリズムの書き換えにより生じる。
新しいアルゴリズムは古いやつよりも良いのですが、一部 Scala 2.13 で成功していたものが落ちてしまうときがある:

> 明示的にメソッドやパブリックな変数に対して返り値の型を書くことは常に良い習慣だ。
> 推測される型が異なる場合があるため、ライブラリのパブリック API が Scala バージョンにより変更されるのを防ぐ。
> 
> これは Scalafix の[ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)のルールを使用して Scala 3 の移行前に行うことができる。

## オーバーライドしたメソッドの返り値の型

Scala 3 でオーバーライドメソッドの返却値の型はベースメソッドからの継承により推論されるが、Scala 2.13 では、オーバーライドメソッドの左側から推測される。

```scala
class Parent {
  def foo: Foo = new Foo
}

class Child extends Parent {
  override def foo = new RichFoo(super.foo)
}
```

この例では、Scala 2.13 では `Child#foo` メソッドは`RichFoo` を返却するが、Scala 3 では `Foo` を返却する。
以下のようなコンパイラエラーが発生する可能性がある。

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

暗黙的な変換と実行時のキャストを含む稀なケースにおいては、実行時エラーを引き起こす可能性がある。

解決策は、オーバーライドメソッドの返却値の型を明示的に示すことだ:

{% highlight diff %}
class Child extends Parent {
-  override def foo = new RichFoo(super.foo)
+  override def foo: RichFoo = new RichFoo(super.foo)
}
{% endhighlight %}

## リフレクションの型

Scala 2 のリフレクションの呼び出しは削除され、より広範な[プログラマティック構造型](/scala3/reference/changed-features/structural-types.html)に置き換えられる。

Scala 3 は `scala.language.reflectiveCalls` がインポートされている場所ならどこでも `scala.reflect.Selectable.reflectiveSelectable` を利用することが可能で、Scala 2 のリフレクションの呼び出しを模倣することができる。
ただし、Scala 3 コンパイラーはデフォルトでは構造型を推測しないため、コンパイルに失敗する:

```scala
import scala.language.reflectiveCalls

val foo = new {
  def bar: Unit = ???
}

foo.bar // Error: value bar is not a member of Object
```

簡単な解決策は、構造型を明示的に書くことだ。

{% highlight diff %}
import scala.language.reflectiveCalls

- val foo = new {
+ val foo: { def bar: Unit } = new {
  def bar: Unit = ???
}

foo.bar
{% endhighlight %}
