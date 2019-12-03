---
layout: sip
title: SIP-21 - Spores
vote-status: "dormant"
vote-text: There is an implementation for Scala 2.11. A new owner is needed to champion this proposal for the current Scala version. The proposal needs to be updated to explain how to handle transitive spores.
permalink: /sips/:title.html
redirect_from: /sips/pending/spores.html
---

**By: Heather Miller, Martin Odersky, and Philipp Haller**

<span class="label success">Updated September 15th, 2013</span>

&nbsp;

Functional programming languages are regularly touted as an enabling force, as
an increasing number of applications become concurrent and distributed.
However, managing closures in a concurrent or distributed environment, or
writing APIs to be used by clients in such an environment, remains
considerably precarious-- complicated environments can be captured by these
closures, which regularly leads to a whole host of potential hazards across
libraries/frameworks in Scala's standard library and its ecosystem.

Potential hazards when using closures incorrectly:

- Memory leaks
- Race conditions, due to capturing mutable references
- Runtime serialization errors, due to unintended capture of references

This SIP outlines an abstraction, called _spores_, which enables safer use of
closures in concurrent and distributed environments. This is achieved by
controlling the environment which a spore can capture. Using an
_assignment-on-capture_ semantics, certain concurrency bugs due to capturing mutable
references can be avoided.

## Motivating Examples

### Futures and Akka Actors

In the following example, an Akka actor spawns a future to concurrently
process incoming requests.

**Example 1:**

    def receive = {
      case Request(data) =>
        Future {
          val result = transform(data)
          sender ! Response(result)
        }
    }

Capturing `sender` in the above example is problematic, since it does not
return a stable value. It is possible that the future's body is executed at a
time when the actor has started processing the next `Request` message which
could be originating from a different actor. As a result, the `Response`
message of the future might be sent to the wrong receiver.


### Serialization

The following example uses Java Serialization to serialize a closure. However,
serialization fails with a `NotSerializableException` due to the unintended
capture of a reference to an enclosing object.

**Example 2:**

    case class Helper(name: String)

    class Main {
      val helper = Helper("the helper")

      val fun: Int => Unit = (x: Int) => {
        val result = x + " " + helper.toString
        println("The result is: " + result)
      }
    }

Given the above class definitions, serializing the `fun` member of an instance
of `Main` throws a `NotSerializableException`. This is unexpected, since `fun`
refers only to serializable objects: `x` (an `Int`) and `helper` (an instance
of a case class).

Here is an explanation of why the serialization of `fun` fails: since `helper`
is a field, it is not actually copied when it is captured by the closure.
Instead, when accessing helper its getter is invoked. This can be made
explicit by replacing `helper.toString` by the invocation of its getter,
`this.helper.toString`. Consequently, the `fun` closure captures `this`, not
just a copy of `helper`. However, `this` is a reference to class `Main` which
is not serializable.

The above example is not the only possible situation in which a closure can
capture a reference to `this` or to an enclosing object in an unintended way.
Thus, runtime errors when serializing closures are common.

## Basic Usage

Spores have a few modes of usage. The simplest form is:

    val s = spore {
      val h = helper
      (x: Int) => {
        val result = x + " " + h.toString
        println("The result is: " + result)
      }
    }

In this example, no transformation is actually performed. Instead, the
compiler simply ensures that the spore is _well-formed_, i.e., anything that's
captured is explicitly listed as a value definition before the spore's
closure. This ensures that the enclosing `this` instance is not accidentally
captured, in this example.

Spores can also be used in for-comprehensions:

    for { i <- collection
          j <- doSomething(i)
    } yield s"${capture(i)}: result: $j"

Here, the fact that a spore is created is implicit, that is, the `spore`
marker is not used explicitly. Spores come into play because the underlying
`map` method of the type of `doSomething(i)` takes a spore as a parameter. The
`capture(i)` syntax is an alternative way of declaring captured variables, in
particular for use in for-comprehensions.

Finally, a regular function literal can be used as a spore. That is, a method
that expects a spore can be passed a function literal so long as the function
literal is well-formed.

    def sendOverWire(s: Spore[Int, Int]): Unit = ...
    sendOverWire((x: Int) => x * x - 2)

## Design

The main idea behind spores is to provide an alternative way to create
closure-like objects, in a way where the environment is controlled.

A spore is created as follows.

**Example 3:**

    val s = spore {
      val h = helper
      (x: Int) => {
        val result = x + " " + h.toString
        println("The result is: " + result)
      }
    }

The body of a spore consists of two parts:

1. **the spore header:** a sequence of local value (val) declarations only, and
2. **the closure**.

