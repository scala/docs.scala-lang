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

Tests in Scala 3 are divided into two kinds:
- **compilation tests**, [described here](#compilation-tests), these take source files contained
  in a subdirectory within `tests/` and compile them under some conditions configured elsewhere.
- **unit tests**, [described here](#unit-tests), these test more specialised parts of the compiler, and are usually
  self contained within a single file.

## Compilation Tests

Compilation tests run the compiler over input files, using various settings. Input files
are found within the `tests/` folder at the root of the compiler repo.

Test input files are categorised further by the virtue of placing them in the subfolders
of the `tests/` folder. Three main tests categories are:

- `tests/pos` – tests that should compile: pass if compiles successfully.
- `tests/neg` – should not compile: pass if fails compilation. Useful, e.g., to test an expected compiler error.
- `tests/run` – these tests not only compile but are also run.

Tests are, by convention, named after the number of the issue they are fixing.
e.g. if you are fixing issue 12345, then the test should be named `i12345.scala`, for an individual test,
or be within a directory called `i12345/`.

To run the test, use the `testCompilation i12345` sbt command.

The group tests – `pos`, `neg` etc – are defined in [CompilationTests.scala]. If you want to run a group of tests, e.g.
`pos`, you can do so via `testOnly dotty.tools.dotc.CompilationTests -- *pos` command.

### Issues Reproduced in a Single Input File

If your issue is reproducible by only one file, put that file under an appropriate category.
For example, if your issue is about getting rid of a spurious compiler error (that is a code that doesn't compile should, in fact, compile), you can create a file `tests/pos/i12345.scala`.

### Issues Reproduced in Multiple Input Files

If you need more than one file to reproduce an issue, create a folder instead of a file – e.g. `tests/pos/i12345/`, and put all the Scala files that are needed to reproduce the issue there. There are two ways to organise the
input files within:

**1: Requiring classpath dependency:** Sometimes issues require one file to be compiled after the other,
(e.g. if the issue only happens with a library dependency, like with Java interop). In this case,
the outputs of the first file compiled will be available to the next file compiled, available via the classpath.
This is called *separate compilation*.

To achieve this, within `tests/pos/i12345/`, add a suffix `_n` to each file name, where `n` is an integer defining the
order in which the file will compile. E.g. if you have two files, `Lib.scala` and `Main.scala`, and you need them
compiled separately – Lib first, Main second, then name them `Lib_1.scala` and `Main_2.scala`.

**2: Without classpath dependency:** If your issue does not require a classpath dependency, your files can be compiled
in a single run, this is called *joint compilation*. In this case use file names without the `_n` suffix.

### Checking Program Output

`tests/run` tests verify the runtime behaviour of a test case. To make a valid test case, your input files should
contain a main method in a class called `Test`, this can be done with
```scala
@main def Test: Unit = assert(1 > 0)
```
or with
```scala
object Test extends scala.App:
  assert(1 > 0)
```

If your program also prints output, this can be compared against `*.check` files.
These contain the expected output of a program. Check files are named after the issue they are checking,
e.g. `i12345.check` will check both of `tests/run/i12345.scala` and `tests/run/i12345/`.

### Checking Compilation Errors

`tests/neg` tests verify that a file does not compile, and user-facing errors are produced. There are other neg
categories such as `neg-custom-args`, i.e. with `neg` prefixing the directory name. Test files in the `neg*`
categories require annotations for the lines where errors are expected. To do this add one `// error` token to the
end of a line for each error expected. e.g. if there are three errors expected, the end of line should contain
`// error // error // error`.

You can verify the content of the error messages with a `*.check` file. These contain the expected output of the
compiler. Check files are named after the issue they are checking,
e.g. `i12345.check` will check both of `tests/neg/i12345.scala` and `tests/neg/i12345/`.
*Note:* check files are not required for the test to pass, however they do add more strong contraints that the errors
are as expected.

### If Checking is not as Expected

If the actual output mismatches the expected output, the test framework will dump the actual output in the file
`*.check.out` and fail the test suite. It will also output the instructions to quickly replace the expected output
with the actual output, in the following format:

```
Test output dumped in: tests/playground/neg/Sample.check.out
  See diff of the checkfile
    > diff tests/playground/neg/Sample.check tests/playground/neg/Sample.check.out
  Replace checkfile with current output
    > mv tests/playground/neg/Sample.check.out tests/playground/neg/Sample.check
```

### Tips for creating Check Files

To create a checkfile for a test, you can do one of the following:

1. Create an empty checkfile
   - then add random content
   - run the test
   - when it fails, use the `mv` command reported by the test to replace the initial checkfile with the actual output.
2. Manually compile the file you are testing with `scalac`
   - copy-paste whatever console output the compiler produces to the checkfile.

### Automatically Updating checkfiles

When complex or many checkfiles must be updated, `testCompilation` can run in a mode where it overrides the
checkfiles with the test outputs.
```bash
$ sbt
> testCompilation --update-checkfiles
```

Use `--help` to see all the options
```bash
$ sbt
> testCompilation --help
```

### Bootstrapped-only tests

To run `testCompilation` on a bootstrapped Dotty compiler, use
`scala3-compiler-bootstrapped/testCompilation` (with the same syntax as above).
Some tests can only be run in bootstrapped compilers; that includes all tests
with `with-compiler` in their name.

### From TASTy tests

`testCompilation` has an additional mode to run tests that compile code from a `.tasty` file.
 Modify the lists in [compiler/test/dotc] to enable or disable tests from `.tasty` files.

 ```bash
 $ sbt
 > testCompilation --from-tasty
 ```

 This mode can be run under `scala3-compiler-bootstrapped/testCompilation` to test on a bootstrapped Dotty compiler.

## Unit Tests

Unit tests cover the other areas of the compiler, such as interactions with the REPL, scripting tools and more.
They are defined in [compiler/test], so if your use case isn't covered by this guide,
you may need to consult the codebase. Some common areas are highlighted below:

### SemanticDB tests

To test the SemanticDB output from the `extractSemanticDB` phase (enabled with the `-Xsemanticdb` flag), run the following sbt command:
```bash
$ sbt
sbt:scala3> scala3-compiler-bootstrapped/testOnly
> dotty.tools.dotc.semanticdb.SemanticdbTests
```

[SemanticdbTests] uses source files in `tests/semanticdb/expect` to generate "expect files":
these verify both
- SemanticDB symbol occurrences inline in sourcecode (`*.expect.scala`)
- complete output of all SemanticDB information (`metac.expect`).

Expect files are used as regression tests to detect changes in the compiler.
Their correctness is determined by human inspection.

If expect files change then [SemanticdbTests] will fail, and generate new expect files, providing instructions for
comparing the differences and replacing the outdated expect files.

If you are planning to update the SemanticDB output, you can do it in bulk by running the command
```bash
$ sbt
sbt:scala3> scala3-compiler-bootstrapped/Test/runMain
> dotty.tools.dotc.semanticdb.updateExpect
```

then compare the changes via version control.


[lampepfl/dotty]: https://github.com/lampepfl/dotty
[CompilationTests.scala]: https://github.com/lampepfl/dotty/blob/master/compiler/test/dotty/tools/dotc/CompilationTests.scala
[compiler/test]: https://github.com/lampepfl/dotty/blob/master/compiler/test/
[pull-request]: https://docs.github.com/en?query=pull+requests
[compiler/test/dotc]: https://github.com/lampepfl/dotty/tree/master/compiler/test/dotc
[SemanticdbTests]: https://github.com/lampepfl/dotty/blob/master/compiler/test/dotty/tools/dotc/semanticdb/SemanticdbTests.scala