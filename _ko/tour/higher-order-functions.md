---
layout: tour
title: 고차 함수

discourse: false

partof: scala-tour

num: 7
language: ko

next-page: nested-functions
previous-page: mixin-class-composition
---

스칼라는 고차 함수의 정의를 허용한다. 이런 함수는 _다른 함수를 파라미터로 받거나_, 수행의 _결과가 함수다_. 다음과 같은 함수 `apply`는 다른 함수 `f`와 값 `v`를 받아서 함수 `f`를 `v`에 적용한다.

    def apply(f: Int => String, v: Int) = f(v)

_주의: 문맥적으로 함수가 필요하다면, 메소드는 자동으로 이에 맞게 강제된다._

다음은 또 다른 예제다.

    class Decorator(left: String, right: String) {
      def layout[A](x: A) = left + x.toString() + right
    }

    object FunTest extends App {
      def apply(f: Int => String, v: Int) = f(v)
      val decorator = new Decorator("[", "]")
      println(apply(decorator.layout, 7))
    }

실행 결과는 다음과 같다.

    [7]

이 예제에서 메소드 `decorator.layout`은 메소드 `apply`에서 요구하는 바와 같이 타입 `Int => String`의 값으로 자동 강제된다. 메소드 `decorator.layout`이 _다형성 메소드_(즉, 자신의 서명 타입 중 일부를 추상화하는)이고, 스칼라 컴파일러는 가장 적합한 메소드 타입을 인스턴스화 해야만 한다는 점을 명심하자.

윤창석, 이한욱 옮김
