---
layout: tour
title: 로컬 타입 추론
partof: scala-tour

num: 28
language: ko

next-page: operators
previous-page: polymorphic-methods
---

스칼라는 프로그래머가 특정한 타입 어노테이션을 생략할 수 있도록 해주는 빌트인 타입 추론 기능을 갖추고 있다. 예를 들어, 스칼라에선 컴파일러가 변수의 초기화 표현식으로부터 타입을 추론할 수 있기 때문에 변수의 타입을 지정할 필요가 없을 때가 많다. 또한 메소드의 반환 타입은 본문의 타입과 일치하기 때문에 이 반환 타입 역시 컴파일러가 추론할 수 있고, 주로 생략된다.

다음 예제를 살펴보자.

    object InferenceTest1 extends App {
      val x = 1 + 2 * 3         // x의 타입은 Int다.
      val y = x.toString()      // y의 타입은 String이다.
      def succ(x: Int) = x + 1  // 메소드 succ는 Int 값을 반환한다.
    }

재귀 메소드의 경우는 컴파일러가 결과 타입을 추론할 수 없다. 다음 프로그램에선 이와 같은 이유로 컴파일러가 추론할 수 없다.

    object InferenceTest2 {
      def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
    }

[다형성 메소드](polymorphic-methods.html)를 호출하거나 [제네릭 클래스](generic-classes.html)를 인스턴스화 할 때 반드시 타입을 지정할 의무는 없다. 스칼라 컴파일러는 컨텍스트와 실제 메소드/생성자 파라미터로부터 생략된 타입 파라미터를 추론한다.

다음 예제는 이를 나타낸 예제다.

    case class MyPair[A, B](x: A, y: B)
    object InferenceTest3 extends App {
      def id[T](x: T) = x
      val p = MyPair(1, "scala") // 타입: MyPair[Int, String]
      val q = id(1)              // 타입: Int
    }

이 프로그램의 마지막 두 줄은 추론된 타입을 명시적으로 나타낸 다음 코드와 동일하다.

    val x: MyPair[Int, String] = MyPair[Int, String](1, "scala")
    val y: Int = id[Int](1)

다음 프로그램에서 나타나는 문제와 같이, 일부 상황에선 스칼라의 타입 추론 기능에 의존하는 것은 상당히 위험할 수 있다.

    object InferenceTest4 {
      var obj = null
      obj = new Object()
    }

이 프로그램은 변수 `obj`의 타입 추론이 `Null`이기 때문에 컴파일되지 않는다. 해당 타입의 유일한 값이 `null`이기 때문에 이 변수는 다른 값을 나타낼 수 없다.

윤창석, 이한욱 옮김
