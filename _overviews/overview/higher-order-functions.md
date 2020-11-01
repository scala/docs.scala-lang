---
title: Higher-order Functions
description: This page demonstrates how to create and use higher-order functions in Scala.
---

<!-- 
TODO: This may still be too long for an Overview. I’ve been trying to condense it.
-->

A higher-order function is often defined as a function that (a) takes other functions as input parameters or (b) returns a function as a result. In Scala this is possible because functions are first-class values. While we use the term “higher-order function,” in Scala this phrase is used for both *methods* and *functions* because they can generally be used in the same places.

>The ability to pass functions around as values enables a form of “power” programming that lets you write code that’s concise and still readable.

In the examples so far you’ve seen how to be the *consumer* of functions that take other functions as input parameters, such as higher-order functions like `map` and `filter`. In this chapter you’ll see how to be the *creator* of higher-order functions, including:

- How to write methods that take functions as input parameters
- How to return a function from a method

In the process you’ll see:

- The syntax you use to define function input parameters
- Multiple examples of that syntax
- How to call a function once you have a reference to it

As a beneficial side effect of this chapter, once you’re comfortable with the syntax, you’ll use it to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions.



## Recap: Being a consumer of higher-order functions

As a quick recap, in this Overview you’ve already seen examples of how to use existing higher-order functions in the Scala collections classes, including `map` and `filter`:

```scala
List(1,2,3).map(_ * 10)       // List(10,20,30)

def isEven(i: Int) = i % 2 == 0
Vector(1,2,3,4).filter(isEven)   // Vector(2,4)
```

A few key points of the `filter` example are:

- `filter` accepts a function, anonymous function, or method as an input parameter.
- The functions you pass into `filter` must match the type signature that `filter` expects — in this example, a function that takes an `Int` input parameter and returns a `Boolean`.

>Although we use the term “function,” `filter` can accept a *method* as a parameter thanks to Scala’s [Eta Expansion](TODO:LINK) technology.


### Understanding `filter`’s Scaladoc

You can understand the type of functions `filter` accepts by looking at its Scaladoc. For example here’s the `filter` definition on the `List` class:

```scala
def filter(p: (A) => Boolean): List[A]
```

This states that `filter` is a method that takes a predicate parameter named `p` and returns a `List[A]`. (A *predicate* is just a function that returns a `Boolean` value.) Without looking at the internal details of `filter`, all we know is that it somehow uses that predicate to return a new list of the type `List[A]`, where `A` is the type in the list.

Digging a little deeper, this part of `filter`’s description:

```scala
p: (A) => Boolean
```

means that `filter` takes a function input parameter named `p`, and `p` must transform a generic input `A` into a `Boolean` value. Therefore, if a list holds the type `Int`, you can replace the generic type `A` with `Int`, and read that signature like this:

```scala
p: (Int) => Boolean
```

Because `isEven` has this type — it transforms an input `Int` into a resulting `Boolean` — it can be used with `filter`.


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



## Writing methods that take functions as parameters

>Note: To make the following sections more clear, we’ll refer to the code you’re writing as a *method*, and the code you’re accepting as an input parameter as a *function*.
<!-- TODO: A better way to state that? -->

Given that background, let’s start writing methods that take functions as input parameters.

To define a method that takes a function parameter, all you have to do is:

1. In your method’s parameter list, define the signature of the function you want to accept
2. Use that function inside your method

To demonstrate this, here’s a method that that takes an input parameter named `f`, where `f` is a function:

```scala
def sayHello(f: () => Unit): Unit = f()
```

This portion of the code — the *type signature* — defines the types of functions the `sayHello` method will accept:

```scala
f: () => Unit
```

Here’s how this works:

- `f` is the name of the function input parameter. It’s just like naming a `String` parameter `s`, or an `Int` parameter `i`.
- The type signature of `f` specifies the *type* of the functions this method will accept.
- The `()` portion of `f`’s signature (on the left side of the `=>` symbol) states that `f` takes no input parameters.
- The `Unit` portion of the signature (on the right side of the `=>` symbol) indicates that `f` should return nothing.
- Looking back at the body of the `sayHello` method, the `f()` statement there invokes the function that’s passed in.

Now that we’ve defined `sayHello`, let’s create a function to match `f`’s signature so we can test it. For instance, the following function takes no input parameters and returns nothing, so it matches `f`’s type signature:

```scala
def helloJoe(): Unit = println("Hello, Joe")
```

Because the type signatures match, you can pass `helloJoe` into `sayHello`:

```scala
sayHello(helloJoe)   // prints "Hello, Joe"
```

