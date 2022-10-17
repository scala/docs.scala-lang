---
title: Method Features
type: section
description: This section introduces Scala 3 methods, including main methods, extension methods, and more.
languages: [zh-cn]
num: 24
previous-page: methods-intro
next-page: methods-main-methods
---

This section introduces the various aspects of how to define and call methods in Scala 3.

## Defining Methods

Scala methods have many features, including these:

- Generic (type) parameters
- Default parameter values
- Multiple parameter groups
- Context-provided parameters
- By-name parameters
- ...

Some of these features are demonstrated in this section, but when you’re defining a “simple” method that doesn’t use those features, the syntax looks like this:

{% tabs method_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_1 %}

```scala
def methodName(param1: Type1, param2: Type2): ReturnType = {
  // the method body
  // goes here
}
```

{% endtab %}

{% tab 'Scala 3' for=method_1 %}

```scala
def methodName(param1: Type1, param2: Type2): ReturnType =
  // the method body
  // goes here
end methodName   // this is optional
```

{% endtab %}
{% endtabs %}

In that syntax:

- The keyword `def` is used to define a method
- The Scala standard is to name methods using the camel case convention
- Method parameters are always defined with their type
- Declaring the method return type is optional
- Methods can consist of many lines, or just one line
- Providing the `end methodName` portion after the method body is also optional, and is only recommended for long methods

Here are two examples of a one-line method named `add` that takes two `Int` input parameters.
The first version explicitly shows the method’s `Int` return type, and the second does not:

{% tabs method_2 %}
{% tab 'Scala 2 and 3' for=method_2 %}

```scala
def add(a: Int, b: Int): Int = a + b
def add(a: Int, b: Int) = a + b
```

{% endtab %}
{% endtabs %}

It is recommended to annotate publicly visible methods with their return type.
Declaring the return type can make it easier to understand it when you look at it months or years later, or when you look at another person’s code.

## Calling methods

Invoking a method is straightforward:

{% tabs method_3 %}
{% tab 'Scala 2 and 3' for=method_3 %}

```scala
val x = add(1, 2)   // 3
```

{% endtab %}
{% endtabs %}

The Scala collections classes have dozens of built-in methods.
These examples show how to call them:

{% tabs method_4 %}
{% tab 'Scala 2 and 3' for=method_4 %}

```scala
val x = List(1, 2, 3)

x.size          // 3
x.contains(1)   // true
x.map(_ * 10)   // List(10, 20, 30)
```

{% endtab %}
{% endtabs %}

Notice:

- `size` takes no arguments, and returns the number of elements in the list
- The `contains` method takes one argument, the value to search for
- `map` takes one argument, a function; in this case an anonymous function is passed into it

## Multiline methods

When a method is longer than one line, start the method body on the second line, indented to the right:

{% tabs method_5 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_5 %}

```scala
def addThenDouble(a: Int, b: Int): Int = {
  // imagine that this body requires multiple lines
  val sum = a + b
  sum * 2
}
```

{% endtab %}

{% tab 'Scala 3' for=method_5 %}

```scala
def addThenDouble(a: Int, b: Int): Int =
  // imagine that this body requires multiple lines
  val sum = a + b
  sum * 2
```

{% endtab %}
{% endtabs %}

In that method:

- `sum` is an immutable local variable; it can’t be accessed outside of the method
- The last line doubles the value of `sum`; this value is returned from the method

When you paste that code into the REPL, you’ll see that it works as desired:

{% tabs method_6 %}
{% tab 'Scala 2 and 3' for=method_6 %}

```scala
scala> addThenDouble(1, 1)
res0: Int = 4
```

{% endtab %}
{% endtabs %}

Notice that there’s no need for a `return` statement at the end of the method.
Because almost everything in Scala is an _expression_---meaning that each line of code returns (or _evaluates to_) a value---there’s no need to use `return`.

This becomes more clear when you condense that method and write it on one line:

{% tabs method_7 %}
{% tab 'Scala 2 and 3' for=method_7 %}

```scala
def addThenDouble(a: Int, b: Int): Int = (a + b) * 2
```

{% endtab %}
{% endtabs %}

The body of a method can use all the different features of the language:

- `if`/`else` expressions
- `match` expressions
- `while` loops
- `for` loops and `for` expressions
- Variable assignments
- Calls to other methods
- Definitions of other methods

As an example of a real-world multiline method, this `getStackTraceAsString` method converts its `Throwable` input parameter into a well-formatted `String`:

{% tabs method_8 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_8 %}

```scala
def getStackTraceAsString(t: Throwable): String = {
  val sw = StringWriter()
  t.printStackTrace(new PrintWriter(sw))
  sw.toString
}
```

{% endtab %}

{% tab 'Scala 3' for=method_8 %}

