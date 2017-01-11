---
layout: sip
title: SIP 25 - @static fields and methods in Scala objects(SI-4581)
disqus: true

vote-status: under revision
vote-text: Authors need to update the proposal before the next review.
---

__Dmitry Petrashko, Sébastien Doeraene and Martin Odersky__

__first submitted 11 January 2016__

## Motivation ##

We would like to allow methods and fields to be compiled as static. This is usable for interop with Java and other JVM languages, as well as with JavaScript, and is convenient for optimizations.

## Use Cases

Some JVM and JavaScript frameworks require classes to have specific static fields and/or methods.

For example, classes extending `android.os.Parcelable` are required to have a static field named `CREATOR` of type `android.os.Parcelable$Creator`.

Another example is using an [`AtomicReferenceFieldUpdater`](http://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicReferenceFieldUpdater.html).

On the JavaScript side, one example is [Relay Route Definitions](https://facebook.github.io/relay/docs/guides-routes.html), whose subclasses must define static fields such as `queries`.
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

Under the proposed scheme users will be able to opt-in to have the field `f` defined in the inner object `I` emited as a static field. 
In case `O.d` is annotated with `@static` the field will be created as a static field `d` in `class O`.
If not annotated, it will be created in the companion module with a static forwarder `d` in `class O`.

## Restrictions ##

The following rules ensure that methods can be correctly compiled into static members on both JVM and JavaScript:

1. Only objects can have members annotated with `@static`

2. The fields annotated with `@static` should preceed any non-`@static` fields. This ensures that we do not introduce surprises for users in initialization order.

3. The right hand side of a method or field annotated with `@static` can only refer to top-level classes, members of globally accessible objects and `@static` members. In particular, for non-static objects `this` is not accesible. `super` is never accessible.

4. If a member `foo` of an `object C` is annotated with `@static`, the companion class `C` is not allowed to define term members with name `foo`. 

5. If a member `foo` of an `object C` is annotated with `@static`, the companion class `C` is not allowed to inherit classes that define a term member with name `foo`.

6. Only `@static` methods and vals are supported in companions of traits. Java8 supports those, but not vars, and JavaScript does not have interfaces at all.

## Compilation scheme ##

No modification of the typer is planned. The current proposed scheme piggybacks on already existing scoping restrictions in the typer, thus requiring `@static` methods to be defined in `object`s.

If implemented in the dotty code base, the following modifications would be needed:

 - extend `RefChecks` to check restrictions 1, 2, 4, 5 and 6. This can be done in a separate mini-phase;
 - extend `LambdaLift.CollectDependencies` to be aware that accessing a member annotated `@static` should not trigger capturing the object that contains this member;
 - extend `LambdaLift` to trigger an error if a method annotated with `@static` method cannot be lifted to the top level scope;
 - extend `GenBCode` to emit static fields and methods in companion classes and forwarders to them in companion modules.

## Overriding & Hiding ##
Java allows classes to define static methods with the same name and signature as a static method of a superclass. In order to define the semantics of such cases, the Java Specification introduces the notion of [hiding](http://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.8.2).

This is required because in Java calling a `static` method on a class instance is supported.
This proposal does not need to introduce this notion as we do not support such calls.

## Comparison with [@lrytz's proposal](https://gist.github.com/lrytz/80f3141de8240f9629da) ##
Lukas Rytz has proposed a similar SIP, but his SIP requires changes to the typer to ensure that `@static` fields do not capture `this`, as in his proposal `@static` fields are defined in the class, rather than its companion object.
It also does not address the question of `@static` members in inner objects and inheritance/hiding of those methods in subclasses.

## Open questions ##
 - @static lazy val

## See Also ##
 * [SI-4581](https://issues.scala-lang.org/browse/SI-4581) is a request for a `@static` annotation
 * [Scala.js issue #1902](https://github.com/scala-js/scala-js/issues/1902) is a request for defining static fields in Scala.js-defined JS classes
 * [Another proposal by @lrytz](https://gist.github.com/lrytz/80f3141de8240f9629da)
 * [Old discussion on scala-internals mailing list](https://groups.google.com/forum/#!searchin/scala-internals/static/scala-internals/vOps4k8CADY/Dq1I3Ysvao0J)
 * [Another discussion of scala-internals mailing list](https://groups.google.com/forum/#!searchin/scala-internals/static/scala-internals/Y3OlFWPvnyM/tGE5BQw4Pe0J)
