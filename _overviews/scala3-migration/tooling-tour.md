---
title: Tour of the Migration Tools
type: chapter
description: This chapter is a tour of the migration tooling ecosystem 
num: 6
previous-page: compatibility-metaprogramming
next-page: tooling-scala2-xsource3
---

## The Scala Compilers

The migration has been carefully prepared beforehand in each of the two compilers so that the transition is easy and smooth.

### The Scala 2.13 Compiler

The Scala 2.13 compiler supports `-Xsource:3`, an option that enables migration warnings and certain Scala 3 syntax and behavior.

The [Scala 2 with -Xsource:3](tooling-scala2-xsource3.html) page explains the flag in detail.


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

sbt supports Scala 3 out-of-the-box.
All common tasks and settings are intended to work the same.
Many sbt plugins should also work exactly the same.

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

The Scala Maven plugin supports Scala 3 since 4.5.1.

## Code editors and IDEs

### Metals

[Metals](https://scalameta.org/metals/) is the Scala extension for VS Code.
It also works with Vim, Emacs, Sublime Text, and other editors.

### IntelliJ IDEA

The [Scala plugin for IntelliJ](https://plugins.jetbrains.com/plugin/1347-scala) supports Scala 3.

## Formatting Tools

### Scalafmt

[Scalafmt](https://scalameta.org/scalafmt/) supports Scala 2.13 and Scala 3 since v3.0.0.

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

Scalafmt can also enforce the new Scala 3 syntax with the [Scala 3 rewrites](https://scalameta.org/scalafmt/docs/configuration.html#scala3-rewrites).

## Migration Tools

### Scalafix

[Scalafix](https://scalacenter.github.io/scalafix/) is a refactoring tool for Scala.

The [Incompatibility Table](incompatibility-table.html) shows which incompatibility can be fixed by an existing Scalafix rule.
So far the relevant rules are:
- [Procedure Syntax](https://scalacenter.github.io/scalafix/docs/rules/ProcedureSyntax.html)
- [Explicit Result Types](https://scalacenter.github.io/scalafix/docs/rules/ExplicitResultTypes.html)
- Value Eta-Expansion: `fix.scala213.ExplicitNullaryEtaExpansion` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNullaryEtaExpansion.scala)
- Auto Application: `fix.scala213.ExplicitNonNullaryApply` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/ExplicitNonNullaryApply.scala)
- `any2stringadd` Conversion: `fix.scala213.Any2StringAdd` in [scala/scala-rewrites](https://github.com/scala/scala-rewrites/blob/main/rewrites/src/main/scala/fix/scala213/Any2StringAdd.scala)

You can apply these rules in sbt using the `sbt-scalafix` plugin.
They are also used internally in `sbt-scala3-migrate` described below.

### The Scala 3 Migration Plugin for sbt

[Scala 3 Migrate](https://github.com/scalacenter/scala3-migrate) is an sbt plugin that can assist you during the migration to Scala 3.

It proposes an incremental approach, based on four sbt commands:
- `migrateDependencies` helps you update the list of `libraryDependencies`
- `migrateScalacOptions` helps you update the list of `scalacOptions`
- `migrateSyntax` fixes a number of syntax incompatibilities between Scala 2.13 and Scala 3 
- `migrateTypes` tries to code compile your code to Scala 3 by infering types and resolving implicits where needed.

The detailed instructions on how to use Scala 3 Migrate can be found [here](scala3-migrate.html).

## Scaladex

Check the list of Scala 3 open-source libraries in [Scaladex](https://index.scala-lang.org/).
