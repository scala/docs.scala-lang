---
layout: tour
title: 기초
partof: scala-tour

num: 2
language: ko

next-page: unified-types
previous-page: tour-of-scala
---

이 페이지에서는 스칼라의 기초를 다룬다.

## 브라우저에서 스칼라 사용하기

ScalaFiddle를 사용하면 브라우저에서 스칼라를 실행해 볼 수 있다.

1. [https://scalafiddle.io](https://scalafiddle.io) 로 간다.
2. 왼쪽 창에 `println("Hello, world!")` 를 붙여 넣는다.
3. 실행 버튼을 누르면 오른쪽 창에서 출력을 확인할 수 있다.

이는 설정 없이 스칼라 코드들을 손쉽게 실험할 수 있는 방법이다.

이 페이지의 많은 예제 코드가 ScalaFiddle와 통합되어 있어 간단히 실행 버튼만 눌러 직접 실험해 볼 수 있다.

## 표현식

표현식은 연산 가능한 명령문이다.

```scala mdoc
1 + 1
```

`println` 표현식을 사용해 결과를 출력할 수 있다.

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### 값

`val` 키워드로 표현식의 결과에 이름을 붙인다.

```scala mdoc
val x = 1 + 1
println(x) // 2
```

`x` 같이 이름이 붙여진 결과를 값이라고 부른다. 참조된 값은 재연산하지 않으며 값을 재할당할 수 없다.

```scala mdoc:fail
x = 3 // This does not compile.
```

값의 타입을 추론할 수 있지만 명시적으로 타입을 지정할 수도 있다.

```scala mdoc:nest
val x: Int = 1 + 1
```

`: Int` 를 사용하여 `x` 가 어떻게 선언되는지 주목하자.

### 변수

변수는 재할당이 가능한 것 이외에는 값과 같다. `var` 키워드로 변수를 정의한다.

```scala mdoc:nest
var x = 1 + 1
x = 3 // This compiles because "x" is declared with the "var" keyword.
println(x * x) // 9
```

값처럼 명시적으로 타입을 지정할 수도 있다.

```scala mdoc:nest
var x: Int = 1 + 1
```


## 블록

`{}` 으로 표현식을 감싼 것을 블록이라고 한다.

블록 안 마지막 표현식의 결과는 블록 전체의 결과이기도 하다.

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## 함수

함수는 매개변수(parameter)를 가지는 표현식이다.

주어진 정수에 1을 더하는 익명 함수(이름이 없는 함수)를 정의할 수 있다.

```scala mdoc
(x: Int) => x + 1
```

`=>` 을 기준으로 왼쪽에는 매개변수 목록이고 오른쪽은 매개변수를 포함한 표현식이다.

함수에 이름을 지정할 수 있다.

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

함수는 여러 매개변수를 가질 수 있다.

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

또는 매개변수를 가지지 않을 수도 있다.

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## 메소드

메소드는 함수와 비슷하게 보이고 동작하는거 같지만 몇 가지 중요한 차이가 있다.

`def` 키워드로 메소드를 정의하고 이름, 매개변수 목록, 반환 타입 그리고 본문이 뒤따른다.

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

매개변수 목록과 `: Int` 뒤에 반환 타입이 어떻게 선언되는지 주목하자.

메소드는 여러 매개변수 목록을 가질 수 있다.

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

또는 매개변수 목록을 가지지 않을 수도 있다.

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

함수와는 다소 차이가 있지만 지금은 비슷한 것이라고 생각하면 된다.

메소드는 여러 줄의 표현식을 가질 수 있다.

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

본문의 마지막 표현식은 메소드의 반환 값이다. (스칼라는 `return` 키워드가 있지만 거의 사용하지 않고 생략한다.)

## 클래스

`class` 키워드로 클래스를 정의하고 이름과 생성자 매개변수가 뒤따른다.

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```

`greet` 메소드의 반환 타입은 `Unit` 으로 자바와 C의 `void` 와 유사하다. (모든 스칼라 표현식은 어떤 값을 반드시 가져야하기 때문에 실제로는 `()` 로 쓰여진 `Unit` 타입의 싱글톤 값이 쓰인다는 차이가 있다. 결과적으로, 어떤 정보도 가져오지 않는다.)

`new` 키워드로 클래스의 인스턴스를 만든다.

```scala mdoc
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

이후 [클래스 페이지](classes.html)에서 자세히 다룰 것이다.

## 케이스 클래스

스칼라는 케이스 클래스라고 불리는 특별한 타입의 클래스를 가지고 있다. 기본적으로, 케이스 클래스는 변하지 않으며 값으로 비교한다. `case class` 키워드로 케이스 클래스를 정의한다.

```scala mdoc
case class Point(x: Int, y: Int)
```

`new` 키워드 없이 케이스 클래스를 인스턴스화 할 수 있다.

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

그리고 값으로 비교한다.

```scala mdoc
if (point == anotherPoint) {
  println(point + " and " + anotherPoint + " are the same.")
} else {
  println(point + " and " + anotherPoint + " are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(point + " and " + yetAnotherPoint + " are the same.")
} else {
  println(point + " and " + yetAnotherPoint + " are different.")
} // Point(1,2) and Point(2,2) are different.
```

소개할 케이스 클래스가 많고 마음에 들었으면 좋겠다. 이후 [케이스 클래스 페이지](case-classes.html)에서 자세히 다룰 것이다.

## 객체

객체는 자가 정의에 대한 단일 인스턴스다. 이는 자가 클래스의 싱글톤이라고 생각하면 된다.

`object` 키워드로 객체를 정의한다.

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

객체 이름을 참조하여 객체에 접근할 수 있다.

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

이후 [싱글톤 객체 페이지](singleton-objects.html)에서 자세히 다룰 것이다.

## 트레이트

트레이트는 특정 필드와 메소드를 가지는 타입이고 다양한 트레이트와 결합할 수 있다.

`trait` 키워드로 트레이트를 정의한다.

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

또한 트레이트는 기본 구현도 가질 수 있다.

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

`extends` 키워드로 트레이트를 상속할 수 있고 `override` 키워드로 구현을 오버라이드할 수 있다.

```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endscalafiddle %}

`DefaultGreeter` 는 트레이트 하나만 상속하고 있지만 다중 상속도 가능하다.

이후 [트레이트 페이지](traits.html)에서 자세히 다룰 것이다.

## 메인 메소드

메인 메소드는 프로그램의 진입 지점이다. JVM(Java Virtual Machine)에선 `main` 이라는 메인 메소드가 필요하며 문자열 배열 하나를 인자(argument)로 가진다.

`object` 키워드를 사용하여 메인 메소드를 정의할 수 있다.

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```

공병국 옮김
