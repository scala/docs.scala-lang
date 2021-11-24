---
title: Kind Projector移行
type: section
description: このセクションではkind-projector pluginからScala 3のkind-projectorシンタックスに移行する方法を示します
num: 26
previous-page: plugin-intro
next-page: external-resources
language: ja
---

将来的には、Scala3は型ラムダのプレースホルダーに `_`アンダースコア記号を使用する予定です---アンダースコアは現在（通常の）用語レベルのラムダのプレースホルダーに使用されているのと同じです。

新しい型ラムダのシンタックスはデフォルトでは有効になっていません。有効にするには、コンパイラフラグ `-Ykind-projector：underscores`を使用します。 アンダースコアの型ラムダを有効にすると、ワイルドカードとしての `_`の使用が無効になり、`?`記号を使用してのみワイルドカードを書き込むことができるということに注意してください。 

アンダースコアの型ラムダを使用しながらScala 2とScala 3のプロジェクトをクロスコンパイルする場合は、 [kind-projector](https://github.com/typelevel/kind-projector) バージョンで`0.13.0`以上から開始することができ、Scala 2 バージョンは `2.13.6`と `2.12.14`が必要です。
有効にするには、コンパイラフラグ `-Xsource:3 -P:kind-projector:underscore-placeholders` をビルドに追加します。
Scala 3と同様、この設定によりワイルドカードとしての `_`の使用が無効になりますが、フラグ`-Xsource:3`を使用すると、`?`記号に置き換えることができます。

次の `sbt`構成は、新しいシンタックスでクロスコンパイルするための正しいフラグを設定します。

```scala
ThisBuild / scalacOptions ++= {
  CrossVersion.partialVersion(scalaVersion.value) match {
    case Some((3, _)) => Seq("-Ykind-projector:underscores")
    case Some((2, 13)) | Some((2, 12)) => Seq("-Xsource:3", "-P:kind-projector:underscore-placeholders"))
  }
}
```

## 新しいシンタックスの移行

既存のkind-projector対応コードで型ラムダにアンダースコアを使用するには、`*` または `?` を用いている型ラムダのプレースホルダを`_`に置き換えます。

次に、`?`記号を使用するには、ワイルドカードとしての`_`のすべての使用方法を書き直す必要があります。

たとえば、次のワイルドカードの使用方法をあげます:

```scala
def getWidget(widgets: Set[_ <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

必ず書き直します:

```scala
def getWidget(widgets: Set[? <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

そしてkind-projectorの`*`プレースホルダを使用します:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

必ず書き直す必要があります:

```scala
Tuple2[_, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +_]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-_, Long, +_]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## 既存コードのコンパイル

アンダースコアの型ラムダに移行しなくても、ほとんどを変更せずにScala 3でコンパイルできる可能性があります。

`-Ykind-projector`フラグを使用して`*`ベースの型ラムダのサポートを有効にします (アンダースコアの型ラムダを有効にしないで)、次のフォームがコンパイルされます。:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## 非互換性構造の再記述

Scala 3の`-Ykind-projector` と `-Ykind-projector:underscores` は、`kind-projector`シンタックスの部分集合のみを実装し、それ以外は特に実装しません。:

* より種類の多い型ラムダのプレースホルダ
* より種類の多い名前付き型ラムダパラメーター
* `Lambda`予約後(`λ`はまだサポートされています)

次のすべてのフォームを書き直す必要があります:

```scala
// classic
EitherT[*[_], Int, *]    // equivalent to: type R[F[_], B] = EitherT[F, Int, B]
// underscores
EitherT[_[_], Int, _]    // equivalent to: type R[F[_], B] = EitherT[F, Int, B]
// named λ
λ[(F[_], A) => EitherT[F, Int, A]]
// named Lambda
Lambda[(F[_], A) => EitherT[F, Int, A]]
```

Scala 3とクロスコンパイルするための次の形式にします:

```scala
type MyLambda[F[_], A] = EitherT[F, Int, A]
MyLambda
```

また、クロスコンパイルする必要がない場合は、Scala 3の[Native Type Lambdas](https://dotty.epfl.ch/docs/reference/new-types/type-lambdas.html) を使用することができます。:

```scala
[F[_], A] =>> EitherT[F, Int, A]
```

`Lambda`の場合、次のフォームを書き直す必要があります:

```scala
Lambda[(`+E`, `+A`) => Either[E, A]]
```

クロスコンパイルするには以下に書く必要があります:

```scala
λ[(`+E`, `+A`) => Either[E, A]]
```

または、Scala 3の型ラムダの代わりに以下を使います:

```scala
[E, A] =>> Either[E, A]
```

Note: Scala 3の型ラムダは、パラメーターに`-`または`+`の分散マーカーを必要としなくなりました。これらは推測されるようになりました。
