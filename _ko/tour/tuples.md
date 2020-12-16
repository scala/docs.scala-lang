---
layout: tour
title: 튜플

partof: scala-tour

num: 6
language: ko

next-page: mixin-class-composition
previous-page: traits
topics: tuples
---

스칼라에서 튜플은 정해진 요소(element)를 가지는 값으로 각 요소는 고유한 타입을 가진다. 튜플은 불변적이다.

튜플은 특히 메소드로부터 여러개의 값을 리턴하는데 편리하게 사용할 수 있다.

두개의 엘리먼트를 갖는 튜플은 다음과 같이 생성할 수 있다:

```scala mdoc
val ingredient = ("Sugar" , 25)
```

위 코드는 `String`과 `Int` 엘리먼트를 포함하는 튜플을 생성한다.

`ingredient`의 추론된 타입은 `Tuple2[String, Int]`의 약칭인 `(String, Int)`이다.

튜플들을 나타내기 위해서 Scala에서는 다음과 같은 형태의 클래스들을 사용한다: `Tuple2`, `Tuple3`, ... ,`Tuple22`.
각 클래스는 파라미터 타입의 갯수 만큼 엘리먼트들을 가지고 있다.

## 엘리먼트 접근하기

튜플의 엘리먼트에 접근하기 위한 한가지 방법은 위치로 접근하는 것이다. 각 요소들은 `_1`, `_2`, ... 와 같은 이름을 갖는다.

```scala mdoc
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```

## 튜플에서의 패턴 매칭

하나의 튜플은 패턴 매칭을 사용하여 분리할 수 있다:

```scala mdoc
val (name, quantity) = ingredient
println(name) // Sugar
println(quantity) // 25
```

여기에서 `name`의 추론된 타입은 `String`이고 `quantity`의 추론된 타입은 `Int`이다.

여기 튜플을 패턴 매칭한 또 다른 예제가 있다:

```scala mdoc
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Our planet is $distance million kilometers from the sun")
  case _ =>
}
```

또는 `for` comprehension에서:

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## 튜플과 케이스 클래스

때로는 튜플과 케이스 클래스 중 무엇을 사용할지 힘들 수 있다. 케이스 클래스는 이름이 있는 엘리먼트들을 갖는다. 그 엘리먼트의 이름들은 어떤 종류의 코드에서 가독성을 높일 수 있다. 위의 planet 예제에서 우리는 튜플을 사용하는 것보다 `case class Planet(name: String, distance: Double)`로 정의 하는 것이 더 나을 수도 있다.

이한샘 옮김
