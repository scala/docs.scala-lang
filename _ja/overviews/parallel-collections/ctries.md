---
layout: multipage-overview
title: 並行トライ

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 4
language: ja
---

並列データ構造の多くは、走査時にデータ構造が変更された場合に一貫性のある走査を保証しない。
これは、ほとんどの可変コレクションにも当てはまることだ。
並行トライ (concurrent trie) は、走査中に自身の更新を許すという意味で特殊なものだと言える。
変更は、次回以降の走査のみで見えるようになる。
これは、順次並行トライと並列並行トライの両方に当てはまることだ。
唯一の違いは、前者は要素を逐次的に走査するのに対して、後者は並列に走査するということだけだ。

この便利な特性を活かして簡単に書くことができるアルゴリズムがいくつかある。
これらのアルゴリズムは、 要素のデータセットを反復処理するが、要素によって異なる回数繰り返す必要のあるアルゴリズムであることが多い。

与えられた数の集合の平方根を計算する例を以下に示す。
繰り返すたびに平方根の値が更新される。
平方根の値が収束すると、その数は集合から外される。

    case class Entry(num: Double) {
      var sqrt = num
    }

    val length = 50000

    // リストを準備する
    val entries = (1 until length) map { num => Entry(num.toDouble) }
    val results = ParTrieMap()
    for (e <- entries) results += ((e.num, e))

    // 平方根を計算する
    while (results.nonEmpty) {
      for ((num, e) <- results) {
        val nsqrt = 0.5 * (e.sqrt + e.num / e.sqrt)
        if (math.abs(nsqrt - e.sqrt) < 0.01) {
          results.remove(num)
        } else e.sqrt = nsqrt
      }
    }

上のバビロニア法による平方根の計算 (\[[3][3]\]) は、数によっては他よりも早く収束することに注意してほしい。
そのため、それらの数を `result` から削除して処理が必要な要素だけが走査されるようにする必要がある。

もう一つの例としては、幅優先探索 (breadth-first search) アルゴリズムがある。
これは、対象となるノードが見つかるか他に見るノードが無くなるまで反復的に前線ノードを広げていく。
ここでは、二次元の地図上のノードを `Int` のタプルとして定義する。
`map` はブーリアン型の二次元配列として定義し、これはその位置が占有されているかを示す。
次に、今後拡張予定の全てのノード（ノード前線）を含む `open` と、拡張済みの全てのノードを含む `closed` という二つの平行トライマップを宣言する。
地図の四隅から探索を始めて、地図の中心までの経路を見つけたいため、`open` マップを適切なノードに初期化する。
次に、`open` マップ内の全てのノードを拡張するノードが無くなるまで反復的に拡張する。
ノードが拡張されるたびに、`open` マップから削除され、`closed` マップに追加される。
完了したら、対象ノードから初期ノードまでの経路を表示する。

    val length = 1000

    // Node 型を定義する
    type Node = (Int, Int);
    type Parent = (Int, Int);

    // Node 型の演算
    def up(n: Node) = (n._1, n._2 - 1);
    def down(n: Node) = (n._1, n._2 + 1);
    def left(n: Node) = (n._1 - 1, n._2);
    def right(n: Node) = (n._1 + 1, n._2);

    // map と target を作る
    val target = (length / 2, length / 2);
    val map = Array.tabulate(length, length)((x, y) => (x % 3) != 0 || (y % 3) != 0 || (x, y) == target)
    def onMap(n: Node) = n._1 >= 0 && n._1 < length && n._2 >= 0 && n._2 < length

    // open マップ - ノード前線
    // closed マップ - 滞在済みのノード
    val open = ParTrieMap[Node, Parent]()
    val closed = ParTrieMap[Node, Parent]()

    // 初期位置をいくつか追加する
    open((0, 0)) = null
    open((length - 1, length - 1)) = null
    open((0, length - 1)) = null
    open((length - 1, 0)) = null

    // 貪欲法による幅優先探索
    while (open.nonEmpty && !open.contains(target)) {
      for ((node, parent) <- open) {
        def expand(next: Node) {
          if (onMap(next) && map(next._1)(next._2) && !closed.contains(next) && !open.contains(next)) {
            open(next) = node
          }
        }
        expand(up(node))
        expand(down(node))
        expand(left(node))
        expand(right(node))
        closed(node) = parent
        open.remove(node)
      }
    }

    // 経路の表示
    var pathnode = open(target)
    while (closed.contains(pathnode)) {
      print(pathnode + "->")
      pathnode = closed(pathnode)
    }
    println()

並行トライはまた、逐次化可能 (linearizable) 、ロックフリー (lock-free)、かつ計算量が定数時間の `snapshot` 演算をサポートする。
この演算は、ある特定の時点における全ての要素を含んだ新たな並列トライを作成する。
これは、実質的にはそのトライのその時点での状態を捕捉したことと変わらない。
`snapshot` 演算は、並列トライの新しいルートを作成するだけだ。
後続の更新は並列トライのうち更新に関わる部分だけを遅延評価で再構築し他の部分には手を付けない。
まず、これはスナップショット演算に要素のコピーを伴わないため、演算が高価ではないということだ。
次に、コピーオンライト (copy-on-write) の最適化は平行トライの一部だけをコピーするため、後続の更新は水平にスケールする。
`readOnlySnapshot` メソッドは、`snapshot` メソッドよりも少しだけ効率が良いが、更新のできないリードオンリーなマップを返す。
このスナップショット機構を用いて、並行トライは逐次化可能で計算量が定数時間の、`clear` メソッドも提供する。
並行トライとスナップショットの仕組みに関してさらに知りたい場合は、\[[1][1]\] と \[[2][2]\] を参照してほしい。

並行トライのイテレータはスナップショットに基づいている。
イテレータオブジェクトが作成される前に並行トライのスナップショットが取られるため、イテレータはスナップショットが作成された時点での要素のみを走査する。
当然、イテレータはリードオンリーなスナップショットを用いる。

`size` 演算もスナップショットに基づいている。
率直に実装すると、`size` を呼び出した時点でイテレータ（つまり、スナップショット）が作り、全ての要素を走査しながら数えていくというふうになる。
そのため、`size` を呼び出すたびに要素数に対して線形の時間を要することになる。
しかし、並行トライは異なる部分のサイズをキャッシュするように最適化されているため、`size` の計算量はならし対数時間まで減少している。
実質的には、一度 `size` を呼び出すと二回目以降の `size` の呼び出しは、典型的には最後に `size` が呼ばれた時点より更新された枝のサイズのみを再計算するというように、最小限の仕事のみを要するようになる。
さらに、並列並行トライのサイズ計算は並列的に実行される。

## 参照

1. [Cache-Aware Lock-Free Concurrent Hash Tries][1]
2. [Concurrent Tries with Efficient Non-Blocking Snapshots][2]
3. [Methods of computing square roots][3]

  [1]: http://infoscience.epfl.ch/record/166908/files/ctries-techreport.pdf "Ctries-techreport"
  [2]: http://lampwww.epfl.ch/~prokopec/ctries-snapshot.pdf "Ctries-snapshot"
  [3]: http://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method "babylonian-method"
