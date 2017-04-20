---
layout: overview-large
title: Indentation

partof: style-guide
num: 2
languages: [ko]
---

Indentation should follow the "2-space convention". Thus, instead of
indenting like this:
들여쓰기는 "2-공백"을 따르도록 한다. 앞서 언급한것 처럼 아래의 경우 대신

    // wrong!
    class Foo {
        def bar = ...
    }

You should indent like this: 
이렇게 들여쓰기를 하라.

    // right!
    class Foo {
      def bar = ..
    }


The Scala language encourages a startling amount of nested scopes and
logical blocks (function values and such). Do yourself a favor and don't
penalize yourself syntactically for opening up a new block. Coming from
Java, this style does take a bit of getting used to, but it is well
worth the effort.
스칼라 언어는 놀랄만한 양의 중첩된 스코프와 논리블럭을 장려한다. 스스로를 위해 새 블럭을 여는 구문적 패널티를 주지마라. 자바에서 온 이 방식은 종종 익숙함을 가져다 주지만 그만한 노력할 가치가 있다.

## 줄 바꿈(Line Wrapping)

There are times when a single expression reaches a length where it
becomes unreadable to keep it confined to a single line (usually that
length is anywhere above 80 characters). In such cases, the *preferred*
approach is to simply split the expression up into multiple expressions
by assigning intermediate results to values. However, this is not
always a practical solution.
한줄 표현식이 한줄에 대한 제약 때문에 읽기가 힘들어지는 길이가 있다(보통 80자 이상). 그런 경우의 바람직한 접근법은 중간 결과 할당을 이용해 여러줄로 분리를 하는것 이다. 그러나 이것은 항상 현실적인 해결책이 아니다.


When it is absolutely necessary to wrap an expression across more than
one line, each successive line should be indented two spaces from the
*first*. Also remember that Scala requires each "wrap line" to either
have an unclosed parenthetical or to end with an infix method in which
the right parameter is not given:
하나의 표현식에 대한 줄바꿈이 절대적으로 필요할 때, *처음*과 같이 각 연속적인 줄은 2칸의 공백으로 들여쓰기가 되어야 한다. 또한 스칼라는 각 묶여진 줄이 완결되지 않거나 완결되기 위해 우측 파라미터에 중위연산자가 주어지지 않아야 한다.

    val result = 1 + 2 + 3 + 4 + 5 + 6 +
      7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 +
      15 + 16 + 17 + 18 + 19 + 20

Without this trailing method, Scala will infer a semi-colon at the end
of a line which was intended to wrap, throwing off the compilation
sometimes without even so much as a warning.


## 많은 인자의 메소드(Methods with Numerous Arguments)

When calling a method which takes numerous arguments (in the range of
five or more), it is often necessary to wrap the method invocation onto
multiple lines. In such cases, put each argument on a line by
itself, indented two spaces from the current indent level:
많은 인자를 가진 메소드를 호출할때(다섯개 이상), 여러줄에 걸친 메소드 호출을 묶는것도 종종 필요하다. 그런 경우에, 2칸의 들여쓰기를 한 인자를 각각의 줄에 쓰면된다.

    foo(
      someVeryLongFieldName,
      andAnotherVeryLongFieldName,
      "this is a string",
      3.1415)

This way, all parameters line up, but you don't need to re-align them if
you change the name of the method later on.
이 방법은, 모든 매개변수가 정렬이 되지만, 나중에 메소드의 이름을 바꾸더라도 재정렬을 할 필요가 없다.

Great care should be taken to avoid these sorts of invocations well into
the length of the line. More specifically, such an invocation should be
avoided when each parameter would have to be indented more than 50
spaces to achieve alignment. In such cases, the invocation itself should
be moved to the next line and indented two spaces:
크게 주의해야할 점은 이런 호출들이 너무 잘 들여쓰기가 되는걸 피해야한다. 좀더 구체적으로는, 정렬을 맞추기 위해 각 매개변수에 50칸 이상의 공백을 들여쓰기하는 점이다. 그런 경우에, 호출하는 부분이 다음줄로 내려가고 두칸 들여쓰기가 되어야 한다:

    // right!
    val myOnerousAndLongFieldNameWithNoRealPoint = 
      foo(
        someVeryLongFieldName,
        andAnotherVeryLongFieldName,
        "this is a string",
        3.1415)

    // wrong!
    val myOnerousAndLongFieldNameWithNoRealPoint = foo(someVeryLongFieldName,
                                                       andAnotherVeryLongFieldName,
                                                       "this is a string",
                                                       3.1415)

Better yet, just try to avoid any method which takes more than two or
three parameters!
우선 매개변수를 두개 혹은 세개를 받는 아무 메소드로 시도해보면 더욱 좋다.

