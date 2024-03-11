---
layout: multipage-overview
title: Взаимодействие с Java
scala3: true
partof: scala3-book
overview-name: "Scala 3 — Book"
type: chapter
description: На этой странице показано, как код Scala может взаимодействовать с Java и как код Java может взаимодействовать с кодом Scala.
language: ru
num: 72
previous-page: tools-worksheets
next-page:
---

## Введение

В этом разделе рассматривается, как использовать код Java в Scala и, наоборот, как использовать код Scala в Java.

В целом, использование Java-кода в Scala довольно простое.
Есть лишь несколько моментов,
когда может появиться желание использовать утилиты Scala для преобразования концепций Java в Scala,
в том числе:

- Классы коллекций Java
- Java класс `Optional`

Аналогично, если вы пишете код Java и хотите использовать концепции Scala,
вам потребуется преобразовать коллекции Scala и Scala класс `Option`.

В следующих разделах демонстрируются наиболее распространенные преобразования, которые вам могут понадобиться:

- Как использовать коллекции Java в Scala
- Как использовать Java `Optional` в Scala
- Расширение Java интерфейсов в Scala
- Как использовать коллекции Scala в Java
- Как использовать Scala `Option` в Java
- Как использовать трейты Scala в Java
- Как обрабатывать методы Scala, которые вызывают исключения в коде Java
- Как использовать vararg-параметры Scala в Java
- Создание альтернативных имен для использования методов Scala в Java

> Обратите внимание: примеры Java в этом разделе предполагают, что вы используете Java 11 или более позднюю версию.

## Как использовать коллекции Java в Scala

Когда вы пишете код на Scala, а API либо требует, либо создает класс коллекции Java (из пакета `java.util`),
тогда допустимо напрямую использовать или создавать коллекцию, как в Java.

Однако для идиоматического использования в Scala, например, для циклов `for` по коллекции
или для применения функций высшего порядка, таких как `map` и `filter`,
вы можете создать прокси, который будет вести себя как коллекция Scala.

Вот пример того, как это работает.
Учитывая следующий API, который возвращает `java.util.List[String]`:

{% tabs foo-definition %}
{% tab Java %}

```java
public interface Foo {
  static java.util.List<String> getStrings() {
    return List.of("a", "b", "c");
  }
}
```

{% endtab %}
{% endtabs %}

Вы можете преобразовать этот Java список в Scala `Seq`,
используя утилиты преобразования из Scala объекта `scala.jdk.CollectionConverters`:

