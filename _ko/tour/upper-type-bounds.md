---
layout: tour
title: 상위 타입 경계
partof: scala-tour

num: 19
language: ko

next-page: lower-type-bounds
previous-page: variances
---

스칼라에선 [타입 파라미터](generic-classes.html) 와 [추상 타입](abstract-type-members.html)의 타입 경계를 제한할 수 있다. 이런 타입 경계는 타입 변수의 콘크리트 값을 제한하고, 해당 타입의 멤버에 관한 정보를 추가할 수도 있다. _상위 타입 경계_ `T <: A`는 타입 변수 `T`를 선언하면서 `A`의 서브타입을 참조하고 있다. 다음은 다형성 메소드 `findSimilar`의 구현을 위해 상위 타입 경계를 사용한 예제다.

    trait Similar {
      def isSimilar(x: Any): Boolean
    }
    case class MyInt(x: Int) extends Similar {
      def isSimilar(m: Any): Boolean =
        m.isInstanceOf[MyInt] &&
        m.asInstanceOf[MyInt].x == x
    }
    object UpperBoundTest extends App {
      def findSimilar[T <: Similar](e: T, xs: List[T]): Boolean =
        if (xs.isEmpty) false
        else if (e.isSimilar(xs.head)) true
        else findSimilar[T](e, xs.tail)
      val list: List[MyInt] = List(MyInt(1), MyInt(2), MyInt(3))
      println(findSimilar[MyInt](MyInt(4), list))
      println(findSimilar[MyInt](MyInt(2), list))
    }

상위 타입 경계 어노테이션이 없었다면 메소드 `findSimilar`에서 `isSimilar` 메소드를 호출할 수 없었을 것이다. 
하위 타입 경계의 사용법은 [이 곳](lower-type-bounds.html)에서 논의한다.

윤창석, 이한욱 옮김
