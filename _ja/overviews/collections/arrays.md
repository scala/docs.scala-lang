---
layout: multipage-overview
title: 配列

discourse: false

partof: collections
overview-name: Collections

num: 10
language: ja
---

配列 ([`Array`](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/Array.html)) は Scala のコレクションの中でも特殊なものだ。Scala 配列は、Java の配列と一対一で対応する。どういう事かと言うと、Scala の配列 `Array[Int]` は Java の `int[]` で実装されており、`Array[Double]` は Java の `double[]`、`Array[String]` は Java の `String[]` で実装されている。その一方で、Scala の配列は Java のそれに比べて多くの機能を提供する。まず、Scala の配列は**ジェネリック**であることができる。 つまり、型パラメータか抽象型の `T` に対する `Array[T]` を定義することができる。次に、Scala の配列は Scala の列と互換性があり、`Seq[T]` が期待されている所に `Array[T]` を渡すことができる。さらに、Scala の配列は列の演算の全てをサポートする。以下に具体例で説明する:

    scala> val a1 = Array(1, 2, 3)
    a1: Array[Int] = Array(1, 2, 3)
    scala> val a2 = a1 map (_ * 3)
    a2: Array[Int] = Array(3, 6, 9)
    scala> val a3 = a2 filter (_ % 2 != 0)
    a3: Array[Int] = Array(3, 9)
    scala> a3.reverse
    res0: Array[Int] = Array(9, 3)

Scala の配列は Java の配列で実装されているのに、どのようにして新たな機能をサポートしてるのだろうか。実は、Scala 2.8 とその前のバージョンではその問に対する答が変わってくる。以前は Scala のコンパイラが、ボックス化 (boxing) とボックス化解除 (unboxing) と呼ばれる「魔法」により配列と `Seq` オブジェクトの間を変換していた。この詳細は、特にジェネリック型の `Array[T]` が作成された場合、非常に複雑なものとなる。不可解な特殊ケースなどもあり、配列演算の性能特性は予想不可能なものとなった。

Scala 2.8 の設計はより単純なものだ。ほぼ全てのコンパイラの魔法は無くなった。代わりに、Scala 2.8 配列の実装は全体的に暗黙の変換 (implicit conversion) を利用する。Scala 2.8 では、配列はあたかも列であるようなふりをしない。 そもそもネイティブな配列のデータ型の実装は `Seq` の子クラスではないため、それは不可能というものだ。代わりに、配列を `Seq` の子クラスである `scala.collection.mutable.WrappedArray` クラスで「ラッピング」する暗黙の変換が行われる。以下に具体例で説明する:

    scala> val seq: Seq[Int] = a1
    seq: Seq[Int] = WrappedArray(1, 2, 3)
    scala> val a4: Array[Int] = seq.toArray
    a4: Array[Int] = Array(1, 2, 3)
    scala> a1 eq a4
    res1: Boolean = true

上記のやりとりは、配列から `WrappedArray` への暗黙の変換があるため、配列と列に互換性があることを示す。`WrappedArray` から `Array` へ逆の方向に変換するには、`Traversable` に定義されている `toArray` メソッドを使うことで実現できる。上記の REPL の最後の行は、ラッピングした後、`toArray` でそれを解除したときに、同一の配列が得られることを示す。

配列に適用されるもう一つの暗黙の変換がある。この変換は単に列メソッドの全てを配列に「追加」するだけで、配列自身を列には変換しない。この「追加」は、配列が全ての列メソッドをサポートする `ArrayOps` 型のオブジェクトにラッピングされることを意味している。典型的には、この `ArrayOps` は短命で、列メソッドを呼び出し終えた後にはアクセス不可能となり、そのメモリ領域はリサイクルされる。現代的な仮想機械 (VM) は、しばしばこのようなオブジェクトの生成そのものを省略できる。