{% tabs foo-usage class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import scala.jdk.CollectionConverters._
import scala.collection.mutable

def testList() = {
  println("Using a Java List in Scala")
  val javaList: java.util.List[String] = Foo.getStrings()
  val scalaSeq: mutable.Seq[String] = javaList.asScala
  for (s <- scalaSeq) println(s)
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
import scala.jdk.CollectionConverters.*
import scala.collection.mutable

def testList() =
  println("Using a Java List in Scala")
  val javaList: java.util.List[String] = Foo.getStrings()
  val scalaSeq: mutable.Seq[String] = javaList.asScala
  for s <- scalaSeq do println(s)
```

{% endtab %}
{% endtabs %}

В приведенном выше коде создается оболочка `javaList.asScala`,
которая адаптирует `java.util.List` к коллекции Scala `mutable.Seq`.

## Как использовать Java `Optional` в Scala

Когда вы взаимодействуете с API, который использует класс `java.util.Optional` в коде Scala,
его можно создавать и использовать, как в Java.

Однако для идиоматического использования в Scala, например использования в `for`,
вы можете преобразовать его в Scala `Option`.

Чтобы продемонстрировать это, вот Java API, который возвращает значение типа `Optional[String]`:

{% tabs bar-definition %}
{% tab Java %}

```java
public interface Bar {
  static java.util.Optional<String> optionalString() {
    return Optional.of("hello");
  }
}
```

{% endtab %}
{% endtabs %}

Сначала импортируйте всё из объекта `scala.jdk.OptionConverters`,
а затем используйте метод `toScala` для преобразования `Optional` значения в Scala `Option`:

{% tabs bar-usage class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import java.util.Optional
import scala.jdk.OptionConverters._

val javaOptString: Optional[String] = Bar.optionalString
val scalaOptString: Option[String] = javaOptString.toScala
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
import java.util.Optional
import scala.jdk.OptionConverters.*

val javaOptString: Optional[String] = Bar.optionalString
val scalaOptString: Option[String] = javaOptString.toScala
```

{% endtab %}
{% endtabs %}

## Расширение Java интерфейсов в Scala

Если вам нужно использовать Java интерфейсы в коде Scala, расширяйте их так, как если бы они были трейтами Scala.
Например, учитывая эти три Java интерфейса:

{% tabs animal-definition %}
{% tab Java %}

```java
public interface Animal {
  void speak();
}

public interface Wagging {
  void wag();
}

public interface Running {
  // an implemented method
  default void run() {
    System.out.println("I’m running");
  }
}
```

{% endtab %}
{% endtabs %}

вы можете создать класс `Dog` в Scala так же, как если бы вы использовали трейты.
Поскольку у `run` есть реализация по умолчанию, вам нужно реализовать только методы `speak` и `wag`:

{% tabs animal-usage class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Dog extends Animal with Wagging with Running {
  def speak = println("Woof")
  def wag = println("Tail is wagging")
}

def useJavaInterfaceInScala = {
  val d = new Dog()
  d.speak
  d.wag
  d.run
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
class Dog extends Animal, Wagging, Running:
  def speak = println("Woof")
  def wag = println("Tail is wagging")

def useJavaInterfaceInScala =
  val d = Dog()
  d.speak
  d.wag
  d.run
```

{% endtab %}
{% endtabs %}

Также обратите внимание, что в Scala методы Java, определенные с пустыми списками параметров,
можно вызывать либо так же, как в Java, `.wag()`,
либо вы можете отказаться от использования круглых скобок `.wag`.

## Как использовать коллекции Scala в Java

Если вам нужно использовать класс коллекции Scala в своем Java-коде,
используйте методы Scala объекта `scala.jdk.javaapi.CollectionConverters` в своем Java-коде,
для корректной работы конверсии.

Например, предположим, что Scala API возвращает `List[String]`, как следующем примере:

{% tabs baz-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object Baz {
  val strings: List[String] = List("a", "b", "c")
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
object Baz:
  val strings: List[String] = List("a", "b", "c")
```

{% endtab %}
{% endtabs %}

Вы можете получить доступ к Scala `List` в Java-коде следующим образом:

{% tabs baz-usage %}
{% tab Java %}

```java
import scala.jdk.javaapi.CollectionConverters;

// получить доступ к методу `strings` с помощью `Baz.strings()`
scala.collection.immutable.List<String> xs = Baz.strings();

java.util.List<String> listOfStrings = CollectionConverters.asJava(xs);

for (String s: listOfStrings) {
  System.out.println(s);
}
```

{% endtab %}
{% endtabs %}

Этот код можно сократить, но показаны полные шаги, чтобы продемонстрировать, как работает процесс.
Обязательно обратите внимание, что хотя `Baz` имеет поле с именем `strings`,
в Java оно отображается как метод, поэтому его следует вызывать в круглых скобках `.strings()`.

## Как использовать Scala `Option` в Java

Если вам нужно использовать Scala `Option` в коде Java,
вы можете преобразовать значение `Option` в значение Java `Optional`,
используя метод `toJava` объекта Scala `scala.jdk.javaapi.OptionConverters`.

Например, предположим, что Scala API возвращает `Option[String]`, как следующем примере:

{% tabs qux-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object Qux {
  val optString: Option[String] = Option("hello")
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
object Qux:
  val optString: Option[String] = Option("hello")
```

{% endtab %}
{% endtabs %}

Затем вы можете получить доступ к Scala `Option` в своем Java-коде следующим образом:

{% tabs qux-usage %}
{% tab Java %}

```java
import java.util.Optional;
import scala.Option;
import scala.jdk.javaapi.OptionConverters;

Option<String> scalaOptString = Qux.optString();
Optional<String> javaOptString = OptionConverters.toJava(scalaOptString);
```

{% endtab %}
{% endtabs %}

Этот код можно сократить, но показаны полные шаги, чтобы продемонстрировать, как работает процесс.
Обязательно обратите внимание, что хотя `Qux` имеет поле с именем `optString`,
в Java оно отображается как метод, поэтому его следует вызывать в круглых скобках `.optString()`.

## Как использовать трейты Scala в Java

Начиная с Java 8, вы можете использовать трейт Scala точно так же, как Java интерфейс,
даже если этот трейт реализует методы.
Например, учитывая эти два трейта Scala, один с реализованным методом, а другой только с интерфейсом:

{% tabs scala-trait-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait ScalaAddTrait {
  def sum(x: Int, y: Int) = x + y     // реализован
}

trait ScalaMultiplyTrait {
  def multiply(x: Int, y: Int): Int   // абстрактный
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
trait ScalaAddTrait:
  def sum(x: Int, y: Int) = x + y     // реализован

trait ScalaMultiplyTrait:
  def multiply(x: Int, y: Int): Int   // абстрактный
```

{% endtab %}
{% endtabs %}

Класс Java может реализовать оба этих интерфейса и определить метод `multiply`:

{% tabs scala-trait-usage %}
{% tab Java %}

```java
class JavaMath implements ScalaAddTrait, ScalaMultiplyTrait {
  public int multiply(int a, int b) {
    return a * b;
  }
}

JavaMath jm = new JavaMath();
System.out.println(jm.sum(3,4));        // 7
System.out.println(jm.multiply(3,4));   // 12
```

{% endtab %}
{% endtabs %}

## Как обрабатывать методы Scala, которые вызывают исключения в коде Java

Когда вы пишете код на Scala, используя идиомы программирования Scala,
вы никогда не напишете метод, который генерирует исключение.
Но если по какой-то причине у вас есть метод Scala, который генерирует исключение,
и вы хотите, чтобы разработчики Java могли использовать этот метод,
добавьте аннотацию `@throws` к вашему методу Scala,
чтобы Java потребители знали, какие исключения он может генерировать.

Например, следующий Scala метод `exceptionThrower` аннотирован, чтобы объявить, что он выдает `Exception`:

{% tabs except-throw-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object SExceptionThrower {
  @throws[Exception]
  def exceptionThrower =
    throw new Exception("Idiomatic Scala methods don’t throw exceptions")
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
object SExceptionThrower:
  @throws[Exception]
  def exceptionThrower =
    throw Exception("Idiomatic Scala methods don’t throw exceptions")
```

{% endtab %}
{% endtabs %}

В результате вам придется обрабатывать исключение в своем Java-коде.
Например, этот код не скомпилируется из-за необработанного исключения:

{% tabs except-throw-usage %}
{% tab Java %}

```java
// не скомпилируется, потому что исключение не обработано
public class ScalaExceptionsInJava {
  public static void main(String[] args) {
    SExceptionThrower.exceptionThrower();
  }
}
```

{% endtab %}
{% endtabs %}

Компилятор выдает следующую ошибку:

```plain
[error] ScalaExceptionsInJava: unreported exception java.lang.Exception;
        must be caught or declared to be thrown
[error] SExceptionThrower.exceptionThrower()
```

Хорошо — это то, что вы хотите: аннотация сообщает компилятору Java, что `exceptionThrower` может выдать исключение.
Теперь, когда вы пишете код на Java, вы должны обрабатывать исключение с помощью блока `try`
или объявлять, что ваш Java метод генерирует исключение.

И наоборот, если вы укажите аннотацию Scala метода `exceptionThrower`, код Java _будет скомпилирован_.
Вероятно, это не то, что вам нужно, поскольку Java код может не учитывать метод Scala, выдающий исключение.

## Как использовать vararg-параметры Scala в Java

Если метод Scala имеет неопределенное количество параметров и вы хотите использовать этот метод в Java,
отметьте Scala метод аннотацией `@varargs`.
Например, метод `printAll` в этом Scala классе объявляет vararg-поле `String*`:

{% tabs vararg-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import scala.annotation.varargs

object VarargsPrinter {
  @varargs def printAll(args: String*): Unit = args.foreach(println)
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
import scala.annotation.varargs

object VarargsPrinter:
  @varargs def printAll(args: String*): Unit = args.foreach(println)
```

{% endtab %}
{% endtabs %}

Поскольку `printAll` объявлен с аннотацией `@varargs`, его можно вызвать из Java программы
с переменным количеством параметров, как показано в этом примере:

{% tabs vararg-usage %}
{% tab Java %}

```java
public class JVarargs {
  public static void main(String[] args) {
    VarargsPrinter.printAll("Hello", "world");
  }
}
```

{% endtab %}
{% endtabs %}

Запуск кода приводит к следующему выводу:

```plain
Hello
world
```

## Создание альтернативных имен для использования методов Scala в Java

В Scala вы можете создать имя метода, используя символический знак:

{% tabs add-definition %}
{% tab 'Scala 2 и 3' %}

```scala
def +(a: Int, b: Int) = a + b
```

{% endtab %}
{% endtabs %}

Такое имя метода корректно работать в Java не будет,
но в Scala вы можете предоставить "альтернативное" имя метода с аннотацией `targetName`,
которая будет именем метода при использовании из Java:

{% tabs add-2-definition class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import scala.annotation.targetName

object Adder {
  @targetName("add") def +(a: Int, b: Int) = a + b
}
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
import scala.annotation.targetName

object Adder:
  @targetName("add") def +(a: Int, b: Int) = a + b
```

{% endtab %}
{% endtabs %}

Теперь в вашем Java-коде вы можете использовать псевдоним метода `add`:

{% tabs add-2-usage %}
{% tab Java %}

```java
int x = Adder.add(1,1);
System.out.printf("x = %d\n", x);
```

{% endtab %}
{% endtabs %}
