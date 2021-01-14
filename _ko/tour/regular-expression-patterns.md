---
layout: tour
title: 정규 표현식 패턴
partof: scala-tour

num: 14
language: ko

next-page: extractor-objects
previous-page: singleton-objects
---

## 우측 무시 시퀀스 패턴 ##

우측 무시 패턴은 `Seq[A]`의 서브 타입이나 반복되는 정형 파라미터를 가진 케이스 클래스의 데이터를 분해할 때 유용한 기능이다. 다음 예를 살펴보자.

    Elem(prefix:String, label:String, attrs:MetaData, scp:NamespaceBinding, children:Node*)

이런 경우, 스칼라는 패턴의 가장 오른쪽 위치에 별 와일드카드 `_*`를 사용해 임의의 긴 시퀀스를 대신할 수 있도록 해준다.
다음 예제는 시퀀스의 앞 부분을 매칭하고 나머지는 변수 `rest`와 연결하는 패턴 매칭을 보여준다.

    object RegExpTest1 extends App {
      def containsScala(x: String): Boolean = {
        val z: Seq[Char] = x
        z match {
          case Seq('s','c','a','l','a', rest @ _*) =>
            println("rest is "+rest)
            true
          case Seq(_*) =>
            false
        }
      }
    }

이전의 스칼라 버전과는 달리, 다음과 같은 이유로 스칼라는 더 이상 임의의 정규 표현식을 허용하지 않는다.

###일반적인 `RegExp` 패턴은 일시적으로 스칼라에서 제외됐다###

정확성에 문제를 발견했기 때문에 이 기능은 스칼라 언어에서 일시적으로 제외됐다. 사용자 커뮤니티에서 요청한다면 개선된 형태로 이를 다시 활성화할 수도 있다.

정규 표현식 패턴이 XML 처리에 예상에 비해 그다지 유용하지 않다는 것이 우리의 의견이다. 실제 상황에서 XML를 처리해야하는 애플리케이션이라면 XPath가 더 나은 선택으로 보인다. 우리의 변환이나 정규 표현식 패턴에 드물지만 제거하기 어려운 난해한 버그가 있다는 점을 발견했을 때, 우리는 이 기회에 언어를 좀 더 단순하게 만들기로 결정했다.

윤창석, 이한욱 옮김