以下の REPL のやりとりで、二つの暗黙の変換の違いを示す:

    scala> val seq: Seq[Int] = a1
    seq: Seq[Int] = WrappedArray(1, 2, 3)
    scala> seq.reverse
    res2: Seq[Int] = WrappedArray(3, 2, 1)
    scala> val ops: collection.mutable.ArrayOps[Int] = a1
    ops: scala.collection.mutable.ArrayOps[Int] = [I(1, 2, 3)
    scala> ops.reverse
    res3: Array[Int] = Array(3, 2, 1)

実際には `WrappedArray` である `seq` に対して `reverse` を呼ぶと再び `WrappedArray` が返っているのが分かる。`WrappedArray` は `Seq` であり、`Seq` に対して `reverse` を呼ぶと再び `Seq` が返るため、この結果は論理的だ。一方、`ArrayOps` クラスの値 `ops` に対して `reverse` を呼ぶと、`Seq` ではなく、`Array` が返る。

上記の `ArrayOps` の例は `WrappedArray` との違いを示すためだけのかなり恣意的な物で、通常は `ArrayOps` クラスの値を定義することはありえない。単に配列に対して `Seq` メソッドを呼び出すだけでいい:

    scala> a1.reverse
    res4: Array[Int] = Array(3, 2, 1)

`ArrayOps` オブジェクトは暗黙の変換により自動的に導入されるからだ。よって、上の一行は以下に等しく、

    scala> intArrayOps(a1).reverse
    res5: Array[Int] = Array(3, 2, 1)

`intArrayOps` が先の例で暗黙の変換により導入されたものだ。ここで問題となるのが、先の例でコンパイラがどうやってもう一つの暗黙の変換である `WrappedArray` に対して `intArrayOps` を優先させたのかということだ。結局の所、両方の変換も配列をインプットが指定した `reverse` メソッドをサポートする型へ変換するものだ。二つの暗黙の変換には優先順序が付けられているというのがこの問への答だ。`ArrayOps` 変換には、`WrappedArray` 変換よりも高い優先順位が与えられている。`ArrayOps` 変換は `Predef` オブジェクトで定義されているのに対し、`WrappedArray` 変換は
`Predef` が継承する `scala.LowPriorityImplicits` で定義されている。子クラスや子オブジェクトで定義される暗黙の変換は、親クラスで定義される暗黙の変換に対して優先される。よって、両方の変換が適用可能な場合は、`Predef`
で定義されるものが選ばれる。文字列まわりにも似た仕組みがある。

これで、配列において列との互換性および全ての列メソッドのサポートを実現しているかが分かったと思う。ジェネリック性についてはどうだろう。Java では型パラメータ `T` に対して `T[]` と書くことはできない。では、Scala の `Array[T]` はどのように実装されるのだろう。`Array[T]` のようなジェネリックな配列は実行時においては、Java の 8つあるプリミティブ型の
`byte[]`、`short[]`、`char[]`、`int[]`、`long[]`、`float[]`、`double[]`、`boolean[]` のどれか、もしくはオブジェクトの配列である可能性がある。 これらの型に共通の実行時の型は `AnyRef` (もしくは、それと等価な `java.lang.Object`) であるので、Scala のコンパイラは `Array[T]` を `AnyRef` にマップする。実行時に、型が `Array[T]` である配列の要素が読み込まれたり、更新された場合、実際の配列型を決定するための型判定手順があり、その後 Java 配列に対して正しい型演算が実行される。この型判定は配列演算を多少遅くする。ジェネリックな配列へのアクセスはプリミティブ型やオブジェクトの配列に比べて 3〜4倍遅いと思っていい。つまり、最高の性能を必要とするなら、ジェネリック配列ではなく具象配列を使ったほうがいいことを意味する。いくらジェネリック配列を実装しても、それを**作成する**方法がなければ意味が無い。これは更に難しい問題で、あなたにも少し手を借りる必要がある。この問題を説明するのに、配列を作成するジェネリックなメソッドの失敗例を見てほしい。

    // これは間違っている！
    def evenElems[T](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

`evenElems` メソッドは、引数のベクトル `xs`内の偶数位置にある全ての要素から成る新しい配列を返す。`evenElems` の本文一行目にて、引数と同じ型を持つ戻り値の配列が定義されている。そのため、実際の型パラメータ `T` の実際の型により、これは `Array[Int]`、`Array[Boolean]`、もしくはその他の Java のプリミティブ型の配列か、参照型の配列であるかもしれない。これらの型は実行時に異なる実装を持つため、Scala ランタイムはどのようにして正しいものを選択するのだろう。実際のところ、型パラメータ `T` に対応する実際の型は実行時に消去されてしまうため、与えられた情報だけでは選択することができない。そのため、上記のコードをコンパイルしようとすると以下のエラーが発生する:

    error: cannot find class manifest for element type T
      val arr = new Array[T]((arr.length + 1) / 2)
                ^

あなたがコンパイラを手伝ってあげて、`evenElems` の型パタメータの実際の型が何であるかの実行時のヒントを提供することが必要とされている。この実行時のヒントは `scala.reflect.ClassManifest`
型の**クラスマニフェスト**という形をとる。クラスマニフェストとは、型の最上位クラスが何であるかを記述する型記述オブジェクトだ。型に関するあらゆる事を記述する `scala.reflect.Manifest` 型の完全マニフェストというものもある。配列の作成にはクラスマニフェストで十分だ。

Scala コンパイラは、指示を出すだけでクラスマニフェストを自動的に構築する。「指示を出す」とは、クラスマニフェストを以下のように暗黙のパラメータ (implicit parameter) として要求することを意味する:

    def evenElems[T](xs: Vector[T])(implicit m: ClassManifest[T]): Array[T] = ...

**context bound** という、より短い別の構文を使うことで型がクラスマニフェストを連れてくることを要求できる。これは、型の後にコロン (:) とクラス名 `ClassManifest` を付けることを意味する:

    // これは動作する
    def evenElems[T: ClassManifest](xs: Vector[T]): Array[T] = {
      val arr = new Array[T]((xs.length + 1) / 2)
      for (i <- 0 until xs.length by 2)
        arr(i / 2) = xs(i)
      arr
    }

2つの `evenElems` の改訂版は全く同じことを意味する。どちらの場合も、`Array[T]` が構築されるときにコンパイラは型パラメータ `T` のクラスマニフェスト、つまり `ClassManifest[T]` 型の暗黙の値 (implicit value)、を検索する。暗黙の値が見つかれば、正しい種類の配列を構築するのにマニフェストが使用される。見つからなければ、その前の例のようにエラーが発生する。

以下に `evenElems` を使った REPL のやりとりを示す。

    scala> evenElems(Vector(1, 2, 3, 4, 5))
    res6: Array[Int] = Array(1, 3, 5)
    scala> evenElems(Vector("this", "is", "a", "test", "run"))
    res7: Array[java.lang.String] = Array(this, a, run)

両者の場合とも、Scala コンパイラは要素型 (`Int`、そして `String`) のクラスマニフェストを自動的に構築して、`evenElems` メソッドの暗黙のパラメータに渡した。コンパイラは全ての具象型についてクラスマニフェストを構築できるが、引数そのものがクラスマニフェストを持たない型パラメータである場合はそれができない。以下に失敗例を示す:

    scala> def wrap[U](xs: Vector[U]) = evenElems(xs)
    <console>:6: error: No ClassManifest available for U.
         def wrap[U](xs: Vector[U]) = evenElems(xs)
                                               ^

何が起こったかというと、`evenElems` は型パラメータ `U` に関するクラスマニフェストを要求するが、見つからなかったのだ。当然この場合は、`U` に関する暗黙のクラスマニフェストを要求することで解決するため、以下は成功する:

    scala> def wrap[U: ClassManifest](xs: Vector[U]) = evenElems(xs)
    wrap: [U](xs: Vector[U])(implicit evidence$1: ClassManifest[U])Array[U]

この例から、`U` の定義の context bound 構文は `evidence$1` と呼ばれる `ClassManifest[U]` 型の暗黙のパラメータの略記法であることが分かる。

要約すると、ジェネリックな配列の作成はクラスマニフェストを必要とする。型パラメータ `T` の配列を作成する場合、`T` に関する暗黙のクラスマニフェストも提供する必要がある。その最も簡単な方法は、`[T: ClassManifest]` のように、型パラメータを context bound 構文で `ClassManifest` と共に定義することだ。