If you’ve never done this before, congratulations. You just defined a method named `sayHello` that takes another function as an input parameter, and then invokes that function when it’s called.


### sayHello can take many functions

It’s important to know that the beauty of this approach is not that `sayHello` can take *one* function as an input parameter; the beauty is that it can take *any* function that matches `f`’s signature. For instance, because this next function takes no input parameters and returns nothing, it also works with `sayHello`:

```scala
def bonjourJulien(): Unit = println("Bonjour, Julien")
```

Here it is in the REPL:

```scala
scala> sayHello(bonjourJulien)
Bonjour, Julien
```

This is a good start. The only thing to do now is see a few more examples of how to define different type signatures for function parameters.


### The general syntax for defining function input parameters

In this method:

```scala
def sayHello(f: () => Unit)
```

The type signature for `f` is:

```scala
f: () => Unit
```

We know that’s a function that takes no input parameters and returns nothing (given by `Unit`).

To demonstrate more type signature examples, here’s a function that takes a `String` parameter and returns an `Int`:

```scala
f: (String) => Int
```

That could be something like a string length or checksum function.

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
f: (Int, Int) => Int
```

Can you imagine what sort of functions match that signature?

The answer is that any function that takes two `Int` input parameters and returns an `Int` matches that signature, so all of these functions match that signature:

```scala
def add(a: Int, b: Int): Int = a + b
def subtract(a: Int, b: Int): Int = a - b
def multiply(a: Int, b: Int): Int = a * b
```

>Because functional programming is like combining a series of algebraic equations, it’s common to think about types a *lot*. You might say that you “think in types.”


### Taking a function parameter along with other parameters

So far the methods we’ve shown have only taken a function input parameter. But for a method like this to be really interesting, it must also have some data to work on. For a class like `List`, its `map` method already has data to work on: the data in the `List`. But for a standalone method that doesn’t have its own data, it should accept data as another input parameter.

For instance, here’s a method named `executeNTimes` that has two input parameters: a function, and an `Int`:

```scala
def executeNTimes(f: () => Unit, n: Int): Unit =
  for i <- 1 to n do f()
```

As the code shows, `executeNTimes` executes the `f` function `n` times. Because `f` returns `Unit`, `executeNTimes` also returns `Unit`. To test `executeNTimes`, define a method that matches `f`’s signature:

```scala
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

```scala
def executeAndPrint(f: (Int, Int) => Int, i: Int, j: Int): Unit =
  println(f(i, j))
```

Again, because methods like these match that type signature, they can be passed into `executeAndPrint`:

```scala
def sum(x: Int, y: Int) = x + y
def multiply(x: Int, y: Int) = x * y

executeAndPrint(sum, 3, 11)       // prints 14
executeAndPrint(multiply, 3, 9)   // prints 27
```


### Consistency in the use of function type signatures

One of the great things about Scala is the consistency of the language. In this case, this means that the syntax you use to define function input parameters is the same syntax you use to write anonymous functions and function variables.

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

The consistency in Scala is shown here, where this anonymous function type signature:

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

At this point you can now write your own methods that take function parameters. For instance, if the `List` class didn’t have its own `map` method, you could write your own.

A good first step for this is to accurately state the problem. Focusing only on a `List[Int]`, you state:

>I want to write a `map` method that can be used to apply other functions to each element in a `List[Int]` that it’s given, returning the transformed elements as a new list.

Given that statement, you start to write the method signature. First, you know that you want to accept a function as a parameter, and that function should transform an `Int` into some generic type `A`, so you start to write:

```scala
def map(f: (Int) => A
```

The syntax for using a generic type requires declaring that type symbol before the parameter list:

```scala
def map[A](f: (Int) => A
```

Next, you know that you also want to accept a `List[Int]`:

```scala
def map[A](f: (Int) => A, xs: List[Int]
```

You also know that `map` returns a transformed list of the generic type `A`:

```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] = ???
```

That takes care of the method signature. Now all you have to do is write the method body. A `map` method applies the function it’s given to every element in the list it’s given to produce a new, transformed list. One way to do this is with a `for` expression:

```scala
for x <- xs yield f(x)
```

Putting this together with the method signature, you now have a standalone `map` method that works with a `List[Int]`:

```scala
def map[A](f: (Int) => A, xs: List[Int]): List[A] =
  for x <- xs yield f(x)
```

As a bonus, because the method body doesn’t care about the type inside the `List`, you can replace `Int` in the type signature with a generic type parameter:

```scala
def map[A,B](f: (B) => A, xs: List[B]): List[A] =
  for x <- xs yield f(x)
```

Now you have a `map` method that works with any `List`.

