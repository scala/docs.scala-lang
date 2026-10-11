---
title: Planning the Migration
type: chapter
description: Choosing the Scala 3 version and the route for migrating from Scala 2.13
num: 1
previous-page:
next-page: interoperability
redirect_from:
  - /scala3/guides/migration/compatibility-intro.html
  - /scala3/guides/migration/compatibility-source.html
---

This guide explains how to migrate a project from Scala 2.13 to Scala 3.

Most Scala 2.13 code compiles with Scala 3, and the compiler rewrites much of the rest automatically.
The main exception is Scala 2 macros, which have to be reimplemented (see [Macro Libraries](macros.html)).

## Choosing the Scala 3 Version

Scala 3 has two [long-term support](https://www.scala-lang.org/blog/2022/08/17/long-term-compatibility-plans.html) (LTS) versions:

- **Scala 3.3** uses the Scala 2.13 standard library and runs on JDK 8 or newer.
  It is maintained at least until September 2027.
- **Scala 3.9** ships with the standard library compiled by Scala 3.
  It requires JDK 17 or newer (see [JDK Compatibility]({% link _overviews/jdk-compatibility/overview.md %})).

For applications, we recommend using the latest Scala Next version, currently 3.10.

Whichever version you target, migration usually goes from 2.13 to 3.3 first, then from 3.3 to later versions, even if the intermediate version is not put in production.

## Dependencies Between Scala 2.13 and Scala 3

Scala 2.13 and 3.3 support binary interoperability in both directions:

| Module compiled with | Can use modules compiled with |
|-|-|
| 2.13 | 2.13, and Scala 3 up to 3.7 (with `-Ytasty-reader`) |
| 3.3 | 2.13, and Scala 3 up to 3.3 |
| 3.9 | 2.13, and Scala 3 up to 3.9 |

This interoperability allows migrating projects gradually, as explained in the next section.
There are however limitations: the Scala 3 compiler cannot expand Scala 2 macros, and the Scala 2.13 compiler does not support certain Scala 3 features.

## Migration Routes

The best migration route for a project depends on its size, dependencies, and whether it uses Scala 2 macros.

- **All at once:** switch the entire build from 2.13 to Scala 3 in one change.
  This is the simplest route, and it suits small projects.
- **Module by module, through 3.3:** migrate one module at a time to Scala 3.3, in any order.
  The remaining 2.13 modules can depend on the migrated ones through the TASTy reader.
  Moving from 3.3 to 3.9 or 3.10 is a second, smaller migration.
- **Top-down:** migrate the applications first and the modules they depend on last.
  2.13 modules never depend on migrated modules, so the migrated modules can be built with 3.9 or 3.10 right away.
  The 3.3 compiler is only used to apply source code rewrites.
- **Cross-building:** compile shared modules with both 2.13 and Scala 3 until all their users are migrated.
  This allows working around limitations of binary interoperability between Scala 2 and 3, and it keeps the 2.13 production build stable while working on the migration.
  Maintaining the two parallel builds creates overhead for the whole team, but it might be the best option for large projects.
  With `-Xsource-features`, Scala 2.13 adopts the Scala 3 behavior of changed features, such as implicit resolution and inferred override types, so that both builds behave the same (see [Scala 2 with -Xsource:3](scala2-xsource3.html#enabling-scala-3-features-with--xsource-features)).

With the module-by-module and top-down routes, all modules keep using the `_2.13` versions of their library dependencies until the migration is complete.
If that is not possible, for example because of Scala 2 macros in these libraries, migrate all at once or use cross-building.
The next page, [Interoperability](interoperability.html), explains this in more detail.

## Steps

The rest of this guide follows the steps of the migration:

1. [Preparing on Scala 2.13](preparing.html): changes to make before switching the compiler.
2. [Migrating to Scala 3.3](migrating-to-3-3.html): the Scala 3.3 compiler rewrites the Scala 2.13 code, some fixes are done by hand.
3. [Migrating to Scala 3.9 and 3.10](migrating-to-3-9.html): later compilers can apply further rewrites to the code.

If the project defines Scala 2 macros, they need to be rewritten for Scala 3, see [Macro Libraries](macros.html).
