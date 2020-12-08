---
layout: tour
title: 통합된 타입
partof: scala-tour

num: 3
language: ko

next-page: classes
previous-page: basics

prerequisite-knowledge: classes, basics
---

스칼라에서는 숫자 값과 함수를 포함한 모든 값이 타입을 가지고 있습니다. 다음의 도표는 타입 계층구조를 보여줍니다.

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="스칼라 타입 계층구조"></a>


## 스칼라 타입 계층구조 ##

[`Any`](https://www.scala-lang.org/api/2.12.1/scala/Any.html)는 모든 타입들의 슈퍼타입이며 톱타입이라고도 합니다. `Any`에는 `equals`, `hashCode`, `toString` 같은 특정 범용 메서드가 정의되어 있으며 직접적으로 두 개의 서브클래스: `AnyVal`과 `AnyRef`를 가지고 있습니다.

`AnyVal`은 값 타입을 대표합니다. `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit`, `Boolean`의 미리 정의된 아홉 개의 값 타입이 있으며 이 타입들은 널 값을 가질 수 없습니다. `Unit`은 의미 없는 정보를 갖는 값 타입입니다. `()`와 같이 문자 그대로 선언 할 수있는`Unit`의 인스턴스는 오직 하나만 있습니다. 모든 함수는 무언가를 반환해야하기 때문에 때때로 `Unit`은 유용한 반환 타입입니다.

`AnyRef`는 참조 타입을 대표합니다. 값 타입이 아닌 모든 타입은 참조 타입으로 정의됩니다. 스칼라에서 모든 사용자정의 타입은 `AnyRef`의 서브타입입니다. 스칼라가 자바 실행 환경에서 사용된다면 `AnyRef`는 `java.lang.Object`에 해당합니다.

다음 소스는 문자열 값, 정수 값, 문자 값, boolean 값과 함수 역시 모두 객체로 취급됨을 보여주는 샘플입니다:

```scala mdoc
val list: List[Any] = List(
  "a string",
  732,  // 정수 값
  'c',  // 문자 값
  true, // boolean 값
  () => "an anonymous function returning a string"
)

list.foreach(element => println(element))
```

`List[Any]` 타입의 `list` 값을 정의합니다. 이 리스트는 다양한 타입의 원소들로 초기화 되었지만 각각은 `scala.Any`의 인스턴스이므로 리스트에 추가할 수가 있습니다.

다음은 이 프로그램의 출력 결과입니다.

```
a string
732
c
true
<function>
```

## 타입 캐스팅
값 타입은 다음과 같이 캐스팅할 수 있습니다:
<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

예제:

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (이 경우 일부 자리수가 소실되었음을 주의)

val face: Char = '☺'
val number: Int = face  // 9786
```

캐스팅은 단방향이며 컴파일되지 않습니다:

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // 적합하지 않음(캐스팅 불가)
```

참조 타입 또한 서브타입에 대하여 캐스트할 수 있습니다. 이것은 투어에서 나중에 다루겠습니다.

# Nothing과 Null
`Nothing`은 모든 타입의 서브타입이며, 바텀타입이라고도 합니다. `Nothing`은 값이 없음을 의미하는 타입니다. 일반적으로 예외 발생, 프로그램 종료 또는 무한 루프와 같은 비 종료 신호를 보내는 용도로 사용합니다 (즉, 값으로 평가되지 않는 표현식의 타입 또는 정상적으로 반환되지 않는 메소드).

`Null`은 모든 참조 타입의 서브타입입니다(즉, AnyRef의 모든 서브타입). 예약어 `null`로 식별되는 단일 값을 갖습니다. `Null`은 주로 다른 JVM 언어와의 상호 운용성을 위해 제공되며 스칼라 코드에서는 거의 사용되지 않아야합니다. 우리는 투어에서 나중에 `null`에 대한 대안을 다룰 것입니다. 
