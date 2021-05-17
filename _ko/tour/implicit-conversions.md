---
layout: tour
title: 암시적 변환
partof: scala-tour

num: 26
language: ko

next-page: polymorphic-methods
previous-page: implicit-parameters
---

타입 `S`에서 타입 `T`로의 암시적 변환은 타입이 함수 `S => T`인 암시적 값이나 해당 타입으로 변환 가능한 암시적 메소드로 정의된다.

암시적 변환은 두 가지 상황에 적용된다.

* 표현식 `e`의 타입이 `S`이고, `S`는 표현식의 기대 타입 `T`를 따르지 않을 때.
* 타입이 `S`인 `e`의 `e.m`을 선택한 상황에서, 선택자 `m`이 `S`의 멤버가 아닐 때.


첫 번째 경우, `e`에 적용되며 결과 타입이 `T`인 변환 `c`를 찾는다.
두 번째 경우, `e`에 적용되며 결과에 `m`이라는 이름의 멤버를 포함하는 변환 `c`를 찾는다.

암시적 메서드인 `List[A] => Ordered[List[A]]`와 `Int => Ordered[Int]`가 범위 내에 있을 경우, 아래와 같이 타입이 `List[Int]`인 두 리스트의 연산은 허용된다:

    List(1, 2, 3) <= List(4, 5)

`scala.Predef.intWrapper`는 암시적 메서드 암시적 메서드 `Int => Ordered[Int]`를 자동으로 제공한다. 다음은 암시적 메서드 `Int => Ordered[Int]`의 예시이다.

    import scala.language.implicitConversions
    
    implicit def list2ordered[A](x: List[A])
        (implicit elem2ordered: A => Ordered[A]): Ordered[List[A]] =
      new Ordered[List[A]] {
        // 더 유용한 구현으로 대체하시오
        def compare(that: List[A]): Int = 1
      }

암시적으로 임포트되는 객체 `scala.Predef`는 자주 사용되는 타입의 별칭(예: `scala.collection.immutable.Map`의 별칭 `Map`)과 메소드(예: `assert`), 그리고 여러 암시적 변환을 선언한다. 

예를 들면, `java.lang.Integer`를 기대하는 자바 메서드를 호출할 때, `scala.Int`를 대신 넘겨도 된다. 그 이유는 Predef가 아래 암시적 변환을 포함하기 때문이다.

```scala mdoc
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

암시적 변환이 무분별하게 사용될 경우 잠재적인 위험을 가질 수 있기 때문에, 컴파일러는 암시적 변환의 선언을 컴파일할 시 이를 경고한다.

경고를 끄기 위해서는 아래 중 하나를 선택해야 한다:

* 암시적 변환의 정의가 있는 범위 내에서 `scala.language.implicitConversions` 임포트
* `-language:implicitConversions` 옵션으로 컴파일러 실행

컴파일러가 변환을 적용할 때에는 경고가 발생하지 않는다.


윤창석, 이한욱 옮김, 고광현 업데이트
