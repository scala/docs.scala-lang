---
layout: multipage-overview
title: イテレータ

discourse: false

partof: collections
overview-name: Collections

num: 15

language: ja
---

イテレータ ([`Iterator`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html)) はコレクションではなく、コレクションから要素を1つづつアクセスするための方法だ。イテレータ `it` に対する基本的な演算として `next` と `hasNext` の2つがある。 `it.next()` を呼び出すことで、次の要素が返り、イテレータの内部状態が前進する。よって、同じイテレータに対して `next` を再び呼び出すと、前回返したものの次の要素が得られる。返す要素が無くなると、`next` の呼び出しは `NoSuchElementException` を発生させる。返す要素が残っているかは [`Iterator`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html) の `hasNext` メソッドを使って調べることができる。

イテレータ `it` が返す全ての要素を渡り歩くのに最も率直な方法は while ループを使うことだ:

    while (it.hasNext)
      println(it.next())

`Traversable`、`Iterable`、および `Seq` クラスのほとんどのメソッドに類似するものを Scala のイテレータは提供している。たとえば、与えられた手順をイテレータが返す全ての要素に対して実行する `foreach` メソッドを提供する。 `foreach` を使うことで、先ほどのループは以下のように短縮できる:

    it foreach println

例にならって、`foreach`、`map`、`withFilter`、および `flatMap` の代替構文として for 式を使うことができるので、イテレータが返す全ての要素を表示するもう一つの方法として以下のように書ける:

    for (elem <- it) println(elem)

イテレータの `foreach` メソッドと traversable の同メソッドには重大な違いがある。イテレータのそれを呼び出した場合、`foreach` はイテレータを終端に置いたままで終了するということだ。そのため、`next` を再び呼び出すと `NoSuchElementException` を発生して失敗する。それに比べ、コレクションに対して呼び出した場合、`foreach`
はコレクション内の要素の数を変更しない (渡された関数が要素を追加もしくは削除した場合は別の話だが、これは予想外の結果になることがあるので非推奨だ)。

`Iterator` と `Traversable` に共通の他の演算も同じ特性を持つ。例えば、イテレータは新たなイテレータを返す `map` メソッドを提供する:

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it.map(_.length)
    res1: Iterator[Int] = non-empty iterator
    scala> res1 foreach println
    1
    6
    2
    5
    scala> it.next()
    java.util.NoSuchElementException: next on empty iterator

上記の通り、`it.map` の呼び出しの後、イテレータ `it` は終端まで前進してしまっている。

次の具体例は、ある特性をもつイテレータ内の最初の要素を検索するのに使うことができる `dropWhile` だ。例えば、イテレータ内で二文字以上の最初の語句を検索するのに、このように書くことができる:

    scala> val it = Iterator("a", "number", "of", "words")
    it: Iterator[java.lang.String] = non-empty iterator
    scala> it dropWhile (_.length < 2)
    res4: Iterator[java.lang.String] = non-empty iterator
    scala> it.next()
    res5: java.lang.String = number

`dropWhile` を呼び出すことで `it` が変更された事に注意してほしい。イテレータは二番目の語句「number」を指している。実際に、`it` と `dropWhile` の返した戻り値である `res4` 同じ要素の列を返す。

同じイテレータを再利用するための標準演算が一つだけある。以下の

    val (it1, it2) = it.duplicate

への呼び出しはイテレータ `it` と全く同じ要素を返すイテレータを**2つ**返す。この2つのイテレータは独立して作動するため、片方を前進しても他方は影響を受けない。一方、元のイテレータ `it` は `duplicate` により終端まで前進したため、使いものにならない。

要約すると、イテレータは**メソッドを呼び出した後、絶対にアクセスしなければ**コレクションのように振る舞う。Scala
コレクションライブラリは、[`Traversable`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Traversable.html) と [`Iterator`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html) に共通の親クラスである [`TraversableOnce`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/TraversableOnce.html) を提供することで、明示的にこれを示す。名前が示す通り、 `TraversableOnce` は `foreach` を用いて一度だけ探索することができるが、探索後のそのオブジェクトの状態は指定されていない。`TraversableOnce` オブジェクトが `Iterator` ならば、探索後はその終端にあるし、もし `Traversable` ならば、そのオブジェクトは今まで通り存在する。 `TraversableOnce` のよく使われる事例としては、イテレータか `Traversable` を受け取ることができるメソッドの引数の型だ。その例として、 `Traversable` クラスの追加メソッド `++` がある。`TraversableOnce` パラメータを受け取るため、イテレータか `Traversable` なコレクションの要素を追加することができる。

イテレータの全演算は次の表にまとめられている。

