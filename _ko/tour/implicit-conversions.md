---
layout: tour
title: 암시적 변환

discourse: false

partof: scala-tour

num: 26
language: ko

next-page: polymorphic-methods
previous-page: implicit-parameters
---

타입 `S`로부터 타입 `T`로의 암시적 변환는 함수 타입 `S => T`의 암시적 값이나 해당 타입으로 변환 가능한 암시적 메소드로 정의된다.

암시적 변환은 두 가지 상황에 적용된다.

* 표현식 `e`의 타입이 `S`이고, `S`는 표현식의 기대 타입 `T`를 따르지 않을 때.
* `e`의 타입이 `T`인 `e.m`를 선택한 상황에서, 선택자 `m`이 `T`의 멤버가 아닐 때.


첫 번째 경우에서 변환 `c`가 `e`에 적용되며, 결과 타입이 `T`를 따르는지 탐색한다.
두 번째 경우에선 변환 `c`가 `e`에 적용되며, 결과가 `m`이라는 이름의 멤버를 포함하고 있는지 탐색한다.

타입이 `List[Int]`인 두 리스트 xs와 ys의 아래 연산은 허용된다:

    xs <= ys

아래에 정의된 암시적 메소드 `list2ordered`와 `int2ordered`가 범위 안에 있다고 가정한다.

    implicit def list2ordered[A](x: List[A])
        (implicit elem2ordered: a => Ordered[A]): Ordered[List[A]] =
      new Ordered[List[A]] { /* .. */ }
    
    implicit def int2ordered(x: Int): Ordered[Int] = 
      new Ordered[Int] { /* .. */ }

암시적으로 임포트되는 오브젝트 `scala.Predef`는 미리 정의된 여러 타입(예: `Pair`)과 메소드(예: `assert`)뿐만 아니라 여러 뷰도 함께 선언한다. 

예를들면, `java.lang.Integer`를 기대하는 자바 메서드를 호출할때, `scala.Int`를 대신 넘겨도 무방하다. 그 이유는 Predef가 아래 암시적 변환들을 포함하기 때문이다.

```tut
import scala.language.implicitConversions

implicit def int2Integer(x: Int) =
  java.lang.Integer.valueOf(x)
```

암시적 변환이 무분별하게 사용될 경우 잠재적인 위험을 가질 수 있기 때문에, 컴파일러는 암시적 변환의 선언을 컴파일할때 경고한다.

To turn off the warnings take either of these actions:
경고를 끄기 위해서는 아래 중 하나를 선택해야 한다.

* `scala.language.implicitConversions` 를 암시적 변환의 선언이 있는 범위로 import
* `-language:implicitConversions` 옵션으로 컴파일러 실행

변환이 컴팡일러에 의해 적용될때 경고가 발생하지 않는다.


윤창석, 이한욱 옮김, 고광현 업데이트
