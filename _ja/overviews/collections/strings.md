---
layout: multipage-overview
title: 文字列

discourse: false

partof: collections
overview-name: Collections

num: 11

language: ja
---

配列と同様、文字列 (`String`) は直接には列ではないが、列に変換することができ、また、文字列は全ての列演算をサポートする。以下に文字列に対して呼び出すことができる演算の具体例を示す。

    scala> val str = "hello"
    str: java.lang.String = hello
    scala> str.reverse
    res6: String = olleh
    scala> str.map(_.toUpper)
    res7: String = HELLO
    scala> str drop 3
    res8: String = lo
    scala> str slice (1, 4)
    res9: String = ell
    scala> val s: Seq[Char] = str
    s: Seq[Char] = WrappedString(h, e, l, l, o)

これらの演算は二つの暗黙の変換により実現されている。例えば、上記の最後の行で文字列が `Seq` に変換されている所では優先度の低い `String` から `WrappedString` への変換が自動的に導入されている (`WrappedString` は
`immutable.IndexedSeq` の子クラスだ)。一方、`reverse`、`map`、`drop`、および `slice` メソッドの呼び出しでは優先度の高い `String` から `StringOps` への変換が自動的に導入されており、これは全ての不変列のメソッドを文字列に追加する。
