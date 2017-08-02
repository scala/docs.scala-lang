---
layout: multipage-overview
title: 具象不変コレクションクラス

discourse: false

partof: collections
overview-name: Collections

num: 8

language: ja
---

Scala は様々な具象不変コレクションクラス (concrete immutable collection class) を提供する。これらはどのトレイトを実装するか（マップ、集合、列）、無限を扱えるか、様々な演算の速さなどの違いがある。ここに、Scala で最もよく使われる不変コレクション型を並べる。

## リスト

リスト ([`List`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/List.html)) は有限の不変列だ。リストは最初の要素とリストの残りの部分に定数時間でアクセスでき、また、新たな要素をリストの先頭に追加する定数時間の cons 演算を持つ。他の多くの演算は線形時間で行われる。

リストは Scala プログラミングの働き者であり続けてきたので、あえてここで語るべきことは多くない。Scala 2.8 での大きな変更点は `List` クラスはそのサブクラスである `::` とそのサブオブジェクトである `Nil` とともに、論理的にふさわしい `scala.collection.immutable` パッケージで定義されるようになったことだ。`scala` パッケージには `List`、`Nil`、および `::` へのエイリアスがあるため、ユーザの立場から見ると、リストは今まで通り使うことができる。

もう一つの変更点は、リストは以前のような特殊扱いではなく、コレクションフレームワークにより緊密に統合されたことだ。例えば、`List` のコンパニオンオブジェクトにあった多くのメソッドは廃止予定になった。代わりに、それらは全てのコレクションが継承する[共通作成メソッド](creating-collections-from-scratch.html)に取って代わられた。

## ストリーム

ストリーム ([`Stream`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Stream.html)) はリストに似ているが、要素は遅延評価される。そのため、ストリームは無限の長さをもつことができる。呼び出された要素のみが計算される。他の点においては、ストリームはリストと同じ性能特性をもつ。

リストは `::` 演算子によって構築されるが、ストリームはそれに似た `#::` 演算子によって構築される。以下は、整数の 1, 2, 3 からなる簡単なストリームの例だ:

    scala> val str = 1 #:: 2 #:: 3 #:: Stream.empty
    str: scala.collection.immutable.Stream[Int] = Stream(1, ?)

このストリームの head は 1 で、tail は 2 と 3 だ。上の例では tail が表示されていないが、それはまだ計算されていないからだ。ストリームは遅延評価されるため、`toString` は余計な評価を強いないように慎重に設計されているのだ。

以下に、もう少し複雑な例を示す。任意の二つの数から始まるフィボナッチ数列を計算するストリームだ。フィボナッチ数列とは、それぞれの要素がその前二つの要素の和である数列のことだ。

    scala> def fibFrom(a: Int, b: Int): Stream[Int] = a #:: fibFrom(b, a + b)
    fibFrom: (a: Int,b: Int)Stream[Int]

この関数は嘘のように単純だ。数列の最初の要素は明らかに `a` で、残りは `b` そして `a + b` から始まるフィボナッチ数列だ。無限の再帰呼び出しに陥らずにこの数列を計算するのが難しい所だ。もしこの関数が `#::` の代わりに `::` を使っていたなら、全ての呼び出しはまた別の呼び出しを招くため、無限の再帰呼び出しに陥ってしまう。しかし、`#::`
を使っているため、右辺は呼び出されるまでは評価されないのだ。

2つの 1 から始まるフィボナッチ数列の最初の数要素を以下に示す:

    scala> val fibs = fibFrom(1, 1).take(7)
    fibs: scala.collection.immutable.Stream[Int] = Stream(1, ?)
    scala> fibs.toList
    res9: List[Int] = List(1, 1, 2, 3, 5, 8, 11)

## ベクトル

リストはアルゴリズムが慎重にリストの先頭要素 (`head`) のみを処理する場合、非常に効率的だ。`head` の読み込み、追加、および削除は一定数時間で行われるのに対して、リストの後続の要素に対する読み込みや変更は、その要素の深さに依存した線形時間で実行される。

ベクトル ([`Vector`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Vector.html)) は、ランダムアクセス時の非効率性を解決するために Scala 2.8 から導入された新しいコレクション型だ。ベクトルはどの要素の読み込みも「事実上」定数時間で行う。リストの `head` の読み込みや配列の要素読み込みに比べると大きい定数だが、定数であることには変りない。この結果、ベクトルを使ったアルゴリズムは列の `head` のみを読み込むことに神経質にならなくていい。任意の場所の要素を読み込んだり、変更したりできるため、コードを書くのに便利だ。

ベクトルは、他の列と同じように作成され、変更される。

    scala> val vec = scala.collection.immutable.Vector.empty
    vec: scala.collection.immutable.Vector[Nothing] = Vector()
    scala> val vec2 = vec :+ 1 :+ 2
    vec2: scala.collection.immutable.Vector[Int] = Vector(1, 2)
    scala> val vec3 = 100 +: vec2
    vec3: scala.collection.immutable.Vector[Int] = Vector(100, 1, 2)
    scala> vec3(0)
    res1: Int = 100

