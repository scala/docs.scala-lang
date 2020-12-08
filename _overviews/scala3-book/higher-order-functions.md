---
title: Higher-Order Functions
description: This page demonstrates how to create and use higher-order functions in Scala.
num: 44
previous-page: eta-expansion
next-page: main-methods
---


A higher-order function is often defined as a function that (a) takes other functions as input parameters or (b) returns a function as a result. In Scala, higher-order functions are possible because functions are first-class values.

As an important point, while we use the common industry term “higher-order function,” in Scala this phrase applies to both *methods* and *functions* because — thanks to [Eta Expansion](TODO:link) — they can generally be used in the same places.


### From consumer to creator

So far, in the examples of this book you’ve seen how to be a *consumer* of methods that take other functions as input parameters, such as using higher-order functions like `map` and `filter`. In this chapter you’ll see how to be a *creator* of higher-order functions, including:

- How to write methods that take functions as input parameters
- How to return a function from a method

In the process you’ll see:

- The syntax you use to define function input parameters
- How to call a function once you have a reference to it

As a beneficial side effect of this chapter, once you’re comfortable with this syntax, you’ll use it to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions.



## Recap: Being a consumer of higher-order functions

As a quick recap, in this book you’ve already seen examples of how to use existing higher-order functions in the Scala collections classes, including `map` and `filter`:

```tut
List(1,2,3).map(_ * 10)       // List(10,20,30)

def isEven(i: Int) = i % 2 == 0
Vector(1,2,3,4).filter(isEven)   // Vector(2,4)
```

A few key points about these examples:

- The functions you pass into them must match their expected type signature
- They take a function, anonymous function, or method as an input parameter
- [Eta Expansion](TODO:link) is the technology that enables you to pass a method into a place where a function is expected


### Understanding `filter`’s Scaladoc

To understand how higher-order functions work, it helps to dig into an example. For instance, you can understand the type of functions `filter` accepts by looking at its Scaladoc. Here’s the `filter` definition in the `List` class:

```scala
def filter(p: (A) => Boolean): List[A]
```

This states that `filter` is a method that takes a function parameter named `p`. By convention, `p` stands for a *predicate*, which is just a function that returns a `Boolean` value. So `filter` takes `p` as an input parameter, and returns a `List[A]`, where `A` the type held in the list. If you call `filter` on a `List[Int]`, `A` is the type `Int`.

If you didn’t know how `filter` works, all you’d know is that it somehow uses the predicate to create and return the `List[A]`.

Digging into the function parameter, this part of `filter`’s description:

```scala
p: (A) => Boolean
```

means that whatever function you pass in must take the type `A` as an input parameter and return a `Boolean`. So if your list is a `List[Int]`, you can replace the generic type `A` with `Int`, and read that signature like this:

```scala
p: (Int) => Boolean
```

Because `isEven` has this type — it transforms an input `Int` into a resulting `Boolean` — it can be used with `filter`.


<!--
### A lot of functionality with a little code

The great thing about `filter` — and higher-order functions in general — is that they save you from writing a lot of custom code, typically custom `for` loops. For example, if `List` didn’t have a `filter` method, you’d have to write a custom method like this to do the same work:

```scala
// what you’d have to do if `filter` didn’t exist
def getEvens(list: List[Int]): List[Int] =
  val tmpArray = ArrayBuffer[Int]()
  for 
    i <- list
    if i % 2 == 0 
  do
    tmpArray += i

  // return this
  tmpArray.toList

val result = getEvens(aList)
```

Compare all of that imperative code to this equivalent functional code:

```scala
val result = list.filter(_ % 2 == 0)
```

As you can see, this is a great advantage of functional programming. The code is much more concise, and it’s also easier to comprehend.

In short, as they pertain to Scala’s collections classes, higher-order functions:

- Are generally a replacement for custom traversal algorithms (such as `for` expressions)
- Are easier to read than custom traversal algorithms
- Mostly eliminate the need to write (or read) custom traversal algorithms

