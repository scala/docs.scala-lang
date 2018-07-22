---
layout: tour
title: 클래스

discourse: false

partof: scala-tour

num: 4
language: ko

next-page: traits
previous-page: unified-types
---

스칼라의 클래스는 런타임에 많은 객체로 인스턴스화 될 수 있는 정적 템플릿이다.
아래는 'Point' 클래스의 정의이다.

    class Point(xc: Int, yc: Int) {
      var x: Int = xc
      var y: Int = yc
      def move(dx: Int, dy: Int) {
        x = x + dx
        y = y + dy
      }
      override def toString(): String = "(" + x + ", " + y + ")";
    }

이 클래스는 변수 'x' 와 'y' 그리고 두 메서드 `move` 와 `toString` 을 정의한다. `move`는 두 개의 정수를 인자로 받지만 값을 반환하지는 않는다 (암시적 반환 타입인 `Unit` 은 Java와 같은 언어의 `void` 에 해당한다). 반면 `toString`은 아무 파라미터도 입력받지 않지만 `String` 값을 반환한다. `toString`은 기정의된 `toString` 메서드를 오버라이드 하기 때문에 `override` 플래그로 표시되어야 한다.

스칼라의 클래스들은 생성자의 인자로 파라미터화 된다. 위의 코드는 두 개의 생성자 인자 `xc`와 `yc`를 정의한다. 이 두 인자는 클래스 전체에서 접근 가능하다. 예제에서 이들은 변수 `x`와 `y`를 초기화하는 데에 사용된다.

클래스들은 아래의 예제가 보여주는 것처럼 새로운 기본형으로 초기화된다.

    object Classes {
      def main(args: Array[String]) {
        val pt = new Point(1, 2)
        println(pt)
        pt.move(10, 10)
        println(pt)
      }
    }

이 프로그램은 `main` 메서드를 가지고 있는 최상위 싱글톤의 형태로 실행가능한 어플리케이션 클래스를 정의한다. `main` 메서드는 새로운 `Point`를 생성하고 변수 `pt`에 저장한다. `val` 키워드로 정의된 값은 변경을 허용하지 않는다는 점에서 `var` 키워드로 정의된 값(`Point` 클래스 참)과는 다르다는 점에 주의하자. 즉, 이 값은 상수이다.

이 프로그램의 결과는 아래와 같다:

    (1, 2)
    (11, 12)

윤창석, 이한욱 옮김
