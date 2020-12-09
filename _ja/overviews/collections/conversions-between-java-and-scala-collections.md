---
layout: multipage-overview
title: Java と Scala 間のコレクションの変換
partof: collections
overview-name: Collections

num: 17

language: ja
---

Scala と同様に、Java
にも豊富なコレクションライブラリがある。両者には多くの共通点がある。例えば、両方のライブラリともイテレータ、`Iterable`、集合、マップ、そして列を提供する。しかし、両者には重要な違いもある。特に、Scala では不変コレクションに要点を置き、コレクションを別のものに変換する演算も多く提供している。

時として、コレクションを一方のフレームワークから他方へと渡す必要がある。例えば、既存の Java のコレクションを Scala のコレクションであるかのようにアクセスしたいこともあるだろう。もしくは、Scala のコレクションを Java のコレクションを期待している Java メソッドに渡したいと思うかもしれない。Scala は [JavaConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/JavaConverters$.html) オブジェクトにより主要なコレクション間の暗黙の変換を提供するため、簡単に相互運用できる。特に以下の型に関しては、双方向変換を提供する。

    Iterator               <=>     java.util.Iterator
    Iterator               <=>     java.util.Enumeration
    Iterable               <=>     java.lang.Iterable
    Iterable               <=>     java.util.Collection
    mutable.Buffer         <=>     java.util.List
    mutable.Set            <=>     java.util.Set
    mutable.Map            <=>     java.util.Map
    mutable.ConcurrentMap  <=>     java.util.concurrent.ConcurrentMap

このような変換を作動させるには、[JavaConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/JavaConverters$.html) オブジェクトからインポートするだけでいい:

    scala> import collection.JavaConverters._
    import collection.JavaConverters._

これで `asScala` 及び `asJava` 拡張メソッドを呼び出すことで Scala コレクションとそれに対応する Java コレクションの変換が行われる。

    scala> import collection.mutable._
    import collection.mutable._
    scala> val jul: java.util.List[Int] = ArrayBuffer(1, 2, 3).asJava
    jul: java.util.List[Int] = [1, 2, 3]
    scala> val buf: Seq[Int] = jul.asScala
    buf: scala.collection.mutable.Seq[Int] = ArrayBuffer(1, 2, 3)
    scala> val m: java.util.Map[String, Int] = HashMap("abc" -> 1, "hello" -> 2).asJava
    m: java.util.Map[String,Int] = {hello=2, abc=1}

内部では、このような変換は全ての演算を委譲する「ラッパー」オブジェクトを作ることで実現されている。そのため、Java と Scala の間でコレクションを変換してもコレクションはコピーされることはない。興味深い特性として、例えば Java 型から対応する Scala 型に変換して再び Java 型に逆変換するといった、ラウンドトリップを実行した場合、始めた時と同一のオブジェクトが返ってくるというものがある。

他の Scala コレクションも Java に変換できるが、元の Scala 型には逆変換できない。それらは以下の通り:

    Seq           =>    java.util.List
    mutable.Seq   =>    java.util.List
    Set           =>    java.util.Set
    Map           =>    java.util.Map

Java は可変コレクションと不変コレクションを型で区別しないため、例えば `scala.immutable.List` からの変換は、上書き演算を呼び出すと `UnsupportedOperationException` が発生する `java.util.List` を返す。次に具体例で説明する:

    scala> val jul = List(1, 2, 3).asJava
    jul: java.util.List[Int] = [1, 2, 3]
    
    scala> jul.add(7)
    java.lang.UnsupportedOperationException
            at java.util.AbstractList.add(AbstractList.java:148)
