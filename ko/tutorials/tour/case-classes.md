---
layout: tutorial
title: 케이스 클래스

disqus: true

tutorial: scala-tour
num: 5
language: ko
---

스칼라는 _케이스 클래스_ 개념을 지원한다. 케이스 클래스는 생성자 파라미터를 노출하고 [패턴 매칭](pattern-matching.html)을 통해 재귀적 디컴포지션 메커니즘을 제공하는 일반 클래스이다.

아래 예제는 추상 슈퍼클래스 `Term`과 세 개의 콘크리트 클래스 `Var`, `Fun`, `App`으로 이루어진 클래스 계층구조를 나타낸다.

    abstract class Term
    case class Var(name: String) extends Term
    case class Fun(arg: String, body: Term) extends Term
    case class App(f: Term, v: Term) extends Term

이 클래스 계층구조는 [타입 없는 람다 칼큘러스](http://www.ezresult.com/article/Lambda_calculus)의 표현식으로 사용될 수 있다. 케이스 클래스의 인스턴스 생성을 편리하게 하기 위해서 스칼라에서는 `new` 프리미티브를 쓰지 않아도 된다.  단지 클래스명을 함수로 쓸 수 있다.

예를 들면 다음과 같다 :

    Fun("x", Fun("y", App(Var("x"), Var("y"))))

케이스 클래스의 생성자 파라미터는 퍼블릭 값으로 취급되어 직접 접근할 수 있다.

    val x = Var("x")
    println(x.name)

모든 케이스 클래스에 대해 스칼라 컴파일러는 구조적 동일성을 구현하는 `equals` 메서드와 `toString` 메서드를 생성한다. 예를 들면, 

    val x1 = Var("x")
    val x2 = Var("x")
    val y1 = Var("y")
    println("" + x1 + " == " + x2 + " => " + (x1 == x2))
    println("" + x1 + " == " + y1 + " => " + (x1 == y1))

와 같은 코드는 다음과 같이 출력된다.

    Var(x) == Var(x) => true
    Var(x) == Var(y) => false

케이스 클래스의 정의는 패턴매칭이 데이터 구조를 쪼개는 데에 사용될 때에만 유효하다. 아래와 같은 객체는 위의 람다 칼큘러스 표현을 위한 간단한 프린터를 정의한다.

    object TermTest extends scala.App {
      def printTerm(term: Term) {
        term match {
          case Var(n) =>
            print(n)
          case Fun(x, b) =>
            print("^" + x + ".")
            printTerm(b)
          case App(f, v) =>
            print("(")
            printTerm(f)
            print(" ")
            printTerm(v)
            print(")")
        }
      }
      def isIdentityFun(term: Term): Boolean = term match {
        case Fun(x, Var(y)) if x == y => true
        case _ => false
      }
      val id = Fun("x", Var("x"))
      val t = Fun("x", Fun("y", App(Var("x"), Var("y"))))
      printTerm(t)
      println
      println(isIdentityFun(id))
      println(isIdentityFun(t))
    }

이 예제에서 함수 `printTerm`은 `match` 키워드로 시작되고 `case Patterm => Body` 구문으로 구성되는 패턴 매칭 구문으로 표현되어 있다. 이 프로그램은 또한 주어진 표현식이 단순한 항등함수인지 확인하는 함수 `isIdentityFun`을 정의한다. 이 예제는 딥 패턴과 가드를 사용한다. 주어진 값으로 패턴 매칭을 한 뒤에 (`if` 키워드 이후에 정의된) 가드가 계산된다. 만약 `true`를 리턴하면, 매칭이 성공한 것이고 그렇지 않은 경우 매칭이 실패하고 다음 패턴을 시도한다. 

윤창석, 이한욱 옮김