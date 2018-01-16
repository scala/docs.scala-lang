---
layout: tour
title: 연산자

discourse: false

partof: scala-tour

num: 29
language: ko

next-page: automatic-closures
previous-page: type-inference
---

스칼라에선 단일 파라미터를 취하는 모든 메소드를 *중위 연산자*로 사용할 수 있다. 다음은 `and`와 `or`, `negate` 등의 세 가지 메소드를 정의하고 있는 클래스 `MyBool`의 정의다.

    class MyBool(x: Boolean) {
      def and(that: MyBool): MyBool = if (x) that else this
      def or(that: MyBool): MyBool = if (x) this else that
      def negate: MyBool = new MyBool(!x)
    }

이제 `and`와 `or`를 중위 연산자로 사용할 수 있다.

    def not(x: MyBool) = x negate; // 여기엔 세미콜론이 필요함
    def xor(x: MyBool, y: MyBool) = (x or y) and not(x and y)

이 코드의 첫 번째 줄에서 알 수 있듯이, 무항 메소드는 후위 연산자로 사용할 수도 있다. 두 번째 줄에선 `and`와 `or` 메소드와 함께 새로운 함수 `not`을 사용해 `xor` 함수를 정의했다. 이 예제에선 _중위 연산자_를 사용해 `xor` 정의의 가독성을 높일 수 있다.

다음은 이와 같은 코드를 좀 더 전통적인 객체지향 언어 구문에 따라 작성해본 코드다.

    def not(x: MyBool) = x.negate; // 여기엔 세미콜론이 필요함
    def xor(x: MyBool, y: MyBool) = x.or(y).and(x.and(y).negate)

윤창석, 이한욱 옮김
