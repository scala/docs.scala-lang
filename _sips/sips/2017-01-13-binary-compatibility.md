---
layout: sip
title: SIP-34 - Improving binary compatibility with @stableABI
vote-status: dormant
vote-text: When the author of this proposal figures out which features should be binary compatible and has more information on the future implementation, the SIP Committee will start the review period.
permalink: /sips/:title.html
redirect_from: /sips/pending/binary-compatibility.html
---

__Dmitry Petrashko__

__first submitted 13 January 2017__

## Introduction

Scala is a language which evolves fast and thus made a decision to only promise binary compatibility across minor releases\[[3]\].
At the same time, there is a demand to develop APIs that live longer than a major release cycle of Scala.
This SIP introduces an annotation `@stableABI` that checks that `what you write is what you get`.

`@stableABI` is a linter, that does not change binary output, but will fail compilation if Public API of a class uses features
of Scala that are desugared by compiler and may be binary incompatible across major releases.

As long as declarations in source have not changed, `@stableABI` annotated classes will be compatible across major versions of Scala.
It complements MiMa\[[2]\] in indicating if a class will remain binary compatible across major Scala releases.

## Term definitions

* ##### Binary descriptors

As defined by the JVM spec\[[4]\]:

  > A descriptor is a string representing the type of a field or method. Descriptors are represented in the class file format using modified UTF-8 strings (§4.4.7)
  >  and thus may be drawn, where not further constrained, from the entire Unicode codespace.
  >
  > A method descriptor contains zero or more parameter descriptors, representing the types of parameters that the method takes, and a return descriptor, representing the type of the value (if any) that the method returns.

  Binary descriptors are used in the bytecode to indicate what fields and methods are accessed or invoked.
  If a method or field has its descriptor changed, previously compiled classes that used different descriptor will fail in
  runtime as they no longer link to the changed field.

  In this document we use the term `binary descriptor` to refer to both method and field descriptors used by the JVM.

* ##### Public API

  Methods and fields marked with `ACC_PUBLIC`\[[5]\] may be accessed from any class and package.
  This loosely corresponds to absence of AccessModifier\[[6]\] in Scala source.
  Changing a binary descriptor of a method or a field marked with `ACC_PUBLIC` is a binary incompatible change
  which may affect all classes in all packages leading to a runtime linkage failure.

  Methods and fields marked with `ACC_PROTECTED`\[[5]\] may be accessed within subclasses.
  This loosely corresponds to presence of `protected` AccessModifier\[[6]\] in Scala source.
  Changing a binary descriptor of a method or a field marked with `ACC_PROTECTED` is a binary incompatible change
  which may affect all subclasses of this class leading to a runtime linkage failure.

  In this document we use the term `Public API` to refer both to methods and fields defined as `ACC_PUBLIC` and `ACC_PROTECTED`.
  Changes do binary descriptors of Public API may lead to runtime linkage failures.

* ##### Binary compatibility

  Two versions of the same class are called binary compatible if there are no changes to the Public API of this class,
  meaning that those two classes can be substituted in runtime without linkage errors.

## Use cases

1. Publishing a library that would work across major Scala versions, such as 2.12 & 2.13 and Dotty.
2. Defining a class which is supposed to be used from other JVM languages such as Java\Kotlin.
`@stableABI` will ensure both binary compatibility and that there are no unexpected methods
 that would show up in members of a class or an interface.
3. Library authors can take advantage of language features introduced in new major versions of Scala
 while still serving users on older language versions by defining their Public API as `@stableABI`.

The important use-case envisioned here by the authors is migration to Dotty.
We envision that there might be code-bases that for some reason don't compile either with Dotty or with Scalac.
This can be either because they rely on union types, only present in Dotty,
or because they need early initializers, which are only supported by Scalac.

At the same time, by marking either those classes themselves or their parents as `@stableABI`,
the compiled artifacts could be used in both Dotty-compiled and Scalac-compiled projects.


## Current Status
In case there's a need to develop an API that will be used by clients compiled using different major versions of Scala,
the current approach is to either develop them in Java or to use best guess to restrict what Scala features should be used.

There's also a different approach which is used by sbt: instead of publishing a binary `compiler-interface`, sources are published instead that would be locally compiled.

Examples:

  1. Zinc\[[8]\] is writing their interfaces in Java because the interface has to be Scala version agnostic, as it is shipped in every sbt release, independently of Scala version that was used to compile zinc or will be used in to compile the project.
