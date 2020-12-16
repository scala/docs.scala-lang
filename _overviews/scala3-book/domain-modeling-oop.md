---
title: OOP Modeling
type: section
description: This chapter provides an introduction to OOP domain modeling with Scala 3.
num: 21
previous-page: domain-modeling-tools
next-page: domain-modeling-fp
---

This chapter provides an introduction to domain modeling using object-oriented programming (OOP) in Scala 3.



## Introduction

Scala provides all the necessary tools for object-oriented design:

- **Traits** allow you to specify (abstract) interfaces, but also concrete implementations.
- **Mixin Composition** gives you the tools to compose components from smaller parts.
- **Classes** can implement the interfaces specified by traits.
- **Instances** of classes can have their own private state.
- **Subtyping** allows you to use an instance of one class where an instance of a superclass is expected.
- **Access modifiers** allow you to control which members of a class can be accessed by which part of the code.

## Traits
Different to maybe other languages with support for OOP, like Java, the primary tool of decomposition in Scala are not classes, but traits. They can serve to describe abstract interfaces like

```scala
trait Showable:
  def show: String
```

but can also contain concrete implementations:
```scala
trait Showable:
  def show: String
  def showHtml = "<p>" + show + "</p>"
```
You can see that we define the method `showHtml` _in terms_ of the abstract method `show`.

[Odersky and Zenger][scalable] present the _service-oriented component model_ and view

- **abstract members** as _required_ services: they still need to be implemented by a subclass.
- **concrete members** as _provided_ services: they are provided to the subclass.

We can already see this in our example of `Showable`: defining a class `Document` that extends `Showable`, we still have to define `show` but are provided with `showHtml`:

```scala
class Document(text: String) extends Showable:
  def show = text
```
#### Abstract Members
Abstract methods are not the only thing can be left abstract in a trait. A trait can contain

- abstract methods (`def m(): T`)
- abstract value definitions (`val x: T`)
- abstract type members (`type T`), potentially with bounds (`type T <: S`)
- abstract givens (`given t: T`)

Each of the above features can be used to specify some form requirement on the implementor of the trait.

## Mixin Composition
Not only can traits contain abstract and concrete definitions, Scala also provides a powerful way to compose multiple traits: a feature which is often referred to as _mixin composition_.

Let us assume the following two (potentially independently defined) traits:
```scala
trait GreetingService:
  def translate(text: String): String
  def sayHello = translate("Hello")

trait TranslationService:
  def translate(text: String): String = "..."
```
To compose the two services, we can simply create a new trait extending them:
```scala
trait ComposedService extends GreetingService, TranslationService
```
Abstract members in one trait (such as `translate` in `GreetingService`) are automatically matched with concrete memembers in another trait. This is not works with methods like in this example but also with all of the other abtract members mentioned above (that is, types, value definitions, etc.).

## Classes
Traits are great to modularize components and describe interfaces (required and provided).
But at one point, we want to create instances of them. When designing software in Scala, it is often helpful to only consider classes at the leafs of your inheritance model.
```text
traits               T1   T2           ...  T3
composed traits      S extends T1, T2  ...  S extends T2, T3
classes              C extends S, T3
instances            new C
```
This is even more the case in Scala 3, where traits now can also take parameters, further eliminating the need for classes.

#### Defining Classes
Like traits, classes can extend multiple traits (but only one super class).
```scala
class MyService(name: String) extends ComposedService, Showable:
  def show = s"$name says $sayHello"
```
#### Subtyping
We can create an instance of `MyService` as follows:
```scala
val s1: MyService = MyService("Service 1")
```
Through the means of subtyping, our instance `s1` can be used everywhere where any of the extended traits is expected.
```scala
val s2: GreetingService = s1
val s3: TranslationService = s1
val s4: Showable = s1
// ... and so on ...
```

#### Planning for Extension
As mentioned before, it is possible to extend another class:
```scala
class Person(name: String)
class SoftwareDeveloper(name: String, favoriteLang: String)
  extends Person(name)
```
However, since _traits_ are designed as the primary means of decomposition,
a class that is defined in one file _cannot_ be extended in another file.
In order to allow this, the base class needs to be [marked as `open`][open].
```scala
open class Person(name: String)
```
Having to explicitly mark classes as open avoids many common pitfalls in OO design.
In particular, it requires library designers to explicitly plan for extension and for instance document the classes that are marked as open with additional extension contracts.


