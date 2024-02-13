---
title: 与 Java 交互
type: chapter
description: This page demonstrates how Scala code can interact with Java, and how Java code can interact with Scala code.
language: zh-cn
num: 72
previous-page: tools-worksheets
next-page: scala-for-java-devs

partof: scala3-book
overview-name: "Scala 3 — Book"
layout: multipage-overview
permalink: "/zh-cn/scala3/book/:title.html"
---

## 介绍

本节介绍如何在 Scala 中使用 Java 代码，以及如何在 Java 中使用 Scala 代码。

一般来说，在 Scala 中使用 Java 代码是非常无缝的。
只有几个地方需要使用 Scala 实用程序将 Java 概念转换为 Scala，包括：

- Java 集合类
- Java `Optional` 类

同样，如果您正在编写 Java 代码并想使用 Scala 概念，则需要转换 Scala 集合和 Scala `Option` 类。

以下部分演示了您需要的最常见的转换：

- 如何在 Scala 中使用 Java 集合
- 如何在 Scala 中使用 Java `Optional`
- 在 Scala 中扩展 Java 接口
- 如何在 Java 中使用 Scala 集合
- 如何在 Java 中使用 Scala `Option`
- 如何在 Java 中使用 Scala traits 
- 如何在 Java 代码中处理 Scala 方法引发的异常
- 如何在 Java 中使用 Scala 可变参数
- 创建备用名称以在 Java 中使用 Scala 方法

请注意，本节中的 Java 示例假设您使用的是 Java 11 或更高版本。

## 如何在 Scala 中使用 Java 集合

当您编写 Scala 代码并需要使用 Java 集合类时，您_可以_按原样使用该类。
但是，如果您想在 Scala `for` 循环中使用该类，或者想利用 Scala 集合类中的高阶函数，则需要将 Java 集合转换为 Scala 集合。

这是一个如何工作的例子。
假定这个例子是 Java `ArrayList`：

```java
// java
public class JavaClass {
  public static List<String> getStrings() {
    return new ArrayList<String>(List.of("a", "b", "c"));
  }
}
```

您可以使用 Scala _scala.jdk.CollectionConverters_ 包中的转换实用程序将该 Java 列表转换为 Scala `Seq`：

```scala
// scala
import scala.jdk.CollectionConverters.*

def testList() = 
  println("Using a Java List in Scala")
  val javaList: java.util.List[String] = JavaClass.getStrings()
  val scalaSeq: Seq[String] = javaList.asScala.toSeq
  scalaSeq.foreach(println)
  for s <- scalaSeq do println(s)
```

当然，该代码可以缩短，但此处显示的各个步骤是为了准确演示转换过程是如何工作的。

## 如何在 Scala 中使用 Java `Optional`

当您需要在 Scala 代码中使用 Java `Optional` 类时，导入 _scala.jdk.OptionConverters_ 对象，然后使用 `toScala` 方法将 `Optional` 值转换为 Scala `Option`。

为了证明这一点，这里有一个带有两个 `Optional<String>` 值的 Java 类，一个包含字符串，另一个为空：

```java
// java
import java.util.Optional;

public class JavaClass {
  static Optional<String> oString = Optional.of("foo");
  static Optional<String> oEmptyString = Optional.empty();
}
```

现在在您的 Scala 代码中，您可以访问这些字段。
如果您只是直接访问它们，它们都将是 `Optional` 值：

```scala
// scala
import java.util.Optional

val optionalString = JavaClass.oString         // Optional[foo]
val eOptionalString = JavaClass.oEmptyString   // Optional.empty
```

但是通过使用 _scala.jdk.OptionConverters_ 方法，您可以将它们转换为 Scala `Option` 值：

```scala
import java.util.Optional
import scala.jdk.OptionConverters.*

val optionalString = JavaClass.oString         // Optional[foo]
val optionString = optionalString.toScala      // Some(foo)

val eOptionalString = JavaClass.oEmptyString   // Optional.empty
val eOptionString = eOptionalString.toScala    // None
```

## 在 Scala 中扩展 Java 接口

如果您需要在 Scala 代码中使用 Java 接口，请将它们扩展为 Scala trait。
例如，给定这三个 Java 接口：

```java
// java
interface Animal {
  void speak();
}

interface Wagging {
  void wag();
}

interface Running {
  // an implemented method
  default void run() {
    System.out.println("I’m running");
  }
}
```

你可以在 Scala 中创建一个 `Dog` 类，就像使用 trait 一样。
你所要做的就是实现 `speak` 和 `wag` 方法：

```scala
// scala
class Dog extends Animal, Wagging, Running:
  def speak = println("Woof")
  def wag = println("Tail is wagging")

@main def useJavaInterfaceInScala =
  val d = new Dog
  d.speak
  d.wag
```

## 如何在 Java 中使用 Scala 集合

当您需要在 Java 代码中使用 Scala 集合类时，请在 Java 代码中使用 Scala 的 `scala.jdk.javaapi.CollectionConverters` 对象的方法来进行转换。
例如，如果您在 Scala 类中有这样的 `List[String]`：

```scala
// scala
class ScalaClass:
  val strings = List("a", "b")
```

您可以像这样在 Java 代码中访问该 Scala `List`：

```java
// java
import scala.jdk.javaapi.CollectionConverters;

// create an instance of the Scala class
ScalaClass sc = new ScalaClass();

// access the `strings` field as `sc.strings()`
scala.collection.immutable.List<String> xs = sc.strings();

// convert the Scala `List` a Java `List<String>`
java.util.List<String> listOfStrings = CollectionConverters.asJava(xs);
listOfStrings.forEach(System.out::println);
```

