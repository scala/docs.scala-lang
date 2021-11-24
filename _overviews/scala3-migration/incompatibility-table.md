---
title: Incompatibility Table
type: chapter
description: This chapter list all the known incompatibilities between Scala 2.13 and Scala 3 
num: 14
previous-page: tooling-syntax-rewriting
next-page: incompat-syntactic
---

An incompatibility is a piece of code that can be compiled with Scala 2.13 but not with Scala 3.
Migrating a codebase involves finding and fixing all the incompatibilities of the source code.
On rare occasions we can also have a runtime incompatibility: a piece of code that behaves differently at runtime.

In this page we propose a classification of the known incompatibilities.
Each incompatibility is described by:
 - Its short name with a link towards the detailed description and proposed solutions
 - Whether the Scala 2.13 compiler emits a deprecation or a feature warning
 - The existence of a [Scala 3 migration](tooling-migration-mode.html) rule for it
 - The existence of a Scalafix rule that can fix it

> #### Scala 2.13 deprecations and feature warnings
> Run the 2.13 compilation with `-source:3` to locate those incompatibilities in the code.

> #### Scala 3 migration versus Scalafix rewrites
> The Scala 3 migration mode comes out-of-the-box.
> On the contrary, Scalafix is a tool that must be installed and configured manually.
> However Scalafix has its own advantages:
> - It runs on Scala 2.13.
> - It is composed of individual rules that you can apply one at a time.
> - It is easily extensible by adding custom rules.

### Syntactic Changes

Some of the old syntax is not supported anymore.

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[Restricted keywords](incompat-syntactic.html#restricted-keywords)||✅||
|[Procedure syntax](incompat-syntactic.html#procedure-syntax)|Deprecation|✅|[✅](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)|
|[Parentheses around lambda parameter](incompat-syntactic.html#parentheses-around-lambda-parameter)||✅|[✅](https://github.com/ohze/scala-rewrites/tree/dotty/#fixscala213parensaroundlambda)|
|[Open brace indentation for passing an argument](incompat-syntactic.html#open-brace-indentation-for-passing-an-argument)||✅||
|[Wrong indentation](incompat-syntactic.html#wrong-indentation)||||
|[`_` as a type parameter](incompat-syntactic.html#_-as-a-type-parameter)||||
|[`+` and `-` as type parameters](incompat-syntactic.html#-and---as-type-parameters)||||

### Dropped Features

Some features are dropped to simplify the language.

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|
|--- |--- |--- |--- |
|[Symbol literals](incompat-dropped-features.html#symbol-literals)|Deprecation|✅||
|[`do`-`while` construct](incompat-dropped-features.html#do-while-construct)||✅||
|[Auto-application](incompat-dropped-features.html#auto-application)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)|
|[Value eta-expansion](incompat-dropped-features.html#value-eta-expansion)|Deprecation|✅|[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)|
|[`any2stringadd` conversion](incompat-dropped-features.html#any2stringadd-conversion)|Deprecation||[✅](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)|
|[Early initializer](incompat-dropped-features.html#early-initializer)|Deprecation|||
|[Existential type](incompat-dropped-features.html#existential-type)|Feature warning|||

### Contextual Abstractions

The redesign of [contextual abstractions]({% link _scala3-reference/contextual.md %}) brings some well defined incompatibilities.

|Incompatibility|Scala 2.13|Scala 3 Migration Rewrite|Scalafix Rule|Runtime Incompatibility|
|--- |--- |--- |--- |--- |
|[Type of implicit def](incompat-contextual-abstractions.html#type-of-implicit-definition)|||[✅](https://github.com/ohze/scala-rewrites#fixexplicittypesexplicitimplicittypes)||
|[Implicit views](incompat-contextual-abstractions.html#implicit-views)||||**Possible**|
|[View bounds](incompat-contextual-abstractions.html#view-bounds)|Deprecation||||
|[Ambiguous conversion on `A` and `=> A`](incompat-contextual-abstractions.html#ambiguous-conversion-on-a-and--a)|||||

Furthermore we have changed the implicit resolution rules so that they are more useful and less surprising.
The new rules are described [here](/scala3/reference/changed-features/implicit-resolution.html).

Because of these changes, the Scala 3 compiler could possibly fail at resolving some implicit parameters of existing Scala 2.13 code.

### Other Changed Features

Some other features are simplified or restricted to make the language easier, safer or more consistent.

|Incompatibility|Scala 3 Migration Rewrite|
|--- |--- |
|[Inheritance shadowing](incompat-other-changes.html#inheritance-shadowing)|✅|
|[Non-private constructor in private class](incompat-other-changes.html#non-private-constructor-in-private-class)|Migration Warning|
|[Abstract override](incompat-other-changes.html#abstract-override)||
|[Case class companion](incompat-other-changes.html#case-class-companion)||
|[Explicit call to unapply](incompat-other-changes.html#explicit-call-to-unapply)||
|[Invisible bean property](incompat-other-changes.html#invisible-bean-property)||
|[`=>T` as type argument](incompat-other-changes.html#-t-as-type-argument)||
|[Wildcard type argument](incompat-other-changes.html#wildcard-type-argument)||

### Type Checker

The Scala 2.13 type checker is unsound in some specific cases.
This can lead to surprising runtime errors in places we would not expect.
Scala 3 being based on stronger theoretical foundations, these unsoundness bugs in the type checker are now fixed.

|Incompatibility|
|--- |
|[Variance checks](incompat-type-checker.html#unsoundness-fixes-in-variance-checks)|
|[Pattern matching](incompat-type-checker.html#unsoundness-fixes-in-pattern-matching)|

### Type Inference

Some specific type inference rules have changed between Scala 2.13 and Scala 3.

|Incompatibility|
|--- |
|[Return type of override method](incompat-type-inference.html#return-type-of-an-override-method)|
|[Reflective type](incompat-type-inference.html#reflective-type)|

Also we have improved the type inference algorithm by redesigning it entirely.
This fundamental change leads to a few incompatibilities:
- A different type can be inferred
- A new type-checking error can appear

> It is always good practice to write the result types of all public values and methods explicitly.
> It prevents the public API of your library from changing with the Scala version, because of different inferred types.
> 
> This can be done prior to the Scala 3 migration by using the [ExplicitResultTypes](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html) rule in Scalafix.

### Macros

The Scala 3 compiler is not able to expand Scala 2.13 macros.
Under such circumstances it is necessary to re-implement the Scala 2.13 macros using the new Scala 3 metaprogramming features.

You can go back to the [Metaprogramming](compatibility-metaprogramming.html) page to learn about the new metaprogramming features.
