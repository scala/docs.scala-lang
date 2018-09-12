---
layout: tour
title: 믹스인 클래스 컴포지션

discourse: false

partof: scala-tour

num: 6
language: ko

next-page: higher-order-functions
previous-page: tuples
---

_단일 상속_ 만을 지원하는 여러 언어와는 달리, 스칼라는 더욱 일반화된 시각에서 클래스를 재사용한다. 스칼라는 새로운 클래스를 정의할 때 _클래스의 새로운 멤버 정의_ (즉, 슈퍼클래스와 비교할 때 변경된 부분)를 재사용할 수 있다. 이를 _믹스인 클래스 컴포지션_ 이라고 부른다. 이터레이터를 추상화한 다음 예제를 살펴보자.

    abstract class AbsIterator {
      type T
      def hasNext: Boolean
      def next(): T
    }

이어서, 이터레이터가 반환하는 모든 항목에 주어진 함수를 적용해주는 `foreach` 메소드로 `AbsIterator`를 확장한 믹스인 클래스를 살펴보자. 믹스인으로 사용할 수 있는 클래스를 정의하기 위해선 `trait`이란 키워드를 사용한다.

    trait RichIterator extends AbsIterator {
      def foreach(f: T => Unit) { while (hasNext) f(next()) }
    }

다음은 주어진 문자열의 캐릭터를 차례로 반환해주는 콘크리트 이터레이터 클래스다.

    class StringIterator(s: String) extends AbsIterator {
      type T = Char
      private var i = 0
      def hasNext = i < s.length()
      def next() = { val ch = s charAt i; i += 1; ch }
    }

`StringIterator`와 `RichIterator`를 하나의 클래스로 합치고 싶다면 어떻게 할까. 두 클래스 모두는 코드가 포함된 멤버 구현을 담고 있기 때문에 단일 상속과 인터페이스 만으론 불가능한 일이다. 스칼라는 _믹스인 클래스 컴포지션_ 으로 이런 상황을 해결해준다. 프로그래머는 이를 사용해 클래스 정의에서 변경된 부분을 재사용할 수 있다. 이 기법은 주어진 문자열에 포함된 모든 캐릭터를 한 줄로 출력해주는 다음의 테스트 프로그램에서와 같이, `StringIterator`와 `RichIterator`를 통합할 수 있도록 해준다.

    object StringIteratorTest {
      def main(args: Array[String]) {
        class Iter extends StringIterator("Scala") with RichIterator
        val iter = new Iter
        iter foreach println
      }
    }

`main` 함수의 `Iter` 클래스는 부모인 `StringIterator`와 `RichIterator`를 `with` 키워드를 사용해 믹스인 컴포지션해서 만들어졌다. 첫 번째 부모를 `Iter`의 _슈퍼클래스_ 라고 부르며, 두 번째 부모를(더 이어지는 항목이 있다면 이 모두를 일컬어)  _믹스인_ 이라고 한다.

윤창석, 이한욱 옮김
