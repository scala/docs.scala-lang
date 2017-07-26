---
layout: multipage-overview
title: 並列コレクションライブラリのアーキテクチャ

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 5
language: ja
---

通常の順次コレクションライブラリと同様に、Scala の並列コレクションライブラリは異なる並列コレクションの型に共通して存在する多くのコレクション演算を含む。
これも順次コレクションで使われた手法だが、並列コレクションライブラリはほとんどの演算をいくつかある並列コレクション「テンプレート」の中で一度だけ実装することでコードの重複を回避することを目指している。これらの「テンプレート」は多くの異なる並列コレクションの実装により柔軟に継承されている。

この方法の利点はより簡略化された**メンテナンス性**と**拡張性**にある。
メンテナンスに着目すると、並列コレクションの演算がそれぞれ単一の実装を持ち、全ての並列コレクションによって継承されることで、メンテナンスはより簡単にそして強固になる。なぜなら、バグフィクスはいちいち実装を重複させずに、クラスの継承を通して伝搬するからだ。
同じ理由で、ライブラリ全体が拡張しやすくなる。新たなコレクションのクラスはその演算の大部分を単に継承すればいいからだ。

## 中心概念

前述の「テンプレート」となるトレイト群は、ほとんどの並列演算をスプリッタ (`Splitter`) とコンバイナ (`Combiner`) という二つの中心概念に基づいて実装する。

### スプリッタ

その名前が示すように、スプリッタ (`Splitter`) の役割は並列コレクションを何らかの有意な方法で要素を分割することだ。
基本的な考えとしては、コレクションを小さい部分にどんどん分割していき、逐次的に処理できるまで小さくしていくことだ。

    trait Splitter[T] extends Iterator[T] {
      def split: Seq[Splitter[T]]
    }

興味深いことに、`Splitter` は `Iterator` として実装されているため（`Iterator` の標準メソッドである `next` や `hasNext` を継承している）、フレームワークはスプリッタを分割だけではなく並列コレクションの走査にも利用できる。
この「分割イテレータ」の特徴は、`split` メソッドが `this`（`Iterator` の一種である `Splitter`）を分割して、並列コレクション全体の要素に関する**交わりを持たない** (disjoint) の部分集合を走査する別の `Splitter` を生成することだ。
通常のイテレータ同様に、`Splitter` は一度 `split` を呼び出すと無効になる。

一般的には、コレクションは `Splitter` を用いてだいたい同じサイズの部分集合に分割される。
特に並列列などにおいて、任意のサイズの区分が必要な場合は、より正確な分割メソッドである `psplit` を実装する `PreceiseSplitter` という `Splitter` のサブタイプが用いられる。

### コンバイナ

コンバイナ (`Combiner`) は、Scala の順次コレクションライブラリのビルダ (`Builder`) をより一般化したものだと考えることができる。
それぞれの順次コレクションが `Builder` を提供するように、それぞれの並列コレクションは各自 `Combiner` を提供する。

順次コレクションの場合は、`Builder` に要素を追加して、`result` メソッドを呼び出すことでコレクションを生成することができた。
並列コレクションの場合は、`Combiner` は `combine` と呼ばれるメソッドを持ち、これは別の `Combiner` を受け取り両方の要素の和集合を含む新たな `Combiner` を生成する。`combine` が呼び出されると、両方の `Combiner` とも無効化される。

    trait Combiner[Elem, To] extends Builder[Elem, To] {
      def combine(other: Combiner[Elem, To]): Combiner[Elem, To]
    }

上のコードで、二つの型パラメータ `Elem` と `To` はそれぞれ要素型と戻り値のコレクションの型を表す。

**注意:** `c1 eq c2` が `true` である二つの `Combiner` （つまり、同一の `Combiner` という意味だ）があるとき、`c1.combine(c2)` は常に何もせずに呼ばれた側の `Combiner` である `c1` を返す。

## 継承関係

Scala の並列コレクションは、Scala の（順次）コレクションライブラリの設計から多大な影響を受けている。
以下に示すよう、トレイト群は通常のコレクションフレームワーク内のトレイト群を鏡写しのように対応している。

[<img src="{{ site.baseurl }}/resources/images/parallel-collections-hierarchy.png" width="550">]({{ site.baseurl }}/resources/images/parallel-collections-hierarchy.png)

<center><b>Scala のコレクションと並列コレクションライブラリの継承関係</b></center>
<br/>

並列コレクションが順次コレクションに緊密に統合することで、順次コレクションと並列コレクションの単純な置換えが可能となることを目標としている。

順次か並列かのどちらでもありうる（`par` と `seq` を呼び出すことで並列コレクションと順次コレクションを切り替えられるような）コレクションへの参照を持つためには、両方のコレクション型に共通するスーパー型の存在が必要となる。
これが、上の図に出てくる `GenTraversable`、`GenIterable`、`GenSeq`、`GenMap`、`GenSet` という「一般」(general) トレイト群で、これらは順番通り (in-order) の走査も、逐次的 (one-at-a-time) な走査も保証しない。
対応する順次トレイトや並列トレイトはこれらを継承する。
例えば、`ParSeq` と `Seq` は両方とも一般列 `GenSeq` のサブタイプだが、お互いは継承関係に無い。

順次コレクションと並列コレクションの継承関係に関するより詳しい議論は、このテクニカルリポートを参照してほしい。 \[[1][1]\]

## 参照

1. [On a Generic Parallel Collection Framework, Aleksandar Prokopec, Phil Bawgell, Tiark Rompf, Martin Odersky, June 2011][1]

[1]: http://infoscience.epfl.ch/record/165523/files/techrep.pdf "flawed-benchmark"