These examples demonstrate that `map` works as desired:

```scala
def double(i : Int) = i * 2
map(double, List(1,2,3))   // List(2,4,6)

def strlen(s: String) = s.length
map(strlen, List("a", "bb", "ccc"))   // List(1, 2, 3)
```

Now that you’ve seen how to write methods that accept functions as parameters, let’s look at methods that return functions.


## Writing a method that returns a function

Thanks to Scala’s consistency, writing a method that returns a function is similar to everything you just saw. For instance, to define a “greeting” method that returns a function, start by defining an anonymous function:

```scala
(name: String) => println(s"Hello, $name")
```

This anonymous function takes a `String` input parameter and returns nothing, so it has this type:

```scala
String => Unit
```

Therefore, if you want to write a method that returns this function, first define the method signature:

```scala
def greet(): String => Unit = ???
```

Now you just need to add in the method body. In this case the method returns that anonymous function, so the complete method looks like this:

```scala
// a method that returns a function
def greet(): String => Unit = 
  (name: String) => println(s"Hello, $name")
```

Because that method returns a function, you first create your new function:

```scala
val greetFunction = greet()
```

When you put that line of code in the REPL, you see that it has the type `String => Unit`, as expected:

````
scala> val greetFunction = greet()
val greetFunction: String => Unit = Lambda....
    -----------------------------
````

Now you can call your new `greetFunction`:

```scala
greetFunction("Joe")   // prints "Hello, Joe"
```

Congratulations, you just created a method that returns a function, and then executed that function.


### Improving the method

That function would be more useful if you could pass in a greeting, so let’s do that. All you have to do is pass the greeting in as a parameter to the `greet` method, and use it in the string inside `println`:

```scala
def greet(theGreeting: String): String => Unit = 
  (name: String) => println(s"$theGreeting, $name")
```

Now when you call your method, the process is more flexible because you can change the greeting. Again, the first step of creating a function from the method is good to show in the REPL because it shows the resulting type:

````
scala> val sayHello = greet("Hello")
val sayHello: String => Unit = Lambda.....
    ------------------------
````

This shows that `sayHello` is a function that takes a `String` input parameter and returns `Unit` (nothing). So now when you give `sayHello` a `String`, it prints the greeting:

```scala
sayHello("Joe")   // prints "Hello, Joe"
```

You can also change the greeting and create a new function, as desired:

```scala
val sayHey = greet("Hey")
sayHey("Joe")   // prints "Hey, Joe"
```



### A more real-world example

In a more real-world example, a method like this is more useful when it can return one of many possible functions, like a factory that returns custom-built functions.

For instance, imagine that you want to write a method that returns functions that greet people in different languages. We’ll limit this to functions that greet in English or French, depending on a parameter that’s passed into the method.

A first thing you know is that you want to create a method that (a) takes a “desired language” as an input, and (b) returns a function as its result. Furthermore, because that function will print a string that it’s given, you know it has the type `String => Unit`. With that information you can start writing the method signature like this:

```scala
def createGreetingFunction(desiredLanguage: String): String => Unit = ???
```

That’s a good start. Because you know that the possible functions you’ll return take a string and print it, you can write two anonymous functions like this for the English and French languages:

```scala
(name: String) => println(s"Hello, $name")
(name: String) => println(s"Bonjour, $name")
```

Inside a method it might be a little more readable if you give those anonymous functions some names, so let’s write them like this instead:

```scala
val englishGreeting = (name: String) => println(s"Hello, $name")
val frenchGreeting = (name: String) => println(s"Bonjour, $name")
```

Now all you need to do is (a) return `englishGreeting` if the `desiredLanguage` is English, and (b) return `frenchGreeting` if the `desiredLanguage` is French. One way to do that is with a `match` expression:

```scala
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
greetInFrench("Raphael")   // prints "Bonjour, Raphael"
```

And this is how it builds an English-greeting function:

```scala
val greetInEnglish = createGreetingFunction("english")
greetInEnglish("Joe")   // prints "Hello, Joe"
```

If this all makes sense — congratulations — you’ve just seen how to write methods that return functions.



## Summary

A higher-order function is often defined as a function that takes other functions as input parameters or returns a function as a result. In Scala this is possible because functions are first-class values.

In previous chapters you saw how to be a *consumer* of higher-order functions, and this chapter showed you how to be a *creator* of higher-order functions. Specifically, you saw:

- How to write methods that take functions as input parameters
- How to return a function from a method

A beneficial side effect of this chapter is that you saw many examples of how to declare type signatures for functions. The benefits of that are that you’ll use that same syntax to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions like `map`, `filter`, and others.



