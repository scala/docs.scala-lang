---
layout: multipage-overview
title: 列トレイト Seq、IndexedSeq、および LinearSeq

discourse: false

partof: collections
overview-name: Collections

num: 5

language: ja
---

列 ([`Seq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Seq.html)) トレイトは、長さ (`length`) があり、それぞれの要素に `0` から数えられた固定された添字 (index) がある `Iterable` の一種だ。

以下の表にまとめられた列の演算は以下のカテゴリーに分けることができる:

* **添字と長さの演算** `apply`、 `isDefinedAt`、 `length`、 `indices`、および `lengthCompare`。`Seq` では `apply` メソッドは添字の意味で使われるため、`Seq[T]`型の列は `Int` を引数 (添字) としてをとり、`T`型の要素を返す部分関数だ。つまり、`Seq[T]` は `PartialFunction[Int, T]` を継承する。列内の要素はゼロから列の長さ (`length`) − 1 まで添字付けられている。列の `length` メソッドは一般コレクションにおける `size` メソッドの別名だ。`lengthCompare` メソッドは、たとえどちらかの列が無限の長さを持っていても、二つの列の長さを比較することができる。
* **添字検索演算**である `indexOf`、 `lastIndexOf`、 `indexOfSlice`、 `lastIndexOfSlice`、 `indexWhere`、 `lastIndexWhere`、 `segmentLength`、 `prefixLength` は、渡された値もしくは条件関数に合致する要素の添字を返す。
* **加算**である `+:`、`:+`、`padTo` は、列の先頭か最後に要素を追加した新しい列を返す。
* **更新演算**である `updated`、`patch` は、元の列に何らかの要素を上書きした列を返す。
* **並べ替え演算**である `sorted`、`sortWith`、`sortBy` は、列内の要素を何らかの基準に基づいて並べ替える。
* **逆転演算**である `reverse`、`reverseIterator`、`reverseMap` は、列内の要素を逆順に返すか処理する。
* **比較演算**である `startsWith`、 `endsWith`、 `contains`、 `containsSlice`、 `corresponds` は、二つの列を関連付けるか、列の中から要素を検索する。
* **集合演算**である `intersect`、 `diff`、 `union`、 `distinct` は、二つの列間で集合演算のようなものを行うか、列内の要素の重複を削除する。

列が可変の場合は、追加で副作用のある `update` メソッドを提供し、列内の要素を上書きすることができる。
Scala の他の構文の例にならって、`seq(idx) = elem` は `seq.update(idx, elem)` の略記法であるため、`update` によって便利な代入構文がただで手に入る。`update` と `updated` の違いに注意してほしい。 `update` は列内の要素を上書きし、可変列でのみ使用可能だ。
`updated` は全ての列で使用可能であり、元の列は変更せずに常に新しい列を返す。

### Seq トレイトの演算

| 使用例                     | 振る舞い                                        |
| ------                    | ------                                         |
|  **添字と長さの演算:**      |                                                |
|  `xs(i)`                  |(展開した場合、`xs apply i`)。`xs` の添字 `i` の位置の要素。|
|  `xs isDefinedAt i`       |`xs.indices` に `i` が含まれているか調べる。        |
|  `xs.length`              |列の長さ (`size` と同様)。                         |
|  `xs.lengthCompare ys`    |`xs` が `ys` より短い場合は `-1`、長い場合は `+1`、同じ長さの場合は `0` を返す。いずれかの列が無限でも正常に作動する。|
|  `xs.indices`             |0 から `xs.length - 1` までの `xs` の添字の範囲。   |
|  **添字検索演算:**          |                                                |
|  `xs indexOf x`           |`xs`内で `x` と等しい最初の要素の添字 (数種の別形がある)。|
|  `xs lastIndexOf x`       |`xs`内で `x` と等しい最後の要素の添字 (数種の別形がある)。|
|  `xs indexOfSlice ys`     |`xs` の添字で、それと後続の要素が、列 `ys` と同値になる最初のもの。|
|  `xs lastIndexOfSlice ys` |`xs` の添字で、それと後続の要素が、列 `ys` と同値になる最後のもの。|
|  `xs indexWhere p`        |`xs`内で条件関数 `p` を満たす最初の要素の添字 (数種の別形がある)。|
|  `xs segmentLength (p, i)`|全ての要素が途切れなく条件関数 `p` を満たし、`xs(i)` から始まる、最長の `xs` の切片の長さ。|
|  `xs prefixLength p`      |全ての要素が途切れなく条件関数 `p` を満たす、最長の `xs` の先頭切片の長さ。|
|  **加算:**                 |                                                |
|  `x +: xs`                |`xs` の要素の先頭に `x` を追加した、新しい列。        |
|  `xs :+ x`                |`xs` の要素の最後に `x` を追加した、新しい列。        |
|  `xs padTo (len, x)`      |`xs` の長さが `len` になるまで最後に値 `x` を追加していった列。|
|  **更新演算:**             |                                                |
|  `xs patch (i, ys, r)`    |`xs`内の、`i` から始まる `r`個の要素をパッチ `ys`内の要素と置換した列。|
|  `xs updated (i, x)`      |`xs`の添字 `i` の要素を `x` に置換したコピー。       |
|  `xs(i) = x`              |(展開した場合、`xs.update(i, x)`、ただし可変列でのみ使用可能)。`xs`の添字 `i` の位置の要素を `x` と上書きする。|
|  **並べ替え演算:**          |                                                |
|  `xs.sorted`              |`xs` の要素型の標準的な順序付けを用いて、`xs` の要素を並べ替えることによって得られる新しい列。|
|  `xs sortWith lt`         |比較関数 `lt` 用いて `xs` の要素を並べ替えることによって得られる新しい列。|
|  `xs sortBy f`            |`xs` の要素を並べ替えることによって得られる新しい列。二つの要素の比較は、両者を関数 `f` に適用してその結果を比較することによって行われる。|
|  **逆転演算:**             |                                                |
|  `xs.reverse`             |`xs`内の要素を逆順にした列。                       |
|  `xs.reverseIterator`     |`xs`内の全ての要素を逆順に返すイテレータ。            |
|  `xs reverseMap f`        |`xs`内の要素に逆順に関数 `f` を `map` して得られる列。|
|  **比較演算:**             |                                                |
|  `xs startsWith ys`       |`xs` が列 `ys` から始まるかを調べる (数種の別形がある)。|
|  `xs endsWith ys`         |`xs` が列 `ys` で終わるかを調べる (数種の別形がある)。|
|  `xs contains x`          |`xs` が `x` と等しい要素を含むかを調べる。            |
|  `xs containsSlice ys`    |`xs` が `ys` と等しい連続した切片を含むかを調べる。    |
|  `(xs corresponds ys)(p)` |`xs` と `ys` の対応した要素が、二項条件関数の `p` を満たすかを調べる。|
|  **集合演算:**             |                                                |
|  `xs intersect ys`        |列 `xs` と `ys` の積集合で、`xs` における要素の順序を保ったもの。|
|  `xs diff ys`             |列 `xs` と `ys` の差集合で、`xs` における要素の順序を保ったもの。|
|  `xs union ys`            |和集合; `xs ++ ys` に同じ|
|  `xs.distinct`            |`xs` の部分列で要素の重複を一切含まないもの。         |

[`Seq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Seq.html) トレイトには [`LinearSeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/IndexedSeq.html) と [`IndexedSeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/IndexedSeq.html)
という二つの子トレイトがある。
これらは新しい演算を定義しないが、それぞれ異なった性能特性をもつ。
線形列 (linear sequence) は効率的な `head` と `tail` 演算を持ち、一方添字付き列 (indexed sequence) は効率的な`apply`、`length`、および (可変の場合) `update` 演算を持つ。
よく使われる線形列の例に `scala.collection.immutable.List` と `scala.collection.immutable.Stream` がある。よく使われる添字付き列の例としては `scala.Array` と `scala.collection.mutable.ArrayBuffer` がある。
`Vector` は添字付き列と線形列の間の興味深い折衷案だ。
事実上定数時間のオーバーヘッドで添字アクセスと線形アクセスを提供するからだ。
そのため、ベクトルは添字アクセスと線形アクセスの両方を混合して使用しているアクセスパターンにおける良い基盤となる。
ベクトルに関しては、また[後ほど詳しくみていく](concrete-immutable-collection-classes.html)。

### バッファ ###

可変列に分類されるものの中で重要なものに `Buffer` がある。バッファは既存の要素を上書きできるだけでなく、要素を挿入したり、削除したり、効率的にバッファの最後に新しい要素を追加したりできる。バッファがサポートする新しいメソッドの中で主要なものは、要素を最後に追加する `+=` と `++=`、先頭に追加する `+=:` と `++=:`、要素を挿入する `insert` と `insertAll`、そして要素を削除する `remove` と `-=` だ。以下の表にこれらの演算をまとめた。

よく使われるバッファの実装に `ListBuffer` と `ArrayBuffer` がある。名前が示すとおり、`ListBuffer` は `List` に支えられており、要素を効率的に `List` に変換できる。一方、`ArrayBuffer` は配列に支えられており、これも素早く配列に変換できる。

#### Buffer クラスの演算 ####

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **加算:**                |                                                                  |
|  `buf += x`              |バッファの最後に要素 `x` を追加し、`buf` 自身を戻り値として返す。|
|  `buf += (x, y, z)`      |渡された要素をバッファの最後に追加する。|
|  `buf ++= xs`            |`xs`内の全ての要素をバッファの最後に追加する。|
|  `x +=: buf`             |バッファの先頭に要素 `x` を追加する。|
|  `xs ++=: buf`           |`xs`内の全ての要素をバッファの先頭に追加する。|
|  `buf insert (i, x)`     |バッファの添字 `i` の位置に要素 `x` を挿入する。|
|  `buf insertAll (i, xs)` |`xs`内の全ての要素をバッファの添字 `i` の位置に挿入する。|
|  **減算:**                |                                                                  |
|  `buf -= x`              |バッファから要素 `x` を削除する。|
|  `buf remove i`          |バッファの添字 `i` の位置の要素を削除する。|
|  `buf remove (i, n)`     |バッファの添字 `i` の位置から始まる `n`個の要素を削除する。|
|  `buf trimStart n`       |バッファの先頭の要素 `n`個を削除する。|
|  `buf trimEnd n`         |バッファの最後の要素 `n`個を削除する。|
|  `buf.clear()`           |バッファの全ての要素を削除する。|
|  **クローン演算:**         |                                                                  |
|  `buf.clone`             |`buf` と同じ要素を持った新しいバッファ。|
