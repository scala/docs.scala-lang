---
layout: sip
title: SIP-28 and SIP-29 - Inline meta
vote-status: dormant
vote-text: This proposal needs an owner.
permalink: /sips/:title.html
redirect_from: /sips/pending/inline-meta.html
---

**By: Eugene Burmako, Sébastien Doeraene, Vojin Jovanovic, Martin Odersky, Dmitry Petrashko, Denys Shabalin**

## History

| Date           | Version                                      |
| ---------------|----------------------------------------------|
| Aug 22nd 2016  | Initial Pre-SIP                              |
| Sep 9th 2016   | Initial SIP                                  |

## Preface

This document represents the culmination of a design process that spans several years.
We did our best to extensively evaluate the design space and comprehensively document our findings.

As a result, this is going to be a very long read. If you're just interested in getting a quick idea
of the proposal, you can read just the ["Intuition"][Intuition] section.

## Motivation

Def macros and macro annotations have become an integral
part of the Scala ecosystem. They marry metaprogramming with types
and work in synergy with other language features, enabling [practically important use cases][MacroUsecases].

However, in addition to having the reputation of an indispensable tool, Scala macros have also gained notoriety
as an arcane and brittle technology. The most common criticisms of Scala macros concern their
subpar tool support and overcomplicated metaprogramming API powered by scala.reflect.

While trying to fix these problems via evolutionary changes to the current macro system,
we have realized that they are all caused by the decision to use compiler internals as the underlying metaprogramming API.
Extensive use of desugarings and existence of multiple independent program representations may have worked well
for compiler development, but they turned out to be inadequate for a public API.

The realization that we cannot make meaningful progress while staying within the confines of scala.reflect
meant that our macro system needs a redesign. We took the best part of the current macros - their smooth integration
into the language - and discarded the rest, replacing scala.reflect with a better metaprogramming API
and coming up with a lightweight declaration syntax. In this document, we present the current version of the design.

