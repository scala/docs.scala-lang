---
layout: tour
title: 암시적 파라미터
 
discourse: false

partof: scala-tour

num: 25
language: ko

next-page: implicit-conversions
previous-page: self-types
---

_암시적 파라미터_ 를 갖는 메서드 역시 다른 일반적인 메서드와 마찬가지로 인수를 적용할 수 있다. 이런 경우 implicit 키워드는 아무런 영향을 미치지 않는다. 하지만, 이 경우에 암시적 파라미터에 주는 인수를 생략한다면, 그 생략된 인수는 자동적으로 제공될 것이다.

실제로 암시적 파라미터가 넘겨받을 수 있는 인수의 종류는 두 가지로 나눌 수 있다: 

* 첫째, 메서드가 호출되는 시점에서 prefix 없이 접근할 수 있고 암시적 정의나 암시적 파라미터로 표시된 모든 식별자 x 
* 둘째, 암시적(implicit)이라고 표시된 암시적 파라미터의 타입과 관련된 모듈의 모든 멤버

아래 예제에서는 모노이드의 `add`와 `unit`메서드를 이용해서 리스트 항목들의 합을 구하는 `sum` 메서드를 정의한다. 
암시적 값은 최상위 레벨이 될 수 없고 템플릿의 멤버여야만 한다는 점에 주의하자.
 
    /** 이 예제는 어떻게 암묵적인 파라미터들이 동작하는지 보여주기 위해, 추상적인 수학으로부터 나온 구조를 사용한다. 하위 그룹은 관련된 연산(add를 말함/한쌍의 A를 합치고 또다른 A를 리턴)을 가진 집합 A에 대한 수학적인 구조이다. */
    abstract class SemiGroup[A] {
      def add(x: A, y: A): A
    }
    /** monoid는 A의 구분된 요소(unit을 말함/A의 어떤 다른 요소와 합산될때, 다른 요소를 다시 리턴하는)를 가진 하위 그룹이다 */
    abstract class Monoid[A] extends SemiGroup[A] {
      def unit: A
    }
    object ImplicitTest extends App {
      /** 암묵적 파라미터들의 동작을 보여주기 위해서, 우리는 먼저 문자열과 숫자에 대한 monoid를 정의했다. implicit 키워드는 해당하는 object가 암묵적으로 어떤 함수의 implicit으로 표시된 파라미터에 이 scope안에서 사용될수 있음을 나타낸다. */
      implicit object StringMonoid extends Monoid[String] {
        def add(x: String, y: String): String = x concat y
        def unit: String = ""
      }
      implicit object IntMonoid extends Monoid[Int] {
        def add(x: Int, y: Int): Int = x + y
        def unit: Int = 0
      }
      /** 이 메서드는 List[A]를 가지며 A를 리턴한다. 그리고 리턴된 A는 전체 리스트에 걸쳐, 지속적으로 monoid 연산이 적용되 합쳐진 값을 이야기 한다. 파라미터 m을 암시적으로 만든다는 것은, 우리가 반드시 호출 시점에 xs파라미터를 제공해야한다는 것을 의미하고, 그 이후에 우리가 List[A]를 가진다면, A가 실제로 어떤 타입인지, 어떤타입의 Monoid[A]가 필요한지도 알게 된다. 그 후, 현재 scope에서 어떤 val 또는 object가 해당 타입을 가지고 있는지 암묵적으로 알게 되며, 명시적으로 표현할 필요 없이 그것을 사용할 수 있다. */
      def sum[A](xs: List[A])(implicit m: Monoid[A]): A =
        if (xs.isEmpty) m.unit
            else m.add(xs.head, sum(xs.tail))

      /** 아래코드에서 우리는 각각 하나의 파라미터로 sum을 두번 호출한다. sum의 두번째 파라미터인 m이 암시적이기 때문에 그 값은 현재 scope에서 각 케이스마다 요구되는 monoid의 타입을 기준으로 탐색된다. 두 표현은 완전히 계산될 수 있음을 의미한다. */
      println(sum(List(1, 2, 3)))          // uses IntMonoid implicitly
      println(sum(List("a", "b", "c")))    // uses StringMonoid implicitly
    }

아래는 이 스칼라 프로그램의 결과이다. 

    6
    abc

윤창석, 이한욱, 고광현 옮김
