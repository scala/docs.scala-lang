---
title: FP Modeling
type: section
description: This chapter provides an introduction to FP domain modeling with Scala 3.
languages: [ru, zh-cn]
num: 23
previous-page: domain-modeling-oop
next-page: methods-intro
---


This chapter provides an introduction to domain modeling using functional programming (FP) in Scala 3.
When modeling the world around us with FP, you typically use these Scala constructs:

- Enumerations
- Case classes
- Traits

> If you’re not familiar with algebraic data types (ADTs) and their generalized version (GADTs), you may want to read the [Algebraic Data Types][adts] section before reading this section.

## Introduction

In FP, the *data* and the *operations on that data* are two separate things; you aren’t forced to encapsulate them together like you do with OOP.

The concept is similar to numerical algebra.
When you think about whole numbers whose values are greater than or equal to zero, you have a *set* of possible values that looks like this:

````
0, 1, 2 ... Int.MaxValue
````

Ignoring the division of whole numbers, the possible *operations* on those values are:

````
+, -, *
````

In FP, business domains are modeled in a similar way:

- You describe your set of values (your data)
- You describe operations that work on those values (your functions)

> As we will see, reasoning about programs in this style is quite different from the object-oriented programming.
> Data in FP simply **is**:
> Separating functionality from your data lets you inspect your data without having to worry about behavior.

In this chapter we’ll model the data and operations for a “pizza” in a pizza store.
You’ll see how to implement the “data” portion of the Scala/FP model, and then you’ll see several different ways you can organize the operations on that data.

## Modeling the Data

In Scala, describing the data model of a programming problem is simple:

- If you want to model data with different alternatives, use the `enum` construct, (or `case object` in Scala 2).
- If you only want to group things (or need more fine-grained control) use `case` classes

### Describing Alternatives

Data that simply consists of different alternatives, like crust size, crust type, and toppings, is precisely modelled
in Scala by an enumeration.

{% tabs data_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_1 %}

In Scala 2 enumerations are expressed with a combination of a `sealed class` and several `case object` that extend the class:

```scala
sealed abstract class CrustSize
object CrustSize {
  case object Small extends CrustSize
  case object Medium extends CrustSize
  case object Large extends CrustSize
}

sealed abstract class CrustType
object CrustType {
  case object Thin extends CrustType
  case object Thick extends CrustType
  case object Regular extends CrustType
}

sealed abstract class Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping
}
```

{% endtab %}
{% tab 'Scala 3' for=data_1 %}

In Scala 3 enumerations are concisely expressed with the `enum` construct:

```scala
enum CrustSize:
  case Small, Medium, Large

enum CrustType:
  case Thin, Thick, Regular

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions
```

{% endtab %}
{% endtabs %}

> Data types that describe different alternatives (like `CrustSize`) are also sometimes referred to as _sum types_.

### Describing Compound Data

A pizza can be thought of as a _compound_ container of the different attributes above.
We can use a `case` class to describe that a `Pizza` consists of a `crustSize`, `crustType`, and potentially multiple `toppings`:

{% tabs data_2 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_2 %}

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

{% endtab %}
{% tab 'Scala 3' for=data_2 %}

```scala
import CrustSize.*
import CrustType.*
import Topping.*

case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)
```

{% endtab %}
{% endtabs %}

> Data Types that aggregate multiple components (like `Pizza`) are also sometimes referred to as _product types_.

And that’s it.
That’s the data model for an FP-style pizza system.
This solution is very concise because it doesn’t require the operations on a pizza to be combined with the data model.
The data model is easy to read, like declaring the design for a relational database.
It is also very easy to create values of our data model and inspect them:

{% tabs data_3 %}
{% tab 'Scala 2 and 3' for=data_3 %}

```scala
val myFavPizza = Pizza(Small, Regular, Seq(Cheese, Pepperoni))
println(myFavPizza.crustType) // prints Regular
```

{% endtab %}
{% endtabs %}

#### More of the data model

We might go on in the same way to model the entire pizza-ordering system.
Here are a few other `case` classes that are used to model such a system:

{% tabs data_4 %}
{% tab 'Scala 2 and 3' for=data_4 %}

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

{% endtab %}
{% endtabs %}

#### “Skinny domain objects”

In his book, *Functional and Reactive Domain Modeling*, Debasish Ghosh states that where OOP practitioners describe their classes as “rich domain models” that encapsulate data and behaviors, FP data models can be thought of as “skinny domain objects.”
This is because---as this lesson shows---the data models are defined as `case` classes with attributes, but no behaviors, resulting in short and concise data structures.

## Modeling the Operations

This leads to an interesting question: Because FP separates the data from the operations on that data, how do you implement those operations in Scala?

