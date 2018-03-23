---
layout: multipage-overview
title: Iterable トレイト

discourse: false

partof: collections
overview-name: Collections

num: 4

language: ja
---

反復可能 ([`Iterable`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Iterable.html) トレイトはコレクション階層の上から2番目に位置する。このトレイトの全メソッドは、コレクション内の要素を1つずつ返す抽象メソッド `iterator` に基づいている。`Iterable` では、`Traversable` トレイトの `foreach` メソッドも `iterator`に基づいて実装されている。以下が実際の実装だ:

    def foreach[U](f: Elem => U): Unit = {
      val it = iterator
      while (it.hasNext) f(it.next())
    }

多くの `Iterable` のサブクラスは、より効率的な実装を提供するため、上の `foreach` の標準実装をオーバーライドしている。 `foreach` は `Traversable` の全ての演算の基となっているため、効率的であることが重要なのだ。

`Iterable` にはイテレータを返すもう2つのメソッドがある: `grouped` と `sliding` だ。これらのイテレータは単一の要素を返すのではなく、元のコレクションの部分列を返す。これらのメソッドに渡された引数がこの部分列の最大サイズとなる。`grouped` メソッドは要素を n 個づつの「かたまり」にして返すのに対し、 `sliding` は n 個の要素から成る「窓」をスライドさせて返す。この二つのメソッドの違いは REPL でのやりとりを見れば明らかになるはずだ。:

    scala> val xs = List(1, 2, 3, 4, 5)
    xs: List[Int] = List(1, 2, 3, 4, 5)
    scala> val git = xs grouped 3
    git: Iterator[List[Int]] = non-empty iterator
    scala> git.next()
    res3: List[Int] = List(1, 2, 3)
    scala> git.next()
    res4: List[Int] = List(4, 5)
    scala> val sit = xs sliding 3
    sit: Iterator[List[Int]] = non-empty iterator
    scala> sit.next()
    res5: List[Int] = List(1, 2, 3)
    scala> sit.next()
    res6: List[Int] = List(2, 3, 4)
    scala> sit.next()
    res7: List[Int] = List(3, 4, 5)

`Iterable` トレイトは、 `Traversable` からのメソッドの他に、イテレータがあることで効率的に実装することができる他のメソッドを追加する。それらのメソッドを以下の表にまとめる。

### Iterable トレイトの演算

| 使用例                     | 振る舞い                                        |
| ------                    | ------                                        |
|  **抽象メソッド:**          |                                                |
|  `xs.iterator`            |`xs`内の全ての要素を `foreach` が走査するのと同じ順序で返すイテレータ。|
|  **他のイテレータ:**     　　|                                               |
|  `xs grouped size`        |このコレクション内の要素を固定サイズの「かたまり」にして返すイテレータ。|
|  `xs sliding size`        |このコレクション内の要素を固定サイズの「窓」をスライドさせて返すイテレータ。|
|  **サブコレクション取得演算:**　|                           |
|  `xs takeRight n`         |`xs` の最後の `n` 個の要素から成るコレクション (順序が定義されていない場合は、任意の `n` 個の要素から成るコレクション)。|
|  `xs dropRight n`         |コレクションから `xs` `takeRight` `n` を除いた残りの部分。|
|  **zip 演算:**             |                                               |
|  `xs zip ys`              |`xs` と `ys` のそれぞれから対応する要素をペアにした　`Iterable`。|
|  `xs zipAll (ys, x, y)`   |`xs` と `ys` のそれぞれから対応する要素をペアにした `Iterable` で、もし片方が短い場合は `x` か `y` を使って長いほうに合わせる。|
|  `xs.zipWithIndex`        |`xs`内の要素とその添字をペアにした `Iterable`。|
|  **比較演算:**        　　  |                                               |
|  `xs sameElements ys`     |`xs` と `ys` が同じ要素を同じ順序で格納しているかを調べる。|

継承階層では `Iterable` 直下に [`Seq`](https://www.scala-lang.org/api/current/scala/collection/Seq.html)、[`Set`](https://www.scala-lang.org/api/current/scala/collection/Set.html)、[`Map`](https://www.scala-lang.org/api/current/scala/collection/Map.html) という三つのトレイトがある。
この三つのトレイトに共通することは `apply` メソッドと `isDefinedAt` メソッドを持ったトレイト [`
PartialFunction`](https://www.scala-lang.org/api/current/scala/PartialFunction.html) を実装しているということだ。
しかし、`PartialFunction` の実装方法は三者三様である。

列は `apply` を位置的な添字として用いられており、要素は常に `0`
から数えられる。だから、`Seq(1, 2, 3)(1)` は `2` を返す。
集合では `apply` は所属を調べるのに用いられる。
例えば、`Set('a', 'b', 'c')('b')` は `true` を返し、`Set()('a')` は `false` を返す。
最後に、マップでは `apply` は要素の選択に用いられている。
例えば、`Map('a' -> 1, 'b' -> 10, 'c' -> 100)('b')` は `10` を返す。

次に、この3つのコレクションをより詳しく説明しよう。
