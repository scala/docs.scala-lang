---
layout: multipage-overview
title: Преобразования между Java и Scala коллекциями 

discourse: true

partof: collections-213
overview-name: Collections

num: 17
previous-page: creating-collections-from-scratch

language: ru

---

Как и в Scala, в Java есть богатая библиотека коллекций. Между ними много общего. Например, обе библиотеки предоставляют итераторы, итерируемые сущности, множества, мапы и списки. Но есть и серьезные различия. В частности, библиотека Scala фокусируют больше внимания на неизменяемых коллекциях, предоставляя больше возможностей для преобразования исходной коллекции в новую.

Иногда вам может понадобиться передать данные из одного фреймворка с коллекциями в другой. Например, вам может понадобиться доступ к существующей коллекции в Java, как если бы это была коллекция Scala. Или вы захотите передать одну из коллекций Scala методу в Java, который ожидает схожую коллекцию из Java. Сделать это довольно просто, потому что Scala предоставляет неявные преобразования всех основных типов коллекций используя [CollectionConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/jdk/CollectionConverters$.html) объект. В частности, вы найдете двухсторннее преобразование между следующими типами:

    Iterator               <=>     java.util.Iterator
    Iterator               <=>     java.util.Enumeration
    Iterable               <=>     java.lang.Iterable
    Iterable               <=>     java.util.Collection
    mutable.Buffer         <=>     java.util.List
    mutable.Set            <=>     java.util.Set
    mutable.Map            <=>     java.util.Map
    mutable.ConcurrentMap  <=>     java.util.concurrent.ConcurrentMap

Чтобы задействовать эти неявные преобразования, просто импортируйте объект [CollectionConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/jdk/CollectionConverters$.html) :

    scala> import scala.jdk.CollectionConverters._
    import scala.jdk.CollectionConverters._

Это позволит преобразовывать коллекции Scala в соответствующие коллекции Java с помощью методов расширения, называемых `asScala` и `asJava`:

    scala> import collection.mutable._
    import collection.mutable._

    scala> val jul: java.util.List[Int] = ArrayBuffer(1, 2, 3).asJava
    jul: java.util.List[Int] = [1, 2, 3]

    scala> val buf: Seq[Int] = jul.asScala
    buf: scala.collection.mutable.Seq[Int] = ArrayBuffer(1, 2, 3)

    scala> val m: java.util.Map[String, Int] = HashMap("abc" -> 1, "hello" -> 2).asJava
    m: java.util.Map[String,Int] = {abc=1, hello=2}

Внутри эти преобразования работают путем установки объекта "обертки", который перенаправляет все операции на базовый объект коллекции. Таким образом, коллекции никогда не копируются при конвертировании между Java и Scala. Интересным свойством является то, что если вы выполняете преобразование из типа Java в соответствующий тип Scala и обратно в тот же тип Java, вы получаете идентичный объект коллекции, с которого начали.

Некоторые коллекции Scala могут быть преобразованы в Java, но не могут быть преобразованы обратно в исходный тип Scala:

    Seq           =>    java.util.List
    mutable.Seq   =>    java.util.List
    Set           =>    java.util.Set
    Map           =>    java.util.Map

Поскольку Java не различает изменяемые и неизменяемые коллекции по их типам, преобразование из, скажем, `scala.immutable.List` даст результат `java.util.List`, в котором любые операции преобразования кидают исключение "UnsupportedOperationException". Вот пример:

    scala> val jul = List(1, 2, 3).asJava
    jul: java.util.List[Int] = [1, 2, 3]

    scala> jul.add(7)
    java.lang.UnsupportedOperationException
      at java.util.AbstractList.add(AbstractList.java:148)