```scala
def getStackTraceAsString(t: Throwable): String =
  val sw = StringWriter()
  t.printStackTrace(PrintWriter(sw))
  sw.toString
```

{% endtab %}
{% endtabs %}

In that method:

- The first line assigns a new instance of `StringWriter` to the value binder `sw`
- The second line stores the stack trace content into the `StringWriter`
- The third line yields the `String` representation of the stack trace

## Default parameter values

Method parameters can have default values.
In this example, default values are given for both the `timeout` and `protocol` parameters:

{% tabs method_9 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_9 %}

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") = {
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // more code here ...
}
```

{% endtab %}

{% tab 'Scala 3' for=method_9 %}

```scala
def makeConnection(timeout: Int = 5_000, protocol: String = "http") =
  println(f"timeout = ${timeout}%d, protocol = ${protocol}%s")
  // more code here ...
```

{% endtab %}
{% endtabs %}

Because the parameters have default values, the method can be called in these ways:

{% tabs method_10 %}
{% tab 'Scala 2 and 3' for=method_10 %}

```scala
makeConnection()                 // timeout = 5000, protocol = http
makeConnection(2_000)            // timeout = 2000, protocol = http
makeConnection(3_000, "https")   // timeout = 3000, protocol = https
```

{% endtab %}
{% endtabs %}

Here are a few key points about those examples:

- In the first example no arguments are provided, so the method uses the default parameter values of `5_000` and `http`
- In the second example, `2_000` is supplied for the `timeout` value, so it’s used, along with the default value for the `protocol`
- In the third example, values are provided for both parameters, so they’re both used

Notice that by using default parameter values, it appears to the consumer that they can use three different overridden methods.

## Named parameters

If you prefer, you can also use the names of the method parameters when calling a method.
For instance, `makeConnection` can also be called in these ways:

{% tabs method_11 %}
{% tab 'Scala 2 and 3' for=method_11 %}

```scala
makeConnection(timeout=10_000)
makeConnection(protocol="https")
makeConnection(timeout=10_000, protocol="https")
makeConnection(protocol="https", timeout=10_000)
```

{% endtab %}
{% endtabs %}

In some frameworks named parameters are heavily used.
They’re also very useful when multiple method parameters have the same type:

{% tabs method_12 %}
{% tab 'Scala 2 and 3' for=method_12 %}

```scala
engage(true, true, true, false)
```

{% endtab %}
{% endtabs %}

Without help from an IDE that code can be hard to read, but this code is much more clear and obvious:

{% tabs method_13 %}
{% tab 'Scala 2 and 3' for=method_13 %}

```scala
engage(
  speedIsSet = true,
  directionIsSet = true,
  picardSaidMakeItSo = true,
  turnedOffParkingBrake = false
)
```

{% endtab %}
{% endtabs %}

## A suggestion about methods that take no parameters

When a method takes no parameters, it’s said to have an _arity_ level of _arity-0_.
Similarly, when a method takes one parameter it’s an _arity-1_ method.
When you create arity-0 methods:

- If the method performs side effects, such as calling `println`, declare the method with empty parentheses
- If the method does not perform side effects---such as getting the size of a collection, which is similar to accessing a field on the collection---leave the parentheses off

For example, this method performs a side effect, so it’s declared with empty parentheses:

{% tabs method_14 %}
{% tab 'Scala 2 and 3' for=method_14 %}

```scala
def speak() = println("hi")
```

{% endtab %}
{% endtabs %}

Doing this requires callers of the method to use open parentheses when calling the method:

{% tabs method_15 %}
{% tab 'Scala 2 and 3' for=method_15 %}

```scala
speak     // error: "method speak must be called with () argument"
speak()   // prints "hi"
```

{% endtab %}
{% endtabs %}

While this is just a convention, following it dramatically improves code readability: It makes it easier to understand at a glance that an arity-0 method performs side effects.

{% comment %}
Some of that wording comes from this page: https://docs.scala-lang.org/style/method-invocation.html
{% endcomment %}

## Using `if` as a method body

Because `if`/`else` expressions return a value, they can be used as the body of a method.
Here’s a method named `isTruthy` that implements the Perl definitions of `true` and `false`:

{% tabs method_16 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_16 %}

```scala
def isTruthy(a: Any) = {
  if (a == 0 || a == "" || a == false)
    false
  else
    true
}
```

{% endtab %}

{% tab 'Scala 3' for=method_16 %}

```scala
def isTruthy(a: Any) =
  if a == 0 || a == "" || a == false then
    false
  else
    true
