---
title: Intelij で ScalaTest を使って Scala をテストする
layout: singlepage-overview
partof: testing-scala-in-intellij-with-scalatest
language: ja
disqus: true
previous-page: /ja/building-a-scala-project-with-intellij-and-sbt
---

Scala には複数のライブラリとテスト方法がありますが、このチュートリアルでは、ScalaTest フレームワークから [FunSuite](https://www.scalatest.org/getting_started_with_fun_suite) という人気のある選択肢を実演します。

[Intellij で sbt を使って Scala プロジェクトをビルドする方法](./building-a-scala-project-with-intellij-and-sbt.html)を知っている前提とします。

## セットアップ
1. Intellij で sbt プロジェクトを作成します。
1. ScalaTest への依存を追加します。
    1. `build.sbt` ファイルに ScalaTest への依存を追加します。
        ```
        libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.8" % Test
        ```
    1. `build.sbt was changed` という通知が出たら、**auto-import** を選択します。
    1. これらの2つのアクションにより、`sbt` が ScalaTest ライブラリをダウンロードします。
    1. `sbt` の同期完了を待ちます。そうしなければ `FunSuite` と `test()` は認識されません。
1. 左のプロジェクトペインで、`src` => `main` を展開します。
1. `scala` を右クリックし、**New** => **Scala class** を選択します。
1. クラスに `CubeCalculator` と名前をつけて、**Kind** を `object` に変更し、**OK** をクリックします。
1. コードを次の通り置き換えます。
    ```
    object CubeCalculator extends App {
      def cube(x: Int) = {
        x * x * x
      }
    }
    ```

## テストを作成
1. 左のプロジェクトペインで、`src` => `test` を展開します。
1. `scala` を右クリックし、**New** => **Scala class** を選択します。
1. クラスに `CubeCalculatorTest` と名前を付けて、**OK** をクリックします。
1. コードを次の通り置き換えます。
    ```
    import org.scalatest.FunSuite
    
    class CubeCalculatorTest extends FunSuite {
      test("CubeCalculator.cube") {
        assert(CubeCalculator.cube(3) === 27)
      }
    }
    ```
1. `CubeCalculatorTest` のソースコード内で右クリックし、**Run 'CubeCalculatorTest'** を選択します。

## コードを理解

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
1. `CubeCalculatorTest` を右クリックして 'Run **CubeCalculatorTest**' を選ぶことで、テストを再実行します。

## 結び
Scala コードのテスト方法のひとつを見ました。
ScalaTest の FunSuite については[公式ウェブサイト](https://www.scalatest.org/getting_started_with_fun_suite)で詳しく学べます。
