---
layout: sip
number: 53
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: shipped
title: Quote pattern explicit type variable syntax
---

**By: Nicolas Stucki**

## History

| Date          | Version            |
|---------------|--------------------|
| Feb 28th 2022 | Initial Draft      |
| Oct 6th 2022 | [Stabilize implementation](https://github.com/scala/scala3/pull/18574) |
| Feb 29th 2023 | Available in [Scala 3.4.0](https://www.scala-lang.org/blog/2024/02/29/scala-3.4.0-and-3.3.3-released.html) |

## Summary

This SIP proposes additions to the syntax of type variable definitions to bring quoted type matching to par with quoted expression matching.
Specifically, the ability to declare type variables explicitly and define them with bounds.

It also proposes some enhancements to make the use of type variables simpler.
The idea is to reduce the number of cases where we need to write backticks around type variable name references.
Namely when using explicit type variable definitions.

## Motivation

### Background

* [Reference Documentation](http://dotty.epfl.ch/docs/reference/metaprogramming/macros.html#type-variables)

Quoted expressions support two ways of defining type variables: explicit and nested.

##### Explicit type variables
The initial `type` declarations in the pattern with a type variable name (lowercase names as with normal pattern type variables) are type variable definitions. Type variable references need to be in backticks. Otherwise, we assume they are nested type variables and emit an error. These definitions can have bounds defined on them.
```scala
case '{ type t; $x: `t` } => f[t](x: Expr[t])
case '{ type u; ($ls: List[`u`]).map($f: `u` => Int) } => g[u](ls: Expr[List[u]], f: Expr[u => Int])
case '{ type tail <: Tuple; $x: *:[Int, `tail`] } => h[tail](x: Expr[*:[Int, tail])
```

##### Nested type variable
Types with a type variable name introduce a new type variable. These cannot be references with a backticked reference due to their scope. We cannot add explicit bounds to them, but in certain cases we can infer their some bounds. These variables become explicit type variables in the internal representation after typing.
```scala
case '{ $x: t } => f[t](x: Expr[t])
```


##### Type Patterns
Quoted type patterns only support nested type variable definitions. Explicit type variables are not supported in the source due to an oversight. These variables become explicit type variables in the internal representation after typing. The bounds of the type variable are `Any` and `Nothing`.
```scala
case '[ t ] => f[t]
case '[ List[t] ] => g[t]
```

### Support type bounds in quoted type patterns

We want to be able to set the bounds of type variables to be able to match against type constructors that have type bounds. For example, the tuple `*:` type.
```scala
case '[ head *: tail ] => h[tail]
```
See [https://github.com/lampepfl/dotty/issues/11738](https://github.com/lampepfl/dotty/issues/11738).

### Support matching on any kind of type
We want to match against higher-kinded (or `AnyKind`) types. This is not possible due to the default upper bound of `Any`.
See [https://github.com/lampepfl/dotty/issues/10864](https://github.com/lampepfl/dotty/issues/10864).

### Support multiple references to the same type in quoted type patterns
We want to be able to match using several references to the same type variable.
```scala
case '[ (t, t, t) ] => f[t] // t is going to match the glb of the tuple T1, T2, T3
```

### Simplify the use of explicit type variables
It is inconsistent to need to use backticks for references to explicit type variables in the quote but not outside.
We want to be able to refer to the variable by its non-backticked name uniformly.
```diff
- case '{ type u; ($ls: List[`u`]).map($f: `u` => Int) } => g[u](ls: Expr[List[u]], f: Expr[u => Int])
+ case '{ type u; ($ls: List[u]).map($f: u => Int) } => g[u](ls: Expr[List[u]], f: Expr[u => Int])
```

## Proposed solution

### High-level overview

We first want to introduce syntax for explicit type variable definitions in quoted type patterns that aligns with expression quoted patterns. We can use the syntax described in [explicit type variables](#explicit-type-variables).

```scala
case '[ type t; List[`t`] ] => f[t]
case '[ type tail <: Tuple; *:[Int, `tail`] ] => g[tail]
```

Second, we want the remove the need for backticks for references to explicit type variable definitions. If we have an explicit type variable definition and a type variable with the same name, we can syntactically assume these are the same and not introduce a new nested type variable.
```scala
case '{ type t; $x: t } => f[t](x: Expr[t])
case '{ type u; ($ls: List[u]).map($f: u => Int) } => g[u](ls: Expr[List[u]], f: Expr[u => Int])
case '{ type tail <: Tuple; $x: *:[Int, tail] } => h[tail](x: Expr[*:[Int, tail])
```
```scala
case '[ type t; List[t] ] => f[t]
case '[ type tail <: Tuple; *:[Int, tail] ] => g[tail]
```

### Specification

Adding the explicit type variable definition to quoted type patterns is relatively straightforward as nested type variables become explicit ones internally. We would only need to update the parser to accept a new kind of type in the syntax. This type would only be used in the quote type pattern syntax, which is self-contained in the language's grammar.

```diff
Quoted            ::=  ‘'’ ‘{’ Block ‘}’
-                    |  ‘'’ ‘[’ Type ‘]’
+                    |  ‘'’ ‘[’ TypeBlock ‘]’
+TypeBlock         ::=  {TypeBlockStat semi} Type
+TypeBlockStat     ::=  ‘type’ {nl} TypeDcl
```

Allowing non-backticked references to explicit type variable definitions would not create any conflict, as these would currently cause a double definition error. The grammar would not need to change. This would only interact with the process of typing quoted patterns.

### Compatibility

There are no compatibility issues because the parser or typer rejected all these cases.

TASTy only contains explicit type variable definitions, and this encoding would not change. Note that TASTy supports _type blocks_ using the regular `Block` AST. These contain type declaration in their statements and a type instead of the expression.

### Other concerns

* Tools that parse Scala code must be updated with this new grammar.
* Tools that use TASTy would not be affected.

<!-- ### Open questions -->

## Alternatives

* We could find a different syntax for explicit type variables in quoted type patterns. The drawback is that we need to specify and explain a secondary syntax.
* Don't include the backticks improvements.

## Related work

* Proof of concept of type variable syntax: [https://github.com/lampepfl/dotty/pull/16910](https://github.com/lampepfl/dotty/pull/16910)
* Proof of concept of backticks (only interested in the first bullet point): [https://github.com/lampepfl/dotty/pull/16935](https://github.com/lampepfl/dotty/pull/16935)
* Implementation: [https://github.com/scala/scala3/pull/17362](https://github.com/scala/scala3/pull/17362)
* Stabilized implementation: [https://github.com/scala/scala3/pull/18574](https://github.com/scala/scala3/pull/18574)

<!-- ## FAQ -->
