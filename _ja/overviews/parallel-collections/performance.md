---
layout: multipage-overview
title: 性能の測定

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 8
outof: 8
language: ja
---

## JVM における性能

JVM における性能モデルは論評こそは色々あるが、それに巻き込まれて結局よく理解されてないと言える。
様々な理由から、あるコードは期待されているよりも性能が悪かったり、スケーラブルではなかったりする。
以下にいくつかの理由をみていく。

一つは JVM 上のアプリケーションのコンパイル工程が静的にコンパイルされた言語のそれとは同じではないということが挙げられる（\[[2][2]\] 参照）。
Java と Scala のコンパイラはソースコードを JVM バイトコードに変換するだけで、最適化はほとんど行わない。
現代的な JVM の多くではプログラムのバイトコードが実行されると、それは実行しているマシンのコンピュータアーキテクチャのマシンコードに変換する。
これはジャストインタイムコンパイラ (just-in-time compiler、JITコンパイラ) と呼ばれる。
しかし、JITコンパイラは速度を優先するため、最適化のレベルは低いといえる。
再コンパイルを避けるため、いわゆる HotSpot コンパイラは頻繁に実行される部分だけを最適化する。
これがベンチマーク作者へ及ぼす影響は、プログラムを実行するたびにそれらが異なる性能を持つことだ。
（例えば、ある特定のメソッドのような）同じコードを同じ JVM インスタンス上で複数回実行したとしても、そのコードが間に最適化された場合は全く異なる性能を示す可能性がある。
さらに、コードのある部分の実行時間を測定することは JITコンパイラが最適化を実行している時間を含む可能性があり、一貫性に欠ける結果となることもある。

JVM において隠れて実行されるものの一つに自動メモリ管理がある。
ときどきプログラムの実行が停止され、ガベージコレクタが実行されるのだ。
もしベンチマーク測定されるプログラムがヒープメモリを少しでも使ったならば（ほとんどの JVM プログラムは使用する）、ガベージコレクタが実行されなければならず、測定を歪めることになる。測定するプログラムを多くの回数実行することでガベージコレクションも何回も発生させガベージコレクションの影響を償却 (amortize) する必要がある。

性能劣化の原因の一つとして、ジェネリックなメソッドにプリミティブ型を渡すことによって暗黙に発生するボクシングとアンボクシングが挙げられる。
実行時にプリミティブ型は、ジェネリックな型パラメータに渡せるように、それらを表すオブジェクトに変換される。
これは余計なメモリ割り当てを発生させ、遅い上に、ヒープにはいらないゴミができる。

並列的な性能に関して言えば、プログラマがオブジェクトがどこに割り当てられるかの明示的なコントールを持たないためメモリ輻輳 (memory contention) がよく問題となる。
実際、GC効果により、オブジェクトがメモリの中を動きまわった後である、アプリケーションライフタイムにおける後期のステージでもメモリ輻輳が発生しうる。
ベンチマークを書くときにはこのような効果も考慮する必要がある。

## マイクロベンチマークの例

コードの性能を計測するにあたり、上に挙げた効果を回避する方法がいくつかある。
第一に、対象となるマイクロベンチマークを十分な回数実行することで JITコンパイラがマシンコードにコンパイルし、また最適化されたことを確実にしなければいけない。これはウォームアップ段階 (warm-up phase) と呼ばれる。

マイクロベンチマークそのものは、独立した JVM インスタンスで実行することでプログラムの別の部分により割り当てられたオブジェクトのガベージコレクションや無関係な JITコンパイルによるノイズを低減すべきだ。

より積極的な最適化を行うサーバーバージョンの HotSpot JVM を用いて実行するべきだ。

最後に、ベンチマークの最中にガベージコレクションが発生する可能性を低減するために、理想的にはベンチマークの実行の前にガベージコレクションを行い、次のサイクルを可能な限り延期すべきだ。

Scala の標準ライブラリには `scala.testing.Benchmark` トレイトが定義されており、上記のことを考えて設計されている。
並行トライの `map` 演算をベンチマークする具体例を以下に示す:

    import collection.parallel.mutable.ParTrieMap
    import collection.parallel.ForkJoinTaskSupport

    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val partrie = ParTrieMap((0 until length) zip (0 until length): _*)

      partrie.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        partrie map {
          kv => kv
        }
      }
    }

`run` メソッドはマイクロベンチマークの本体で、これが何度も実行され実行時間が計測される。
上のコードでの `Map` オブジェクトは `scala.testing.Benchmark` トレイトを拡張しシステム指定されたいくつかのパラメータを読み込む。
`par` は並列度、`length` はトライの要素数をそれぞれ表す。

このプログラムをコンパイルした後、このように実行する:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=300000 Map 10

`server` フラグはサーバ VM が使われることを指定する。
`cp` はクラスパスを指定し、現ディレクトリと Scala ライブラリの jar を含む。
`-Dpar` と `-Dlength` は並列度と要素数を指定する。
最後に、`10` はベンチマークが同じ JVM 内で実行される回数を指定する。

以下はハイパースレッディング付きクアッドコアの i7 で `par` を `1`、`2`、`4` と `8` に設定して得られた実行時間だ:

    Map$	126	57	56	57	54	54	54	53	53	53
    Map$	90	99	28	28	26	26	26	26	26	26
    Map$	201	17	17	16	15	15	16	14	18	15
    Map$	182	12	13	17	16	14	14	12	12	12

