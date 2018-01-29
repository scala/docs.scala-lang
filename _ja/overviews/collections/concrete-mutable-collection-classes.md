---
layout: multipage-overview
title: 具象可変コレクションクラス

discourse: false

partof: collections
overview-name: Collections

num: 9

language: ja
---

Scala が標準ライブラリで提供する不変コレクションで最もよく使われるものをこれまで見てきた。続いて、具象可変コレクションクラス (concrete mutable collection class) を見ていく。

## 配列バッファ

配列バッファ ([`ArrayBuffer`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayBuffer.html)) は、配列とサイズを格納するバッファだ。配列バッファの演算のほとんどは、単に内部の配列にアクセスして変更するだけなので、配列の演算と同じ速さで実行される。また、配列バッファは効率的にデータをバッファの最後に追加できる。配列バッファへの要素の追加はならし定数時間 (amortized constant time) で実行される。よって、配列バッファは要素が常に最後に追加される場合、大きいコレクションを効率的に構築するのに便利だ。

    scala> val buf = scala.collection.mutable.ArrayBuffer.empty[Int]
    buf: scala.collection.mutable.ArrayBuffer[Int] = ArrayBuffer()
    scala> buf += 1
    res32: buf.type = ArrayBuffer(1)
    scala> buf += 10
    res33: buf.type = ArrayBuffer(1, 10)
    scala> buf.toArray
    res34: Array[Int] = Array(1, 10)

## リストバッファ

リストバッファ ([`ListBuffer`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ListBuffer.html)) は、内部に配列の代わりに連結リストを使うこと以外は配列バッファに似ている。バッファを構築後にリストに変換する予定なら、配列バッファの代わりにリストバッファを使うべきだ。

    scala> val buf = scala.collection.mutable.ListBuffer.empty[Int]
    buf: scala.collection.mutable.ListBuffer[Int] = ListBuffer()
    scala> buf += 1
    res35: buf.type = ListBuffer(1)
    scala> buf += 10
    res36: buf.type = ListBuffer(1, 10)
    scala> buf.toList
    res37: List[Int] = List(1, 10)

## 文字列ビルダ

配列バッファが配列を構築するのに便利で、リストバッファがリストを構築するのに便利なように、文字列ビルダ ([`StringBuilder`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/StringBuilder.html)) は文字列を構築するのに便利なものだ。文字列ビルダはあまりに頻繁に使われるため、デフォルトの名前空間に既にインポートされている。以下のように、単に `new StringBuilder` で文字列ビルダを作成することができる:

    scala> val buf = new StringBuilder
    buf: StringBuilder =
    scala> buf += 'a'
    res38: buf.type = a
    scala> buf ++= "bcdef"
    res39: buf.type = abcdef
    scala> buf.toString
    res41: String = abcdef

## 連結リスト

連結リスト ([`LinkedList`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/LinkedList.html)) は、`next` ポインタにより連結されたノードから成る可変列だ。多くの言語では空の連結リストを表すのに `null` が選ばれるが、空の列も全ての列演算をサポートする必要があるため、Scala のコレクションでは `null` は都合が悪い。特に、`LinkedList.empty.isEmpty` は `true` を返すべきで、`NullPointerException` を発生させるべきではない。 代わりに、空の連結リストは `next` フィールドがノード自身を指すという特殊な方法で表現されている。不変リスト同様、連結リストは順列通りに探索するのに適している。また、連結リストは要素や他の連結リストを簡単に挿入できるように実装されている。

## 双方向リスト

双方向リスト ([`DoubleLinkedList`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/DoubleLinkedList.html)) は、`next` の他に、現ノードの一つ前の要素を指す `prev`
というもう一つの可変フィールドがあることを除けば、単方向の連結リストに似ている。リンクが一つ増えたことで要素の削除が非常に高速になる。

## 可変リスト

可変リスト ([`MutableList`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/MutableList.html)) は単方向連結リストとリスト終端の空ノードを参照するポインタから構成される。これにより、リストの最後への要素の追加が、終端ノードのためにリスト全体を探索しなくてよくなるため、定数時間の演算となる。[`MutableList`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/MutableList.html) は、現在 Scala の [`mutable.LinearSeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/LinearSeq.html) トレイトの標準実装だ。

## キュー
Scala は不変キューの他に可変キュー ([`mutable.Queue`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/Queue.html)) も提供する。可変キューは不変のものと同じように使えるが、`enqueue` の代わりに `+=` と `++=` 演算子を使って加算する。また、可変キューの `dequeue` は先頭の要素を削除して、それを返す。次に具体例で説明する:

    scala> val queue = new scala.collection.mutable.Queue[String]
    queue: scala.collection.mutable.Queue[String] = Queue()
    scala> queue += "a"
    res10: queue.type = Queue(a)
    scala> queue ++= List("b", "c")
    res11: queue.type = Queue(a, b, c)
    scala> queue
    res12: scala.collection.mutable.Queue[String] = Queue(a, b, c)
    scala> queue.dequeue
    res13: String = a
    scala> queue
    res14: scala.collection.mutable.Queue[String] = Queue(b, c)

## 配列シーケンス

配列シーケンス ([`ArraySeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArraySeq.html)) は、内部で要素を `Array[Object]` に格納する固定長の可変列だ。

