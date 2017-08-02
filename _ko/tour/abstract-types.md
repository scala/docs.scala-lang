---
layout: tour
title: 추상 타입

discourse: false

partof: scala-tour

num: 22

language: ko

next-page: compound-types
previous-page: inner-classes
---

스칼라에선 값(생성자 파라미터)과 타입(클래스가 [제네릭](generic-classes.html)일 경우)으로 클래스가 매개변수화된다. 규칙성을 지키기 위해, 값이 객체 멤버가 될 수 있을 뿐만 아니라 값의 타입 역시 객체의 멤버가 된다. 또한 이런 두 형태의 멤버 모두 다 구체화되거나 추상화될 수 있다.

이 예제에선 [클래스](traits.html) `Buffer`의 멤버로써 완전히 확정되지 않은 값과 추상 타입을 정의하고 있다.

    trait Buffer {
      type T
      val element: T
    }

*추상 타입*은 본성이 완전히 식별되지 않은 타입이다. 위의 예제에선 클래스 `Buffer`의 각 객체가 T라는 타입 멤버를 갖고 있다는 점만 알 수 있으며, 클래스 `Buffer`의 정의는 멤버 타입 `T`에 해당하는 특정 타입이 무엇이지 밝히고 있지 않다. 값 정의와 같이 타입 정의도 서브클래스에서 재정의(override) 할 수 있다. 이것은 타입 경계(추상 타입에 해당하는 예시를 나타내는)를 좀더 엄격하게 함으로써 추상 타입에 대해 좀더 많은 정보를 얻을수 있게 해준다.

다음 프로그램에선 `T` 타입이 새로운 추상 타입 `U`로 표현된 `Seq[U]`의 서브타입이어야 함을 나타내서, 버퍼에 시퀀스 만을 저장하는 클래스 `SeqBuffer`를 만들었다.

    abstract class SeqBuffer extends Buffer {
      type U
      type T <: Seq[U]
      def length = element.length
    }

추상 타입 멤버를 포함한 트레잇이나 [클래스](classes.html)는 종종 익명 클래스 인스턴스화와 함께 사용된다. 이를 알아보기 위해 정수의 리스트를 참조하는 시퀀스 버퍼를 다루는 프로그램을 살펴보자.

    abstract class IntSeqBuffer extends SeqBuffer {
      type U = Int
    }

    object AbstractTypeTest1 extends App {
      def newIntSeqBuf(elem1: Int, elem2: Int): IntSeqBuffer =
        new IntSeqBuffer {
             type T = List[U]
             val element = List(elem1, elem2)
           }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }

메소드 `newIntSeqBuf`의 반환 타입은 트레잇 `Buffer`의 특수화를 따르며, 타입 `U`가 `Int`와 같아진다. 메소드 `newIntSeqBuf` 내부의 익명 클래스 인스턴스화에서도 비슷한 타입 별칭이 있다. 여기선 `T` 타입이 `List[Int]`를 가리키는 `IntSeqBuf`의 새로운 인스턴스를 생성한다.

추상 타입 멤버를 클래스의 타입 파라미터로 하거나 클래스의 타입 파라미터로 추상 타입 멤버로를사용할 수 있음에 주목하자. 다음은 타입 파라미터만을 사용한, 앞서 살펴본 코드의 새로운 버전이다.

    abstract class Buffer[+T] {
      val element: T
    }
    abstract class SeqBuffer[U, +T <: Seq[U]] extends Buffer[T] {
      def length = element.length
    }
    object AbstractTypeTest2 extends App {
      def newIntSeqBuf(e1: Int, e2: Int): SeqBuffer[Int, Seq[Int]] =
        new SeqBuffer[Int, List[Int]] {
          val element = List(e1, e2)
        }
      val buf = newIntSeqBuf(7, 8)
      println("length = " + buf.length)
      println("content = " + buf.element)
    }

여기선 [가변성 어노테이션](variances.html)을 사용해야만 한다는 점에 유의하자. 이를 사용하지 않으면 메소드 `newIntSeqBuf`에서 반환되는 객체의 특정 시퀀스 구현 타입을 감출 수 없게 된다. 뿐만 아니라 추상 타입을 타입 파라미터로 대체할 수 없는 경우도 있다.

윤창석, 이한욱 옮김, 고광현 수정
