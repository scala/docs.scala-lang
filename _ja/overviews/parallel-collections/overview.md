---
layout: multipage-overview
title: 概要

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 1
language: ja
---

**Aleksandar Prokopec, Heather Miller 著**<br>
**Eugene Yokota 訳**

## 動機

近年におけるプロセッサ製造業者のシングルコアからマルチコアへの移行のまっただ中で、産学ともに認めざるをえないのは「大衆的並列プログラミング」が大きな難題であり続けていることだ。

並列コレクション (parallel collection) は、並列プログラミングを容易にすることを目指して Scala 標準ライブラリに取り込まれた。
ユーザは低レベルな並列化に関する詳細を気にせず、親しみやすいコレクションという高レベルの抽象概念 (abstraction) を利用できる。
この概念が隠蔽する並列性によって、信頼性のある並列実行が開発者にとってより身近なものになると願っている。

アイディアは簡単だ -- コレクションはよく理解されており、よく使われているプログラミングの抽象概念だ。
さらに、その規則性により、コレクションは効率良く、ユーザが意識すること無く、並列化することができる。
ユーザが順次コレクション (sequential collection) を並列に計算するものに「置き換える」ことを可能にすることで、Scala の並列コレクションは、より多くのコードに並列性をもたらす方向に大きな一歩を踏み出したと言える。

例えば、大きなコレクションに対してモナディックな演算を行なっている逐次的 (sequential) な例をみてほしい:

    val list = (1 to 10000).toList
    list.map(_ + 42)

同じ演算を並列に実行するには、単に順次コレクションである `list` に対して `par` メソッドを呼び出すだけでいい。後は、順次コレクションを普通に使うのと同じように並列コレクションを利用できる。上記の例は以下のように並列化できる:

    list.par.map(_ + 42)

Scala の並列コレクションの設計は、2.8 で導入された Scala の（順次）コレクションライブラリに影響を受けており、またその一部となるように深く統合されている。
Scala の（順次）コレクションライブラリの重要なデータ構造の多くに対して対応する並列のコレクションを提供する:

* `ParArray`
* `ParVector`
* `mutable.ParHashMap`
* `mutable.ParHashSet`
* `immutable.ParHashMap`
* `immutable.ParHashSet`
* `ParRange`
* `ParTrieMap` (`collection.concurrent.TrieMap` は 2.10 より追加された)

Scala の並列コレクションライブラリは、順次ライブラリコレクションと共通のアーキテクチャを持つだけでなく、その**拡張性**も共有している。
つまり、普通の順次コレクションと同様に、ユーザは独自のコレクション型を統合して、標準ライブラリにある他の並列コレクションにあるものと同じ（並列の）演算を自動的に継承できる。

## 例をいくつか

並列コレクションの一般性と利便性を例示するために、いくつかの簡単な具体例を用いて説明しよう。全ての例において、ユーザが意識すること無く演算は並列に実行されている。

**注意:** 以下の例ではサイズの小さいコレクションを並列化しているが、これはあくまで説明のための例で、実用では推奨されない。
一般的な指標として、コレクションのサイズが数千要素など、サイズが大きいほど並列化による高速化が顕著であることが多い。（並列コレクションのサイズと性能に関する詳細に関しては、このガイドの[性能](performance.html)に関する節の[該当する項](performance.html)を参照してほしい）

#### map

並列 `map` を使って `String` のコレクションを大文字に変換する:

    scala> val lastNames = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    lastNames: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> lastNames.map(_.toUpperCase)
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(SMITH, JONES, FRANKENSTEIN, BACH, JACKSON, RODIN)

#### fold

`ParArray` の `fold` を使った合計:

    scala> val parArray = (1 to 10000).toArray.par
    parArray: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3, ...

    scala> parArray.fold(0)(_ + _)
    res0: Int = 50005000

#### filter

並列 `filter` を使ってラストネームがアルファベットの "J" 以降のから始まるものを選択する:

    scala> val lastNames = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    lastNames: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> lastNames.filter(_.head >= 'J')
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Jackson, Rodin)

## 並列コレクションの意味論

並列コレクションのインターフェイスは普通の順次コレクションと同じ感覚で使うことができるが、特に副作用を伴う演算と結合則が成立しない演算においては、演算の意味するものが異なることに注意する必要がある。

これを理解するためには、まず、演算が**どのように**並列実行されているのかをイメージする必要がある。
概念的には、Scala の並列コレクションフレームワークは、ある並列コレクションにおける演算を並列化するために、再帰的にコレクションを「分割」(split) し、並列にそれぞれの部分に演算を適用し、並列に完了した全ての結果を再び「合成」(combine) することで行う。

