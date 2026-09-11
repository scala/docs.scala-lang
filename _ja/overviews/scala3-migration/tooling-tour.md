---
title: 移行ツールのツアー
type: chapter
description: この章は移行ツールのエコシステムのツアーです
num: 6
previous-page: compatibility-metaprogramming
next-page: tooling-migration-mode
language: ja
---

## 2系列の Scala コンパイラ

移行が簡単でスムーズになるように、2系と3系両方コンパイラにおいて周到にマイグレーションの準備が進められてきた。

### Scala 2.13 コンパイラ

Scala 2.13 コンパイラは `-Xsource:3` というオプションをサポートして、一部の Scala 3 構文や振る舞いを先取りできるようになっている:

- ほとんどの非推奨の構文はエラーを生成する。
- 複数行にまたがる式の途中の行頭に中置演算子を置いて新しい行を始めることができる。
- implicit 検索とオーバーロード解決は、Scala 3 が型のどちらがより特化されているかを判定するときに用いる反変性処理にならう。

`-Xsource:3` オプションは、早期の移行を促進することを目的としている。

### Scala 3 コンパイラ

#### マイグレーション・モード

同様に Scala 3 コンパイラには `-source:3.0-migration` オプションがある。
このモードにより、Scala 2.13 の構文の一部を許容し、変更に関する説明をWarningとして出す。

さらに、`-rewrite` と合わせて使うことで自動的にコードにパッチを当ててくれる。

上記については[Scala 3 マイグレーション・モード](tooling-migration-mode.html) のページで解説する。

#### 構文書き換え

いったんコードが Scala 3 でコンパイルが通るようになると、次に[構文書き換え](tooling-syntax-rewriting.html)オプションを使って、オプショナルな Scala 3 新構文へと変換することができる。

## ビルドツール

### sbt

> sbt 1.4 ではビルドする際、 `sbt-dotty` プラグインが必要だ。
> しかし 1.5 以降では不要になった。

sbt 1.5 は追加設定無しで Scala 3 をサポートしており、よく使われるタスクやセッティングは全て従来と同じように動作することを意図した設計となっている。
多くのプラグインも同じように振る舞うはずだ。

マイグレーションの役に立つように、sbt 1.5 は新たに Scala 3 専用のクロスバージョンを導入した:

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

[Metals](https://scalameta.org/metals/)は VS Code、Vim、Emacs、SublimeText や Eclipse 上で動く Scala 言語サーバーだ。

Scala 3 はすでに Metals によって大変良くサポートされている。
いくつかの新しい構文変更や新機能といったマイナーアップデートは時期にでてくる。

### IntelliJ IDEA

現行の InteliJ Scala プラグインに含まれる Scala 3 のサポートは暫定的なものだ。
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
本稿を書いている時点では、Scala 2.13 のみで実行することができる。
しかし、Scala 3 に移行する前の準備としては役に立つかもしれない。

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

### scala3-migrate プラグイン

[scala3-migrate](https://github.com/scalacenter/scala3-migrate) という sbt プラグインがあり、Scala 3 へのマイグレーションをアシストしてくれる。

そのプロセスは段階的なアプローチで下記のようになる:

- ライブラリ依存性の移行:
  ライブラリごとに、Scala 3 で利用可能なバージョンが有るかどうかチェックする。
- Scala のコンパイルオプション(`scalacOptions`)の移行:
  Scala 2 の一部のコンパイラのオプションは廃止したか、名前を変更した、もしくはそのままのものがある。 
  このステップは自身のプロジェクトのコンパイラオプションに適用させるのに役立つ。
- 構文の移行:
  このステップは構文の非推奨を修正するために Scalafix や既存ルールに依存する。
- 明示的な型の表記（コードの移行）:
  Scala 3 は新規の型推論のアルゴリズムをもっており、Scala 2 の推論アルゴリズムとはわずかに異なる。
  最後のステップでは、実行時の動作を変更しない形でプロジェクトを Scala 3 でコンパイルするのに最低限必要な型の明示的な表記を行う。

## Scaladex

[Scaladex](https://index.scala-lang.org/)の Scala 3 のオープンソースライブラリのリストをチェックしてください。