该代码可以缩短，但显示了完整的步骤以演示该过程的工作原理。
以下是该代码中需要注意的一些事项：

- 在你的 Java 代码中，你创建一个 `ScalaClass` 的实例，就像一个 Java 类的实例一样
- `ScalaClass` 有一个名为 `strings` 的字段，但在 Java 中，您可以将该字段作为方法访问，即，作为 `sc.strings()`

## 如何在 Java 中使用 Scala `Option`

当您需要在 Java 代码中使用 Scala `Option` 时，可以使用 Scala `scala.jdk.javaapi.OptionConverters` 对象的 `toJava` 方法将 `Option` 转换为 Java `Optional` 值。

为了证明这一点，创建一个具有两个 `Option[String]` 值的 Scala 类，一个包含字符串，另一个为空：

```scala
// scala
object ScalaObject:
  val someString = Option("foo")
  val noneString: Option[String] = None
```

然后在您的 Java 代码中，使用来自 `scala.jdk.javaapi.OptionConverters` 对象的 `toJava` 方法将这些 `Option[String]` 值转换为 `java.util.Optional[String]`：

```java
// java
import java.util.Optional;
import static scala.jdk.javaapi.OptionConverters.toJava;

public class JUseScalaOptionInJava {
  public static void main(String[] args) {
    Optional<String> stringSome = toJava(ScalaObject.someString());   // Optional[foo]
    Optional<String> stringNone = toJava(ScalaObject.noneString());   // Optional.empty
    System.out.printf("stringSome = %s\n", stringSome);
    System.out.printf("stringNone = %s\n", stringNone);
  }
}
```

两个 Scala `Option` 字段现在可用作 Java `Optional` 值。

## 如何在 Java 中使用 Scala trait 

在 Java 11 中，您可以像使用 Java 接口一样使用 Scala trait，即使 trait 已经实现了方法。
例如，给定这两个 Scala trait，一个具有已实现的方法，一个只有一个接口：

```scala
// scala
trait ScalaAddTrait:
  def sum(x: Int, y: Int) =  x + y    // implemented

trait ScalaMultiplyTrait:
  def multiply(x: Int, y: Int): Int   // abstract
```

Java 类可以实现这两个接口，并定义 `multiply` 方法：

```java
// java
class JavaMath implements ScalaAddTrait, ScalaMultiplyTrait {
  public int multiply(int a, int b) {
    return a * b;
  }
}

JavaMath jm = new JavaMath();
System.out.println(jm.sum(3,4));        // 7
System.out.println(jm.multiply(3,4));   // 12
```

## 如何处理在 Java 代码中抛出异常的 Scala 方法

当您使用 Scala 编程习惯编写 Scala 代码时，您永远不会编写引发异常的方法。
但是如果由于某种原因你有一个抛出异常的 Scala 方法，并且你希望 Java 开发人员能够使用该方法，请在你的 Scala 方法中添加`@throws`注解，以便 Java 使用者知道它可以抛出的异常.

例如，注解这个 Scala `exceptionThrower` 方法抛出一个 `Exception`：

```scala
// scala
object SExceptionThrower:
  @throws(classOf[Exception])
  def exceptionThrower = 
    throw new Exception("Idiomatic Scala methods don’t throw exceptions")
```

因此，您需要处理 Java 代码中的异常。
例如，这段代码不会编译，因为我不处理异常：

```java
// java: won’t compile because the exception isn’t handled
public class ScalaExceptionsInJava {
  public static void main(String[] args) {
    SExceptionThrower.exceptionThrower();
  }
}
```

编译器给出了这个错误：

````
[error] ScalaExceptionsInJava: unreported exception java.lang.Exception;
        must be caught or declared to be thrown
[error] SExceptionThrower.exceptionThrower()
````

这很好——这就是你想要的：注解告诉 Java 编译器 `exceptionThrower` 可以抛出异常。
现在，当您编写 Java 代码时，您必须使用 `try` 块处理异常或声明您的 Java 方法抛出异常。

相反，如果你 Scala `exceptionThrower` 方法的注释，Java 代码_将编译_。
这可能不是您想要的，因为 Java 代码可能无法考虑引发异常的 Scala 方法。

## 如何在 Java 中使用 Scala 可变参数

当 Scala 方法具有可变参数并且您想在 Java 中使用该方法时，请使用 `@varargs` 注解来标记 Scala 方法。
例如，这个 Scala 类中的 `printAll` 方法声明了一个 `String*` 可变参数字段：

```scala
// scala
import scala.annotation.varargs

object VarargsPrinter:
    @varargs def printAll(args: String*): Unit = args.foreach(println)
```

因为 `printAll` 是用 `@varargs` 注释声明的，所以可以从具有可变数量参数的 Java 程序中调用它，如下例所示：

```scala
// java
public class JVarargs {
  public static void main(String[] args) {
    VarargsPrinter.printAll("Hello", "world");
  }
}
```

运行此代码时，结果在以下输出中：

````
Hello
world
````

## 创建备用名称以在 Java 中使用 Scala 方法

在 Scala 中，您可能希望使用符号字符创建方法名称：

```scala
def +(a: Int, b: Int) = a + b
```

该方法名称在 Java 中不能很好地工作，但您可以在 Scala 3 中为该方法提供一个“替代”名称——别名——这将在 Java 中工作：

```scala
import scala.annotation.targetName

class Adder:
  @targetName("add") def +(a: Int, b: Int) = a + b
```

现在在您的 Java 代码中，您可以使用别名方法名称 `add`：

```scala
var adder = new Adder();
int x = adder.add(1,1);
System.out.printf("x = %d\n", x);
```
