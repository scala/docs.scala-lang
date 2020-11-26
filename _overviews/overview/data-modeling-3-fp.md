---
title: FP Data Modeling with Scala 3
description: This chapter provides an introduction to FP data modeling with Scala 3.
---

This chapter provides an introduction to functional programming (FP) style data modeling in Scala 3.




# Data Modeling with functional programming

When modeling the world around us with FP, you typically use these Scala constructs:

- Enumerations
- Case classes
- Traits


## Introduction

In FP, the *data* and the *operators on that data* are two separate things; you aren’t forced to encapsulate them together like you do with OOP.

The concept is like numerical algebra. When you think about whole numbers whose values are greater than or equal to zero, you have a *set* of possible values that looks like this:

````
0, 1, 2 ... Int.MaxInt
````

Ignoring the division of whole numbers, the possible *operators* on those values are:

````
+, -, *
````

An FP design is implemented in a similar way:

- You have a set of values
- You have a collection of operators that work on those values

In this chapter we’ll model the data and operations for a “pizza” in a pizza store. You’ll see how to implement the “data” portion of the Scala/FP model, and then you’ll see several different ways you can organize the operations on that data.



## Modeling the data

Modeling the “data” portion of a domain model in Scala is simple:

- Create ADTs and GADTs with the `enum` construct
- Use `case` classes for more complicated systems
<!-- TODO: wording on that last line? -->


### Crust size, crust type, and toppings

Data concepts like crust size, crust type, and toppings are concisely modeled with the Scala 3 `enum` construct:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```


### Modeling a pizza

Now you can model a `Pizza` class using a `case` class:

```scala
import CrustSize._
import CrustType._
import Topping._

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

And that’s it. That’s the data model for an FP-style pizza system. This solution is very concise because it doesn’t require the operations on a pizza to be combined with the data model. The data model is easy to read, like declaring the design for a relational database.

<!-- TODO: compare this with C-style structs and others? -->

#### More of the data model

Because that was very short, you may prefer to see more of the data model for an entire pizza-ordering system. Here are a few other `case` classes that are used to model such a system:

```scala
case class Address(
  street1: String,
  street2: Option[String],
  city: String,
  state: String,
  zipCode: String
)

case class Customer(
  name: String,
  phone: String,
  address: Address
)

case class Order(
  pizzas: Seq[Pizza],
  customer: Customer
)
```

#### “Skinny domain objects”

In his book, *Functional and Reactive Domain Modeling*, Debasish Ghosh states that where OOP practitioners describe their classes as “rich domain models” that encapsulate data and behaviors, FP data models can be thought of as “skinny domain objects.” This is because — as this lesson shows — the data models are defined as `case` classes with attributes, but no behaviors.




## What about the operations?

This leads to an interesting question: Because FP separates the data from the operations on that data, how do you implement those operations in Scala/FP?

There are several different ways to handle behaviors:

- Put your methods in companion objects
- Use a modular programming style
- Use a “functional objects” approach

These solutions are shown in the next three sections.
<!-- TODO: is there ONE preferred solution? -->


>An important point about all of the following solutions is that the methods and functions shown are *pure functions*. They don’t mutate any data; they receive an object, and apply transformation functions to that data to return new data.
<!-- TODO: link to "pure function" definition -->




## (1) Handling behavior in FP with a companion object

A first approach is to put the behaviors — the methods — in a companion object. With this approach, you put the data model in a `case` class, and then put the methods in a companion object of the `case` class.

The following code shows how to add and remove toppings, and update the crust size and crust type for an FP-style `Pizza`:

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

object Pizza:
  def addTopping(p: Pizza, t: Topping): Pizza =
    val newToppings = p.toppings :+ t
    p.copy(toppings = newToppings)

  def removeTopping(p: Pizza, t: Topping): Pizza =
    val newToppings = ListUtils.dropFirstMatch(p.toppings, t)
    p.copy(toppings = newToppings)

  def removeAllToppings(p: Pizza): Pizza =
    val newToppings = Seq[Topping]()
    p.copy(toppings = newToppings)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)
```

With this approach you can create an initial `Pizza` like this:

```scala
val pizza1 = Pizza(Small, Thin, Seq(Cheese, Onions))
```

Then as a customer edits their order, you create new `Pizza` instances by making changes to an initial object, while assigning the result to a new variable:

```scala
val pizza2 = Pizza.addTopping(pizza1, Pepperoni)
val pizza3 = Pizza.updateCrustSize(pizza2, Large)
```

If you prefer to get rid of all those `Pizza` references, you can eliminate them by importing the methods from the `Pizza` companion object:

````
import Pizza._

val pizza1 = Pizza(Small, Thin, Seq(Cheese, Onions))
val pizza2 = addTopping(pizza1, Pepperoni)
val pizza3 = updateCrustSize(pizza2, Large)
````



## (2) Using a modular approach

A second way to organize behaviors in an FP style is to use a “modular” approach. The book, *Programming in Scala*, defines a *module* as, “a ‘smaller program piece’ with a well defined interface and a hidden implementation.” Let’s look at what this means.

As a reminder, here’s the `Pizza` case class we defined previously:

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

### Creating a `PizzaService` interface

The next thing to think about are the `Pizza` “behaviors.” When doing this, you sketch a `PizzaServiceInterface` trait like this:

```scala
trait PizzaServiceInterface:

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
```

As shown, each method takes a `Pizza` as an input parameter — along with other parameters — and then returns a `Pizza` instance as a result

When you write a pure interface like this, you can think of it as a contract, a contract that states, “all non-abstract classes that extend this trait *must* provide an implementation of these services.”

What you might also do at this point is imagine that you’re the consumer of this API. When you do that, it helps to sketch out some sample “consumer” code to make sure the API looks like what you want:

```scala
val p = Pizza(
  Small,
  Thin,
  Seq(Cheese)
)

