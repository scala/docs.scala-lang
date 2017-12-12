---
layout: multipage-overview
title: カスタム並列コレクションの作成

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 6
language: ja
---

## コンバイナを持たない並列コレクション

ビルダ無しでもカスタム順次コレクションを定義できるように、コンバイナ無しで並列コレクションを定義することが可能だ。
コンバイナを持たなければ、（例えば `map`、`flatMap`、`collect`、`filter`、などの）変換メソッドはデフォルトでは、継承関係で一番近い標準コレクションの型を返すことになる。
例えば、範囲はビルダを持たないため、その要素を写像 (`map`) するとベクトルが作られる。

以下に具体例として、並列の文字列コレクションを定義する。
文字列は論理的には不変列なので、並列文字列は `immutable.ParSeq[Char]` を継承することにする:

    class ParString(val str: String)
    extends immutable.ParSeq[Char] {

次に、全ての不変列にあるメソッドを定義する:

      def apply(i: Int) = str.charAt(i)

      def length = str.length

この並列コレクションの直列版も定義しなければならない。
ここでは `WrappedString` クラスを返す:

      def seq = new collection.immutable.WrappedString(str)

最後に、この並列文字列コレクションのスプリッタを定義しなければならない。
このスプリッタは `ParStringSplitter` と名づけ、列スプリッタの `SeqSplitter[Char]` を継承することにする:

      def splitter = new ParStringSplitter(str, 0, str.length)

      class ParStringSplitter(private var s: String, private var i: Int, private val ntl: Int)
      extends SeqSplitter[Char] {

        final def hasNext = i < ntl

        final def next = {
          val r = s.charAt(i)
          i += 1
          r
        }

上のコードでは、`ntl` は文字列の長さの合計、`i` は現在の位置、`s` は文字列自身を表す。

並列コレクションのイテレータ（別名スプリッタ）は、順次コレクションのイテレータにある `next` と `hasNext` の他にもいくつかのメソッドを必要とする。
第一に、スプリッタがまだ走査していない要素の数を返す `remaining` というメソッドがある。
次に、現在のスプリッタを複製する `dup` というメソッドがある。

        def remaining = ntl - i

        def dup = new ParStringSplitter(s, i, ntl)

最後に、現在のスプリッタの要素の部分集合を走査する別のスプリッタを作成するのに使われる `split` と `psplit` メソッドがある。
`split` メソッドは、現在のスプリッタが操作する要素の、交わらなく (disjoint) 、空でもない、部分集合の列を返すことを約束する。
現在のスプリッタが一つ以下の要素を持つ場合、`split` は自分自身だけが入った列を返す。
`psplit` メソッドは、`sizes` パラメータが指定する数どおりの要素を走査するスプリッタの列を返す。
もし `sizes` パラメータが現在のスプリッタよりも少ない要素を指定した場合は、残りの要素は追加のスプリッタに入れられ、それは列の最後に追加される。もし `sizes` パラメータが今ある要素よりも多くの要素を必要とした場合は、それぞれのサイズに空のスプリッタを追加して補う。
また、`split` か `psplit` のどちらかを呼び出しても現在のスプリッタを無効化する。

        def split = {
          val rem = remaining
          if (rem >= 2) psplit(rem / 2, rem - rem / 2)
          else Seq(this)
        }

        def psplit(sizes: Int*): Seq[ParStringSplitter] = {
          val splitted = new ArrayBuffer[ParStringSplitter]
          for (sz <- sizes) {
            val next = (i + sz) min ntl
            splitted += new ParStringSplitter(s, i, next)
            i = next
          }
          if (remaining > 0) splitted += new ParStringSplitter(s, i, ntl)
          splitted
        }
      }
    }

上のコードでは、`split` は `psplit` に基づいて実装されているが、これは並列の列ではよくあることだ。
並列マップ、集合、`Iterable` のスプリッタを実装する方が `psplit` を必要としないため簡単であることが多い。

これで、並列文字列クラスができた。唯一の短所は `filter` のような変換メソッドを呼び出すと並列文字列の代わりに並列ベクトルが返ってくる点だ。
フィルタをかけた後でベクトルから文字列を再び生成するのは高価であるかもしれず、これは望ましいとは言えない。

## コンバイナを持つ並列コレクション

例えばコンマを除外するなどして、並列文字列内の文字を `filter` したいとする。
前述のとおり、`filter` の呼び出しは並列ベクトルを返すが、（API のインターフェイスによっては並列文字列が必要なため）どうしても並列文字列が欲しい。

