---
layout: sip
title: SIP-30 - @static fields and methods in Scala objects (SI-4581)
vote-status: "under-review"
vote-text: Authors need to update the proposal before the next review.
permalink: /sips/:title.html
redirect_from: /sips/pending/static-members.html
---

__Dmitry Petrashko, Sébastien Doeraene and Martin Odersky__

__first submitted 11 January 2016__

## Motivation ##

We would like to allow methods and fields to be compiled as static. This is usable for interop with Java and other JVM languages, as well as with JavaScript, and is convenient for optimizations.

## Use Cases

Some JVM and JavaScript frameworks require classes to have specific static fields and/or methods.

For example, classes extending `android.os.Parcelable` are required to have a static field named `CREATOR` of type `android.os.Parcelable$Creator`.

Another example is using an [`AtomicReferenceFieldUpdater`](https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicReferenceFieldUpdater.html).

On the JavaScript side, one example is [Relay Route Definitions](https://web.archive.org/web/20180718024336/https://facebook.github.io/relay/docs/en/routing.html), whose subclasses must define static fields such as `queries`.
Static methods and fields for JavaScript classes are one of the very few things (if not the only thing) that Scala.js "cannot do" at the moment, at least not declaratively.

## Overview ##

In order for a method or field to be considered static it needs to be defined in an `object` and annotated `@static`.
There is no special syntax proposed to access these members, they are accessed as if they were a member of defining objects with all appropriate access requirements for accessing them.

For example:

{% highlight scala %}
class Foo

object Foo {
  @static val x = 5
  @static def bar(y: Int): Int = x + y
}

println(Foo.x)
println(Foo.bar(12))
{% endhighlight %}

Intuitively, the presence of the `@static` annotation ensures that a field/method is declared as a static member of the companion class.
For the JVM, the above would therefore look to other Java code as if it had been declared with the following Java code:

{% highlight java %}
class Foo {
  public static int x = 5;
  public static int bar(int y) {
    return x + y;
  }
}
{% endhighlight %}

In Scala.js, the `@static` annotation has no semantic effect in Scala objects, as they are not visible from JavaScript anyway (it could be used for optimizations).
It has a semantic effect on Scala.js-defined JS classes, for example:

{% highlight scala %}
@ScalaJSDefined
class Foo extends js.Object

@ScalaJSDefined
object Foo extends js.Object {
  @static val x = 5
  @static def bar(y: Int): Int = x + y
}
{% endhighlight %}

would look to JavaScript code as if it had been declared with the following JavaScript code:

{% highlight javascript %}
class Foo extends Object {
  static bar(y) {
    return x + y;
  }
}
Foo.x = 5; // in ES6, there is no declarative syntax for static fields yet
{% endhighlight %}

## Comparison with mirror classes ##

Scalac currently generates static forwarders for fields and methods in top-level objects:

{% highlight scala %}
object O {
  val d = 1
  object I {
    val f = 1
  }
}
{% endhighlight %}

Under the proposed scheme users will be able to opt-in to have the field `f` defined in the inner object `I` emitted as a static field.
In case `O.d` is annotated with `@static` the field will be created as a static field `d` in `class O`.
If not annotated, it will be created in the companion module with a static forwarder `d` in `class O`.

## Restrictions ##

The following rules ensure that methods can be correctly compiled into static members on both JVM and JavaScript:

1. Only objects can have members annotated with `@static`

2. The fields annotated with `@static` should precede any non-`@static` fields. This ensures that we do not introduce surprises for users in initialization order of this class.

3. The right hand side of a method or field annotated with `@static` can only refer to top-level classes, members of globally accessible objects and `@static` members. In particular, for non-static objects `this` is not accessible. `super` is never accessible.

4. If a member `foo` of an `object C` is annotated with `@static`, the companion class `C` is not allowed to define term members with name `foo`.

5. If a member `foo` of an `object C` is annotated with `@static`, the companion class `C` is not allowed to inherit classes that define a term member with name `foo`.

6. Only `@static` methods and vals are supported in companions of traits. Java8 supports those, but not vars, and JavaScript does not have interfaces at all.

Note that because of platform requirements for JavaScript interop, rules `3` and `4` would be lifted for objects that have a companion class that inherits `js.Any`.

## Compilation scheme ##

No modification of the typer is planned. The current proposed scheme piggybacks on already existing scoping restrictions in the typer, thus requiring `@static` methods to be defined in `object`s.

If implemented in the dotty code base, the following modifications would be needed:

 - extend `RefChecks` to check restrictions 1, 2, 4, 5 and 6. This can be done in a separate mini-phase;
 - extend `LambdaLift.CollectDependencies` to be aware that accessing a member annotated `@static` should not trigger capturing the object that contains this member;
 - extend `LambdaLift` to trigger an error if a method annotated with `@static` method cannot be lifted to the top level scope;
 - extend `GenBCode` to emit static fields and methods in companion classes and forwarders to them in companion modules.

## Overriding & Hiding ##
Java allows classes to define static methods with the same name and signature as a static method of a superclass. In order to define the semantics of such cases, the Java Specification introduces the notion of [hiding](https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.2).

This is required because in Java calling a `static` method on a class instance is supported.
This proposal does not need to introduce this notion as we do not support such calls.

## Scala.js and @JSStatic ##
As Scala.js needs this feature fast, a decision has been made to ship it under a name of `@JSStatic` before waiting for this SIP to be accepted and implemented in `scalac`. When this SIP is accepted and implemented in `scalac` the `@JSStatic` would become a deprecated type alias to `scala.static`.

## Comparison with [@lrytz's proposal](https://gist.github.com/lrytz/80f3141de8240f9629da) ##
Lukas Rytz has proposed a similar SIP, but his SIP requires changes to the typer to ensure that `@static` fields do not capture `this`, as in his proposal `@static` fields are defined in the class, rather than its companion object.
It also does not address the question of `@static` members in inner objects and inheritance/hiding of those methods in subclasses.

## Open questions ##
 - @static lazy val

## Initialization order discussion ##
In general, emission of static fields could affect the initialization order and change semantics.
This SIP solves this by enforcing (rule `2`) that `@static` fields and expressions precede non-static fields.
This means that no code precedes the `@static` field initialization which makes it hard to observe the difference between if the field is initialized statically or not,
since fields are initialized in the order `as written`, similar to how normal fields are initialized.

The `@static` proposal is similar to `@tailrec` in a sense that it fails compilation in the case where the user did not write code that follows the aforementioned rules.
These rules exist to enforce the unlikelihood of an observable difference in semantics if `@static` annotations are dropped;
The restrictions in this SIP make it hard to observe changes in initialization within the same object.
It is still possible to observe those changes using multiple classes and side effects within initializers:

{% highlight scala %}
class C {
  val x = {println("x"); 1 }
}


object O extends C {
  val y = { println("y"); 2 }
  // prints:
  // x
  // y
}

object Os extends C {
  @static val y = { println("y"); 2 }
   // prints:
   // y
   // x
}
{% endhighlight %}


Static fields can be initialized earlier than they used to be initialized while being non-static, but never later.
By requiring `@static` first to be defined first inside the object,
we guarantee that you can't observe the changes in initialization withing the same object without resorting to code which either uses `Unsafe` or exhibits undefined behaviour under the JVM.

## Could `@static` be a `@tailrec`-like annotation that doesn't affect code generation but only checks ##
Unlike `@tailrec` this annotation does affect the binary API and dropping such an annotation would be a binary incompatible change. This is why authors believe that developers should be in full control of what is static.

## Alternative: Emitting fields of objects as static by default ##
An alternative to this proposal would be to emit all the fields defined in objects as static.
Unfortunately this gets us under dark waters when we try to figure out in the following example:


{% highlight scala %}
class Super {
 val c = {println(1); 1}
}
object Object extends Super {
 override val c = {println(2); 2}
 val d = {println(3); 2}
}
{% endhighlight %}

Let's consider possible options:

 - if the field `c` is emitted as `static` on the bytecode level, it will be initialized before the `c` in superclass is initialized, reordering side-effects in initializers;
 - if the field `c` is _not_ emitted as `static` but the field `d` is, then the order of initialization would also be affected, reordering side-effects.

Based on the previous study done in preparation for this SIP, the authors believe that the only reasonable way to maintain current semantics would be to say that such alternative would require these rules:

 - only the fields which were not declared by parents of the object can be emitted as static;
 - only fields that are lexically defined before any non-static field or statement in the body can be emitted as static.

Authors believe that the alternative would require the same effort to implement, but will be less intuitive to users and harder to control as, for example, reordering fields in object might not be binary compatible.

## See Also ##
 * [SI-4581](https://issues.scala-lang.org/browse/SI-4581) is a request for a `@static` annotation
 * [Scala.js issue #1902](https://github.com/scala-js/scala-js/issues/1902) is a request for defining static fields in Scala.js-defined JS classes
 * [Another proposal by @lrytz](https://gist.github.com/lrytz/80f3141de8240f9629da)
 * [Old discussion on scala-internals mailing list](https://groups.google.com/forum/#!searchin/scala-internals/static/scala-internals/vOps4k8CADY/Dq1I3Ysvao0J)
 * [Another discussion of scala-internals mailing list](https://groups.google.com/forum/#!searchin/scala-internals/static/scala-internals/Y3OlFWPvnyM/tGE5BQw4Pe0J)
