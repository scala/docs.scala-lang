---
title: 新しいコンパイラオプション
type: section
description: この章では Scala 3 の全ての新しいコンパイラオプションをリスト化します
num: 23
previous-page: options-lookup
next-page: scaladoc-settings-compatibility
language: ja
---

このページでは、Scala 3.0.x で追加されたオプションのみが含まれている。

## 基本設定

| 3.0.x | description |
|---|---|
| `-color` | 出力の色付け Default: always. |
| `-doc-snapshot` | 現在のDottyのバージョン用のドキュメントのスナップショットを生成する|
| `-explain` | エラーの詳細を記述する |
| `-from-tasty` | TASTyファイルのクラスコンパイル。 引数は .tasty または .jar ファイル |
| `-indent` | -rewrite と一緒に使う。重要なインデントのために可能な場合は {...} 構文を削除する |
| `-new-syntax` | 制御式に `then` と `do` が必要 |
| `-no-indent` | クラシックな {...} 構文が必要で、インデントは考慮しない |
| `-old-syntax` | 条件の周りに `(...)` が必要だ |
| `-pagewidth` | ページ幅の設定 Default: 80 |
| `-print-lines` | ソースコードの行数を表示する |
| `-print-tasty` | 生のTASTyを表示する |
| `-project` | プロジェクトの名前 |
| `-project-logo` | プロジェクトロゴ (/images下にある)を含める。 |
| `-project-url` | プロジェクトのリポジトリ |
| `-project-version` | プロジェクトの現行バージョン |
| `-rewrite` | `...-migration` ソースバージョンと組み合わせて使用​​する場合、ソースを最新バージョンに移行する |
| `-siteroot` | ドキュメントを生成する静的ファイルを含むディレクトリ Default: ./docs. |
| `-sourceroot` | ワークスペースのルートディレクトリを指定する Default: .. |

## 拡張設定

| 3.0.x | description |
|---|---|
| `-Xignore-scala2-macros` | Scala 2 マクロを呼び出すコードをコンパイルする際、エラーを無視するが実行時に失敗するだろう |
| `-Ximport-suggestion-timeout` | エラーが報告されたときにインポート候補を検索する時のタイムアウト（ミリ秒単位） | 
| `-Xmax-inlined-trees` | インラインツリーの最大数 Default: 2000000 | 
| `-Xmax-inlines` | 連続するインラインの最大数 Default: 32 | 
| `-Xprint-diff` | 前回のプリント出力以降に変更されたツリーの部分をプリント出力する | 
| `-Xprint-diff-del` | 削除された部分を含め、最後のプリント出力した以降に変更されたツリーの部分をプリント出力する | 
| `-Xprint-inline` | インライン化されたコードがどこから来たのかを示す | 
| `-Xprint-suspension` | マクロがコンパイルされるまでコードが一時停止されるタイミングを表示する | 
| `-Xrepl-disable-display` | REPLで定義を表示しない | 
| `-Xwiki-syntax` | Scaladoc で Wiki 構文を使用する Scala 2 の動作を保持する | 

## プライベート設定

