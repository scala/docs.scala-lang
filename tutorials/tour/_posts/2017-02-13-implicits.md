---
layout: tutorial
title: Implicits

disqus: true

tutorial: scala-tour
categories: tour
num: 26
next-page: implicit-conversions
previous-page: explicitly-typed-self-references
---
Implicits allow for automatic application of code when an explicit application isn't supplied.

## Implicit parameters

Implicit parameters allow for the caller to omit an argument if an implicit one of the correct type is in scope. Use the `implicit` keyword to make a value, object, or expression implicit. You also use it to make the parameter list implicit.
```tut
class Greeting(val greeting: String) {
  def greet(name: String) = s"$greeting, $name"
}
implicit val standardGreeting = new Greeting("Hello")


def printGreeting(name: String)(implicit greeting: Greeting) = greeting.greet(name)

printGreeting("Fred")(new Greeting("Good day"))  // Good day, Fred

printGreeting("Franchesca")  // Hello, Franchesca
```
In the method `printGreeting`, the parameter `greeting` is implicit. This means that the caller can either supply an argument normally or skip it.
With `printGreeting("Fred")(new Greeting("Good day"))`, both arguments of the function `printGreeting` are supplied. However, in `printGreeting("Franchesca")` the `greeting` argument is not supplied. As this parameter is marked _implicit_ and has type `Greeting`, the compiler searches the current scope for an implicit `Greeting` and finds `standardGreeting`.

This becomes useful when you have a lot of similar arguments to function calls throughout your program, for instance as configuration data. However, implicits can make code more difficult to understand as it is not evident from an expression such as `printGreeting("Franchesca")` that the function has two arguments. Further,
it's not always obvious where implicits are defined if you import them from another module with a wildcard (e.g. `import MyPredef._`).




## Implicit conversion

An implicit conversion from a type `A` to a type `B` is one of:
* an implicit definition with argument of type `A` and result of type `B`
* an implicit value, definition or object of type `A => B`

An implicit conversion happens the type check fails for an argument, or a method is applied to an object not belonging to a class for which the method exists, and an implicit conversion is found that makes the application valid.
```
case class Rational(numerator: Int, denominator: Int)

implicit def int2rational(x: Int): Rational = Rational(x, 1)

def num(x: Rational): Int = x.numerator
val number: Int = 5

num(number)  // 5
number.numerator // 5
```
This typecasting happens because of the method `int2rational`. When the compiler sees that `num` expects a `Rational` but we pass an `Int`, it searches the scope for an `implicit` function that can do the conversion. Similarly when the compiler sees the method `.numerator` applied to an `Int`, for which there is no such method, it looks for a conversion that makes the method valid.

Implicit conversions can cause incorrect code to accidentally become valid (but with wrong behaviour) and so should be used sparingly.  

## Implicit classes

An implicit class is essentially a class wrapping a type `A` together with an implicit definition to this class. This allows adding of _extension methods_ without the dangers associated to implicit conversions.
```
implicit class IntOps(a: Int){
  val double: Int = a *2
  def orderedPair(b: Int) : (Int, Int) = if (b > a) (a, b) else (b, a)
}

3.double // 6

3.orderedPair(4) // (3, 4)
3.orderedPair(2) // (2, 3)
```

## Mapping types to objects

Implicits also allow us to map _types_ to _objects_ or to other types. For instance, one may want to define _zero_ for certain types, so that
* `zero[Int] = 0`,
* For types `A` and `B`, `zero[List[A]] = List.empty[A]`,
* If types `A` and `B` have zeroes, then `zero[(A, B)] = (zero[A], zero[B])`.

This can be achieved using implicits, following the so called _typeclass pattern_.
```
trait HasZero[A]{
  val zero : A
}

def zero[A](implicit hasZero: HasZero[A]): A = hasZero.zero

implicit val intZero: HasZero[Int] = new HasZero[Int]{val zero = 0}

implicit def listZero[A]: HasZero[List[A]] = new HasZero[List[A]]{val zero = List.empty[A]}

implicit def pairZero[A, B](implicit hasZeroA : HasZero[A], hasZeroB: HasZero[B]): HasZero[(A, B)] =
  new HasZero[(A, B)]{
    val zero = (hasZeroA.zero, hasZeroB.zero)
  }

zero[Int] // 0

zero[List[String]] // List()

zero[(Int, List[Symbol])] // (0, List())
```

_Example Credit_: Odersky, Martin, Lex Spoon, and Bill Venners. Programming in Scala. Walnut Creek, CA: Artima, 2016.  