sbt additionally compiles on demand the compiler bridge, which implements this Java interface.

  2. Dotty\[[7]\] currently uses java defined interfaces as public API for IntelliJ in order to ensure binary compatibility.
These interfaces can be replaced by `@stableABI` annotated traits to reach the same goal.

## Design Guidelines
`@stableABI` is a feature which is supposed to be used by a small subset of the ecosystem to be binary compatible across major versions of Scala.
Thus this is designed as an advanced feature that is used rarely and thus is intentionally verbose.
It's designed to provide strong guarantees, in some cases sacrificing ease of use and to be used in combination with MiMa\[[2]\]

The limitations enforced by `@stableABI` are designed to be an overapproximation:
instead of permitting a list of features known to be compatible, `@stableABI` enforces a stronger
check which is sufficient to promise binary compatibility.

This SIP intentionally follows a very conservative approach.
This is because we will be able to allow more features later, but we won't have an opportunity to remove them.

## Overview ##
In order for a class, trait or an object to succeed compilation with the `@stableABI` annotation it has to be:

  - defined on the top level;
  - if a class or an object has a companion annotated with `@stableABI`, than annotation applies to both of them;
  - use a subset of Scala that during compilation does not require changes to public API of the class, including
     - synthesizing new members, either concrete or abstract;
     - changing binary descriptors of existing members, either concrete or abstract;

`@stableABI` does not change the compilation scheme of a class:
 compiling a class previously annotated with the `@stableABI`, will produce the same bytecode with or without `@stableABI` annotation.

Below are several examples of classes and traits that succeed compilation with `@stableABI`

{% highlight scala %}
@stableABI
trait AbstractFile {
  def name(): String

  def path(): String

  def jfile(): Optional[File]
}

@stableABI
trait SourceFile extends AbstractFile {
  def content(): Array[Char]
}

@stableABI
trait Diagnostic {
  def message(): String

  def level(): Int

  def position(): Optional[SourcePosition]
}

@stableABI
object Diagnostic {
  @static final val ERROR: Int = 2
  @static final val WARNING: Int = 1
  @static final val INFO: Int = 0
}

@stableABI
class FeaturesInBodies {
  def apiMethod: Int = {
    // as body of the method isn't part of the public interface, one can use all features of Scala here.
    lazy val result = 0 // while lazy vals are prohibited in the class, they are allowed in the bodies of methods
    result
  }
}
{% endhighlight %}

## Features that will fail compilation with `@stableABI`
The features listed below have complex encodings that may change in future versions. We prefer not to compromise on them.
Most of those features can be simulated in a binary compatible way by writing a verbose re-implementation
which won't rely on desugaring performed inside compiler.
Note that while those features are prohibited in the public API, they can be safely used inside bodies of the methods.

  - public fields. Can be simulated by explicitly defining public getters and setters that access a private field;
  - lazy vals. Can be simulated by explicitly writing an implementation in source;
  - case classes. Can be simulated by explicitly defining getters and other members synthesized for a case class(`copy`, `productArity`, `apply`, `unapply`, etc).

The features listed below cannot be easily re-implemented in a class or trait annotated with `@stableABI`.

  - default arguments;
  - default methods. See Addendum;
  - constant types(both explicit and inferred);
  - inline.

## Binary compatibility and transitivity ##
Consider a class, that is binary compatible but takes a non-binary compatible argument:

{% highlight scala %}
@stableABI
class Example {
  def foo[T](a: MyOption[T]): T = a.get
}

trait MyOption[T]{
  lazy val get: T = ???
}
{% endhighlight %}


Consider a situation when we re-compile `MyOption` using a different major compiler version than the one used to compile `Example`.
Let's assume the new major version of compile has changing binary descriptor of method `get`.

While the code in runtime would still successfully invoke the method `Example.foo`, this method will fail in execution,
as it will itself call a `MyOption.get` using an outdated descriptor.

While in perfect world it would be nice to require all `@stableABI` classes and traits to only take `@stableABI` arguments
and only return `@stableABI` values, we believe that all-or-nothing system will be a lot harder to adopt and migrate to.

Because of this we propose to emmit warnings in those cases:

  - non-`@stableABI` value is returned from a method or field defined inside a `@stableABI` class or trait;
  - an invocation to a method not-defined inside a `@stableABI` class is used in
  implementation of a method or a field initializer inside a `@stableABI` class or trait.

Those warnings can be suppressed using an `@unchecked` annotations or made fatal using `+Xfatal-warnings`.

## The case of the standard library ##
The Standard library defines types commonly used as arguments or return types such as `Option` and `List`,
as well as methods and implicit conversions imported from `scala` and `Predef`.

