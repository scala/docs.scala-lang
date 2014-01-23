---
layout: tutorial
title: Lower Type Bounds

disqus: true

tutorial: scala-tour
num: 26
---

While [upper type bounds](upper-type-bounds.html) limit a type to a subtype of another type, *lower type bounds* declare a type to be a supertype of another type. The term `T >: A` expresses that the type parameter `T` or the abstract type `T` refer to a supertype of type `A`.

Here is an example where this is useful:

    case class ListNode[T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend(elem: T): ListNode[T] =
        ListNode(elem, this)
    }

The program above implements a linked list with a prepend operation. Unfortunately, this type is invariant in the type parameter of class `ListNode`; i.e. type `ListNode[String]` is not a subtype of type `List[Object]`. With the help of [variance annotations](variances.html) we can express such a subtype semantics:

    case class ListNode[+T](h: T, t: ListNode[T]) { ... }

Unfortunately, this program does not compile, because a covariance annotation is only possible if the type variable is used only in covariant positions. Since type variable `T` appears as a parameter type of method `prepend`, this rule is broken. With the help of a *lower type bound*, though, we can implement a prepend method where `T` only appears in covariant positions.

Here is the corresponding code:

    case class ListNode[+T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend[U >: T](elem: U): ListNode[U] =
        ListNode(elem, this)
    }

_Note:_ the new `prepend` method has a slightly less restrictive type. It allows, for instance, to prepend an object of a supertype to an existing list. The resulting list will be a list of this supertype.

Here is some code which illustrates this:

    object LowerBoundTest extends App {
      val empty: ListNode[Null] = ListNode(null, null)
      val strList: ListNode[String] = empty.prepend("hello")
                                           .prepend("world")
      val anyList: ListNode[Any] = strList.prepend(12345)
    }

