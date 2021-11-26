---
title: クラスパス互換性
type: section
description: このセクションでは、Scala 2.13とScala 3クラスファイルの互換性について説明しています。
num: 3
previous-page: compatibility-source
next-page: compatibility-runtime
language: ja
---

コード上で、パブリックな型と構文を利用でき、そしてパブリックメソッドは異なるモジュールやライブラリで定義されています。
そしてできる限り長く型チェックとして働いて、コンパイルフェーズにてコードの意味的な構成を検証し、クラスファイルに含まれている型や構文やメソッドの重要性を読むことができます。

Scala 2ではシグネチャはpickleフォーマットで保存されます。
Scala 3では少し違っていて、なぜならシグネチャレイアウトよりも多くのTASTyフォーマットに寄り添っているからです。
しかしながらScala 2.13からScala 3へ移行する目的においては、シグネチャだけでも有効です。

## Scala 3 Unpickler

はじめの良い知らせとしてScala 3のコンパイラはScala 2.13のpickleフォーマットを読み込むことができるということ、すなわち、Scala 2.13によりコンパイルされたモジュールやライブラリに依存したコードの型チェックができるということです。

Scala3のUnpicklerは数年間広範囲的にコミュニティビルドによってテストされています。なので使うこと自体は安全です。

### Scala 3モジュールはScala 2.13アーティファクトに依存できます

![Scala 3 module depending on a Scala 2.13 artifact](/resources/images/scala3-migration/compatibility-3-to-213.svg)

sbtビルドとして、次のように説明できます（sbt 1.5.0以降が必要です）:

```scala
lazy val foo = project.in(file("foo"))
  .settings(scalaVersion := "3.0.0")
  .dependsOn(bar)

lazy val bar = project.in(file("bar"))
  .settings(scalaVersion := "2.13.6")
```

または、barが公開されたScala 2.13ライブラリである場合は、次のことができます。:

```scala
lazy val foo = project.in(file("foo"))
  .settings(
    scalaVersion := "3.0.0",
    libraryDependencies += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for3Use2_13)
  )
```

sbtで `CrossVersion.for3Use2_13`を使用して、 `bar_3`の代わりに`bar_2.13`を解決します。

### スタンダードライブラリ

1つ目のノート例はScala 2.13ライブラリです。
Scala 2.13ライブラリがScala 3用の公式スタンダードライブラリとして確かに決定しています。

スタンダードライブラリは自動的にビルドツールに与えられることを覚えておきましょう、なので手動的に設定する必要はありません。

## Scala 2.13のTASTy読み取り機能

2つ目の良い知らせはscala 2.13.4からリリースされたTASTy読み取り機能がScala 3ライブラリで使えるということです。

> TASTy読み取り機能は非常に新しいものです。そのため、`-Ytasty-reader` フラグの下でのみ使用できます。

### サポートされている機能

TASTy読み取り機能は、すべての従来の言語機能に加えて、次の新しい機能をサポートします。:
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

### Scala 2.13モジュールScala 3アーティファクトに依存できます

`-Ytasty-reader`でTASTyリーダーを有効にすることで、Scala 2.13モジュールはScala 3アーティファクトに依存できます。

![Scala 2 module depending on a Scala 3 artifact](/resources/images/scala3-migration/compatibility-213-to-3.svg)

sbtビルドとして、次のように説明できます。:

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

または、`bar`が公開されたScala 3ライブラリの場合:

```scala
lazy val foo = project.in.file("foo")
  .settings(
    scalaVersion := "2.13.6",
    scalacOptions += "-Ytasty-reader",
    libraryDependencies += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for2_13Use3)
  )
```

`CrossVersion.for2_13Use3`と同様に、sbtで `CrossVersion.for3Use2_13`を使用して、`bar_2.13`ではなく`bar_3`を解決します。

## 相互運用性の概要

要するに、下位、上位互換性があり、そしてそれにより**移行が段階的に行うことが可能になるのです**。

ライブラリの依存関係がまだ移植されてない場合（マクロライブラリを除く）でも、一度にScalaアプリケーションの一つのモジュールを移植することができます。

移行期間中、Scala 2.13モジュール間で、Scala 3モジュールを持つことができます。

![Sandwich pattern](/resources/images/scala3-migration/compatibility-sandwich.svg)

これはできるだけ長くすべてのライブラリが単一バイナリバージョンを解決できるように許しておます: `lib-foo_3` と `lib-bar_2.13` を同じクラスパスに持つことができますが、`lib-foo_3` と `lib-foo_2.13`を含めることはできません.

この逆のパターン、すなわち2.13モジュールが中央にある場合でも可能です。

> #### ライブラリメンテナンスの免責事項
> 
> 公開されているライブラリの中でScala 2.13とScala 3間の相互運用性を使うことは一般的にエンドユーザにとっては安全ではないです。
> 
> 何をしているか正確に知らない限り、Scala 2.13に依存するScala 3のライブラリを公開することはおすすめできないです（Scala-libraryは除く）し逆も然りです.
> 理由としては、ライブラリユーザがクラスパス内の同じfooライブラリの中の競合するバージョン`foo_2.13`, `foo_3`で終わるのを防ぐためで、この問題は場合によっては解決することができません。