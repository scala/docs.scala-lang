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

移行に関して、簡単でスムーズに行えるように、事前に2つのコンパイラが準備している。

### Scala 2.13コンパイラ

Scala 2.13 コンパイラは `-Xsource:3` をサポートしている。これは、一部の Scala 3 の構文や振る舞いを可能とするオプションだ:

- ほとんどの非推奨の構文はエラーを生成する。
- 中置演算子":"は、複数行の式の途中で行を開始できる。
- Implicit search と過負荷問題の解決は、特異性のチェック時に Scala 3 が共変性を扱う処理に従う。

`-Xsource:3` オプションは、早期の移行を促進することを目的としている。

### Scala 3コンパイラ

#### 移行モード

同様に Scala 3 コンパイラには `-source:3.0-migration` オプションがある。
このモードにより、Scala 2.13 の構文の一部を許容し、変更に関する説明をWarningとして出す。

さらに、`-rewrite` を使うことで自動的にコードにパッチを当ててくれる。

上記については[Scala 3移行モード](tooling-migration-mode.html) のページで学ぶことができる。

#### 構文書き換え

一度コードを Scala3 でコンパイルすると、[構文書き換え](tooling-syntax-rewriting.html) オプションを使うことで新しくオプショナルな Scala 3 構文に変換される。

## ビルドツール

### sbt

> sbt 1.4 ではビルドする際、 `sbt-dotty` プラグインが必要だ。
> しかし 1.5 以降では不要になった。

sbt 1.5 は Scala 3 をサポートしており、目的は全ての共通タスクと設定は同じように動くことだ。
多くのプラグインも確実に同じように動くべきだ。

移行のヘルプとして、sbt 1.5 が紹介している新たな Scala 3 のクロスバージョンを示す:

```scala
// Scala 3 で Scala 2.13 ライブラリを使用する
libraryDependency += ("org.foo" %% "foo" % "1.0.0").cross(CrossVersion.for3Use2_13)

// Scala 2.13 で Scala 3 ライブラリを使用する
libraryDependency += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for2_13Use3)
```

### Mill

[Mill](https://github.com/com-lihaoyi/mill) 0.9.x から Scala 3 をサポートしている。

### Maven

Scala 3 サポートに関しては [scala-maven-plugin](https://github.com/davidB/scala-maven-plugin)がもう間もなく出てくるだろう。

## コードエディターとIDE

### Metals

[Metals](https://scalameta.org/metals/)は VS Code、Vim、Emacs、SbulimeText や Eclips 上で動く Scala 言語サーバーだ。

Scala 3 はすでに Metals によって大変良くサポートされている。
いくつかの新しい構文変更や新機能といったマイナーアップデートは時期にでてくる。

### IntelliJ IDEA

InteliJ 用の Scala プラグインは Scala3 用の予備サポートが含まれている。
本格的なサポートは JetBrain のチームよって行われている。

## フォーマットツール

### Scalafmt

[Scalafmt](https://scalameta.org/scalafmt/) v3.0.0-RC3 は Scala 2.13 と Scala 3 の両方サポートしている。

Scala 3 フォーマットを利用可能にするためには、`.scalafmt.conf` ファイルに `runner.dialect = scala3` を設定しなければならない。

もし、選択的に設定したい場合は `fileOverride` 設定が可能だ:

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

[Scalafix](https://scalacenter.github.io/scalafix/) は Scala 用のリファクタリングツールだ。
一度書いてしまえば、Scala 2.13 上で実行される。
しかし、Scala 3 に移行する前にコードを準備しておくと便利である。

[Incompatibility Table](incompatibility-table.html) は既存の Scalafix ルールで修正できる非互換性が表示されている。
これまでのところ、関連するルールは以下のとおりだ

- [手続き構文](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [明示的な結果の型](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)
- イータ展開の値: `fix.scala213.ExplicitNullaryEtaExpansion` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- Lambdaパラメータのまわりの括弧: `fix.scala213.ParensAroundLambda` in [ohze/scala-rewrites](https://github.com/ohze/scala-rewrites/blob/dotty/rewrites/src/main/scala/fix/scala213/ParensAroundLambda.scala)
- 自動適用: `fix.scala213.ExplicitNonNullaryApply` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)
- `any2stringadd` 変換: `fix.scala213.Any2StringAdd` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)

`sbt-scalafix` プラグインを使用して、これらのルールを sbt に適用できる。
これらは、以下で説明する  `sbt-scala3-migrate` でも内部的に使用される。

### Scala 3移行プラグイン

[Scala 3移行](https://github.com/scalacenter/scala3-migrate) は移行期間中にアシストしてくれる sbt plugin がある。

そのプロセスは段階的なアプローチで下記のようになる:

- ライブラリの依存関係の移行:
  Scala 3 で利用可能なバージョンが有るかどうか、ライブラリ依存関係ごとにチェックする。
- Scala のコンパイルオプション(`scalacOptions`)の移行:
  Scala 2 の一部のコンパイラのオプションは廃止したか、名前を変更した、もしくはそのままのものがある。 
  このステップは自身のプロジェクトのコンパイラオプションに適用させるのに役立つ。
- 構文の移行:
  このステップは構文の非推奨を修正するために Scalafix や既存ルールに依存する。
- 型を明示してコードを移行:
  Scala 3 は新規の型推論のアルゴリズムをもっており、Scala 2 の推論アルゴリズムとはわずかに異なる。
  最後のステップでは、実行時の動作を変更せずにプロジェクトを Scala 3 でコンパイルできるように、型の最小セットを明示する。

## Scaladex

[Scaladex](https://index.scala-lang.org/)の Scala 3 のオープンソースライブラリのリストをチェックしてください。