### Iterator クラスの演算

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **抽象メソッド:**         |                                                                  |
|  `it.next()`      	    | イテレータの次の要素を返し、前進させる。 |
|  `it.hasNext`  	        | `it` が次の要素を返せる場合、`true` を返す。 |
|  **他のイテレータ:**        |						         |
|  `it.buffered`      	    | `it` が返す全ての要素を返すバッファ付きイテレータ。 |
|  `it grouped size`      	| `it` が返す要素を固定サイズの「かたまり」にして返すイテレータ。 |
|  `xs sliding size`      	| `it` が返す要素を固定サイズの「窓」をスライドさせて返すイテレータ。 |
|  **複製:**                |						         |
|  `it.duplicate`           | `it` が返す全ての要素を独立して返すイテレータのペア。 |
|  **加算:**                 |						         |
|  `it ++ jt`               | イテレータ `it` が返す全ての要素に続いてイテレータ `jt` の全ての要素を返すイテレータ。 |
|  `it padTo (len, x)`      | 全体で `len`個の要素が返るように、イテレータ `it` の全ての要素に続いて `x` を返すイテレータ。 |
|  **map 演算:**             |						         |
|  `it map f`               | `it` が返す全ての要素に関数 `f` を適用することによって得られるイテレータ。 |
|  `it flatMap f`           | `it` が返す全ての要素に対してイテレータ値を返す関数 `f` を適用し、その結果を連結したイテレータ。 |
|  `it collect f`           | `it` が返す全ての要素に対して部分関数 `f` が定義されている場合のみ適用し、その結果を集めたイテレータ。 |
|  **変換演算:**             |						         |
|  `it.toArray`             | `it` が返す要素を配列に集める。 |
|  `it.toList`              | `it` が返す要素をリストに集める。 |
|  `it.toIterable`          | `it` が返す要素を iterable に集める。 |
|  `it.toSeq`               | `it` が返す要素を列に集める。 |
|  `it.toIndexedSeq`        | `it` が返す要素を添字付き列に集める。 |
|  `it.toStream`            | `it` が返す要素をストリームに集める。 |
|  `it.toSet`               | `it` が返す要素を集合に集める。 |
|  `it.toMap`               | `it` が返すキー/値ペアをマップに集める。 |
|  **コピー演算:**            |						         |
|  `it copyToBuffer buf`    | `it` が返す要素をバッファ `buf` にコピーする。 |
|  `it copyToArray(arr, s, n)`| `it` が返す最大 `n` 個の要素を配列 `arr` の添字 `s` より始まる位置にコピーする。最後の2つの引数は省略可能だ。 |
|  **サイズ演算:**            |						         |
|  `it.isEmpty`             | イテレータが空であるかどうかを調べる (`hasNext` の逆)。 |
|  `it.nonEmpty`            | イテレータに要素が含まれているかを調べる (`hasNext` の別名)。 |
|  `it.size`                | `it` が返す要素の数。注意: この演算の後、`it` は終端まで前進する! |
|  `it.length`              | `it.size` に同じ。 |
|  `it.hasDefiniteSize`     | `it` が有限数の要素を返すことが明らかな場合 true を返す (デフォルトでは `isEmpty` に同じ)。 |
|  **要素取得演算・添字検索演算:**|						         |
|  `it find p`              | `it` が返す要素の中で条件関数 `p` を満たす最初の要素のオプション値、または条件を満たす要素が無い場合 `None`。注意: イテレータは探しだされた要素の次の要素、それが無い場合は終端まで前進する。 |
|  `it indexOf x`           | `it` が返す要素の中で `x` と等しい最初の要素の添字。注意: イテレータはこの要素の次の位置まで前進する。 |
|  `it indexWhere p`        | `it` が返す要素の中で条件関数 `p` を満たす最初の要素の添字、注意: イテレータはこの要素の次の位置まで前進する。 |
|  **部分イテレータ演算:**     |						         |
|  `it take n`              | `it` が返す最初の `n`個の要素を返すイテレータ。注意: `it` は、`n`個目の要素の次の位置、または`n`個以下の要素を含む場合は終端まで前進する。 |
|  `it drop n`              | `it` の `(n+1)`番目の要素から始まるイテレータ。注意: `it` も同じ位置まで前進する。|
|  `it slice (m,n)`         | `it` が返す要素の内、`m`番目から始まり `n`番目の一つ前で終わる切片を返すイテレータ。 |
|  `it takeWhile p`         | `it` が返す要素を最初から次々とみて、条件関数 `p` を満たす限り返していったイテレータ。 |
|  `it dropWhile p`         | `it` が返す要素を最初から次々とみて、条件関数 `p` を満たす限り飛ばしていき、残りを返すイテレータ。 |
|  `it filter p`            | `it` が返すの要素で条件関数 `p` を満たすものを返すイテレータ。 |
|  `it withFilter p`        | `it filter p` に同じ。イテレータが for 式で使えるように用意されている。 |
|  `it filterNot p`         |`it` が返すの要素で条件関数 `p` を満たさないものを返すイテレータ。 |
|  **分割演算:**             |						         |
|  `it partition p`         | `it` を2つのイテレータから成るペアに分割する。片方のイテレータは `it` が返す要素のうち条件関数 `p` を満たすものを返し、もう一方は `it` が返す要素のうち `p` を満たさないものを返す。 |
|  **要素条件演算:**          |						         |
|  `it forall p`            | `it` が返す全ての要素に条件関数 `p` が当てはまるかを示す boolean 値。 |
|  `it exists p`            | `it` が返す要素の中に条件関数 `p` を満たすものがあるかどうかを示す boolean 値。 |
|  `it count p`             | `it` が返す要素の中にで条件関数 `p` 満たすものの数。 |
|  **fold 演算:**            |						         |
|  `(z /: it)(op)`          | `z` から始めて、左から右へと `it` が返す隣接する要素に二項演算 `op`  を次々と適用したもの。 |
|  `(it :\ z)(op)`          | `z` から始めて、右から左へと `it` が返す隣接する要素に二項演算 `op` を次々と適用したもの。 |
|  `it.foldLeft(z)(op)`     | `(z /: it)(op)` に同じ。 |
|  `it.foldRight(z)(op)`    | `(it :\ z)(op)` に同じ。 |
|  `it reduceLeft op`       | 左から右へと、空ではないイテレータ `it` が返す隣接する要素に二項演算 `op` を次々と適用したもの。 |
|  `it reduceRight op`      | 右から左へと、空ではないイテレータ `it` が返す隣接する要素に二項演算 `op` を次々と適用したもの。 |
|  **特定 fold 演算:**       |						         |
|  `it.sum`                 | イテレータ `it` が返す数値要素の値の和。 |
|  `it.product`             | イテレータ `it` が返す数値要素の値の積。 |
|  `it.min`                 | イテレータ `it` が返す順序付けされたの値の最小値。 |
|  `it.max`                 | イテレータ `it` が返す順序付けされたの値の最大値。 |
|  **zip 演算:**             |						         |
|  `it zip jt`              | イテレータ `it` と `jt` が返す要素から対応したものペアにして返すイテレータ。 |
|  `it zipAll (jt, x, y)`   | イテレータ `it` と `jt` が返す要素から対応したものペアにして返すイテレータで、もし片方が短い場合は `x` か `y` を使って長いほうに合わせる。 |
|  `it.zipWithIndex`        | `it` が返す要素とその添字をペアにしたイテレータ。 |
|  **更新演算:**              |						         |
|  `it patch (i, jt, r)`    | `it` の、`i` から始まる `r`個の要素をパッチイテレータ `ji` が返す要素に置換したイテレータ。 |
|  **比較演算:**             |						         |
|  `it sameElements jt`     | イテレータ `it` と `jt` が同じ要素を同じ順序で返すかを調べる。注意: この演算の後、`it` の `jt` 少なくともどちらか一方は終端まで前進している。 |
|  **文字列演算:**            |						         |
|  `it addString (b, start, sep, end)`| `it` が返す要素を `sep` で区切った後、`start` と `end` で挟んだ文字列を　`StringBuilder` `b` に追加する。 `start`、`sep`、`end` は全て省略可能。 |
|  `it mkString (start, sep, end)` | `it` が返す要素を `sep` で区切った後、`start` と `end` で挟んだ文字列に変換する。 `start`、`sep`、`end` は全て省略可能。 |