As Martin Odersky wrote in his book, [Programming in Scala](https://www.amazon.com/Programming-Scala-Martin-Odersky/dp/098153161X/):

>“You can use functions within your code to factor out common control patterns, and you can take advantage of higher-order functions in the Scala library to reuse control patterns that are common across all programmers’ code.”
-->


## Writing methods that take functions as parameters

**Note:** To make the following sections more clear, we’ll refer to the code you’re writing as a *method*, and the code you’re accepting as an input parameter as a *function*.

Given that background, let’s start writing methods that take functions as input parameters.

To create a method that uses a function parameter, all you have to do is:

1. In your method’s parameter list, define the signature of the function you want to accept
2. Use that function inside your method

To demonstrate this, here’s a method that that takes an input parameter named `f`, where `f` is a function:

```tut
def sayHello(f: () => Unit): Unit = f()
```

This portion of the code — the *type signature* — states that `f` is a function, and defines the types of functions the `sayHello` method will accept:

```scala
f: () => Unit
```

Here’s how this works:

- `f` is the name of the function input parameter. It’s just like naming a `String` parameter `s`, or an `Int` parameter `i`.
- The type signature of `f` specifies the *type* of the functions this method will accept.
- The `()` portion of `f`’s signature (on the left side of the `=>` symbol) states that `f` takes no input parameters.
- The `Unit` portion of the signature (on the right side of the `=>` symbol) indicates that `f` should return nothing.
- Looking back at the body of the `sayHello` method (on the right side of the `=` symbol), the `f()` statement there invokes the function that’s passed in.

Now that we’ve defined `sayHello`, let’s create a function to match `f`’s signature so we can test it. The following function takes no input parameters and returns nothing, so it matches `f`’s type signature:

```tut
def helloJoe(): Unit = println("Hello, Joe")
```

Because the type signatures match, you can pass `helloJoe` into `sayHello`:

```scala
sayHello(helloJoe)   // prints "Hello, Joe"
```

If you’ve never done this before, congratulations. You just defined a method named `sayHello` that takes a function as an input parameter, and then invokes that function in its method body.


### sayHello can take many functions

It’s important to know that the beauty of this approach is not that `sayHello` can take *one* function as an input parameter; the beauty is that it can take *any* function that matches `f`’s signature. For instance, because this next function takes no input parameters and returns nothing, it also works with `sayHello`:

```tut
def bonjourJulien(): Unit = println("Bonjour, Julien")
```

Here it is in the REPL:

````
scala> sayHello(bonjourJulien)
Bonjour, Julien
````

This is a good start. The only thing to do now is see a few more examples of how to define different type signatures for function parameters.


### The general syntax for defining function input parameters

In this method:

```scala
def sayHello(f: () => Unit)
```

The type signature for `f` is:

```scala
() => Unit
```

We know that this means, “a function that takes no input parameters and returns nothing (given by `Unit`).”

To demonstrate more type signature examples, here’s a function that takes a `String` parameter and returns an `Int`:

```scala
f: (String) => Int
```

What kinds of functions take a string and return an integer? Functions like “string length” and checksum are two examples.

Similarly, this function takes two `Int` parameters and return an `Int`:

```scala
f: (Int, Int) => Int
```

As you can infer from these examples, the general syntax for defining function parameter type signatures is:

```scala
variableName: (parameterTypes ...) => returnType
```

Going back to this type signature:

```scala
(Int, Int) => Int
```

Can you imagine what sort of functions match that signature?

The answer is that any function that takes two `Int` input parameters and returns an `Int` matches that signature, so all of these functions are a match:

```tut
def add(a: Int, b: Int): Int = a + b
def subtract(a: Int, b: Int): Int = a - b
def multiply(a: Int, b: Int): Int = a * b
```

>Because functional programming is like creating and combining a series of algebraic equations, it’s common to think about types a *lot* when designing functions and applications. You might say that you “think in types.”


### Taking a function parameter along with other parameters

For higher-order functions to be really useful, they also need some data to work on. For a class like `List`, its `map` method already has data to work on: the data in the `List`. But for a standalone higher-order function that doesn’t have its own data, it should also accept data as other input parameters.

For instance, here’s a method named `executeNTimes` that has two input parameters: a function, and an `Int`:

```tut
def executeNTimes(f: () => Unit, n: Int): Unit =
  for i <- 1 to n do f()
```

As the code shows, `executeNTimes` executes the `f` function `n` times. Because a simple `for` loop like this has no return value, `executeNTimes` returns `Unit`. To test `executeNTimes`, define a method that matches `f`’s signature:

```tut
// a method of type `() => Unit`
def helloWorld(): Unit = println("Hello, world")
```

Then pass the method into `executeNTimes` along with an `Int`:

````
scala> executeNTimes(helloWorld, 3)
Hello, world
Hello, world
Hello, world
````

Excellent. The `executeNTimes` method executes the `helloWorld` function three times.

Your methods can continue to get as complicated as necessary. For example, this method takes a function of type `(Int, Int) => Int`, along with two input parameters:

```tut
def executeAndPrint(f: (Int, Int) => Int, i: Int, j: Int): Unit =
  println(f(i, j))
```

Because these `sum` and `multiply` methods match that type signature, they can be passed into `executeAndPrint`:

```scala
def sum(x: Int, y: Int) = x + y
def multiply(x: Int, y: Int) = x * y

executeAndPrint(sum, 3, 11)       // prints 14
executeAndPrint(multiply, 3, 9)   // prints 27
```


### Consistency in the use of function type signatures

Scala’s syntax is very consistent. In this case, this means that the syntax you use to define function input parameters is the same syntax you use to write anonymous functions and function variables.

For instance, if you were to write an anonymous function that calculates the sum of two integers, you’d write it like this:

```scala
(Int, Int) => Int = (a, b) => a + b
```

That code consists of the type signature:

````
(Int, Int) => Int = (a, b) => a + b
-----------------
````

The input parameters:

````
(Int, Int) => Int = (a, b) => a + b
                    ------
````

and the body of the function:

````
(Int, Int) => Int = (a, b) => a + b
                              -----
````

Scala’s consistency is shown here, where this anonymous function type signature:

````
(Int, Int) => Int = (a, b) => a + b
-----------------
````

is the same as the type signature you use to define a function input parameter:

````
def executeAndPrint(f: (Int, Int) => Int, ...
                       -----------------
````

Once you’re comfortable with this syntax, you’ll use it to define function parameters, anonymous functions, and function variables, and it becomes easier to read the Scaladoc for higher-order functions.


### How to write your own `map` method

Now that you’ve seen how to write your own higher-order functions, let’s take a quick look at a more real-world example.

Imagine for a moment that the `List` class doesn’t have its own `map` method, and you want to write your own.

A good first step when creating functions is to accurately state the problem. Focusing only on a `List[Int]`, you state:

>I want to write a `map` method that can be used to a function to each element in a `List[Int]` that it’s given, returning the transformed elements as a new list.

Given that statement, you start to write the method signature. First, you know that you want to accept a function as a parameter, and that function should transform an `Int` into some generic type `A`, so you write:

```scala
def map(f: (Int) => A
```

The syntax for using a generic type requires declaring that type symbol before the parameter list, so you add that:

```scala
def map[A](f: (Int) => A
```

Next, you know that `map` should also accept a `List[Int]`:

```scala
def map[A](f: (Int) => A, xs: List[Int])
```

Finally, you also know that `map` returns a transformed `List` that contains elements of the generic type `A`:

```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] = ???
```

That takes care of the method signature. Now all you have to do is write the method body. A `map` method applies the function it’s given to every element in the list it’s given to produce a new, transformed list. One way to do this is with a `for` expression:

```scala
for x <- xs yield f(x)
```

As with this example, `for` expressions often make code surprisingly simple, and that ends up being the entire method body.

Putting it together with the method signature, you now have a standalone `map` method that works with a `List[Int]`:

```tut
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for x <- xs yield f(x)
```

As a bonus, notice that the `for` expression doesn’t do anything that depends on the type inside the `List` being `Int`. Therefore, you can replace `Int` in the type signature with a generic type parameter:

```tut
def map[A,B](f: (B) => A, xs: List[B]): List[A] =
  for x <- xs yield f(x)
```

Now you have a `map` method that works with any `List`.

These examples demonstrate that `map` works as desired:

```scala
def double(i : Int) = i * 2
map(double, List(1,2,3))              // List(2,4,6)

def strlen(s: String) = s.length
map(strlen, List("a", "bb", "ccc"))   // List(1, 2, 3)
```

Now that you’ve seen how to write methods that accept functions as input parameters, let’s look at methods that return functions.


## Writing a method that returns a function

Thanks to Scala’s consistency, writing a method that returns a function is similar to everything you just saw. For example, imagine that you want to write a `greet` method that returns a function. The statement of what we want to build goes like this:

>I want to create a `greet` method that returns a function. That function will take a string parameter and print it using `println`. To simplify this first example, `greet` won’t take any input parameters; it will just build a function and return it.

Given that statement, you can start building `greet`. You know it’s going to be a method:

```scala
def greet()
```

You also know this method will return a function that (a) takes a `String` parameter and (b) prints that string using `println`. Therefore that function has the type, `String => Unit`:

```scala
def greet(): String => Unit = ???
           ----------------
```

Now you just need a method body. You know that the method needs to return a function, and that function takes a `String` and prints it. Therefore, this anonymous function should do:

```scala
(name: String) => println(s"Hello, $name")
```

Now you just return that function from the method:

```tut
// a method that returns a function
def greet(): String => Unit = 
  (name: String) => println(s"Hello, $name")
```

Because this method returns a function, you get the function by calling `greet()`. This is a good step to do in the REPL because it verifies the type of the new function:

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


### Improving the method

Our method would be more useful if you could pass in a greeting, so let’s do that. All you have to do is pass the greeting in as a parameter to the `greet` method, and use it in the string inside `println`:

```tut
def greet(theGreeting: String): String => Unit = 
  (name: String) => println(s"$theGreeting, $name")
```

Now when you call your method, the process is more flexible because you can change the greeting. This is what it looks like when you create a function from this method:

````
scala> val sayHello = greet("Hello")
val sayHello: String => Unit = Lambda.....
    ------------------------
````

The REPL type signature output shows that `sayHello` is a function that takes a `String` input parameter and returns `Unit` (nothing). So now when you give `sayHello` a `String`, it prints the greeting:

```scala
sayHello("Joe")   // prints "Hello, Joe"
```

You can also change the greeting and create a new function, as desired:

```scala
val sayHey = greet("Hey")
sayHey("Joe")   // prints "Hey, Joe"
```



### A more real-world example

This technique can be even more useful when your method returns one of many possible functions, like a factory that returns custom-built functions.

For instance, imagine that you want to write a method that returns functions that greet people in different languages. We’ll limit this to functions that greet in English or French, depending on a parameter that’s passed into the method.

A first thing you know is that you want to create a method that (a) takes a “desired language” as an input, and (b) returns a function as its result. Furthermore, because that function prints a string that it’s given, you know it has the type `String => Unit`. With that information you write the method signature:

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

Now all you need to do is (a) return `englishGreeting` if the `desiredLanguage` is English, and (b) return `frenchGreeting` if the `desiredLanguage` is French. One way to do that is with a `match` expression:

```tut
def createGreetingFunction(desiredLanguage: String): String => Unit =
  val englishGreeting = (name: String) => println(s"Hello, $name")
  val frenchGreeting = (name: String) => println(s"Bonjour, $name")
  desiredLanguage match
    case "english" => englishGreeting
    case "french" => frenchGreeting
```

And that’s the final method. Notice that returning a function value from a method is no different than returning a string or integer value.

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

If you’re comfortable with that code — congratulations — you now know how to write methods that return functions.



## Key points

That was a lengthy chapter, so let’s review it.

A higher-order function is often defined as a function that takes other functions as input parameters or returns a function as its value. In Scala this is possible because functions are first-class values.

In previous chapters you saw how to be a *consumer* of higher-order functions, and this chapter showed you how to be a *creator* of higher-order functions. Specifically, you saw:

- How to write methods that take functions as input parameters
- How to return a function from a method

A beneficial side effect of this chapter is that you saw many examples of how to declare type signatures for functions. The benefits of that are that you use that same syntax to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions like `map`, `filter`, and others.