これを回避するには並列文字列コレクションのコンバイナを書かなくてはならない。
今度は `ParSeq[Char]` の代わりに `ParSeqLike` を継承することで `filter` の戻り値の型がより特定のものであることを保証する（`ParSeq[Char]` ではなく、`ParString` を返す）。
（二つの型パラメータを取る順次 `*Like` トレイト群とは異なり）`ParSeqLike` は第三の型パラメータを取り、これは並列コレクションに対応する順次版の型を指定する。

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString]

前に定義したメソッドはそのまま使えるが、`filter` の内部で使われる protected なメソッドである `newCombiner` を追加する。

      protected[this] override def newCombiner: Combiner[Char, ParString] = new ParStringCombiner

次に `ParStringCombiner` クラスを実装する。
コンバイナは ビルダのサブタイプだが `combine` というメソッドを導入する。
`combine` メソッドは、別のコンバイナを引数に取り現在のコンバイナと引数のコンバイナの両方の要素を含んだ新しいコンバイナを返す。
`combine` を呼び出すと、現在のコンバイナと引数のコンバイナは無効化される。
もし引数が現在のコンバイナと同じオブジェクトである場合は、`combine` は現在のコンバイナを返す。
このメソッドは並列計算の中で複数回呼び出されるので、最悪でも要素数に対して対数時間で実行するなど、効率的であることが期待されている。

`ParStringCombiner` は内部に `StringBuilder` の列を管理することにする。
これで列の最後の `StringBuilder` に要素を追加することで `+=` を実装し、現在のコンバイナと引数のコンバイナの `StringBuilder` のリストを連結することで `combine` を実装できるようになる。
並列計算の最後に呼び出される `result` メソッドは、全ての `StringBuilder` を追加することで並列文字列を生成する。
これにより、要素のコピーは、毎回 `combine` を呼ぶたびに行われるのではなく、最後に一度だけ行われる。
理想的には、この処理を並列化してコピーも並列に実行したい（並列配列ではそうなっている）が、文字列の内部表現にまで踏み込まない限りはこれが限界だ。そのため、この逐次的ボトルネックを受け入れなければいけない。

    private class ParStringCombiner extends Combiner[Char, ParString] {
      var sz = 0
      val chunks = new ArrayBuffer[StringBuilder] += new StringBuilder
      var lastc = chunks.last

      def size: Int = sz

      def +=(elem: Char): this.type = {
        lastc += elem
        sz += 1
        this
      }

      def clear = {
        chunks.clear
        chunks += new StringBuilder
        lastc = chunks.last
        sz = 0
      }

      def result: ParString = {
        val rsb = new StringBuilder
        for (sb <- chunks) rsb.append(sb)
        new ParString(rsb.toString)
      }

      def combine[U <: Char, NewTo >: ParString](other: Combiner[U, NewTo]) = if (other eq this) this else {
        val that = other.asInstanceOf[ParStringCombiner]
        sz += that.sz
        chunks ++= that.chunks
        lastc = chunks.last
        this
      }
    }


## どうやってコンバイナを実装すればいい？

これには定義済みのレシピは無い。
扱っているデータ構造に依存するし、実装者による創意工夫が必要なことも多い。
しかし、通常用いられれるいくつかの方法がある:

<ol>
<li>連結とマージ。
これらの演算に対して効率的な（通常、対数時間の）実装を持つデータ構造がある。
もし、扱っているコレクションがそのようなデータ構造を用いてるならば、コレクションそのものをコンバイナとして使える。
フィンガーツリー、ロープ、そしてヒープの多くが特にこの方法に向いている。</li>
<li>二段階評価。
並列配列と並列ハッシュテーブルで用いられてる方法で、要素が効率良く連結可能なバケットに部分ソート可能で、バケットから最終的なデータ構造が並列に構築可能なことを前提とする。
まず、第一段階では別々のプロセッサが独立して要素をバケットに書き込んでいき、最後にバケットが連結される。
第二段階では、データ構造が割り当てられ、別々のプロセッサがそれぞれデータ構造の異なる部分に交わらないバケットから要素を書き込んでいく。
異なるプロセッサが絶対にデータ構造の同じ部分を変更しないように注意しないと、微妙な並行エラーが発生する可能性がある。
前の節で示したように、この方法はランダムアクセス可能な列にも応用できる。</li>
<li>並行データ構造 (concurrent data structure)。
上の二つの方法はデータ構造そのものには同期機構を必要としないが、二つの異なるプロセッサが絶対に同じメモリの位置を更新しないような方法で並行して構築可能であることを前提とする。
並行スキップリスト、並行ハッシュテーブル、split-ordered list、並行AVLツリーなど、複数のプロセッサから安全に更新することが可能な並行データ構造が数多く存在する。
考慮すべき重要な点は、並行データ構造は水平にスケーラブルな挿入方法を持っていることだ。
並行な並列コレクションは、コンバイナはコレクション自身であることが可能で、単一のコンバイナのインスタンスを並列演算を実行する全てのプロセッサによって共有できる。</li>
</ol>

