---
layout: tour
title: 합성 타입

discourse: false

partof: scala-tour

num: 23
language: ko

next-page: self-types
previous-page: abstract-types
---

때론 객체의 타입을 여러 다른 타입의 서브타입으로 표현해야 할 때가 있다. 스칼라에선 *합성 타입(Compound Types)*으로 표현될 수 있는데, 이는 객체 타입들의 교차점을 의미한다.

`Cloneable` 과 `Resetable`이라는 두 트레잇을 생각해보자:  

    trait Cloneable extends java.lang.Cloneable {
      override def clone(): Cloneable = { 
        super.clone().asInstanceOf[Cloneable]
      }
    }
    trait Resetable {
      def reset: Unit
    }

그리고 어떤 객체를 파라미터로 받아 복제한 뒤 원래의 객체를 초기화하는 `cloneAndReset` 이라는 함수를 작성하려고 한다:

    def cloneAndReset(obj: ?): Cloneable = {
      val cloned = obj.clone()
      obj.reset
      cloned
    }

여기에서 파라미터 `obj`의 타입이 무엇인가 하는 의문을 가질 수 있다. 만약 타입이 `Clonable`이라면 이 객체는 복제될(`Cloned`) 수 있지만 리셋될(`reset`) 수는 없다. 반면 타입이 `Resetable`이라면 이 객체를 리셋할(`reset`) 수는 있지만 `clone` 기능을 사용할 수는 없다. 이러한 상황에서 타입 캐스팅을 피하기 위해 두개의 타입 `Clonable`과 `Resetable` 모두를 지정해 줄 수 있다. 스칼라의 이러한 합성타입은 다음과 같이 쓰인다. : `Clonable with Resetable`

위의 함수를 다시 작성하면 다음과 같다.

    def cloneAndReset(obj: Cloneable with Resetable): Cloneable = {
      //...
    }

합성 타입은 여러 객체 타입으로 구성될 수 있고, 단일 리파인먼트를 가짐으로써 객체 멤버의 시그니처의 범위를 좁힐 수도 있다. 일반적인 형태는 `A with B with C ... { 리파인먼트 }`이다.

리파인먼트 사용 예제는 [추상 타입](abstract-types.html) 에 있다.  

윤창석, 이한욱 옮김, 고광현 수정
