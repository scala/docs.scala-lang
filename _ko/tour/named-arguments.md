---
layout: tour
title: 이름을 지정한 파라미터
partof: scala-tour

num: 33
language: ko

previous-page: default-parameter-values
---

메소드와 함수를 호출할 땐 다음과 같이 해당 호출에서 명시적으로 변수의 이름을 사용할 수 있다.

      def printName(first:String, last:String) = {
        println(first + " " + last)
      }

      printName("John","Smith")
      // "John Smith"를 출력
      printName(first = "John",last = "Smith")
      // "John Smith"를 출력
      printName(last = "Smith",first = "John")
      // "John Smith"를 출력

일단 호출에서 파라미터 이름을 사용했다면 모든 파라미터에 이름이 붙어 있는 한 그 순서는 중요치 않다. 이 기능은 [기본 파라미터 값]({{ site.baseurl }}/tutorials/tour/default-parameter-values.html)과 잘 어울려 동작한다.

      def printName(first:String = "John", last:String = "Smith") = {
        println(first + " " + last)
      }

      printName(last = "Jones")
      // "John Jones"를 출력

여러분이 원하는 순서대로 파라미터를 위치시킬 수 있기 때문에 파라미터 목록 중에서 가장 중요한 파라미터부터 기본 값을 사용할 수 있다.

윤창석, 이한욱 옮김
