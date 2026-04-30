---
layout: singlepage-overview
title: Fuel and Stack Overflows
versionSpecific: true
scala3: true
---

## Fuel and Stack Overflows

Scala lets you, the programmer, write deeply nested types if you find it necessary to model your business logic.

Because types can refer to other types in ways that recurse without the base case being obvious, it's possible to write incorrect code whose recursion never terminates,
or correct code whose recursion is so deep that the compiler could run out of stack space while compiling.

Starting with Scala 3.9.0, the compiler tracks its stack use using "fuel", an abstract resource.
Recursive operations in the compiler consume fuel, and once a predefined fuel limit is reached, compilation fails.
This ensures the compiler does not run out of stack space, which would cause it to crash instead.

### Did I hit a compiler bug?

If you get a `StackOverflowError`, and you did **not** set `-Xmax-fuel`, nor any JVM option related to stack space (when running on the JVM),
yes, that's a compiler bug, because the compiler should run out of fuel before hitting a stack overflow.
Please [report it](https://github.com/scala/scala3/issues/new/choose).

However, if you increased the fuel limit, or decreased the available stack space, it is expected that you may encounter stack overflows.
These are not considered compiler bugs.
Please increase the stack space as discussed below, or refactor your types so that they are not as deeply nested.

### I ran out of fuel...

This means your types contain unusually deep recursion.

First, think about whether this is intentional. Perhaps you accidentally wrote a match type that recurses infinitely because it has no base case, for instance.

If it is intentional, you must increase the fuel limit, **and** increase the stack space if you are on a platform that allows this.

To increase the fuel limit, pass `-Xmax-fuel:...` to the compiler. You can check the default limit with ...TODO how?...

To increase stack space:
- On the **JVM**, pass `-Xss...` to the JVM, for example `-Xss16M`.
  How to do this depends on what IDE and/or build tool you are using. For sbt, add it to `.jvmopts`.
- On **Scala.js**, you cannot increase the stack space, because neither JavaScript nor WebAssembly allow this.
  You can try increasing the fuel limit anyway, but you may have to instead limit your use of recursive types.
- On **Scala Native**, ...TODO what?...
