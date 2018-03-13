---
layout: multipage-overview
title: 集合

discourse: false

partof: collections
overview-name: Collections

num: 6

language: ja
---

集合 ([`Set`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Set.html)) は要素の重複の無い `Iterable` だ。集合一般に定義される演算は次の表にまとめてあり、可変集合に関してはその次の表も見てほしい。これらの演算は以下のカテゴリーに分類される:

* **条件演算**である `contains`、`apply`、`subsetOf`。`contains` メソッドは集合が任意の要素を含むかを調べる。集合での `apply` メソッドは `contains` と同じであるため、`set(elem)` は `set contains elem` と同じだ。これは集合が要素を含んでいれば `true` を返す関数として使えることを意味する。

例えば、


    val fruit = Set("apple", "orange", "peach", "banana")
    fruit: scala.collection.immutable.Set[java.lang.String] =
    Set(apple, orange, peach, banana)
    scala> fruit("peach")
    res0: Boolean = true
    scala> fruit("potato")
    res1: Boolean = false


* **加算**である `+` と `++` は、単一もしくは複数の要素を集合に追加し、新たな集合を返す。
* **減算**である `-` と `--` は、単一もしくは複数の要素を集合から削除し、新たな集合を返す。
* **集合演算**である和集合、積集合、および差集合。これらの演算には文字形とシンボル形の二つの形がある。文字バージョンは `intersect`、`union`、および `diff` で、シンボルバージョンは `&`、`|`、と `&~` だ。`Set` が `Traversable` から継承する `++` は `union` と `|` の更なる別名だと考えることができるが、`++` は `Traversable` の引数を取るが、`union` と `|` は集合を取る。

### Set トレイトの演算 ###

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **条件演算:**            |                                                                  |
|  `xs contains x`  	    |`xs` が `x` を含むかを調べる。|
|  `xs(x)`                 |`xs contains x` に同じ。                        |
|  `xs subsetOf ys`  	    |`xs` が `ys` の部分集合であるかを調べる。|
|  **加算:**                |                                                                  |
|  `xs + x`                 |`xs`内の全ての要素および `x` を含んだ集合。|
|  `xs + (x, y, z)`         |`xs`内の全ての要素および渡された要素を含んだ集合。|
|  `xs ++ ys`  	            |`xs`内の全ての要素と `ys`内の全ての要素を含んだ集合。|
|  **減算:**                |                                                                  |
|  `xs - x`  	            |`x` を除き、`xs`内の全ての要素を含んだ集合。|
|  `xs - (x, y, z)`         |渡された要素を除き、`xs`内の全ての要素を含んだ集合。|
|  `xs -- ys`  	            |`ys`内の要素を除き、`xs`内の全ての要素を含んだ集合。|
|  `xs.empty`  	            |`xs` と同じクラスの空集合。|
|  **集合演算:**   |						     |
|  `xs & ys`  	            |`xs` と `ys` の積集合。|
|  `xs intersect ys`        |`xs & ys` に同じ|
|  `xs | ys`  	            |`xs` と `ys` の和集合。|
|  `xs union ys`  	        |`xs | ys` に同じ|
|  `xs &~ ys`  	            |`xs` と `ys` の差集合。|
|  `xs diff ys`  	        |`xs &~ ys` に同じ|

可変集合は、この表にまとめてあるとおり、加算、減算、更新演算などの新たなメソッドを追加する。

### mutable.Set トレイトの演算 ###

