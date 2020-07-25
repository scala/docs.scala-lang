---
layout: tour
title: 패키지 객체
language: ko
partof: scala-tour

num: 36
previous-page: packages-and-imports
---

# 패키지 객체

스칼라는 패키지 객체라는 패키지 전체에 걸쳐 공유되는 편리한 컨테이너를 제공한다.

패키지 객체는 변수나 메서드 정의뿐 아니라 임의의 정의도 담을 수 있다. 예를 들어, 패키지 범위의 타입 별칭이나 암시적 변환을 담기 위해 패키지 객체가 종종 사용된다. 패키지 객체는 스칼라 클래스나 트레잇을 상속할 수도 있다.

패키지 객체의 소스 코드는 `package.scala`라 명명된 소스 파일에 담는 것이 관례이다.

각 패키지는 하나의 패키지 객체를 가질 수 있다. 패키지 객체에 정의된 것은 무엇이든 해당 패키지의 구성원으로 간주한다.

아래 예제를 보자. 먼저 `gardening.fruits` 패키지에 `Fruit` 클래스와 세 개의 `Fruit` 객체가 있다고 가정하자:

```
// gardening/fruits/Fruit.scala 파일 내부
package gardening.fruits

case class Fruit(name: String, color: String)
object Apple extends Fruit("Apple", "green")
object Plum extends Fruit("Plum", "blue")
object Banana extends Fruit("Banana", "yellow")
```

이제 당신이 `planted` 변수와 `showFruit` 메서드를 바로 `gardening.fruits` 패키지에 넣고 싶다고 해보자.
이는 아래와 같이 구현된다:

```
// gardening/fruits/package.scala 파일 내부
package gardening
package object fruits {
  val planted = List(Apple, Plum, Banana)
  def showFruit(fruit: Fruit): Unit = {
    println(s"${fruit.name}s are ${fruit.color}")
  }
}
```

아래 사용 예처럼, `PrintPlanted` 객체는 `gardening.fruits` 패키지에 와일드카드를 사용하여 임포트함으로써 `Fruit` 클래스와 함께 `planted`와 `showFruits`를 불러온다:

```
// PrintPlanted.scala 파일 내부
import gardening.fruits._
object PrintPlanted {
  def main(args: Array[String]): Unit = {
    for (fruit <- planted) {
      showFruit(fruit)
    }
  }
}
```

패키지 객체는 구성 시 다른 객체처럼 상속을 이용할 수 있다. 다음 예시와 같이, 여러 트레잇을 혼합하여 패키지 객체를 만들 수도 있다:

```
package object fruits extends FruitAliases with FruitHelpers {
  // 헬퍼와 변수가 이곳에 따라온다
}
```
