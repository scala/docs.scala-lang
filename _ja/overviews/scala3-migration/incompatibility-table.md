---
title: 非互換性テーブル
type: chapter
description: この章ではScala 2.13とScala 3間の全ての既知な非互換性をリスト化します  
num: 14
previous-page: tooling-syntax-rewriting
next-page: incompat-syntactic
language: ja
---

非互換性とは、Scala 2.13でコンパイルできるがScala 3ではなできないコードの一部のことです。
コードベースの移行には、ソースコードの全ての非互換性を見つけて修正することが含まれています。
極稀に、我々は実行時の非互換性に遭遇します：動作が異なるコードの一部です。

このページでは我々は既知の非互換性の分類を提案します。
それぞれの非互換性は以下のように説明されています。:
 - 詳細な説明と提案された解決策へのリンクを含む名前
 - Scala 2.13コンパイラが非推奨または機能WARNINGを発するかどうか
 - 非互換性に関しての[Scala 3移行](tooling-migration-mode.html)ルールの存在
 - 非互換性に関して修正できるScalafixルールの存在

> #### Scala2.13の非推奨と機能WARNING
> 2.13コンパイルを`-source:3`で実行すると非互換性のコードを見つけます。

> #### Scala 3移行とScalafixリライトの比較
> Scala3移行モードはすぐに使用できます。
> それに対して、Scalafixは手動でインストールして構成する必要があるツールです。
> ただし、Scalafixには独自の利点があります。:
> - Scala 2.13で動く
> - 一度に1つずつ適用することができる個々のルールで構成されている
> - カスタムルールの追加により拡張が容易である

### シンタックスの変更

いくつかの古い構文はサポートされていないです。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[制限された予約語](incompat-syntactic.html#制限された予約語)||✅||
|[手続き型シンタックス](incompat-syntactic.html#手続き型シンタックス)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Lambdaパラメータを囲む括弧](incompat-syntactic.html#lambdaパラメータを囲む括弧)||✅|[✅](https://github.com/ohze/scala-rewrites/tree/dotty/#fixscala213parensaroundlambda)|
|[引数を渡すための括弧のインデント](incompat-syntactic.html#引数を渡すための括弧のインデント)||✅||
|[間違ったインデント](incompat-syntactic.html#間違ったインデント)||||
|[型パラメータとしての`_`](incompat-syntactic.html#型パラメータとしての_)||||
|[型パラメータとしての`+`と`-`](incompat-syntactic.html#型パラメータとしてのと-)||||

### 機能の削除

いくつかの機能は言語を簡単にするために削除されています。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[シンボリックリテラル](incompat-dropped-features.html#シンボリックリテラル)|Deprecation|✅||
|[`do`-`while` 構造](incompat-dropped-features.html#do-while-構造)||✅||
|[自動適用](incompat-dropped-features.html#自動適用)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[Eta展開の値](incompat-dropped-features.html#eta展開の値)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` 変換](incompat-dropped-features.html#any2stringadd-変換)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[先行初期化](incompat-dropped-features.html#先行初期化)|Deprecation|||
|[存在型](incompat-dropped-features.html#存在型)|Feature warning|||

### コンテキストの抽象化

[コンテキストの抽象化]({% link _scala3-reference/contextual.md %})の再設計は明確に定義された非互換性が発生します。

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibility|
|--- |--- |--- |--- |--- |
|[暗黙的定義の型](incompat-contextual-abstractions.html#暗黙的定義の型)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](incompat-contextual-abstractions.html#implicit-views)||||**Possible**|
|[View bounds](incompat-contextual-abstractions.html#view-bounds)|Deprecation||||
|[`A`と`=> A`でのあいまいな変換](incompat-contextual-abstractions.html#aと-aでのあいまいな変換)|||||

さらに、暗黙の解決ルールを変更して、より便利で意外なものにならないようにしました。
新しいルールについては[ここ](/scala3/reference/changed-features/implicit-resolution.html)に説明しています。

これらの変更により、Scala 3コンパイラーは、既存のScala 2.13コードのいくつかの暗黙的なパラメーターの解決に失敗する可能性があります。

### その他の変更した機能

他のいくつかの機能は、言語をより簡単に、より安全に、またはより一貫性のあるものにするために簡略化または制限されています。

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

### 型チェッカー

Scala 2.13の型チェッカーはある特定のケースに関して解決できないです。
これは思いもしない驚異的な実行時エラーを導いてしまいます。
Scala 3は強力で理論的な基盤に基づいているため、型チェッカーのこれらの不健全なバグが修正されました。

|Incompatibility|
|--- |
|[分散チェック](incompat-type-checker.html#分散チェックの不具合修正)|
|[パターンマッチング](incompat-type-checker.html#パターンマッチングの不具合修正)|

### 型推論

いくつかの固有の型推論のルールはScala 2.13とScala 3の間で変更されました

|Incompatibility|
|--- |
|[オーバーライドしたメソッドの返り値の型](incompat-type-inference.html#オーバーライドしたメソッドの返り値の型)|
|[リフレクションの型](incompat-type-inference.html#リフレクションの型)|

また、型推論アルゴリズムは全体的な再設計を行い改善されました。
この根本的な変更により、いくつかの非互換性が生じます。:
- 別の型で推測することがあります
- 新しい型チェックエラーが表示される場合があります

> すべてのパブリックな値とメソッドの結果の型を明示的に記述することは良い習慣です。
> この習慣は、推測されるタイプが異なり、ライブラリのパブリックAPIがScalaバージョンで変更されるのを防ぎます。
> 
> これは、Scalafixの[ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)ルールを使用して、Scala3の移行前に行うことができます.

### マクロ

Scala 3コンパイラはScala 2.13マクロを展開することはできません。
このような状況では、新しいScala 3メタプログラミング機能を使用して、Scala 2.13マクロを再実装する必要があります。

[メタプログラミング](compatibility-metaprogramming.html) のページに戻れば新しいメタプログラミング機能について学ぶことができます
