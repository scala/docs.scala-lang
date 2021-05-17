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

- **Traits** let you specify (abstract) interfaces, as well as concrete implementations.
- **Mixin Composition** gives you the tools to compose components from smaller parts.
- **Classes** can implement the interfaces specified by traits.
- **Instances** of classes can have their own private state.
- **Subtyping** lets you use an instance of one class where an instance of a superclass is expected.
- **Access modifiers** lets you control which members of a class can be accessed by which part of the code.

## Traits
Perhaps different than other languages with support for OOP, such as Java, the primary tool of decomposition in Scala is not classes, but traits.
They can serve to describe abstract interfaces like:

```scala
trait Showable:
  def show: String
```

and can also contain concrete implementations:
```scala
trait Showable:
  def show: String
  def showHtml = "<p>" + show + "</p>"
```
You can see that we define the method `showHtml` _in terms_ of the abstract method `show`.

[Odersky and Zenger][scalable] present the _service-oriented component model_ and view:

- **abstract members** as _required_ services: they still need to be implemented by a subclass.
- **concrete members** as _provided_ services: they are provided to the subclass.

We can already see this with our example of `Showable`: defining a class `Document` that extends `Showable`, we still have to define `show`, but are provided with `showHtml`:

```scala
class Document(text: String) extends Showable:
  def show = text
```
#### Abstract Members
Abstract methods are not the only thing that can be left abstract in a trait.
A trait can contain:

- abstract methods (`def m(): T`)
- abstract value definitions (`val x: T`)
- abstract type members (`type T`), potentially with bounds (`type T <: S`)
- abstract givens (`given t: T`)

Each of the above features can be used to specify some form of requirement on the implementor of the trait.

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
Abstract members in one trait (such as `translate` in `GreetingService`) are automatically matched with concrete members in another trait.
This not only works with methods as in this example, but also with all of the other abstract members mentioned above (that is, types, value definitions, etc.).

## Classes
Traits are great to modularize components and describe interfaces (required and provided).
But at some point we’ll want to create instances of them.
When designing software in Scala, it’s often helpful to only consider using classes at the leafs of your inheritance model:

{% comment %}
NOTE: I think “leaves” may technically be the correct word to use, but I prefer “leafs.”
{% endcomment %}

```text
traits               T1   T2           ...  T3
composed traits      S extends T1, T2  ...  S extends T2, T3
classes              C extends S, T3
instances            new C
```
This is even more the case in Scala 3, where traits now can also take parameters, further eliminating the need for classes.

#### Defining Classes
Like traits, classes can extend multiple traits (but only one super class):
```scala
class MyService(name: String) extends ComposedService, Showable:
  def show = s"$name says $sayHello"
```
#### Subtyping
We can create an instance of `MyService` as follows:
```scala
val s1: MyService = MyService("Service 1")
```
Through the means of subtyping, our instance `s1` can be used everywhere that any of the extended traits is expected:
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
In order to allow this, the base class needs to be marked as `open`:
```scala
open class Person(name: String)
```
Marking classes with [`open`][open] is a new feature of Sala 3. Having to explicitly mark classes as open avoids many common pitfalls in OO design.
In particular, it requires library designers to explicitly plan for extension and for instance document the classes that are marked as open with additional extension contracts.

{% comment %}
NOTE/FWIW: In his book, “Effective Java,” Joshua Bloch describes this as “Item 19: Design and document for inheritance or else prohibit it.”
Unfortunately I can’t find any good links to this on the internet.
I only mention this because I think that book and phrase is pretty well known in the Java world.
{% endcomment %}



