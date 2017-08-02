---
layout: multipage-overview
title: 字符串

discourse: false

partof: collections
overview-name: Collections

num: 11
language: zh-cn
---

像数组，字符串不是直接的序列，但是他们可以转换为序列，并且他们也支持所有的在字符串上的序列操作这里有些例子让你可以理解在字符串上操作。

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

这些操作依赖于两种隐式转换。第一种，低优先级转换映射一个String到WrappedString,它是`immutable.IndexedSeq`的子类。在上述代码中这种转换应用在一个string转换为一个Seq。另一种，高优先级转换映射一个string到StringOps 对象，从而在immutable 序列到strings上增加了所有的方法。在上面的例子里，这种隐式转换插入在reverse，map,drop和slice的方法调用中。