The answer is actually quite simple: you simply write functions (or methods) that operate on values of the data we just modeled.
For instance, we can define a function that computes the price of a pizza.

{% tabs data_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match {
  case Pizza(crustSize, crustType, toppings) => {
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
  }
}
```

{% endtab %}

{% tab 'Scala 3' for=data_5 %}

```scala
def pizzaPrice(p: Pizza): Double = p match
  case Pizza(crustSize, crustType, toppings) =>
    val base  = 6.00
    val crust = crustPrice(crustSize, crustType)
    val tops  = toppings.map(toppingPrice).sum
    base + crust + tops
```

{% endtab %}
{% endtabs %}

You can notice how the implementation of the function simply follows the shape of the data: since `Pizza` is a case class, we use pattern matching to extract the components and call helper functions to compute the individual prices.

{% tabs data_6 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match {
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
}
```

{% endtab %}

{% tab 'Scala 3' for=data_6 %}

```scala
def toppingPrice(t: Topping): Double = t match
  case Cheese | Onions => 0.5
  case Pepperoni | BlackOlives | GreenOlives => 0.75
```

{% endtab %}
{% endtabs %}

Similarly, since `Topping` is an enumeration, we use pattern matching to distinguish between the different variants.
Cheese and onions are priced at 50ct while the rest is priced at 75ct each.

{% tabs data_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match {
    // if the crust size is small or medium,
    // the type is not important
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
  }
```

{% endtab %}

{% tab 'Scala 3' for=data_7 %}

```scala
def crustPrice(s: CrustSize, t: CrustType): Double =
  (s, t) match
    // if the crust size is small or medium,
    // the type is not important
    case (Small | Medium, _) => 0.25
    case (Large, Thin) => 0.50
    case (Large, Regular) => 0.75
    case (Large, Thick) => 1.00
```

{% endtab %}
{% endtabs %}

To compute the price of the crust we simultaneously pattern match on both the size and the type of the crust.

> An important point about all functions shown above is that they are *pure functions*: they do not mutate any data or have other side-effects (like throwing exceptions or writing to a file).
> All they do is simply receive values and compute the result.

{% comment %}
I’ve added this comment per [this GitHub comment](https://github.com/scalacenter/docs.scala-lang/pull/3#discussion_r543372428).
To that point, I’ve added these definitions here from our Slack conversation, in case anyone wants to update the “pure function” definition. If not, please delete this comment.

Sébastien:
----------
A function `f` is pure if, given the same input `x`, it will always return the same output `f(x)`, and it never modifies any state outside it (therefore potentially causing other functions to behave differently in the future).

Jonathan:
---------
We say a function is 'pure' if it does not depend on or modify the context it is called in.

Wikipedia
---------
The function always evaluates to the same result value given the same argument value(s). It cannot depend on any hidden state or value, and it cannot depend on any I/O.
Evaluation of the result does not cause any semantically observable side effect or output, such as mutation of mutable objects or output to I/O devices.

Mine (Alvin, now modified, from fp-pure-functions.md):
------------------------------------------------------
- A function `f` is pure if, given the same input `x`, it always returns the same output `f(x)`
- The function’s output depends *only* on its input variables and its internal algorithm
- It doesn’t modify its input parameters
- It doesn’t mutate any hidden state
- It doesn’t have any “back doors”: It doesn’t read data from the outside world (including the console, web services, databases, files, etc.), or write data to the outside world
{% endcomment %}

## How to Organize Functionality

When implementing the `pizzaPrice` function above, we did not say _where_ we would define it.
Scala gives you many great tools to organize your logic in different namespaces and modules.

There are several different ways to implement and organize behaviors:

- Define your functions in companion objects
- Use a modular programming style
- Use a “functional objects” approach
- Define the functionality in extension methods

These different solutions are shown in the remainder of this section.

### Companion Object

A first approach is to define the behavior---the functions---in a companion object.

> As discussed in the Domain Modeling [Tools section][modeling-tools], a _companion object_ is an `object` that has the same name as a class, and is declared in the same file as the class.

With this approach, in addition to the enumeration or case class you also define an equally named companion object that contains the behavior.

{% tabs org_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// the companion object of case class Pizza
object Pizza {
  // the implementation of `pizzaPrice` from above
  def price(p: Pizza): Double = ...
}

sealed abstract class Topping

// the companion object of enumeration Topping
object Topping {
  case object Cheese extends Topping
  case object Pepperoni extends Topping
  case object BlackOlives extends Topping
  case object GreenOlives extends Topping
  case object Onions extends Topping

  // the implementation of `toppingPrice` above
  def price(t: Topping): Double = ...
}
```

{% endtab %}
{% tab 'Scala 3' for=org_1 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

// the companion object of case class Pizza
object Pizza:
  // the implementation of `pizzaPrice` from above
  def price(p: Pizza): Double = ...

enum Topping:
  case Cheese, Pepperoni, BlackOlives, GreenOlives, Onions

// the companion object of enumeration Topping
object Topping:
  // the implementation of `toppingPrice` above
  def price(t: Topping): Double = ...
```

{% endtab %}
{% endtabs %}

With this approach you can create a `Pizza` and compute its price like this:

{% tabs org_2 %}
{% tab 'Scala 2 and 3' for=org_2 %}

```scala
val pizza1 = Pizza(Small, Thin, Seq(Cheese, Onions))
Pizza.price(pizza1)
```

{% endtab %}
{% endtabs %}

Grouping functionality this way has a few advantages:

- It associates functionality with data and makes it easier to find for programmers (and the compiler).
- It creates a namespace and for instance lets us use `price` as a method name without having to rely on overloading.
- The implementation of `Topping.price` can access enumeration values like `Cheese` without having to import them.

However, there are also a few tradeoffs that should be considered:

- It tightly couples the functionality to your data model.
  In particular, the companion object needs to be defined in the same file as your `case` class.
- It might be unclear where to define functions like `crustPrice` that could equally well be placed in a companion object of `CrustSize` or `CrustType`.

## Modules

A second way to organize behavior is to use a “modular” approach.
The book, *Programming in Scala*, defines a *module* as, “a ‘smaller program piece’ with a well-defined interface and a hidden implementation.”
Let’s look at what this means.

### Creating a `PizzaService` interface

The first thing to think about are the `Pizza`s “behaviors”.
When doing this, you sketch a `PizzaServiceInterface` trait like this:

{% tabs module_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_1 %}

```scala
trait PizzaServiceInterface {

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
}
```

{% endtab %}

{% tab 'Scala 3' for=module_1 %}

```scala
trait PizzaServiceInterface:

  def price(p: Pizza): Double

  def addTopping(p: Pizza, t: Topping): Pizza
  def removeAllToppings(p: Pizza): Pizza

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza
  def updateCrustType(p: Pizza, ct: CrustType): Pizza
```

{% endtab %}
{% endtabs %}

As shown, each method takes a `Pizza` as an input parameter---along with other parameters---and then returns a `Pizza` instance as a result

When you write a pure interface like this, you can think of it as a contract that states, “all non-abstract classes that extend this trait *must* provide an implementation of these services.”

What you might also do at this point is imagine that you’re the consumer of this API.
When you do that, it helps to sketch out some sample “consumer” code to make sure the API looks like what you want:

{% tabs module_2 %}
{% tab 'Scala 2 and 3' for=module_2 %}

```scala
val p = Pizza(Small, Thin, Seq(Cheese))

// how you want to use the methods in PizzaServiceInterface
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)
```

{% endtab %}
{% endtabs %}

If that code seems okay, you’ll typically start sketching another API---such as an API for orders---but since we’re only looking at pizzas right now, we’ll stop thinking about interfaces and create a concrete implementation of this interface.

> Notice that this is usually a two-step process.
> In the first step, you sketch the contract of your API as an *interface*.
> In the second step you create a concrete *implementation* of that interface.
> In some cases you’ll end up creating multiple concrete implementations of the base interface.

### Creating a concrete implementation

Now that you know what the `PizzaServiceInterface` looks like, you can create a concrete implementation of it by writing the body for all of the methods you defined in the interface:

{% tabs module_3 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface {

  def price(p: Pizza): Double =
    ... // implementation from above

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```

{% endtab %}

{% tab 'Scala 3' for=module_3 %}

```scala
object PizzaService extends PizzaServiceInterface:

  def price(p: Pizza): Double =
    ... // implementation from above

  def addTopping(p: Pizza, t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings(p: Pizza): Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(p: Pizza, cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(p: Pizza, ct: CrustType): Pizza =
    p.copy(crustType = ct)

end PizzaService
```

{% endtab %}
{% endtabs %}

While this two-step process of creating an interface followed by an implementation isn’t always necessary, explicitly thinking about the API and its use is a good approach.

With everything in place you can use your `Pizza` class and `PizzaService`:

{% tabs module_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_4 %}

```scala
import PizzaService._

val p = Pizza(Small, Thin, Seq(Cheese))

// use the PizzaService methods
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // prints 8.75
```

{% endtab %}

{% tab 'Scala 3' for=module_4 %}

```scala
import PizzaService.*

val p = Pizza(Small, Thin, Seq(Cheese))

// use the PizzaService methods
val p1 = addTopping(p, Pepperoni)
val p2 = addTopping(p1, Onions)
val p3 = updateCrustType(p2, Thick)
val p4 = updateCrustSize(p3, Large)

println(price(p4)) // prints 8.75
```

{% endtab %}
{% endtabs %}

### Functional Objects

In the book, *Programming in Scala*, the authors define the term, “Functional Objects” as “objects that do not have any mutable state”.
This is also the case for types in `scala.collection.immutable`.
For example, methods on `List` do not mutate the interal state, but instead create a copy of the `List` as a result.

You can think of this approach as a “hybrid FP/OOP design” because you:

- Model the data using immutable `case` classes.
- Define the behaviors (methods) in the _same type_ as the data.
- Implement the behavior as pure functions: They don’t mutate any internal state; rather, they return a copy.

> This really is a hybrid approach: like in an **OOP design**, the methods are encapsulated in the class with the data, but as typical for a **FP design**, methods are implemented as pure functions that don’t mutate the data

#### Example

Using this approach, you can directly implement the functionality on pizzas in the case class:

{% tabs module_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
) {

  // the operations on the data model
  def price: Double =
    pizzaPrice(this) // implementation from above

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
}
```

{% endtab %}

{% tab 'Scala 3' for=module_5 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
):

  // the operations on the data model
  def price: Double =
    pizzaPrice(this) // implementation from above

  def addTopping(t: Topping): Pizza =
    this.copy(toppings = this.toppings :+ t)

  def removeAllToppings: Pizza =
    this.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    this.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    this.copy(crustType = ct)
```

{% endtab %}
{% endtabs %}

Notice that unlike the previous approaches, because these are methods on the `Pizza` class, they don’t take a `Pizza` reference as an input parameter.
Instead, they have their own reference to the current pizza instance as `this`.

Now you can use this new design like this:

{% tabs module_6 %}
{% tab 'Scala 2 and 3' for=module_6 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

### Extension Methods

Finally, we show an approach that lies between the first one (defining functions in the companion object) and the last one (defining functions as methods on the type itself).

Extension methods let us create an API that is like the one of functional object, without having to define functions as methods on the type itself.
This can have multiple advantages:

- Our data model is again _very concise_ and does not mention any behavior.
- We can equip types with additional methods _retroactively_ without having to change the original definition.
- Other than companion objects or direct methods on the types, extension methods can be defined _externally_ in another file.

Let us revisit our example once more.

{% tabs module_7 class=tabs-scala-version %}
{% tab 'Scala 2' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

implicit class PizzaOps(p: Pizza) {
  def price: Double =
    pizzaPrice(p) // implementation from above

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
}
```
In the above code, we define the different methods on pizzas as methods in an _implicit class_.
With `implicit class PizzaOps(p: Pizza)` then wherever `PizzaOps` is imported its methods will be available on
instances of `Pizza`. The receiver in this case is `p`.

{% endtab %}
{% tab 'Scala 3' for=module_7 %}

```scala
case class Pizza(
  crustSize: CrustSize,
  crustType: CrustType,
  toppings: Seq[Topping]
)

extension (p: Pizza)
  def price: Double =
    pizzaPrice(p) // implementation from above

  def addTopping(t: Topping): Pizza =
    p.copy(toppings = p.toppings :+ t)

  def removeAllToppings: Pizza =
    p.copy(toppings = Seq.empty)

  def updateCrustSize(cs: CrustSize): Pizza =
    p.copy(crustSize = cs)

  def updateCrustType(ct: CrustType): Pizza =
    p.copy(crustType = ct)
```
In the above code, we define the different methods on pizzas as _extension methods_.
With `extension (p: Pizza)` we say that we want to make the methods available on instances of `Pizza`. The receiver
in this case is `p`.

{% endtab %}
{% endtabs %}

Using our extension methods, we can obtain the same API as before:

{% tabs module_8 %}
{% tab 'Scala 2 and 3' for=module_8 %}

```scala
Pizza(Small, Thin, Seq(Cheese))
  .addTopping(Pepperoni)
  .updateCrustType(Thick)
  .price
```

{% endtab %}
{% endtabs %}

while being able to define extensions in any other module.
Typically, if you are the designer of the data model, you will define your extension methods in the companion object.
This way, they are already available to all users.
Otherwise, extension methods need to be imported explicitly to be usable.

## Summary of this Approach

Defining a data model in Scala/FP tends to be simple: Just model variants of the data with enumerations and compound data with  `case` classes.
Then, to model the behavior, define functions that operate on values of your data model.
We have seen different ways to organize your functions:

- You can put your methods in companion objects
- You can use a modular programming style, separating interface and implementation
- You can use a “functional objects” approach and store the methods on the defined data type
- You can use extension methods to equip your data model with functionality

[adts]: {% link _overviews/scala3-book/types-adts-gadts.md %}
[modeling-tools]: {% link _overviews/scala3-book/domain-modeling-tools.md %}
