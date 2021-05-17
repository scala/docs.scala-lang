---
layout: tour
title: パッケージとインポート
language: ja

discourse: true

partof: scala-tour

num: 35
previous-page: named-arguments
next-page: package-objects
---

# パッケージとインポート
Scalaは名前空間を作るためにパッケージを使います。名前空間によりプログラムをモジュール化できます。

## パッケージの作成
Scalaファイルの先頭で1つ以上のパッケージ名を宣言することでパッケージは作られます。

```
package users

class User
```
パッケージとScalaファイルが含まれるディレクトリは同じ名前をつける習慣があります。しかし、Scalaはファイルのレイアウトには関知しません。`package users`を含むsbtプロジェクトのディレクトリ構成はこのようになるかもしれません。

```
- ExampleProject
  - build.sbt
  - project
  - src
    - main
      - scala
        - users
          User.scala
          UserProfile.scala
          UserPreferences.scala
    - test
```
`users`ディレクトリがどのように`scala`ディレクトリの中にあり、複数のScalaファイルがどのようにパッケージ内にあるのかに注意してください。パッケージ内のScalaファイルは同じパッケージ宣言を持ちます。パッケージ宣言の他の方法は波括弧を使い以下のようにします。

```
package users {
  package administrators {
    class NormalUser
  }
  package normalusers {
    class NormalUser
  }
}
```
見ての通り、この方法はパッケージのネストができ、スコープとカプセル化をより強くコントロールできます。

パッケージ名は全て小文字で書き、もしコードがwebサイトを持つ組織によって開発される場合、慣習として次のフォーマットであるべきです。`<トップレベルドメイン>.<ドメイン名>.<プロジェクト名>`。例えば、Googleが`SelfDrivingCar`と呼ばれるプロジェクトを持っている場合、パッケージ名はこんな風になるでしょう。
```
package com.google.selfdrivingcar.camera

class Lens
```
これは次のディレクトリ構成に対応します。`SelfDrivingCar/src/main/scala/com/google/selfdrivingcar/camera/Lens.scala`

## インポート
`import`句は他パッケージのメンバー（クラス、トレイト、関数など）にアクセスするためのものです。同じパッケージのメンバーにアクセスするには`import`句は必要ありません。import句は以下のどれでも使えます。
```
import users._  // usersパッケージから全てをインポートする
import users.User  // クラスUserをインポートする
import users.{User, UserPreferences}  // 選択されたメンバーのみインポートする
import users.{UserPreferences => UPrefs}  // インポートし利便性のために名前を変更する
```
ScalaのJavaと異なる点の1つはインポートがどこでも使える点です。

```scala mdoc
def sqrtplus1(x: Int) = {
  import scala.math.sqrt
  sqrt(x) + 1.0
}
```
名前競合があり、プロジェクトのルートから何かをインポートする必要がある時、パッケージ名の前に`_root_`をつけます。
```
package accounts

import _root_.users._
```


注：`scala`と`java.lang` パッケージは`object Predef`と同じように標準でインポートされています。
