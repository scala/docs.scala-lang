---
layout: tour
title: Case Classes
partof: scala-tour

num: 13
next-page: pattern-matching
previous-page: multiple-parameter-lists
prerequisite-knowledge: classes, basics, mutability

redirect_from: "/tutorials/tour/case-classes.html"
---

Case classes are like regular classes with a few key differences which we will go over. Case classes are good for modeling immutable data. In the next step of the tour, we'll see how they are useful in [pattern matching](pattern-matching.html).

## Defining a case class
A minimal case class requires the keywords `case class`, an identifier, and a parameter list (which may be empty):

{% tabs case-classe_Book %}

{% tab 'Scala 2 and 3' for=case-classe_Book %}
```scala mdoc
case class Book(isbn: String)

val frankenstein = Book("978-0486282114")
```
{% endtab %}

{% endtabs %}

Although that is usually left out, it is possible to explicitly use the `new` keyword, as `new Book()`. This is because case classes have an `apply` method by default which takes care of object construction.

When you create a case class with parameters, the parameters are public `val`s.

{% tabs case-classe_Message_define %}

{% tab 'Scala 2 and 3' for=case-classe_Message_define %}
```
case class Message(sender: String, recipient: String, body: String)
val message1 = Message("guillaume@quebec.ca", "jorge@catalonia.es", "Ça va ?")

println(message1.sender)  // prints guillaume@quebec.ca
message1.sender = "travis@washington.us"  // this line does not compile
```
{% endtab %}

{% endtabs %}

You can't reassign `message1.sender` because it is a `val` (i.e. immutable). It is possible to use `var`s in case classes but this is discouraged.

## Comparison
Instances of case classes are compared by structure and not by reference:

{% tabs case-classe_Message_compare %}

{% tab 'Scala 2 and 3' for=case-classe_Message_compare %}
```scala mdoc
case class Message(sender: String, recipient: String, body: String)

val message2 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val message3 = Message("jorge@catalonia.es", "guillaume@quebec.ca", "Com va?")
val messagesAreTheSame = message2 == message3  // true
```
{% endtab %}

{% endtabs %}

Even though `message2` and `message3` refer to different objects, the value of each object is equal.

## Copying
You can create a (shallow) copy of an instance of a case class simply by using the `copy` method. You can optionally change the constructor arguments.

{% tabs case-classe_Message_copy %}

{% tab 'Scala 2 and 3' for=case-classe_Message_copy %}
```scala mdoc:nest
case class Message(sender: String, recipient: String, body: String)
val message4 = Message("julien@bretagne.fr", "travis@washington.us", "Me zo o komz gant ma amezeg")
val message5 = message4.copy(sender = message4.recipient, recipient = "claire@bourgogne.fr")
message5.sender  // travis@washington.us
message5.recipient // claire@bourgogne.fr
message5.body  // "Me zo o komz gant ma amezeg"
```
{% endtab %}

{% endtabs %}

The recipient of `message4` is used as the sender of `message5` but the `body` of `message4` was copied directly.

## More resources

* Learn more about case classes in the [Scala Book](/overviews/scala-book/case-classes.html)
