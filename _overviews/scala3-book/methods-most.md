---
title: Method Features
type: section
description: This section introduces Scala 3 methods, including main methods, extension methods, and more.
num: 24
previous-page: methods-intro
next-page: methods-main-methods
---

This section introduces the various aspects of how to define and call methods in Scala 2.

## Defining Methods

Scala methods have many features, including these:

- Generic (type) parameters
- Automatically provided `using` parameters
- Default parameter values
- Multiple parameter groups
- By-name parameters
- ...

Some of these features are demonstrated in this section, but when you’re defining a “simple” method that doesn’t use those features, the syntax looks like this:

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
end methodName   // this is optional
```

In that syntax:

- The keyword `def` is used to define a method
- The Scala standard is to name methods using the camel case convention
- Method parameters are always defined with their type
- Declaring the method return type is optional
- Methods can consist of many lines, or just one line
- Providing the `end methodName` portion after the method body is also optional, and is only recommended for long methods

Here are two examples of a one-line method named `add` that takes two `Int` input parameters.
The first version explicitly shows the method’s `Int` return type, and the second does not:

```scala
def add(a: Int, b: Int): Int = a + b
def add(a: Int, b: Int) = a + b
```

It is recommended to annotate publicly visible methods with their return type.
Declaring the return type can make it easier to understand it when you look at it months or years later, or when you look at another person’s code.



## Calling methods

Invoking a method is straightforward:

```scala
val x = add(1, 2)   // 3
```

The Scala collections classes have dozens of built-in methods.
These examples show how to call them:

```scala
val x = List(1,2,3)

x.size          // 3
x.contains(1)   // true
x.map(_ * 10)   // List(10, 20, 30)
```

Notice:

- `size` takes no arguments, and returns the number of elements in the list
- The `contains` method takes one argument, the value to search for
- `map` takes one argument, a function; in this case an anonymous function is passed into it



## Multiline methods

When a method is longer than one line, start the method body on the second line, indented to the right:

```scala
def addThenDouble(a: Int, b: Int): Int =
  // imagine that this body requires multiple lines
  val sum = a + b
  sum * 2
```

In that method:

- `sum` is an immutable local variable; it can’t be accessed outside of the method
- The last line doubles the value of `sum`; this value is returned from the method

When you paste that code into the REPL, you’ll see that it works as desired:

```scala
scala> addThenDouble(1, 1)
res0: Int = 4
```

Notice that there’s no need for a `return` statement at the end of the method.
Because almost everything in Scala is an _expression_---meaning that each line of code returns (or _evaluates to) a value---there’s no need to use `return`.

This becomes more clear when you condense that method and write it on one line:

```scala
def addThenDouble(a: Int, b: Int): Int = (a + b) * 2
```

The body of a method can use all the different features of the language:

- `if`/`else` expressions
- `match` expressions
- `while` loops
- `for` loops and `for` expressions
- Variable assignments
- Calls to other methods

As an example of a real-world multiline method, this `getStackTraceAsString` method converts its `Throwable` input parameter into a well-formatted `String`:

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = StringWriter()
  t.printStackTrace(PrintWriter(sw))
  sw.toString
```

In that method:

- The first line assigns a new instance of `StringWriter` to the value binder `sw`
- The second line stores the stack trace content into the `StringWriter`
- The third line yields the `String` representation of the stack trace


## Default parameter values

Method parameters can have default values.
In this example, default values are given for both the `timeout` and `protocol` parameters:

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // more code here ...
```

Because the parameters have default values, the method can be called in these ways:

```scala
makeConnection()                 // timeout = 5000, protocol = http
makeConnection(2_000)            // timeout = 2000, protocol = http
makeConnection(3_000, "https")   // timeout = 3000, protocol = https
```

Here are a few key points about those examples:

- In the first example no arguments are provided, so the method uses the default parameter values of `5_000` and `http`
- In the second example, `2_000` is supplied for the `timeout` value, so it’s used, along with the default value for the `protocol`
- In the third example, values are provided for both parameters, so they’re both used

Notice that by using default parameter values, it appears to the consumer that they can use three different overridden methods.



## Named parameters

If you prefer, you can also use the names of the method parameters when calling a method.
For instance, `makeConnection` can also be called in these ways:

```scala
makeConnection(timeout=10_000)
makeConnection(protocol="https")
makeConnection(timeout=10_000, protocol="https")
makeConnection(protocol="https", timeout=10_000)
```

In some frameworks named parameters are heavily used.
They’re also very useful when multiple method parameters have the same type:

```scala
engage(true, true, true, false)
```

Without help from an IDE that code can be hard to read, but this code is much more clear and obvious:

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```



## A suggestion about methods that take no parameters

When a method takes no parameters, it’s said to have an _arity_ level of _arity-0_.
Similarly, when a method takes one parameter it’s an _arity-1_ method.
When you create arity-0 methods:

