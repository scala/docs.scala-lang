---
layout: tour
title: 싱글톤 객체
partof: scala-tour

num: 13
language: ko

next-page: regular-expression-patterns
previous-page: pattern-matching
---

[클래스](classes.html)의 각 인스턴스와 연관되지 않은 메서드와 값들은 싱글톤 객체에 속하며, `class`대신에 `object`를 사용해 표시된다.

```
package test

object Blah {
  def sum(l: List[Int]): Int = l.sum
}
```

위 `sum`메서드는 전역적으로 접근가능하고 참조될수 있으며, `test.Blah.sum`로 import될수 있다.

싱글턴 객체는 직접 인스턴스화 될 수 없는 싱글턴 클래스를 정의하기 위한 축약형 같은 것이며, `object`의 정의 시점의 같은 이름을 가진 `val` 멤버 같은 것이다. 사실 `val`과 같이, 싱글턴 객체는 변칙적이긴 하지만 [트레잇](traits.html)이나 클래스의 멤버로서 정의될수 있다.

하나의 싱글턴 객체는 클래스와 트레잇으로 확장할수 있다. 사실, [타입 파라미터](generic-classes.html)가 없는 [케이스 클래스](case-classes.html)는 기본적으로 같은 이름의 싱글턴 객체를 생성하며, 구현된 [`Function*`](https://www.scala-lang.org/api/current/scala/Function1.html)을 가진다.

## 동반자(Companions) ##

대부분의 싱글턴 객체는 독립적이지 않으며, 대신에 같은 이름의 클래스와 연관되어있다. 위에서 언급한 클래스의 "같은 이름의 싱글턴 객체"는 이 예이다. 이 현상이 발생할 때, 싱글턴 객체는 클래스의 *동반자 객체* 라고 하며, 그 클래스는 객체의 *동반자 클래스*라고 한다.

[스칼라 문서](/style/scaladoc.html)는 클래스와 그 동반자 사이의 이동을 위한 특별한 지원을 가지고 있다. 만약 큰 "C"나 "O" 원이 아래에서 위로 접힌 경계를 가진다면, 여러분은 동반자로 이동하기 위해 해당 원을 클릭할수 있다.

하나의 클래스와 그 동반자 객체는 어떤 경우라도, 아래와 같이 *같은* 소스파일에 정의되어야 한다.

```scala mdoc
class IntPair(val x: Int, val y: Int)

object IntPair {
  import math.Ordering

  implicit def ipord: Ordering[IntPair] =
    Ordering.by(ip => (ip.x, ip.y))
}
```

타입클래스 패턴을 따를때, 일반적으로 타입클래스 인스턴스들을 동반자 안에 정의된 `ipord`와 같은 [암시적 값들](implicit-parameters.html)로 생각한다.

## 자바 프로그래머들이 주의할 점 ##

`static`은 스칼라에서 키워드가 아니다. 대신에 class를 포함한 static일 수 있는 모든 멤버는 싱글턴 객체에 있어야 한다. 그것들은 부분적으로 또는 그룹 등등으로 import될수 있으며, 같은 문법으로 참조될수 있다.

빈번하게, 자바프로그래머들은 그 인스턴스 멤버를 목적으로 구현 할때 `private`을 사용해 static 멤버를 정의한다. 이것들은 또한 동반자(companion)으로 이동되었다. 일반적인 패턴은 아래와 같이 동반자 객체(object)의 멤버들을 클래스 안으로 import하는 것이다.

```
class X {
  import X._

  def blah = foo
}

object X {
  private def foo = 42
}
```

이것은 또 다른 특징을 설명한다. `private`의 문맥에서 클래스와 그 동반자는 친구다. `객체 X`는 `클래스 X`의 private 멤버들에 접근할수 있다. 하나의 멤버를 *정말로* private하게 만들고 싶다면 `private[this]`를 사용하라.

자바 편의를 위해서, `var`와 `val`의 것 모두, 싱글턴 객체에 정의된 메서드들은 *static forwarder* 라고 불리는 동반자 클래스안에 정의된 static메서드를 가진다. 다른 멤버들은 `객체 X`를 위한 static 필드 `X$.MODULE$`를 통해 접근할수 있다.

만약 당신이 모든 것을 동반자 객체에 옮기고, 당신이 남겨놓은 모든것이 인스턴스화가 되길 바라지 않는 하나의 클래스라면, 간단하게 그 클래스를 삭제하라. Static forwarder는 여전히 생성된다.