典型的には、配列の性能特性が欲しいが、要素の型が特定できず、実行時に `ClassManifest` も無く、ジェネリックな列を作成したい場合に [`ArraySeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArraySeq.html) を使う。この問題は後ほど[配列の節](arrays.html)で説明する。

## スタック

既に不変スタックについては説明した。スタックには、[`mutable.Stack`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/Stack.html) クラスにより実装される可変バージョンもある。変更が上書き処理されるという違いの他は、不変バージョンと全く同じように動作する。

    scala> val stack = new scala.collection.mutable.Stack[Int]
    stack: scala.collection.mutable.Stack[Int] = Stack()
    scala> stack.push(1)
    res0: stack.type = Stack(1)
    scala> stack
    res1: scala.collection.mutable.Stack[Int] = Stack(1)
    scala> stack.push(2)
    res0: stack.type = Stack(1, 2)
    scala> stack
    res3: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.top
    res8: Int = 2
    scala> stack
    res9: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.pop
    res10: Int = 2
    scala> stack
    res11: scala.collection.mutable.Stack[Int] = Stack(1)

## 配列スタック

配列スタック ([`ArrayStack`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayStack.html) ) は、内部に必要に応じて大きさを変えた `Array` を使った、可変スタックの代替実装だ。配列スタックは、高速な添字読み込みを提供し、他の演算に関しても普通の可変スタックに比べて少し効率的だ。

## ハッシュテーブル

ハッシュテーブルは、内部で要素を配列に格納し、要素の位置はハッシュコードにより決められる。ハッシュテーブルへの要素の追加は、既に配列の中に同じハッシュコードを持つ他の要素が無い限り、定数時間で行われる。そのため、ハッシュコードの分布が適度である限り非常に高速だ。結果として、Scala の可変マップと可変集合のデフォルトの実装はハッシュテーブルに基づいており、[`mutable.HashSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashSet.html) クラスと [`mutable.HashMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashMap.html) クラスから直接アクセスできる。

ハッシュ集合とハッシュマップは他の集合やマップと変りなく使うことができる。以下に具体例で説明する:

    scala> val map = scala.collection.mutable.HashMap.empty[Int,String]
    map: scala.collection.mutable.HashMap[Int,String] = Map()
    scala> map += (1 -> "make a web site")
    res42: map.type = Map(1 -> make a web site)
    scala> map += (3 -> "profit!")
    res43: map.type = Map(1 -> make a web site, 3 -> profit!)
    scala> map(1)
    res44: String = make a web site
    scala> map contains 2
    res46: Boolean = false

ハッシュテーブルからの要素の取り出しは、特定の順序を保証していない。要素の取り出しは単に内部の配列を通して行われるため、順序はその時の配列の状態により決まる。要素の取り出しの順序を保証したい場合は、普通のハッシュマップではなく**連結**ハッシュマップを使うべきだ。連結ハッシュマップもしくは連結ハッシュ集合は、要素を追加した順序を保った連結リストを含む以外は普通のハッシュマップやハッシュ集合とほとんど同じだ。それにより、コレクションからの要素の取り出しは要素が追加された順序と常に一致する。

## ウィークハッシュマップ

ウィークハッシュマップ（[`WeakHashMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/WeakHashMap.html)) は、ガーベッジコレクタがマップから「弱キー」への参照を追跡しないという特殊なハッシュマップだ。他にキーを参照するものが無くなると、キーとその関連する値はマップから勝手にいなくなる。ウィークハッシュマップは、キーに対する時間のかかる計算結果を再利用するキャッシュのような用途に向いている。キーとその計算結果が普通のハッシュマップに格納された場合、そのマップは限りなく大きくなり続け、キーはガベージコレクタに永遠に回収されない。ウィークハッシュマップを使うことでこの問題を回避できる。キーオブジェクトが到達不可能になり次第、そのエントリーごとウィークハッシュマップから削除される。Scala のウィークハッシュマップは、Java による実装 `java.util.WeakHashMap` のラッパーである [`WeakHashMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/WeakHashMap.html) クラスにより実装されている。

## 並行マップ

並行マップ (`ConcurrentMap`) は複数のスレッドから同時にアクセスすることできる。通常の[マップ](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Map.html)の演算の他に、以下のアトミックな演算を提供する:

### ConcurrentMap クラスの演算 ###

| 使用例                     | 振る舞い|
| ------                    | ------                                                           |
|  `m putIfAbsent(k, v)`  	 |既に `k` がある場合を除き、キー/値ペア `k -> m` を `m` に追加する。|
|  `m remove (k, v)`  	     |`k` に関連付けられた値が `v` である場合、そのエントリを削除する。|
|  `m replace (k, old, new)`|`k` に関連付けられた値が `old` である場合、それを `new` で上書きする。|
|  `m replace (k, v)`  	     |`k` に任意の関連付けられた値がある場合、それを `v` で上書きする。|

`ConcurrentMap` は Scala コレクションライブラリ内のトレイトだ。現在そのトレイトを実装するのは Java の
`java.util.concurrent.ConcurrentMap` クラスだけで、それは [Java/Scala コレクションの標準変換](conversions-between-java-and-scala-collections.html)を使って Scala のマップに変換することができる。

## 可変ビット集合

可変ビット集合 ([`mutable.BitSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/BitSet.html)) は、変更が上書き処理される他は不変のものとほとんど同じだ。可変ビット集合は、変更しなかった `Long` をコピーしなくても済むぶん不変ビット集合に比べて少し効率的だ。

    scala> val bits = scala.collection.mutable.BitSet.empty
    bits: scala.collection.mutable.BitSet = BitSet()
    scala> bits += 1
    res49: bits.type = BitSet(1)
    scala> bits += 3
    res50: bits.type = BitSet(1, 3)
    scala> bits
    res51: scala.collection.mutable.BitSet = BitSet(1, 3)
