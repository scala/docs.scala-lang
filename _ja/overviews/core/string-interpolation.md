---
layout: singlepage-overview
title: 文字列の補間

partof: string-interpolation

language: ja
---

**Josh Suereth 著**<br>
**Eugene Yokota 訳**

## はじめに

Scala 2.10.0 より、Scala は文字列の補間 (string interpolation) というデータから文字列を作成する機構を提供する。
文字列の補間を使ってユーザは<b>加工文字列リテラル</b> (processed string literal) 内に直接変数の参照を埋め込むことができる。具体例で説明しよう:

    val name = "James"
    println(s"Hello, $name")  // Hello, James

上の例において、リテラル `s"Hello, $name"` は加工文字列リテラルだ。これはコンパイラがこのリテラルに対して何らかの追加処理を実行するということだ。加工文字リテラルは `"` の前にいくつかの文字を書くことで表記される。文字列の補間は [SIP-11](https://docs.scala-lang.org/sips/pending/string-interpolation.html) によって導入され、実装の詳細もそこに書かれている。

## 用例

Scala は `s`、`f`、そして `raw` という 3つの補間子 (interpolator) をあらかじめ提供する。

### `s` 補間子

文字列リテラルの先頭に `s` を追加することで文字列の中で直接変数が使えるようになる。先ほどの例で既にみた機能だ:

    val name = "James"
    println(s"Hello, $name")  // Hello, James

この例では、 `s` で加工される文字列の中に `$name` が入れ子になっている。`s` 補間子は `name` 変数の値をこの位置に挿入しなければいけないと知っているため、結果として `Hello, James` という文字列となる。`s` 補間子を使って、スコープ内にあるどの名前でも文字列の中に埋め込むことができる。

文字列の補間は任意の式を受け取る事もできる。具体例でみると

    println(s"1 + 1 = ${1 + 1}")

は文字列 `1 + 1 = 2` と表示する。`${}` を使って任意の式を埋め込むことができる。

### `f` 補間子

文字列リテラルの先頭に `f` を追加することで、他の言語での `printf` のような簡単な書式付き文字列を作ることができる。`f` 補間子を使った場合は、全ての変数参照は `%d` のように `printf` 形式の書式を指定する必要がある。具体例で説明しよう:

    val height = 1.9d
    val name = "James"
    println(f"$name%s is $height%2.2f meters tall")  // James is 1.90 meters tall

`f` 補間子は型安全だ。整数のみで動作する書式に `Double` を渡すとコンパイラはエラーを表示する。例えば:

    val height: Double = 1.9d

    scala> f"$height%4d"
    <console>:9: error: type mismatch;
     found   : Double
     required: Int
               f"$height%4d"
                  ^

`f` 補間子は Java にある文字列の書式付き出力ユーティリティを利用している。`%` 文字の後に書くことが許されている書式は [Formatter の javadoc](https://docs.oracle.com/javase/jp/1.5.0/api/java/util/Formatter.html#detail) に説明されている。変数の後に `%` 文字が無い場合は、`%s` 書式 (`String`) だと仮定される。

### `raw` 補間子

`raw` 補間子は `s` 補間子に似ているが、違いは文字列リテラル内でエスケープを実行しないことだ。以下の加工文字列をみてみよう:

    scala> s"a\nb"
    res0: String =
    a
    b

ここで、`s` 補間子は `\n` を改行文字に置換した。`raw` 補間子はそれを行わない。

    scala> raw"a\nb"
    res1: String = a\nb

`raw` 補間子は `\n` のような式が改行になることを回避したい場合に便利だ。

3つのデフォルトの補間子の他にユーザは独自の補間子を定義することもできる。

## カスタム補間子

Scala では、全ての加工文字列リテラルは簡単なコード変換だ。コンパイラが以下のような形式の文字列リテラルを見つけると

    id"string content"

これは [`StringContext`](https://www.scala-lang.org/api/current/index.html#scala.StringContext) のインスタンスへのメソッドの呼び出し (`id`) へと変換される。このメソッドは implicit スコープ内で提供することもできる。独自の文字列の補間を定義するには、`StringContext` に新しいメソッドを追加する implicit クラスを作るだけでいい。以下に具体例で説明する:

    // 注意: 実行時のインスタンス化を避けるために AnyVal を継承する。
    // これに関しては値クラスのガイドを参照。
    implicit class JsonHelper(val sc: StringContext) extends AnyVal {
      def json(args: Any*): JSONObject = sys.error("TODO - IMPLEMENT")
    }

    def giveMeSomeJson(x: JSONObject): Unit = ...

    giveMeSomeJson(json"{ name: $name, id: $id }")

この例では、文字列の補間を使って JSON リテラル構文に挑戦している。この構文を使うには implicit クラスの `JsonHelper` がスコープにある必要があり、また `json` メソッドを実装する必要がある。注意して欲しいのは書式文字列リテラルが文字列ではなく、`JSONObject` を返す点だ。

コンパイラが `json"{ name: $name, id: $id }"` を見つけると、以下の式に書き換える:

    new StringContext("{ name: ", ", id: ", " }").json(name, id)

さらに、implicit クラスは以下のように書き換える:

    new JsonHelper(new StringContext("{ name: ", ", id: ", " }")).json(name, id)

そのため、`json` メソッドは生の String 部分と渡される式の値をみることができる。シンプルな (だけどバギーな) 実装を以下に示す:

    implicit class JsonHelper(val sc: StringContext) extends AnyVal {
      def json(args: Any*): JSONObject = {
        val strings = sc.parts.iterator
        val expressions = args.iterator
        var buf = new StringBuilder(strings.next())
        while(strings.hasNext) {
          buf.append(expressions.next())
          buf.append(strings.next())
        }
        parseJson(buf)
      }
    }

加工文字列の文字列部分は `StringContext` の `parts` メンバーとして提供される。
式の値は `json` メソッドに `args` パラメータとして渡される。`json` メソッドは、それを受け取って大きな文字列を生成した後 JSON へとパースする。より洗練された実装は文字列を生成せずに生の文字列と式の値から直接 JSON を構築するだろう。

## 制約

文字列の補間は現在パターンマッチング文の中では動作しない。この機能は Scala 2.11 リリースを予定している。
