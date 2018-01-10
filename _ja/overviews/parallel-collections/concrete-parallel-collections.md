---
layout: multipage-overview
title: 具象並列コレクションクラス

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 2
language: ja
---

## 並列配列

並列配列 ([`ParArray`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/mutable/ParArray.html)) は、線形で連続的な要素の配列を保持する列だ。
そのため、内部の配列を変更することで効率的な要素の読み込みや更新ができるようになる。
また、要素の走査も非常に効率的だ。
並列配列は、サイズが一定であるという意味で配列と似ている。

    scala> val pa = scala.collection.parallel.mutable.ParArray.tabulate(1000)(x => 2 * x + 1)
    pa: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 3, 5, 7, 9, 11, 13,...

    scala> pa reduce (_ + _)
    res0: Int = 1000000

    scala> pa map (x => (x - 1) / 2)
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(0, 1, 2, 3, 4, 5, 6, 7,...

内部的には、並列配列の[「スプリッタ」 (splitter)](architecture.html) の分割は走査用の添字を更新した二つの新たなスプリッタを作る事に結局なる。
[「コンバイナ」 (combiner)](architecture.html) はより複雑だ。多くの変換メソッドの多く（例えば、`flatMap`、`filter`、`takeWhile` など）は、事前に結果の要素数（そのため、配列のサイズ）が分からないため、それぞれのコンバイナはならし定数時間 (amortized constant time) の
 `+=` 演算を持つ配列バッファの変種だ。
異なるプロセッサがそれぞれの並列配列コンバイナに要素を追加し、後で内部の配列を連結することで合成が行われる。
要素の総数が分かった後になってから、内部の配列が割り当てられ、並列に書き込まれる。そのため、変換メソッドは読み込みメソッドに比べて少し高価だ。また、最後の配列の割り当ては JVM上で逐次的に実行されるため、map 演算そのものが非常に安価な場合は、配列の割り当てが逐次的ボトルネックとなりうる。

`seq` メソッドを呼び出すことで並列配列はその順次版である `ArraySeq` に変換される。
`ArraySeq` は元の並列配列の内部構造と同じ配列を内部で使うためこの変換は効率的だ。

## 並列ベクトル

並列ベクトル ([`ParVector`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParVector.html))
は、低い定数係数の対数時間で読み込みと書き込みを行う不変列だ。

    scala> val pv = scala.collection.parallel.immutable.ParVector.tabulate(1000)(x => x)
    pv: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,...

    scala> pv filter (_ % 2 == 0)
    res0: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 2, 4, 6, 8, 10, 12, 14, 16, 18,...

不変ベクトルは 32分木として表されるため、スプリッタはそれぞれのサブツリーをスプリッタに割り当てることで分割される。
現行のコンバイナの実装はベクトルとして要素を保持し、遅延評価で要素をコピーすることで合成する。
このため、変換メソッドは並列配列のそれに比べてスケーラビリティが低い。
ベクトルの連結が将来の Scala リリースで提供されるようになれば、コンバイナは連結を用いて合成できるようになり、変換メソッドはより効率的になる。

並列ベクトルは、順次[ベクトル](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Vector.html)の並列版で、定数時間で一方から他方へと変換できる。

## 並列範囲

並列範囲 ([`ParRange`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParRange.html))
は、順序付けされた等間隔の要素の列だ。
並列範囲は、逐次版の [Range](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Range.html) と同様に作成される:

    scala> 1 to 3 par
    res0: scala.collection.parallel.immutable.ParRange = ParRange(1, 2, 3)

    scala> 15 to 5 by -2 par
    res1: scala.collection.parallel.immutable.ParRange = ParRange(15, 13, 11, 9, 7, 5)

順次範囲にビルダが無いのと同様に、並列範囲にはコンバイナが無い。
並列範囲に対する `map` 演算は並列ベクトルを生成する。
順次範囲と並列範囲は、一方から他方へと効率的に `seq` と `par` メソッドを用いて変換できる。

## 並列ハッシュテーブル

並列ハッシュテーブルは要素を内部の配列に格納し、各要素のハッシュコードにより格納する位置を決定する。
並列可変ハッシュ集合 (
[mutable.ParHashSet](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/mutable/ParHashSet.html))
と並列可変ハッシュマップ ([mutable.ParHashMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/mutable/ParHashMap.html))
はハッシュテーブルに基づいている。

    scala> val phs = scala.collection.parallel.mutable.ParHashSet(1 until 2000: _*)
    phs: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(18, 327, 736, 1045, 773, 1082,...

    scala> phs map (x => x * x)
    res0: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(2181529, 2446096, 99225, 2585664,...

並列ハッシュテーブルのコンバイナは、要素をハッシュコードの最初の文字に応じてバケットに振り分ける。
これらは単にバケットを連結することで合成される。
最終的なハッシュテーブルが構築されると（つまりコンバイナの `result` メソッドが呼ばれると）、
内部の配列が割り当てられ、異なるバケットからハッシュテーブル配列の別々の連続したセグメントへ並列して要素が書き込まれる。

順次ハッシュマップとハッシュ集合は `par` メソッドを用いて並列のものに変換できる。
並列ハッシュテーブルは、その内部ではいくつかの区分に分けて要素を保持しているが、それぞれの要素数を管理するサイズマップを必要とする。
そのため、順次ハッシュテーブルが並列テーブルに最初に変換されるときにはサイズマップが作成されなければいけない。
ここで発生するテーブルの走査により最初の `par` の呼び出しはハッシュテーブルのサイズに対して線形の時間がかかる。
それ以降のハッシュテーブルの変更はサイズマップの状態も更新するため、以降の `par` や `seq` を用いた変換は定数時間で実行される。
サイズマップの更新は `useSizeMap` メソッドを用いることで開始したり、中止したりできる。
重要なのは、順次ハッシュテーブルの変更は並列ハッシュテーブルにも影響があり、またその逆も真であることだ。

## 並列ハッシュトライ

並列ハッシュトライは、不変集合と不変マップを効率的に表す不変ハッシュトライの並列版だ。
これらは、[immutable.ParHashSet](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParHashSet.html) クラスと
[immutable.ParHashMap](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/immutable/ParHashMap.html) クラスにより提供される。

    scala> val phs = scala.collection.parallel.immutable.ParHashSet(1 until 1000: _*)
    phs: scala.collection.parallel.immutable.ParHashSet[Int] = ParSet(645, 892, 69, 809, 629, 365, 138, 760, 101, 479,...

    scala> phs map { x => x * x } sum
    res0: Int = 332833500

並列ハッシュテーブル同様に、並列ハッシュトライのコンバイナは事前に要素をバケットにソートしておき、それぞれのバケットを別のプロセッサに割り当て、それぞれがサブトライを構築することで、結果のハッシュトライを並列に構築する。

並列ハッシュトライは `seq` と `par` メソッドを用いることで順次ハッシュトライと定数時間で相互に変換できる。

## 並列並行トライ

[concurrent.TrieMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/concurrent/TrieMap.html)
は、複数のスレッドから同時にアクセスできる (concurrent thread-safe) マップだが、
[mutable.ParTrieMap](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/mutable/ParTrieMap.html)
は、その並列版だ。
並列データ構造の多くは、走査時にデータ構造が変更された場合に一貫性のある走査を保証しないが、並行トライは更新が次回の走査まで見えないことを保証する。
つまり以下の 1 から 99 の数の平方根を出力する例のように、並行トライを走査中に変更できるようになる:

    scala> val numbers = scala.collection.parallel.mutable.ParTrieMap((1 until 100) zip (1 until 100): _*) map { case (k, v) => (k.toDouble, v.toDouble) }
    numbers: scala.collection.parallel.mutable.ParTrieMap[Double,Double] = ParTrieMap(0.0 -> 0.0, 42.0 -> 42.0, 70.0 -> 70.0, 2.0 -> 2.0,...

    scala> while (numbers.nonEmpty) {
         |   numbers foreach { case (num, sqrt) =>
         |     val nsqrt = 0.5 * (sqrt + num / sqrt)
         |     numbers(num) = nsqrt
         |     if (math.abs(nsqrt - sqrt) < 0.01) {
         |       println(num, nsqrt)
         |       numbers.remove(num)
         |     }
         |   }
         | }
    (1.0,1.0)
    (2.0,1.4142156862745097)
    (7.0,2.64576704419029)
    (4.0,2.0000000929222947)
    ...

コンバイナは、内部的には `TrieMap` として実装されている。
これは、並行なデータ構造であるため、変換メソッドの呼び出しに対して全体で一つのコンバイナのみが作成され、全てのプロセッサによって共有される。
他の並列可変コレクションと同様に、`TrieMap` とその並列版である `ParTrieMap` は `seq` と `par` メソッドにより取得でき、これらは同じ内部構造にデータを格納してあるため一方で行われた変更は他方にも影響がある。変換は定数時間で行われる。

## 性能特性

列型の性能特性:

|               | head   | tail     | apply  | 更新    | 先頭に<br>追加 | 最後に<br>追加 | 挿入 |
| --------      | ------ | -------- | ------ | ------ | --------- | -------- | ---- |
| `ParArray`    | 定数    | 線形     | 定数    | 定数    |  線形     | 線形      | 線形  |
| `ParVector`   | 実質定数 | 実質定数 | 実質定数 | 実質定数 | 実質定数  | 実質定数   | -    |
| `ParRange`    | 定数    | 定数     | 定数    | -       |  -       | -        | -    |

集合とマップ型の性能特性:

|                          | 検索    | 追加    | 削除    |
| --------                 | ------ | ------- | ------ |
| **不変**                  |        |         |        |
| `ParHashSet`/`ParHashMap`| 実質定数 | 実質定数 | 実質定数 |
| **可変**                  |        |         |        |
| `ParHashSet`/`ParHashMap`| 定数    | 定数     | 定数    |
| `ParTrieMap`             | 実質定数 | 実質定数 | 実質定数 |
