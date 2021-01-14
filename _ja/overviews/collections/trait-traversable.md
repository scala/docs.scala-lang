---
layout: multipage-overview
title: Traversable トレイト
partof: collections
overview-name: Collections

num: 3

language: ja
---

走査可能 ([`Traversable`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Traversable.html))トレイトはコレクション階層の最上位に位置する。訳注: 木構造などでノードを一つづつ走査することを traverse と言う。また、-able で終わるトレイトは名詞としても使われるため、「走査可能なもの」という意味だ。 `Traversable` の抽象的な演算は `foreach` のみだ:

    def foreach[U](f: Elem => U)

`Traversable` を実装するコレクションクラスは、このメソッドを定義するだけでいい。逆に言うと、その他全てのメソッドは `Traversable` から継承することができる。

`foreach` メソッドは、コレクション中の全ての要素を走査して、渡された演算 `f` を各々の要素に適用することを意図している。
この演算の型は `Elem => U` であり、`Elem` はコレクションの要素の型で、`U` は任意の戻り値型だ。 `f` の呼び出しはそれに伴う副作用のためだけに行われ、`f` の戻り値の全ては `foreach` によって破棄される。

`Traversable` が定義する全ての具象メソッド (concrete method) を次の表に列挙した。これらのメソッドは次のカテゴリに分類される:

