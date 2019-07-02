---
layout: tour
title: 튜플

discourse: false

partof: scala-tour

num: 6
language: ko

next-page: mixin-class-composition
previous-page: traits
---

스칼라에서 튜플은 고정된 수의 엘리먼트를 포함하는 값으로, 각 엘리먼트는 고유한 타입을 갖는다. 튜플은 변경이 불가능하다.

튜플은 메서드에서 여러 개의 값을 반환할 때 특히 유용하다.

두 개의 엘리먼트를 가진 튜플을 다음처럼 만들 수 있다.

```tut
val ingredient = ("Sugar" , 25)
```

`String` 엘리먼트와 `Int` 엘리먼트로 이루어진 튜플이 생성된다.

`ingredient`의 추론 타입은 `(String, Int)` 으로, `Tuple2[String, Int]`의 축약된 형식이다.

튜플을 표현하기 위해, 스칼라는 `Tuple2`, `Tuple3` … `Tuple22`에 이르는 일련의 클래스를 사용한다. 
각 클래스는 엘리먼트 개수와 같은 만큼의 타입 파라미터를 갖는다.

## 엘리먼트 접근

엘리먼트에 접근하는 한 가지 방법은 위치 정보를 이용하는 것이다. 각각의 엘리먼트들은 `_1`, `_2` 와 같은 명칭을 갖는다.

```tut
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```
## 튜플의 패턴 매칭
[패턴 매칭](pattern-matching.html)을 이용하여 튜플을 분리할 수 있다.

```tut
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```
여기서 `name`의 추론 타입은 `String`이고, `quantity`의 추론 타입은 `Int`이다.

튜플 패턴 매칭의 또 다른 예는 다음과 같다.

```tut
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```
혹은, `for` 구문 안에서 다음처럼 사용할 수 있다.

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## 튜플과 케이스 클래스
사용자들은 때때로 튜플과 [케이스 클래스](case-classes.html) 중 하나를 선택하는 것이 어려울 수 있다.
케이스 클래스는 이름을 가진 엘리먼트다. 이름을 사용하면 몇몇 코드들의 가독성을 높일 수 있다. 
위의 planet 예시에서는 튜플을 사용하는 것보다 `case class Planet(name: String, distance: Double)`을 정의하는 것이 더 나을 수 있다.