初期の試行の実行時間が高めであるが、コードが最適化されると低減することが上のデータから分かる。
さらに、`4` スレッドに対して `8` スレッドの性能向上が少ししかみられないことからハイパースレッディングによる利益があまりないことも分かる。

## コレクションがどれだけ大きければ並列化するべきか？

これはよく問われる質問だが、これには少し込み入った答が必要になる。

並列化の採算が取れる（つまり、並列化による高速化が並列化することに伴うオーバーヘッドを上回る）コレクションのサイズは多くの要素に依存するからだ。
全ては書ききれないが、いくつかを挙げる:

<ul>
<li>マシンのアーキテクチャ。
異なる CPU の種類はそれぞれ異なる性能特性やスケーラビリティ特性を持つ。
それとは別に、マシンがマルチコアなのかマザーボード経由で通信するマルチプロセッサなのかにもよる。</li>
<li>JVM のベンダとバージョン。
異なる VM はそれぞれコードに対して異なる最適化を実行時に行う。
異なるメモリ管理や同期のテクニックを実装する。
<code>ForkJoinPool</code> をサポートしないものもあるので、その場合はよりオーバーヘッドのかかる <code>ThreadPoolExecutor</code> が補欠で使われる。</li>
<li>要素あたりの負荷。
並列演算の関数や条件関数が要素あたりの負荷を決定する。
負荷が軽ければ軽いほど、並列化による高速化を得るのに必要な要素数は多くなる。</li>
<li>特定のコレクション。
例えば、<code>ParArray</code> と <code>ParTrieMap</code> のスプリッタではコレクションの走査するスピードが異なり、これは走査だけをみても要素あたりの負荷があるということだ。</li>
<li>特定の演算。
例えば、<code>ParVector</code> の（<code>filter</code> のような）変換メソッドは（<code>foreach</code> のような）アクセスメソッドにくらべてかなり遅い。</li>
<li>副作用。
メモリ領域を並行で変更したり、<code>foreach</code>、<code>map</code> その他に渡されるクロージャから同期機構を用いると輻輳が発生する可能性がある。</li>
<li>メモリ管理。
大量にオブジェクトを割り当てるとガベージコレクションサイクルが誘発される。
新しいオブジェクトへの参照がどのように取り回されるかによって GC サイクルにかかる時間が異なる。</li>
</ul>

上に挙げたものを単独でみても、それらを論理的に論じてコレクションの採算が取れるサイズの正確な答を出すのは簡単なことではない。
サイズがいくつであるかを大まかに示すために、以下に安価で副作用を伴わないベクトルの集約演算（この場合、sum）をクアッドコアの i7（ハイパースレッディング無し）で JDK7 上で実行した具体例を示す:

    import collection.parallel.immutable.ParVector

    object Reduce extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val parvector = ParVector((0 until length): _*)

      parvector.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        parvector reduce {
          (a, b) => a + b
        }
      }
    }

    object ReduceSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val vector = collection.immutable.Vector((0 until length): _*)

      def run = {
        vector reduce {
          (a, b) => a + b
        }
      }
    }

まずこのベンチマークを `250000` 要素で実行して `1`、`2`、`4` スレッドに関して以下の結果を得た:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=250000 Reduce 10 10
    Reduce$    54    24    18    18    18    19    19    18    19    19
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=250000 Reduce 10 10
    Reduce$    60    19    17    13    13    13    13    14    12    13
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=250000 Reduce 10 10
    Reduce$    62    17    15    14    13    11    11    11    11    9

次に、順次ベクトルの集約と実行時間を比較するために要素数を `120000` まで減らして `4` スレッドを使った:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Reduce 10 10
    Reduce$    54    10    8    8    8    7    8    7    6    5
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=120000 ReduceSeq 10 10
    ReduceSeq$    31    7    8    8    7    7    7    8    7    8

この場合は、`120000` 要素近辺が閾値のようだ。

もう一つの具体例として、`mutable.ParHashMap` と（変換メソッドである）`map` メソッドに注目して同じ環境で以下のベンチマークを実行する:

    import collection.parallel.mutable.ParHashMap

    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val phm = ParHashMap((0 until length) zip (0 until length): _*)

      phm.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        phm map {
          kv => kv
        }
      }
    }

    object MapSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val hm = collection.mutable.HashMap((0 until length) zip (0 until length): _*)

      def run = {
        hm map {
          kv => kv
        }
      }
    }

`120000` 要素だとスレッド数を `1` から `4` に変化させていくと以下の実行時間が得られる:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=120000 Map 10 10    
    Map$    187    108    97    96    96    95    95    95    96    95
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=120000 Map 10 10
    Map$    138    68    57    56    57    56    56    55    54    55
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Map 10 10
    Map$    124    54    42    40    38    41    40    40    39    39

ここで要素数を `15000` まで減らして順次ハッシュマップと比較する:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=15000 Map 10 10
    Map$    41    13    10    10    10    9    9    9    10    9
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=15000 Map 10 10
    Map$    48    15    9    8    7    7    6    7    8    6
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=15000 MapSeq 10 10
    MapSeq$    39    9    9    9    8    9    9    9    9    9

このコレクションのこの演算に関しては、`15000` 要素以上あるときには並列化の高速化による採算が取れる（一般に、配列やベクトルに比べてハッシュマップやハッシュ集合の方が少ない要素で並列化の効果を得ることができる）。

## 参照

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]

  [1]: http://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: http://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"
