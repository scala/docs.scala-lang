---
layout: tutorial
title: 들어가며

disqus: true

tutorial: scala-tour
num: 1
language: ko
---

스칼라는 정확하고 명쾌하며 타입 세이프한 방식으로 일반적인 유형의 프로그래밍 패턴을 표현하기 위해 설계된 새로운 다중 패러다임 프로그래밍 언어다. 스칼라는 객체지향과 함수형 언어를 자연스럽게 통합해준다.

## 스칼라는 객체지향이다 ##
[모든 값이 객체](unified-types.html)라는 측면에서 스칼라는 순수 객체지향 언어다. 객체의 타입과 행위는 [클래스](classes.html)와 [트레잇](traits.html)으로 나타난다. 클래스는 서브클래스를 만들거나, 다중 상속을 깔끔하게 대체하는 유연한 [믹스인 기반 컴포지션](mixin-class-composition.html) 방법을 통해 확장된다.

## 스칼라는 함수형이다 ##
또한, 스칼라는 [모든 함수가 값](unified-types.html)이라는 측면에서 함수형 언어다. 스칼라는 익명 함수를 위한 [경량 구문](anonymous-function-syntax.html)을 제공하고, [고차 함수](higher-order-functions.html)를 지원하며, 함수의 [중첩](nested-functions.html)을 허용하고, [커링](currying.html)을 지원한다. 스칼라의 [케이스 클래스](case-classes.html)와 케이스 클래스의 [패턴 매칭](pattern-matching.html) 빌트인 지원을 통해 여러 함수형 프로그래밍 언어에서 사용되는 대수 타입을 만들 수 있다.

뿐만 아니라 스칼라의 패턴 매칭 개념은 [우측 무시 시퀀스 패턴](regular-expression-patterns.html)의 도움을 받아 자연스럽게 [XML 데이터의 처리](xml-processing.html)로 확장된다. 이런 맥락에서 [시퀀스 컴프리헨션](sequence-comprehensions.html)은 쿼리를 만들 때 유용하다. 이런 기능 때문에 스칼라는 웹 서비스와 같은 애플리케이션 개발에 있어서 이상적인 선택이 될 수 있다.

## 스칼라는 정적 타입이다 ##
스칼라는 안전하고 일관성 있는 추상화를 정적으로 강제하는 풍부한 타입 시스템을 장착하고 있다. 특히 타입 시스템은 다음과 같은 사항을 지원한다.

* [제네릭 클래스](generic-classes.html)
* [가변성 어노테이션](variances.html)
* [상위 타입 경계](upper-type-bounds.html)와 [하위 타입 경계](lower-type-bounds.html)
* 객체 멤버로써의 [내부 클래스](inner-classes.html)와 [추상 타입](abstract-types.html) 
* [합성 타입](compound-types.html)
* [명시적으로 타입이 지정된 자기 참조](explicitly-typed-self-references.html)
* [뷰](views.html)
* [다형 메소드](polymorphic-methods.html)

[로컬 타입 추론 방식](local-type-inference.html)은 사용자가 불필요한 타입 정보를 어노테이션해야 하는 불편함을 줄여준다. 이와 함께, 이런 기능은 프로그래밍 추상화를 안전하게 재사용하고 소프트웨어를 타입 세이프하게 확장하는 강력한 기반이 된다.

## 스칼라는 확장성이 높다 ##
실제 개발 상황에선, 도메인 고유 애플리케이션의 개발에 도메인 고유 언어 확장이 필요할 때가 많다. 스칼라는 라이브러리의 형태로 새로운 언어 구성을 쉽고 자연스럽게 추가할 수 있도록 고유한 언어 기능 조합을 제공한다.

* 어떤 메소드든 [중위나 후위 연산자](operators.html)로 사용될 수 있다.
* [클로저는 기대 타입에 따라 자동으로 생성된다](automatic-closures.html)(타입이 대상에 맞춰진다).

두 기능을 함께 엮어서 사용하면 새로운 구문을 확장하거나 매크로 같은 메타 프로그래밍을 활용할 필요없이 명령문을 정의할 수 있도록 해준다.

스칼라는 자바와 닷넷과 상호 호환된다.
스칼라는 잘 알려진 자바 2 런타임 환경(JRE)과 상호 호환되도록 설계됐다. 특히 객체지향의 주류인 자바 프로그래밍 언어와 굉장히 자연스럽게 상호작용한다. 스칼라는 자바와 같은 컴파일 모델(컴파일 분리, 동적 클래스 로딩)을 사용하며, 현재 사용되고 있는 수많은 높은 품질의 라이브러리를 그대로 활용할 수 있도록 해준다.

다음 페이지로 이동하면 더 자세한 내용을 알아보게 된다.

윤창석, 이한욱 옮김
