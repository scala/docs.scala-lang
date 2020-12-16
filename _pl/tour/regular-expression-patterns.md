---
layout: tour
title: Wzorce wyrażeń regularnych
partof: scala-tour

num: 16
language: pl
next-page: extractor-objects
previous-page: singleton-objects
---

## Wzorce sekwencji ignorujące prawą stronę ##

Wzorce ignorujące prawą stronę są użyteczne przy dekomponowaniu danych, które mogą być podtypem `Seq[A]` lub klasą przypadku z iterowalnym parametrem, jak w poniższym przykładzie:

```
Elem(prefix:String, label:String, attrs:MetaData, scp:NamespaceBinding, children:Node*)
```

W tych przypadkach Scala pozwala wzorcom na zastosowanie symbolu `_*` w ostatniej pozycji, aby dopasować sekwencje dowolnej długości.
Poniższy przykład demonstruje dopasowanie wzorca, który rozpoznaje początek sekwencji i wiąże resztę do zmiennej `rest`:

```scala mdoc
object RegExpTest1 extends App {
  def containsScala(x: String): Boolean = {
    val z: Seq[Char] = x
    z match {
      case Seq('s','c','a','l','a', rest @ _*) =>
        println("rest is " + rest)
        true
      case Seq(_*) =>
        false
    }
  }
}
```
