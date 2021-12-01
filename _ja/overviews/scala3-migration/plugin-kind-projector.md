---
title: Kind Projector移行
type: section
description: このセクションでは kind-projector plugin からScala 3 の kind-projector 構文に移行する方法を示します
num: 26
previous-page: plugin-intro
next-page: external-resources
language: ja
---

将来的には、Scala 3 は型ラムダのプレースホルダーに `_` アンダースコア記号を使用する予定だ---アンダースコアは現在（通常の）用語レベルのラムダのプレースホルダーに使用されているのと同じだ。

新しい型ラムダの構文はデフォルトでは有効になっていない。有効にするには、コンパイラフラグ `-Ykind-projector：underscores` を使用する。 アンダースコアの型ラムダを有効にすると、ワイルドカードとしての `_` の使用が無効になり、`?` 記号を使用してのみワイルドカードを書き込むことができるということに注意すべきだ。 

アンダースコアの型ラムダを使用しながら Scala 2 と Scala 3 のプロジェクトをクロスコンパイルする場合は、 [kind-projector](https://github.com/typelevel/kind-projector) バージョンで `0.13.0` 以上から開始することができ、Scala 2 バージョンは `2.13.6` と `2.12.14`が必要である。
有効にするには、コンパイラフラグ `-Xsource:3 -P:kind-projector:underscore-placeholders` をビルドに追加する。
Scala 3 と同様、この設定によりワイルドカードとしての `_` の使用が無効になるが、フラグ `-Xsource:3` を使用すると、`?` 記号に置き換えることができる。

次の `sbt` 構成は、新しい構文でクロスコンパイルするための正しいフラグを設定する。

```scala
ThisBuild / scalacOptions ++= {
  CrossVersion.partialVersion(scalaVersion.value) match {
    case Some((3, _)) => Seq("-Ykind-projector:underscores")
    case Some((2, 13)) | Some((2, 12)) => Seq("-Xsource:3", "-P:kind-projector:underscore-placeholders"))
  }
}
```

## 新しい構文の移行

既存の kind-projector 対応コードで型ラムダにアンダースコアを使用するには、`*` または `?` を用いている型ラムダのプレースホルダを `_` に置き換える。

次に、`?` 記号を使用するには、ワイルドカードとしての `_` のすべての使用方法を書き直す必要がある。

例えば、次のワイルドカードの使用方法を示す:

```scala
def getWidget(widgets: Set[_ <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

必ず書き直す必要がある:

```scala
def getWidget(widgets: Set[? <: Widget], name: String): Option[Widget] = widgets.find(_.name == name) 
```

そして kind-projector の `*` プレースホルダを使用する:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

必ず書き直す必要がある:

```scala
Tuple2[_, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +_]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-_, Long, +_]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## 既存コードのコンパイル

アンダースコアの型ラムダに移行しなくても、ほとんどを変更せずに Scala 3 でコンパイルできる可能性がある。

`-Ykind-projector` フラグを使用して `*` ベースの型ラムダのサポートを有効にする (アンダースコアの型ラムダを有効にしないで)、次のフォームがコンパイルされる:

```scala
Tuple2[*, Double]        // equivalent to: type R[A] = Tuple2[A, Double]
Either[Int, +*]          // equivalent to: type R[+A] = Either[Int, A]
Function2[-*, Long, +*]  // equivalent to: type R[-A, +B] = Function2[A, Long, B]
```

## 非互換性構造の書き換え

Scala 3 の `-Ykind-projector` と `-Ykind-projector:underscores` は、`kind-projector` 構文の部分集合のみを実装し、それ以外は特に実装しない:

* より種類の多い型ラムダのプレースホルダ
* より種類の多い名前付き型ラムダパラメーター
* `Lambda`予約語(`λ` はまだサポートされている)

次のすべてのフォームを書き直す必要がある:

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

Scala 3 とクロスコンパイルするための次の形式にする:

```scala
type MyLambda[F[_], A] = EitherT[F, Int, A]
MyLambda
```

また、クロスコンパイルする必要がない場合は、Scala 3 の[Native Type Lambdas](https://dotty.epfl.ch/docs/reference/new-types/type-lambdas.html) を使用することができる:

```scala
[F[_], A] =>> EitherT[F, Int, A]
```

`Lambda` の場合、次のフォームを書き直す必要がある:

```scala
Lambda[(`+E`, `+A`) => Either[E, A]]
```

クロスコンパイルするには以下のように書く必要がある:

```scala
λ[(`+E`, `+A`) => Either[E, A]]
```

または、Scala 3 の型ラムダの代わりに以下を用いる:

```scala
[E, A] =>> Either[E, A]
```

Note: Scala 3 の型ラムダは、パラメーターに `-` または `+` の分散マーカーを必要としなくなった。これらは推測されるようになった。
