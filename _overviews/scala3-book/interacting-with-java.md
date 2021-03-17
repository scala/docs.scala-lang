---
title: Interacting with Java
type: chapter
description: This page demonstrates how Scala code can interact with Java, and how Java code can interact with Scala code.
num: 70
previous-page: scala-tools
next-page: scala-for-java-devs
---


## Introduction

This section looks at how to use Java code in Scala, and the opposite, how to use Scala code in Java.

In general, using Java code in Scala is pretty seamless.
There are only a few points where you’ll want to use Scala utilities to convert Java concepts to Scala, including:

- Java collections classes
- The Java `Optional` class

Similarly, if you’re writing Java code and want to use Scala concepts, you’ll want to convert Scala collections and the Scala `Option` class.

These following sections demonstrate the most common conversions you’ll need:

- How to use Java collections in Scala
- How to use Java `Optional` in Scala
- Extending Java interfaces in Scala
- How to use Scala collections in Java
- How to use Scala `Option` in Java
- How to use Scala traits in Java
- How to handle Scala methods that throw exceptions in Java code
- How to use Scala varargs parameters in Java
- Create alternate names to use Scala methods in Java

Note that the Java examples in this section assume that you’re using Java 11 or newer.



## How to use Java collections in Scala

When you’re writing Scala code and need to use a Java collection class, you _can_ just use the class as-is.
However, if you want to use the class in a Scala `for` loop, or want to take advantage of the higher-order functions on the Scala collections classes, you’ll want to convert the Java collection to a Scala collection.

Here’s an example of how this works.
Given this Java `ArrayList`:

```java
// java
public class JavaClass {
  public static List<String> getStrings() {
    return new ArrayList<String>(List.of("a", "b", "c"));
  }
}
```

You can convert that Java list to a Scala `Seq`, using the conversion utilities in the Scala _scala.jdk.CollectionConverters_ package:

```scala
// scala
import scala.jdk.CollectionConverters.*
import java.util.List

def testList = 
  println("Using a Java List in Scala")
  val javaList: java.util.List[String] = JavaClass.getStrings()
  val scalaSeq: Seq[String] = javaList.asScala.toSeq
  scalaSeq.foreach(println)
  for s <- scalaSeq do println(s)
```

Of course that code can be shortened, but the individual steps are shown here to demonstrate exactly how the conversion process works.



## How to use Java `Optional` in Scala

When you need to use the Java `Optional` class in your Scala code, import the _scala.jdk.OptionConverters_ object, and then use the `toScala` method to convert the `Optional` value to a Scala `Option`.

To demonstrate this, here’s a Java class with two `Optional<String>` values, one containing a string and the other one empty:

```java
// java
import java.util.Optional;

public class JavaClass {
  static Optional<String> oString = Optional.of("foo");
  static Optional<String> oEmptyString = Optional.empty();
}
```

Now in your Scala code you can access those fields.
If you just access them directly, they’ll both be `Optional` values:

```scala
// scala
import java.util.Optional

val optionalString = JavaClass.oString         // Optional[foo]
val eOptionalString = JavaClass.oEmptyString   // Optional.empty
```

But by using the _scala.jdk.OptionConverters_ methods, you can convert them to Scala `Option` values:

```scala
import java.util.Optional
import scala.jdk.OptionConverters.*

val optionalString = JavaClass.oString         // Optional[foo]
val optionString = optionalString.toScala      // Some(foo)

val eOptionalString = JavaClass.oEmptyString   // Optional.empty
val eOptionString = eOptionalString.toScala    // None
```



## Extending Java interfaces in Scala

If you need to use Java interfaces in your Scala code, extend them just as though they are Scala traits.
For example, given these three Java interfaces:

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

you can create a `Dog` class in Scala just as though you were using traits.
All you have to do is implement the `speak` and `wag` methods:

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



## How to use Scala collections in Java

When you need to use a Scala collection class in your Java code, use the methods of Scala’s _scala.jdk.javaapi.CollectionConverters_ object in your Java code to make the conversions work.
For example, if you have a `List[String]` like this in a Scala class:

```scala
// scala
class ScalaClass:
  val strings = List("a", "b")
```

You can access that Scala `List` in your Java code like this:

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