### バッファ付きイテレータ

イテレータを前進させずに次に返る要素を検査できるような「先読み」できるイテレータが必要になることがたまにある。例えば、一連の文字列を返すイテレータがあるとして、その最初の空白文字列を飛ばすという作業を考える。以下のように書こうと思うかもしれない。

    def skipEmptyWordsNOT(it: Iterator[String]) =
      while (it.next().isEmpty) {}

しかし、このコードを慎重に見ると間違っていることが分かるはずだ。コードは確かに先頭の空白文字列の続きを読み飛ばすが、`it` は最初の非空白文字列も追い越してしまっているのだ。

この問題はバッファ付きイテレータを使うことで解決できる。[`BufferedIterator`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/BufferedIterator.html) トレイトは、`head` というメソッドを追加で提供する [`Iterator`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterator.html) の子トレイトだ。バッファ付きイテレータに対して `head` を呼び出すことで、イテレータを前進させずに最初の要素を返すことができる。バッファ付きイテレータを使うと、空白文字列を読み飛ばすのは以下のように書ける。

    def skipEmptyWords(it: BufferedIterator[String]) =
      while (it.head.isEmpty) { it.next() }

`buffered` メソッドを呼ぶことで全てのイテレータはバッファ付きイテレータに変換できる。次に具体例で説明する:

    scala> val it = Iterator(1, 2, 3, 4)
    it: Iterator[Int] = non-empty iterator
    scala> val bit = it.buffered
    bit: java.lang.Object with scala.collection.
      BufferedIterator[Int] = non-empty iterator
    scala> bit.head
    res10: Int = 1
    scala> bit.next()
    res11: Int = 1
    scala> bit.next()
    res11: Int = 2

バッファ付きイテレータに対して `head` を呼び出してもイテレータ `bit` は前進しないことに注意してほしい。よって、後続の `bit.next()` の呼び出しは `bit.head` と同じ値を返す。
