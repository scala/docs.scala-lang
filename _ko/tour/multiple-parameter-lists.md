---
layout: tour
title: 커링
partof: scala-tour

num: 10
language: ko

next-page: case-classes
previous-page: nested-functions
---

메소드에는 파라미터 목록을 여럿 정의할 수 있다. 파라미터 목록의 수 보다 적은 파라미터로 메소드가 호출되면, 해당 함수는 누락된 파라미터 목록을 인수로 받는 새로운 함수를 만든다.

다음의 예제를 살펴보자.

    object CurryTest extends App {
    
      def filter(xs: List[Int], p: Int => Boolean): List[Int] =
        if (xs.isEmpty) xs
        else if (p(xs.head)) xs.head :: filter(xs.tail, p)
        else filter(xs.tail, p)
    
      def modN(n: Int)(x: Int) = ((x % n) == 0)
    
      val nums = List(1, 2, 3, 4, 5, 6, 7, 8)
      println(filter(nums, modN(2)))
      println(filter(nums, modN(3)))
    }

_주의: `modN` 메소드는 두 번의 `filter` 호출에서 부분적으로 사용됐다. 즉, 오직 첫 번째 인수만이 실제로 사용됐다. `modN(2)`라는 구문은 `Int => Boolean` 타입의 함수를 만들기 때문에 `filter` 함수의 두 번째 인수로 사용할 수 있게 된다._

다음은 위 프로그램의 결과다.

    List(2,4,6,8)
    List(3,6)

윤창석, 이한욱 옮김
