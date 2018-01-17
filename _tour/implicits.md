---
layout: tour
title: Implicits

discourse: true

partof: scala-tour

num: 26
next-page: implicit-conversions
previous-page: explicitly-typed-self-references

redirect_from: "/tutorials/tour/implicits.html"
---
Implicits allow for automatic application of code when an explicit application isn't supplied.

## Implicit parameters

Implicit parameters allow for the caller to omit an argument if an implicit one is in scope. Use the `implicit` keyword to make a value, object, or expression implicit. You also use it to make the parameter list implicit.
```tut
class Greeting(val greeting: String) {
  def greet(name: String) = s"$greeting, $name"
}
implicit val standardGreeting = new Greeting("Hello")


def printGreeting(name: String)(implicit greeting: Greeting) = greeting.greet(name)


printGreeting("Franchesca")  // Hello, Franchesca
printGreeting("Fred")(new Greeting("Good day"))  // Good day, Fred
```
In method 'printGreeting', second parameter 'greeting' is an implicit parameter,which means if caller doesn't supply it explicitly then compiler would look for an implicit value in the scope.
In first call to 'printGreeting' above, we don't supply second parameter(a Greeting),which makes compiler to look for implicit parameter in the scope and it finds implicit val 'standardGreeting'.
In second call to 'printGreeting', we explicitly provide second parameter and hence 'standardGreeting' is not needed.

This becomes useful when you have a lot of similar arguments to function calls throughout your program.
Implicits may be problematic in two ways.Primary problem is that they hide an argument that can impact your program, making it less obvious what your methods depend upon because the method call doesn't show you that anything is going on.
Also,implicits can make code more difficult to understand because it's not always obvious where they're defined if you import them from another module with a wildcard (e.g. `import MyPredef._`).




## Implicit conversion


Implicit Conversions are a set of methods that Scala tries to apply when it encounters an object of the wrong type being used.
```
(1 to 5).foreach(println) // print out 1 2 3 4 5
```
In code above,method 'to' defined in the RichInt class is called and it returns a Range object,on which we then call 'foreach' method.
But Int doesn't have 'to' method.So what is happening here?Under the hood int is converted to RichInt implicitly.
This typecasting happens because of the method `implicit def intWrapper(x: Int): RichInt` defined in `Predef`.

Implicits conversions can be useful when you're making a lot of calls to an API and the calls are verbose or require a type conversion. For example, if you want to create a button using Java swing, the code is verbose:
```tut
import scala.language.implicitConversions
import java.awt.event.{ActionEvent, ActionListener}
import javax.swing.JButton

val button = new JButton
button.addActionListener(
  new ActionListener {
    def actionPerformed(event: ActionEvent) = {
      println("pressed!")
    }
  }
)
```
You would need to write this same code for every button in order to _print "pressed" when the button is pressed_. You could instead abstract this away to an implicit conversion:
```tut
import java.awt.event.{ActionEvent, ActionListener}
import javax.swing.JButton

implicit def function2ActionListener(f: ActionEvent => Unit) =
  new ActionListener {
    def actionPerformed(event: ActionEvent) = f(event)
  }


val button = new JButton
button.addActionListener(
  (_: ActionEvent) => println("pressed!")
)
```
The implicit method `function2ActionListener` takes a function which accepts an ActionEvent. It then returns an `ActionListener` with the aforementioned function as its `actionPerformed`. Now when we call `button.addActionListener` (which accepts an `ActionListener`) with an anonymous function of type `ActionEvent => Unit`, the compiler looks for an implicit conversion function which can convert the type to `ActionListener`.

This removes a lot of the boilerplate because we can use an anonymous function. However, because implicits are often defined outside of the package, it can be difficult to debug. Therefore they are best used in libraries.

Scala also allows Implicit classes, which can be used to extend the functionality of objects without modifying the source code of the object.
For example, we can have something like this:
```tut
object ImplicitClassDemo {

  implicit class StringImprovements(val s: String) {
    def increment = s.map(c => (c + 1).toChar)
  }

  def main(args: Array[String]): Unit = {
    val x = "Einsteim"
    println("Einstein".increment)
  }
}
```
Here, making use of implicit class 'StringImprovements' we are able to add a new behavior('increment') to String object.
An implicit class must be defined in a scope where method definitions are allowed (not at the top level).
This means an implicit class must be defined in either of:
* A class
* An object
* A package object

_Example Credit_: Odersky, Martin, Lex Spoon, and Bill Venners. Programming in Scala. Walnut Creek, CA: Artima, 2016.  