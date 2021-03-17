---
layout: multipage-overview
title: 可変コレクションおよび不変コレクション
partof: collections
overview-name: Collections

num: 2

language: ja
---

Scala のコレクションは、体系的に可変および不変コレクションを区別している。**可変** (mutable) コレクションは上書きしたり拡張することができる。これは副作用としてコレクションの要素を変更、追加、または削除することができることを意味する。一方、**不変** (immutable) コレクションは変わることが無い。追加、削除、または更新を模倣した演算は提供されるが、全ての場合において演算は新しいコレクションを返し、古いコレクションは変わることがない。

コレクションクラスの全ては `scala.collection` パッケージもしくは `mutable`、`immutable`、`generic` のどれかのサブパッケージに定義されている。クライアントコードに必要なコレクションのクラスのほとんどには可変性に関して異なる特性を持つ 3つの形態が定義されており、それぞれ　`scala.collection`、`scala.collection.immutable`、か `scala.collection.mutable` のパッケージに存在する。

`scala.collection.immutable` パッケージのコレクションは、誰にとっても不変であることが保証されている。
そのようなコレクションは作成後には一切変更されることがない。したがって、異なる時点で何回同じコレクションの値にアクセスしても常に同じ要素を持つコレクションが得られることに依存できる。

`scala.collection.mutable` パッケージのコレクションは、コレクションを上書き変更する演算がある。
だから可変コレクションを扱うということは、どのコードが、何時どのコレクションを変更したのかということを理解する必要があることを意味する。

`scala.collection` パッケージのコレクションは、可変か不変かのどちらでもありうる。例えば [`collection.IndexedSeq[T]`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/IndexedSeq.html)
は、[`collection.immutable.IndexedSeq[T]`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/IndexedSeq.html) と [`collection.mutable.IndexedSeq[T]`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/mutable/IndexedSeq.html) 両方の親クラスだ。一般的に、`scala.collection`パッケージの基底コレクションは不変コレクションと同じインターフェイスを定義し、`scala.collection.mutable` パッケージ内の可変コレクションは、副作用を伴う変更演算を不変インターフェイスに加える。

基底コレクションと不変コレクションの違いは、不変なコレクションのクライアントは、他の誰もコレクションを変更しないという保証があるのに対し、基底コレクションのクライアントは自分ではコレクションを変更しなかったという約束しかできない。たとえ静的な型がコレクションを変更するような演算を提供していなくても、実行時の型は他のクライアントが手を加えることができる可変コレクションである可能性がある。

デフォルトでは Scala は常に不変コレクションを選ぶ。たとえば、`scala` パッケージのデフォルトのバインディングにより、なんの接頭辞や import もなくただ `Set` と書くと不変な集合 (set) が返ってき、`Iterable` と書くと不変で反復可能 (iterable)なコレクションが返ってくる。可変なデフォルト実装を取得するには、`collection.mutable.Set`
または `collection.mutable.Iterable` と明示的に記述する必要がある。

可変と不変の両方のバージョンのコレクションを使用する場合に便利な慣例は `collection.mutable` パッケージだけをインポートすることだ。

    import scala.collection.mutable

これにより、接頭辞なしの `Set` は不変なコレクションを参照するのに対し、`mutable.Set` は可変版を参照する。

コレクション階層内の最後のパッケージは `collection.generic` だ。
このパッケージには、コレクションを実装するための基本的なパーツが含まれている。
コレクションクラスがいくつかの演算を `generic` 内のクラスに委譲することはよくあるが、 フレームワークのユーザーが `generic` 内のクラスが必要になることは普通はありえない。

利便性と後方互換性のために、いくつかの重要な型は `scala` パッケージ内に別名を定義してあるため、インポート無しで単純な名前でコレクションを使うことができる。[`List`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/List.html) 型が良い例で、以下の名前でもアクセスすることができる

    scala.collection.immutable.List   // 定義元
    scala.List                        // scala パッケージのエイリアス経由
    List                              // scala._  パッケージは
                                      // 常に自動的にインポートされるため

エイリアスされているその他の型は次のとおり:
[`Traversable`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Traversable.html)、[`Iterable`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Iterable.html)、[`Seq`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Seq.html)、[`IndexedSeq`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/IndexedSeq.html)、[`Iterator`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/Iterator.html)、[`Stream`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Stream.html)、[`Vector`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Vector.html)、[`StringBuilder`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/mutable/StringBuilder.html)、[`Range`](https://www.scala-lang.org/api/{{ site.scala-212-version }}/scala/collection/immutable/Range.html)。

次の図は `scala.collection` パッケージ内の全てのコレクションを示す。
これらはすべて、高レベルの抽象クラスやトレイトで一般に可変と不変の両方の実装を持っている。

[![General collection hierarchy][1]][1]

次の図は `scala.collection.immutable` パッケージ内の全てのコレクションを示す。

[![Immutable collection hierarchy][2]][2]

そして、次の図は `scala.collection.mutable` パッケージ内の全てのコレクションを示す。

[![Mutable collection hierarchy][3]][3]

図の凡例:

[![Graph legend][4]][4]

## コレクションAPIの概要

最も重要なコレクションクラスは上の図に示されている。
これらの全てのクラスに共通な部分が沢山ある。
例えば、全てのコレクションは、クラス名を書いた後で要素を書くという統一された構文で作成することができる:

    Traversable(1, 2, 3)
    Iterable("x", "y", "z")
    Map("x" -> 24, "y" -> 25, "z" -> 26)
    Set(Color.red, Color.green, Color.blue)
    SortedSet("hello", "world")
    Buffer(x, y, z)
    IndexedSeq(1.0, 2.0)
    LinearSeq(a, b, c)

特定のコレクションの実装にもこの原則が適用される:

    List(1, 2, 3)
    HashMap("x" -> 24, "y" -> 25, "z" -> 26)

これらのコレクションは、`toString` を呼び出すと上の表記方法で表示される。

すべてのコレクションが `Traversable` によって提供される API をサポートするが、理にかなうところでは型を特殊化している。
たとえば、`Traversable` クラスの `map` メソッドは別の `Traversable` を戻り値として返すが、結果の型はサブクラスでオーバーライドされる。
たとえば、`List` が `map` を呼び出しても再び `List` が返ってき、`Set` が `map` を呼び出すと `Set` が返ってくる、という具合だ。

    scala> List(1, 2, 3) map (_ + 1)
    res0: List[Int] = List(2, 3, 4)
    scala> Set(1, 2, 3) map (_ * 2)
    res0: Set[Int] = Set(2, 4, 6)

コレクションライブラリ中のあらゆる所で実装されているこの振る舞いは**戻り値同型の原則** と呼ばれる。

コレクションの階層のクラスのほとんどは基底、不変、可変の3種類とも存在する。
唯一の例外は、可変コレクションにのみ存在する `Buffer` トレイトだ。

これより、これらのクラスを一つずつ見ていく。


  [1]: /resources/images/tour/collections-diagram.svg
  [2]: /resources/images/tour/collections-immutable-diagram.svg
  [3]: /resources/images/tour/collections-mutable-diagram.svg
  [4]: /resources/images/tour/collections-legend-diagram.svg