ベクトルは分岐度の高い木構造で表される。全てのノードは32以下の要素か、32以下の他のノードを格納する。32個以下の要素を持つベクトルは単一のノードで表すことができる。ベクトルは、たった一つの間接呼び出しで、`32 * 32 = 1024`個までの要素を扱うことができる。木構造の根ノードから末端ノードまで 2ホップで <i>2<sup>15</sup></i>個、3ホップで <i>2<sup>20</sup></i>個、4ホップで
<i>2<sup>30</sup></i>個以下までの要素をベクトルは扱うことができる。よって、普通のサイズのベクトルの要素選択は 5回以内の配列選択で行うことができる。要素選択が「事実上定数時間」と言ったのは、こういうことだ。

ベクトルは不変であるため、ベクトルの変更無しにベクトル内の要素を変更することはできない。しかし、`updated` メソッドを使うことで一つの要素違いの新たなベクトルを作成することができる:

    scala> val vec = Vector(1, 2, 3)
    vec: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)
    scala> vec updated (2, 4)
    res0: scala.collection.immutable.Vector[Int] = Vector(1, 2, 4)
    scala> vec
    res1: scala.collection.immutable.Vector[Int] = Vector(1, 2, 3)

最後の行が示すように、`updated` の呼び出しは元のベクトル `vec` には一切影響しない。読み込みと同様に、ベクトルの関数型更新も「事実上定数時間」で実行される。ベクトルの真ん中にある要素を更新するには、その要素を格納するノードと、木構造の根ノードからを初めとする全ての親ノードをコピーすることによって行われる。これは関数型更新は、32以内の要素か部分木を格納する 1 〜 5個の ノードを作成することを意味する。これは、可変配列の in-place での上書きに比べると、ずっと時間のかかる計算であるが、ベクトル全体をコピーするよりはずっと安いものだ。

ベクトルは高速なランダム読み込みと高速な関数型更新の丁度いいバランスを取れているため、不変添字付き列 ([`immutable.IndexedSeq`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/IndexedSeq.html)) トレイトのデフォルトの実装となっている:

    scala> collection.immutable.IndexedSeq(1, 2, 3)
    res2: scala.collection.immutable.IndexedSeq[Int] = Vector(1, 2, 3)

## 不変スタック

後入れ先出し (LIFO: last in first out) の列が必要ならば、スタック ([`Stack`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Stack.html)) がある。 `push` メソッドを使ってスタックに要素をプッシュ、`pop` を使ってポップ、そして`top` を使って削除することなく一番上の要素を読み込むことができる。これらの演算は、全て定数時間で行われる。

以下はスタックに対して行われる簡単な演算の例だ:

    scala> val stack = scala.collection.immutable.Stack.empty
    stack: scala.collection.immutable.Stack[Nothing] = Stack()
    scala> val hasOne = stack.push(1)
    hasOne: scala.collection.immutable.Stack[Int] = Stack(1)
    scala> stack
    stack: scala.collection.immutable.Stack[Nothing] = Stack()
    scala> hasOne.top
    res20: Int = 1
    scala> hasOne.pop
    res19: scala.collection.immutable.Stack[Int] = Stack()

機能的にリストとかぶるため、不変スタックが Scala のプログラムで使われることは稀だ: 不変スタックの `push` はリストの `::` と同じで、`pop` はリストの `tail` と同じだ。

## 不変キュー

キュー ([`Queue`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Queue.html)) はスタックに似ているが、後入れ先出し (LIFO: last in first out) ではなく、先入れ先出し (FIFO:
first in first out) だ。

以下に空の不変キューの作り方を示す:

    scala> val empty = scala.collection.immutable.Queue[Int]()
    empty: scala.collection.immutable.Queue[Int] = Queue()

`enqueue` を使って不変キューに要素を追加することができる:

    scala> val has1 = empty.enqueue(1)
    has1: scala.collection.immutable.Queue[Int] = Queue(1)

複数の要素をキューに追加するには、enqueue の引数にコレクションを渡す:

    scala> val has123 = has1.enqueue(List(2, 3))
    has123: scala.collection.immutable.Queue[Int]
      = Queue(1, 2, 3)

キューの先頭から要素を削除するには、`dequeue` を使う:

    scala> val (element, has23) = has123.dequeue
    element: Int = 1
    has23: scala.collection.immutable.Queue[Int] = Queue(2, 3)

`dequeue` は削除された要素と残りのキューのペアを返すことに注意してほしい。

## 範囲

