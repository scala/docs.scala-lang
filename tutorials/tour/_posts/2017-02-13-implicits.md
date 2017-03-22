---
layout: tutorial
title: Implicits

disqus: true

tutorial: scala-tour
categories: tour
num: 26
next-page: implicit-conversions
previous-page: explicitly-typed-self-references
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
The `implicit val standardGreeting` is a value that can be supplied as an argument to an implicit parameter automatically. In the method `printGreeting`, the parameter `greeting` is implicit. This means that the caller can either supply an argument normally or skip it. With `greet("Franchesca")`, the compiler doesn't see a greeting but it notices that `greeting` is an implicit parameter so it searches the current scope for an implicit `Greeting` and finds `standardGreeting`.

This becomes useful when you have a lot of similar arguments to function calls throughout your program. However, implicits can make code more difficult to understand because it's not always obvious where they're defined if you import them from another module with a wildcard (e.g. `import MyPredef._`).




## Implicit conversion


An implicit conversion happens the type check fails for an argument and an implicit conversion is found.
```
def square(x: Double) = x * x
val number: Int = 5
square(number)  // 25.0
```
This typecasting happens because of the method `implicit def int2double(x: Int): Double = x.toDouble` defined in `Predef` (a set of convenience methods in scope by default). When the compiler sees that `square` expects a `Double` but we pass an `Int`, it searches the scope for an `implicit` function that can do the conversion.

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

_Example Credit_: Odersky, Martin, Lex Spoon, and Bill Venners. Programming in Scala. Walnut Creek, CA: Artima, 2016.  
