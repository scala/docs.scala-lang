---
type: section
layout: multipage-overview
title: An OOP Example
description: This lesson shares an example of some OOP-style classes for a pizza restaurant order entry system, including Pizza, Topping, and Order classes.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 39
outof: 54
previous-page: tuples
next-page: sbt-scalatest-intro
---


This lesson shares an example of an OOP application written with Scala. The example shows code you might write for an order-entry system for a pizza store.

As shown earlier in the book, you create enumerations in Scala like this:

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

A nice thing about Scala is that even though we haven’t discussed sealed traits or case objects, you can probably still figure out how this code works.



## A few classes

Given those enumerations, you can now start to create a few pizza-related classes for an order-entry system. First, here’s a `Pizza` class:

```scala
import scala.collection.mutable.ArrayBuffer

class Pizza (
    var crustSize: CrustSize,
    var crustType: CrustType,
    var toppings: ArrayBuffer[Topping]
)
```

Next, here’s an `Order` class, where an `Order` consists of a mutable list of pizzas and a `Customer`:

```scala
class Order (
    var pizzas: ArrayBuffer[Pizza],
    var customer: Customer
)
```

Here’s a `Customer` class to work with that code:

```scala
class Customer (
    var name: String,
    var phone: String,
    var address: Address
)
```

Finally, here’s an `Address` class:

```scala
class Address (
    var street1: String,
    var street2: String,
    var city: String,
    var state: String,
    var zipCode: String
)
```

So far those classes just look like data structures — like a `struct` in C — so let’s add a little behavior.



## Adding behavior to Pizza

For the most part an OOP `Pizza` class needs a few methods to add and remove toppings, and adjust the crust size and type. Here’s a `Pizza` class with a few added methods to handle those behaviors:

```scala
class Pizza (
    var crustSize: CrustSize,
    var crustType: CrustType,
    val toppings: ArrayBuffer[Topping]
) {

    def addTopping(t: Topping): Unit = toppings += t
    def removeTopping(t: Topping): Unit = toppings -= t
    def removeAllToppings(): Unit = toppings.clear()

}
```

You can also argue that a pizza should be able to calculate its own price, so here’s another method you could add to that class:

```scala
def getPrice(
    toppingsPrices: Map[Topping, Int],
    crustSizePrices: Map[CrustSize, Int],
    crustTypePrices: Map[CrustType, Int]
): Int = ???
```

Note that this is a perfectly legal method. The `???` syntax is often used as a teaching tool, and sometimes you use it as a method-sketching tool to say, “This is what my method signature looks like, but I don’t want to write the method body yet.” A great thing for those times is that this code compiles.

>That being said, don’t *call* that method. If you do, you’ll get a `NotImplementedError`, which is very descriptive of the situation.



## Adding behavior to Order

You should be able to do a few things with an order, including:

- Add and remove pizzas
- Update customer information
- Get the order price

Here’s an `Order` class that lets you do those things:

```scala
class Order (
    val pizzas: ArrayBuffer[Pizza],
    var customer: Customer
) {

    def addPizza(p: Pizza): Unit = pizzas += p
    def removePizza(p: Pizza): Unit = pizzas -= p

    // need to implement these
    def getBasePrice(): Int = ???
    def getTaxes(): Int = ???
    def getTotalPrice(): Int = ???

}
```

Once again, for the purposes of this example, we’re not concerned with how to calculate the price of an order.



## Testing those classes

You can use a little “driver” class to test those classes. With the addition of a `printOrder` method on the `Order` class and a `toString` method in the `Pizza` class, you’ll find that the code shown works as advertised:

```scala
import scala.collection.mutable.ArrayBuffer

object MainDriver extends App {

    val p1 = new Pizza (
        MediumCrustSize,
        ThinCrustType,
        ArrayBuffer(Cheese)
    )

    val p2 = new Pizza (
        LargeCrustSize,
        ThinCrustType,
        ArrayBuffer(Cheese, Pepperoni, Sausage)
    )

    val address = new Address (
        "123 Main Street",
        "Apt. 1",
        "Talkeetna",
        "Alaska",
        "99676"
    )

    val customer = new Customer (
        "Alvin Alexander",
        "907-555-1212",
        address
    )

    val o = new Order(
        ArrayBuffer(p1, p2),
        customer
    )

    o.addPizza(
        new Pizza (
            SmallCrustSize,
            ThinCrustType,
            ArrayBuffer(Cheese, Mushrooms)
        )
    )

    // print the order
    o.printOrder

}
```



## Experiment with the code yourself

To experiment with this on your own, please see the *PizzaOopExample* project in this book’s GitHub repository, which you can find at this URL:

- [github.com/alvinj/HelloScalaExamples](https://github.com/alvinj/HelloScalaExamples)

To compile this project it will help to either (a) use IntelliJ IDEA or Eclipse, or (b) know how to use the [Scala Build Tool](http://www.scala-sbt.org).





