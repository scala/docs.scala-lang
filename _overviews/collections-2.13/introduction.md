---
layout: multipage-overview
title: Introduction
partof: collections-213
overview-name: Collections

num: 1
next-page: overview

languages: [ru]
permalink: /overviews/collections-2.13/:title.html
---

The collections framework is the heart of the Scala 2.13 standard
library, also used in Scala 3.x.  It provides a common, uniform, and all-encompassing
framework for collection types.  This framework enables you to work
with data in memory at a high level, with the basic building blocks of
a program being whole collections, instead of individual elements.

This style of programming requires some learning. Fortunately,
the adaptation is helped by several nice properties of the Scala
collections. They are easy to use, concise, safe, fast, universal.

**Easy to use:** A small vocabulary of 20-50 methods is
enough to solve most collection problems in a couple of operations. No
need to wrap your head around complicated looping structures or
recursions. Persistent collections and side-effect-free operations mean
that you need not worry about accidentally corrupting existing
collections with new data.  Interference between iterators and
collection updates is eliminated.

**Concise:** You can achieve with a single word what used to
take one or several loops. You can express functional operations with
lightweight syntax and combine operations effortlessly, so that the result
feels like a custom algebra.

**Safe:** This one has to be experienced to sink in. The
statically typed and functional nature of Scala's collections means
that the overwhelming majority of errors you might make are caught at
compile-time. The reason is that (1) the collection operations
themselves are heavily used and therefore well
tested. (2) the usages of the collection operation make inputs and
output explicit as function parameters and results. (3) These explicit
inputs and outputs are subject to static type checking. The bottom line
is that the large majority of misuses will manifest themselves as type
errors. It's not at all uncommon to have programs of several hundred
lines run at first try.

**Fast:** Collection operations are tuned and optimized in the
libraries. As a result, using collections is typically quite
efficient. You might be able to do a little better with carefully
hand-tuned data structures and operations, but you might also do a lot
worse by making some suboptimal implementation decisions along the
way.

**Parallel**: The
[`scala-parallel-collections` module](https://index.scala-lang.org/scala/scala-parallel-collections/scala-parallel-collections)
provides parallel execution of collections operations across multiple cores.
Parallel collections generally support the same
operations as sequential ones.  You can turn a sequential collection into a
parallel one simply by invoking the `par` method.

**Universal:** Collections provide the same operations on
any type where it makes sense to do so. So you can achieve a lot with
a fairly small vocabulary of operations. For instance, a string is
conceptually a sequence of characters. Consequently, in Scala
collections, strings support all sequence operations. The same holds
for arrays.

**Example:** Here's one line of code that demonstrates many of the
advantages of Scala's collections.

{% tabs introduction_1 %}
{% tab 'Scala 2 and 3' for=introduction_1 %}
```
val (minors, adults) = people partition (_.age < 18)
```
{% endtab %}
{% endtabs %}

It's immediately clear what this operation does: It partitions a
collection of `people` into `minors` and `adults` depending on
their age. Because the `partition` method is defined in the root
collection type `IterableOps`, this code works for any kind of
collection, including arrays. The resulting `minors` and `adults`
collections will be of the same type as the `people` collection.

This code is much more concise than the one to three loops required for
traditional collection processing (three loops for an array, because
the intermediate results need to be buffered somewhere else).  Once
you have learned the basic collection vocabulary you will also find
writing this code is much easier and safer than writing explicit
loops.

Furthermore, the `partition` operation is quite fast, and can
be even faster on parallel collections on multiple cores.

This document provides an in depth discussion of the APIs of the
Scala collections classes from a user's perspective.  It takes you on
a tour of all the fundamental classes and the methods they define.
