---
type: section
layout: multipage-overview
title: Companion Objects
description: This lesson provides an introduction to 'companion objects' in Scala, including writing 'apply' and 'unapply' methods.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 48
outof: 54
previous-page: no-null-values
next-page: case-classes
---



A *companion object* in Scala is an `object` that’s declared in the same file as a `class`, and has the same name as the class. For instance, when the following code is saved in a file named *Pizza.scala*, the `Pizza` object is considered to be a companion object to the `Pizza` class:

```scala
class Pizza {
}

object Pizza {
}
```

This has several benefits. First, a companion object and its class can access each other’s private members (fields and methods). This means that the `printFilename` method in this class will work because it can access the `HiddenFilename` field in its companion object:

```scala
class SomeClass {
    def printFilename() = {
        println(SomeClass.HiddenFilename)
    }
}

object SomeClass {
    private val HiddenFilename = "/tmp/foo.bar"
}
```

A companion object offers much more functionality than this, and we’ll demonstrate a few of its most important features in the rest of this lesson.



## Creating new instances without the `new` keyword

You probably noticed in some examples in this book that you can create new instances of certain classes without having to use the `new` keyword before the class name, as in this example:

```scala
val zenMasters = List(
    Person("Nansen"),
    Person("Joshu")
)
```

This functionality comes from the use of companion objects. What happens is that when you define an `apply` method in a companion object, it has a special meaning to the Scala compiler. There’s a little syntactic sugar baked into Scala that lets you type this code:

```scala
val p = Person("Fred Flinstone")
```

and during the compilation process the compiler turns that code into this code:

```scala
val p = Person.apply("Fred Flinstone")
```

The `apply` method in the companion object acts as a [Factory Method](https://en.wikipedia.org/wiki/Factory_method_pattern), and Scala’s syntactic sugar lets you use the syntax shown, creating new class instances without using the `new` keyword.


### Enabling that functionality

To demonstrate how this feature works, here’s a class named `Person` along with an `apply` method in its companion object:

```scala
class Person {
    var name = ""
}

object Person {
    def apply(name: String): Person = {
        var p = new Person
        p.name = name
        p
    }
}
```

To test this code, paste both the class and the object in the Scala REPL at the same time using this technique:

- Start the Scala REPL from your command line (with the `scala` command)
- Type `:paste` and press the [Enter] key
- The REPL should respond with this text:

```scala
// Entering paste mode (ctrl-D to finish)
```

- Now paste both the class and object into the REPL at the same time
- Press Ctrl-D to finish the “paste” process

When that process works you should see this output in the REPL:

````
defined class Person
defined object Person
````

>The REPL requires that a class and its companion object be entered at the same time with this technique.

Now you can create a new instance of the `Person` class like this:

```scala
val p = Person.apply("Fred Flinstone")
```

That code directly calls `apply` in the companion object. More importantly, you can also create a new instance like this:

```scala
val p = Person("Fred Flinstone")
```

and this:

```scala
val zenMasters = List(
    Person("Nansen"),
    Person("Joshu")
)
```

To be clear, what happens in this process is:

- You type something like `val p = Person("Fred")`
- The Scala compiler sees that there is no `new` keyword before `Person`
- The compiler looks for an `apply` method in the companion object of the `Person` class that matches the type signature you entered
- If it finds an `apply` method, it uses it; if it doesn’t, you get a compiler error


### Creating multiple constructors

You can create multiple `apply` methods in a companion object to provide multiple constructors. The following code shows how to create both one- and two-argument constructors. Because we introduced `Option` values in the previous lesson, this example also shows how to use `Option` in a situation like this:

```scala
class Person {
    var name: Option[String] = None
    var age: Option[Int] = None
    override def toString = s"$name, $age"
}

object Person {

    // a one-arg constructor
    def apply(name: Option[String]): Person = {
        var p = new Person
        p.name = name
        p
    }

    // a two-arg constructor
    def apply(name: Option[String], age: Option[Int]): Person = {
        var p = new Person
        p.name = name
        p.age = age
        p
    }

}
```

If you paste that code into the REPL as before, you’ll see that you can create new `Person` instances like this:

```scala
val p1 = Person(Some("Fred"))
val p2 = Person(None)

val p3 = Person(Some("Wilma"), Some(33))
val p4 = Person(Some("Wilma"), None)
```

When you print those values you’ll see these results:

```scala
val p1: Person = Some(Fred), None
val p2: Person = None, None
val p3: Person = Some(Wilma), Some(33)
val p4: Person = Some(Wilma), None
```

>When running tests like this, it’s best to clear the REPL’s memory. To do this, use the `:reset` command inside the REPL before using the `:paste` command.



## Adding an `unapply` method

Just as adding an `apply` method in a companion object lets you *construct* new object instances, adding an `unapply` lets you *de-construct* object instances. We’ll demonstrate this with an example.

Here’s a different version of a `Person` class and a companion object:

```scala
class Person(var name: String, var age: Int)

object Person {
    def unapply(p: Person): String = s"${p.name}, ${p.age}"
}
```

Notice that the companion object defines an `unapply` method. That method takes an input parameter of the type `Person`, and returns a `String`. To test the `unapply` method manually, first create a new `Person` instance:

```scala
val p = new Person("Lori", 29)
```

Then test `unapply` like this:

```scala
val result = Person.unapply(p)
```

This is what the `unapply` result looks like in the REPL:

````
scala> val result = Person.unapply(p)
result: String = Lori, 29
````

As shown, `unapply` de-constructs the `Person` instance it’s given. In Scala, when you put an `unapply` method in a companion object, it’s said that you’ve created an *extractor* method, because you’ve created a way to extract the fields out of the object.


### `unapply` can return different types

In that example `unapply` returns a `String`, but you can write it to return anything. Here’s an example that returns the two fields in a tuple:

```scala
class Person(var name: String, var age: Int)

object Person {
    def unapply(p: Person): Tuple2[String, Int] = (p.name, p.age)
}
```

Here’s what that method looks like in the REPL:

```scala
scala> val result = Person.unapply(p)
result: (String, Int) = (Lori,29)
```

Because this `unapply` method returns the class fields as a tuple, you can also do this:

```scala
scala> val (name, age) = Person.unapply(p)
name: String = Lori
age: Int = 29
```


### `unapply` extractors in the real world

A benefit of using `unapply` to create an extractor is that if you follow the proper Scala conventions, they enable a convenient form of pattern-matching in match expressions.

We’ll discuss that more in the next lesson, but as you’ll see, the story gets even better: You rarely need to write an `unapply` method yourself. Instead, what happens is that you get `apply` and `unapply` methods for free when you create your classes as *case classes* rather than as the “regular” Scala classes you’ve seen so far. We’ll dive into case classes in the next lesson.



## Key points

The key points of this lesson are:

- A *companion object* is an `object` that’s declared in the same file as a `class`, and has the same name as the class
- A companion object and its class can access each other’s private members
- A companion object’s `apply` method lets you create new instances of a class without using the `new` keyword
- A companion object’s `unapply` method lets you de-construct an instance of a class into its individual components










