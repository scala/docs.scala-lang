---
title: Type Classes
description: This section introduces type classes in Scala 3.
---

A _type class_ is an abstract, parameterized type that lets you add new behavior to any closed data type without using sub-typing. This is useful in multiple use-cases, for example:

- Expressing how a type you don’t own — such as from the standard library or a third-party library — conforms to such behavior
- Expressing such a behavior for multiple types without involving sub-typing relationships (i.e., one `extends` another) between those types

In Scala 3, _type classes_ are just _traits_ with one or more parameters whose implementations are defined by `given` instances (and *not* defined with the `extends` keyword).

Type classes fall into the category of *Contextual Abstractions*, so more details and examples of type classes are shown in the [ca-06-type-classes.md](Implementing Type Classes section) of that chapter, so see that page for more information.


