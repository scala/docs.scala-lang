---
layout: tutorial
title: 암시적 파라미터
 
disqus: true

tutorial: scala-tour
num: 10
language: ko
---

_암시적 파라미터_ 를 갖는 메서드 역시 다른 일반적인 메서드와 마찬가지로 인수를 적용할 수 있다. 이런 경우 implicit 키워드는 아무런 영향을 미치지 않는다. 하지만, 이 경우에 암시적 파라미터에 주는 인수를 생략한다면, 그 생략된 인수는 자동적으로 제공될 것이다.

실제로 암시적 파라미터가 넘겨받을 수 있는 인수의 종류는 두 가지로 나눌 수 있다: 

* 첫째, 메서드가 호출되는 시점에서 prefix 없이 접근할 수 있고 암시적 정의나 암시적 파라미터로 표시된 모든 식별자 x 
* 둘째, 암시적(implicit)이라고 표시된 암시적 파라미터의 타입과 관련된 모듈의 모든 멤버

아래 예제에서는 모노이드의 `add`와 `unit`메서드를 이용해서 리스트 항목들의 합을 구하는 `sum` 메서드를 정의한다. 
암시적 값은 최상위 레벨이 될 수 없고 템플릿의 멤버여야만 한다는 점에 주의하자.
 
    abstract class SemiGroup[A] {
      def add(x: A, y: A): A
    }
    abstract class Monoid[A] extends SemiGroup[A] {
      def unit: A
    }
    object ImplicitTest extends App {
      implicit object StringMonoid extends Monoid[String] {
        def add(x: String, y: String): String = x concat y
        def unit: String = ""
      }
      implicit object IntMonoid extends Monoid[Int] {
        def add(x: Int, y: Int): Int = x + y
        def unit: Int = 0
      }
      def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
        if (xs.isEmpty) m.unit
        else m.add(xs.head, sum(xs.tail))

      println(sum(List(1, 2, 3)))
      println(sum(List("a", "b", "c")))
    }

아래는 이 스칼라 프로그램의 결과이다. 

    6
    abc

윤창석, 이한욱 옮김
