---
layout: tour
title: 타입 의존 클로저의 자동 구성

discourse: false

partof: scala-tour

num: 30
language: ko

next-page: annotations
previous-page: operators
---

스칼라에선 파라미터가 없는 함수의 이름을 메소드의 파라미터로 사용할 수 있다. 이런 메소드가 호출되면 파라미터가 없는 함수의 이름에 해당하는 실제 파라미터를 찾지 않고, 대신 해당 파라미터의 계산을 캡슐화한 무항 함수를 전달하게 된다(소위 말하는 *이름에 의한 호출* 연산).

다음 코드는 이 방식을 사용하는 방법을 보여준다.

    object TargetTest1 extends App {
      def whileLoop(cond: => Boolean)(body: => Unit): Unit =
        if (cond) {
          body
          whileLoop(cond)(body)
        }
      var i = 10
      whileLoop (i > 0) {
        println(i)
        i -= 1
      }
    }

`whileLoop` 함수는 `cond`와 `body`라는 두 파라미터를 받는다. 이 함수가 적용될 때 실제 파라미터는 계산되지 않는다. 대신 `whileLoop`의 내부에서 이 정형 파라미터를 사용할 때마다 암시적으로 생성된 무항 함수로 처리한다. 따라서 `whileLoop` 메소드는 재귀 구현의 방식에 맞춰 자바와 같은 while 반복문을 구현한다.

[중위/후위 연산자](operators.html)와 이 기법을 함께 사용해 좀 더 복잡한 명령문(보기 좋게 작성된)을 생성할 수 있다.

다음은 반복문을 제거한 명령문 구현이다.

    object TargetTest2 extends App {
      def loop(body: => Unit): LoopUnlessCond =
        new LoopUnlessCond(body)
      protected class LoopUnlessCond(body: => Unit) {
        def unless(cond: => Boolean) {
          body
          if (!cond) unless(cond)
        }
      }
      var i = 10
      loop {
        println("i = " + i)
        i -= 1
      } unless (i == 0)
    }

`loop` 함수는 단순히 반복문의 내용을 받아서 `LoopUnlessCond` 클래스의 인스턴스(반복문 내용에 해당하는 객체를 캡슐화한)를 반환한다. 해당 내용이 아직 계산되지 않았음을 유념하자. `LoopUnlessCond` 클래스는 *중위 연산자*로 사용할 수 있는 `unless`라는 메소드를 포함하고 있다. 이런 접근을 통해 상당히 자연스럽게 표현된 새로운 반복문을 완성하게 된다: `loop { < stats > } unless ( < cond > )`.

다음은 `TargetTest2`를 실행한 출력 결과다.

    i = 10
    i = 9
    i = 8
    i = 7
    i = 6
    i = 5
    i = 4
    i = 3
    i = 2
    i = 1

윤창석, 이한욱 옮김
