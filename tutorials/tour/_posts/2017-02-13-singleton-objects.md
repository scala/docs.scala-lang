---
layout: tutorial
title: Singleton Objects

disqus: true

tutorial: scala-tour
categories: tour
num: 13

next-page: xml-processing
previous-page: pattern-matching
prerequisite-knowledge: classes, methods, private-methods, packages, option
---

A singleton object is an instance of a new class. There is exactly one instance of each singleton object. They do not have constructors so they cannot be instantiated.

# Defining a singleton object
The simplest form of an object is the keyword `object` and an identifier:
```tut
object Box
```

Here's an example of an object with a method:
```
package logging

object Logger {
  def info(message: String): Unit = println(s"INFO: $message")
}
```
The method `info` can be imported from anywhere in the program. Creating utility methods like this is a common use case for singleton objects (however, more sophisticated logging techniques exist). Let's see how to use `info` in another package:

```
import logging.Logger.info

class Project(name: String, daysToComplete: Int)

val project1 = new Project("TPS Reports", 1)
val project2 = new Project("Website redesign", 5)
info("Created projects")  // Prints "INFO: Created projects"
```

The `info` method becomes visible in the scope of the package using `import logging.Logger.info`. You could also use `import logging.Logger._` to import everything from Logger.

Note: If an `object` is nested within another construct such as a class, it is only a singleton in that context. This means there could be an `object NutritionInfo` in the `class Milk` and in the `class OrangeJuice`.

## Companion objects

A singleton object with the same name as a class is called a _companion object_. Conversely, the class is the object's companion class. The companion class and object can access each other's private members. Use a companion object for methods and values which are not specific to instances of the companion class.
```
import scala.math._

class Circle(val radius: Double) {
  def area: Double = Circle.calculateArea(radius)
}

object Circle {
  def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = new Circle(5.0)

circle1.area
```

The `class Circle` contains the val `radius` which is specific to each instance whereas the `object Circle` contains the method `calculateArea` which is the same for every instance.

The companion object can also contain factory methods:
```tut
class Email(val username: String, val domainName: String)

object Email {
  def fromString(emailString: String): Option[Email] = {
    emailString.split('@') match {
      case Array(a, b) => Some(new Email(a, b))
      case _ => None
    }
  }
}

val scalaCenterEmail = Email.fromString("scala.center@epfl.ch")
scalaCenterEmail match {
  case Some(email) => println(
    s"""Registered an email
       |Username: ${email.username}
       |Domain name: ${email.domainName}
     """)
  case None => println("Error: could not parse email")
}
```
The `object Email` contains a factory `fromString` which creates an `Email` instance from a String. We return it as an `Option[Email]` in case of parsing errors.

Note: If a class or object has a companion, both must be defined in the same file. To define them in the REPL, you must enter `:paste` and then paste in the class and companion object code.

## Notes for Java programmers ##

`static` is not a keyword in Scala. Instead, all members that would be static, including classes, should go in a singleton object instead.
When using a companion object from Java code, the members will be defined in a companion class with a `static` modifier. This is called _static forwarding_. It occurs even if you haven't defined a companion class yourself.
