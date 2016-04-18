---
layout: overview-large
title: 스칼라 컬렉션 라이브러리 소개

disqus: true

partof: collections
num: 1
languages: [ja, zh-cn, ko]
---

**Martin Odersky, and Lex Spoon**

In the eyes of many, the new collections framework is the most significant
change in the Scala 2.8 release. Scala had collections before (and in fact the new
framework is largely compatible with them). But it's only 2.8 that
provides a common, uniform, and all-encompassing framework for
collection types.

많은 사람들이 스칼라 2.8에서 가장 커다란 변화 중 하나로 새 컬렉션 프레임워크를 꼽는다.
스칼라에는 이전에도 컬렉션 프레임워크가 있었으나 새 프레임워크는 모든 컬렉션 타입을 아울러
통일된 형태의 프레임워크를 제공한다는 점에서 다르다(물론 새 프레임워크는 기존의 것과 대부분 호환된다).

Even though the additions to collections are subtle at first glance,
the changes they can provoke in your programming style can be
profound.

In fact, quite often it is
    as if you work on a higher-level
    with the basic building blocks of a program
    being whole collections
    instead of their elements.

This new style of programming requires some
adaptation. Fortunately, the adaptation is helped by several nice
properties of the new Scala collections. They are easy to use,
concise, safe, fast, universal.

처음 언듯 봐서는 기존과 크게 달라진게 없어 보일지도 모르지만,
새 프레임워크는 여러분의 프로그래밍 스타일을 크게 바꿔 놓을 만큼 커다란 영향력을 갖고 있다.

이런 새로운 프로그래밍 스타일은 약간의 적응이 필요하다.
다행스럽게도, 아래에서 설명할 프레임워크의 몇몇 새로운 특성들이 여러분을 쉽게 적응할 수 있게 도와 줄 것이다.

**쉬운 사용:** A small vocabulary of 20-50 methods is
enough to solve most collection problems in a couple of operations.
몇십개 정도의 데이터만으로 이루어진 컬렉션 문제들은 대체로 한 두 번의 조작만으로도 충분히 해결할 수 있다.

No need to wrap your head around complicated looping structures or recursions.
더이상 복잡한 반복문과 재귀호출에 머리를 싸매며 괴로워 할 필요가 없어졌다.

Persistent collections and side-effect-free operations mean
that you need not worry about accidentally corrupting existing
collections with new data.
유지되는 컬렉션과 부수적인 작용이 없는 컬렉션 조작은
여러분이 더이상 데이터 조작으로 인한 충돌에 대해 걱정을 하지 않아도 된다는 것을 의미한다.

Interference between iterators and collection updates is eliminated.
서로간에 영향을 주는 이터레이션 및 컬렉션 업데이트가 사라졌다.

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
efficient. You might be able to do a little bit better with carefully
hand-tuned data structures and operations, but you might also do a lot
worse by making some suboptimal implementation decisions along the
way.  What's more, collections have been recently adapted to parallel
execution on multi-cores. Parallel collections support the same
operations as sequential ones, so no new operations need to be learned
and no code needs to be rewritten. You can turn a sequential collection into a
parallel one simply by invoking the `par` method.

**Universal:** Collections provide the same operations on
any type where it makes sense to do so. So you can achieve a lot with
a fairly small vocabulary of operations. For instance, a string is
conceptually a sequence of characters. Consequently, in Scala
collections, strings support all sequence operations. The same holds
for arrays.

**Example:** Here's one line of code that demonstrates many of the 
advantages of Scala's collections.

    val (minors, adults) = people partition (_.age < 18)

It's immediately clear what this operation does: It partitions a
collection of `people` into `minors` and `adults` depending on
their age. Because the `partition` method is defined in the root
collection type `TraversableLike`, this code works for any kind of
collection, including arrays. The resulting `minors` and `adults`
collections will be of the same type as the `people` collection.

This code is much more concise than the one to three loops required for
traditional collection processing (three loops for an array, because
the intermediate results need to be buffered somewhere else).  Once
you have learned the basic collection vocabulary you will also find
writing this code is much easier and safer than writing explicit
loops. Furthermore, the `partition` operation is quite fast, and will
get even faster on parallel collections on multi-cores.  (Parallel
collections have been released
as part of Scala 2.9.)

This document provides an in depth discussion of the APIs of the
Scala collections classes from a user perspective.  It takes you on
a tour of all the fundamental classes and the methods they define.
