---
layout: tour
title: 가변성
partof: scala-tour

num: 18
language: ko

next-page: upper-type-bounds
previous-page: generic-classes
---

스칼라는 [제네릭 클래스](generic-classes.html)의 타입 파라미터에 관한 가변성 어노테이션을 지원한다. 자바 5(다른 이름은 JDK 1.5)에선 추상화된 클래스가 사용될 때 클라이언트가 가변성 어노테이션을 결정하지만, 반면에 스칼라는 추상화된 클래스를 정의할 때 가변성 어노테이션을 추가할 수 있다.

[제네릭 클래스](generic-classes.html)에 관한 페이지에선 변경 가능한 스택의 예제를 살펴보면서, 클래스 `Stack[T]`에서 정의한 타입은 타입 파라미터의 서브타입이 불변자여야 함을 설명했었다. 이는 추상화된 클래스의 재사용을 제한할 수 있다. 지금부턴 이런 제약이 없는 함수형(즉, 변경이 불가능한) 스택의 구현을 알아본다. 이 구현은 [다형성 메소드](polymorphic-methods.html), [하위 타입 경계](lower-type-bounds.html), 순가변 타입 파라미터 어노테이션 등의 중요 개념을 조합한 좀 더 어려운 예제임을 알아두자. 또한 [내부 클래스](inner-classes.html)를 사용해 명시적인 연결 없이도 스택의 항목을 서로 묶을 수 있도록 만들었다.

```scala mdoc
class Stack[+T] {
  def push[S >: T](elem: S): Stack[S] = new Stack[S] {
    override def top: S = elem
    override def pop: Stack[S] = Stack.this
    override def toString: String =
      elem.toString + " " + Stack.this.toString
  }
  def top: T = sys.error("no element on stack")
  def pop: Stack[T] = sys.error("no element on stack")
  override def toString: String = ""
}

object VariancesTest extends App {
  var s: Stack[Any] = new Stack().push("hello")
  s = s.push(new Object())
  s = s.push(7)
  println(s)
}
```

어노테이션 `+T`는 타입 순가변 위치에서만 사용할 수 있는 타입 `T`를 선언한다. 이와 유사하게, `-T`는 역가변 위치에서만 사용할 수 있는 `T`를 선언한다. 순가변 타입 파라미터의 경우, 타입 파라미터의 정의에 따라 서브타입과 순가변 관계를 형성한다. 즉, `T`가 `S`의 서브타입이라면 이 예제의 `Stack[T]`는 `Stack[S]`의 서브타입이다. `-`로 표시된 타입 파라미터 사이에는 이와는 반대의 관계가 맺어진다.

스택의 예제에서 메소드 `push`를 정의하기 위해선 역가변 위치에 순가변 타입 파라미터 `T`를 사용해야만 한다. 스택의 서브타입이 순가변적여야 하기 때문에, 메소드 `push`의 파라미터 타입을 추상화하는 기법을 사용했다. 즉, 스택 항목의 타입인 `T`를 사용해, `T`가 `push`의 타입 변수 하위 경계로 설정된 다형성 메소드를 만들었다. 이는 `T` 선언에 따른 가변성이 순가변 타입 파라미터와 같도록 해준다. 이제 스택은 순가변적이지만, 지금까지 알아본 방법에 따르면 정수 스택에 문자열을 푸시하는 것과 같은 동작이 가능해진다. 이런 동작은 `Stack[Any]`라는 타입의 스택을 만드는데, 결국 정수 스택이 결과로 반환되길 기다리고 있는 상황에서 이 결과는 오류를 발생시킨다. 오류가 발생하지 않더라도, 항목의 타입이 더 일반화된 스택이 반환될 뿐이다.


윤창석, 이한욱 옮김
