---
layout: tutorial
title: 익명 함수 구문

discourse: true

tutorial: scala-tour
categories: tour
num: 6
language: ko
---

스칼라를 사용하면 비교적 간결한 구문을 통해 익명 함수를 정의할 수 있다. 다음 표현식은 정수의 지정 함수를 만들어준다.

    (x: Int) => x + 1

이는 다음의 익명 클래스 정의를 축약한 표현이다.

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

마찬가지로 여러 파라미터의 함수를 정의하거나:

    (x: Int, y: Int) => "(" + x + ", " + y + ")"

파라미터가 없는 함수를 정의할 수도 있다:

    () => { System.getProperty("user.dir") }

매우 간결하게 함수 타입을 작성하는 방법도 있다. 다음은 위에서 정의한 세 함수의 타입이다.

    Int => Int
    (Int, Int) => String
    () => String

이 구문은 다음 타입을 축약한 표현이다.

    Function1[Int, Int]
    Function2[Int, Int, String]
    Function0[String]

윤창석, 이한욱 옮김