| 使用例                    | 振る舞い|
| ------                   | ------                                                           |
|  **加算:**                |                                                                  |
|  `xs += x`  	           |集合 `xs` に副作用として要素 `x` を加え、`xs`自身を返す。|
|  `xs += (x, y, z)`       |集合 `xs` に副作用として渡された要素を加え、`xs`自身を返す。|
|  `xs ++= ys`             |集合 `xs` に副作用として `ys`内の全ての要素を加え、`xs`自身を返す。|
|  `xs add x`  	           |集合 `xs` に要素 `x` を加え、以前に集合に含まれていなければ `true` を返し、既に含まれていれば `false` を返す。|
|  **減算:**               |                                                                  |
|  `xs -= x`  	           |集合 `xs` から副作用として要素 `x` を削除して、`xs`自身を返す。|
|  `xs -= (x, y, z)`  	   |集合 `xs` から副作用として渡された要素を削除して、`xs`自身を返す。|
|  `xs --= ys`  	       |集合 `xs` から副作用として `ys`内の全ての要素を削除して、`xs`自身を返す。|
|  `xs remove x`  	       |集合 `xs` から要素 `x` を削除、以前に集合に含まれていれば `true` を返し、含まれていなければ `false` を返す。|
|  `xs retain p`  	       |`xs`内の要素で条件関数 `p` を満たすものだけを残す。|
|  `xs.clear()`  	       |`xs` から全ての要素を削除する。|
|  **更新演算:**            |                                                                  |
|  `xs(x) = b`  	    |(展開した場合、`xs.update(x, b)`)。ブーリアン値の引数 `b` が `true` ならば `xs` に `x` を加え、それ以外なら `xs` から `x` を削除する。|
|  **クローン演算:**             |						     |
|  `xs.clone`  	            |`xs` と同じ要素を持つ新しい可変集合。|

不変集合と同様に、可変集合も要素追加のための `+` と `++` 演算、および要素削除のための `-` と `--` 演算を提供する。しかし、これらは集合をコピーする必要があるため可変集合ではあまり使われることがない。可変集合はより効率的な `+=` と `-=` という更新方法を提供する。`s += elem` という演算は、集合 `s` に副作用として `elem` を集合に加え、変化した集合そのものを戻り値として返す。同様に、`s -= elem` は集合から `elem` を削除して、変化した集合を戻り値として返す。`+=` と `-=` の他にも、traversable やイテレータの全ての要素を追加または削除する一括演算である `++=` と `--=` がある。

メソッド名として `+=` や `-=` が選ばれていることによって、非常に似たコードが可変集合と不変集合のどちらでも動くことを意味する。不変集合 `s` を使った次の REPL のやりとりを見てほしい:

    scala> var s = Set(1, 2, 3)
    s: scala.collection.immutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    scala> s -= 2
    scala> s
    res2: scala.collection.immutable.Set[Int] = Set(1, 3, 4)

ここでは `immutable.Set`型の `var` に対して `+=` と `-=` を使った。`s += 4` のようなステートメントは、`s = s + 4` の略だ。つまり、これは集合 `s` に対して追加メソッドの `+` を呼び出して、結果を変数`s` に代入しなおしている。次に、可変集合でのやりとりを見てほしい。

    scala> val s = collection.mutable.Set(1, 2, 3)
    s: scala.collection.mutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    res3: s.type = Set(1, 4, 2, 3)
    scala> s -= 2
    res4: s.type = Set(1, 4, 3)

結果は前回のやりとりと非常に似通ったものになった: `Set(1, 2, 3)` から始めて、最後に `Set(1, 3, 4)`
を得た。ステートメントは前回と同じに見えるが、実際には違うことを行っている。`s`&nbsp;`+=`&nbsp;`4` は今度は可変集合 `s` の `+=` メソッドを呼び出し、その場で集合を上書きしているのだ。同様に、`s -= 2` は同じ集合の `-=` メソッドを呼び出している。

この2つのやりとりの比較から重要な原則を導き出せる。`val` に格納された可変コレクションと、`var` に格納された不変コレクションは、大抵の場合にお互いを置換できるということだ。これはコレクションに対して上書きで更新されたのか新たなコレクションが作成されたのかを第三者が観測できるような別名の参照がない限り成り立つ原則だ。

可変集合は `+=` と `-=` の別形として `add` と `remove` を提供する。違いは `add` と `remove` は集合に対して演算の効果があったかどうかを示す `Boolean` の戻り値を返すことだ。