* **加算**である `++` は、2つの `Traversable` を連結するか、あるイテレータが返す全ての要素を `Traversable` に追加する。
* **map 演算**である`map`、`flatMap`、及び `collect` はコレクションの要素に何らかの関数を適用して新しいコレクションを生成する。
* **変換演算**である `toArray`、`toList`、`toIterable`、`toSeq`、`toIndexedSeq`、`toStream`、`toSet`、`toMap` は `Traversable` なコレクションを別のより特定のものに変える。実行時のコレクション型が既に要求されているコレクション型と一致する場合、これらの全ての変換は引数をそのまま返す。例えば、リストに `toList` を適用した場合、リストそのものを返す。
* **コピー演算** `copyToBuffer` と `copyToArray`。名前のとおり、これらの演算はコレクションの要素をバッファまたは配列にコピーする。
* **サイズ演算** `isEmpty`、`nonEmpty`、`size`、および `hasDefiniteSize`。 `Traversable` なコレクションは有限または無限のサイズを取りうる。無限の `Traversable` コレクションの例としては自然数のストリームである `Stream.from(0)` がある。
`hasDefiniteSize` メソッドはコレクションが無限である可能性があるかを示す。`hasDefiniteSize` が `true` を返す場合、コレクションは確実に有限だ。`false` を返す場合、コレクションはまだ完全に展開されていないことを示し、それは無限か有限のどちらである可能性もある。
* **要素取得演算** `head`、`last`、`headOption`、`lastOption`、および `find`。これらはコレクションの最初または最後の要素、または他の条件に一致する最初の要素を選択する。しかし、全てのコレクションにおいて「最初」と「最後」の意味が明確に定義されているわけではないことに注意してほしい。たとえば、ハッシュ集合はハッシュキーの並びで要素を格納するかもしれないが、ハッシュキーは実行するたびに変わる可能性がある。その場合、ハッシュ集合の「最初」の要素はプログラムを実行するたびに異なるかもしれない。
あるコレクションから常に同じ順序で要素を得られる場合、そのコレクションは**順序付け** (ordered) されているという。
ほとんどのコレクションは順序付けされているが、(ハッシュ集合など)いくつかののコレクションは順序付けされていない ―
順序付けを省くことで多少効率が上がるのだ。順序付けは再現性のあるテストを書くのに不可欠であり、デバッグの役に立つ。
そのため Scala のコレクションは、全てのコレクション型に対して順序付けされた選択肢を用意してある。
例えば、`HashSet` に代わる順序付けされたものは `LinkedHashSet` だ。
* **サブコレクション取得演算** `tail`、`init`、`slice`、`take`、`drop`、`takeWhile`、`dropWhile`、`filter`、`filterNot`、`withFilter`。
これら全ての演算は添字の範囲や何らかの条件関数によって識別されたサブコレクションを返す。
* **分割演算**である `splitAt`、`span`、`partition`、`groupBy` の全てはコレクションの要素をいくつかのサブコレクションに分割する。
* **要素条件演算**である`exists`、`forall`、`count` は与えられた条件関数を使ってコレクションをテストする。
* **fold 演算**である `foldLeft`、`foldRight`、`/:`、`:\`、`reduceLeft`、`reduceRight` は次々と二項演算を隣接する要素に適用していく。
* **特定 fold 演算**である `sum`、`product`、`min`、`max` は特定の型(numeric か comparable)のコレクションでのみ動作する。
* **文字列演算**である `mkString`、`addString`、`stringPrefix` はコレクションを文字列に変換する方法を提供する。
* **ビュー演算**はオーバーロードされた二つの `view` メソッドによって構成される。
  ビューは遅延評価されたコレクションだ。ビューについての詳細は[後ほど](views.html)。

### Traversableトレイトの演算

| 使用例                     | 振る舞い                                        |
| ------                    | ------                                         |
|  **抽象メソッド:**          |                                                |
|  `xs foreach f`           |`xs` 内の全ての要素に対して関数 `f` を実行する。      |
|  **加算:**                 |                                                |
|  `xs ++ ys`               |`xs` と `ys` の両方の要素から成るコレクション。 `ys` は [`TraversableOnce`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/TraversableOnce.html) なコレクション、つまり [`Traversable`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Traversable.html) または [`Iterator`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Iterator.html) だ。|
|  **map 演算:**             |                                                |
|  `xs map f`               |`xs` 内の全ての要素に関数 `f` を適用することによって得られるコレクション。|
|  `xs flatMap f`           |`xs` 内の全ての要素に対してコレクション値を返す関数 `f` を適用し、その結果を連結したコレクション。|
|  `xs collect f`           |`xs` 内の全ての要素に対して部分関数 `f` が定義されている場合のみ適用し、その結果を集めたコレクション。|
|  **変換演算:**             |                                                |
|  `xs.toArray`             |コレクションを配列に変換する。                      |
|  `xs.toList`              |コレクションをリストに変換する。                    |
|  `xs.toIterable`          |コレクションを `Iterable` に変換する。              |
|  `xs.toSeq`               |コレクションを列に変換する。                        |
|  `xs.toIndexedSeq`        |コレクションを添字付き列に変換する。                 |
|  `xs.toStream`            |コレクションを遅延評価されたストリームに変換する。     |
|  `xs.toSet`               |コレクションを集合に変換する。                      |
|  `xs.toMap`               |キー/値のペアを持つコレクションをマップに変換する。コレクションが要素としてのペアを持たない場合、この演算を呼び出すと静的型エラーがおこる。|
|  **コピー演算:**           |                                                |
|  `xs copyToBuffer buf`    |コレクション内の全ての要素をバッファ `buf` にコピーする。|
|  `xs copyToArray(arr, s, n)`|最大 `n` 個のコレクションの要素を配列 `arr` の添字 `s` より始まる位置にコピーする。最後の2つの引数は省略可能だ。|
|  **サイズ演算:**           |                                                |
|  `xs.isEmpty`             |コレクションが空であるかどうかを調べる。             |
|  `xs.nonEmpty`            |コレクションに要素が含まれているかを調べる。          |
|  `xs.size`                |コレクション内の要素の数。                          |
|  `xs.hasDefiniteSize`     |`xs` が有限のサイズであることが明らかな場合 true を返す。|
|  **要素取得演算:**          |                                                |
|  `xs.head`                |コレクションの最初の要素 (順序が定義されていない場合は、任意の要素)。|
|  `xs.headOption`          |`xs` の最初の要素のオプション値、または `xs` が空の場合 `None`。|
|  `xs.last`                |コレクションの最後の要素 (順序が定義されていない場合は、任意の要素)。|
|  `xs.lastOption`          |`xs` の最後の要素のオプション値、または `xs` が空の場合 `None`。|
|  `xs find p`              |`xs` の中で条件関数 `p` を満たす最初の要素のオプション値、または条件を満たす要素が無い場合 `None`。|
|  **サブコレクション取得演算:**  |                                             |
|  `xs.tail`                |コレクションから `xs.head` を除いた残りの部分。      |
|  `xs.init`                |コレクションから `xs.last` を除いた残りの部分。      |
|  `xs slice (from, to)`    |`xs` の一部の添字範囲内 (`from` 以上 `to` 未満) にある要素から成るコレクション。 |
|  `xs take n`              |`xs` の最初の `n` 個の要素から成るコレクション (順序が定義されていない場合は、任意の `n` 個の要素から成るコレクション)。|
|  `xs drop n`              |コレクションから `xs take n` を除いた残りの部分。    |
|  `xs takeWhile p`         |`xs` 内の要素を最初から次々とみて、条件関数 `p` を満たす限りつないでいったコレクション。|
|  `xs dropWhile p`         |`xs` 内の要素を最初から次々とみて、条件関数 `p`を満たす限り除いていったコレクション。|
|  `xs filter p`            |`xs` 内の要素で条件関数 `p` を満たすものから成るコレクション。|
|  `xs withFilter p`        |このコレクションを非正格 (non-strict) に filter したもの。後続の `map`, `flatMap`, `foreach`, および `withFilter` への呼び出しは `xs` の要素のうち条件関数 `p` が true に評価されるもののみに適用される。|
|  `xs filterNot p`         |`xs` 内の要素で条件関数 `p` を満たさないものから成るコレクション。|
|  **分割演算:**             |                                                |
|  `xs splitAt n`           |`xs` を `n` の位置で二分して `(xs take n, xs drop n)` と同値のコレクションのペアを返す。|
|  `xs span p`              |`xs` を条件関数 `p` に応じて二分して `(xs takeWhile p, xs.dropWhile p)` と同値のペアを返す。|
|  `xs partition p`         |`xs` を条件関数 `p` を満たすコレクションと満たさないものに二分して `(xs filter p, xs.filterNot p)` と同値のペアを返す。|
|  `xs groupBy f`           |`xs` を判別関数 `f` に応じてコレクションのマップに分割する。|
|  **要素条件演算:**         |                                                |
|  `xs forall p`            |`xs` 内の全ての要素に条件関数 `p` が当てはまるかを示す Boolean 値。|
|  `xs exists p`            |`xs` 内に条件関数 `p` を満たす要素があるかどうかを示す Boolean 値。|
|  `xs count p`             |`xs` 内の要素で条件関数 `p` を満たすものの数。|
|  **fold 演算:**           |                                                |
|  `(z /: xs)(op)`          |`z` から始めて、左から右へと `xs` 内の隣接する要素に二項演算 `op` を次々と適用したもの。|
|  `(xs :\ z)(op)`          |`z` から始めて、右から左へと `xs` 内の隣接する要素に二項演算 `op` を次々と適用したもの。|
|  `xs.foldLeft(z)(op)`     |`(z /: xs)(op)` に同じ。                         |
|  `xs.foldRight(z)(op)`    |`(xs :\ z)(op)` に同じ。                         |
|  `xs reduceLeft op`       |左から右へと空ではないコレクション `xs` 内の隣接する要素に二項演算 `op` を次々と適用したもの。|
|  `xs reduceRight op`      |右から左へと空ではないコレクション `xs` 内の隣接する要素に二項演算 `op` を次々と適用したもの。|
|  **特定 fold 演算:**       |                                                |
|  `xs.sum`                 |コレクション `xs` 内の数値要素の値の和。             |
|  `xs.product`             |コレクション `xs` 内の数値要素の値の積。             |
|  `xs.min`                 |コレクション `xs` 内の順序付けされたの値の最小値。    |
|  `xs.max`                 |コレクション `xs` 内の順序付けされたの値の最大値。    |
|  **文字列演算:**           |                                                |
|  `xs addString (b, start, sep, end)`|`xs` 内の要素を `sep` で区切った後、`start` と `end` で挟んだ文字列を　`StringBuilder b` に追加する。 `start`, `sep`, `end` は全て省略可能。|
|  `xs mkString (start, sep, end)`|`xs` 内の要素を `sep` で区切った後、`start` と `end` で挟んだ文字列に変換する。 `start`, `sep`, `end` は全て省略可能。|
|  `xs.stringPrefix`        |`xs.toString` で返される文字列の先頭にあるコレクション名。|
|  **ビュー演算:**           |                                                |
|  `xs.view`                |`xs` に対するビューを生成する。                    |
|  `xs view (from, to)`     |`xs` の一部の添字範囲内を表すビューを生成する。      |