## Instances and Private Mutable State
Like in other languages with support for OOP, traits and classes in Scala can define mutable fields:
```scala
class Counter:
  // can only be observed by the method `count`
  private var currentCount = 0

  def tick() = currentCount += 1
  def count: Int = currentCount
```
Every instance of the class `Counter` has its own private state that can only be observed through the method `count`, as the following interaction illustrates.
```scala
val c1 = Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

#### Access Modifiers
By default, all member definitions in Scala are publically visible.
To hide implementation details it is possible to define members (that is methods, fields, types, etc.) to be `private` or `protected`. This way you can control how they are accessed or overridden. Private members are only visible to the class / trait itself and to its companion object. Protected members are also visible to subclasses of the class.


## Advanced Example: Service Oriented Design
In the following, we illustrate some advanced features of Scala and show how they can be used to structure larger software components. The examples are adapted from the paper ["Scalable Component Abstractions"][scalable] by Martin Odersky and Matthias Zenger. Do not worry, if you do not understand all details of the example.

Our goal is to define a software component with a _family of types_ that can be refined later in implementations of the component. Concretely, the following code defines the component `SubjectObserver` as a trait with two abstract type members `S` (for subjects) and `O` (for observers).

```scala
trait SubjectObserver:

  type S <: Subject
  type O <: Observer

  trait Subject { self: S =>
    private var observers: List[O] = List()
    def subscribe(obs: O): Unit =
      observers = obs :: observers
    def publish() =
      for obs <- observers do obs.notify(this)
  }

  trait Observer {
    def notify(sub: S): Unit
  }
```
There are a few things that need explanation.

#### Abstract Type Members
The declaration `type S <: Subject` says that within the trait `SubjectObserver` we can refer to some _unknown_ (that is, abstract) type that we call `S`. However, the type is not completely unknown: we know at least that it is _some subtype_ of the trait `Subject`.
All traits and classes extending `SubjectObserer` are free to chose any type for `S` as long as the chosen type is a subtype of `Subject`. The `<: Subject` part of the declaration is also referred to as an _upper bound on `S`_.

#### Nested Traits
_Within_ trait `SubjectObserver`, we define two other traits. Let us begin with trait `Observer`, which only defines one abstract method `notify` that takes an argument of type `S`. As we will see momentarily, it is important that the argument has type `S` and not type `Subject`.

The second trait, `Subject` defines one private field `observers` to store all observers that  subscribed to this particular subject. Subscribing to a subject simply stores the object into this list. Again, the type of parameter `obs` is `O`, not `Observer`.

#### Selftype Annotations
Finally, you might have wondered what the `self: S =>` on trait `Subject` is supposed to mean. This is called a _selftype annotation_. It requires subtypes of `Subject` to also be subtypes of `S`. This is necessary to be able to call `obs.notify` with `this` as an argument, since it requires a value of type `S`. If `S` would be a _concrete_ type, the selftype annotation could be replaced by `trait Subject extends S`.

### Implementing the Component
We can now implement the above component and define the abstract type members to be concrete types:

```scala
object SensorReader extends SubjectObserver:
  type S = Sensor
  type O = Display

  class Sensor(val label: String) extends Subject:
    private var currentValue = 0.0
    def value = currentValue
    def changeValue(v: Double) =
      currentValue = v
      publish()

  class Display extends Observer:
    def notify(sub: Sensor) =
      println(s"${sub.label} has value ${sub.value}")
```
Specifically, we define a _singleton_ object `SensorReader` extends `SubjectObserver`.
In the implementation of `SensorReader`, we say that type `S` now is defined as type `Sensor` and type `O` is defined to be equal to type `Display`. Both, `Sensor` and `Display` are defined as nested classes within `SensorReader` implementing the traits `Subject` and `Observer`, correspondingly.

Besides being an example of a service oriented design, it also highlights many aspects of object-oriented programming:

- The class `Sensor` introduces its own private state (`currentValue`) and encapsulates modification of the state behind the method `changeValue`.
- The implementation of `changeValue` uses the method `publish` defined in the extended trait.
- The class `Display` extends trait `Observer` and implements the missing method `notify`.

It is important to point out, that the implementation of `notify` can only safely access the label and value of `sub` since we originally declared the parameter to be of type `S`.

### Using the Component
Finally, the following code illustrates how to use our `SensorReader` component.
```scala
import SensorReader._

// setting up a network
val s1 = Sensor("sensor1")
val s2 = Sensor("sensor2")
val d1 = Display()
val d2 = Display()
s1.subscribe(d1)
s1.subscribe(d2)
s2.subscribe(d1)

// propagating updates through the network
s1.changeValue(2)
s2.changeValue(3)

// prints:
// sensor1 has value 2.0
// sensor1 has value 2.0
// sensor2 has value 3.0
```
With all the object-oriented programming utilities under our belt, in the next Section we will revisit how to design programs in a functional style.


[scalable]: https://doi.org/10.1145/1094811.1094815
[open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