In general, a `spore { ... }` expression has the following shape.

Note that the value declarations described in point 1 above can be `implicit`
but not `lazy`.

**Figure 1:**

    spore {
      val x_1: T_1 = init_1
      ...
      val x_n: T_n = init_n
      (p_1: S_1, ..., p_m: S_m) => {
        <body>
      }
    }

The types `T_1, ..., T_n` can also be inferred.

The closure of a spore has to satisfy the following rule. All free variables
of the closure body have to be either

1. parameters of the closure, or
2. declared in the preceding sequence of local value declarations, or
3. marked using `capture` (see corresponding section  below).

**Example 4:**

    case class Person(name: String, age: Int)
    val outer1 = 0
    val outer2 = Person("Jim", 35)
    val s = spore {
      val inner = outer2
      (x: Int) => {
        s"The result is: ${x + inner.age + outer1}"
      }
    }

In the above example, the spore's closure is invalid, and would be rejected
during compilation. The reason is that the variable `outer1` is neither a
parameter of the closure nor one of the spore's value declarations (the only
value declaration is: `val inner = outer2`).

### Evaluation Semantics

In order to make the runtime behavior of a spore as intuitive as possible, the
design leaves the evaluation semantics unchanged compared to regular closures.
Basically, leaving out the `spore` marker results in a closure with the same
runtime behavior.

For example,

    spore {
      val l = this.logger
      () => new LoggingActor(l)
    }

and

    {
      val l = this.logger
      () => new LoggingActor(l)
    }

have the same behavior at runtime. The rationale for this design decision is
that the runtime behavior of closure-heavy code can already be hard to reason
about. It would become even more difficult if we would introduce additional
rules for spores.

### Spore Type

The type of the spore is determined by the type and arity of the closure. If
the closure has type `A => B`, then the spore has type `Spore[A, B]`. For
convenience we also define spore types for two or more parameters.

In example 3, the type of s is `Spore[Int, Unit]`.
Implementation
The spore construct is a macro which

- performs the checking described above, and which
- replaces the spore body so that it creates an instance of one of the Spore traits, according to the arity of the closure of the spore.

The `Spore` trait for spores of arity 1 is declared as follows:

    trait Spore[-T, +R] extends Function1[T, R]

For each function arity there exists a corresponding `Spore` trait of the same
arity (called `Spore2`, `Spore3`, etc.)

### Implicit Conversion

Regular function literals can be implicitly converted to spores. This implicit
conversion has two benefits:

