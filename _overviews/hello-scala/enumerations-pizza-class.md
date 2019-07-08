---
layout: multipage-overview
title: Enumerations (and a Complete Pizza Class)
description: This page introduces Scala enumerations, and further shows how to create a complete OOP 'Pizza' class that uses those enumerations.
partof: hello_scala
overview-name: Hello, Scala
num: 23
---


If you don’t mind that I demonstrate enumerations next, I can also show you what an example `Pizza` class looks like when written in an object-oriented manner.

*Enumerations* are a useful tool for creating small groups of constants, things like the days of the week, months in a year, suits in a deck of cards, etc., situations where you have a group of related, constant values.

Because I’m jumping ahead a little bit here I’m not going to explain this syntax too much, but this is how you create an enumeration for the days of a week:

```scala
sealed trait DayOfWeek
case object Sunday extends DayOfWeek
case object Monday extends DayOfWeek
case object Tuesday extends DayOfWeek
case object Wednesday extends DayOfWeek
case object Thursday extends DayOfWeek
case object Friday extends DayOfWeek
case object Saturday extends DayOfWeek
```

Similarly, this is how you create an enumeration for the suits in a deck of cards:

```scala
sealed trait Suit
case object Clubs extends Suit
case object Spades extends Suit
case object Diamonds extends Suit
case object Hearts extends Suit
```

I’ll discuss traits and case objects later in this book, but if you’ll trust me for now that this is how you create enumerations, we can then create a little OOP version of a `Pizza` class in Scala.



## Pizza-related enumerations

Given that (very brief) introduction to enumerations, I can now create pizza-related enumerations like this:

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

Those enumerations provide a nice way to work with pizza toppings, crust sizes, and crust types.



## A sample Pizza class

Now that I have those enumerations, I can also define a `Pizza` class like this:

```scala
class Pizza (
    var crustSize: CrustSize = MediumCrustSize, 
    var crustType: CrustType = RegularCrustType
) {

    // ArrayBuffer is a mutable sequence (list)
    val toppings = scala.collection.mutable.ArrayBuffer[Topping]()

    def addTopping(t: Topping): Unit = { toppings += t }
    def removeTopping(t: Topping): Unit = { toppings -= t }
    def removeAllToppings(): Unit = { toppings.clear() }

}
```

If you save all of that code — including the enumerations — in a file named *Pizza.scala*, you’ll see that you can compile it with the usual command:

```sh
$ scalac Pizza.scala
```

>That code will create a lot of individual files, so I recommend putting it in a separate directory.

There’s nothing to run yet because this class doesn’t have a `main` method, but ... 



## A complete Pizza class with a main method

If you’re ready to have some fun, copy all of the following source code and paste it into a file named *Pizza.scala*:

```scala
import scala.collection.mutable.ArrayBuffer

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

class Pizza (
    var crustSize: CrustSize = MediumCrustSize, 
    var crustType: CrustType = RegularCrustType
) {

    // ArrayBuffer is a mutable sequence (list)
    val toppings = ArrayBuffer[Topping]()

    def addTopping(t: Topping): Unit = { toppings += t }
    def removeTopping(t: Topping): Unit = { toppings -= t }
    def removeAllToppings(): Unit = { toppings.clear() }

    override def toString(): String = {
        s"""
        |Crust Size: $crustSize
        |Crust Type: $crustType
        |Toppings:   $toppings
        """.stripMargin
    }
}

// a little "driver" app
object PizzaTest extends App {
   val p = new Pizza
   p.addTopping(Cheese)
   p.addTopping(Pepperoni)
   println(p)
}
```

Notice how you can put all of the enumerations, a `Pizza` class, and a `PizzaTest` object in the same file. That’s a very convenient feature that I’ll use again later in this book.

Next, compile that code with the usual command:

```sh
$ scalac Pizza.scala
```

Now, run the `PizzaTest` object with this command:

```sh
$ scala PizzaTest
```

The output should look like this:

```sh
$ scala PizzaTest

Crust Size: MediumCrustSize
Crust Type: RegularCrustType
Toppings:   ArrayBuffer(Cheese, Pepperoni)
```

I put several different concepts together to create that code — including two things I haven’t discussed yet in the `import` statement and the `ArrayBuffer` — but if you have experience with Java and other languages, I hope it’s not too much to throw at you at one time.

At this point I encourage you to work with that code as desired. Make changes to the code, and try using the `removeTopping` and `removeAllToppings` methods to make sure they work the way you expect them to work.






