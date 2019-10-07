---
layout: sip
title: SIP-NN - Preprocessor for conditional compilation
vote-status: pending
permalink: /sips/:title.html
redirect_from: /sips/pending/preprocessor-for-conditional-compilation.html
---

**By: Stefan Zeiger**

## History

| Date          | Version       |
|---------------|---------------|
| Oct 7th 2019  | Initial Draft |

## Abstract

Following in the tradition of Java, Scala does not have a preprocessor like other C-based languages. This limits conditional compilation to mechanisms outside the language and compiler, usually with separate source directories handled by the build tool and IDE. We propose the addition of a preprocessor based on a subset of C# preprocessor directives that allows more fine-grained conditional compilation within a single Scala source file.

## Motivation

When upgrading projects from Scala 2.12 to 2.13 the changes to the collections library often require minor changes to method signatures and implementation details. This poses a problem for cross-building which is usually required when upgrading a library rather than an application). The [scala-collection-compat](https://github.com/scala/scala-collection-compat) library cannot eliminate all incompatibilities. For the remaining ones the proposed solution consists of separate source directories which limits the differences between cross-builds to entire compilation units. In order to keep code duplication to a minimum this will usually lead to seemingly arbitrary and unnecessary design decisions that are driven solely by the need to cross-build. For example, in scala-collection-compat itself the [PackageShared](https://github.com/scala/scala-collection-compat/blob/master/compat/src/main/scala-2.12/scala/collection/compat/package.scala#L17) trait only exists to limit code duplication between the 2.11 and 2.12 versions, the only difference being two extra methods in the 2.12 version.

While the collection changes are the most prominent use case at the moment, breaking changes have occured in the past and are expected to continue, particularly with the upgrade to Scala 3. Since adoption of new Scala versions benefits from a speedy upgrade of libraries developed by the Scala community, it is in Scala's best interest to make this cross-building scenario as easy as possible, even if only a limited number of developers will use it *directly*.

In addition to abstracting over changes between Scala versions similar cross-building scenarios also occur when targeting [Scala.js](https://www.scala-js.org/) or [Scala Native](http://www.scala-native.org/en/v0.3.9-docs/), or as a side-effect of cross-versioning where different Scala target versions require the use of different, incompatible versions of 3rd-party libraries.

## Other Languages

This section provides a quick overview of features for conditional compilation in some other programming languages.

### C

Using the [C preprocessor](https://en.wikipedia.org/wiki/C_preprocessor) (cpp):
  - Powerful
  - Low-level
  - Error-prone (macro expansion, hygiene)
  - Solves many problems (badly) that Scala doesn't have (e.g. imports, macros)

Languages derived from C like C++ and [C#](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives/) have similar features.

### HTML
[Conditional comments](https://en.wikipedia.org/wiki/Conditional_comment):
  - Allows simple conditional processing.
  - Dangerous errors possible when not supported by tooling (because it appears to be backwards compatible but is really not).

### Rust
Built-in [conditional compilation](https://doc.rust-lang.org/reference/conditional-compilation.html):
  - Predicates are limited to key==value checks, exists(key), any(ps), all(ps), not(p)
  - Configuration options set by the build system (some automatically, like platform and version, others user-definable)
  - Keys are not unique (i.e. every key is associated with a set of values)
  - 3 ways of conditional compilation:
    - `cfg attribute` (*annotation* in Scala) allowed where other attributes are allowed. The annotated element is skipped if the configuration predicate does not match.
    - `cfg_attr` generates attributes conditionally.
    - `cfg` macro includes config values in the source code.
  - Syntactic processing: Excluded source code must be parseable.

Common Lisp has [similar features](https://github.com/scala/scala-dev/issues/640#issuecomment-519009446).

### Java
- No preprocessor or conditional compilation support.
- `static final boolean` flags can be used for conditional compilation of well-typed code.
- Various preprocessing hacks based on preprocessor tools or conditional comments are used in practice.

### Haskell
[Conditional compilation](https://www.haskell.org/cabal/users-guide/developing-packages.html#conditional-compilation) is supported by Cabal:
  - Using cpp with macros provided by Cabal for version-specific compilation

## Status Quo in Scala

The main mechanism in use in Scala codebases today is source-directory-based conditional compilation. Simple cases are supported [out of the box](https://www.scala-sbt.org/1.x/docs/Cross-Build.html#Scala-version+specific+source+directory) by sbt. More complex scenarios can be [added manually](https://github.com/scala/scala-collection-compat/blob/5110e2b29ff856bab6a45f8d57f1a2984bf87064/build.sbt#L73) to the build definition.

[enableIf](https://github.com/ThoughtWorksInc/enableIf.scala) provides macro annotations for conditional compilation. Custom solutions of this kind are also used, for example [in akka-http](https://github.com/akka/akka-http/tree/242eec154a44db87743ef9dcb6ba9ec83c839dea/akka-parsing/src/main/scala/akka/http/ccompat). They follow the Rust / Common Lisp design but suffer from the limitations of macro annotations: They cannot be used to remove top-level templates and they are only allowed in places where other annotations are allowed (e.g. not on import statements). The alternative design presented later in this document can lift these restrictions.

## Motivating Examples

The examples are based on a [branch of akka-http](https://github.com/akka/akka-http/compare/master...szeiger:wip/preprocessor2) that has been updated to use the preprocessor prototype (see below) instead of separate source directories and macro annotations, and on scala-collection-compat.

### Conditional Statements

Typical cross-building uses one or more `#if` directives followed by `#else` and `#endif`:

```scala
package ...
import ...

object MapHelpers {
  /** scaladoc comment */
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] = {
    #if scala213
      Map.empty.concat(jmap.asScala)
    #else
      Map.empty ++ jmap.asScala
    #endif
  }
}
```

In this code `scala213` is a simple preprocessor predicate that checks if the preprocessor configuration option `scala213` has been defined as part of the compiler options. This is done in the build definition similar to how you would define version-specific source directories:

```scala
scalacOptions ++= {
  if(scalaVersion.value.startsWith("2.13.")) Seq("-Cscala213=true")
  else Seq.empty
}
```

With akka-http's macro annotations (or `enableIf` or the alternative preprocessor proposal below) this could still be written in one source file but the method (including a potentially lengthy scaladoc comment) needs to be duplicated:

```scala
package ...
import ...

object MapHelpers {
  /** scaladoc comment */
  @pre213
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty ++ jmap.asScala

  /** scaladoc comment */
  @since213
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty.concat(jmap.asScala)
}
```

Using only separate source directories for cross-building, the entire file needs to be duplicated:

```scala
package ...
import ...

object MapHelpers {
  /** scaladoc comment */
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty ++ jmap.asScala
}
```

```scala
package ...
import ...

object MapHelpers {
  /** scaladoc comment */
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty.concat(jmap.asScala)
}
```

### Top-Level Templates

The preprocessor operates between scanner and parser and is therefore not bound by Scala's syntax. Typical usage keeps nesting levels consistent for better readability and makes only higher-level elements such as groups of statements, methods, templates or imports conditional. This still allows considerable flexibility like in this example which uses a regular package with a trait for Scala 2.13 and a package object with a type alias for 2.12:

```scala
package akka.http.scaladsl.server

#if scala213
  package util {
    // in 2.13 (T*) => U is not a valid type any more,
    // this works on 2.12+ as a drop in replacement
    trait VarArgsFunction1[-T, +U] {
      def apply(alternatives: T*): U
    }
  }
#else
  package object util {
    type VarArgsFunction1[-T, +U] = (T*) => U
  }
#endif
```

These differences could not be handled by macro annotations. Instead you would fall back to using separate source directories. This can be seen nicely in the akka-http codebase: it does have its own macro annocations `@since213` and `@pre213` because they often allow better structured and more concise code that avoids unnecessary duplication but it still uses separate source directories in other cases where the macro annotations are not sufficient.

### Multiple Definitions

A lexical preprocessor makes it straight-forward to make multiple code elements conditional with a single directive. It also avoids the duplication of preprocessor predicates to cover all possible cases (as done in akka-http by pairing up `@since213` and `@pre213`):

```scala
object Allow extends ModeledCompanion[Allow] {
  #if scala213
    def apply(): `Allow` =
      apply(immutable.Seq.empty)
    def apply(firstMethod: HttpMethod, otherMethods: HttpMethod*): Allow =
      apply(firstMethod +: otherMethods)
  #else
    def apply(methods: HttpMethod*): Allow =
      apply(immutable.Seq(methods: _*))
  #endif
  ...
}
```

The original version makes the differences between the two versions harder to spot at a glance:

```scala
object Allow extends ModeledCompanion[Allow] {
  @pre213
  def apply(methods: HttpMethod*): Allow =
    apply(immutable.Seq(methods: _*))
  @since213
  def apply(): `Allow` =
    apply(immutable.Seq.empty)
  @since213
  def apply(firstMethod: HttpMethod, otherMethods: HttpMethod*): Allow =
    apply(firstMethod +: otherMethods)
  ...
}
```

## Design

The Scala preprocessor is integrated between scanner and parser. Syntax and directives are based on a subset of the [C#](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives/) preprocessor (a modern variant of a C-style preprocessor).

### Configuration

*Preprocessor configuration options* are identifier key / string value pairs which are passed to the Scala compiler as compiler options preceded by `-C` (e.g. "`-Cfoo=bar`", similar to system properties which are preceded by `-D`). This is different from C# where the options have boolean values. This allows for better structuring of options where necessary without adding complexity in simpler cases (because you can also check for the existence of an option instead of comparing it to a fixed value). Rust goes even further by associating each key with a set of string values but the benefit is not clear in the context of the Scala preprocessor and it would make the meaning of config value comparisons in preprocessor predicates less intuitive. Unlike in Rust there are no predefined preprocessor options.

### Syntax

A *preprocessor directive* starts with `#` directly followed by the directive name (which may be a Scala keyword or identifier) and occurs on a line of its own. It can be preceded by whitespace and extends to the end of the line. Continuation lines are not supported. For the purpose of semicolon inference in the parser, any preprocessor directive counts as multiple newlines. In other words, the code is parsed as if the preprocessor directives and omitted conditional blocks had been blanked out by spaces. Apart from simplifying the implementation, this makes it easier to reason about semicolon inference in cases where the two lines to consider are separated by an omitted conditional block. When you want to use preprocessor directives within an expression you have to enclose it in parentheses to prevent semicolon inference from splitting the expression.

Only the directives `#if`, `#elif`, `#else` and `#endif` are implemented. In particular, there is no `#define` or `#undef`. All preprocessor configuration options must be passed externally to the compiler. Preprocessor macro definitions or the transparent use of preprocessor configuration options outside of preprocessor directives are a non-goal. The namespace for configuration options is strictly separate from any Scala term or type namespace.

The directives `#if` and `#elif` are followed by a *preprocessor predicate* which extends to the end of the line. It is parsed with the same syntax as a Scala expression but is not executed as regular Scala code. Only a subset of operations are supported by the preprocessor's interpreter:
- An identifier `x` checks for the existence of the configuration option `x`.
- An equality check `x == "y"` checks that configuration option `x` exists and has the string value `"y"`.
- The standard boolean operators `&&`, `||` and `!` are supported.
- Syntactic elements such as triple-quoted strings, method call notation for operators, and parentheses for precedence are supported like in any other Scala expression.

More elaborate checks are a non-goal. The predicate language is deliberately kept simple to prevent it from turning from a declarative configuration language into a full-blown programming language. The goal is to push the computations for configuration options into the build definition (where they would also be when using separate source directories).

The directives `#else` and `#endif` do not take any arguments. No non-whitespace characters may follow on the same line.

It is an error for a line to start with `#` (with optional preceding whitespace) directly followed by a keyword or identifier other than `if`, `elif`, `else` or `endif`. Other preprocessor directives may be added in the future.

The new preprocessor syntax is not 100% compatible with existing Scala code but the impact is low. It requires a rather contrived case of a type projection split across multiple lines to construct a conflict:

```scala
trait A { type B = Int }

val (x: A
          #B) = 1
```

In this example `#B` would be parsed as an unrecognized preprocessor directive, leading to a syntax error. Triggering the preprocessor can be avoided with additional whitespace after the `#`:

```scala
trait A { type B = Int }

val (x: A
          # B) = 1
```

Since preprocessor parsing is performed after Scala tokenization, a preprocessor directive can only occur *between* tokens but not within a token. In particular, preprocessor directives are not recognized within comments (including scaladoc comments) and multi-line string literals.

## Implementation

The preprocessor should be shipped in Scala 2.14 so that it may be used for the transition from 2.14 to 3.0. Backporting to 2.13.x and 2.12.x (behind a compiler flag) is also desirable and should be straight-forward.

A prototype implementation based on Scala 2.13.0 which contains both the preprocessor described so far and the alternative implementation below can be found [in this branch](https://github.com/szeiger/scala/tree/wip/preprocessor). Both implementations can be used simultaneously.

The preprocessor is part of the scanner, filtering the tokens that are ermitted from it while keeping the parser's state consistent. At the same time it requires access to the parser for parsing preprocessor expressions. This can be achieved with an abstract expression parsing method in the scanner that is implemented by the parser. This means that it is no longer possible to instantiate a scanner without a parser but the scanner can still be used directly (after instantiating parser plus scanner). This change did not cause any problems and required only a few small changes in the prototype implementation.

## Drawbacks

### Tooling

Third-party tooling based on the standard Scala parser is expected to continue to work without major changes. Custom parser implementations need to be updated to support the preprocessor syntax. Ignoring the preprocessor after parsing is a sensible default in many cases. For example, an IDE could treat any omitted code block like a comment. This is similar to the current situation with separate source directories where only one set of directories, corresponding to the main build version, contains the sources on which the IDE operates.

Some source-based tools will face bigger difficulties. In particular, source rewriting becomes much more challenging in the presence of conditional code blocks, especially if they do not have to conform to the AST's nesting structure.

### Significant Indentation

A line-based preprocessor like the one proposed here is not well suited for languages with [significant indentation](https://dotty.epfl.ch/docs/reference/other-new-features/indentation.html). Since this was recently added as an experimental feature to Dotty, it is a major concern for this proposal. The preprocessor itself does not care about indentation but users cannot use the desired indentation for preprocessor code to make it more readable because it would interfere with the indentation required by the Scala parser.

For example, this is the most logical indentation of a simple method:

```scala
def f: String =
  #if scala213
    val v = "2.13"
  #else
    val v = "other"
  #endif
  "Version: " + v
```

After preprocessing with `-Cscala213=true` the Scala parser sees the following:

```scala
def f: String =

    val v = "2.13"

  "Version: " + v
```

The indentation of `val v` is seen as the indentation for the whole method and the following line then contains an invalid indentation level. Users have to write the code in a less desirable form like the following to make it work correctly:

```scala
def f: String =
  #if scala213
  val v = "2.13"
  #else
  val v = "other"
  #endif
  "Version: " + v
```

## Alternative Proposal

There are four points where a preprocessor can be injected into the compilation pipeline:

1. Before parsing: This keeps the configuration language separate from Scala. It is the most powerful option that allows arbitrary pieces of source code to be made conditional (or replaced by config values) but it is also difficult to reason about and can be abused to create very unreadable code. For this reason we did not pursue this option any further. Existing implementations like [m4](https://en.wikipedia.org/wiki/M4_(computer_language)) are already available and can be used with Scala.

2. After lexing (e.g. C): It avoids some of the ugly corner cases of the first option (like being able to make the beginning or end of a comment conditional) while still being very flexible. Tokenization rules do not change very often or very much so that cross-compiling to multiple Scala versions should be easy.

3. After parsing (e.g. Rust): It limits what can be made conditional (e.g. only single methods but not groups of multiple methods with a single directive) and requires valid syntax in all conditional parts. It cannot be used for version-dependent compilation that requires new syntax not supported by the older versions.

4. After typechecking: This is too limiting in practice and was therefore not explored further.

The main proposal above uses the second approach. We also explored a Rust-style (3.) preprocessor based on annotations as an alternative. This is similar to `enableIf` but it uses a pseudo-annotation `@if` instead of a macro annotation. This lifts the restrictions on modifying top-level templates because the processing can be done before type-checking.

The original example from the beginning of this document would look like this:

```scala
package ...
import ...

object MapHelpers {
  /** scaladoc comment */
  @if(!scala213)
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty ++ jmap.asScala

  /** scaladoc comment */
  @if(scala213)
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] =
    Map.empty.concat(jmap.asScala)
}
```

Alternatively, a local definition can be used to avoid duplicating the method:

```scala
object MapHelpers {
  /** scaladoc comment */
  def convertMapToScala[K, V](jmap: JMap[K, V]): Map[K, V] = {
    @if(!scala213) val m = Map.empty ++ jmap.asScala
    @if(scala213) val m = Map.empty.concat(jmap.asScala)
    m
  }
}
```

More extensive examples can be found in these branches of [akka-http](https://github.com/akka/akka-http/compare/master...szeiger:wip/preprocessor1) and [scala-collections-compat](https://github.com/scala/scala-collection-compat/compare/master...szeiger:wip/preprocessor-test) which have been updated to perform all cross-building using the alternative preprocessor. (Note that this is supposed to show what is possible, not what is recommended; in practice the preprocessor should be combined with directory-based cross-compiling; see below under trade-offs for details.)

### Syntax

Conditional compilation is done with a pseudo-annotation called `@if`. Since `if` is a keyword it cannot be used as a regular annotation name (you would have to write `` @`if` `` instead). It takes one argument, the preprocessor predicate.

`@if` can be used in the following places:
- Wherever normal annotations are allowed
- In front of package objects
- In front of `packge p { ... }` style package definitions (but not `package p; ...`)
- In front of `import` statements

### Implementation

The preprocessor runs in the new `preprocessor` phase directly after `parser`. It evaluates all preprocessor annotations, removing both the annotations themselves and all trees for which the predicates evaluate to `false`. The effect is the same as if the annotated part was not there in the first place. No typechecking is attempted on the removed parts and no names are entered into symbol tables.

### Trade-Offs

Compared to the main proposal, the alternative has the following advantages:

- No previously valid Scala code becomes invalid.

- Simpler implementation that avoids introducing additional complexity in the parser. Some changes are still required to allow the new pseudo-annotation in places where other annotations are forbidden.

- Works equally well with braces- and indentation-based syntax.

The disadvantages are:

- All conditional code has to be syntactically valid for all Scala versions. For example, in akka-http, the following does not compile:

  ```scala
  @if(!scala213)
  package object util {
    type VarArgsFunction1[-T, +U] = (T*) => U
  }
  
  @if(scala213)
  package util {
    trait VarArgsFunction1[-T, +U] {
      def apply(alternatives: T*): U
    }
  }
  ```

  This is because the varargs function type signature `(T*) => U` is rejected by the Scala 2.13 parser. In cases like this where existing syntax is removed it could easily be done in a later compiler phase instead of the parser, but this does not work when new syntax is introduced. For example, when cross-building between Scala 2.13, 2.14 and 3.0 it would not be possible to use `implicit` in 2.13/2.14 and `given` in 3.0 unless the 2.13 and 2.14 parsers were retroactively modified in a patch release to support the new syntax (and reject it only if it makes it past the `preprocessor` phase).

- No *if...then...else* form possible. Many conditional compilation decisions are of this form. The annotation-based syntax appears simpler at first glance because it doesn't require an `#endif` directive but this is offset by the repetition of the predicate. This repetition also makes code less readable; missing cases are easier to overlook.

- It is not possible to handle multiple definitions with a single annotation, which leads to even more repetition of predicates.

- When duplicating methods due to changes in the signature, the scaladoc comment has to be repeated in all versions of the method.

Overall, this alternative covers *some* of the use-cases well but not all of them. It complements the use of separate source directories nicely (in particular for small, isolated changes in large source files) but cannot replace it. This is evident in the current akka-http build which already has two macro annotations `@pre213` and `@since213` (corresponding to `@if(!scala213)` and `@if(scala213)`) which are used in parts of the codebase, but other parts still use separate source directories.

## References

- [scala-dev ticket with previous discussion](https://github.com/scala/scala-dev/issues/640)
- [Additional discussion on gitter](https://gitter.im/scala/contributors?at=5d95612f49c7720aaf56830d)
- [Original announcement and discussion on Contributors Discourse](https://contributors.scala-lang.org/t/summer-of-usability/3484)
