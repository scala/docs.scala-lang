---
layout: tour
title: 다형성 메소드

discourse: false

partof: scala-tour

num: 27
language: ko

next-page: type-inference
previous-page: implicit-conversions
---

스칼라의 메소드는 값과 타입 모두가 파라미터화 될 수 있다. 클래스 수준에서와 같이, 값 파라미터는 괄호의 쌍으로 묶이며 타입 파라미터는 브래킷의 쌍 안에 위치한다.

다음의 예제를 살펴보자.

    object PolyTest extends App {
      def dup[T](x: T, n: Int): List[T] =
        if (n == 0)
          Nil
        else
          x :: dup(x, n - 1)

      println(dup[Int](3, 4))
      println(dup("three", 3))
    }

오브젝트 `PolyTest`의 메소드 `dup`는 타입 `T`와 값 파라미터인 `x: T` 및 `n: Int`로 파라미터화 됐다. 프로그래머는 메소드 `dup`를 호출하며 필요한 파라미터를 전달하지만_(위의 프로그램 8번째 줄을 보자)_,  9번째 줄에서와 같이 프로그래머는 타입 파라미터를 명시적으로 전달할 필요가 없다. 메소드가 호출되는 시점에서 주어진 값 파라미터의 타입과 컨텍스트를 살펴봄으로써 이를 해결해준다.

트레잇 `App`은 간단한 테스트 프로그램을 작성하도록 설계됐으며, JVM의 코드 최적화 능력에 영향을 주기 때문에 프로덕션 코드에선 사용할 수 없음을 상기하자(스칼라 버전 2.8.x와 그 이전 버전). 그 대신 `def main()`을 사용하도록 하자.

윤창석, 이한욱 옮김
