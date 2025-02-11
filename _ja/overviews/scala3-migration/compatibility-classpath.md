---
title: クラスパス互換性
type: section
description: このセクションは、Scala 2.13とScala 3クラスファイルの互換性について説明します。
num: 3
previous-page: compatibility-source
next-page: compatibility-runtime
language: ja
---

コードを書くとき、他のモジュールやライブラリで定義されている公開型やフィールドを使ったり、公開メソッドを呼び出すことができる。
これはコンパイラフェーズの一つである type checker が、公開型、フィールド、メソッドなどのシグネチャを各自を定義するクラスファイルから読み込むことができる限りうまくいく。type checker は、この情報を用いてコード上の意味的一貫性を検査し、これは型検査と呼ばれる。

Scala 2 では、シグネチャは Pickle と呼ばれる独自のフォーマットを用いて保存される。
Scala 3 では少し違っていて、シグネチャ情報だけに留まらずその他の多くの情報を持つ TASTy フォーマットを採用している。
しかし、本題である Scala 2.13 から Scala 3 への移行において役に立つのはシグネチャだけだ。

## Scala 3 Unpickler

はじめの良い知らせとして Scala 3 のコンパイラは Scala 2.13 の Pickle フォーマットを読み込むことができるということ、すなわち、Scala 2.13 によりコンパイルされたモジュールやライブラリに依存したコードの型チェックができるということだ。

Scala 3 の Unpickler は数年間広範囲的にコミュニティビルドによってテストされている。なので使うこと自体は安全だ。

### Scala 3 モジュールは Scala 2.13 アーティファクトに依存できる

![Scala 3 module depending on a Scala 2.13 artifact](/resources/images/scala3-migration/compatibility-3-to-213.svg)

sbt ビルドとして、次のように説明できる( sbt 1.5.0 以降が必要だ):

```scala
lazy val foo = project.in(file("foo"))
  .settings(scalaVersion := "3.0.0")
  .dependsOn(bar)

lazy val bar = project.in(file("bar"))
  .settings(scalaVersion := "2.13.6")
```

または、bar が公開された Scala 2.13 ライブラリである場合は、次のことができる。:

```scala
lazy val foo = project.in(file("foo"))
  .settings(
    scalaVersion := "3.0.0",
    libraryDependencies += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for3Use2_13)
  )
```

sbt で `CrossVersion.for3Use2_13` を使用して、`bar_3` の代わりに `bar_2.13` を解決する。

### 標準ライブラリ

Scala 2.13 標準ライブラリは、重要なクロス依存性の例だ。
実は、Scala 2.13 標準ライブラリをそのまま Scala 3 用の公式標準ライブラリとして採用した。

標準ライブラリは自動的にビルドツールにより与えられるため、手動で設定する必要はありません。

## Scala 2.13 の TASTy 読み取り機能

2つ目の良い知らせは、Scala 2.13.4 より Scala 2.13 TASTy 読み取り機能がリリースされ、Scala 2.13 側から Scala 3 で書かれたライブラリ群の呼び出しが可能となったことだ。

> TASTy 読み取り機能はとても新しいものだ。そのため、`-Ytasty-reader` フラグ下でのみ使用できる。

### サポートされている機能

TASTy 読み取り機能は、すべての従来の言語機能に加えて、次の新しい機能をサポートする。:
- [Enumerations]({% link _scala3-reference/enums/enums.md %})
- [Intersection Types]({% link _scala3-reference/new-types/intersection-types.md %})
- [Opaque Type Aliases]({% link _scala3-reference/other-new-features/opaques.md %})
- [Type Lambdas]({% link _scala3-reference/new-types/type-lambdas.md %})
- [Contextual Abstractions]({% link _scala3-reference/contextual.md %}) (new syntax)
- [Open Classes]({% link _scala3-reference/other-new-features/open-classes.md %}) (and inheritance of super traits)
- [Export Clauses]({% link _scala3-reference/other-new-features/export.md %})