As such Standard library is expected to be the biggest source of warnings defined in previous section.

We propose to consider either making some classes in standard library use `@stableABI` or define new `@stableABI`
super-interfaces for them that should be used in `@stableABI` classes.
This would also allow to consume Scala classes from other JVM languages such as Kotlin and Java.
## `@stableABI` and Scala.js

Allowing to write API-defining classes in Scala instead of Java will allow them to compile with Scala.js,
which would have benefit of sharing the same source for two ecosystems.

Scala.js currently is binary compatible as long as original bytecode compiled by Scala JVM is binary compatible.
Providing stronger binary compatibility guarantees for JVM will automatically provide stronger guarantees for Scala.js.


## Comparison with MiMa ##
The Migration Manager for Scala (MiMa in short) is a tool for diagnosing binary incompatibilities for Scala libraries.
MiMa allows to compare binary APIs of two already compiled classfiles and reports errors if APIs do not match perfectly.

MiMa and `@stableABI` complement each other, as `@stableABI` helps to develop APIs that stay compatible
across major versions, while MiMa checks that previously published artifacts indeed have the same API.

`@stableABI` does not compare the currently compiled class or trait against previous version,
so introduction of new members won't be prohibited. This is a use-case for MiMa.

MiMa does not indicate how hard, if possible, would it be to maintain compatibility of a class across future versions of Scala.
Multiple features of Scala, most notably lazy vals and traits, have been compiled differently by different Scala versions
making porting existing compiled bytecode across versions very hard.
MiMa will complain retroactively that the new version is incompatible with the old one.
`@stableABI` will instead indicate at compile time that the old version used features whose encoding is prone to change.
This provides early guidance and warning when designing long-living APIs before they are publicly released.

## Compilation scheme ##
No modification of typer or any existing phase is planned. The current proposed scheme introduces a late phase that runs before the very bytecode emission that checks that:

 - classes, traits and objects annotated as  `@stableABI` are on the top level;
 - compiler did not introduce new Public API methods or fields inside  `@stableABI` classes, traits and objects;
 - compiler did not change descriptors of existing Public API methods or fields inside `@stableABI` classes, traits and objects.

This phase additionally warns if Public API method or field takes an argument or returns a value that isn't marked as `@stableABI`.
This warning can be suppressed by annotating with `@unchecked`.

The current prototype is implemented for Dotty and supports everything described in this SIP, except warnings.
The implementation is simple with less than 50 lines of non-boilerplate code.
The current implementation has a scope for improvement of error messages that will report domain specific details for disallowed features,
but it already prohibits them.

## Addendum: Default methods ##
By `default methods` we mean non-abstract methods defined and implemented by a trait.

The way how those methods are implemented by compiler has changed substantially over years.
At the same time, `invokeinterface` has always been a reliable way to invoke such a method,
independently from how it was implemented under the hood.

One might reason that, as there has been a reliable way to call methods on the binary level,
it should be allowed to use them in binary compatible APIs.

At the same time, the mixin composition protocol that is followed when a class inherits those traits has also
changed substantially.
The classes which have been correctly inheriting those traits compiled by previous versions of Scala
may need recompilation if trait has been recompiled with a new major version of Scala.

Thus, the authors of this SIP has decided not to allow default methods in the
`@stableABI` traits.

## See Also ##

 1. [dotty#1900][1]
 2. [MiMa][2]
 3. [releases-compatibility][3]
 4. [Descriptor definition in JVM Specification][4]
 5. [JVM access flags][5]
 6. [Scala AccessModifiers][6]
 7. [Dotty interfaces][7]
 8. [Zinc interfaces][8]


[1]: https://github.com/lampepfl/dotty/pull/1900 "an implementation for Dotty"
[2]: https://github.com/typesafehub/migration-manager "MiMa"
[3]: https://docs.scala-lang.org/overviews/core/binary-compatibility-of-scala-releases.html "Binary compatibility of Scala releases"
[4]: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.3 "Descriptor definition in JVM Specification"
[5]: https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html#jvms-4.6-200-A.1 "JVM access flags"
[6]: https://www.scala-lang.org/files/archive/spec/2.11/05-classes-and-objects.html#modifiers "Scala AccessModifiers"
[7]: https://github.com/lampepfl/dotty/tree/master/interfaces/src/dotty/tools/dotc/interfaces "Dotty interfaces"
[8]: https://github.com/sbt/zinc/tree/v1.0.0/internal/compiler-interface/src/main/java/xsbti "zinc interfaces"

