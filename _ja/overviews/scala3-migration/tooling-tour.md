---
title: 移行ツールのツアー
type: chapter
description: この章は移行ツールのエコシステムのツアーです
num: 6
previous-page: compatibility-metaprogramming
next-page: tooling-migration-mode
language: ja
---

## Scalaコンパイラ

移行に関して、簡単でスムーズになるように、事前に2つのコンパイラが準備されています。

### Scala 2.13コンパイラ

Scala 2.13コンパイラは `-Xsource:3`をサポートしています。これは、いくつかのScala 3のシンタックスや振る舞いを可能とするオプションです。:
- ほとんどの非推奨の構文はエラーを生成する。
- 中置演算子":"は、複数行の式の途中で行を開始できる。
- Implicit searchと過負荷問題の解決は、特異性のチェック時にScala 3が共変性を扱う処理に従います。

`-Xsource:3`オプションは、早期の移行を促進することを目的としています。

### Scala 3コンパイラ

#### 移行モード

同様にScala 3コンパイラには`-source:3.0-migration` オプションが付いています。
このモードから、Scala 2.13のシンタックスのいくつかを許容し、変更に関する説明をWarningとして出してくれます。

それ以上に、`-rewrite`を使うことで自動的にコードにパッチを当ててくれます。

上記については[Scala 3移行モード](tooling-migration-mode.html) ページで学ぶことができます。

#### シンタックス書き換え

一度あなたのコードをScala3でコンパイルすると、[シンタックス書き換え](tooling-syntax-rewriting.html) オプションを使うことで新しくオプションであるScala 3シンタックスに変換されます。

## ビルドツール

### sbt

> sbt 1.4は`sbt-dotty` プラグインを必要としています。
> しかし1.5以降では必要なくなりました

sbt 1.5はScala 3をサポートしており、全ての共通タスクと設定は同じように動くことを目的としています。
多くのプラグインも確実に同じように動くべきです。

移行のヘルプとして、sbt 1.5が紹介している新たなScala 3のクロスバージョンがこちらです:

```scala
// Scala 3でScala 2.13ライブラリを使用する
libraryDependency += ("org.foo" %% "foo" % "1.0.0").cross(CrossVersion.for3Use2_13)

// Scala 2.13でScala 3ライブラリを使用する
libraryDependency += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for2_13Use3)
```

### Mill

[Mill](https://github.com/com-lihaoyi/mill) 0.9.x からScala 3をサポートしています。

### Maven

Scala 3 サポートに関しては [scala-maven-plugin](https://github.com/davidB/scala-maven-plugin)がもう間もなく出てくるでしょう.

## コードエディターとIDE

### Metals

[Metals](https://scalameta.org/metals/) VSコード、Vim， Emacs， SbulimeTextやEclips上で動くScala言語サーバーです。

Scala 3 はすでにMetalsによって大変良くサポートされています。
いくつかの新しいシンタックス変更や新機能といったマイナーアップデートは時期にでてきます。

### IntelliJ IDEA

InteliJ用のScalaプラグインはScala3用の予備サポートが含まれています。
本格的なサポートはJetBrainのチームよって行われています。

## フォーマットツール

### Scalafmt

[Scalafmt](https://scalameta.org/scalafmt/) v3.0.0-RC3 はScala 2.13とScala 3の両方サポートしています。

Scala 3 フォーマットを利用可能にするために、`.scalafmt.conf`ファイルに `runner.dialect = scala3`をセットしなければならないです。

もし、あなたが選択的に設定したい場合は`fileOverride` 設定が可能です。:

```conf
//.scalafmt.conf
fileOverride {
  "glob:**/scala-3*/**" {
    runner.dialect = scala3
  }
}
```

## 移行ツール

### Scalafix

[Scalafix](https://scalacenter.github.io/scalafix/) はScala用のリファクタリングツールです。
一度書いてしまえば、Scala 2.13上で実行されます。
しかし、Scala 3にジャンプする前にコードを準備しておくと便利です。

[Incompatibility Table](incompatibility-table.html) は既存のScalafixルールで修正できる非互換性が表示されています。
これまでのところ、関連するルールは以下のとおりです。
- [手続きシンタックス](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [明示的な結果の型](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)
- Eta-Expansion値: `fix.scala213.ExplicitNullaryEtaExpansion` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- Lambdaパラメータのまわりの括弧: `fix.scala213.ParensAroundLambda` in [ohze/scala-rewrites](https://github.com/ohze/scala-rewrites/blob/dotty/rewrites/src/main/scala/fix/scala213/ParensAroundLambda.scala)
- Auto Application: `fix.scala213.ExplicitNonNullaryApply` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)
- `any2stringadd` 変換: `fix.scala213.Any2StringAdd` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)

`sbt-scalafix` プラグインを使用して、これらのルールをsbtに適用できます。
これらは、以下で説明する  `sbt-scala3-migrate` でも内部的に使用されます。

### Scala 3移行プラグイン

[Scala 3移行](https://github.com/scalacenter/scala3-migrate) は移行期間中にアシストしてくれるsbt pluginがあります。

そのプロセスは段階的なアプローチで下記のようになっています:
- ライブラリの依存関係の移行:
  Scala 3で利用可能なバージョンが有るかどうか、ライブラリ依存関係ごとにチェックします.
- Scalaのコンパイルオプション(`scalacOptions`)の移行:
  Scala 2のいくつかのコンパイラのオプションは除去されたか、名前が変更した、もしくはそのままのものがあります。 
  このステップはあなたのプロジェクトのコンパイラのオプションに適用させるのに役立ちます。
- シンタックスの移行:
  このステップはシンタックスの非推奨を修正するためにScalafixや既存ルールに依存します。
- 型を明示してコードを移行:
  Scala 3はあたらしい型インタフェースのアルゴリズムをもっており、Scala 2の推論とはわずかに異なります。
  最後のステップでは、実行時の動作を変更せずにプロジェクトをScala 3でコンパイルできるように、型の最小セットを明示します。

## Scaladex

[Scaladex](https://index.scala-lang.org/)のScala 3のオープンソースライブラリのリストをチェックしてください
