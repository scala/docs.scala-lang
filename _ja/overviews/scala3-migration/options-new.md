---
title: 新しいコンパイラオプション
type: section
description: この章ではScala 3の全ての新しいコンパイラオプションをリスト化します
num: 23
previous-page: options-lookup
next-page: scaladoc-settings-compatibility
language: ja
---

現在のページには、Scala 3.0.xで追加されたオプションのみが含まれています。

## 基本設定

| 3.0.x | description |
|-|-|
| `-color` | 出力の色付け Default: always. |
| `-doc-snapshot` | 現在のDottyのバージョン用のドキュメントのスナップショットを生成します|
| `-explain` | エラーの詳細を説明します。 |
| `-from-tasty` | TASTyファイルのクラスコンパイル. 引数は .tasty または .jar ファイル. |
| `-indent` | -rewriteと一緒に使います, 重要なインデントのために可能な場合は {...} シンタックスを削除します。 |
| `-new-syntax` | 制御式に `then` と `do` が必要になります。 |
| `-no-indent` | クラシックな {...} シンタックスが必要で, インデントは重要ではないです |
| `-old-syntax` | 条件の周りに`(...)`が必要です。 |
| `-pagewidth` | ページ幅の設定 Default: 80. |
| `-print-lines` | ソースコードの行数を表示します。 |
| `-print-tasty` | 生のTASTyを表示します。 |
| `-project` | プロジェクトの名前。 |
| `-project-logo` | プロジェクトロゴ (in /imagesにある)を含めます。 |
| `-project-url` | プロジェクトのリポジトリ |
| `-project-version` | プロジェクトの現行バージョン |
| `-rewrite` | `...-migration` ソースバージョンと組み合わせて使用​​する場合, ソースを最新バージョンに移行させます。 |
| `-siteroot` | ドキュメントを生成する静的ファイルを含むディレクトリ Default: ./docs. |
| `-sourceroot` | ワークスペースのルートディレクトリを指定します。 Default: .. |

## 拡張設定

| 3.0.x | description |
|-|-|
| `-Xignore-scala2-macros` | Scala 2マクロを呼び出すコードをコンパイルするときのエラーを無視しますがランタイム時に失敗するでしょう。 | 
| `-Ximport-suggestion-timeout` | エラーが報告されたときにインポート候補を検索するためのタイムアウト（ミリ秒単位）。 | 
| `-Xmax-inlined-trees` | インラインツリーの最大数。 Default: 2000000 | 
| `-Xmax-inlines` | 連続するインラインの最大数。 Default: 32. | 
| `-Xprint-diff` | 前回のプリント出力以降に変更されたツリーの部分をプリント出力します。 | 
| `-Xprint-diff-del` | 削除された部分を含め、最後のプリント出力した以降に変更されたツリーの部分をプリント出力します。 | 
| `-Xprint-inline` | インライン化されたコードがどこから来たのかを示します。 | 
| `-Xprint-suspension` | マクロがコンパイルされるまでコードが一時停止されるタイミングを表示します。 | 
| `-Xrepl-disable-display` | REPLで定義を表示しません。 | 
| `-Xwiki-syntax` | ScaladocでWiki構文を使用するScala2の動作を保持します。 | 

## プライベート設定

