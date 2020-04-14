---
type: chapter
layout: multipage-overview
title: Scala Classes
description: This page shows examples of how to create Scala classes, including the basic Scala class constructor.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 19
outof: 54
previous-page: try-catch-finally
next-page: classes-aux-constructors
---


In support of object-oriented programming (OOP), Scala provides a *class* construct. The syntax is much more concise than languages like Java and C#, but it’s also still easy to use and read.



## Basic class constructor

Here’s a Scala class whose constructor defines two parameters, `firstName` and `lastName`:

```scala
class Person(var firstName: String, var lastName: String)
```

Given that definition, you can create new `Person` instances like this:

```scala
val p = new Person("Bill", "Panner")
```

Defining parameters in a class constructor automatically creates fields in the class, and in this example you can access the `firstName` and `lastName` fields like this:

```scala
println(p.firstName + " " + p.lastName)
Bill Panner
```

In this example, because both fields are defined as `var` fields, they’re also mutable, meaning they can be changed. This is how you change them:

```scala
scala> p.firstName = "William"
p.firstName: String = William

scala> p.lastName = "Bernheim"
p.lastName: String = Bernheim
```

If you’re coming to Scala from Java, this Scala code:

```scala
class Person(var firstName: String, var lastName: String)
```

is roughly the equivalent of this Java code:

```java
public class Person {

    private String firstName;
    private String lastName;
    
    public Person(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    public String getFirstName() {
        return this.firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return this.lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
}
```



## `val` makes fields read-only

In that first example both fields were defined as `var` fields:

```scala
class Person(var firstName: String, var lastName: String)
```

That makes those fields mutable. You can also define them as `val` fields, which makes them immutable:

```scala
class Person(val firstName: String, val lastName: String)
             ---                    ---
```

If you now try to change the first or last name of a `Person` instance, you’ll see an error:

```scala
scala> p.firstName = "Fred"
<console>:12: error: reassignment to val
       p.firstName = "Fred"
                   ^

scala> p.lastName = "Jones"
<console>:12: error: reassignment to val
       p.lastName = "Jones"
                  ^
```

>Tip: If you use Scala to write OOP code, create your fields as `var` fields so you can mutate them. When you write FP code with Scala, you’ll generally use *case classes* instead of classes like this. (More on this later.)



## Class constructors

In Scala, the primary constructor of a class is a combination of:

- The constructor parameters
- Methods that are called in the body of the class
- Statements and expressions that are executed in the body of the class

Fields declared in the body of a Scala class are handled in a manner similar to Java; they’re assigned when the class is first instantiated.

This `Person` class demonstrates several of the things you can do inside the body of a class:

```scala
class Person(var firstName: String, var lastName: String) {

    println("the constructor begins")

    // 'public' access by default
    var age = 0

    // some class fields
    private val HOME = System.getProperty("user.home")

    // some methods
    override def toString(): String = s"$firstName $lastName is $age years old"

    def printHome(): Unit = println(s"HOME = $HOME")    
    def printFullName(): Unit = println(this) 

    printHome()
    printFullName()
    println("you've reached the end of the constructor")

}
```

This code in the Scala REPL demonstrates how this class works:

```scala
scala> val p = new Person("Kim", "Carnes")
the constructor begins
HOME = /Users/al
Kim Carnes is 0 years old
you've reached the end of the constructor
p: Person = Kim Carnes is 0 years old

scala> p.age
res0: Int = 0

scala> p.age = 36
p.age: Int = 36

scala> p
res1: Person = Kim Carnes is 36 years old

scala> p.printHome
HOME = /Users/al

scala> p.printFullName
Kim Carnes is 36 years old
```

When you come to Scala from a more verbose language this constructor approach might feel a little unusual at first, but once you understand and write a couple of classes with it, you’ll find it to be logical and convenient.



## Other Scala class examples

Before we move on, here are a few other examples of Scala classes:

```scala
class Pizza (var crustSize: Int, var crustType: String)

// a stock, like AAPL or GOOG
class Stock(var symbol: String, var price: BigDecimal)

// a network socket
class Socket(val timeout: Int, val linger: Int) {
    override def toString = s"timeout: $timeout, linger: $linger"
}

class Address (
    var street1: String,
    var street2: String,
    var city: String, 
    var state: String
)
```











