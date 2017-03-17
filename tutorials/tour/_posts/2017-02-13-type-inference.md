---
layout: tutorial
title: Type Inference

disqus: true

tutorial: scala-tour
categories: tour
num: 29
next-page: operators
previous-page: polymorphic-methods
prerequisite-knowledge: unified-types, generic-classes
---
The Scala compiler can often infer the type of a value so you don't have to declare it explicitly. You'll often see this with variables and return types.

## Omitting the type
```
val businessName = "Montreux Jazz Café"
```
The compiler can detect that `businessName` is a String. It works similarly with methods:
```
def squareOf(x: Int) = x * x
```
The compiler can infer that the return type is an int so no return type is required.

For recursive methods, the compiler is not able to infer a result type. Here is a program which will fail the compiler for this reason:

```tut:fail
def fac(n: Int) = if (n == 0) 1 else n * fac(n - 1)
```

It is also not compulsory to specify type parameters when [polymorphic methods](polymorphic-methods.html) are called or [generic classes](generic-classes.html) are instantiated. The Scala compiler will infer such missing type parameters from the context and from the types of the actual method/constructor parameters.

Here are two examples:
```
case class MyPair[A, B](x: A, y: B);
val p = MyPair(1, "scala") // type: MyPair[Int, String]

def id[T](x: T) = x
val q = id(1)              // type: Int
```
The compiler uses the types of the arguments of `MyPair` to figure out what type `A` and `B` are. Likewise for the type of `x`.

##  Parameters
The compiler can never infer method parameter types. However, in certain cases, it can infer anonymous function parameter types when the function is passed as argument.

```
val doubled = Seq(1, 3, 4).map(x => x * 2)  // List(2, 6, 8)
```
The parameter for map is `f: A => B`. Because we put integers in the Seq, the compiler knows that `A` is `Int` (i.e. that `x` is an int). Therefore, the compiler can infer from `x * 2` that `B` is type `Int`.

## When _not_ to rely on type inference

It is generally considered more readable to declare the type of members exposed in a public API. Also, in some situations it can be quite dangerous to rely on Scala's type inference mechanism as the following program shows:

```tut:fail
object InferenceTest4 {
  var obj = null
  obj = new Object()
}
```

This program does not compile because the type inferred for variable `obj` is `Null`. Since the only value of that type is `null`, it is impossible to make this variable refer to another value.
