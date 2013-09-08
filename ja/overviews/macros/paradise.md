---
layout: overview-large
language: ja

disqus: true

partof: macros
num: 8
outof: 9
title: マクロパラダイス
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako 著**<br>
**Eugene Yokota 訳**

マクロパラダイスとはオフィシャルの Scala リポジトリ内の `paradise/macros211` ブランチの別名のことで、Scala の安定性を損ねることなくマクロの迅速な開発を行うことを目的としている。このブランチに関するより詳しいことは[この講演](http://scalamacros.org/news/2012/12/18/macro-paradise.html)を参考にしてほしい。

Sonatype にスナップショットのアーティファクトが公開されるようにナイトリービルドを設定してある。SBT を用いたナイトリーの使い方は [https://github.com/scalamacros/sbt-example-paradise](https://github.com/scalamacros/sbt-example-paradise) を参考にしてほしいが、要点をまとめるとマクロパラダイスを使うのはビルド定義に以下の 3行を加えるだけでいい (マクロを使うように [SBT をセットアップ](/ja/overviews/macros/overview.html#using_macros_with_maven_or_sbt)済みであることが前提だが):

    scalaVersion := "2.11.0-SNAPSHOT"
    scalaOrganization := "org.scala-lang.macro-paradise"
    resolvers += Resolver.sonatypeRepo("snapshots")

現行の SBT ではカスタムの `scala-compiler.jar` を新しいスナップショットに更新するときに問題が発生する。症状を説明しよう。最初にマクロパラダイスを使ってプロジェクトをコンパイルしたときは全て正しく動作する。しかし、数日後に `sbt update` を実行すると、SBT は新しい `scala-library.jar` と `scala-reflect.jar` のナイトリービルドを取得するが、`scala-compiler.jar` は取得しない。これを解決するには、`sbt reboot full` を使って SBT 自身と内部で使われている scalac のインスタンスをダウンロードし直す必要がある。この残念な問題に関しては現在調査中だが、それまでは[メーリングリストにて](https://groups.google.com/forum/?fromgroups=#!topic/simple-build-tool/UalhhX4lKmw/discussion)この問題に関する議論に参加することができる。

パラダイスのナイトリーに対応した Scaladocs は [Jenkins サーバ](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise211-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html)にある。例えば、[scala.reflect.macros.Synthetics](https://scala-webapps.epfl.ch/jenkins/view/misc/job/macro-paradise211-nightly-main/ws/dists/latest/doc/scala-devel-docs/api/index.html#scala.reflect.macros.Synthetics) はトップレベルの定義に関する新しい API だ。
