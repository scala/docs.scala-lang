---
layout: tour
title: 중첩 함수
partof: scala-tour

num: 9
language: ko

next-page: multiple-parameter-lists
previous-page: higher-order-functions
---

스칼라에선 중첩 함수를 정의할 수 있다. 다음 오브젝트는 정수의 리스트에서 지정된 값보다 작은 값을 값을 추출해주는 `filter` 함수를 제공한다.

    object FilterTest extends App {
      def filter(xs: List[Int], threshold: Int) = {
        def process(ys: List[Int]): List[Int] =
          if (ys.isEmpty) ys
          else if (ys.head < threshold) ys.head :: process(ys.tail)
          else process(ys.tail)
        process(xs)
      }
      println(filter(List(1, 9, 2, 8, 3, 7, 4), 5))
    }

_주의: 중첩 함수 `process`는 `filter`의 파라미터 값으로써 외부 범위에서 정의된 `threshold`를 참조한다._

이 프로그램의 실행 결과는 다음과 같다.

    List(1,2,3,4)

윤창석, 이한욱 옮김
