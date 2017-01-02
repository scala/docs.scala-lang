---
layout: tutorial
title: 뷰

disqus: true

tutorial: scala-tour
num: 32
language: ko
---

[암시적 파라미터](implicit-parameters.html)와 메소드는 _뷰_라고 불리는 암시적 변환을 정의할 수도 있다. 타입 `S`로부터 타입 `T`로의 뷰는 함수 타입 `S => T`의 암시적 값이나 해당 타입으로 변환 가능한 암시적 메소드로 정의된다.

뷰는 두 가지 상황에 적용된다.

* 표현식 `e`의 타입이 `S`이고, `S`는 표현식의 기대 타입 `T`를 따르지 않을 때.
* `e`의 타입이 `T`인 `e.m`를 선택한 상황에서, 선택자 `m`이 `T`의 멤버가 아닐 때.


첫 번째 경우에서 뷰 `v`가 `e`를 사용할 수 있고 결과 타입이 `T`를 따르는지 탐색한다.
두 번째 경우에선 뷰 `v`가 `e`를 사용할 수 있고 결과가 `m`이라는 이름의 멤버를 포함하고 있는지 탐색한다.

타입이 `List[Int]`인 두 리스트 xs와 ys의 다음과 같은 동작을 생각해보면:

    xs <= ys

아래에 정의된 암시적 메소드 `list2ordered`와 `int2ordered`가 범위 안에 있다고 가정했을 때야 비로소 위의 동작이 올바르게 동작한다.

    implicit def list2ordered[A](x: List[A])
        (implicit elem2ordered: a => Ordered[A]): Ordered[List[A]] =
      new Ordered[List[A]] { /* .. */ }
    
    implicit def int2ordered(x: Int): Ordered[Int] = 
      new Ordered[Int] { /* .. */ }
  
`list2ordered` 함수는 타입 파라미터의 _뷰 경계_를 사용해 나타낼 수도 있다.

    implicit def list2ordered[A <% Ordered[A]](x: List[A]): Ordered[List[A]] = ...
  
이에 따라 스칼라 컴파일러는 위에서 주어졌던 `list2ordered`의 정의와 동일한 코드를 생성한다.

암시적으로 임포트되는 오브젝트 `scala`Predef`는 미리 정의된 여러 타입(예, `Pair)과 메소드(예, `assert`)뿐만 아니라 여러 뷰도 함께 선언한다. 다음 예제는 미리 정의된 뷰 `charWrapper`의 쓰임을 보여주고 있다.

    final class RichChar(c: Char) {
      def isDigit: Boolean = Character.isDigit(c)
      // isLetter, isWhitespace, etc.
    }
    object RichCharTest {
      implicit def charWrapper(c: char) = new RichChar(c)
      def main(args: Array[String]) {
        println('0'.isDigit)
      }
    }


윤창석, 이한욱 옮김
