---
layout: tour
title: 들어가며

discourse: true

partof: scala-tour

num: 1

next-page: basics

redirect_from: "/tutorials/tour/tour-of-scala.html"

next-page: basics

language: ko
---

## 투어를 환영합니다
이 투어에서는 스칼라에서 가장 자주 사용되는 기능을 요약하여 소개하며, 스칼라 초보자를 대상으로 합니다.

언어 전체를 다루는 튜토리얼이 아닌 간단히 둘러보기입니다. 자세히 다루고 싶다면, [책](/books.html)을 구하거나 [다른 자료](/learn.html)를 찾아보세요.

## 스칼라란?
스칼라는 일반적인 프로그래밍 패턴을 간결하고 우아하며 타입-세이프한 방식으로 표현할 수 있게 설계된 최신 멀티-패러다임 프로그래밍 언어입니다. 객체지향과 함수형 언어의 특징을 자연스럽게 통합합니다.

## 스칼라는 객체지향이다 ##
[모든 값이 객체](unified-types.html)라는 의미에서 스칼라는 순수 객체지향 언어입니다. 객체의 타입과 행위는 [클래스](classes.html)와 [트레잇](traits.html)으로 설명됩니다. 클래스는 서브클래스를 만들거나, 다중 상속을 깔끔하게 대체하는 유연한 [믹스인 기반 컴포지션](mixin-class-composition.html)을 통해 확장 가능합니다.

## 스칼라는 함수형이다 ##
또한, 스칼라는 [모든 함수가 값](unified-types.html)이라는 의미에서 함수형 언어입니다. 스칼라는 익명 함수를 위한 경량화된 구문을 제공하고, [고차 함수](higher-order-functions.html)를 지원하며, 함수의 [중첩](nested-functions.html)을 허용하고, [커링](multiple-parameter-lists.html)을 지원합니다. 스칼라의 [케이스 클래스](case-classes.html)와 케이스 클래스의 [패턴 매칭](pattern-matching.html) 빌트인 지원을 통해 여러 함수형 프로그래밍 언어에서 사용되는 대수 타입을 만들 수 있습니다.

또한, 스칼라의 패턴 매칭 개념은 [추출자 오브젝트](extractor-objects.html)를 이용한 일반적인 확장으로 [우측 무시 시퀀스 패턴](regular-expression-patterns.html)의 도움을 받아 XML 데이터의 처리까지 자연스럽게 확장됩니다. 이런 맥락에서 [for 컴프리헨션](for-comprehensions.html)은 쿼리를 만들어 내는데 유용합니다. 이런 기능 덕분에 스칼라는 웹 서비스와 같은 애플리케이션 개발에 있어서 이상적인 선택이 될 수 있습니다.

## 스칼라는 정적 타입이다 ##
스칼라는 컴파일 시간에 안전하고 일관성 있는 추상화를 강제하는 풍부한 타입 시스템을 갖추고 있습니다. 타입 시스템은 다음을 지원합니다.

* [제네릭 클래스](generic-classes.html)
* [가변성 어노테이션](variances.html)
* [상위 타입 경계](upper-type-bounds.html)와 [하위 타입 경계](lower-type-bounds.html)
* 객체 멤버로써의 [내부 클래스](inner-classes.html)와 [추상 타입 멤버](abstract-type-members.html)
* [합성 타입](compound-types.html)
* [명시적으로 타입이 지정된 자기 참조](self-types.html)
* [암시적 파라미터](implicit-parameters.html)와 [변환](implicit-conversions.html)
* [다형 메소드](polymorphic-methods.html)

[타입 추론](type-inference.html)은 사용자가 매번 불필요한 타입 정보를 코드에 언급 해야 하는 불편함을 줄여줍니다. 이러한 기능을 조합하여 사용하면, 프로그래밍 추상화를 안전하게 재사용할 수 있고, 소프트웨어를 타입-세이프하게 확장할 수 있습니다.

## 스칼라는 확장성이 높다 ##
실제 개발 상황에선, 도메인 기반 애플리케이션의 개발에 종종 도메인별 언어 확장이 필요할 때가 있습니다. 스칼라는 라이브러리의 형태로 새로운 언어 구성을 쉽고 자연스럽게 추가할 수 있도록 고유한 언어 기능 조합을 제공합니다.

대부분의 경우 매크로와 같은 메타 프로그래밍 기능을 사용하지 않고도 이 작업을 수행 할 수 있습니다. 예를 들어,

<!-- TODO 아래 두 링크는 번역된 페이지가 없어서 영문 페이지로 연결이 됨. 해당 페이지가 번역이 된다면 수정 필요 -->
* [Implicit classes](/overviews/core/implicit-classes.html)에서는 기존 타입에 확장 메서드를 추가할 수 있습니다.
* [문자열 보간](/overviews/core/string-interpolation.html)은 사용자정의 보간기를 사용하여 사용자가 직접 확장할 수 있습니다.

## 스칼라 상호운용성

스칼라는 많은 사람들이 사용하는 자바 실행 환경(JRE)과 서로 잘 호환되도록 설계되었습니다. 특히, 주류 객체지향 자바 프로그래밍 언어와의 상호작용은 가능한한 매끄럽게 작동합니다. 자바 언어의 SAMs, [람다](higher-order-functions.html), [어노테이션](annotations.html), [제네릭](generic-classes.html) 같은 최신 특성은 스칼라에서도 동일하게 발견됩니다.

[기본 파라미터](default-parameter-values.html)와 [이름 지정 파라미터](named-arguments.html) 같은 자바에 없는 기능은 적절한 자바 코드로 컴파일이 됩니다. 스칼라는 자바와 같은 컴파일 모델(분리 컴파일, 동적 클래스 로딩)을 가지고 있으며 현존하는 수 많은 높은 품질의 라이브러리들을 활용할 수 있습니다.

## 투어를 즐기세요!

자세한 내용을 보려면 Contents 메뉴의 [다음 페이지](basics.html)로 이동 하십시오.