現在の可変集合のデフォルトの実装では要素を格納するのにハッシュテーブルを使っている。不変集合のデフォルトの実装は集合の要素数に応じて方法を変えている。空集合はシングルトンで表される。サイズが4つまでの集合は全要素をフィールドとして持つオブジェクトとして表される。それを超えたサイズの不変集合は[ハッシュトライ]()として表される。

このような設計方針のため、(例えば 4以下の) 小さいサイズの集合を使う場合は、通常の場合、可変集合に比べて不変集合の方が、よりコンパクトで効率的だ。集合のサイズが小さいと思われる場合は、不変集合を試してみてはいかがだろうか。

集合のサブトレイトとして `SortedSet` と `BitSet` の2つがある。

### 整列済み集合 ###

整列済み集合は ([`SortedSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/SortedSet.html))
は (集合の作成時に指定された) 任意の順序で要素を (`iterator` や `foreach` を使って) 返す事ができる集合だ。[`SortedSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/SortedSet.html) クラスのデフォルトの表現は、左の子ツリー内の全ての要素が右の子ツリーの全ての要素よりも小さいという恒常条件を満たす順序付けされた二分木だ。これにより、通りがけ順 (in-order) で探索するだけで、木の全ての要素を昇順に返すことができる。Scala の[`immutable.TreeSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/TreeSet.html) クラスは **赤黒木** を使ってこの恒常条件を実装している。また、この木構造は、**平衡木**であり、ルートから全て葉のまでの長さの違いは最大で1要素しかない。

空の [`TreeSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/TreeSet.html) を作成するには、まず順序付けを指定する:

    scala> val myOrdering = Ordering.fromLessThan[String](_ > _)
    myOrdering: scala.math.Ordering[String] = ...

次に、その順序付けの空の木集合を作成するには:

    scala> TreeSet.empty(myOrdering)
    res1: scala.collection.immutable.TreeSet[String] = TreeSet()

順序付けの引数を省略して、空集合の要素型を指定することもできる。その場合は、要素型のデフォルトの順序付けが使われる。

    scala> TreeSet.empty[String]
    res2: scala.collection.immutable.TreeSet[String] = TreeSet()

(例えば連結やフィルターによって) 新たな木集合を作成した場合、それは元の集合と同じ順序付けを保つ。たとえば、

    scala> res2 + ("one", "two", "three", "four")
    res3: scala.collection.immutable.TreeSet[String] = TreeSet(four, one, three, two)

整列済み集合は要素の範囲もサポートする。例えば、`range` メソッドは開始要素以上、終了要素未満の全ての要素を返す。また、`from` メソッドは開始要素以上の全ての要素を、集合の順序付けで返す。両方のメソッドの戻り値もまた整列済み集合だ。用例:

    scala> res3 range ("one", "two")
    res4: scala.collection.immutable.TreeSet[String] = TreeSet(one, three)
    scala> res3 from "three"
    res5: scala.collection.immutable.TreeSet[String] = TreeSet(three, two)


### ビット集合 ###

ビット集合 ([`BitSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/BitSet.html)) は非負整数の要素の集合で、何ワードかのパックされたビットにより実装されている。[`BitSet`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/BitSet.html) クラスは、内部で `Long` の配列を用いている。最初の `Long` は第0 〜 63 の要素を受け持ち、次のは第64 〜 127 の要素という具合だ。全ての `Long` の、それぞれの 64ビットは、対応する要素が集合に含まれる場合は 1 にセットされ、含まれない場合は 0 になる。このため、ビット集合のサイズは格納されている整数の最大値に依存する。`N` がその最大の整数値の場合、集合のサイズは `N/64` `Long` ワード、または `N/8` バイト、にステータス情報のためのバイトを追加したものだ。

このため、たくさんの小さい要素を含む場合、ビット集合は他の集合に比べてコンパクトである。ビット集合のもう一つの利点は `contains` を使った所属判定や、`+=` や `-=` を使った要素の追加や削除が非常に効率的であることだ。
