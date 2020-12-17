---
layout: multipage-overview
title: Scala 2.7 からの移行
partof: collections
overview-name: Collections

num: 18

language: ja
---

既存の Scala アプリケーションの新しいコレクションへの移植はほぼ自動的であるはずだ。問題となり得ることはいくつかしかない。

一般的論として、Scala 2.7 コレクションの古い機能はそのまま残っているはずだ。機能の中には廃止予定となったものもあり、それは今後のリリースで撤廃されるということだ。Scala 2.8 でそのような機能を使ったコードをコンパイルすると**廃止予定警告** (deprecation warning) が発生する。その意味や性能特性を変えて 2.8 に残った演算もあり、その場合は廃止予定にするのは無理だった。このような場合は 2.8 でコンパイルすると**移行警告** (migration warning) が出される。コードをどう変えればいいのかも提案してくれる完全な廃止予定警告と移行警告を得るには、`-deprecation` と `-Xmigration` フラグを `scalac` に渡す (`-Xmigration` は `X` で始まるため、拡張オプションであることに注意)。同じオプションを `scala` REPL に渡すことで対話セッション上で警告を得ることができる。具体例としては:

    >scala -deprecation -Xmigration
    Welcome to Scala version 2.8.0.final
    Type in expressions to have them evaluated.
    Type :help for more information.
    scala> val xs = List((1, 2), (3, 4))
    xs: List[(Int, Int)] = List((1,2), (3,4))
    scala> List.unzip(xs)
    <console>:7: warning: method unzip in object List is deprecated: use xs.unzip instead of List.unzip(xs)
           List.unzip(xs)
                ^
    res0: (List[Int], List[Int]) = (List(1, 3),List(2, 4))
    scala> xs.unzip
    res1: (List[Int], List[Int]) = (List(1, 3),List(2, 4))
    scala> val m = xs.toMap
    m: scala.collection.immutable.Map[Int,Int] = Map((1,2), (3,4))
    scala> m.keys
    <console>:8: warning: method keys in trait MapLike has changed semantics:
    As of 2.8, keys returns Iterable[A] rather than Iterator[A].
           m.keys
             ^
    res2: Iterable[Int] = Set(1, 3)

旧ライブラリより完全に置き換えられ、廃止予定警告を出すのが無理だったものが 2つある。

1. 以前の `scala.collection.jcl` パッケージは撤廃された。 このパッケージは Scala 上で Java コレクションライブラリの設計を真似しようとしたが、それは多くの対称性を壊してしまった。Java コレクションが欲しい人の多くは `jcl` を飛ばして `java.util` を直接使用していた。Scala 2.8 は、`jcl` パッケージの代わりに、[`JavaConversions`](conversions-between-java-and-scala-collections.html) オブジェクトにて両方のライブラリ間の自動変換機構を提供する。
2. 投射 (projection) は一般化され、きれいにされ、現在はビューとして提供される。投射はほとんど使われていなかったようなので、この変更に影響を受けるコードは少ないはずだ。

よって、`jcl` か投射を使っている場合は多少コードの書き換えが必要になるかもしれない。
