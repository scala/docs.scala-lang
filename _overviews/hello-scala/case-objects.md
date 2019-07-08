---
layout: multipage-overview
title: Case Objects
description: This lesson introduces Scala 'case objects', which are used to create singletons with a few additional features.
partof: hello_scala
overview-name: Hello, Scala
num: 52
---



Before we jump into *case objects*, I should provide a little background on regular Scala objects. As I mentioned early on in this book, you use a Scala `object` when you want to create a singleton object. As [the official Scala documentation states](https://docs.scala-lang.org/tour/singleton-objects.html), “Methods and values that aren’t associated with individual instances of a class belong in singleton objects, denoted by using the keyword `object` instead of `class`.”

A common example of this is when I create a “utilities” object, such as this one:

```scala
object PizzaUtils {
    def addTopping(p: Pizza, t: Topping): Pizza = ...
    def removeTopping(p: Pizza, t: Topping): Pizza = ...
    def removeAllToppings(p: Pizza): Pizza = ...
}
```

Or this one:

```scala
object FileUtils {
    def readTextFileAsString(filename: String): Try[String] = ...
    def copyFile(srcFile: File, destFile: File): Try[Boolean] = ...
    def readFileToByteArray(file: File): Try[Array[Byte]] = ...
    def readFileToString(file: File): Try[String] = ...
    def readFileToString(file: File, encoding: String): Try[String] = ...
    def readLines(file: File, encoding: String): Try[List[String]] = ...
}
```

This is the most common way I use the Scala `object` construct.



## Case objects

A `case object` is like an `object`, but just like a case class has more features than a regular class, a case object has more features than a regular object. It specifically has two important features that make it useful:

- It is serializable
- It has a default `hashCode` implementation

These features make a case object useful when you don’t know how it will be used by other developers, such as if it will be sent across a network, or even referenced in a different JVM (such as with the [Akka](https://akka.io/) actors platform, where you can send messages between JVM instances).

<!--
https://doc.akka.io/docs/akka/new-docs-quickstart-snapshot/define-actors.html
“Case classes and case objects make excellent messages since they are immutable and have support for pattern matching.”
-->

Because of these features, I primarily use case objects (instead of regular objects) in two places:

- When creating enumerations
- When creating containers for “messages” that I want to pass between other objects (such as with Akka)



## Creating enumerations with case objects

As I showed earlier in this book, you create enumerations in Scala like this:

```scala
sealed trait Topping
case object Cheese extends Topping
case object Pepperoni extends Topping
case object Sausage extends Topping
case object Mushrooms extends Topping
case object Onions extends Topping

sealed trait CrustSize
case object SmallCrustSize extends CrustSize
case object MediumCrustSize extends CrustSize
case object LargeCrustSize extends CrustSize

sealed trait CrustType
case object RegularCrustType extends CrustType
case object ThinCrustType extends CrustType
case object ThickCrustType extends CrustType
```

Then later in your code you use those enumerations like this:

```scala
case class Pizza (
    crustSize: CrustSize,
    crustType: CrustType,
    toppings: Seq[Topping]
)
```

<!--
// this works, implying that 'case' isn't needed for pattern-matching
sealed trait CrustSize
object SmallCrustSize extends CrustSize
object MediumCrustSize extends CrustSize
object LargeCrustSize extends CrustSize

def poop(cs: CrustSize): Unit = cs match {
    case SmallCrustSize  => println("small")
    case MediumCrustSize => println("medium")
    case LargeCrustSize  => println("large")
}
-->




## Using case objects as messages

Another place where case objects come in handy is when you want to model the concept of a “message.” For example, imagine that you’re writing an application like Amazon’s Alexa, and you want to be able to pass around “speak”  messages like, “speak the enclosed text,” “stop speaking,”, “pause,” and “resume.” In Scala you create singleton objects for those messages like this:

```scala
case class StartSpeakingMessage(textToSpeak: String)
case object StopSpeakingMessage
case object PauseSpeakingMessage
case object ResumeSpeakingMessage
```

Notice that `StartSpeakingMessage` is defined as a case *class* rather than a case *object*. This is because an object can’t have any constructor parameters.

Given those messages, if Alexa was written using the Akka library, you’d find code like this in a “speak” class:

```scala
class Speak extends Actor {
  def receive = {
    case StartSpeakingMessage(textToSpeak) =>
        // code to speak the text
    case StopSpeakingMessage =>
        // code to stop speaking
    case PauseSpeakingMessage =>
        // code to pause speaking
    case ResumeSpeakingMessage =>
        // code to resume speaking
  }
}
```

This is a good, safe way to pass messages around in a Scala application.



## See also

I won’t cover the Akka actor library in this book, but I’ve already written several tutorials that provide an introduction to it, several of which demonstrate the use of case objects for messages:

- [An Akka “Hello, world” example](https://alvinalexander.com/scala/scala-akka-actor-how-get-started-simple-example-hello-world)
- [A ‘Ping Pong’ Scala Akka actors example](https://alvinalexander.com/scala/scala-akka-actors-ping-pong-simple-example)
- [How to send and receive messages between Scala/Akka actors](https://alvinalexander.com/scala/how-to-communicate-send-messages-scala-akka-actors)
- [“Alexa written with Akka” = Aleka](https://alvinalexander.com/scala/alexa-plus-akka-equals-aleka-tutorial)
- [An Akka actors ‘remote’ example](https://alvinalexander.com/scala/simple-akka-actors-remote-example)



<!--
RESEARCH ON CASE OBJECT
=======================

(1) https://stackoverflow.com/questions/32602356/why-does-scala-have-a-case-object

I think the most important difference is that case objects can be serialized while simple objects cannot. This makes them very useful as messages with Akka-Remote.

EDIT: As Rüdiger pointed out, this is not the only benefit we get from the case keyword. There is also:

- hashCode implementation
    - the hashCode of a case object will be the same in different JVM processes
- a useful toString implementation (VERIFIED)



(2) https://stackoverflow.com/questions/31755362/case-object-simple-use-case-with-example

```scala
case object USD
object EUR

println(USD) // USD
println(EUR) // testapp$EUR$@edf4efb

val oos = new ObjectOutputStream(new ByteArrayOutputStream())
oos.writeObject(USD)
oos.writeObject(EUR) // java.io.NotSerializableException
```

(3) https://madusudanan.com/blog/scala-tutorials-part-10-case-objects-in-scala/
- confirms the above comments

object SerializationExample
case object CaseObjectSerializationExample

//Will print false
println(SerializationExample.isInstanceOf[Serializable])
//Will print true
println(CaseObjectSerializationExample.isInstanceOf[Serializable])
-->







