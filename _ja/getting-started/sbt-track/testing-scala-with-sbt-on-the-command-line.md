---
title: コマンドラインで ScalaTest を使って Scala をテストする
layout: singlepage-overview
partof: testing-scala-with-sbt-on-the-command-line
language: ja
disqus: true
previous-page: /ja/getting-started-with-scala-and-sbt-on-the-command-line
---

Scala には複数のライブラリとテスト方法がありますが、このチュートリアルでは、ScalaTest フレームワークから [FunSuite](https://www.scalatest.org/getting_started_with_fun_suite) という人気のある選択肢を実演します。

[sbt での Scala プロジェクト作成方法](/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html)を知っている前提とします。

## セットアップ
1. コマンドラインで、どこかに新しいディレクトリを作成します。
1. そのディレクトリに `cd` して、`sbt new scala/scalatest-example.g8` を実行します。
1. プロジェクトに `ScalaTestTutorial` と名前を付けます。
1. ScalaTest が依存関係として `build.sbt` ファイルに書かれたプロジェクトができます。.
1. そのディレクトリに `cd` して、`sbt test` を実行します。
   これは `CubeCalculator.cube` という1つのテストを含むテストスイート `CubeCalculatorTest` を実行します。

```
sbt test
[info] Loading global plugins from /Users/username/.sbt/0.13/plugins
[info] Loading project definition from /Users/username/workspace/sandbox/my-something-project/project
[info] Set current project to scalatest-example (in build file:/Users/username/workspace/sandbox/my-something-project/)
[info] CubeCalculatorTest:
[info] - CubeCalculator.cube
[info] Run completed in 267 milliseconds.
[info] Total number of tests run: 1
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 1, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 1 s, completed Feb 2, 2017 7:37:31 PM
```

## テストを理解
1. テキストエディタで2つのファイルを開きます。
    * `src/main/scala/CubeCalculator.scala`
    * `src/test/scala/CubeCalculatorTest.scala`
1. `CubeCalculator.scala` ファイルでは、関数 `cube` がどのように定義されているかが分かります。
1. `CubeCalculatorTest.scala` ファイルでは、テスト対象オブジェクトにちなんで名前を付けられたクラスが見えます。

```
  import org.scalatest.FunSuite

  class CubeCalculatorTest extends FunSuite {
      test("CubeCalculator.cube") {
          assert(CubeCalculator.cube(3) === 27)
      }
  }
```

一行ずつ詳細に調べていきましょう。

* `class CubeCalculatorTest` は、オブジェクト `CubeCalculator` をテストすることを意味します。
* `extends FunSuite` により、ScalaTest の FunSuite クラスの機能（例えば `test` 関数）が使えるようになります。
* `test` は FunSuite から来た関数で、関数本体内のアサーションの結果を収集します。
* `"CubeCalculator.cube"` は、テストの名前です。
  どんな名前でもよいですが、慣例のひとつは "ClassName.methodName" です。
* `assert` は、真偽値の条件を1つ受けとり、そのテストが合格するか失敗するかを判断します。
* `CubeCalculator.cube(3) === 27` は `cube` 関数の結果が実際に 27 であるかどうかを調べます。
  `===` は ScalaTest の一部であり、きれいなエラーメッセージを提供します。

## テストケースを追加する
1. 1つ目の `assert` 句のあとにもう1つの句を追加し、`0` の3乗をチェックします。
1. `sbt test` を再び実行し、結果を見ます。

## 結び
Scala コードのテスト方法のひとつを見ました。
ScalaTest の FunSuite については[公式ウェブサイト](https://www.scalatest.org/getting_started_with_fun_suite)で詳しく学べます。
