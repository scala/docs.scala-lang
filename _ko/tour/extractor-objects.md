---
layout: tour
title: 추출자 오브젝트

discourse: false

partof: scala-tour

num: 15
language: ko

next-page: generic-classes
previous-page: regular-expression-patterns
---

스칼라에선 캐이스 클래스와 상관 없이 패턴을 정의할 수 있다. 이런 측면에서 추출자라 불리는 unapply라는 이름의 메소드를 정의한다. 예를 들어, 다음의 코드는 추출자 오브젝트 Twice를 정의한다.

    object Twice {
      def apply(x: Int): Int = x * 2
      def unapply(z: Int): Option[Int] = if (z%2 == 0) Some(z/2) else None
    }

    object TwiceTest extends App {
      val x = Twice(21)
      x match { case Twice(n) => Console.println(n) } // prints 21
    }

여기선 두 가지 구문적 컨벤션을 사용했다.

패턴 `case Twice(n)`는 `Twice.unapply`를 호출하는데, 이는 짝수와의 매칭에 사용된다. `unapply`의 반환 값은 인수가 매칭됐는지 여부와 다른 하위 값을 더 매칭해 나가야 할지를 알려준다. 여기선 하위 값이 `z/2`이다.

`apply` 메소드는 패턴 매칭에 필수 요소가 아니며, 단지 생성자를 흉내내기 위해 사용된다.  `val x = Twice(21)`는 `val x = Twice.apply(21)`로 확장된다.

`unapply`의 반환 값은 반드시 다음 중에서 선택해야 한다.

* 단순한 테스트라면 `Boolean`을 반환한다. `case even()`이 한 예다.
* 타입 T의 단일 하위 값을 반환한다면, `Option[T]`를 반환한다.
* 여러 하위 값 `T1,...,Tn`를 반환하고 싶다면, 이를 `Option[(T1,...,Tn)]`과 같이 튜플로 묶어준다.

때론 하위 값의 개수가 미리 고정돼 시퀀스를 반환하고 싶을 때도 있다. 이런 이유로 `unapplySeq`를 통해 패턴을 정의할 수 있다. 마지막 하위 값의 타입 `Tn`은 반드시 `Seq[S]`여야 한다. 이 기법은 `case List(x1, ..., xn)`과 같은 패턴에 사용된다.

추출자는 코드의 유지 관리성을 향상시켜준다. 더욱 자세한 내용은 Emir, Odersky, Willians의 ["패턴을 통한 오브젝트의 매칭"](https://infoscience.epfl.ch/record/98468/files/MatchingObjectsWithPatterns-TR.pdf)(2007년 1월) 4장을 읽어보도록 하자.

윤창석, 이한욱 옮김
