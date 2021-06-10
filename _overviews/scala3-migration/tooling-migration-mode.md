---
title: Scala 3 Migration Mode
type: chapter
description: This section describes the migration mode of the Scala 3 compiler 
num: 7
previous-page: tooling-tour
next-page: tutorial-intro
---

The Scala 3 compiler provides some helpful utilities to ease the migration.

Try running `scalac` to have a glimpse of those utilities:

> `scalac` is the executable of the Scala compiler, it can be downloaded from [Github](https://github.com/lampepfl/dotty/releases/).
> 
> It can also be installed using Coursier with `cs install scala3-compiler`, in which case `scalac` is aliased `scala3-compiler`.

{% highlight text %}
$ scalac
Usage: scalac <options> <source files>
where possible standard options include:

...
-explain           Explain errors in more detail.
-explain-types     Explain type errors in more detail.
...
-rewrite           When used in conjunction with a `...-migration` source version, rewrites sources to migrate to new version.
...
-source            source version
                   Default: 3.0.
                   Choices: 3.0, future, 3.0-migration, future-migration.
...
{% endhighlight %}

## Migration mode

The `-source:3.0-migration` option makes the compiler forgiving on most of the dropped features, printing warnings in place of errors.
Each warning is a strong indication that the compiler is even capable of safely rewriting the deprecated pieces of code into their cross-compiling counterparts.

We call this the **Scala 3 migration compilation**.

## Automatic rewrites

Once your code compiles in the migration mode, almost all warnings can be resolved automatically by the compiler itself.
To do so you just need to compile again, this time with the `-source:3.0-migration` and the `-rewrite` options.

> Beware that the compiler will modify the code! It is intended to be safe.
> However you may like to commit the initial state so that you can print the diff applied by the compiler and revert it if necessary.

> #### Good to know
> - The rewrites are not applied if the code compiles in error.
> - You cannot choose which rules are applied, the compiler runs all of them.

You can refer to the [Incompatibility Table](incompatibility-table.html) to see the list of Scala 3 migration rewrites.

## Error explanations

The `-source:3.0-migration` mode handles many of the changed features but not all of them.
The compiler can give you more details about the remaining errors when invoked with the `-explain` and/or the `-explain-types` options.

> The `-explain` and `-explain-types` options are not limited to the migration.
> They can, in general, assist you to learn and code in Scala 3.