## Table of contents

  * [Intuition](#intuition)
    * [Def macros](#def-macros)
    * [Discussion](#discussion)
    * [Inline/meta](#inlinemeta)
  * [Language features](#language-features)
    * [Inline definitions](#inline-definitions)
    * [Inline reduction](#inline-reduction)
    * [Meta expressions](#meta-expressions)
    * [Meta expansion](#meta-expansion)
    * [Meta APIs](#meta-apis)
  * [Design considerations](#design-considerations)
    * [Scala.meta](#scalameta)
    * [Tool support](#tool-support)
    * [Losing whiteboxity](#losing-whiteboxity)
    * [Losing compiler internals](#losing-compiler-internals)
    * [Macro annotations](#macro-annotations)
    * [Why inline](#why-inline)
    * [Out of scope](#out-of-scope)
  * [Conclusion](#conclusion)
  * [Credits](#credits)

## Intuition

In this section, we will walk through writing and using compile-time metaprograms that implement a subset of functionality
expected of language-integrated queries. Without going into much detail,
we will obtain high-level intuition behind the underlying mechanisms

[Language-integrated query][Linq] is a technique that achieves smooth integration of database queries with programming languages.
A common approach to LINQ, popularized by .NET Framework 3.5, consists in representing datasources
by collection-like library types and then allowing users to write queries as series of calls to these types
using familiar higher-order methods like `map`, `filter` and others.

We will now develop a sketch of a database access library built in the spirit of LINQ.
In this sketch, we will intentionally forgo the practicalities of building a LINQ library
(e.g. mapping from classes to datasources, design of internal ASTs, error reporting, etc.)
in order to clearly illustrate the role played by compile-time metaprogramming.

Below we define a trait `Query[T]` that encapsulates a query returning a collection
of objects of type `T`. Next to it, we define its children `Table` and `Map` that represent
particular types of queries. `Table` stands for a datasource that knows about the underlying type
(in this sketch, we use an imaginary typeclass `TypeInfo` for that purpose).
`Map` models a restricted subset of SQL SELECT statements via a simple `Node` AST.

```
trait Query[T]
case class Table[T: TypeInfo]() extends Query[T]
case class Select[T, U](q: Query[T], fn: Node[U]) extends Query[U]

trait Node[T]
case class Ref[T](name: String) extends Node[T]

object Database {
  def execute[T](q: Query[T]): List[T] = { ... }
}
```

In this model, a SQL query string `"SELECT name FROM users"` is represented as `Select(Table[User](), Ref[String]("name"))`.
Queries like the one just mentioned can be run via `Database.execute` that translates them into SQL, sends the SQL to the database,
receives the response and finally translates it to data objects. For the sake of simplicity, we will assume such implementation as a given.

The key aspect of a LINQ facility is a convenient notation for queries.
Arguably, none of the aforementioned ways to write queries can be called convenient.
SQL, as any string-based representation, is prone to syntax errors, type errors and injections.
Explicit instantiation of `Query` objects is very verbose, and still doesn't solve all type errors.

In this sketch, we define a LINQ API in the form of methods that mirror the collection API
from the standard library. We would like our users to be able to encode queries in intuitively looking,
statically typed calls to this API, e.g. `users.map(u => u.name)`, and then have our library translate these
calls into calls to `Query` constructors.

```
object Query {
  implicit class QueryApi[T](q: Query[T]) {
    def map[U](fn: T => U): Query[U] = { ... }
  }
}

case class User(name: String)
val users = Table[User]()
users.map(u => u.name)
// translated to: Select(users, Ref[String]("name"))
```

Among other ways, the desired effect can be achieved with compile-time metaprogramming.
A metaprogram that runs at compile time can detect all calls to `Query.map` and rewrite them
to invocations of `Select` with parameters of `map` transformed to corresponding instances of `Node`.

### Def macros

Before looking into the design of the new macro system, let's see how the problem at hand
can be solved using the currently available macro system.

```
import scala.language.experimental.macros

object Query {
  implicit class QueryApi[T](q: Query[T]) {
    def map[U](fn: T => U): Query[U] = macro QueryMacros.map
  }
}
```

`QueryApi.map` is called a macro def. Since macros are experimental,
in order to define a macro def, it is required to either have `import scala.language.experimental.macros`
in the lexical scope of the definition or to enable the corresponding setting in compiler flags.
This is only necessary to define a macro def, not to use it.

Macro defs look like normal methods in the sense that
they can have term parameters, type parameters and return types.
Just like regular methods, macro defs can be declared either inside or outside of classes,
can be monomorphic or polymorphic, and can participate in type inference and implicit search.
Refer to [Appendix A][AppendixInteraction] for a detailed account of differences
between macro defs and regular defs.

Bodies of macro defs have an unusual syntax. The body of a macro def starts with the conditional keyword `macro` and
is followed by a possibly qualified identifier that refers to a macro impl,
an associated metaprogram run by the compiler when it encounters corresponding macro applications.
Macro impls are defined as shown below.

```
import scala.reflect.macros.blackbox.Context

object QueryMacros {
  def map(c: Context)(fn: c.Tree): c.Tree = {
    import c.universe._
    ...
  }
}
```

Macro impls take a compiler context that represents the entry point into the macro API.
The macro API consists of a general-purpose metaprogramming toolkit provided by scala.reflect
and several specialized facilities exclusive to macro expansion.
A typical first line of a macro impl is `import c.universe._` that makes the entire scala.reflect API available to the metaprogrammer.

In addition to the compiler context, for every term parameter of a macro def, its macro impl
takes a term parameter that carries a representation of the corresponding argument of the macro application.
Macro impls can also get ahold of representation of type arguments, but this functionality is unnecessary for this example.

A macro impl returns an abstract syntax tree, and this AST replaces the original macro application in the compilation pipeline.
This is how we're going to perform the LINQ translation of calls to `Query.map`.

```
import scala.reflect.macros.blackbox.Context

object QueryMacros {
  def map(c: Context)(fn: c.Tree): c.Tree = {
    import c.universe._

    // c.prefix looks like:
    // Query.QueryApi[<T>](<prefix>)
    val q"$_.$_[$_]($prefix)" = c.prefix

    val node: Tree = fn match {
      case q"($param) => $body" =>
        val sym = param.symbol
        body match {
          case q"$qual.$_" if qual.symbol == sym =>
            q"Ref[${body.tpe}](${sym.name.decodedName.toString})"
        }
    }

    q"Select($prefix, $node)"
  }
}
```

In the listing above, we handle several challenges of macro writing.
First, we get ahold of the prefix of the application, i.e. the `users` part of `users.map(u => u.name)`.
Unlike macro arguments, prefixes aren't mapped onto parameters of macro impls,
so we need to use the dedicated `c.prefix` API.

The next challenge is to extract the prefix from the macro application.
Since `Query.map` is an extension method, the actual prefix is going to be `QueryApi(users)`, not `users`,
therefore we need to apply some non-trivial effort.

One way of getting to the query is to access the corresponding field of the implicit class,
doing something like `QueryApi(users).q`. Unfortunately, this is out of the question, because `q` is private,
and we cannot make it public without adding an extension method called `q` to `Query`.

Another way of achieving the desired result is to take apart the abstract syntax tree representing `QueryApi(users)`,
extracting `users` as the argument of the application.
It looks like quasiquotes,
which are supposed to provide a convenient WYSIWYG interface to deconstructing Scala code,
are going to be a perfect fit.

Unfortunately for macro writers, the Scala compiler heavily desugars code during compilation,
so even the modest `QueryApi(users)`
will get to the macro impl in the form of `Query.QueryApi[User](users)`.
Therefore the naive `q"$_($query)"` quasiquote is not going to work,
and we need to apply additional effort. With a bit of knowledge about compiler internals,
we take care of this.

The final challenge is code generation.
The pattern match in listing above transforms the user-provided lambda expression into an equivalent `Node`.
Since our sketch only supports `Ref`, we only support simple lambdas that select a field from a parameter.
Finally, we produce the macro expansion that has the desired shape.

### Discussion

Note how the ability of def macros to access types dramatically improves user experience in comparison with purely syntactic translation.
First, even before `Query.map` gets to expand, the compiler typechecks its argument, making sure that
queries are well-typed. Secondly, we have a way to reliably check the shape of the supported lambda.
The symbol comparison in the nested pattern match makes sure that
the qualifier of field selection refers precisely to the parameter of the lambda
and not to something else accidentally having the same name. Finally, we use information about the type of the body
in order to figure our the mandatory type parameter of `Ref`.

Also note another piece of knowledge about compiler internals that was essential to robust operation of the macro.
When generating a `Ref`, we can't simply call `sym.name.toString`, because the Scala compiler internally mangles non-alphanumeric names.
If the parameter of the lambda has such a name, a simple `toString` will produce unsatisfying results,
which is why we have to call `Name.decodedName` first.

Before we conclude, let's highlight a very common metaprogramming mistake that we've just made in `QueryMacros.map`.
Def macros are unhygienic, which means that they don't prevent inadvertent name capture, i.e. scenarios like the following.

```
val Select = "hijacked!"
users.map(u => u.name)

// error: too many arguments for
// method apply: (index: Int)Char in class StringOps
//    users.map(u => u.name)
//             ^
```

If the macro user accidentally defines a term called `Select` or `Ref`, our macro is going to stop working
with what looks like a nonsensical error message. Because principled tool support wasn't among the design goals of
our macro system, a macro user getting this error is mostly helpless apart from trying to use internal compiler options
that print all macro expansions and then going through the resulting wall of text.

One reliable approach to prevent hygiene errors is to use fully-qualified names for external references and
to generate unique names for local variables. A somewhat more concise, but potentially much more laborious approach is to explicitly
assign symbols to references and definitions emitted in macro expansions.
This approach often requires extensive knowledge of compiler internals, so it is less frequent in the wild.
Common to both of these approaches is that they require explicit attention from metaprogrammers and
failures to apply them typically go unnoticed.

To sum it up, even in this simple macro we encountered situations where knowledge of compiler internals
(the desugaring of the `QueryApi` application, the fact that non-alphanumeric names are encoded) was essential.
We also ran into problems with tool support and hygiene, which demonstrates how important they are to a macro system.
These are all common criticisms of def macros.

### Inline/meta

User interface of def macros is a seamless extension to the existing language interface.
Thanks to macro defs looking like regular methods and macro applications looking like regular method applications,
macro users are likely to not even realize that they are using macros.

Unfortunately, metaprogrammer interface leaves much to be desired. First, in the current macro system,
metaprograms have to be defined separately from their signatures, typically involving helper objects and
duplication of parameters. Secondly, the underlying metaprogramming API requires
knowing bits and pieces of compiler internals. For example, in the case of `Query.map`,
the metaprogrammer had to know the internal representation of the `QueryApi` application
and internal details of how names are represented.

New-style macros provide the same user interface, and at the same time significantly improve metaprogrammer
interface by enabling lightweight macro declaration syntax and using a better metaprogramming API.

```
object Query {
  implicit class QueryApi[T](q: Query[T]) {
    inline def map[U](fn: T => U): Query[U] = meta {
      import scala.meta._

      val q"$_($prefix)" = this

      val node: Tree = fn match {
        case q"($name: $_) => $body" =>
          body match {
            case q"$qual.$_" if qual =:= name =>
              q"Ref[${body.tpe}](${name.toString})"
          }
      }

      q"Select($prefix, $node)"
    }
  }
}
```

At a glance, new-style macros simply forgo a noticeable amount of ceremony,
merging the previously disparate macro defs and macro impls as well as swapping around a few keywords in the process.
The underlying metaprogram doesn't seem to have changed much,
still using quasiquotes and key APIs like `Tree.tpe` and `Name.toString`.

First impression notwithstanding, the new design revamps a lot of underlying mechanisms.
Below we provide a high-level overview of our new approach to compile-time metaprogramming,
and refer curious readers to ["Language features"][LanguageFeatures] for information concerning the new expansion mechanism
and to ["Scala.meta"][ScalaMetaSection] for details about the new metaprogramming API.

**Expansion mechanism**. The new design takes the notions of inlining and compile-time execution
from the current macro system and turns them into separate language features.

The goal of the `inline` modifier on `Query.map` is to signify that applications of this method are inlined,
i.e. replaced with the method body, in which references to enclosing `this`, self, and formal parameters are rewritten accordingly
(see ["Inline reduction"][InlineExpansion] for details).

The goal of the `meta` keyword is to demarcate code that executes at compile time and to provide
that code with [scala.meta capabilities][MetaApis].
The metaprogram written inside the meta scope has access to multiple implicit capabilities
and can get ahold of representations of certain values and types from lexical scope.
The compiler runs this metaprogram, interprets its result as an abstract syntax tree
and replaces the meta expression with that tree (see ["Meta expansion"][MetaExpansion] for details).

When the compiler encounters a call to `Query.map`,
it simply inlines the body of `map` into the callsite without performing any compile-time function execution.
For the running example of `users.map(u => u.name)`,
this inlining produces the result illustrated in the listing below.

```
{
  val prefix$1: QueryApi = QueryApi(users)
  val fn$1: User => String = u => u.name
  meta {
    import scala.meta._

    val q"$_($prefix)" = q"QueryApi(users)"

    val node: Tree = q"u => u.name" match {
      case q"($name: $_) => $body" =>
        body match {
          case q"$qual.$_" if qual =:= name =>
            q"Ref[${body.tpe}](${name.toString})"
        }
    }

    q"Select($prefix, $node)"
  }
}
```

Before inlining a method application, the compiler first hoists the prefix and by-value arguments of the application
into temporary variables. This is done in order to guarantee that applications of inline methods
are semantically equivalent to applications of regular methods.

Afterwards, the compiler replaces the application with a block that consists of hoisted values and the transformed method body.
In the method body, all regular references to `this` and self as well as
by-value parameters are rewritten to references to the corresponding temporary variables.
If such references are part of a meta scope, they are replaced with scala.meta-based representations of
the prefix and the corresponding arguments, without going into temporary variables.

When the compiler comes across a meta expression that isn't part of an inline method,
it executes the code inside the expression and replaces the expression with the result of execution.
For our running example, this produces the desired expansion that invokes query constructors corresponding
to the LINQ notation.

**New metaprogramming API**. Scala.meta noticeably improves on scala.reflect in the convenience of the API
and no longer requires metaprogrammers to understand compiler internals in order to write macros.

In particular, we don't need to know that construction of the implicit class involves
expanding the reference to `QueryApi` into a fully-qualified name and inferring the missing type argument.
The particular implementation of the scala.meta API that runs the meta expression may or may not
do these desugarings, and scala.meta shields us from this fact.
We can use the WYSIWYG pattern `q"$_($prefix)"` in order to unwrap the original prefix of the call.

Moreover, we don't have to worry about the compiler internally mangling non-alphanumeric names.
Again, even if the underlying macro engine internally does name mangling, scala.meta abstracts away such implementation details.

Finally, we are able to improve on scala.reflect thanks to more precise quasiquotes.
If in the current macro system, we used `q"($name: $_) => ..."` to match the `fn` argument,
`name` would capture a scala.reflect `Name` that doesn't carry any semantic information.
In scala.meta, names are full-fledged trees, so we can use `Tree.=:=` to semantically compare the name
with the qualifier of the field selection.

In order to use semantic APIs, scala.meta metaprograms need the [mirror capability][ScalaMetaSection],
so it is implicitly provided inside meta scopes. As a result, meta expressions can use the full spectrum
of APIs available in scala.meta.

**To put it in a nutshell**, the new-style macro system combines two language features:
[inline definitions][InlineDefs] and [meta expressions][MetaExprs]
in order to provide a more lightweight syntax for the current def macros. Moreover, this macro system
does a switchover from scala.reflect to scala.meta, featuring a new API that is more convenient and
doesn't require compiler knowledge to be utilized effectively.

## Language features

### Inline definitions

We introduce a new reserved word: `inline`, which can be used as a modifier for
concrete vals, concrete methods and parameters of inline methods, as illustrated in the listing below.

```
inline val x = 4

inline def square(x: Double) = x * x

inline def pow(b: Double, inline n: Int): Double = {
  if (n == 0) 1
  else b * pow(b, n - 1)
}
```

Inline vals are guaranteed to be compile-time constants, superseding the existing approach
of declaring such constants with `final val`. Inline parameters get the same treatment, adding a previously
non-existent functionality of guaranteeing that an argument of a method is a compile-time constant.

A value is considered to be a compile-time constant if it is a Scala literal,
or it is equivalent to one by the means of inline/meta expansion and constant folding.
Future work may extend this notion to custom classes, but this discussion lies outside the scope of this proposal.

Inline defs are guaranteed to be inlined at compile time, superseding the existing approach of
annotating methods with the `@inline` annotation. After introducing `inline`, we expect to deprecate and phase out `@inline`.

The problem with `@inline` is that it doesn't provide guarantees.
As specified in documentation,
`@inline` tells the compiler to "try especially hard to inline the annotated method".
However, different backends interpret this request differently.
The JVM backend ignores this annotation if optimizations are disabled and sometimes skips inlining even when optimizations are enabled.
Both Scala.js and Scala Native always inline methods that are marked with this annotation.
In contrast, `inline` achieves guaranteed inlining, regardless of the backend.

Inline defs are very similar to macro defs in the sense that they look like regular defs and that they expand at compile time.
As a result, the rules in [Appendix A][AppendixInteraction] also apply to inline defs with three exceptions.

  1. Inline defs are effectively final; they cannot be overridden. Inline members also never override other members.
The idea of allowing macro defs to override regular defs didn't find compelling use cases, so we prohibit this for inline defs.

  1. Inline defs can have default parameters. Not supporting default parameters for macro defs was an oversight
of the initial design, so now we fix this oversight in the new macro system.

  1. Inline defs have regular bodies, just like regular defs. When an inline def is typechecked, its body
is typechecked according to the usual rules, which means that inline defs are eligible for return type inference. If an inline def
doesn't explicitly specify its result type, the result type gets inferred from the type of its body.

### Inline reduction

When the compiler encounters certain patterns of code that involve references to inline vals and applications of inline defs,
it will perform the rewritings provided below, if and only if these patterns appear outside the bodies of inline vals and defs.

  1. If `prefix.v` refers to an inline value, replace the expression with the body of `v`.

  1. If `prefix.f[Ts](args1)...(argsN)` refers to a fully applied inline method, hoist the prefix and the arguments
into temporary variables with fresh names and then replace the expression with the method body. In the body, replace parameter references
with references to temporary variables created for the corresponding arguments. Also, replace enclosing `this`
and self references with references to the temporary variable created for the prefix.

    ```
    {
      val prefix$1 = prefix
      val param1$1 = arg1
      ...
      val paramN$1 = argN
      <transformed body of f>
    }
    ```

    The hoisting is intended to preserve the semantics of method applications under inlining.
    A method call should have the same semantics with respect to side effects independently
    on whether the method was made inline or not.
    If an inline method has by-name parameters, then corresponding arguments are not hoisted.

    The rewriting is done in accordance with hygiene. Any references from the method body to its lexical scope
    will be kept in the rewritten code. If the result of the rewriting references private or protected definitions
    in the class that defines the inline method, these references will be changed to use accessors generated automatically by the compiler.
    To ensure that the rewriting works in the separate compilation setting,
    it is critical for the compiler to generate the accessors in advance.
    Most of these accessors can be pregenerated by analyzing the bodies of inline methods,
    except for members that are referred to inside meta scopes.
    Such references are disallowed, because it is impossible to generate them in advance.

  1. If `prefix.f[Ts](args1)...(argsN)` refers to a partially applied inline method, an error is raised.
Eta expansion of inline methods is prohibited.

The rules of inline reduction are similar to the rules of feature interaction for macro applications ([Appendix A][AppendixInteraction])
as well as relevant parts of the rules of def macro expansion ([Appendix B][AppendixExpansion]) with four exceptions.

  1. Inline reductions in their current form preclude whitebox expansion.
Since bodies of inline vals and defs are typechecked when their definitions are typechecked,
potential meta expansions that may happen afterwards won't be able to change their types.
Implications of this are discussed in ["Losing whiteboxity"][Whiteboxity].

  1. By-value and by-name arguments behave differently. By-value arguments are hoisted in temporary variables,
while by-name arguments remain as they were. This doesn't affect meta expansions,
but it does make a semantic difference for parts of inline definitions that are not inside meta scopes.
Note that `this` and self references always follow the by-value scheme,
because there is no syntax in Scala that allows to define them as by-name.

  1. Named and default arguments are fully supported. Again, not including them in the initial release of def macros
was an oversight, which is now fixed.

  1. The rules of rewriting mandate the "outside in" style, i.e. calls to inline methods are expanded before possible calls
to inline methods in their prefixes and arguments. This is different from how the "inside out" style of def macros,
where prefixes and arguments are expanded first. Previously, it was very challenging to
take a look at unexpanded trees, but now the metaprogrammer can switch between unexpanded and expanded views using scala.meta.

From the discussion above, we can see that inline reduction closely resembles the inlining aspect of the current macro system.
The only significant difference is lack of support for whitebox expansion, which will be discussed in ["Losing whiteboxity"][Whiteboxity].

### Meta expressions

A meta expression is an expression of the form `meta { ... }`, where `{ ... }` is some block of Scala code, called meta scope.
(In fact, `meta` may prefix arbitrary expressions, but blocks are expected to be used most commonly).

Meta expressions can appear both
in the bodies of inline methods (then their expansion is going to be deferred until the enclosing method expands)
and in normal code (in that case, their expansion will take place immediately at the place where the meta expression is written).

Meta scopes can contain arbitrary code, but they must return values that are either of type `scala.meta.Term` or are convertible
to it via the `scala.meta.Lift` typeclass. There are standard instances of the typeclass that lift simple values to literals
as well as ones that support frequently used collections of liftable values. Metaprogrammers may define and use their own instances
as long as they are available in corresponding meta scopes.

Inside meta scopes, metaprogrammers can use a combination of general-purpose and expansion-specific metaprogramming facilities.
Refer to ["Meta APIs"][MetaApis] for more information.

Since meta scopes must return scala.meta trees, and scala.meta trees are by design statically untyped,
the type of meta expressions can't be computed from the inside
and has to come from the outside. Therefore, meta expressions can only be used in contexts that specify an expected type.

```
// allowed, expected type provided by the return type
inline def map[U](fn: T => U): Query[U] = meta { ... }

// not allowed, no explicit return type
val x = meta { ... }

// allowed, expected type of a condition is Boolean
if (meta(T.isPrimitive)) { ... }
```

Meta scopes can reference names in their lexical scope outside the enclosing meta expression.
While crossing the `meta` boundary, references change their meaning.
Concretely, here's how the transformation works for different references:

**Inline vals and inline parameters**. These are guaranteed to be compile-time constants,
so an inline value of type `T` is available inside a meta scope as a regular value of type `T`.

**Inline defs**. When viewed from within a meta scope, inline defs become tree transformers.
Types of their inline parameters are unchanged, their non-inline parameters and return type become typed as `scala.meta.Term`.
For example, `inline def pow(b: Double, inline n: Int): Double` transforms into
`def pow(b: scala.meta.Term, n: Int): scala.meta.Term`.

**Term parameters of an inline method**. References to statically known term parameters,
enclosing `this` or self become values of type `scala.meta.Term`. This is similar to `c.Expr`/`c.Tree`
parameters of macro impls, but more lightweight, because there's no need
to declare these parameters explicitly.

**Type parameters of an inline method**. References to statically known type parameters become values
of type `scala.meta.Type`. This is similar to `c.WeakTypeTag` parameters of macro impls,
but more lightweight, because metaprogrammers don't need to explicitly manifest their interest in given type parameters
in order to get access to their representations.

This rule can create clashes between term and type namespaces.
If such a clash happens, i.e. if a reference to a type parameter is ambiguous with an eponymous term,
the compiler emits an error. This is regrettable, but Scala naming conventions make this situation unlikely,
and there is always a workaround of renaming the type parameter.

**Global definitions**. Statically available types and terms, e.g. `List` or `Int`,
are usable inside meta scopes as themselves. This means that meta expressions, just like macro impls,
can use the standard library and arbitrary third-party libraries.

**Other definitions**. Macro scopes cannot reference definitions that don't fall into one of the categories mentioned above.
This outlaws usages of local definitions - both terms and types. Such definitions may refer to state that only
exists at runtime, so we prohibit them altogether. This has no analogues in the current macro system, because macro impls
must be defined in static methods, which means that by definition their scope cannot contain local definitions.

In other words, definitions that are statically available outside meta scopes remain available in meta scopes,
term and type arguments of inline methods become available as their representations,
while signatures of inline methods are recursively transformed according to the rules above.

From the discussion above, we can see that meta expressions provide an analogue of the compile-time execution part
of the current macro system. In addition to achieving feature parity, meta expressions also improve on the corresponding part of def macros
by allowing metaprograms to easily obtain representations of their term and type parameters and
making it possible to run anonymous snippets of metaprogramming code without wrapping them in a dedicated macro.

### Meta expansion

When the compiler encounters a meta expression that appears outside the bodies of inline vals and defs,
it expands that expression as described below.

A meta expression is expanded by evaluating its body and replacing the original meta expression with an expression
that represents the result of the evaluation. The compiler is responsible for providing [the capabilities][MetaApis]
necessary for meta scopes to evaluate and for converting between its internal representation for language model elements
and representations defined in scala.meta, such as `scala.meta.Term` and `scala.meta.Type`.

Meta expansion works very similarly to the relevant part of the def macro expansion pipeline ([Appendix B][AppendixExpansion]).
Code in the meta scope is precompiled and then reflectively invoked by the compiler, sharing the class loader with other
metaprograms run inside the compiler. Expansion can return normally or can be interrupted with an exception. Expansion results
are typechecked against the expected type of the meta expression. Typecheck results are upcast to the expected type in blackbox style,
as discussed in ["Losing whiteboxity"][Whiteboxity].

Another practicality of meta expansion is the protocol of communication between `inline` and `meta`.
On the one hand, a reasonable default for inlining that doesn't involve meta expressions is to hoist prefixes and by-value arguments
as described in ["Inline reduction"][InlineExpansion]. On the other hand, macro writers default to having unfettered access to
abstract syntax trees without needing to write additional boilerplate.
These two design preferences are at odds with each other.

Therefore, in our design `inline` both hoists eligible components of inline applications and passes their original
representations into meta expressions. This way, both defaults are satisfied and, additionally, if meta expressions need
to hoist something, they can use the new `hoist` API.

In the case when an inline method consists in a single meta expression, the new macro engine removes temporary variables
that are produced by hoisting and aren't claimed by `hoist`. In the case when an inline method doesn't contain
meta expressions, all temporary variables are retained, because they are necessary to express method application semantics.
Finally, in the case of a hybrid inline method, meta expressions can look into representations of hoisted expressions,
but they cannot use them in their expansions without calling `hoist` first in order to avoid reordering or duplicating side effects.

In a nutshell, meta expansion closely resembles the compile-time execution aspect of the current macro system.
The only nuance is the interaction with hoisting performed by the mechanism of inline reduction.

### Meta APIs

In scala.meta, all APIs are available out of the box after doing `import scala.meta._`.
However, in order to use most of them, metaprogrammers must have access to certain capabilities
(see ["Scala.meta"][ScalaMetaSection] for details).

Meta scopes provide two different capabilities. First, there are general-purpose metaprogramming facilities,
enabled by a `Mirror`. Secondly, there are expansion-specific facilities enabled via a newly introduced `Expansion`.

Mirrors are explained in ["Scala.meta"][ScalaMetaSection], and in this section
we will cover the functionality enabled by expansions. We will also compare this functionality
with macro APIs from the current macro system.

First, `Context.prefix` is no longer necessary,
because meta expressions can refer to prefixes of enclosing inline definitions via `this`.
`Context.macroApplication` is unnecessary as well, because meta expressions may be written outside inline vals and defs,
which means that they won't have a corresponding application at all. In the rare cases when it is useful to know
the position that spans the entire inline application, it can be obtained by traversing prefixes or arguments via `Tree.parent`.

Secondly, much like their counterparts in the current macro system, meta APIs support diagnostic messages.
Since the only prevalent macro APIs in this group is `Context.abort`, with `Context.error`, `Context.warning`
and others seeing rare use, we only expose `abort` that works similarly to its predecessor.

Thirdly, we no longer expose APIs that tightly integrate with compiler internals. Most of these APIs take care
of the limitations of the scala.reflect language model, so in the new metaprogramming framework based on scala.meta
they are simply unnecessary. Others feature advanced functionality that accesses or manipulates internal compiler state,
and this exactly the kind of thing that we would like to avoid in the macro system. We discuss the implications in
["Losing compiler internals"][CompilerInternals].

Finally, we also support `hoist`, which takes a `scala.meta.Term`, precomputes it in a temporary variable
outside the meta expansion and returns a reference to it.
Apart from `inline`-compatible precomputation of prefixes and arguments,
this functionality seems relevant to solving the problem of sharing expansions of [implicit materializers][Materialization],
so we are confident that it's a useful addition to the macro API.

## Design considerations

### Scala.meta

Scala.meta is a clean-room implementation of a metaprogramming toolkit for Scala,
designed to be simple, robust and portable. We are striving for scala.meta to become a successor of scala.reflect,
the current de facto standard in the Scala ecosystem.

We have recently released Scala.meta 1.0.0 that features support for syntactic APIs, such as parsing, tokenization,
quasiquotes and prettyprinting. We are currently working on Scala.meta v2 that will enable semantic APIs, such as
typechecking, name resolution and others.

In [Appendix C][AppendixMeta], we provide a high-level overview of the architecture of scala.meta
along with several practical examples that illustrate its functionality.

### Tool support

The key innovation of the new macro system is the fact that it's based on scala.meta, which finally makes it feasible to
provide third-party implementations of mirrors.

There now exists a prototype implementation of an IntelliJ mirror, and, in further effort of Mikhail Mutcianko from the IntelliJ team,
this mirror has become the foundation for [an interactive expander of new-style macro annotations][PrototypeIntellij].
This recent advancement strongly suggests that it was the right choice to bet on scala.meta to fix
code compehension and error reporting issues with the current macro system.

This takes some pressure off whitebox macros. In the current macro system, there is a preference towards blackbox macros,
because they are much friendlier to IntelliJ. Once we have a fully-working mirror for IntelliJ, user experience of blackbox
and whitebox macros should be equivalent. For additional discussion of whiteboxity from a language design and compiler development
perspective, refer to ["Losing whiteboxity"][Whiteboxity].

Improvements in support for incremental compilation, testing and debugging also hinge on a capability of scala.meta
to enable custom mirror implementations.
However, they also require significant new functionality to be developed in the corresponding tools
([additional dependency tracking mechanisms for the incremental compiler][SbtMacroSupport] and changes to the vanilla debugger in IDEs).

### Losing whiteboxity

It is desirable for the new design to provide reasonable feature parity with the
current macro system. So far, the biggest digression from this course is giving up whitebox expansion.
In this section, we discuss what it will cost us to follow this through, identify the aspects of the new design that
prevent whiteboxity and propose alternatives.

The main motivation for getting rid of whitebox expansion is simplification - both of the macro expansion pipeline
and the typechecker. Currently, they are inseparably intertwined, complicating both compiler evolution and tool support.
Therefore, the new design tries to disentangle these systems.

Let's recapitulate the limitations that def macro expansion applies to applications of blackbox macros,
outlining the most important use cases that blackboxity cannot express. This won't give us the full picture,
because there are many macros in the wild that we haven't classified, but nonetheless it will provide an understanding
of the significant chunk of the Scala macros ecosystem.

  1. When an application of a blackbox macro expands into a tree `x`, the expansion is wrapped into a type ascription `(x: T)`,
where `T` is the declared return type of the blackbox macro def with type arguments and path dependencies applied in consistency
with the particular macro application being expanded.
This invalidates blackbox macros as an implementation vehicle for [anonymous type providers][AnonymousTypeProviders].

  1. When an application of a blackbox macro is used as an implicit candidate, no expansion is performed until the macro
is selected as the result of the implicit search.
This makes it impossible to dynamically calculate availability of implicit macros,
precluding some advanced aspects of [materialization][Materialization].

  1. When an application of a blackbox macro still has undetermined type parameters after the Scala type inference algorithm has finished
working, these type parameters are inferred forcibly, in exactly the same manner as type inference happens for normal methods.
This makes it impossible for blackbox macros to influence type inference, prohibiting [fundep materialization][Materialization].

  1. When an application of a blackbox macro is used as an extractor in a pattern match,
it triggers an unconditional compiler error, preventing [customizations of pattern matching implemented with macros][ExtractorMacros].
This precludes blackbox macros from providing precise types to values extracted from patterns written in external DSLs,
preventing a library-based implementation of quasiquotes.

As we can see, whitebox expansion plays an important role in several use cases, the most practically significant
of them being fundep materialization and quasiquote patterns. Fundep materialization is paramount to the design of Shapeless.
Quasiquote patterns are an integral part of writing any kinds of macros - both blackbox and whitebox - which is the main
reason to use scala.reflect.

It is now clear that our desire for simplification is at odds with the ways how the Scala community uses macros.
In order to resolve the apparent conflict, we outline several solutions, whose evaluation we leave for later.

**Give up on simplification**. This is probably the most obvious approach, in which we admit
that tight coupling with the typechecker is intrinsic to the essence of Scala macros and change the new design
to enable whitebox expansion.

Concretely, accommodating whiteboxity in the new macro system requires changing the aspects of the new design
specified in ["Inline reduction"][InlineExpansion] and ["Meta expansion"][MetaExpansion] according to the
plan provided below.

  * Force inline reductions and meta expansions inside the typechecker. Currently, both the rules of inline reduction
and the rules of meta expansion are intentionally vague about the exact point in the compilation pipeline that does expansions,
but whiteboxity will leave us no room for that.
  * Delay typechecking of the bodies of inline vals and defs until their expansion. Meta expressions inside inline definitions
are not expanded, which means that eager typechecking of these definitions precludes whitebox expansion.
  * Allow using meta expressions without expected type. This captures the main idea of whitebox expansion, in which compile-time
metaprogramming has the final say about the type of transformed snippets of code.

**Assimilate the most popular use cases**. Instead of supporting the general notion of whiteboxity,
we can introduce dedicated compiler support for the most popular uses cases including the `Generic`
mechanism in Shapeless  and quasiquote patterns in scala.reflect.

This is an attempt at a compromise. On the one hand, this approach allows us to follow through with simplification.
On the other hand, it significantly minimizes the impact on the existing users of whitebox macros.

The downside of this solution is that it requires an extensive design process (because it involves adding new language features to Scala)
and assumes that the internalized techniques have reached their final form. If a new version of Shapeless
or a new version of scala.reflect (read: scala.meta) decide to adapt their designs after these designs have been assimilated,
they will have a very hard time doing that.

**Dedicated support for type-level computations**. Manifestations of whiteboxity are quite diverse,
but a lot of them are reducible to type-level computations.

For example, let's take a macro `join` that takes two objects and outputs an object that
has fields of both. Since Scala doesn't have row polymorphism, it is impossible to write a type signature
for this macro, so we have to declare it as whitebox.

```
scala> def join(x: Any, y: Any): Any = macro ...
defined term macro join: (x: Any, y: Any)Any

scala> join(new { val x = 2 }, new { val y = 3 })
res0: AnyRef{val x: Int; val y: Int} = $anon$1@64af328d
```

Here we can see how the whitebox macro encapsulates a type-level computation that takes
the types of both arguments (`AnyRef{ val x: Int }` and `AnyRef{ val y: Int }`)
and merges them into the result type. Since this computation doesn't involve the abstract syntax trees
of the arguments, the whitebox part of the macro can be extracted into a helper, making the macro itself
blackbox.

```
scala> :paste
// Entering paste mode (ctrl-D to finish)

trait Join[T, U, V]
object Join {
  implicit def materialize[T, U, V]: Join[T, U, V] = macro ...
}

// Exiting paste mode, now interpreting.

defined trait Join
defined object Join

scala>  def join[T, U, V](x: T, y: U)
     | (implicit ev: Join[T, U, V]): V = macro ...
defined term macro join: [T, U, V](x: T, y: U)...
```

This approach can express some macros that refine their return type, all fundep materialization macros,
and even some macros that dynamically compute availability of implicits (such macros can be modified to take
an additional implicit parameter whose failure to materialize can be used to control availability of the enclosing implicit) -
that is, all macros whose whiteboxity depends only on types of their prefix and arguments.

Now, after eligible whitebox macros are rewritten this way, we can replace the whitebox materializers
that compute types, e.g. `Join.materialize`, with a dedicated language feature that natively expresses them.
The listing below provides a sketch of an imaginary syntax that assumes inline types and type-generating meta expressions.

```
inline type Join[T, U] = meta {
  import scala.meta._
  val jointVals = union(T, U)
  t"{ ..$jointVals }"
}

inline def join[T, U](x: T, y: U): Join[T, U] = meta { ... }
```

From the discussion above, we can see that whiteboxity is an important feature of the current macro system
and is used in multiple highly popular open-source libraries. As a result, giving up whiteboxity
may lead to undesired practical consequences.

More work is needed to reconcile the design of the new macro system
and existing use cases, and in this section we provided several approaches to addressing this need. In the opinion of the author,
the approach that involves dedicated support to type-level computations is the most promising, because it both simplifies
the macro system and provides support for the most important use cases of whiteboxity.

### Losing compiler internals

One of the main goals of this proposal is to stop exposing overcomplicated and brittle compiler internal APIs
in order to make macros more accessible and more robust.

However, some of the compiler APIs may actually capture useful idioms that we may be able to expose in a principled fashion.
`c.internal.enclosingOwner` immediately comes to mind here.

More work in collaboration with macro authors is needed to make sure that we don't unnecessarily break existing macros
in the name of elusive conceptual purity.

### Macro annotations

Much like the current macro system can get extended to support macro annotations,
the new macro system can get extended to support new-style macro annotations that provide similar functionality.

```
import scala.annotation.StaticAnnotation

class h2db(url: String) extends StaticAnnotation {
  inline def apply(defns: Any): Any = meta {
    ...
  }
}

object Test {
  def main(args: Array[String]): Unit = {
    @h2db("coffees") object Db
    val brazilian = Db.Coffees.insert("Brazilian", 99.0)
    Db.Coffees.update(brazilian.copy(price = 100.0))
    println(Db.Coffees.all)
  }
}
```

In the current macro system, a macro annotation is a subclass of `StaticAnnotation` that define
a macro def called `macroTransform`.

Analogously, in the new design, a macro annotation is a subclass of `StaticAnnotation`
that defines an inline def called `apply`. We decided to change the magic name, because the old one no longer applies.
We also simplified the signature to take a block wrapping the definitions being expanded and returns a block wrapping expansion results,
i.e. `Any => Any`, as opposed to having `Any* => Any` in the current system.

Expansion of new-style macro annotations is very similar to expansion of vanilla macro annotations.
The only difference is that we only provide syntactic APIs, informed about [the limitations][AnnotationsTypecheck]
brought by exposing semantic APIs in macros that generate top-level definitions.
Concretely, meta scopes in macro annotations expose a `Dialect` capability instead of a `Mirror`.
As a result, we can afford to expand on enter without any limitations to the shape of expansion.

### Why inline

The main motivation behind inline is to provide a templating system that can express simple use cases
of compile-time metaprogramming in an lightweight declarative style that minimizes explicit introspection.

For example, in one of the code snippets that illustrates inline defs and inline parameters, we can use the newly
introduced mechanism to express partial evaluation. Thanks to constant folding facilities built into the compiler,
usages of the `pow` method provided below will expand into a sequence of multiplications - all that without
a single line of macro code.

```
inline def pow(b: Double, inline n: Int): Double = {
  if (n == 0) 1
  else b * pow(b, n - 1)
}
```

### Out of scope

This proposal addresses a lot of pain points of the current macro system, but it doesn't talk about two very common
problems: lack of hygiene and presence of the separate compilation restriction.

These two problems have a lot in common: we have experimented with both of them, our initial results are promising but insufficient,
both of them can be developed independently of inline/meta.

Given that both hygiene and joint compilation still require significant research to materialize,
we decided not to include them in this proposal. We think that even without these features, inline/meta represents a significant
improvement over the state of the art, so we leave them for future work that may be submitted in follow-up SIPs when it's done.

## Conclusion

Pioneered by def macros and macro annotations,
the area of language-integrated compile-time metaprogramming in Scala has shown significant practical value.

During the last several years, we have been utilizing and maintaining the current macro system in industrial projects.
Learning from this experience, we have created a new design based on `inline` and `meta` that provides
comparable functionality and avoids the most common pitfalls of existing macros.

The user interface of the new system is a conservative evolution of def macros.
[Inline defs][InlineDefs] work similarly to macro defs, and
[meta expressions][MetaExprs] play the compile-time execution role of macro impls.
These new language features are designed to be used together,
and in this capacity their look and feel can hardly be distinguished from that of def macros.

The metaprogrammer interface of the new system is a drastic redesign. We have merged macro defs and macro impls,
and, more importantly, we have switched the underlying metaprogramming API from scala.reflect to [scala.meta][ScalaMetaSection].
This has allowed us to make significant improvements in robustness and tool support.

The main open question of the new design is [whether whiteboxity will stay or will be removed][Whiteboxity] from the new macro system.
We also need to figure out [which internal compiler APIs we may want to approximate][CompilerInternals] in the new macro system.
Future work outside the scope of this proposal includes
hygiene and lifting the separate compilation restriction.

At the time of writing, `inline` and `meta` are partially implemented in [a prototype compiler plugin for Scala 2.11][PrototypeScalac]
and [an accompanying experimental branch of IntelliJ][PrototypeIntellij].
We are excited with our initial results and are planning to develop the new design further.

## Credits

This design was created by Eugene Burmako, Denys Shabalin and Martin Odersky
and was further elaborated together with other members of the inline working group at EPFL:
Sébastien Doeraene, Vojin Jovanovic and Dmitry Petrashko.

Over time, the ideas behind the design were refined based on experiments carried out by:
Uladzimir Abramchuk, Igor Bogomolov, Mathieu Demarne, Martin Duhem, Adrien Ghosn, Zhivka Gucevska,
Mikhail Mutcianko, Dmitry Naydanov, Artem Nikiforov, Vladimir Nikolaev, Jatin Puri and Valentin Rutz.

The prototype of scalac integration was developed by Eugene Burmako with open-source contributions from
Tamer Mohammed Abdul-Radi, David Dudson, Takeshi D. Itoh, Oleksandr Olgashko and Hiroshi Yamaguchi.

The prototype of IntelliJ integration was developed by Mikhail Mutcianko.

## References

  1. [Prototype of scalac integration][PrototypeScalac]
  1. [Prototype of IntelliJ integration][PrototypeIntellij]
  1. [(Appendix A) Def macros: feature interaction][AppendixInteraction]
  1. [(Appendix B) Def macros: macro expansion][AppendixExpansion]
  1. [(Appendix C) Scala.meta: high-level overview][AppendixMeta]

[ScalaMetaSection]: #scalameta
[ScalaMetaWebsite]: https://scalameta.org/
[MacroUsecases]: https://scalamacros.org/paperstalks/2014-02-04-WhatAreMacrosGoodFor.pdf
[PrototypeScalac]: https://github.com/scalameta/paradise
[PrototypeIntellij]: https://www.youtube.com/watch?v=IPnd_SZJ1nM&feature=youtu.be&t=1360
[Intuition]: #intuition
[LanguageFeatures]: #language-features
[InlineDefs]: #inline-definitions
[InlineExpansion]: #inline-reduction
[MetaExprs]: #meta-expressions
[MetaExpansion]: #meta-expansion
[MetaApis]: #meta-apis
[Whiteboxity]: #losing-whiteboxity
[CompilerInternals]: #losing-compiler-internals
[Hygiene]: #hygiene
[SeparateCompilation]: #separate-compilation-restriction
[Linq]: https://dl.acm.org/citation.cfm?id=1142552
[Materialization]: https://docs.scala-lang.org/overviews/macros/implicits.html
[SbtMacroSupport]: https://github.com/sbt/sbt/issues/1729
[AnonymousTypeProviders]: https://docs.scala-lang.org/overviews/macros/typeproviders.html#anonymous-type-providers
[ExtractorMacros]: https://docs.scala-lang.org/overviews/macros/extractors.html
[AnnotationsTypecheck]: https://github.com/scalamacros/paradise/issues/75
[AppendixInteraction]: https://gist.github.com/xeno-by/e26a904051a171e4bc8b9096630220a7
[AppendixExpansion]: https://gist.github.com/xeno-by/5dde62aedcc23afc85ecf4d795ac67c2
[AppendixMeta]: https://gist.github.com/xeno-by/9741ce7532cb30368b3753521bbfce4e