| 3.0.x | description |
|---|---|
| `-Ycheck-all-patmat` | すべてのパターンマッチング（アルゴリズムのテストに使用）の網羅性と冗長性を確認する |
| `-Ycheck-mods` | シンボルとその定義ツリーに修正が同期していることを確認する |
| `-Ycheck-reentrant` | コンパイルされたプログラムに、グローバルルートからアクセスできる変数が含まれていないことを確認する |
| `-Ycook-comments` | コメントを調整する（型検査 `@ usecase` など） |
| `-Ydebug-error` | エラーが検出されたときにスタックトレースをプリント出力する |
| `-Ydebug-flags` | 定義のすべてのフラグをプリント出力する |
| `-Ydebug-missing-refs` | 必要なシンボルが欠落している場合は、スタックトレースにプリント出力する |
| `-Ydebug-names` | 名前の内部表現を表示する |
| `-Ydebug-pos` | スパンを含む完全なソース位置を表示する |
| `-Ydebug-trace` | トレースのコアオプション |
| `-Ydebug-tree-with-id` | 指定されたIDのツリーが作成されたときに、スタックトレースをプリント出力する Default: -2147483648 |
| `-Ydebug-type-error` | TypeError がキャッチされたときにスタックトレースをプリント出力する |
| `-Ydetailed-stats` | 詳細な内部コンパイラ統計を表示する（別途 Stats.enabled を true に設定する必要がある） |
| `-YdisableFlatCpCaching` | コンパイラインスタンス間で jar からのクラスパス要素のフラットクラスパス表現をキャッシュさせない |
| `-Ydrop-comments` | ソースファイルをスキャンするときにコメントを削除する |
| `-Ydump-sbt-inc` | コンパイルされたすべての foo.scala について、foo.inc で sbt インクリメンタルコンパイルに使用される API 表現と依存関係をプリント出力する　これは -Yforce-sbt-phases を意味する |
| `-Yerased-terms` | 消去された用語の使用を許可する |
| `-Yexplain-lowlevel` | タイプエラーを説明するときは、タイプを下位レベルで表示する　|
| `-Yexplicit-nulls` | 参照型を NULL 不可にする　null 許容型は、ユニオンで表すことができる: e.g. String&#124;Null. |
| `-Yforce-sbt-phases` | デバッグ用で、コンパイラが sbt の外部で実行されている場合でも、インクリメンタルコンパイル（ExtractDependencies および ExtractAPI ）する |
| `-Yfrom-tasty-ignore-list` | -from-tasty の使用時にロードされない jar ファイル内の  `tasty` ファイルのリストを指定する |
| `-Yindent-colons` | 行末のコロンがインデントブロックを開始できるようする |
| `-Yinstrument` | 割り当てとクロージャーの作成をカウントするインストルメンテーションコードを追加する |
| `-Yinstrument-defs` | メソッド呼び出しをカウントするインストルメンテーションコードを追加する -Yinstrument も設定する必要がある |
| `-Yno-decode-stacktraces` | トリガー操作にデコードする代わりに、生の StackOverflow スタックトレースを実行する |
| `-Yno-deep-subtypes` | 深いサブタイプの呼び出しスタックで例外をスローする |
| `-Yno-double-bindings` | 名前付き型が2回バインドされていないことをアサートする（プログラムにエラーがない場合にのみ有効にする必要がある） |
| `-Yno-kind-polymorphism` | 種類のポリモーフィズムを無効にする |
| `-Yno-patmat-opt` | すべてのパターンマッチングの最適化を無効にする |
| `-Yplain-printer` | Pretty-print を使用してきれいにプリント出力する |
| `-Yprint-debug` | ツリーのプリント出力時に、デバッグ用にその他の便利な情報を出力する |
| `-Yprint-debug-owners` | ツリーのプリント出力時に, 定義の所有者をプリント出力する |
| `-Yprint-pos` | ツリーの場所を表示する |
| `-Yprint-pos-syms` | シンボル定義の場所を表示する |
| `-Yprint-syms` | ツリーをプリント出力する場合、ツリー内の対応する情報ではなく、シンボルで情報をプリント出力する |
| `-Yrequire-targetName` | @targetName アノテーションなしで定義しているのがあれば警告を出す |
| `-Yretain-trees` | ClassSymbol＃tree からアクセス可能なトップレベルクラスのツリーを保持する |
| `-Yscala2-unpickler` | Scala2 シンボルをどこから取得できるかを制御する。 "always"、 "never"、 またはクラスパスのどれかを指定する。 Default: always |
| `-Yshow-print-errors` | ツリーのプリント出力時に投げられる例外を抑制しないようにする |
| `-Yshow-suppressed-errors` | 通常は抑制されている後続のエラーと警告を表示する |
| `-Yshow-tree-ids` | デバッグ出力ですべてのツリーノードに一意にタグを付ける |
| `-Yshow-var-bounds` | 型変数とその境界をプリント出力する |
| `-Ytest-pickler` | 関数的な pickling における自己テスト; -Ystop-after:pickler と一緒に使われるべきだ |
| `-Yunsound-match-types` | 不健全な match タイプの削減アルゴリズムを使用する|
