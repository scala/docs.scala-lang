---
layout: tour
title: 트레잇
partof: scala-tour

num: 5
language: ko

next-page: tuples
previous-page: classes
prerequisite-knowledge: expressions, classes, generics, objects, companion-objects
---

트레잇은 클래스간에 인터페이스와 필드를 공유하는 데 사용됩니다. 그것들은 자바8의 인터페이스와 유사합니다. 클래스와 객체는 트레잇을 확장 할 수 있지만 트레잇을 인스턴스화 할 수 없으므로 매개 변수가 없습니다.

# 트레잇 정의
가장 단순한 트레잇 정의는 예약어 `trait`과 식별자만 있는 것입니다:

```scala mdoc
trait HairColor
```

트레잇은 제네릭 타입과 추상 메서드로 특히 유용합니다.
```scala mdoc
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}
```

`trait Iterator[A]`를 확장하려면 `A` 타입 지정과 `hasNext`, `next` 메서드 구현이 필요합니다.

## 트레잇 사용하기
`extends` 예약어를 사용하여 트레잇을 확장하십시오. 그런 다음 `override` 예약어를 사용하여 트레잇의 추상 멤버를 구현하십시오:
```scala mdoc:nest
trait Iterator[A] {
  def hasNext: Boolean
  def next(): A
}

class IntIterator(to: Int) extends Iterator[Int] {
  private var current = 0
  override def hasNext: Boolean = current < to
  override def next(): Int = {
    if (hasNext) {
      val t = current
      current += 1
      t
    } else 0
  }
}


val iterator = new IntIterator(10)
iterator.next()  // returns 0
iterator.next()  // returns 1
```
이 `IntIterator` 클래스는 상한선으로 매개변수 `to`를 취합니다. `extends Iterator[Int]`는 트레잇 `Iterator[A]`를 확장했으며 `next` 메서드는 Int 값을 반환해야 한다는 의미입니다.

## 서브타이핑
특정 트레잇이 필요한 곳에 그 트레잇의 서브타입을 대신 사용할 수 있습니다.
```scala mdoc
import scala.collection.mutable.ArrayBuffer

trait Pet {
  val name: String
}

class Cat(val name: String) extends Pet
class Dog(val name: String) extends Pet

val dog = new Dog("Harry")
val cat = new Cat("Sally")

val animals = ArrayBuffer.empty[Pet]
animals.append(dog)
animals.append(cat)
animals.foreach(pet => println(pet.name))  // Prints Harry Sally
```
`trait Pet`에는 Cat과 Dog의 생성자에서 구현된 추상 필드 `name`이 있습니다. 마지막 줄에서 `pet.name`을 호출하고 있는데, 이것은 트레잇 `Pet`의 서브타입에서 구현되어야 합니다.
