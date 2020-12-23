---
title: Creating a Method That Returns a Function
type: section
description: This page demonstrates how to create and use higher-order functions in Scala.
num: 33
previous-page: fun-write-map-function
next-page: fun-summary
---


Thanks to Scala’s consistency, writing a method that returns a function is similar to everything you’ve seen in the previous sections.
For example, imagine that you want to write a `greet` method that returns a function.
Once again we start with a problem statement:

> I want to create a `greet` method that returns a function.
> That function will take a string parameter and print it using `println`.
> To simplify this first example, `greet` won’t take any input parameters; it will just build a function and return it.

Given that statement, you can start building `greet`.
You know it’s going to be a method:

```scala
def greet()
```

You also know this method will return a function that (a) takes a `String` parameter, and (b) prints that string using `println`.
Therefore that function has the type, `String => Unit`:

```scala
def greet(): String => Unit = ???
           ----------------
```

Now you just need a method body.
You know that the method needs to return a function, and that function takes a `String` and prints it.
This anonymous function matches that description:

```scala
(name: String) => println(s"Hello, $name")
```

Now you just return that function from the method:

```scala
// a method that returns a function
def greet(): String => Unit = 
  (name: String) => println(s"Hello, $name")
```

Because this method returns a function, you get the function by calling `greet()`.
This is a good step to do in the REPL because it verifies the type of the new function:

````
scala> val greetFunction = greet()
val greetFunction: String => Unit = Lambda....
    -----------------------------
````

Now you can call `greetFunction`:

```scala
greetFunction("Joe")   // prints "Hello, Joe"
```

Congratulations, you just created a method that returns a function, and then executed that function.



## Improving the method

Our method would be more useful if you could pass in a greeting, so let’s do that.
All you have to do is pass the greeting in as a parameter to the `greet` method, and use it in the string inside `println`:

```scala
def greet(theGreeting: String): String => Unit = 
  (name: String) => println(s"$theGreeting, $name")
```

Now when you call your method, the process is more flexible because you can change the greeting.
This is what it looks like when you create a function from this method:

````
scala> val sayHello = greet("Hello")
val sayHello: String => Unit = Lambda.....
    ------------------------
````

The REPL type signature output shows that `sayHello` is a function that takes a `String` input parameter and returns `Unit` (nothing).
So now when you give `sayHello` a `String`, it prints the greeting:

```scala
sayHello("Joe")   // prints "Hello, Joe"
```

You can also change the greeting to create new functions, as desired:

```scala
val sayCiao = greet("Ciao")
val sayHola = greet("Hola")

sayCiao("Isabella")   // prints "Ciao, Isabella"
sayHola("Carlos")     // prints "Hola, Carlos"
```



## A more real-world example

This technique can be even more useful when your method returns one of many possible functions, like a factory that returns custom-built functions.

For instance, imagine that you want to write a method that returns functions that greet people in different languages.
We’ll limit this to functions that greet in English or French, depending on a parameter that’s passed into the method.

A first thing you know is that you want to create a method that (a) takes a “desired language” as an input, and (b) returns a function as its result.
Furthermore, because that function prints a string that it’s given, you know it has the type `String => Unit`.
With that information you write the method signature:

```scala
def createGreetingFunction(desiredLanguage: String): String => Unit = ???
```

Next, because you know that the possible functions you’ll return take a string and print it, you can write two anonymous functions for the English and French languages:

```scala
(name: String) => println(s"Hello, $name")
(name: String) => println(s"Bonjour, $name")
```

Inside a method it might be a little more readable if you give those anonymous functions some names, so let’s assign them to two variables:

```scala
val englishGreeting = (name: String) => println(s"Hello, $name")
val frenchGreeting = (name: String) => println(s"Bonjour, $name")
```

Now all you need to do is (a) return `englishGreeting` if the `desiredLanguage` is English, and (b) return `frenchGreeting` if the `desiredLanguage` is French.
One way to do that is with a `match` expression:

```scala
def createGreetingFunction(desiredLanguage: String): String => Unit =
  val englishGreeting = (name: String) => println(s"Hello, $name")
  val frenchGreeting = (name: String) => println(s"Bonjour, $name")
  desiredLanguage match
    case "english" => englishGreeting
    case "french" => frenchGreeting
```

And that’s the final method.
Notice that returning a function value from a method is no different than returning a string or integer value.

This is how `createGreetingFunction` builds a French-greeting function:

```scala
val greetInFrench = createGreetingFunction("french")
greetInFrench("Jonathan")   // prints "Bonjour, Jonathan"
```

And this is how it builds an English-greeting function:

```scala
val greetInEnglish = createGreetingFunction("english")
greetInEnglish("Joe")   // prints "Hello, Joe"
```

If you’re comfortable with that code---congratulations---you now know how to write methods that return functions.



