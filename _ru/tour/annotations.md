---
layout: tour
title: Аннотации
partof: scala-tour
num: 32
language: ru
next-page: packages-and-imports
previous-page: by-name-parameters
---

Аннотации используются для передачи метаданных при объявлении. Например, аннотация `@deprecated` перед объявлением метода, заставит компилятор вывести предупреждение, если этот метод будет использован.

{% tabs annotations_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_1 %}

```scala mdoc:fail
object DeprecationDemo extends App {
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello
}
```

{% endtab %}
{% tab 'Scala 3' for=annotations_1 %}

```scala
object DeprecationDemo extends App:
  @deprecated("deprecation message", "release # which deprecates method")
  def hello = "hola"

  hello
```

{% endtab %}
{% endtabs %}

Такой код скомпилируется, но компилятор выдаст предупреждение: "there was one deprecation warning".

Аннотация применяется к первому идущему после нее объявлению или определению. Допускается использование сразу нескольких аннотаций следующих друг за другом. Порядок, в котором приводятся аннотации, не имеет значения.

## Аннотации, обеспечивающие корректность работы кода

Некоторые аннотации приводят к невозможности компиляции, если условие (условия) не выполняется. Например, аннотация `@tailrec` гарантирует, что метод является [хвостовой рекурсией](https://ru.wikipedia.org/wiki/%D0%A5%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%B2%D0%B0%D1%8F_%D1%80%D0%B5%D0%BA%D1%83%D1%80%D1%81%D0%B8%D1%8F). Хвостовая рекурсия помогает держать потребление памяти на постоянном уровне. Вот как она используется в методе, который вычисляет факториал:

{% tabs annotations_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_2 %}

```scala mdoc
import scala.annotation.tailrec

def factorial(x: Int): Int = {

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int = {
    if (x == 1) accumulator else factorialHelper(x - 1, accumulator * x)
  }
  factorialHelper(x, 1)
}
```

{% endtab %}
{% tab 'Scala 3' for=annotations_2 %}

```scala
import scala.annotation.tailrec

def factorial(x: Int): Int =

  @tailrec
  def factorialHelper(x: Int, accumulator: Int): Int =
    if x == 1 then accumulator else factorialHelper(x - 1, accumulator * x)
  factorialHelper(x, 1)
```

{% endtab %}
{% endtabs %}

Метод `factorialHelper` имеет аннотацию `@tailrec`, которая гарантирует, что метод действительно является хвостовой рекурсией. Если бы мы изменили реализацию `factorialHelper` так как указано далее, то компиляция бы провалилась:

{% tabs annotations_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_3 %}

```scala mdoc:fail
import scala.annotation.tailrec

def factorial(x: Int): Int = {
  @tailrec
  def factorialHelper(x: Int): Int = {
    if (x == 1) 1 else x * factorialHelper(x - 1)
  }
  factorialHelper(x)
}
```

{% endtab %}
{% tab 'Scala 3' for=annotations_3 %}

```scala
import scala.annotation.tailrec

def factorial(x: Int): Int =
  @tailrec
  def factorialHelper(x: Int): Int =
    if x == 1 then 1 else x * factorialHelper(x - 1)
  factorialHelper(x)
```

{% endtab %}
{% endtabs %}

Мы бы получили сообщение "Recursive call not in tail position"(Рекурсивный вызов не в хвостовой позиции).

## Аннотации, влияющие на генерацию кода

{% tabs annotations_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=annotations_4 %}

Некоторые аннотации типа `@inline` влияют на сгенерированный код (т.е. в результате сам код вашего jar-файл может отличаться). Такая аннотация означает вставку всего кода в тело метода вместо вызова. Полученный байт-код длиннее, но, надеюсь, работает быстрее. Использование аннотации `@inline` не гарантирует, что метод будет встроен, но заставит компилятор сделать это, если и только если будут соблюдены некоторые разумные требования к размеру сгенерированного кода.

{% endtab %}
{% tab 'Scala 3' for=annotations_4 %}

Некоторые аннотации типа `@main` влияют на сгенерированный код (т.е. в результате сам код вашего jar-файл может отличаться).
Аннотация `@main` к методу создает исполняемую программу, которая вызывает метод как точку входа.

{% endtab %}
{% endtabs %}

### Java аннотации

Есть некоторые отличия синтаксиса аннотаций, если пишется Scala код, который взаимодействует с Java.

**Примечание:**Убедитесь, что вы используете опцию `-target:jvm-1.8` с аннотациями Java.

Java имеет определяемые пользователем метаданные в виде [аннотаций](https://docs.oracle.com/javase/tutorial/java/annotations/). Ключевой особенностью аннотаций является то, что они задаются в виде пар ключ-значение для инициализации своих элементов. Например, если нам нужна аннотация для отслеживания источника какого-то класса, мы можем определить её как

{% tabs annotations_5 %}
{% tab 'Java' for=annotations_5 %}

```java
@interface Source {
  public String url();
  public String mail();
}
```

{% endtab %}
{% endtabs %}

А затем использовать следующим образом

{% tabs annotations_6 %}
{% tab 'Java' for=annotations_6 %}

```java
@Source(url = "https://coders.com/",
        mail = "support@coders.com")
public class MyJavaClass extends TheirClass ...
```

{% endtab %}
{% endtabs %}

Использование аннотации в Scala похоже на вызов конструктора. Для создания экземпляра из Java аннотации необходимо использовать именованные аргументы:

{% tabs annotations_7 %}
{% tab 'Scala 2 и 3' for=annotations_7 %}

```scala
@Source(url = "https://coders.com/",
        mail = "support@coders.com")
class MyScalaClass ...
```

{% endtab %}
{% endtabs %}

Этот синтаксис достаточно перегруженный, если аннотация содержит только один элемент (без значения по умолчанию), поэтому, если имя указано как `value`, оно может быть применено в Java с помощью конструктора-подобного синтаксиса:

{% tabs annotations_8 %}
{% tab 'Java' for=annotations_8 %}

```java
@interface SourceURL {
    public String value();
    public String mail() default "";
}
```

{% endtab %}
{% endtabs %}

А затем можно использовать следующим образом

{% tabs annotations_9 %}
{% tab 'Java' for=annotations_9 %}

```java
@SourceURL("https://coders.com/")
public class MyJavaClass extends TheirClass ...
```

{% endtab %}
{% endtabs %}

В этом случае Scala предоставляет такую же возможность

{% tabs annotations_10 %}
{% tab 'Scala 2 и 3' for=annotations_10 %}

```scala
@SourceURL("https://coders.com/")
class MyScalaClass ...
```

{% endtab %}
{% endtabs %}

Элемент `mail` был указан со значением по умолчанию, поэтому нам не нужно явно указывать его значение. Мы не можем смешивать эти два стиля в Java:

{% tabs annotations_11 %}
{% tab 'Java' for=annotations_11 %}

```java
@SourceURL(value = "https://coders.com/",
           mail = "support@coders.com")
public class MyJavaClass extends TheirClass ...
```

{% endtab %}
{% endtabs %}

Scala обеспечивает большую гибкость в этом отношении

{% tabs annotations_12 %}
{% tab 'Scala 2 и 3' for=annotations_12 %}

```scala
@SourceURL("https://coders.com/",
           mail = "support@coders.com")
class MyScalaClass ...
```

{% endtab %}
{% endtabs %}