| 3.0.x | description |
|-|-|
| `-Ycheck-all-patmat` | すべてのパターンマッチング（アルゴリズムのテストに使用）の網羅性と冗長性を確認します。|
| `-Ycheck-mods` | シンボルとその定義ツリーに修正が同期していることを確認します。 |
| `-Ycheck-reentrant` | コンパイルされたプログラムに、グローバルルートからアクセスできる変数が含まれていないことを確認します。 |
| `-Ycook-comments` | コメントを調整します（型チェック `@ usecase`など） |
| `-Ydebug-error` | エラーが検出されたときにスタックトレースをプリント出力します。 |
| `-Ydebug-flags` | 定義のすべてのフラグをプリント出力します。 |
| `-Ydebug-missing-refs` | 必要なシンボルが欠落している場合は、スタックトレースにプリント出力します。 |
| `-Ydebug-names` | 名前の内部表現を表示します。 |
| `-Ydebug-pos` | スパンを含む完全なソース位置を表示します。 |
| `-Ydebug-trace` | トレースのコアオプションです。 |
| `-Ydebug-tree-with-id` | 指定されたIDのツリーが作成されたときに、スタックトレースをプリント出力します。 Default: -2147483648. |
| `-Ydebug-type-error` | TypeErrorがキャッチされたときにスタックトレースをプリント出力します |
| `-Ydetailed-stats` | 詳細な内部コンパイラ統計を表示します（別途Stats.enabledをtrueに設定する必要があります）。 |
| `-YdisableFlatCpCaching` | コンパイラインスタンス間でjarからのクラスパス要素のフラットクラスパス表現をキャッシュさせません。 |
| `-Ydrop-comments` | ソースファイルをスキャンするときにコメントを削除します。 |
| `-Ydump-sbt-inc` | コンパイルされたすべてのfoo.scalaについて、foo.incでsbtインクリメンタルコンパイルに使用されるAPI表現と依存関係をプリント出力します。これは-Yforce-sbt-phasesを意味します。 |
| `-Yerased-terms` | 消去された用語の使用を許可します。 |
| `-Yexplain-lowlevel` | タイプエラーを説明するときは、タイプを下位レベルで表示します。　|
| `-Yexplicit-nulls` | 参照型をNULL不可にします。null許容型は、ユニオンで表すことができます。: e.g. String&#124;Null. |
| `-Yforce-sbt-phases` | デバッグ用で、コンパイラがsbtの外部で実行されている場合でも、インクリメンタルコンパイル（ExtractDependenciesおよびExtractAPI）します。 |
| `-Yfrom-tasty-ignore-list` | -from-tastyの使用時にロードされないjarファイル内の `tasty`ファイルのリストを指定 |
| `-Yindent-colons` | 行末のコロンがインデントブロックを開始できるようにします。 |
| `-Yinstrument` | 割り当てとクロージャーの作成をカウントするインストルメンテーションコードを追加します。 |
| `-Yinstrument-defs` | メソッド呼び出しをカウントするインストルメンテーションコードを追加します。 -Yinstrumentも設定する必要があります。 |
| `-Yno-decode-stacktraces` | トリガー操作にデコードする代わりに、生のStackOverflowスタックトレースを実行します |
| `-Yno-deep-subtypes` | 深いサブタイプの呼び出しスタックで例外をスローします。 |
| `-Yno-double-bindings` | 名前付き型が2回バインドされていないことをアサートします（プログラムにエラーがない場合にのみ有効にする必要があります）。 |
| `-Yno-kind-polymorphism` | 種類のポリモーフィズムを無効にします。 |
| `-Yno-patmat-opt` | すべてのパターンマッチングの最適化を無効にします。 |
| `-Yplain-printer` | Pretty-printを使用してきれいにプリント出力します。 |
| `-Yprint-debug` | ツリーのプリント出力時に, デバッグ用にその他の便利な情報を出力します。 |
| `-Yprint-debug-owners` | ツリーのプリント出力時に, 定義の所有者をプリント出力します。 |
| `-Yprint-pos` | ツリーの場所を表示します。 |
| `-Yprint-pos-syms` | シンボル定義の場所を表示します。 |
| `-Yprint-syms` | ツリーをプリント出力する場合、ツリー内の対応する情報ではなく、シンボルで情報をプリント出力します |
| `-Yrequire-targetName` | @targetNameアノテーションなしで定義しているのがあればWARNINGします。 |
| `-Yretain-trees` | ClassSymbol＃treeからアクセス可能なトップレベルクラスのツリーを保持します。 |
| `-Yscala2-unpickler` | Scala2シンボルをどこから取得できるかを制御します。"always", "never", またはクラスパスのどれかを指定できます。 Default: always. |
| `-Yshow-print-errors` | ツリーのプリント出力時に投げられる例外を抑制しないようにします。 |
| `-Yshow-suppressed-errors` | 通常は抑制されている後続のエラーとWARNINGを表示します. |
| `-Yshow-tree-ids` | デバッグ出力ですべてのツリーノードに一意にタグを付けます。 |
| `-Yshow-var-bounds` | 型変数とその境界をプリント出力します。 |
| `-Ytest-pickler` | 関数的なpicklingにおける自己テスト; -Ystop-after:picklerと一緒に使われるべきです。 |
| `-Yunsound-match-types` | 不健全なmatchタイプの削減アルゴリズムを使用します。|