```

{% endtab %}
{% endtabs %}

These examples show how that method works:

{% tabs method_17 %}
{% tab 'Scala 2 and 3' for=method_17 %}

```scala
isTruthy(0)      // false
isTruthy("")     // false
isTruthy("hi")   // true
isTruthy(1.0)    // true
```

{% endtab %}
{% endtabs %}

## Using `match` as a method body

A `match` expression can also be used as the entire method body, and often is.
Here’s another version of `isTruthy`, written with a `match` expression :

{% tabs method_18 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_18 %}

```scala
def isTruthy(a: Matchable) = a match {
  case 0 | "" | false => false
  case _ => true
}
```

{% endtab %}

{% tab 'Scala 3' for=method_18 %}

```scala
def isTruthy(a: Matchable) = a match
  case 0 | "" | false => false
  case _ => true
```

{% endtab %}
{% endtabs %}

This method works just like the previous method that used an `if`/`else` expression. We use `Matchable` instead of `Any` as the parameter's type to accept any value that supports pattern matching.

For more details on the `Matchable` trait, see the [Reference documentation][reference_matchable].

## Controlling visibility in classes

In classes, objects, traits, and enums, Scala methods are public by default, so the `Dog` instance created here can access the `speak` method:

{% tabs method_19 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_19 %}

```scala
class Dog {
  def speak() = println("Woof")
}

val d = new Dog
d.speak()   // prints "Woof"
```

{% endtab %}

{% tab 'Scala 3' for=method_19 %}

```scala
class Dog:
  def speak() = println("Woof")

val d = new Dog
d.speak()   // prints "Woof"
```

{% endtab %}
{% endtabs %}

Methods can also be marked as `private`.
This makes them private to the current class, so they can’t be called nor overridden in subclasses:

{% tabs method_20 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_20 %}
```scala
class Animal {
  private def breathe() = println("I’m breathing")
}

class Cat extends Animal {
  // this method won’t compile
  override def breathe() = println("Yo, I’m totally breathing")
}
```

{% endtab %}

{% tab 'Scala 3' for=method_20 %}

```scala
class Animal:
  private def breathe() = println("I’m breathing")

class Cat extends Animal:
  // this method won’t compile
  override def breathe() = println("Yo, I’m totally breathing")
```

{% endtab %}
{% endtabs %}

If you want to make a method private to the current class and also allow subclasses to call it or override it, mark the method as `protected`, as shown with the `speak` method in this example:

{% tabs method_21 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_21 %}

```scala
class Animal {
  private def breathe() = println("I’m breathing")
  def walk() = {
    breathe()
    println("I’m walking")
  }
  protected def speak() = println("Hello?")
}

class Cat extends Animal {
  override def speak() = println("Meow")
}

val cat = new Cat
cat.walk()
cat.speak()
cat.breathe()   // won’t compile because it’s private
```

{% endtab %}

{% tab 'Scala 3' for=method_21 %}

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

{% endtab %}
{% endtabs %}

The `protected` setting means:

- The method (or field) can be accessed by other instances of the same class
- It is not visible by other code in the current package
- It is available to subclasses

## Objects can contain methods

Earlier you saw that traits and classes can have methods.
The Scala `object` keyword is used to create a singleton class, and an object can also contain methods.
This is a nice way to group a set of “utility” methods.
For instance, this object contains a collection of methods that work on strings:

{% tabs method_22 class=tabs-scala-version %}
{% tab 'Scala 2' for=method_22 %}

```scala
object StringUtils {

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

}
```

{% endtab %}

{% tab 'Scala 3' for=method_22 %}

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

{% endtab %}
{% endtabs %}

## Extension methods

Extension methods are discussed in the [Extension methods section][extension] of the Contextual Abstraction chapter.
Their main purpose is to let you add new functionality to closed classes.
As shown in that section, imagine that you have a `Circle` class, but you can’t change its source code.
For instance, it may be defined like this in a third-party library:

{% tabs method_23 %}
{% tab 'Scala 2 and 3' for=method_23 %}

```scala
case class Circle(x: Double, y: Double, radius: Double)
```

{% endtab %}
{% endtabs %}

When you want to add methods to this class, you can define them as extension methods, like this:

{% tabs method_24 %}
{% tab 'Scala 3 Only' for=method_24 %}

```scala
extension (c: Circle)
  def circumference: Double = c.radius * math.Pi * 2
  def diameter: Double = c.radius * 2
  def area: Double = math.Pi * c.radius * c.radius
```

{% endtab %}
{% endtabs %}

Now when you have a `Circle` instance named `aCircle`, you can call those methods like this:

{% tabs method_25 %}
{% tab 'Scala 3 Only' for=method_25 %}

```scala
aCircle.circumference
aCircle.diameter
aCircle.area
```

{% endtab %}
{% endtabs %}

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
[reference_matchable]: {{ site.scala3ref }}/other-new-features/matchable.html
