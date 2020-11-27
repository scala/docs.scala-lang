---
layout: tour
title: 어노테이션
partof: scala-tour

num: 31
language: ko

next-page: packages-and-imports
previous-page: automatic-closures
---

어노테이션은 메타 정보와 정의 내용을 연결해준다.

간단한 어노테이션 절은 `@C`나 `@C(a1, .., an)`와 같은 형태다. 여기서 `C`는 `C` 클래스의 생성자이며, `scala.Annotation`에 맞는 클래스여야만 한다. `a1, .., an`으로 주어지는 모든 생성자의 인수는 반드시 상수 표현식이여야 한다(예, 숫자 리터럴, 문자열, 클래스 리터럴, 자바 열거형, 그리고 이들의 1차원 배열).

어노테이션 절은 첫 번째 정의나, 그 다음에 이어지는 선언에 적용된다. 정의와 선언에는 하나 이상의 어노테이션 절이 붙을 수 있다. 이런 절이 표현되는 순서는 영향을 미치지 않는다.

어노테이션 절의 의미는 _구현 종속적_ 이다. 자바 플랫폼에선 다음의 스칼라 어노테이션이 표준에 해당하는 의미를 갖고 있다.

|           Scala           |           Java           |
|           ------          |          ------          |
|  [`scala.SerialVersionUID`](https://www.scala-lang.org/api/current/scala/SerialVersionUID.html)   |  [`serialVersionUID`](https://java.sun.com/j2se/1.5.0/docs/api/java/io/Serializable.html#navbar_bottom) (필드)  |
|  [`scala.deprecated`](https://www.scala-lang.org/api/current/scala/deprecated.html)   |  [`java.lang.Deprecated`](https://java.sun.com/j2se/1.5.0/docs/api/java/lang/Deprecated.html) |
|  [`scala.inline`](https://www.scala-lang.org/api/current/scala/inline.html) (2.6.0 부터)  |  해당 없음 |
|  [`scala.native`](https://www.scala-lang.org/api/current/scala/native.html) (2.6.0 부터)  |  [`native`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (키워드) |
|  [`scala.throws`](https://www.scala-lang.org/api/current/scala/throws.html) |  [`throws`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (키워드) |
|  [`scala.transient`](https://www.scala-lang.org/api/current/scala/transient.html) |  [`transient`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (키워드) |
|  [`scala.unchecked`](https://www.scala-lang.org/api/current/scala/unchecked.html) (2.4.0 부터) |  해당 없음 |
|  [`scala.volatile`](https://www.scala-lang.org/api/current/scala/volatile.html) |  [`volatile`](https://java.sun.com/docs/books/tutorial/java/nutsandbolts/_keywords.html) (키워드) |
|  [`scala.beans.BeanProperty`](https://www.scala-lang.org/api/current/scala/beans/BeanProperty.html) |  [`디자인 패턴`](https://docs.oracle.com/javase/tutorial/javabeans/writing/properties.html) |

다음 예제에선 자바의 메인 프로그램에서 던지는 예외를 잡기 위해, `read` 메소드에 `throws` 어노테이션을 추가했다.

> 자바 컴파일러는 메소드나 생성자를 실행할 때 어떤 확인 예외가 발생할 수 있는지 분석해, 프로그램이 확인이 필요한 예외를 처리할 핸들러를 포함하고 있는지 검사한다. 메소드나 생성자의 **throws** 절에선 발생할 가능성이 있는 확인 예외마다, 해당 예외의 클래스나 해당 예외 클래스의 상위 클래스를 반드시 명시해야 한다.
> 스칼라는 확인 예외가 없기 때문에 스칼라 메소드는 스칼라 메소드가 던지는 예외를 자바 코드가 잡을 수 있도록 반드시 하나 이상의 `throws` 어노테이션을 붙여야 한다.

    package examples
    import java.io._
    class Reader(fname: String) {
      private val in = new BufferedReader(new FileReader(fname))
      @throws(classOf[IOException])
      def read() = in.read()
    }

다음의 자바 프로그램은 `main` 메소드의 첫 번째 인수로 전달된 이름의 파일을 열어 내용을 출력한다.

    package test;
    import examples.Reader;  // Scala class !!
    public class AnnotaTest {
        public static void main(String[] args) {
            try {
                Reader in = new Reader(args[0]);
                int c;
                while ((c = in.read()) != -1) {
                    System.out.print((char) c);
                }
            } catch (java.io.IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

Reader 클래스의 `throws` 어노테이션을 주석으로 처리하면 자바 메인 프로그램을 컴파일 할 때 다음과 같은 오류 메시지가 나타난다.

    Main.java:11: exception java.io.IOException is never thrown in body of
    corresponding try statement
            } catch (java.io.IOException e) {
              ^
    1 error

### 자바 어노테이션 ###

**주의:** 자바 어노테이션과 함께 `-target:jvm-1.5` 옵션을 사용해야 한다.

자바 1.5에선 [어노테이션](https://java.sun.com/j2se/1.5.0/docs/guide/language/annotations.html)이란 형태로 사용자 지정 메타데이터가 추가됐다. 어노테이션의 핵심 기능은 키와 값의 쌍을 지정해 자신의 항목을 초기화하는 데 기반하고 있다. 예를 들어 클래스의 출처를 추적하고 싶다면 다음과 같이 정의할 수 있다.

    @interface Source {
      public String URL();
      public String mail();
    }

그리고 이를 다음과 같이 적용한다.

    @Source(URL = "https://coders.com/",
            mail = "support@coders.com")
    public class MyClass extends HisClass ...

스칼라에선 어노테이션을 적용하는 방식은 생성자 호출과 비슷한 모습을 갖고 있으며 자바 어노테이션을 인스턴스화 하기 위해선 이름을 지정한 인수를 사용해야 한다.

    @Source(URL = "https://coders.com/",
            mail = "support@coders.com")
    class MyScalaClass ...

어노테이션에 단 하나의 항목(기본 값이 없는)만  있다면 이 구문은 상당히 장황하게 느껴지기 때문에, 자바에선 그 이름이 `value`로 지정됐다면 편의를 위해 생성자와 유사한 구문을 사용할 수도 있다.

    @interface SourceURL {
        public String value();
        public String mail() default "";
    }

그리고 이를 다음과 같이 적용한다.

    @SourceURL("https://coders.com/")
    public class MyClass extends HisClass ...

이 경우엔 스칼라도 같은 기능을 제공한다.

    @SourceURL("https://coders.com/")
    class MyScalaClass ...

`mail` 항목은 기본 값과 함께 설정됐기 때문에 이 항목에 반드시 값을 명시적으로 할당할 필요는 없다. 하지만 만약 해야만 한다면, 자바의 두 스타일을 함께 섞어서 사용할 순 없다.

    @SourceURL(value = "https://coders.com/",
               mail = "support@coders.com")
    public class MyClass extends HisClass ...

스칼라에선 이를 사용하는 더 유연한 방법을 제공한다.

    @SourceURL("https://coders.com/",
               mail = "support@coders.com")
        class MyScalaClass ...

윤창석, 이한욱 옮김
