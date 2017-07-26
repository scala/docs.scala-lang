---
layout: multipage-overview
title: コレクションの作成

discourse: false

partof: collections
overview-name: Collections

num: 16

language: ja
---

`List(1, 2, 3)` 構文によって 3つの整数から成るリストを作成でき、`Map('A' -> 1, 'C' -> 2)` 構文によって 2つの写像から成るマップを作成することができる。これは Scala コレクションの統一された機能だ。どのコレクションを取っても、その名前に括弧付けされた要素のリストを付け加えることができる。結果は渡された要素から成る新しいコレクションだ。以下に具体例で説明する:

    Traversable()             // 空の traversable オブジェクト
    List()                    // 空のリスト
    List(1.0, 2.0)            // 要素 1.0, 2.0 を含むリスト
    Vector(1.0, 2.0)          // 要素 1.0, 2.0 を含むベクトル
    Iterator(1, 2, 3)         // 3つの整数を返すイテレータ
    Set(dog, cat, bird)       // 3種類の動物の集合
    HashSet(dog, cat, bird)   // 同じ動物のハッシュ集合
    Map('a' -> 7, 'b' -> 0)   // 文字から整数へのマップ

上の全ての行での呼び出しは内部では何らかのオブジェクトの `apply` メソッドを呼び出している。例えば、3行目は以下のように展開する:

    List.apply(1.0, 2.0)

つまり、これは `List` クラスのコンパニオンオブジェクトの `apply` メソッドを呼び出している。このメソッドは任意の数の引数を取り、それを使ってリストを構築する。Scala ライブラリの全てのコレクションクラスには、コンパニオンオブジェクトがあり、そのような `apply` メソッドを定義する。コレクションクラスが `List`、`Stream`、や `Vector` のような具象実装を表しているのか、`Seq`、`Set`、や `Traversable` のような抽象基底クラスを表しているのかは関係ない。後者の場合は、`apply` の呼び出しは抽象基底クラスの何らかのデフォルト実装を作成するだけのことだ。用例:

    scala> List(1, 2, 3)
    res17: List[Int] = List(1, 2, 3)
    scala> Traversable(1, 2, 3)
    res18: Traversable[Int] = List(1, 2, 3)
    scala> mutable.Traversable(1, 2, 3)
    res19: scala.collection.mutable.Traversable[Int] = ArrayBuffer(1, 2, 3)

`apply` とは別に、全てのコレクションのコンパニオンオブジェクトは、空のコレクションを返す `empty` を定義する。よって、`List()` の代わりに `List.empty` と書いたり、`Map()` の代わりに `Map.empty` と書くことができる。

`Seq` を継承するクラスは、コンパニオンオブジェクトにおいて他の factory 演算を提供する。以下の表にこれらの演算をまとめた。要約すると、

* `concat` は任意の数の traversable を連結する。
* `fill` と `tabulate` は単次元か任意の多次元の列を生成して、なんらかの式かテーブル化関数によりその列を初期化する。
* `range` は一定のステップ値で整数の列を生成する。
* `iterate` は開始要素に連続して関数を適用することによって得られる列を生成する。

### 列の factory 演算

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  `S.empty`         	    | 空の列。 |
|  `S(x, y, z)`      	    | 要素 `x`, `y`, `z` からなる列。 |
|  `S.concat(xs, ys, zs)`   | `xs`, `ys`, `zs` の要素を連結することによって得られる列。 |
|  `S.fill(n){e}`      	    | 全ての要素が式 `e` によって計算された長さ `n` の列。 |
|  `S.fill(m, n){e}`        | 全ての要素が式 `e` によって計算された `m × n` の大きさの列の列。(より高次元なものもある) |
|  `S.tabulate(n){f}`       | 添字 `i` の位置の要素が `f(i)` によって計算された長さ `n` の列。 |
|  `S.tabulate(m, n){f}`    | 添字 `(i, j)` の位置の要素が `f(i, j)` によって計算された `m×n` の大きさの列の列。(より高次元なものもある)|
|  `S.range(start, end)`    | `start` ... `end-1` の整数の列。 |
|  `S.range(start, end, step)`| `start` より始まり `end` 未満まで `step` づつ増加する整数の列。 |
|  `S.iterate(x, n)(f)`     | 要素 `x`、`f(x)`、`f(f(x))`、… からなる長さ `n` の列。 |
