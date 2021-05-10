---
layout: tour
title: 제네릭 클래스
partof: scala-tour

num: 17
language: ko

next-page: variances
previous-page: extractor-objects
---

자바 5(다른 이름은 JDK 1.5와 같이, 스칼라는 타입으로 파라미터화된 클래스의 빌트인 지원을 제공한다. 이런 제네릭 클래스는 특히 컬렉션 클래스의 개발에 유용하다. 이에 관한 예제를 살펴보자.

    class Stack[T] {
      var elems: List[T] = Nil
      def push(x: T): Unit =
        elems = x :: elems
      def top: T = elems.head
      def pop() { elems = elems.tail }
    }

클래스 `Stack`은 임의의 타입 `T`를 항목의 타입으로 하는 명령형(변경 가능한) 스택이다. 타입 파라미터는 올바른 항목(타입 `T` 인)만을 스택에 푸시하도록 강제한다. 마찬가지로 타입 파라미터를 사용해서 메소드 `top`이 항상 지정된 타입만을 반환하도록 할 수 있다.

다음은 스택을 사용하는 예다.

    object GenericsTest extends App {
      val stack = new Stack[Int]
      stack.push(1)
      stack.push('a')
      println(stack.top)
      stack.pop()
      println(stack.top)
    }

이 프로그램의 결과는 다음과 같다.

    97
    1

_주의: 제네릭 클래스의 서브타입은 *불가변*이다. 즉, 캐릭터 타입의 스택인 `Stack[Char]`를 정수형 스택인 `Stack[Int]`처럼 사용할 수는 없다. 실제로 캐릭터 스택에는 정수가 들어가기 때문에 이런 제약은 이상하게 보일 수도 있다. 결론적으로 `S = T`일 때만 `Stack[T]`가 `Stack[S]`의 서브타입일 수 있으며, 반대의 관계도 마찬가지로 성립해야 한다. 이런 특징이 상당히 큰 제약일 수 있기 때문에, 스칼라는 제네릭 타입의 서브타입을 지정하는 행위를 제어하기 위해 [타입 파라미터 어노테이션 방법](variances.html)을 제공한다._

윤창석, 이한욱 옮김
