---
layout: sip
number: 68
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
stage: completed
status: accepted
title: Reference-able Package Objects
---

**By: Li Haoyi**

## History

| Date          | Version            |
|---------------|--------------------|
| Dec 14th 2024 | Initial Draft      |

## Summary

This proposal is to allow the following:

```scala
package a
package object b

val z = a.b // Currently fails with "package is not a value"
```


Currently the workaround is to use a `.package` suffix:

```scala
val z = a.b.`package`
```

This proposal is to make it such that given `a.b`, if `b` is a `package` 
containing a `package object`, expands to `a.b.package` automatically


One limitation with `package object`s is that we cannot currently assign them to 
values: `a.b` fails to compile when `b` is a `package object`, even though it succeeds when
`b` is a normal `object`. The workaround is to call `a.b.package`, which is ugly and 
non-obvious, or to use a normal `object`, which is not always possible. There is no other
way to refer to the `package object b` in the example above. 

Allowing `a.b` to automatically expand into `a.b.package` when `b` is a 
`package object` will simplify the language, simplify IDE support for the 
language, and generally make things more uniform and regular.


Prior Discussion can be found [here](https://contributors.scala-lang.org/t/pre-sip-reference-able-package-objects/6939)

## Motivation

Although package objects have been discussed [being dropped](https://docs.scala-lang.org/scala3/reference/dropped-features/package-objects.html)
in Scala 3, no concrete plans have been made as to how to do so, and we argue that they 
are sufficiently useful that keeping them around is preferably to dropping them.

### Package Entrypoints

`package object`s are the natural "entry point" of a package. While top-level declarations 
reduce their need somewhat, they do not replace it: `package object`s are still necessary 
for adding package-level documentation or having the package-level API inherit from traits
or classes. For example the [Acyclic Plugin](https://github.com/com-lihaoyi/acyclic) uses package 
objects as a place to put package-level annotations in source code to apply package-level
semantics in the compiler plugin.

Other languages have equivalent constructs (`module-info.java` or `__init__.py`) 
that fulfil the same need, so it's not just a quirk of the Scala language. 

### Package API Facades

Many libraries use package objects to expose the "facade" of the package hierarchy:

- Mill uses `package object`s to expose the build definitions within each `package`, and 
  each one is an instance of `mill.Module`

- Requests-Scala uses a `package object` to represent the default `requests.BaseSession` 
 instance with the default configuration for people to use

- PPrint uses a `package object` to expose the `pprint.log` and other APIs for people to use
 directly, as a default instance of `PPrinter`

- OS-Lib uses a `package object` to expose the primary API of the `os.*` operations

None of these use cases can be satisfied by normal `object`s or by top-level declarations, 
due to the necessity of documentation and inheritance. They need to be `package object`s.

However, the fact that you cannot easily pass around these default instances as values e.g. 
`val x: PPrinter = pprint` without calling `pprint.package` is a source of friction.

### Uniform Semantics

This source of friction is not just for humans, but for tools as well. For example, IntelliJ 
needs a special case and special handling in the Scala plugin specifically to support this irregularity:

* Original irregularity https://github.com/JetBrains/intellij-scala/blob/idea242.x/scala/scala-impl/src/org/jetbrains/plugins/scala/lang/psi/impl/expr/ScReferenceExpressionImpl.scala#L198

* Special casing to support Mill, which allows references to package objects https://github.com/JetBrains/intellij-scala/pull/672

The fact that it is impossible to refer to the `package object` without using a `.package` suffix
is a wart: `.package` is an implementation/encoding detail, and so should not be a necessary part
of the user-facing language. We can refer to all other Scala definitions and objects without 
leaking implementation/encoding details, and it would be more uniform to allow that for 
`package object`s as well.


## User Alternatives

The two main alternatives now are to use `.package` suffixes, e.g. in Mill writing:

```scala
def moduleDeps = Seq(foo.`package`, bar.`package`, qux.baz.`package`)
```

Or to use normal `object`s. Notably, normal `object`s do not allow `package`s of the 
same name, which leads to contortions. e.g. Rather than:

```scala
package object foo extends _root_.foo.bar.Qux{
  val bar = 1
}
```
```scala
package foo.bar
class Qux
```

We need to move the `package foo` contents into `package foo2` to avoid conflicts with 
`object foo`, and then we need to add back aliases to all the declarations in `foo2` to make
them available in `foo`:

```scala
object foo extends foo2.bar.Qux{
  val bar = 1
  object bar{
    type Qux = foo2.bar.Qux
  }
}
```
```scala
package foo2.bar
class Qux
```

Both of these workarounds are awkward and non-idiomatic, but are necessary due to current 
limitations in referencing `package object`s directly

Notably, normal `object`s are not a replacement for `package object`s, because only
`package object`s allow the package contents to be defined in other files. Normal `object`s
would require that the package contents be all defined in a single file in the `object` body,
or scattered into other files as `trait`s in _different_ `package`s and mixed into the
`object`, both of which are messy and sub-optimal.

It's possible to have a convention _"the `object` named `foo` is always going to be the
primary entrypoint for a package"_, but that is just a poor-man's `package object` with worse
syntax and less standardization.

## Implementation Alternatives

* We could make `a.b` where `b` is a `package` refer to the entire `package b` namespace, not 
  just the `package object`. This cannot in general work due to the JVM's _open packages_ and
  separate compilation: while `package object`s can only exist in one file present in one 
  compilation run, JVM `package`s can contain arbitrary sets of classes from different compilation
  runs. Thus it is impossible in general to define a "complete" API for a JVM `package` for us to
  generate an object to refer to.

* Using Scala 3 [Top Level Definitions](https://docs.scala-lang.org/scala3/book/taste-toplevel-definitions.html)
  is one possible alternative to `package object`s, but they fall short on many use cases:
  * Top-level definitions cannot generate objects that inherit from classes or traits, which
    is necessary in many use cases: Mill (needs them to inherit `mill.Module`), Requests-
    Scala (needs it to inherit from `requests.BaseSession`), etc.
  * Top-level definitions can be defined in multiple files, so suffer from the issue that 
    it is at any point in time impossible to know the "entire" API of a `package` provided
    by top-level definitions
  * Top-level definitions do not provide a natural "package entrypoint" to the `package` source folder,
    to provide package-level documentation, annotations, etc.. We could provide another `.scala` 
    file that we specify by-convention to be the "package entrypoint", but we already have
    `package.scala` and it does the job just fine


## Limitations

* With this proposal, `a.b.c` can be refactored to `val x = a.b; x.c` only when `c` is declared inside
  the `a.b` package object. This is slightly more irregular than the status quo, which disallows such
  a refactoring at any time. In general, a package with a package object no longer behaves the same
  as a package without.

## Open Questions

There are some open questions that can be resolved during experimentation

* Should package objects be usable as singleton type prefixes, e.g. `type foo == scala.type`?
* Should package objects participate in `foo() -> foo.apply()` desugaring, e.g. `_root_.pprint(124)`?
* 

## Implementation & Testing


Mill since version 0.12.0 already emulates this proposed behavior in Scala 2 using source-code
mangling hacks, with custom support in IntelliJ. It works great and does what it was intended 
to do (allow passing around `package object`s as values without having to call `.package` every time)

We have a prototype Scala3 implementation here: 

* https://github.com/scala/scala3/pull/22011

The necessary IntelliJ changes have been made below:

* https://github.com/JetBrains/intellij-scala/pull/672

With IntelliJ-side discussion:

* https://youtrack.jetbrains.com/issue/SCL-23198/Direct-references-to-package-objects-should-be-allowed-in-.mill-files

These IntelliJ changes are currently guarded to only apply to `.mill` files, but the 
guard can easily be removed to make it apply to any Scala files. In fact, implementing 
this proposal would involve _removing_ a considerable amount of special casing from 
the Intellij-Scala plugin, resulting in the code analysis for looking up references in
the Scala language to become much more regular and straightforward:

```diff
lihaoyi intellij-scala$ git diff
diff --git a/scala/scala-impl/src/org/jetbrains/plugins/scala/lang/psi/impl/expr/ScReferenceExpressionImpl.scala b/scala/scala-impl/src/org/jetbrains/plugins/scala/lang/psi/impl/expr/ScReferenceExpressionImpl.scala
index b820dff8c3..29ba15bcdd 100644
--- a/scala/scala-impl/src/org/jetbrains/plugins/scala/lang/psi/impl/expr/ScReferenceExpressionImpl.scala
+++ b/scala/scala-impl/src/org/jetbrains/plugins/scala/lang/psi/impl/expr/ScReferenceExpressionImpl.scala
@@ -182,24 +182,7 @@ class ScReferenceExpressionImpl(node: ASTNode) extends ScReferenceImpl(node) wit
     })
 
   override def getKinds(incomplete: Boolean, completion: Boolean = false): _root_.org.jetbrains.plugins.scala.lang.resolve.ResolveTargets.ValueSet = {
-    val context = getContext
-    context match {
-      case _ if completion =>
-        StdKinds.refExprQualRef // SCL-3092
-      case _: ScReferenceExpression =>
-        StdKinds.refExprQualRef
-      case postf: ScPostfixExpr if this == postf.operation || this == postf.getBaseExpr =>
-        StdKinds.refExprQualRef
-      case pref: ScPrefixExpr if this == pref.operation || this == pref.getBaseExpr =>
-        StdKinds.refExprQualRef
-      case inf: ScInfixExpr if this == inf.operation || this == inf.getBaseExpr =>
-        StdKinds.refExprQualRef
-      case _ =>
-        // Mill files allow direct references to package
-        // objects, even though normal .scala files do not
-        if (this.containingScalaFile.exists(_.isMillFile)) StdKinds.refExprQualRef
-        else StdKinds.refExprLastRef
-    }
+    StdKinds.refExprQualRef
   }
 
   override def multiType: Array[TypeResult] = {
```
