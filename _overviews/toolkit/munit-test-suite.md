---
title: How to write and run a test suite?
type: section
description: The basics of writing unit tests using munit
num: 3
previous-page: munit-intro
next-page: munit-assertions
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Writing a test suite

In Scala we define groups of tests that we call test suites.
Each test suite is intended to validate a particular component or feature of the software.
Typically we define one test suite for each source file, or each class, that we want to test.

{% tabs munit-unit-test-2 %}
{% tab 'Scala CLI' %}
In Scala CLI, the test file can live in the same folder as the actual code, but the name of the file must end with `.test.scala`.
In the following, `MyTests.test.scala` is a test file.
```
example/
├── MyApp.scala
└── MyTests.test.scala
```
Other valid structures and conventions are described in the [Scala CLI documentation](https://scala-cli.virtuslab.org/docs/commands/test/#test-sources).
{% endtab %}
{% tab 'sbt' %}
In sbt, the test files must be written in the `example/src/test/scala` folder of the module.

For instance:
```
example
└── src
    ├── main
    │   └── scala
    │       └── MyApp.scala
    └── test
        └── scala
            └── MyTests.scala
```
{% endtab %}
{% tab 'Mill' %}
In Mill, the test files must be written in the `example/test/src` folder of the module.

For instance:
```
example
└── src
|   └── MyApp.scala
└── test
    └── src
        └── MyTests.scala
```
{% endtab %}
{% endtabs %}

In the test file, you can define a test suite, a Scala class that extends `munit.FunSuite`.

```scala
class MyTests extends munit.FunSuite:
  test("sum of two integers") {
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
  }
```

To define a test, call the `test` method in the body of your test suite.
It takes two arguments: a name and a body.

In the previous example, we have a test `"sum of integers"` that checks that `2 + 2` equals `4`.

The assertion method `assertEquals` is used to check that two values are equal.
The test passes if all the assertions are met, otherwise it fails.

Let's check that `2+2` equals `4` by running the test.

## Running the tests

You can run all the tests of your program in a single command.

{% tabs munit-unit-test-4 %}
{% tab 'Scala CLI' %}
Using Scala CLI, to run all the tests in folder `example`:
```
scala-cli test example
# Compiling project (test, Scala 3.2.1, JVM)
# Compiled project (test, Scala 3.2.1, JVM)
# MyTests:
#  + sum of two integers 0.009s
```
{% endtab %}
{% tab 'sbt' %}
In the sbt shell, to run all the tests of project `example`:
```
sbt:example> example/test
# MyTests:
#   + sum of two integers 0.006s
# [info] Passed: Total 1, Failed 0, Errors 0, Passed 1
# [success] Total time: 0 s, completed Nov 11, 2022 12:54:08 PM
```
{% endtab %}
{% tab 'Mill' %}
In Mill, to run all the tests of module `example`:
```
./mill example.test.test
# [71/71] example.test.test 
# MyTests:
#   + sum of two integers 0.008s
```
{% endtab %}
{% endtabs %}

The `+` symbol before the name of the test indicates that the test passed successfully.

Add and run a failing test to see its different report:
```scala
test("failing test") {
  val obtained = 2 + 3
  val expected = 4
  assertEquals(obtained, expected)
}
```

```
# MyTests:
#   + sum of two integers 0.008s
# ==> X MyTests.failing test  0.015s munit.ComparisonFailException: ./example/MyTests.test.scala:13
# 12:    val expected = 4
# 13:    assertEquals(obtained, expected)
# 14:  }
# values are not the same
# => Obtained
# 5
# => Diff (- obtained, + expected)
# -5
# +4
#     at munit.Assertions.failComparison(Assertions.scala:274)
```

The line starting with `==> X` indicates that the test named `failing test` failed.
The following lines contain indications of where and why it failed.
