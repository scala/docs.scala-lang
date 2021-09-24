---
title: Creating Tests before a Pull Request
type: section
description: This page describes test procedures in the Scala 3 compiler.
num: 9
previous-page: procedures-efficiency
next-page: arch-intro
---

Once you solved an issue, you likely want to see your change added to the [Scala 3 repo][lampepfl/dotty].
To do that, you need to prepare a [pull request][pull-request] that includes tests that verify the issue is resolved.
Hence you need to know how to work with Dotty's testing infrastructure.

## Running all Tests

To run all tests of Scala 3, including for compiler, REPL, libraries and more, run the following in sbt:

```bash
$ sbt
> scala3-bootstrapped/test
```

Often however it is not necessary to test everything if your changes are localised to one area,
we will see in the following sections the different kinds of tests, and how
to run individual tests.

## Tests Overview

Tests live in the `tests/` folder at the root of the Dotty repo. They are categorised further by the virtue of placing them in the subfolders of the `tests` folder. Three main tests categories are:

- `tests/pos` – tests that should compile: pass if compiles successfully.
- `tests/neg` – should not compile: pass if fails compilation. Useful, e.g., to test an expected compiler error.
- `tests/run` – these tests not only compile but are also run.

Individual tests are, by convention, named after the number of the issue they are fixing – e.g. `i12345`.

If your issue is reproducible by only one file, put that file under an appropriate category. For example, if your issue is about getting rid of a spurious compiler error (that is a code that doesn't compile should, in fact, be compilable), you can create a file `tests/pos/i12345.scala`.

If you need more than one file to reproduce an issue, create a folder instead of a file – e.g. `tests/pos/i12345/`, and put all the Scala files that are needed to reproduce the issue there.

If you have multiple files per issue, they will be compiled together by the same compiler run – *joint compilation*. Sometimes though you want them to be compiled one after another, available to each other via classpath – *separate compilation*. To achieve that, add suffix `_n` to the file name, where `n` is an integer defining the order in which the file will compile. E.g. if you have two files, `Lib.scala` and `Main.scala`, and you need them compiled separately – Lib first, Main second, then name them `Lib_1.scala` and `Main_2.scala`.

`run` tests also have `*.check` files. These contain the expected output of an issue. They are named after the issue they are checking, e.g. `i12345.check` for `i12345.scala`.

To run your test, use the `testCompilation i123456` command.

The group tests – `pos`, `neg` etc – are defined in [CompilationTests.scala]. If you want to run a group of tests, e.g.
`pos`, you can do so via `testOnly dotty.tools.dotc.CompilationTests -- *pos` command.

The above is the most common test cases but not all of them. E.g. REPL, scripting and command line tools aren't covered
by the above. The sources for the tests are located at [compiler/test], so if your use case isn't covered by this guide,
you may need to consult the codebase.


[lampepfl/dotty]: https://github.com/lampepfl/dotty
[CompilationTests.scala]: https://github.com/lampepfl/dotty/blob/master/compiler/test/dotty/tools/dotc/CompilationTests.scala
[compiler/test]: https://github.com/lampepfl/dotty/blob/master/compiler/test/
[pull-request]: https://docs.github.com/en?query=pull+requests