範囲 ([`Range`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Range.html)) は順序付けされた等間隔の整数の列だ。例えば、「1、2、3」は範囲であり、「5、8、11、14」も範囲だ。Scala で範囲を作成するには、予め定義された `to` メソッドと `by` メソッドを使う。

    scala> 1 to 3
    res2: scala.collection.immutable.Range.Inclusive = Range(1, 2, 3)
    scala> 5 to 14 by 3
    res3: scala.collection.immutable.Range = Range(5, 8, 11, 14)

上限を含まない範囲を作成したい場合は、`to` の代わりに、便宜上用意された `until` メソッドを使う:

    scala> 1 until 3
    res2: scala.collection.immutable.Range = Range(1, 2)

範囲は、開始値、終了値、ステップ値という、たった三つの数で定義できため定数空間で表すことができる。そのため、範囲の多くの演算は非常に高速だ。

## ハッシュトライ

ハッシュトライは不変集合と不変マップを効率的に実装する標準的な方法だ。ハッシュトライは、[`immutable.HashMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/HashMap.html) クラスによりサポートされている。データ構造は、全てのノードに 32個の要素か 32個の部分木があるという意味でベクトルに似ている。しかし、キーの選択はハッシュコードにより行われる。たとえば、マップから任意のキーを検索する場合、まずキーのハッシュコードを計算する。その後、最初の部分木を選択するのにハッシュコードの下位 5ビットが使われ、次の 5ビットで次の部分木が選択される、という具合だ。ノード内の全ての要素が、その階層までで選ばれているビット範囲内でお互いと異なるハッシュコードを持った時点で選択は終了する。

ハッシュトライは、サイズ相応の高速な検索と、相応に効率的な関数型加算 `(+)` と減算 `(-)` の調度良いバランスが取れている。そのため、ハッシュトライは Scala の不変マップと不変集合のデフォルトの実装を支えている。実は、Scala は要素が 5個未満の不変集合と不変マップに関して、更なる最適化をしている。1 〜 4個の要素を持つ集合とセットは、要素 (マップの場合は、キー/値のペア) をフィールドとして持つ単一のオブジェクトとして格納する。空の不変集合と、空の不変マップは、ぞれぞれ単一のオブジェクトである。空の不変集合や不変マップは、空であり続けるため、データ構造を複製する必要はない。

## 赤黒木

赤黒木は、ノードが「赤」か「黒」に色付けされている平衡二分木の一種だ。他の平衡二分木と同様に演算は木のサイズのログ時間内に確実に完了する。

Scala は内部で赤黒木を使った不変集合と不変マップの実装を提供する。[`TreeSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/TreeSet.html) と [`TreeMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/TreeMap.html) クラスがそれだ。

    scala> scala.collection.immutable.TreeSet.empty[Int]
    res11: scala.collection.immutable.TreeSet[Int] = TreeSet()
    scala> res11 + 1 + 3 + 3
    res12: scala.collection.immutable.TreeSet[Int] = TreeSet(1, 3)

赤黒木は、全ての要素をソートされた順序で返す効率的なイテレータを提供するため、整列済み集合 (`SortedSet`)
の標準実装となっている。

## 不変ビット集合

ビット集合 ([`BitSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/BitSet.html)) は大きい整数のビットを小さな整数のコレクションを使って表す。例えば、3, 2, と 0 を格納するビット集合は二進法で整数の 1101、十進法で 13 を表す。

内部では、ビット集合は 64ビットの `Long` の配列を使っている。配列の最初の `Long` は 整数の 0〜63、二番目は 64〜127 という具合だ。そのため、ビット集合は最大値が数百以下の場合は非常にコンパクトだ。

ビット集合の演算はとても高速だ。所属判定は一定数時間で行われる。集合への要素の追加は、ビット集合の配列内の `Long` の数に比例するが、普通は小さい数だ。以下にビット集合の使用例を示す:

    scala> val bits = scala.collection.immutable.BitSet.empty
    bits: scala.collection.immutable.BitSet = BitSet()
    scala> val moreBits = bits + 3 + 4 + 4
    moreBits: scala.collection.immutable.BitSet = BitSet(3, 4)
    scala> moreBits(3)
    res26: Boolean = true
    scala> moreBits(0)
    res27: Boolean = false

## リストマップ

リストマップ ([`ListMap`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/ListMap.html)) は、キー/値ペアの連結リスト (linked list) により実装されたマップを表す。一般的に、リストマップの演算はリスト全体を総なめする必要がある可能性がある。そのため、リストマップの演算はマップのサイズに対して線形時間をとる。標準の不変マップの方が常に高速なので Scala のリストマップが使われることはほとんど無い。唯一性能の差が出る可能性としては、マップが何らかの理由でリストの最初の要素が他の要素に比べてずっと頻繁に読み込まれるように構築された場合だ。

    scala> val map = scala.collection.immutable.ListMap(1->"one", 2->"two")
    map: scala.collection.immutable.ListMap[Int,java.lang.String] =
       Map(1 -> one, 2 -> two)
    scala> map(2)
    res30: String = "two"