1. it enables the use of spores in for-comprehensions.
2. it makes the spore syntax more lightweight, which is important in frameworks such as [Spark](https://spark.incubator.apache.org/) where users often create many small function literals.

This conversion is defined as a member of the `Spore` companion object, so
it's always in the implicit scope when passing a function literal as a method
argument when a `Spore` is expected. For example, one can do the following:

    def sendOverWire(s: Spore[Int, Int]): Unit = ...
    sendOverWire((x: Int) => x * x - 2)

This is arguably much lighter-weight than having to declare a spore before
passing it to `sendOverWire`.

In general, the implicit conversion will be successful if and only if the
function literal is well-formed according to the spore rules (defined above in
the _Design_ section). Note that _only function literals can be converted to spores_.
This is due to the fact that the body of the function literal has to be checked
by the spore macro to make sure that the conversion is safe. For _named_ function
values (i.e., not literals) on the other hand, it's not guaranteed that the
function value's body is available for the spore macro to check.

### Capture Syntax and For-Comprehensions

To enable the use of spores with for-comprehensions, a `capture` syntax has
been introduced to assist in the spore checking.

To see why this is necessary, let's start with an example. Suppose we have a
type for distributed collections:

    trait DCollection[A] {
      def map[B](sp: Spore[A, B]): DCollection[B]
      def flatMap[B](sp: Spore[A, DCollection[B]]): DCollection[B]
    }

This type, `DCollection`, might be implemented in a way where the data is
distributed across machines in a cluster. Thus, the functions passed to `map`,
`flatMap`, etc. have to be serializable. A simple way to ensure this is to
require these arguments to be spores. However, we also would like for-comprehensions
like the following to work:

    def lookup(i: Int): DCollection[Int] = ...
    val indices: DCollection[Int] = ...

    for { i <- indices
          j <- lookup(i)
    } yield j + i

A problem here is that the desugaring done by the compiler for
for-comprehensions doesn't know anything about spores. This is what
the compiler produces from the above expression:

    indices.flatMap(i => lookup(i).map(j => j + i))

The problem is that `(j => j + i)` is not a spore. Furthermore, making it a
spore is not straightforward, as we can't change the way for-comprehensions
are translated.

We can overcome this by using the implicit conversion introduced in the
previous section to convert the function literal implicitly to a spore.

However, in continuing to look at this example, it's evident that the lambda
still has the wrong shape. The captured variable `i` is not declared in the
spore header (the list of value definitions preceding the closure within the
spore), like a spore demands.

We can overcome this using the `capture` syntax – an alternative way of
capturing paths. That is, instead of having to write:

    {
      val captured = i
      j => j + i
    }

One can also write:

    (j => j + capture(i))

Thus, the above for-comprehension can be rewritten using spores and `capture`
as follows:

    for { i <- indices
          j <- lookup(i)
    } yield j + capture(i)

Here, `i` is "captured" as it occurs syntactically after the arrow of another
generator (it occurs after `j <- lookup(i)`, the second generator in the
for-comprehension).

**Note:** anything that is "captured" using `capture` may only be a path.

**A path** (as defined by the Scala Language Specification, section 3.1) is:

- The empty path &#949; (which cannot be written explicitly in user programs).
- `C.this`, where `C` references a class.
- `p.x` where `p` is a path and `x` is a stable member of `p`.
- `C.super.x` or `C.super[M].x` where `C` references a class and `x` references a stable member of the super class or designated parent class `M` of `C`.

The reason why captured expressions are restricted to paths is that otherwise
the two closures

    (x => <expr1> + capture(<expr2>))

and

    (x => <expr1> + <expr2>)

(where `<expr1>` and `<expr2>` are not just paths) would not have the same
runtime behavior, because in the first case, the closure would have to be
transformed in a way that would evaluate `<expr2>` "outside of the closure".
Not only would this complicate the reasoning about spore-based code (see the
section Evaluation Semantics above), but it's not clear what "outside of the
closure" even means in a context such as for-comprehensions.

### Macro Expansion

An invocation of the spore macro expands the spore's body as follows. Given
the general shape of a spore as shown above, the spore macro produces the
following code:

      new <spore implementation class>[S_1, ..., S_m, R]({
        val x_1: T_1 = init_1
        ...
        val x_n: T_n = init_n
        (p_1: S_1, ..., p_m: S_m) => {
          <body>
        }
      })

Note that, after checking, the spore macro need not do any further
transformation, since implementation details such as unneeded remaining outer
references are removed by the new backend intended for inclusion in Scala
2.11. It's also useful to note that in some cases these unwanted outer
references are already removed by the existing backend.

The spore implementation classes follow a simple pattern. For example, for
arity 1, the implementation class is declared as follows:

      class SporeImpl[-T, +R](f: T => R) extends Spore[T, R] {
        def apply(x: T): R = f(x)
      }

### Type Inference

Similar to regular functions and closures, the type of a spore should be
inferred. Inferring the type of a spore amounts to inferring the type
arguments when instantiating a spore implementation class:

      new <spore implementation class>[S_1, ..., S_m, R]({
        // ...
      })

In the above expression, the type arguments `S_1, ..., S_m`, and `R` should be
inferred from the expected type.

Our current proposal is to solve this type inference problem in the context of
the integration of Java SAM closures into Scala. Given that it is planned to
eventually support such closures, and to support type inference for these
closures as well, we plan to piggyback on the work done on type inference for
SAMs in general to achieve type inference for spores.

## Motivating Examples, Revisited

We now revisit the motivating examples we described in the above section, this
time in the context of spores.

### Futures and Akka actors

The safety of futures can be improved by requiring the body of a new future to
be a nullary spore (a spore with an empty parameter list).

Using spores, example 1 can be re-written as follows:

    def receive = {
      case Request(data) =>
        future(spore {
          val from = sender
          val d = data
          () => {
            val result = transform(d)
            from ! Response(result)
          }
        })
    }

In this case, the problematic capturing of `this` is avoided, since the result
of `this.sender` is assigned to the spore's local value `from` when the spore
is created. The spore conformity checking ensures that within the spore's
closure, only `from` and `d` are used.

### Serialization

Using spores, example 2 can be re-written as follows:

    case class Helper(name: String)

    class Main {
      val helper = Helper("the helper")

      val fun: Spore[Int, Unit] = spore {
        val h = helper
        (x: Int) => {
          val result = x + " " + h.toString
          println("The result is: " + result)
        }
      }
    }

Similar to example 1, the problematic capturing of `this` is avoided, since
`helper` has to be assigned to a local value (here, `h`) so that it can be
used inside the spore's closure. As a result, `fun` can now be serialized
without runtime errors, since `h` refers to a serializable object (a case
class instance).
