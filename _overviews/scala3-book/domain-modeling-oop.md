---
title: OOP Modeling
type: section
description: This chapter provides an introduction to OOP domain modeling with Scala 3.
languages: [ru, zh-cn]
num: 22
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

Perhaps different from other languages with support for OOP, such as Java, the primary tool of decomposition in Scala is not classes, but traits.
They can serve to describe abstract interfaces like:

{% tabs traits_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Showable {
  def show: String
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Showable:
  def show: String
```
{% endtab %}
{% endtabs %}

and can also contain concrete implementations:

{% tabs traits_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait Showable {
  def show: String
  def showHtml = "<p>" + show + "</p>"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait Showable:
  def show: String
  def showHtml = "<p>" + show + "</p>"
```
{% endtab %}
{% endtabs %}

You can see that we define the method `showHtml` _in terms_ of the abstract method `show`.

[Odersky and Zenger][scalable] present the _service-oriented component model_ and view:

- **abstract members** as _required_ services: they still need to be implemented by a subclass.
- **concrete members** as _provided_ services: they are provided to the subclass.

We can already see this with our example of `Showable`: defining a class `Document` that extends `Showable`, we still have to define `show`, but are provided with `showHtml`:

{% tabs traits_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Document(text: String) extends Showable {
  def show = text
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Document(text: String) extends Showable:
  def show = text
```

{% endtab %}
{% endtabs %}

#### Abstract Members

Abstract methods are not the only thing that can be left abstract in a trait.
A trait can contain:

- abstract methods (`def m(): T`)
- abstract value definitions (`val x: T`)
- abstract type members (`type T`), potentially with bounds (`type T <: S`)
- abstract givens (`given t: T`)
<span class="tag tag-inline">Scala 3 only</span>

Each of the above features can be used to specify some form of requirement on the implementor of the trait.

## Mixin Composition

Not only can traits contain abstract and concrete definitions, Scala also provides a powerful way to compose multiple traits: a feature which is often referred to as _mixin composition_.

Let us assume the following two (potentially independently defined) traits:

{% tabs traits_4 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait GreetingService {
  def translate(text: String): String
  def sayHello = translate("Hello")
}

trait TranslationService {
  def translate(text: String): String = "..."
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait GreetingService:
  def translate(text: String): String
  def sayHello = translate("Hello")

trait TranslationService:
  def translate(text: String): String = "..."
```

{% endtab %}
{% endtabs %}

To compose the two services, we can simply create a new trait extending them:

{% tabs traits_5 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait ComposedService extends GreetingService with TranslationService
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait ComposedService extends GreetingService, TranslationService
```

{% endtab %}
{% endtabs %}

Abstract members in one trait (such as `translate` in `GreetingService`) are automatically matched with concrete members in another trait.
This not only works with methods as in this example, but also with all the other abstract members mentioned above (that is, types, value definitions, etc.).

### Mixing traits in on the fly

Traits that have concrete methods can be mixed into classes on the fly. Given a class:

{% tabs traits_6 %}
{% tab 'Scala 2 and 3' %}
```scala
class MyService(name: String)
```
{% endtab %}
{% endtabs %}

you can create a `MyService` instance that mixes in the traits when you create it:

{% tabs traits_7 %}
{% tab 'Scala 2 and 3' %}
```scala
val s = new MyService("ComposedService") with GreetingService with TranslationService
//                                       --------------------------------------------
```
{% endtab %}
{% endtabs %}

The REPL shows that it works:

{% tabs traits_8 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
scala> val s = new MyService("ComposedService") with GreetingService with TranslationService
     | 
val s: MyService with GreetingService with TranslationService = $anon$1@4ebd8d2

scala> s.translate("Text")
val res0: String = ...

scala> s.sayHello
val res1: String = ...
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
scala> val s = new MyService("ComposedService") with GreetingService with TranslationService
val s: MyService & GreetingService & TranslationService = anon$1@c5a2d5
                                                                                                                                                                            
scala> s.translate("Text")
val res0: String = ...
                                                                                                                                                                            
scala> s.sayHello
val res1: String = ...
```
{% endtab %}
{% endtabs %}

This example works because all the mixed in methods are defined in `GreetingService` and in `TranslationService`. 

## Classes

Traits are great to modularize components and describe interfaces (required and provided).
But at some point we’ll want to create instances of them.
When designing software in Scala, it’s often helpful to only consider using classes at the leafs of your inheritance model:

{% comment %}
NOTE: I think “leaves” may technically be the correct word to use, but I prefer “leafs.”
{% endcomment %}

{% tabs table-traits-cls-summary class=tabs-scala-version %}
{% tab 'Scala 2' %}
| Traits          | `T1`, `T2`, `T3`
| Composed traits | `S1 extends T1 with T2`, `S2 extends T2 with T3`
| Classes         | `C extends S1 with T3`
| Instances       | `new C()`
{% endtab %}
{% tab 'Scala 3' %}
| Traits          | `T1`, `T2`, `T3`
| Composed traits | `S1 extends T1, T2`, `S2 extends T2, T3`
| Classes         | `C extends S1, T3`
| Instances       | `C()`
{% endtab %}
{% endtabs %}

This is even more the case in Scala 3, where traits now can also take parameters, further eliminating the need for classes.

#### Defining Classes

Like traits, classes can extend multiple traits (but only one super class):

{% tabs class_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class MyService(name: String) extends ComposedService with Showable {
  def show = s"$name says $sayHello"
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class MyService(name: String) extends ComposedService, Showable:
  def show = s"$name says $sayHello"
```

{% endtab %}
{% endtabs %}

#### Subtyping

We can create an instance of `MyService` as follows:

{% tabs class_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val s1: MyService = new MyService("Service 1")
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val s1: MyService = MyService("Service 1")
```

{% endtab %}
{% endtabs %}

Through the means of subtyping, our instance `s1` can be used everywhere that any of the extended traits is expected:

{% tabs class_3 %}
{% tab 'Scala 2 and 3' %}

```scala
val s2: GreetingService = s1
val s3: TranslationService = s1
val s4: Showable = s1
// ... and so on ...
```
{% endtab %}
{% endtabs %}

#### Planning for Extension

As mentioned before, it is possible to extend another class:

{% tabs class_4 %}
{% tab 'Scala 2 and 3' %}

```scala
class Person(name: String)
class SoftwareDeveloper(name: String, favoriteLang: String)
  extends Person(name)
```

{% endtab %}
{% endtabs %}

However, since _traits_ are designed as the primary means of decomposition,
it is not recommended to extend a class that is defined in one file from another file.

<h5>Open Classes <span class="tag tag-inline">Scala 3 only</span></h5>

In Scala 3 extending non-abstract classes in other files is restricted. In order to allow this, the base class needs to
be marked as `open`:

{% tabs class_5 %}
{% tab 'Scala 3 Only' %}

```scala
open class Person(name: String)
```
{% endtab %}
{% endtabs %}

Marking classes with [`open`][open] is a new feature of Scala 3. Having to explicitly mark classes as open avoids many common pitfalls in OO design.
In particular, it requires library designers to explicitly plan for extension and for instance document the classes that are marked as open with additional extension contracts.

{% comment %}
NOTE/FWIW: In his book, “Effective Java,” Joshua Bloch describes this as “Item 19: Design and document for inheritance or else prohibit it.”
Unfortunately I can’t find any good links to this on the internet.
I only mention this because I think that book and phrase is pretty well known in the Java world.
{% endcomment %}

## Instances and Private Mutable State

Like in other languages with support for OOP, traits and classes in Scala can define mutable fields:

{% tabs instance_6 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
class Counter {
  // can only be observed by the method `count`
  private var currentCount = 0

  def tick(): Unit = currentCount += 1
  def count: Int = currentCount
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
class Counter:
  // can only be observed by the method `count`
  private var currentCount = 0

  def tick(): Unit = currentCount += 1
  def count: Int = currentCount
```

{% endtab %}
{% endtabs %}

Every instance of the class `Counter` has its own private state that can only be observed through the method `count`, as the following interaction illustrates:

{% tabs instance_7 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
val c1 = new Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

{% endtab %}
{% tab 'Scala 3' %}

```scala
val c1 = Counter()
c1.count // 0
c1.tick()
c1.tick()
c1.count // 2
```

{% endtab %}
{% endtabs %}

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

{% tabs example_1 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
trait SubjectObserver {

  type S <: Subject
  type O <: Observer

  trait Subject { self: S =>
    private var observers: List[O] = List()
    def subscribe(obs: O): Unit = {
      observers = obs :: observers
    }
    def publish() = {
      for ( obs <- observers ) obs.notify(this)
    }
  }

  trait Observer {
    def notify(sub: S): Unit
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

```scala
trait SubjectObserver:

  type S <: Subject
  type O <: Observer

  trait Subject:
    self: S =>
      private var observers: List[O] = List()
      def subscribe(obs: O): Unit =
        observers = obs :: observers
      def publish() =
        for obs <- observers do obs.notify(this)

  trait Observer:
    def notify(sub: S): Unit
```

{% endtab %}
{% endtabs %}

There are a few things that need explanation.

#### Abstract Type Members

The declaration `type S <: Subject` says that within the trait `SubjectObserver` we can refer to some _unknown_ (that is, abstract) type that we call `S`.
However, the type is not completely unknown: we know at least that it is _some subtype_ of the trait `Subject`.
All traits and classes extending `SubjectObserver` are free to choose any type for `S` as long as the chosen type is a subtype of `Subject`.
The `<: Subject` part of the declaration is also referred to as an _upper bound on `S`_.

#### Nested Traits

_Within_ trait `SubjectObserver`, we define two other traits.
Let us begin with trait `Observer`, which only defines one abstract method `notify` that takes an argument of type `S`.
As we will see momentarily, it is important that the argument has type `S` and not type `Subject`.

The second trait, `Subject`, defines one private field `observers` to store all observers that subscribed to this particular subject.
Subscribing to a subject simply stores the object into this list.
Again, the type of parameter `obs` is `O`, not `Observer`.

#### Self-type Annotations

Finally, you might have wondered what the `self: S =>` on trait `Subject` is supposed to mean.
This is called a _self-type annotation_.
It requires subtypes of `Subject` to also be subtypes of `S`.
This is necessary to be able to call `obs.notify` with `this` as an argument, since it requires a value of type `S`.
If `S` was a _concrete_ type, the self-type annotation could be replaced by `trait Subject extends S`.

### Implementing the Component

We can now implement the above component and define the abstract type members to be concrete types:

{% tabs example_2 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
object SensorReader extends SubjectObserver {
  type S = Sensor
  type O = Display

  class Sensor(val label: String) extends Subject {
    private var currentValue = 0.0
    def value = currentValue
    def changeValue(v: Double) = {
      currentValue = v
      publish()
    }
  }

  class Display extends Observer {
    def notify(sub: Sensor) =
      println(s"${sub.label} has value ${sub.value}")
  }
}
```

{% endtab %}

{% tab 'Scala 3' %}

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

{% endtab %}
{% endtabs %}

Specifically, we define a _singleton_ object `SensorReader` that extends `SubjectObserver`.
In the implementation of `SensorReader`, we say that type `S` is now defined as type `Sensor`, and type `O` is defined to be equal to type `Display`.
Both `Sensor` and `Display` are defined as nested classes within `SensorReader`, implementing the traits `Subject` and `Observer`, correspondingly.

Besides, being an example of a service oriented design, this code also highlights many aspects of object-oriented programming:

- The class `Sensor` introduces its own private state (`currentValue`) and encapsulates modification of the state behind the method `changeValue`.
- The implementation of `changeValue` uses the method `publish` defined in the extended trait.
- The class `Display` extends the trait `Observer`, and implements the missing method `notify`.
{% comment %}
NOTE: You might say “the abstract method `notify`” in that last sentence, but I like “missing.”
{% endcomment %}

It is important to point out that the implementation of `notify` can only safely access the label and value of `sub`, since we originally declared the parameter to be of type `S`.

### Using the Component

Finally, the following code illustrates how to use our `SensorReader` component:

{% tabs example_3 class=tabs-scala-version %}
{% tab 'Scala 2' %}

```scala
import SensorReader._

// setting up a network
val s1 = new Sensor("sensor1")
val s2 = new Sensor("sensor2")
val d1 = new Display()
val d2 = new Display()
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

{% endtab %}

{% tab 'Scala 3' %}

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

{% endtab %}
{% endtabs %}

With all the object-oriented programming utilities under our belt, in the next section we will demonstrate how to design programs in a functional style.

{% comment %}
NOTE: One thing I occasionally do is flip things like this around, so I first show how to use a component, and then show how to implement that component. I don’t have a rule of thumb about when to do this, but sometimes it’s motivational to see the use first, and then see how to create the code to make that work.
{% endcomment %}

[scalable]: https://doi.org/10.1145/1094811.1094815
[open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[trait-params]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
