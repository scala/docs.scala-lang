---
layout: tour
title: 패턴 매칭
partof: scala-tour

num: 12
language: ko

next-page: singleton-objects
previous-page: case-classes
---

스칼라는 범용적 빌트인 패턴 매칭 기능을 제공한다. 이는 우선 매칭 정책에 따라 어떤 종류의 데이터든 매칭할 수 있도록 해준다.
다음은 정수 값을 매칭하는 방법에 관한 간단한 예제다.

    object MatchTest1 extends App {
      def matchTest(x: Int): String = x match {
        case 1 => "one"
        case 2 => "two"
        case _ => "many"
      }
      println(matchTest(3))
    }

`case` 명령문을 포함하고 있는 블록은 정수를 문자열로 매핑하는 함수를 정의한다. `match`라는 키워드는 함수(위에서 살펴본 패턴 매칭 함수와 같은)를 오브젝트에 적용하는 편리한 방법을 제공한다.

다음은 두 번째 예제로 여러 타입의 패턴에 맞춰 값을 매칭한다.

    object MatchTest2 extends App {
      def matchTest(x: Any): Any = x match {
        case 1 => "one"
        case "two" => 2
        case y: Int => "scala.Int"
      }
      println(matchTest("two"))
    }

첫 번째 `case`는 `x`가 정수 값 `1`일 때 매칭된다. 두 번째 `case`는 `x`가 문자열 `"two"`일 때 매칭된다. 세 번째 케이스는 타입이 지정된 패턴으로 구성되며, 모든 정수와 매칭돼 선택자 값 `x`를 정수 타입 변수 `y`로 연결한다.

스칼라의 패턴 매칭 명령문은 [케이스 클래스](case-classes.html)를 통해 표현되는 대수 타입과 매칭할 때 가장 유용하다.
또한 스칼라는 [추출자 오브젝트](extractor-objects.html)의 `unapply` 메소드를 사용해, 독립적인 케이스 클래스로 패턴을 정의할 수 있도록 해준다.

윤창석, 이한욱 옮김