このような並列コレクションの並行 (concurrent) で、「アウト・オブ・オーダー」("out-of-order"、訳注: 記述された順序以外で演算が実行されること) な意味論から以下の二つの結果が導き出される:

1. **副作用を伴う演算は非決定性につながる可能性がある**

2. **結合則が成立しない演算は非決定性につながる可能性がある**

### 副作用を伴う演算

並列コレクションフレームワークの**並行**実行の意味論を考慮すると、計算の決定性 (determinism) を維持するためには、コレクションに対して副作用 (side-effect) を伴う演算は一般的に避けるべきだ。具体例としては、`foreach` のようなアクセスメソッドを用いる場合に、渡されるクロージャ中から外の `var` を増加することが挙げられる。

    scala> var sum = 0
    sum: Int = 0

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.foreach(sum += _); sum
    res01: Int = 467766

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res02: Int = 457073

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res03: Int = 468520

ここでは、`sum` が 0 に初期化されて、`list` に対して `foreach` が呼び出されるたびに `sum` が異なる値を持っていることが分かる。この非決定性の原因は**データ競合** (data race; 同一の可変変数に対する並行した読み書き) だ。

上の例だと、二つのスレッドが `sum` の**同じ**値を読み込んで、その `sum` の値に対して何らかの演算を実行した後で、`sum` に新しい値を書きこもうとするかもしれない。以下に示すように、その場合は、大切な結果の上書き（つまり、損失）が起きる可能性がある:

    ThreadA: sum の値を読み込む、sum = 0                sum の値: 0
    ThreadB: sum の値を読み込む、sum = 0                sum の値: 0
    ThreadA: sum を 760 増加する、sum = 760 を書き込む   sum の値: 760
    ThreadB: sum を 12 増加する、sum = 12 を書き込む     sum の値: 12

上の例は、どちらか一方のスレッドが `0` に各自の並列コレクションの担当部分からの要素を加算する前に、二つのスレッドが同じ値 `0` を読み込むシナリオを示している。この場合、`ThreadA` は `0` を読み込み、`0+760` を合計し、`ThreadB` も `0` に自分の要素を加算し、`0+12` となった。各自の合計を計算した後、それぞれが経験結果を `sum` に書き込む。`ThreadA` が `ThreadB` よりも先に書き込むが、直後に `ThreadB` がそれを上書きするため、実質 `760` という値が上書きされ、失われることになった。

### 結合則が成立しない演算

**「アウト・オブ・オーダー」**実行の意味論を考慮すると、非決定性を避けるためには、慎重に、結合則が成立する演算のみを実行するべきだ。つまり、並列コレクション `pcoll` に対して `pcoll.reduce(func)` のように高階関数を呼び出すとき、`func` が要素に適用される順序が任意でも大丈夫であるように気をつけるべきだということだ。単純で、かつ明快な結合則が成立しない演算の例は減算だ:

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.reduce(_-_)
    res01: Int = -228888

    scala> list.reduce(_-_)
    res02: Int = -61000

    scala> list.reduce(_-_)
    res03: Int = -331818

上の例では、`ParVector[Int]` の `reduce` メソッドが `_-_` と共に呼び出されている。
これは二つの不特定の要素を取り出し、前者から後者を引く。
並列コレクションフレームワークはスレッドを呼び出し、それぞれが実質的に、独自にコレクションから異なる部位を取り出し `reduce(_-_)` を実行するため、同じコレクションに `reduce(_-_)` を実行するたびに毎回異なった結果が得られることとなる。

**注意:** 結合則が成立しない演算と同様に、交換則が成立しない演算も並列コレクションの高階関数に渡されると非決定的な振る舞いをみせると思われがちだが、それは間違っている。単純な例としては、文字列の連結がある。結合則は成立するが、交換則は成立しない演算だ:

    scala> val strings = List("abc","def","ghi","jk","lmnop","qrs","tuv","wx","yz").par
    strings: scala.collection.parallel.immutable.ParSeq[java.lang.String] = ParVector(abc, def, ghi, jk, lmnop, qrs, tuv, wx, yz)

    scala> val alphabet = strings.reduce(_++_)
    alphabet: java.lang.String = abcdefghijklmnopqrstuvwxyz

並列コレクションにおける**「アウト・オブ・オーダー」**の意味論は、演算が（**時間的**な意味で、つまり非逐次的に）バラバラの順序で実行されるという意味であって、結果が（**空間的**に）バラバラに**「再合成」**されるという意味ではない。結果は、一般的に**順序どおり** (in-order) に再合成される。つまり、A、B、C の順番に分割された並列コレクションは、再び A、B、C の順番に再合成される。任意の B、C、A というような順序にはならない。

異なる並列コレクションの型における、分割と再合成の詳細ついてはこのガイドの[アーキテクチャ](architecture.html)の節を参照してほしい。