That code can be shortened, but the full steps are shown to demonstrate how the process works.
Here are a few things to notice in that code:

- In your Java code, you create an instance of `ScalaClass` just like an instance of a Java class
- `ScalaClass` has a field named `strings`, but from Java you access that field as a method, i.e., as `sc.strings()`



## How to use Scala `Option` in Java

When you need to use a Scala `Option` in your Java code, you can convert the `Option` to a Java `Optional` value using the `toJava` method of the Scala _scala.jdk.javaapi.OptionConverters_ object.

To demonstrate this, create a Scala class with two `Option[String]` values, one containing a string and the other one empty:

```scala
// scala
object ScalaObject:
  val someString = Option("foo")
  val noneString: Option[String] = None
```

Then in your Java code, convert those `Option[String]` values into `java.util.Optional[String]` using the `toJava` method from the _scala.jdk.javaapi.OptionConverters_ object:

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

The two Scala `Option` fields are now available as Java `Optional` values.



## How to use Scala traits in Java

With Java 11 you can use a Scala trait just like a Java interface, even if the trait has implemented methods.
For example, given these two Scala traits, one with an implemented method and one with only an interface:

```scala
// scala
trait ScalaAddTrait:
  def sum(x: Int, y: Int) =  x + y    // implemented

trait ScalaMultiplyTrait:
  def multiply(x: Int, y: Int): Int   // abstract
```

A Java class can implement both of those interfaces, and define the `multiply` method:

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



## How to handle Scala methods that throw exceptions in Java code

When you’re writing Scala code using Scala programming idioms, you’ll never write a method that throws an exception.
But if for some reason you have a Scala method that does throw an exception, and you want Java developers to be able to use that method, add the `@throws` annotation to your Scala method so Java consumers will know the exceptions they can throw.

For example, this Scala `exceptionThrower` method is annotated to declare that it throws an `Exception`:

```scala
// scala
object SExceptionThrower:
  @throws(classOf[Exception])
  def exceptionThrower = 
    throw new Exception("Idiomatic Scala methods don’t throw exceptions")
```

As a result, you’ll need to handle the exception in your Java code.
For instance, this code won’t compile because I don’t handle the exception:

```java
// java: won’t compile because the exception isn’t handled
public class ScalaExceptionsInJava {
  public static void main(String[] args) {
    SExceptionThrower.exceptionThrower();
  }
}
```

The compiler gives this error:

````
[error] ScalaExceptionsInJava: unreported exception java.lang.Exception;
        must be caught or declared to be thrown
[error] SExceptionThrower.exceptionThrower()
````

This is good---it’s what you want: the annotation tells the Java compiler that `exceptionThrower` can throw an exception.
Now when you’re writing Java code you must handle the exception with a `try` block or declare that your Java method throws an exception.

Conversely, if you leave the annotation off of the Scala `exceptionThrower` method, the Java code _will compile_.
This is probably not what you want, because the Java code may not account for the Scala method throwing the exception.



## How to use Scala varargs parameters in Java

When a Scala method has a varargs parameter and you want to use that method in Java, mark the Scala method with the `@varargs` annotation.
For example, the `printAll` method in this Scala class declares a `String*` varargs field:

```scala
// scala
import scala.annotation.varargs

object VarargsPrinter:
    @varargs def printAll(args: String*): Unit = args.foreach(println)
```

Because `printAll` is declared with the `@varargs` annotation, it can be called from a Java program with a variable number of parameters, as shown in this example:

```scala
// java
public class JVarargs {
  public static void main(String[] args) {
    VarargsPrinter.printAll("Hello", "world");
  }
}
```

When this code is run, it results in the following output:

````
Hello
world
````



## Create alternate names to use Scala methods in Java

In Scala you might want to create a method name using a symbolic character:

```scala
def +(a: Int, b: Int) = a + b
```

That method name won’t work well in Java, but what you can do in Scala 3 is provide an “alternate” name for the method---an alias---that will work in Java:

```scala
import scala.annotation.alpha

class Adder:
  @alpha("add") def +(a: Int, b: Int) = a + b
```

Now in your Java code you can use the aliased method name `add`:

```scala
var adder = new Adder();
int x = adder.add(1,1);
System.out.printf("x = %d\n", x);
```