限定的にサポートしているもの。:
- [Top-Level Definitions]({% link _scala3-reference/dropped-features/package-objects.md %})
- [Extension Methods]({% link _scala3-reference/contextual/extension-methods.md %})

よりエキゾチックな機能はサポートされていません。:
- [Context Functions]({% link _scala3-reference/contextual/context-functions.md %})
- [Polymorphic Function Types]({% link _scala3-reference/new-types/polymorphic-function-types.md %})
- [Trait Parameters]({% link _scala3-reference/other-new-features/trait-parameters.md %})
- `@static` Annotation
- `@alpha` Annotation
- [Functions and Tuples larger than 22 parameters]({% link _scala3-reference/dropped-features/limit22.md %})
- [Match Types]({% link _scala3-reference/new-types/match-types.md %})
- [Union Types]({% link _scala3-reference/new-types/union-types.md %})
- [Multiversal Equality]({% link _scala3-reference/contextual/multiversal-equality.md %}) (unless explicit)
- [Inline]({% link _scala3-reference/metaprogramming/inline.md %}) (including Scala 3 macros)
- [Kind Polymorphism]({% link _scala3-reference/other-new-features/kind-polymorphism.md %}) (the `scala.AnyKind` upper bound)

### Scala 2.13 モジュールは Scala 3 アーティファクトに依存できる

`-Ytasty-reader` で TASTy 読み取り機能を有効にすることで、Scala 2.13 モジュールは Scala 3 アーティファクトに依存できる。

![Scala 2 module depending on a Scala 3 artifact](/resources/images/scala3-migration/compatibility-213-to-3.svg)

sbt ビルドとして、次のように説明できる。:

```scala
lazy val foo = project.in.file("foo")
  .settings(
    scalaVersion := "2.13.6",
    scalacOptions += "-Ytasty-reader"
  )
  .dependsOn(bar)

lazy val bar = project.in(file("bar"))
  .settings(scalaVersion := "3.0.0")
```

または、`bar` が公開された Scala 3 ライブラリの場合:

```scala
lazy val foo = project.in.file("foo")
  .settings(
    scalaVersion := "2.13.6",
    scalacOptions += "-Ytasty-reader",
    libraryDependencies += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for2_13Use3)
  )
```

`CrossVersion.for2_13Use3` と同様に、sbt で `CrossVersion.for3Use2_13` を使用して、`bar_2.13` ではなく `bar_3` を解決する。

## 相互運用性の概要

要するに、下位、上位互換性があり、そしてそれにより**移行が段階的に行うことが可能になる**。

ライブラリの依存関係がまだ移植されてない場合(マクロライブラリを除く)でも、一度に Scala アプリケーションの一つのモジュールを移植することができる。

移行期間中、2 つの Scala 2.13 モジュールで挟まれた Scala 3 モジュール層を扱うことができる。

![Sandwich pattern](/resources/images/scala3-migration/compatibility-sandwich.svg)

クロス依存性は、全てのライブラリがそれぞれ単一のバイナリバージョンへと解決される限り許される。例えば、`lib-foo_3` と `lib-bar_2.13` を同じクラスパスに持つことができるが、`lib-foo_3` と `lib-foo_2.13` を含めることはできない。

この逆のパターン、すなわち 2.13 モジュールが中央にある場合でも可能だ。

> #### ライブラリ作者への注意
> 
> 公開ライブラリの中で Scala 2.13 と Scala 3 間の相互運用性を使うと、多くの場合そのライブラリを使用するエンドユーザにとって安全では無いことに注意してほしい。
> 
> 状況を完全に理解した上級ユーザ以外は、( scala-library 以外の) Scala 2.13 系ライブラリに依存した Scala 3系のライブラリを公開することは非推奨とされており、逆も然りだ。
> なぜなら、ライブラリを使用するユーザを、クラスパス内の同じ foo ライブラリ内の2つのバージョンである `foo_2.13` と `foo_3` の競合から防ぐためであり、この問題は場合によっては解決することができない。