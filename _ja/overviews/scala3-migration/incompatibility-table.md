---
title: 非互換性テーブル
type: chapter
description: この章ではScala 2.13とScala 3間の全ての既知な非互換性をリスト化します  
num: 14
previous-page: tooling-syntax-rewriting
next-page: incompat-syntactic
language: ja
---

非互換性とは、Scala 2.13 でコンパイルできるが Scala 3 ではコンパイルできないコードの一部のことである。
コードベースの移行作業には、ソースコードの全ての非互換性を見つけて修正することが含まれている。
極稀に、実行時の非互換性に遭遇する：動作が異なるコードの一部だ。

このページでは既知の非互換性の分類を提案する。
それぞれの非互換性は以下のように説明している:

 - 詳細な説明と提案された解決策へのリンクを含む名前
 - Scala 2.13 コンパイラが非推奨または機能に関する警告を発するかどうか
 - 非互換性に関しての[Scala 3 マイグレーション](tooling-migration-mode.html)ルールの存在
 - 非互換性に関して修正できる Scalafix ルールの存在

> #### Scala2.13の非推奨と警告機能
> 2.13 コンパイルを `-source:3` で実行すると非互換性のコードを見つける。

> #### Scala 3移行とScalafix書き換えの比較
> Scala 3 マイグレーション・モードはすぐに使用できる。
> それに対して、Scalafix は手動でインストールして構成する必要があるツールだ。
> ただし、Scalafix には独自の利点がある:
> 
> - Scala 2.13 で動く
> - 一度に1つずつ適用することができる個々のルールで構成されている
> - カスタムルールの追加により拡張が容易である

### 構文の変更

いくつかの古い構文はサポートされていない。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[制限された予約語](incompat-syntactic.html#制限された予約語)||✅||
|[手続き型構文](incompat-syntactic.html#手続き型構文)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Lambdaパラメータを囲む括弧](incompat-syntactic.html#lambdaパラメータを囲む括弧)||✅|[✅](https://github.com/ohze/scala-rewrites/tree/dotty/#fixscala213parensaroundlambda)|
|[引数を渡すための括弧のインデント](incompat-syntactic.html#引数を渡すための括弧のインデント)||✅||
|[間違ったインデント](incompat-syntactic.html#間違ったインデント)||||
|[型パラメータとしての`_`](incompat-syntactic.html#型パラメータとしての_)||||
|[型パラメータとしての`+`と`-`](incompat-syntactic.html#型パラメータとしてのと-)||||

### 機能の削除

いくつかの機能は言語を簡単にするために削除した。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[シンボリックリテラル](incompat-dropped-features.html#シンボリックリテラル)|Deprecation|✅||
|[`do`-`while` 機能](incompat-dropped-features.html#do-while-機能)||✅||
|[自動適用](incompat-dropped-features.html#自動適用)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[イータ展開の値](incompat-dropped-features.html#イータ展開の値)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` 変換](incompat-dropped-features.html#any2stringadd-変換)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[先行初期化](incompat-dropped-features.html#先行初期化)|Deprecation|||
|[存在型](incompat-dropped-features.html#存在型)|Feature warning|||

### コンテキストの抽象化

[コンテキストの抽象化]({% link _scala3-reference/contextual.md %})の再設計は明確に定義された非互換性が発生する。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibility|
|--- |--- |--- |--- |--- |
|[暗黙的定義の型](incompat-contextual-abstractions.html#暗黙的定義の型)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](incompat-contextual-abstractions.html#implicit-views)||||**Possible**|
|[View bounds](incompat-contextual-abstractions.html#view-bounds)|Deprecation||||
|[`A`と`=> A`でのあいまいな変換](incompat-contextual-abstractions.html#aと-aでのあいまいな変換)|||||

さらに、暗黙の解決ルールを変更して、より便利で、意外なものにはならないようにした。
新しいルールについては[ここ](/scala3/reference/changed-features/implicit-resolution.html)に説明している。

これらの変更により、Scala 3 コンパイラーは、既存の Scala 2.13 コードのいくつかの暗黙的なパラメーターの解決に失敗する可能性がある。

### その他の変更した機能

他のいくつかの機能は、言語をより簡単に、より安全に、またはより一貫性のあるものにするために簡略化または制限した。

|Incompatibility|Scala 3 Migration Rewrite|
|--- |--- |
|[継承シャドウイング](incompat-other-changes.html#継承シャドウイング)|✅|
|[プライベートクラスのNon privateなコンストラクタ](incompat-other-changes.html#プライベートクラスのnon-privateなコンストラクタ)|Migration Warning|
|[抽象オーバーライド](incompat-other-changes.html#抽象オーバーライド)||
|[ケースクラスコンパニオン](incompat-other-changes.html#ケースクラスコンパニオン)||
|[明示的な`unapply`の呼び出し](incompat-other-changes.html#明示的なunapplyの呼び出し)||
|[見えないビーンプロパティ](incompat-other-changes.html#見えないビーンプロパティ)||
|[型パラメータとしての`=> T`](incompat-other-changes.html#型パラメータとしての-t)||
|[型引数のワイルドカード](incompat-other-changes.html#型引数のワイルドカード)||

### 型検査

Scala 2.13 の型検査はある特定のケースに関して解決できない。
これは驚異的で思いもしない実行時エラーを導く。
Scala 3 は強力で理論的な基盤に基づいているため、型検査のこれらの不健全なバグは修正された。

|Incompatibility|
|--- |
|[分散チェック](incompat-type-checker.html#分散チェックの不具合修正)|
|[パターンマッチング](incompat-type-checker.html#パターンマッチングの不具合修正)|

### 型推論

いくつかの固有の型推論のルールは Scala 2.13 と Scala 3 の間で変更した。

|Incompatibility|
|--- |
|[オーバーライドしたメソッドの返り値の型](incompat-type-inference.html#オーバーライドしたメソッドの返り値の型)|
|[リフレクションの型](incompat-type-inference.html#リフレクションの型)|

また、型推論アルゴリズムは全体的な再設計を行い改善した。
この根本的な変更により、いくつかの非互換性が生じる:

- 別の型で推測することがある
- 新しい型検査でエラーが表示される場合がある

> すべてのパブリックな値とメソッドの結果の型を明示的に記述することは良い習慣である。
> この習慣は、推測される型が異なり、ライブラリのパブリック API が Scala バージョンで変更されるのを防ぐ。
> 
> これは、Scalafix の[ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)ルールを使用して、Scala 3 の移行前に行うことができる。

### マクロ

Scala 3 コンパイラは Scala 2.13 マクロを展開することはできない。
このような状況では、新しい Scala 3 メタプログラミング機能を使用して、Scala 2.13 マクロを再実装する必要がある。

[メタプログラミング](compatibility-metaprogramming.html) のページに戻れば新しいメタプログラミング機能について学ぶことができる。
