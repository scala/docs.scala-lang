---
layout: multipage-overview
title: 等価性

discourse: false

partof: collections
overview-name: Collections

num: 13

language: ja
---

コレクションライブラリは等価性 (equality) とハッシング (hashing) に関して統一的な方法を取る。おおまかに言えば、まず、コレクションは集合、マップ、列の三種に大別される。別カテゴリのコレクションは常に不等だと判定される。例えば、`Set(1, 2, 3)` と `List(1, 2, 3)` は同じ要素を格納するが、不等だ。一方、同カテゴリ内ではコレクション内の要素が全く同じ要素から成る (列の場合は、同じ順序の同じ要素) 場合のみ等価だと判定される。例えば、`List(1, 2, 3) == Vector(1, 2, 3)` であり、`HashSet(1, 2) == TreeSet(2, 1)` だ。

コレクションが可変であるか不変であるかは、等価性の判定には関わらない。可変コレクションに関しては、等価性判定が実行された時点での要素の状態が用いられる。これは、可変コレクションが追加されたり削除されたりする要素によって、別のコレクションと等価であったり不等であったりすることを意味する。これはハッシュマップのキーとして可変コレクションを使用した場合、落とし穴となりうる。具体例としては:

    scala> import collection.mutable.{HashMap, ArrayBuffer}
    import collection.mutable.{HashMap, ArrayBuffer}
    scala> val buf = ArrayBuffer(1, 2, 3)
    buf: scala.collection.mutable.ArrayBuffer[Int] =
    ArrayBuffer(1, 2, 3)
    scala> val map = HashMap(buf -> 3)
    map: scala.collection.mutable.HashMap[scala.collection.
    mutable.ArrayBuffer[Int],Int] = Map((ArrayBuffer(1, 2, 3),3))
    scala> map(buf)
    res13: Int = 3
    scala> buf(0) += 1
    scala> map(buf)
    java.util.NoSuchElementException: key not found:
    ArrayBuffer(2, 2, 3)

この例では、最後から二番目の行において配列 `xs` のハッシュコードが変わったため、最後の行の選択は恐らく失敗に終わる。ハッシュコードによる検索は `xs` が格納されていた元の位置とは別の場所を探しているからだ。
