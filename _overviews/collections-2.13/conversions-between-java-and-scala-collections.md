---
layout: multipage-overview
title: Conversions Between Java and Scala Collections
partof: collections-213
overview-name: Collections

num: 17
previous-page: creating-collections-from-scratch
next-page: conversion-between-option-and-the-collections

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

Like Scala, Java also has a rich collections library. There are many similarities between the two. For instance, both libraries know iterators, iterables, sets, maps, and sequences. But there are also important differences. In particular, the Scala libraries put much more emphasis on immutable collections, and provide many more operations that transform a collection into a new one.

Sometimes you might need to pass from one collection framework to the other. For instance, you might want to access an existing Java collection as if it were a Scala collection. Or you might want to pass one of Scala's collections to a Java method that expects its Java counterpart. It is quite easy to do this, because Scala offers implicit conversions between all the major collection types in the [CollectionConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/jdk/CollectionConverters$.html) object. In particular, you will find bidirectional conversions between the following types.

```
Iterator               <=>     java.util.Iterator
Iterator               <=>     java.util.Enumeration
Iterable               <=>     java.lang.Iterable
Iterable               <=>     java.util.Collection
mutable.Buffer         <=>     java.util.List
mutable.Set            <=>     java.util.Set
mutable.Map            <=>     java.util.Map
mutable.ConcurrentMap  <=>     java.util.concurrent.ConcurrentMap
```

To enable these conversions, import them from the [CollectionConverters](https://www.scala-lang.org/api/{{ site.scala-version }}/scala/jdk/CollectionConverters$.html) object:

{% tabs java_scala_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=java_scala_1 %}

```scala
scala> import scala.jdk.CollectionConverters._
import scala.jdk.CollectionConverters._
```

{% endtab %}
{% tab 'Scala 3' for=java_scala_1 %}

```scala
scala> import scala.jdk.CollectionConverters.*
import scala.jdk.CollectionConverters.*
```

{% endtab %}
{% endtabs %}

This enables conversions between Scala collections and their corresponding Java collections by way of extension methods called `asScala` and `asJava`:

{% tabs java_scala_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=java_scala_2 %}

```scala
scala> import collection.mutable._
import collection.mutable._

scala> val jul: java.util.List[Int] = ArrayBuffer(1, 2, 3).asJava
val jul: java.util.List[Int] = [1, 2, 3]

scala> val buf: Seq[Int] = jul.asScala
val buf: scala.collection.mutable.Seq[Int] = ArrayBuffer(1, 2, 3)

scala> val m: java.util.Map[String, Int] = HashMap("abc" -> 1, "hello" -> 2).asJava
val m: java.util.Map[String,Int] = {abc=1, hello=2}
```

{% endtab %}
{% tab 'Scala 3' for=java_scala_2 %}

```scala
scala> import collection.mutable.*
import collection.mutable.*

scala> val jul: java.util.List[Int] = ArrayBuffer(1, 2, 3).asJava
val jul: java.util.List[Int] = [1, 2, 3]

scala> val buf: Seq[Int] = jul.asScala
val buf: scala.collection.mutable.Seq[Int] = ArrayBuffer(1, 2, 3)

scala> val m: java.util.Map[String, Int] = HashMap("abc" -> 1, "hello" -> 2).asJava
val m: java.util.Map[String,Int] = {abc=1, hello=2}
```

{% endtab %}
{% endtabs %}

Internally, these conversion work by setting up a "wrapper" object that forwards all operations to the underlying collection object. So collections are never copied when converting between Java and Scala. An interesting property is that if you do a round-trip conversion from, say a Java type to its corresponding Scala type, and back to the same Java type, you end up with the identical collection object you have started with.

Certain other Scala collections can also be converted to Java, but do not have a conversion back to the original Scala type:

```
Seq           =>    java.util.List
mutable.Seq   =>    java.util.List
Set           =>    java.util.Set
Map           =>    java.util.Map
```

Because Java does not distinguish between mutable and immutable collections in their type, a conversion from, say, `scala.immutable.List` will yield a `java.util.List`, where all mutation operations throw an "UnsupportedOperationException". Here's an example:

{% tabs java_scala_3 %}
{% tab 'Scala 2 and 3' for=java_scala_3 %}

```scala
scala> val jul = List(1, 2, 3).asJava
val jul: java.util.List[Int] = [1, 2, 3]

scala> jul.add(7)
java.lang.UnsupportedOperationException
    at java.util.AbstractList.add(AbstractList.java:148)
```

{% endtab %}
{% endtabs %}
