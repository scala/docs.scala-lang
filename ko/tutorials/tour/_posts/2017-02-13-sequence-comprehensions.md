---
layout: tutorial
title: 시퀀스 컴프리헨션

discourse: false

tutorial: scala-tour
categories: tour
num: 16
language: ko
---

스칼라는 *시퀀스 컴프리헨션(sequence comprehensions)*을 표현하기 위한 간편한 문법을 제공한다. 컴프리헨션은 `for (enumerators) yield e`와 같은 형태를 가지며, 여기서 `enumerators`는 세미콜론으로 구분된 이뉴머레이터들을 뜻한다. *이뉴머레이터*는 새로운 변수를 정의하는 생성자이거나 필터이다. 컴프리헨션은 생성된 각각의 새로운 변수에 대해서 그 몸체인 `e`를 계산하여 그 값들의 시퀀스를 반환한다. 

예제 :
 
    object ComprehensionTest1 extends App {
      def even(from: Int, to: Int): List[Int] =
        for (i <- List.range(from, to) if i % 2 == 0) yield i
      Console.println(even(0, 20))
    }
 
위의 함수 안에 있는 for-구문은 `int` 타입의 변수 `i`를 정의하고 이어 `i`는 리스트 `List(from, from+1, ..., to - 1)`의 모든 값에 각각 대응된다. 가드 `if i % 2 == 0`는 홀수를 필터링하여 제외하여 (i만으로 이루어진) 몸체가 짝수에 대해서만 계산되도록 한다. 그 결과, 전체 for-구문은 짝수 리스트를 반환하게 된다. 

이 프로그램의 결과값은 다음과 같다 :

    List(0, 2, 4, 6, 8, 10, 12, 14, 16, 18)

좀 더 복잡한 예제를 보자. 아래는 `0`과 `n-1`사이의 숫자로 이루어진 모든 순서쌍 중에서 그 합이 주어진 값 `v`와 같은 순서쌍을 계산하는 예제이다.
 
    object ComprehensionTest2 extends App {
      def foo(n: Int, v: Int) =
        for (i <- 0 until n;
             j <- i until n if i + j == v) yield
          (i, j);
      foo(20, 32) foreach {
        case (i, j) =>
          println(s"($i, $j)")
      }
    }
 
이 예제는 컴프리헨션이 리스트에만 국한되지 않는다는 것을 보여준다. 리스트 대신에 이 프로그램에서는 이터레이터를 사용하였다. `withFilter`, `map`, `flatMap`기능을 지원하는 모든 데이터타입이 시퀀스 컴프리헨션에 이용될 수 있다.

아래는 이 프로그램의 결과값이다: 

    (13, 19)
    (14, 18)
    (15, 17)
    (16, 16)

시퀀스 컴프리헨션의 특별한 형태로 `Unit`을 반환하는 경우도 있다. (???어려워요. binding 뭐라고하지...) 이러한 시퀀스 익스프레션을 사용할 때에는 `yield` 키워드를 사용하지 않아야 한다. 아래 예제는 위의 예제와 같은 결과값을 출력하지만 `Unit`을 반환하는, 시퀀스 컴프리헨션의 특수형태를 사용하였다. 
 
    object ComprehensionTest3 extends App {
      for (i <- Iterator.range(0, 20);
           j <- Iterator.range(i, 20) if i + j == 32)
        println(s"($i, $j)")
    }

윤창석, 이한욱 옮김, 고광현 수정
