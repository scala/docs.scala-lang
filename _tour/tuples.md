---
layout: tour
title: Tuples

discourse: true

partof: scala-tour

num: 
next-page: mixin-class-composition
previous-page: traits
topics: tuples

redirect_from: "/tutorials/tour/tuples.html"
---

In Scala, a tuple is a class that can hold elements of different types.
Tuples are immutable.

Tuples come in handy when we have to return multiple values from a function.

A tuple can be created as:

```tut
val ingredient = ("Sugar" , 25):Tuple2[String, Int]
```
This creates a tuple containing a String element and an Int element.

Tuple in Scala is a series of classes: Tuple2, Tuple3, etc., through Tuple22.
So when we create a tuple with n elements(n lying between 2 and 22), Scala basically instantiates
one of the corresponding classes from the group, parameterized with types of constituent elements.
For eg., ingredient is of type Tuple2[String, Int].

## Accessing the elements

Tuple elements are accessed using underscore syntax.
'tuple._n' gives nth element(given there are that many elements).

```tut
println(ingredient._1) // Sugar

println(ingredient._2) // 25
```

## Destructuring tuple data

Scala tuple also supports destructuring.

```tut
val (name, quantity) = ingredient

println(name) // Sugar

println(quantity) // 25
```

Tuple destructuring can be used in pattern matching too.

```tut
val planetDistanceFromSun = List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6 ), ("Mars", 227.9), ("Jupiter", 778.3))

planetDistanceFromSun.foreach{ tuple => {
  
  tuple match {
    
      case ("Mercury", distance) => println(s"Mercury is $distance millions km far from Sun")
      
      case p if(p._1 == "Venus") => println(s"Venus is ${p._2} millions km far from Sun")
      
      case p if(p._1 == "Earth") => println(s"Blue planet is ${p._2} millions km far from Sun")
      
      case _ => println("Too far....")
      
    }
    
  }
  
}
```

Or, in 'for' comprehension.

```tut
val numPairs = List((2, 5), (3, -7), (20, 56))

for ((a, b) <- numPairs) {

  println(a * b)
  
}
```

The value () of type Unit is conceptually the same as the value () of type Tuple0. There can only be one value of this type since it has no elements.

Users may sometimes find hard to chose between Tuples and case classes. As a rule, case classes are preferred choice if elements
carry more meaning.