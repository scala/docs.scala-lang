---
layout: tour
title: 클래스
partof: scala-tour

num: 4
language: ko

next-page: traits
previous-page: unified-types
topics: classes
prerequisite-knowledge: no-return-keyword, type-declaration-syntax, string-interpolation, procedures
---

스칼라의 클래스는 객체를 만들기 위한 설계도입니다. 클래스에는 _멤버_ 라고 통칭할 수 있는 메서드, 값, 변수, 타입, 객체, 트레잇, 클래스를 포함할 수 있습니다. 타입, 객체, 트레잇은 투어에서 나중에 다루겠습니다. 

# 클래스 정의
가장 단순한 클래스 정의는 예약어 `class`와 식별자만 있는 것입니다. 클래스명은 대문자로 시작하는 것이 관례입니다.
```scala mdoc
class User

val user1 = new User
```
예약어 `new`는 클래스의 인스턴스를 만들기위해 사용합니다. `User` 클래스는 생성자를 정의하지 않았기 때문에 인자가 없는 기본 생성자를 갖습니다. 생성자와 클래스 몸체를 정의하고자 한다면, 다음의 클래스 정의 예제를 참고하십시오:

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
point1.x  // 2
println(point1)  // prints (2, 3)
```

이 `Point` 클래스에는 네 개의 멤버가 있습니다: 변수 `x`, `y`와 메서드 `move`, `toString`. 많은 다른 언어와 달리 기본 생성자는 클래스 서명부(signature)에 있습니다 `(var x : Int, var y : Int)`. `move` 메소드는 두 개의 정수 인자를 취하여 정보를 전달하지 않는 Unit 타입의 값 `()`을 반환합니다. 이것은 자바 같은 언어의 `void`와 유사합니다. 반면에 `toString`은 인자를 취하지 않고 `String` 값을 반환합니다. `toString`은 [`AnyRef`](unified-types.html)의 `toString`을 대체하므로 `override` 예약어로 지정됩니다.

## 생성자

생성자는 다음과 같은 기본 값을 제공하여 선택적 매개변수를 가질 수 있습니다:

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x and y are both set to 0
val point1 = new Point(1)
println(point1.x)  // prints 1

```

이 버전의 `Point` 클래스에서 `x`와 `y` 인자는 기본 값 `0`을 가지므로 인자를 꼭 전달하지 않아도 됩니다. 생성자는 인자를 왼쪽부터 읽으므로 `y` 값만 전달하고 싶다면 매개변수의 이름을 지정해야 합니다.
```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y=2)
println(point2.y)  // prints 2
```

이것은 명료성 향상을 위한 좋은 습관이기도 합니다.

# Private 멤버와 Getter/Setter 문법
멤버는 기본적으로 public으로 지정됩니다. `private` 접근 지시자를 사용함으로써 클래스 외부로부터 멤버를 숨길 수 있습니다.
```scala mdoc:nest
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // 경고가 출력됩니다
```
이 버전의 `Point` 클래스에서는 데이터가 private 변수 `_x`와 `_y`에 저장됩니다. 이 private 데이터에 접근하기 위한 메서드 `def x`와 `def y`가 있고, `_x`와 `_y` 값을 검증하고 설정하기위한 `def x_=`와 `def y_=`가 있습니다. setter 메서드를 위한 특별한 문법에 주목하십시오: getter 메서드 식별자에 `_=`를 덧붙이고 매개변수가 뒤따르는 형식입니다.

기본 생성자에서 `val`와 `var`로 지정된 매개변수는 public 입니다. `val`은 불변을 의미하기 때문에 다음의 예처럼 값을 변경할 수 없습니다.
```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- 컴파일되지 않습니다
```

`val` 또는 `var`로 지정되지 않은 매개변수는 private 값이므로 클래스 내에서만 참조가능합니다. 
```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- 컴파일되지 않습니다
```
