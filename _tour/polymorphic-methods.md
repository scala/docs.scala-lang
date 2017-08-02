---
layout: tour
title: Polymorphic Methods

discourse: true

partof: scala-tour

num: 28

next-page: local-type-inference
previous-page: implicit-conversions
prerequisite-knowledge: unified-types

redirect_from: "/tutorials/tour/polymorphic-methods.html"
---

Methods in Scala can be parameterized by type as well as value. The syntax is similar to that of generic classes. Type parameters are declared within a pair of brackets while value parameters are enclosed in a pair of parentheses.

Here is an example:

```tut
def listOfDuplicates[A](x: A, length: Int): List[A] = {
    if (length < 1)
        Nil
    else
        x :: listOfDuplicates(x, length - 1)
}
println(listOfDuplicates[Int](3, 4))  // List(3, 3, 3, 3)
println(listOfDuplicates("La", 8))  // List(La, La, La, La, La, La, La, La)
```

The method `listOfDuplicates` takes a type parameter `A` and values parameters `x` and `n`. In this case, value `x` is of type `A`. If `length < 1` we return an empty list. Otherwise we prepend `x` to the the list of duplicates returned by the recursive call to `listOfDuplicates`. (note: `::` means prepend an element on the left to a sequence on the right).

When we call `listOfDuplicates` with `[Int]` as the type parameter, the first argument must be an int and the return type will be List[Int]. However, you don't always need to explicitly provide the the type parameter because the compiler can often figure it out based on the type of value argument (`"La"` is a String). In fact, if calling this method from Java it is impossible to provide the type parameter.
