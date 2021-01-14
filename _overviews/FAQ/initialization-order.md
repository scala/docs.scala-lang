---
layout: multipage-overview
title: Why is my abstract or overridden val null?
overview-name: FAQ
permalink: /tutorials/FAQ/:title.html
---

## Example

To understand the problem, let's pick the following concrete example.

    abstract class A {
      val x1: String
      val x2: String = "mom"

      println("A: " + x1 + ", " + x2)
    }
    class B extends A {
      val x1: String = "hello"

      println("B: " + x1 + ", " + x2)
    }
    class C extends B {
      override val x2: String = "dad"

      println("C: " + x1 + ", " + x2)
    }

Let's observe the initialization order through the Scala REPL:

    scala> new C
    A: null, null
    B: hello, null
    C: hello, dad

Only when we get to the constructor of `C` are both `x1` and `x2` initialized. Therefore, constructors of `A` and `B` risk running into `NullPointerException`s.

## Explanation
A 'strict' or 'eager' val is one which is not marked lazy.

In the absence of "early definitions" (see below), initialization of strict vals is done in the following order.

1. Superclasses are fully initialized before subclasses.
2. Otherwise, in declaration order.

Naturally when a val is overridden, it is not initialized more than once.  So though x2 in the above example is seemingly defined at every point, this is not the case: an overridden val will appear to be null during the construction of superclasses, as will an abstract val.

There is a compiler flag which can be useful for identifying this situation:

**-Xcheckinit**: Add runtime check to field accessors.

It is inadvisable to use this flag outside of testing.  It adds significantly to the code size by putting a wrapper around all potentially uninitialized field accesses: the wrapper will throw an exception rather than allow a null (or 0/false in the case of primitive types) to silently appear.  Note also that this adds a *runtime* check: it can only tell you anything about code paths which you exercise with it in place.

Using it on the opening example:

    % scalac -Xcheckinit a.scala
    % scala -e 'new C'
    scala.UninitializedFieldError: Uninitialized field: a.scala: 13
    	at C.x2(a.scala:13)
    	at A.<init>(a.scala:5)
    	at B.<init>(a.scala:7)
    	at C.<init>(a.scala:12)

### Solutions ###

Approaches for avoiding null values include:

#### Use lazy vals ####

    abstract class A {
      val x1: String
      lazy val x2: String = "mom"

      println("A: " + x1 + ", " + x2)
    }
    class B extends A {
      lazy val x1: String = "hello"

      println("B: " + x1 + ", " + x2)
    }
    class C extends B {
      override lazy val x2: String = "dad"

      println("C: " + x1 + ", " + x2)
    }
    // scala> new C
    // A: hello, dad
    // B: hello, dad
    // C: hello, dad

Usually the best answer.  Unfortunately you cannot declare an abstract lazy val.  If that is what you're after, your options include:

1. Declare an abstract strict val, and hope subclasses will implement it as a lazy val or with an early definition.  If they do not, it will appear to be uninitialized at some points during construction.
2. Declare an abstract def, and hope subclasses will implement it as a lazy val.  If they do not, it will be re-evaluated on every access.
3. Declare a concrete lazy val which throws an exception, and hope subclasses override it.  If they do not, it will... throw an exception.

An exception during initialization of a lazy val will cause the right hand side to be re-evaluated on the next access: see SLS 5.2.

Note that using multiple lazy vals creates a new risk: cycles among lazy vals can result in a stack overflow on first access.

#### Use early definitions  ####
    abstract class A {
      val x1: String
      val x2: String = "mom"

      println("A: " + x1 + ", " + x2)
    }
    class B extends {
      val x1: String = "hello"
    } with A {
      println("B: " + x1 + ", " + x2)
    }
    class C extends {
      override val x2: String = "dad"
    } with B {
      println("C: " + x1 + ", " + x2)
    }
    // scala> new C
    // A: hello, dad
    // B: hello, dad
    // C: hello, dad

Early definitions are a bit unwieldy, there are limitations as to what can appear and what can be referenced in an early definitions block, and they don't compose as well as lazy vals: but if a lazy val is undesirable, they present another option.  They are specified in SLS 5.1.6.

Note that early definitions are deprecated in Scala 2.13; they will be replaced by trait parameters in Scala 3. So, early definitions are not recommended for use if future compatibility is a concern.

#### Use constant value definitions ####
    abstract class A {
      val x1: String
      val x2: String = "mom"

      println("A: " + x1 + ", " + x2)
    }
    class B extends A {
      val x1: String = "hello"
      final val x3 = "goodbye"

      println("B: " + x1 + ", " + x2)
    }
    class C extends B {
      override val x2: String = "dad"

      println("C: " + x1 + ", " + x2)
    }
    abstract class D {
      val c: C
      val x3 = c.x3   // no exceptions!
      println("D: " + c + " but " + x3)
    }
    class E extends D {
      val c = new C
      println(s"E: ${c.x1}, ${c.x2}, and $x3...")
    }
    //scala> new E
    //D: null but goodbye
    //A: null, null
    //B: hello, null
    //C: hello, dad
    //E: hello, dad, and goodbye...

Sometimes all you need from an interface is a compile-time constant.

Constant values are stricter than strict and earlier than early definitions and have even more limitations,
as they must be constants.  They are specified in SLS 4.1.
