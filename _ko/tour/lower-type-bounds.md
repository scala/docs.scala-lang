---
layout: tour
title: 하위 타입 경계
partof: scala-tour

num: 20
language: ko

next-page: inner-classes
previous-page: upper-type-bounds
---

[상위 타입 경계](upper-type-bounds.html)가 특정 타입의 서브타입으로 타입을 제한한다면, *하위 타입 경계*는 대상 타입을 다른 타입의 슈퍼타입으로 선언한다. `T>:A`는 타입 파라미터 `T`나 추상 타입 `T`가 타입 `A`의 슈퍼타입임을 나타낸다.

상위 타입 경계를 유용하게 활용할 수 있는 예제를 살펴보자.

    case class ListNode[T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend(elem: T): ListNode[T] =
        ListNode(elem, this)
    }

이 프로그램은 앞쪽에 항목을 추가하는 동작을 제공하는 링크드 리스트를 구현하고 있다. 안타깝게도 클래스 `ListNode`의 타입 파라미터로 사용된 타입은 불변자이고, 타입 `ListNode[String]`은 `타입 List[Object]`의 서브타입이 아니다. 가변성 어노테이션의 도움을 받아서 이런 서브타입 관계의 시맨틱을 표현할 수 있다.

    case class ListNode[+T](h: T, t: ListNode[T]) { ... }

하지만 순가변성 어노테이션은 반드시 순가변 위치의 타입 변수로 사용돼야만 하기 때문에, 이 프로그램은 컴파일되지 않는다. 타입 변수 `T`가 메소드 `prepend`의 파라미터 타입으로 쓰였기 때문에 이 규칙이 깨지게 된다. 그렇지만 *하위 타입 경계*의 도움을 받는다면 `T`가 순가변 위치에만 나타나도록 `prepend` 메소드를 구현할 수 있다.

다음이 이를 적용한 코드다.

    case class ListNode[+T](h: T, t: ListNode[T]) {
      def head: T = h
      def tail: ListNode[T] = t
      def prepend[U >: T](elem: U): ListNode[U] =
        ListNode(elem, this)
    }

_주의:_ 새로운 `prepend` 메소드에선 타입의 제약이 조금 줄어들게 된다. 예를 들어 이미 만들어진 리스트에 슈퍼타입의 객체를 집어 넣을 수도 있다. 그 결과로 만들어지는 리스트는 이 슈퍼타입의 리스트다.

이에 관한 코드를 살펴보자.

    object LowerBoundTest extends App {
      val empty: ListNode[Null] = ListNode(null, null)
      val strList: ListNode[String] = empty.prepend("hello")
                                           .prepend("world")
      val anyList: ListNode[Any] = strList.prepend(12345)
    }

윤창석, 이한욱 옮김