- If the method has side effects, such as calling `println`, declare the method with empty parentheses
- If the method does not have side effects---such as getting the size of a collection, which is similar to accessing a field on the collection---leave the parentheses off

For example, this method has a side effect, so it’s declared with empty parentheses:

```scala
def speak() = println("hi")
```

Doing this requires callers of the method to use open parentheses when calling the method:

```scala
speak     // error: "method speak must be called with () argument"
speak()   // prints "hi"
```

While this is just a convention, following it dramatically improves code readability: It makes it easier to understand at a glance that an arity-0 method has side effects.

{% comment %}
Some of that wording comes from this page: https://docs.scala-lang.org/style/method-invocation.html
{% endcomment %}



## Using `if` as a method body

Because `if`/`else` expressions return a value, they can be used as the body of a method.
Here’s a method named `isTruthy` that implements the Perl definitions of `true` and `false`:

```scala
def isTruthy(a: Any) =
  if a == 0 || a == ""
    false
  else
    true
```

These examples show how that method works:

```scala
isTruthy(0)      // false
isTruthy("")     // false
isTruthy("hi")   // true
isTruthy(1.0)    // true
```



## Using `match` as a method body

A `match` expression can also be used as the entire method body, and often is.
Here’s another version of `isTruthy`, written with a `match` expression :

```scala
def isTruthy(a: Any) = a match
  case 0 | "" => false
  case _ => true
```

This method works just like the previous method that used an `if`/`else` expression.



## Controlling visibility in classes

In classes, objects, traits, and enums, Scala methods are public by default, so the `Dog` instance created here can access the `speak` method:

```scala
class Dog:
  def speak() = println("Woof")

val d = new Dog
d.speak()   // prints "Woof"
```

Methods can also be marked as `private`.
This makes them private to the current class, and they can’t be overridden in subclasses:

```scala
class Animal:
  private def breathe() = println("I’m breathing")

class Cat extends Animal:
  // this method won’t compile
  override def breathe() = println("Yo, I’m totally breathing")
```

If you want to make a method private to the current class and also allow subclasses to override it, mark the method as `protected`, as shown with the `speak` method in this example:

```scala
class Animal:
  private def breathe() = println("I’m breathing")
  def walk() =
    breathe()
    println("I’m walking")
  protected def speak() = println("Hello?")

class Cat extends Animal:
  override def speak() = println("Meow")

val cat = new Cat
cat.walk()
cat.speak()
cat.breathe()   // won’t compile because it’s private
```

The `protected` setting means:

- The method (or field) can be accessed by other instances of the same class
- It is not visible by other code in the current package
- It is available to subclasses


## Objects can contain methods

Earlier you saw that traits and classes can have methods.
The Scala `object` keyword is used to create a singleton class, and an object can also contain methods.
This is a nice way to group a set of “utility” methods.
For instance, this object contains a collection of methods that work on strings:

```scala
object StringUtils:

  /**
   * Returns a string that is the same as the input string, but
   * truncated to the specified length.
   */
  def truncate(s: String, length: Int): String = s.take(length)

  /**
    * Returns true if the string contains only letters and numbers.
    */
  def lettersAndNumbersOnly_?(s: String): Boolean =
    s.matches("[a-zA-Z0-9]+")

  /**
   * Returns true if the given string contains any whitespace
   * at all. Assumes that `s` is not null.
   */
  def containsWhitespace(s: String): Boolean =
    s.matches(".*\\s.*")

end StringUtils
```



## Extension methods

Extension methods are discussed in the [Extension methods section][extension] of the Contextual Abstraction chapter.
Their main purpose is to let you add new functionality to closed classes.
As shown in that section, imagine that you have a `Circle` class, but you can’t change its source code.
For instance, it may be defined like this in a third-party library:

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

When you want to add methods to this class, you can define them as extension methods, like this:

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

Now when you have a `Circle` instance named `aCircle`, you can call those methods like this:

```scala
aCircle.circumference
aCircle.diameter
aCircle.area
```

See the [Extension methods section][reference_extension_methods] of this book, and the [“Extension methods” Reference page][reference] for more details.



## Even more

There’s even more to know about methods, including how to:

- Call methods on superclasses
- Define and use by-name parameters
- Write a method that takes a function parameter
- Create inline methods
- Handle exceptions
- Use vararg input parameters
- Write methods that have multiple parameter groups (partially-applied functions)
- Create methods that have generic type parameters

See the [Reference documentation][reference] for more details on these features.



[extension]: {% link _overviews/scala3-book/ca-extension-methods.md %}
[reference_extension_methods]: {{ site.scala3ref }}/contextual/extension-methods.html
[reference]: {{ site.scala3ref }}/overview.html
