---
layout: multipage-overview
title: Строки

discourse: true

partof: collections-213
overview-name: Collections

num: 11
previous-page: arrays
next-page: performance-characteristics

language: ru

---

Как и массивы, строки не являются непосредственно последовательностями, но могут быть преобразованы в них, а также поддерживают все операции которые есть у последовательностей. Ниже приведены некоторые примеры операций, которые можно вызывать на строках.

    scala> val str = "hello"
    str: java.lang.String = hello
    scala> str.reverse
    res6: String = olleh
    scala> str.map(_.toUpper)
    res7: String = HELLO
    scala> str drop 3
    res8: String = lo
    scala> str.slice(1, 4)
    res9: String = ell
    scala> val s: Seq[Char] = str
    s: Seq[Char] = hello

Эти операции обеспечены двумя неявными преобразованиями. Первое, низкоприоритетное неявное преобразование отображает `String` в `WrappedString`, которая является подклассом `immutable.IndexedSeq`, это преобразование сделано в последней строке выше, в которой строка была преобразована в Seq. Второе, высокоприоритетное преобразование связывает строку и объект `StringOps`, который добавляет все методы на неизменяемых последовательностях. Это неявное преобразование используется при вызове методов `reverse`, `map`, `drop` и `slice` в примере выше.
