---
title: Tour of the Migration Tools
type: chapter
description: This chapter is a tour of the migration tooling ecosystem 
num: 6
previous-page: compatibility-metaprogramming
next-page: tooling-migration-mode
---

## The Scala Compilers

The migration has been carefully prepared beforehand in each of the two compilers so that the transition is easy and smooth.

### The Scala 2.13 Compiler

The Scala 2.13 compiler supports `-Xsource:3`, an option that enables some Scala 3 syntax and behavior:
- Most deprecated syntax generates an error.
- Infix operators can start a line in the middle of a multiline expression.
- Implicit search and overload resolution follow Scala 3 handling of contravariance when checking specificity.

The `-Xsource:3` option is intended to encourage early migration.

### The Scala 3 Compiler

#### Migration Mode

Similarly the Scala 3 compiler comes with the `-source:3.0-migration` option.
From this mode, it accepts some of the old Scala 2.13 syntax and issues warnings to explain the changes.

Even more than that, you can combine it with `-rewrite` to patch your code automatically.

Learn more about it in the [Scala 3 Migration Mode](tooling-migration-mode.html) page.

#### Syntax Rewriting

Once your code is compiled in Scala 3 you can convert it to the new and optional Scala 3 syntax by using the [Syntax Rewriting](tooling-syntax-rewriting.html) options.

## Build tools

### sbt

> The `sbt-dotty` plugin was needed in sbt 1.4 to get support for Scala 3.
> It is not useful anymore since sbt 1.5.

sbt 1.5 supports Scala 3 out-of-the-box.
All common tasks and settings are intended to work the same.
Many plugins should also work exactly the same.

To help with the migration, sbt 1.5 introduces new Scala 3 specific cross versions:

```scala
// Use a Scala 2.13 library in Scala 3
libraryDependency += ("org.foo" %% "foo" % "1.0.0").cross(CrossVersion.for3Use2_13)

// Use a Scala 3 library in Scala 2.13 
libraryDependency += ("org.bar" %% "bar" % "1.0.0").cross(CrossVersion.for2_13Use3)
```

### Mill

[Mill](https://github.com/com-lihaoyi/mill) 0.9.x supports Scala 3.

### Maven

Scala 3 support for Maven will soon land in the [scala-maven-plugin](https://github.com/davidB/scala-maven-plugin).

## Code editors and IDEs

### Metals

[Metals](https://scalameta.org/metals/) is a Scala language server that works with VS Code, Vim, Emacs, Sublime Text and Eclipse.

Scala 3 is already very well supported by Metals.
Some minor adjustments for the new syntax changes and new features are coming. 

### IntelliJ IDEA

The Scala plugin for IntelliJ includes preliminary support for Scala 3.
Full-fledged support is being worked on by the team at JetBrains.

## Formatting Tools

### Scalafmt

[Scalafmt](https://scalameta.org/scalafmt/) v3.0.0-RC1 supports both Scala 2.13 and Scala 3.

To enable Scala 3 formatting you must set the `runner.dialect = scala3` in your `.scalafmt.conf` file.

If you want to enable it selectively you can set a `fileOverride` configuration:

```conf
//.scalafmt.conf
fileOverride {
  "glob:**/scala-3*/**" {
    runner.dialect = scala3
  }
}
```

## Migration Tools

### Scalafix

[Scalafix](https://scalacenter.github.io/scalafix/) is a refactoring tool for Scala.
At the time of writing, it only runs on Scala 2.13.
But it can be useful to prepare the code before jumping to Scala 3.

The [Incompatibility Table](incompatibility-table.html) shows which incompatibility can be fixed by an existing Scalafix rule.
So far the relevant rules are:
- [Procedure Syntax](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [Explicit Result Types](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)
- Value Eta-Expansion: `fix.scala213.ExplicitNullaryEtaExpansion` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- Parentheses Around Lambda Parameter: `fix.scala213.ParensAroundLambda` in [ohze/scala-rewrites](https://github.com/ohze/scala-rewrites/blob/dotty/rewrites/src/main/scala/fix/scala213/ParensAroundLambda.scala)
- Auto Application: `fix.scala213.ExplicitNonNullaryApply` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)
- `any2stringadd` Conversion: `fix.scala213.Any2StringAdd` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)

You can apply these rules in sbt using the `sbt-scalafix` plugin.
They are also used internally in `sbt-scala3-migrate` described below.

### The Scala 3 Migrate Plugin

[Scala 3 Migrate](https://github.com/scalacenter/scala3-migrate) is an sbt plugin that can assist you during the migration to Scala 3.

It proposes an incremental approach that can be described as follows:
- Migrate the library dependencies:
  For every library dependency it checks, if there are available versions for Scala 3.
- Migrate the Scala compiler options (`scalacOptions`):
  Some Scala 2 compiler options have been removed or renamed, others remain the same. 
  This step helps you adapt the compiler options of your project.
- Migrate the syntax:
  This step relies on Scalafix and existing rules to fix the deprecated syntax.
- Migrate the code by expliciting the types:
  Scala 3 has a new type inference algorithm that may infer slightly different types than the Scala 2 inference.
  This last step explicits a minimum set of types so that the project can be compiled with Scala 3 without altering its runtime behavior.

## Scaladex

Check the list of Scala 3 open-source libraries in [Scaladex](https://index.scala-lang.org/).
