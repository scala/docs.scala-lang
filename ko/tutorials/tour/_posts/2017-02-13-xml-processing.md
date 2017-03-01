---
layout: tutorial
title: XML 처리

disqus: true

tutorial: scala-tour
categories: tour
num: 13
language: ko
---

스칼라를 사용하면 손쉽게 XML 문서를 생성하고 파싱해 처리할 수 있다. 스칼라에서는 제네릭 데이터 표현이나 데이터 별 데이터 표현을 사용해 XML 데이터를 나타낼 수 있다. 데이터 별 데이터 표현을 사용한 접근법은 *데이터 바인딩* 도구인 `schema2src`를 통해 지원된다.

### 런타임 표현 ###
XML 데이터는 이름이 붙은 트리로 표현된다. 스칼라 1.2부턴(앞선 버전에선 -Xmarkupoption을 사용해야 한다) 표준 XML 구문을 사용해 간편하게 이름을 붙인 노드를 생성할 수 있다.

다음의 XML 문서를 살펴보자.

    <html>
      <head>
        <title>Hello XHTML world</title>
      </head>
      <body>
        <h1>Hello world</h1>
        <p><a href="http://scala-lang.org/">Scala</a> talks XHTML</p>
      </body>
    </html>

다음과 같은 스칼라 프로그램으로 이 문서를 생성할 수 있다.

    object XMLTest1 extends App {
      val page = 
      <html>
        <head>
          <title>Hello XHTML world</title>
        </head>
        <body>
          <h1>Hello world</h1>
          <p><a href="scala-lang.org">Scala</a> talks XHTML</p>
        </body>
      </html>;
      println(page.toString())
    }

스칼라 표현식과 XML을 섞을 수도 있다.

    object XMLTest2 extends App {
      import scala.xml._
      val df = java.text.DateFormat.getDateInstance()
      val dateString = df.format(new java.util.Date())
      def theDate(name: String) = 
        <dateMsg addressedTo={ name }>
          Hello, { name }! Today is { dateString }
        </dateMsg>;
      println(theDate("John Doe").toString())
    }

### 데이터 바인딩 ###
많은 경우엔 처리를 원하는 XML 문서에 해당하는 DTD를 알고 있고, 이를 처리할 특화된 스칼라 클래스를 생성해서 XML을 파싱하고 저장하고 싶은 상황이 발생할 수 있다. 스칼라는 DTD를 변환해 여러분을 위한 모든 동작을 수행할 스칼라 클래스 정의 집합을 만들어주는, 실용적이고 쓰기 편한 도구를 포함하고 있다.
schema2src 도구에 관한 문서와 예제는 Burak의 [스칼라 XML 도서 원고](http://burak.emir.googlepages.com/scalaxbook.docbk.html)를 참고하자.


윤창석, 이한욱 옮김