## コレクションフレームワークとの統合

`ParString` はまだ完成していない。
`filter`、`partition`、`takeWhile`、や `span` などのメソッドで使われるカスタムのコンバイナを実装したが、ほとんどの変換メソッドは暗黙の `CanBuildFrom` のエビデンスを必要とする（完全な説明に関しては、Scala コレクションのガイドを参照）。
これを提供して `ParString` をコレクションフレームワークの一部として完全に統合するには、`GenericParTemplate` というもう一つのトレイトをミックスインして `ParString` のコンパニオンオブジェクトを定義する必要がある。

    class ParString(val str: String)
    extends immutable.ParSeq[Char]
       with GenericParTemplate[Char, ParString]
       with ParSeqLike[Char, ParString, collection.immutable.WrappedString] {

      def companion = ParString

コンパニオンオブジェクトの中で `CanBuildFrom` パラメータのための暗黙の値を提供する。

    object ParString {
      implicit def canBuildFrom: CanCombineFrom[ParString, Char, ParString] =
        new CanCombinerFrom[ParString, Char, ParString] {
          def apply(from: ParString) = newCombiner
          def apply() = newCombiner
        }

      def newBuilder: Combiner[Char, ParString] = newCombiner

      def newCombiner: Combiner[Char, ParString] = new ParStringCombiner

      def apply(elems: Char*): ParString = {
        val cb = newCombiner
        cb ++= elems
        cb.result
      }
    }

## 更なるカスタム化 -- 並行とその他のコレクション

並行コレクションの実装は一筋縄ではいかない（並列コレクションと違って、並行コレクションは `collection.concurrent.TriMap` のように並行して更新可能なもの）。
コンバイナは特に頭をひねるところだ。
これまで見てきた多くの**並列** (parallel) コレクションでは、コンバイナは二段階評価を行った。
第一段階では、異なるプロセッサによって要素はコンバイナに加えられ、コンバイナは一つに組み合わされる。
第二段階で、全ての要素がそろった時点で結果のコレクションが構築される。

コンバイナのもう一つの方法としては、結果と成るコレクションを要素を使って構築してしまう方法がある。
これは、そのコレクションがスレッドセーフであることを必要とし、コンバイナは**並行** (concurrent) な要素の挿入を可能とする必要がある。
この場合、単一のコンバイナが全てのプロセッサにより共有される。

並行コレクションを並列化するには、コンバイナは `canBeShared` メソッドをオーバーライドして `true` を返す必要がある。
これで並列演算が呼び出される時に単一のコンバイナのみが作成されることが保証される。
次に `+=` メソッドがスレッドセーフである必要がある。
最後に `combine` メソッドは現在のコンバイナと引数のコンバイナが同一である場合は現在のコンバイナを返す必要があるが、それ以外の場合は例外を投げてもいい。

スプリッタは負荷分散のために小さいスプリッタへと分割される。
デフォルトでは、`remaining` メソッドで得られる情報によってスプリッタの分割をいつ止めるか決定する。
コレクションによっては `remaining` の呼び出しは高価で、スプリッタの分割を決定するのに他の方法を使ったほうが望ましい場合もある。
その場合は、スプリッタの `shouldSplitFurther` メソッドをオーバーライドする。

デフォルトの実装では、残りの要素数がコレクションのサイズを並列度の8倍で割った数より多い場合に分割される。

    def shouldSplitFurther[S](coll: ParIterable[S], parallelismLevel: Int) =
      remaining > thresholdFromSize(coll.size, parallelismLevel)

同値の実装として、スプリッタに何回分割されたかを格納するカウンタを持たせ、分割回数が `3 + log(parallelismLevel)` よりも多い場合だけ `shouldSplitFurther` が `true` を返すようにできるが、これは `remaining` の呼び出しを回避する。

さらに、ある特定のコレクションに対して `remaining` を呼び出すのが安価な演算ではない場合（つまり、コレクション内の要素数を求めなければいけない場合）、スプリッタの `isRemainingCheap` メソッドをオーバーライドして `false` を返すべきだ。

最後に、スプリッタの `remaining` メソッドの実装が非常に厄介な場合は、コレクションの `isStrictSplitterCollection` メソッドをオーバーライドして `false` を返すことができる。そのようなコレクションは、スプリッタが厳格である（つまり、`remaining` メソッドが正しい値を返す）ことが必要であるメソッドが失敗するようになる。大切なのは、これは for-展開で使われるメソッドには影響しないことだ。