## Instances and Private Mutable State
Like in other languages with support for OOP, traits and classes in Scala can define mutable fields:
```scala
class Counter:
  // can only be observed by the method `count`
  private var currentCount = 0

  def tick() = currentCount += 1
  def count: Int = currentCount
```
Every instance of the class `Counter` has its own private state that can only be observed through the method `count`, as the following interaction illustrates:
```scala
val c1 = Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

#### Access Modifiers
By default, all member definitions in Scala are publicly visible.
To hide implementation details, it’s possible to define members (methods, fields, types, etc.) to be `private` or `protected`.
This way you can control how they are accessed or overridden.
Private members are only visible to the class/trait itself and to its companion object.
Protected members are also visible to subclasses of the class.


## Advanced Example: Service Oriented Design
In the following, we illustrate some advanced features of Scala and show how they can be used to structure larger software components.
The examples are adapted from the paper ["Scalable Component Abstractions"][scalable] by Martin Odersky and Matthias Zenger.
Don’t worry if you don’t understand all the details of the example; it’s primarily intended to demonstrate how to use several type features to construct larger components.

Our goal is to define a software component with a _family of types_ that can be refined later in implementations of the component.
Concretely, the following code defines the component `SubjectObserver` as a trait with two abstract type members, `S` (for subjects) and `O` (for observers):

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
The declaration `type S <: Subject` says that within the trait `SubjectObserver` we can refer to some _unknown_ (that is, abstract) type that we call `S`.
However, the type is not completely unknown: we know at least that it is _some subtype_ of the trait `Subject`.
All traits and classes extending `SubjectObserer` are free to chose any type for `S` as long as the chosen type is a subtype of `Subject`.
The `<: Subject` part of the declaration is also referred to as an _upper bound on `S`_.

#### Nested Traits
_Within_ trait `SubjectObserver`, we define two other traits.
Let us begin with trait `Observer`, which only defines one abstract method `notify` that takes an argument of type `S`.
As we will see momentarily, it is important that the argument has type `S` and not type `Subject`.

The second trait, `Subject`, defines one private field `observers` to store all observers that subscribed to this particular subject.
Subscribing to a subject simply stores the object into this list.
Again, the type of parameter `obs` is `O`, not `Observer`.

#### Selftype Annotations
Finally, you might have wondered what the `self: S =>` on trait `Subject` is supposed to mean.
This is called a _selftype annotation_.
It requires subtypes of `Subject` to also be subtypes of `S`.
This is necessary to be able to call `obs.notify` with `this` as an argument, since it requires a value of type `S`.
If `S` was a _concrete_ type, the selftype annotation could be replaced by `trait Subject extends S`.

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
Specifically, we define a _singleton_ object `SensorReader` that extends `SubjectObserver`.
In the implementation of `SensorReader`, we say that type `S` is now defined as type `Sensor`, and type `O` is defined to be equal to type `Display`.
Both `Sensor` and `Display` are defined as nested classes within `SensorReader`, implementing the traits `Subject` and `Observer`, correspondingly.

Besides being an example of a service oriented design, this code also highlights many aspects of object-oriented programming:

- The class `Sensor` introduces its own private state (`currentValue`) and encapsulates modification of the state behind the method `changeValue`.
- The implementation of `changeValue` uses the method `publish` defined in the extended trait.
- The class `Display` extends the trait `Observer`, and implements the missing method `notify`.
{% comment %}
NOTE: You might say “the abstract method `notify`” in that last sentence, but I like “missing.”
{% endcomment %}

It is important to point out that the implementation of `notify` can only safely access the label and value of `sub`, since we originally declared the parameter to be of type `S`.

### Using the Component
Finally, the following code illustrates how to use our `SensorReader` component:
```scala
import SensorReader.*

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
With all the object-oriented programming utilities under our belt, in the next section we will demonstrate how to design programs in a functional style.

{% comment %}
NOTE: One thing I occasionally do is flip things like this around, so I first show how to use a component, and then show how to implement that component. I don’t have a rule of thumb about when to do this, but sometimes it’s motivational to see the use first, and then see how to create the code to make that work.
{% endcomment %}



[scalable]: https://doi.org/10.1145/1094811.1094815
[open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html




