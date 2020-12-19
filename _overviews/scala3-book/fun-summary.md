---
title: Summary
type: section
description: This page shows how to use anonymous functions in Scala, including examples with the List class 'map' and 'filter' functions.
num: 34
previous-page: fun-write-method-returns-function
next-page: packaging-imports
---

This was a long chapter, so let’s review the key points that are covered.

A higher-order function (HOF) is often defined as a function that takes other functions as input parameters or returns a function as its value.
In Scala this is possible because functions are first-class values.

Moving through the sections, first you saw:

- You can write anonymous functions as small code fragments
- You can pass them into the dozens of HOFs (methods) on the collections classes, i.e., methods like `filter`, `map`, etc.
- With these small code fragments and powerful HOFs, you create a lot of functionality with just a little code

After looking at anonymous functions and HOFs, you saw:

- Function variables are simply anonymous functions that have been bound to a variable

After seeing how to be a *consumer* of HOFs, you then saw how to be a *creator* of HOFs.
Specifically, you saw:

- How to write methods that take functions as input parameters
- How to return a function from a method

A beneficial side effect of this chapter is that you saw many examples of how to declare type signatures for functions.
The benefits of that are that you use that same syntax to define function parameters, anonymous functions, and function variables, and it also becomes easier to read the Scaladoc for higher-order functions like `map`, `filter`, and others.



