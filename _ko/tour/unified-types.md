---
layout: tour
title: 통합된 타입

discourse: false

partof: scala-tour

num: 3
language: ko

next-page: classes
previous-page: basics
---

자바와는 달리, 스칼라에선 모든 값이 객체다(숫자 값과 함수를 포함해). 스칼라는 클래스 기반이기 때문에 모든 값은 클래스의 인스턴스다. 다음의 다이어그램은 클래스 계층구조를 나타낸다.

![스칼라 타입 계층구조]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## 스칼라 클래스 계층구조 ##

모든 클래스의 슈퍼클래스인 `scala.Any`로부터 `scala.AnyVal`과 `scala.AnyRef`라는 두 서브클래스가 파생되며, 이 두 클래스는 각각 값 클래스와 참조 클래스를 대표한다. 모든 값 클래스는 미리 정의돼 있으며, 이는 자바와 같은 언어의 원시 타입에 해당한다. 다른 모든 클래스는 참조 타입으로 정의된다. 사용자 정의 클래스는 자동으로 참조 타입으로 정의되며, 이렇게 정의된 클래스는 항상 `scala.AnyRef`의 서브클래스(간접적)다. 스칼라의 모든 사용자 정의 클래스는 암시적으로 트레잇 `scala.ScalaObject`를 확장하고 있다. 스칼라가 실행되는 인프라(예, 자바 런타임 환경) 상의 클래스는 `scala.ScalaObject`를 확장하지 않는다. 스칼라를 자바 런타임 환경의 측면에 맞춰 생각해보자면 , `scala.AnyRef`는 `java.lang.Object`에 해당한다. 위의 다이어그램에는 값 클래스 사이의 암시적 변환을 의미하는 뷰도 함께 표현돼 있다.
다음은 다른 객체처럼 숫자와 문자와 불리언 값과 함수 또한 객체임을 보여주는 예제다.
 
    object UnifiedTypes extends App {
      val set = new scala.collection.mutable.LinkedHashSet[Any]
      set += "This is a string"  // 문자열을 추가한다
      set += 732                 // 숫자를 추가한다
      set += 'c'                 // 캐릭터를 추가한다
      set += true                // 불리언 값을 추가한다
      set += main _              // 메인 함수를 추가한다
      val iter: Iterator[Any] = set.iterator
      while (iter.hasNext) {
        println(iter.next.toString())
      }
    }

이 프로그램은 `App`을 확장한 최상위 싱글턴 오브젝트로써 애플리케이션 `UnifiedTypes`를 선언했다. 애플리케이션에선 클래스 `LinkedHashSet[Any]`의 인스턴스를 가리키는 지역 변수 `set`을 정의했다. 프로그램은 이 집합에 여러 항목을 추가하는데, 해당 항목은 반드시 선언된 항목의 타입인 `Any`에 맞아야 한다. 마지막에는 모든 항목의 문자열 표현을 출력한다.

다음은 이 프로그램의 실행 결과다.

    This is a string
    732
    c
    true
    <function>
    
윤창석, 이한욱 옮김