// how you want to use the methods in PizzaServiceInterface
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)
```

If that code seems okay, you’ll typically start sketching another API — such as an API for orders — but since we’re only looking at pizzas right now, we’ll stop thinking about interfaces and create a concrete implementation of this interface.

>Notice that this is usually a two-step process. In the first step, you sketch the contract of your API as an *interface*. In the second step you create a concrete *implementation* of that interface. In some cases you’ll end up creating multiple concrete implementations of the base interface.


### Creating a concrete implementation

Now that you know what the `PizzaServiceInterface` looks like, you can create a concrete implementation of it by writing the body for all of the methods you defined in the interface:

```scala
object PizzaService extends PizzaServiceInterface:

  def addTopping(p: Pizza, t: Topping): Pizza =
      val newToppings = p.toppings :+ t
      p.copy(toppings = newToppings)

  def removeTopping(p: Pizza, t: Topping): Pizza =
      val newToppings = ListUtils.dropFirstMatch(p.toppings, t)
      p.copy(toppings = newToppings)

  def removeAllToppings(p: Pizza): Pizza =
      val newToppings = Seq[Topping]()
      p.copy(toppings = newToppings)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
      p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
      p.copy(crustType = ct)

end PizzaService
```

While this two-step process of creating an interface followed by an implementation isn’t always necessary, if you want to be an API creator, it’s a good discipline to learn.

With everything in place you can use your `Pizza` class and `PizzaService`:

```scala
import PizzaService._

val p = Pizza(
  Small,
  Thin,
  Seq(Cheese)
)

// use the PizzaService methods
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

// final result:
// Pizza(Large,Thick,List(Cheese, Pepperoni, Onions))
```



## (3) Handling behavior with functional objects

In the book, *Programming in Scala*, the authors define the term, “Functional Objects” as “objects that do not have any mutable state.” Like the `List` class, this means that the `List` methods don’t mutate the internal `List` state; instead, you get a copy of a new `List` as a result.

You can think of this approach of handling the behaviors as a “hybrid FP/OOP design” because you:

- Model the data as immutable fields in `case` classes.
- Put the behaviors (methods) in the same class as the data.
- Implement the behaviors as pure functions: They don’t mutate any internal state; rather, they return a new instance of the class.

This really is a hybrid approach:

- Like an OOP design, the methods are encapsulated in the class with the data, but
- The methods are implemented as pure functions that don’t mutate the data


### Example

Using this approach, you combine the pizza attributes with the functional methods in one class:

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  val toppings: Seq[Topping]
):

  // the operations on the data model

  def addTopping(t: Topping): Pizza =
      this.copy(toppings = this.toppings :+ t)

  def removeTopping(t: Topping): Pizza =
      val newToppings = ListUtils.dropFirstMatch(this.toppings, t)
      this.copy(toppings = newToppings)

  def removeAllToppings(p: Pizza): Pizza =
      val newToppings = Seq[Topping]()
      this.copy(toppings = newToppings)

  def updateCrustSize(cs: CrustSize): Pizza =
      this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
      this.copy(crustType = ct)
```

Notice that unlike the previous approaches, because these are methods on the `Pizza` class, they don’t take a `Pizza` reference as an input parameter. Instead, they have their own reference to the current pizza instance as `this`.

Now you can use this new design like this:

````
val pizza1 = Pizza(
  Small,
  Thin,
  Seq(Cheese)
)
val pizza2 = pizza1.addTopping(Pepperoni)
val pizza3 = pizza2.updateCrustType(Thick)

// result:
// pizza3: Pizza(Small,Thick,List(Cheese, Pepperoni))
````


### The same design as the Scala collections classes

Notice that in this line:

````
val pizza2 = pizza1.addTopping(Pepperoni)
````

the `Pepperoni` topping is added to whatever toppings are in the `pizza1` reference to create a new `Pizza` instance named `pizza2`. Following the FP model, `pizza1` isn’t mutated, it’s just used to create a new instance with the updated data.

This approach is exactly how the Scala collections classes are designed:

```scala
val list = List(1,2,3,4,5)
val littleNumbers = list.filter(_ < 3)
```

Just like the `Pizza` class, you can say these things about the `List` class:

- It has an immutable internal data model (in this case the list of numbers `1` to `5`)
- `filter` is defined as a method in `List`
- `filter` doesn’t mutate the `List`’s internal state; it returns a new `List` based on (a) its internal model, and (b) the function you supply to `filter`




## Summary of the FP domain modeling approaches

Defining a data model in Scala/FP tends to be simple: Just model the data with enumerations and `case` classes with immutable fields. This approach is similar to creating a relational database design, and it becomes a blueprint of the classes, their fields, and their relationships.

Then, to model the behaviors (methods) in an FP-style design, there are several different possible approaches:

- Put your methods in companion objects
- Use a modular programming style
- Use a “functional objects” approach




