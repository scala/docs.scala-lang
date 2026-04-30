---
layout: singlepage-overview
title: Fuel and Stack Overflows
versionSpecific: false
---

## Fuel and Stack Overflows

Scala lets you, the programmer, write deeply nested types if you find it necessary to model your business logic.

Because types can refer to other types in ways that recurse without the base case being obvious, it's possible to write incorrect code whose recursion never terminates,
or correct code whose recursion is so deep that the compiler could run out of stack space while compiling.

**Starting with Scala 3.9.0**, the compiler tracks its stack use using "fuel", an abstract resource.
Recursive operations in the compiler consume fuel, and once a predefined fuel limit is reached, compilation fails.
This ensures the compiler does not run out of stack space, which would cause it to crash instead.

**In Scala 2 and Scala 3.8 or earlier**, the compiler attempts to catch stack overflows, which is not always reliable.

### Did I hit a compiler bug?

For **Scala 3.9 and newer**:
- If you get a `StackOverflowError`, and you did **not** set `-Xmax-fuel`, nor any JVM option related to stack space (when running on the JVM),
  yes, that's a compiler bug, because the compiler should run out of fuel before hitting a stack overflow.
  Please [report it](https://github.com/scala/scala3/issues/new/choose).
- However, if you increased the fuel limit, or decreased the available stack space, it is expected that you may encounter stack overflows.
  These are not considered compiler bugs.
  Please increase the stack space as discussed below, or refactor your types so that they are not as deeply nested.

For **Scala 3.8 and earlier**, as well as **Scala 2**:
- Stack overflows are not considered compiler bugs unless they do not go away no matter how much extra stack space you add.
  In that case, then it's a compiler bug. Please report it on the [Scala 2 bug tracker](https://github.com/scala/bug/issues)
  or [Scala 3 bug tracker](https://github.com/scala/scala3/issues), but check first if it's a duplicate of an existing ticket.

### I ran out of fuel... (Scala 3.9+)

This means your types contain unusually deep recursion.

First, think about whether this is intentional. Perhaps you accidentally wrote a match type that recurses infinitely because it has no base case, for instance.

If it is intentional, you must increase the fuel limit, **and** increase the stack space if you are on a platform that allows this, see below.

### Increasing the fuel limit (Scala 3.9+)

To increase the fuel limit, pass `-Xmax-fuel:...` to the compiler.
You can check the default limit with ...TODO how?...

If possible, also increase the stack space, see below.
The default fuel limit is meant to work with normally-sized stacks, so if you increase the fuel limit without also increasing the stack space,
it's likely you'll run into stack overflow errors.

### Increasing stack space (all versions)

This depends on where you're running the compiler, _not_ on what target you're compiling for.
For instance, if you're running the Scala compiler on your laptop using `scala-cli` to target Scala.js, you should follow the JVM instructions.

On the **JVM**, pass `-Xss...` to the JVM, for example `-Xss16M`.
How to do this depends on what IDE and/or build tool you are using. For sbt, add it to `.jvmopts`.

On **Scala.js**, you cannot increase the stack space, because neither JavaScript nor WebAssembly allow this.
You can try increasing the fuel limit anyway, but you may have to instead limit your use of recursive types.

On **Scala Native**, ...TODO what?...
