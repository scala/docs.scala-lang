---
layout: sip
title: SIP XX - Improving binary compatibility with @binaryCompatible
disqus: true
---

__Dmitry Petrashko__

__first submitted 13 January 2017__

## Introduction ##

Scala is a language which evolves fast and thus made a decision to only promise binary compatibility across minor releases.
At the same time, there is a demand to develop APIs that live longer than a major release cycle of Scala.
This SIP introduces an annotation `@binaryCompatible` that checks that `what you write is what you get`.
It will fail compilation in case emitted methods or their signatures 
are different from those written by users. 
As long as signatures of methods in source is not changed, `@binaryCompatible` annotated class 
will be compatible across major version of Scala. 

## Use Cases
In case there's a need to develop an API that will be used by clients compiled using different major versions of Scala, 
the current approach is to either develop them in Java or to use best guess to restrict what Scala features should be used.
There's also a different approach which is used by SBT: instead of publishing a binary `compiler-interface`, sources are published instead 
that would be locally compiled.

There's also a use-case of defining a class which is supposed to be also used from Java. 
`@binaryCompatible` will ensure that there are no not-expected methods that would show up in members of a class or an interface.

Dotty currently uses java defined interfaces as public API for IntelliJ in order to ensure binary compatibility. 
These interfaces can be replaced by `@binaryCompatible` annotated traits to reach the same goal.  

## Design Guidelines
`@binaryCompatible` is a feature which is supposed to be used by a small subset of the ecosystem to be binary compatible across major versions of Scala.
Thus this is designed as an advanced feature that is used rarely and thus is intentionally verbose. 
It's designed to provide strong guarantees, in some cases sacrificing ease of use.
 
The limitations enforced by `@binaryCompatible` are designed to be an overapproximation: 
instead of permitting a list of features known to be compatible, `@binaryCompatible` enforces a stronger 
check which is sufficient to promise binary compatibility. 

## Overview ##
In order for a class or a trait to succeed compilation with the `@binaryCompatible` annotation it has to be:
  - defined on the top level;
  - use a subset of Scala that during compilation does not require changes to public API of the class, including
     - synthesizing new members, either concrete or abstract;
     - changing binary signatures of existing members, either concrete or abstract;

`@binaryCompatible` does not change the compilation scheme of a class:
 compiling a class previously annotated with the `@binaryCompatible`, will produce the same bytecode with or without `@binaryCompatible` annotation. 

Below are several examples of classes and traits that succeed compilation with `@binaryCompatible`
```scala
{% highlight scala %}
@binaryCompatible
trait AbstractFile {
  def name(): String

  def path(): String

  def jfile(): Optional[File]
}

@binaryCompatible
trait SourceFile extends AbstractFile {
  def content(): Array[Char]
}

@binaryCompatible
trait Diagnostic {
  def message(): String

  def level(): Int

  def position(): Optional[SourcePosition]
}

@binaryCompatible
object Diagnostic {
  @static final val ERROR: Int = 2
  @static final val WARNING: Int = 1
  @static final val INFO: Int = 0
}

@binaryCompatible
class FeaturesInBodies {
  def apiMethod: Int = {
    // as body of the method isn't part of the public interface, one can use all features of Scala here.
    lazy val result = 0 // while lazy vals are prohibited in the class, they are allowed in the bodies of methods
    result
  }
}
{% endhighlight %}
```

## Features that will fail compilation with `@binaryCompatible`
The features listed below have complex encodings that may change in future versions. We prefer not to compromise on them.
Most of those features can be simulated in a binary compatible way by writing a verbose re-impelemtation 
which won't rely on desugaring performed inside compiler.
Note that while those features are prohibited in the public API, they can be safely used inside bodies of the methods.

  - public fields. Can be simulated by explicitly defining public getters and setters that access a private field;
  - lazy vals. Can be simulated by explicitly writing an implementation in source;
  - case classes. Can be simulated by explicitly defining getters and other members synthesized for a case class(`copy`, `productArity`, `apply`, `unApply`, `unapply`).

The features listed below cannot be easily re-implemented in a class or trait annotated with `@binaryCompatible`.
  - default arguments;
  - default methods. See Addendum;
  - constant types(both explicit and inferred);
  - inline.
    
## `@binaryCompatible` and Scala.js

Allowing to write API-defining classes in Scala instead of Java will allow them to compile with Scala.js, 
which would have benefit of sharing the same source for two ecosystems.

Scala.js currently is binary compatible as long as original bytecode compiled by Scala JVM is binary compatible.
Providing stronger binary compatibility guarantees for JVM will automatically provide stronger guarantees for Scala.js.
 

## Comparison with MiMa ##
The Migration Manager for Scala (MiMa in short) is a tool for diagnosing binary incompatibilities for Scala libraries.
MiMa allows to compare binary APIs of two already compiled classfiles and reports errors if APIs do not match perfectly.

MiMa and `@binaryCompatible` complement each other, as `@binaryCompatible` helps to develop APIs that stay compatible 
across major versions, while MiMa checks that previously published artifacts indeed have the same API.

`@binaryCompatible` does not compare the currently compiled class or trait against previous version, 
so introduction of new members won't be prohibited. This is a use-case for MiMa.
  
MiMa does not indicate how hard, if possible, would it be to maintain compatibility of a class across future versions of Scala.
Multiple features of Scala, most notably lazy vals and traits, has been compiled diffently by different Scala versions
making porting existing compiled bytecode across versions very hard. 
MiMa will complain retroactively that the new version is incompatible with the old one. 
`@binaryCompatible` will instead indicate at compile time that the old version had used features whose encoding is prone to change.
This provides early guidance and warning when designing long-living APIs before they are publicly released.  

## Compilation scheme ##
No modification of typer or any existing phase is planned. The current proposed scheme introduces a late phase that runs before the very bytecode emission that checks that:
 - classes and traits annotated as  `@binaryCompatible` are on the top level; 
 - no non-private members where introduced inside classes and traits annotated as  `@binaryCompatible` by compiler using phase travel;
 - no non-private members inside classes and traits annotated as  `@binaryCompatible` has changed their signature from the one written by developer.

The current prototype is implemented for Dotty and supports everything descibed in this SIP. 
The implementation is simple with less than 50 lines of non-boilerplate code. 
The current implementation has a scope for improvement of error messages that will report domain specific details for disallowed features, but it already prohibits them.

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
`@binaryCompatible` traits.

## See Also ##
 * [dotty#1900](https://github.com/lampepfl/dotty/pull/1900) is an implementation for Dotty
 * [MiMa](https://github.com/typesafehub/migration-manager) 
