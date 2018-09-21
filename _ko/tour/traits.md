---
layout: tour
title: 트레잇

discourse: false

partof: scala-tour

num: 5
language: ko

next-page: tuples
previous-page: classes
---

트레잇은 자바의 인터페이스와 유사하며, 지원되는 메소드의 서명을 지정해 객체의 타입을 정의하는 데 사용한다. 자바와는 달리, 스칼라에선 트레잇의 일부만 구현할 수도 있다. 다시 말해, 일부 메소드를 선택해 기본 구현 내용을 사전에 정의할 수 있다. 클래스와는 달리, 트레잇은 생성자 파라미터를 가질 수 없다.
다음의 예를 살펴보자.
 
    trait Similarity {
      def isSimilar(x: Any): Boolean
      def isNotSimilar(x: Any): Boolean = !isSimilar(x)
    }
 
이 트레잇은 `isSimilar`와 `isNotSimilar`라는 두 메소드로 구성된다. 메소드 `isSimilar`의 구현은 제공되지 않지만(자바의 abstract와 같다), 메소드 `isNotSimilar`에선 실제로 구현 내용을 정의하고 있다. 그 결과, 이 트레잇과 결합되는 클래스는 오직 `isSimilar`의 실제 구현만을 제공하면 된다. `isNotSimilar`의 행위는 트레잇에서 바로 상속받는다. 일반적으로 트레잇은 [믹스인 클래스 컴포지션](mixin-class-composition.html)을 통해 [클래스](classes.html)(또는 또 다른 트레잇)와 결합된다.
 
    class Point(xc: Int, yc: Int) extends Similarity {
      var x: Int = xc
      var y: Int = yc
      def isSimilar(obj: Any) =
        obj.isInstanceOf[Point] &&
        obj.asInstanceOf[Point].x == x
    }
    object TraitsTest extends App {
      val p1 = new Point(2, 3)
      val p2 = new Point(2, 4)
      val p3 = new Point(3, 3)
      println(p1.isNotSimilar(p2))
      println(p1.isNotSimilar(p3))
      println(p1.isNotSimilar(2))
    }
 
이 프로그램의 실행 결과는 다음과 같다.

    false
    true
    true

윤창석, 이한욱 옮김
