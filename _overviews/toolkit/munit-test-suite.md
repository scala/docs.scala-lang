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
Each test suite is intended to validate a particular component of the software.
Typically we define one test suite for each source file, or each class, that we want to test.
For instance, if we have a file `WebService.scala` in our main application, we create a file `WebServiceTests.scala` to test it.

The naming convention of the file depends on the tool that we use.

{% tabs munit-unit-test-2 %}
{% tab 'Scala CLI' %}
In Scala CLI, the test file can live in the same folder as the actual code, but the name of the file must end with `.test.scala`.

For instance we can have:
```
example/
├── WebService.scala
└── WebService.test.scala
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
    │       └── WebService.scala
    └── test
        └── scala
            └── WebServiceTests.scala
```
{% endtab %}
{% tab 'Mill' %}
In Mill, the test files must be written in the `example/test/src` folder of the module.

For instance:
```
example
└── src
|   └── WebService.scala
└── test
    └── src
        └── WebServiceTests.scala
```
{% endtab %}
{% endtabs %}

After creating the test file, we write a test suite:

{% tabs munit-unit-test-3 %}
{% tab 'Scala CLI' %}
```scala
//> using toolkit

class MyTests extends munit.FunSuite:
  test("sum of two integers") {
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
  }
```
{% endtab %}
{% tab 'sbt and Mill' %}
```scala
class MyTests extends munit.FunSuite:
  test("sum of two integers") {
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
  }
```
{% endtab %}
{% endtabs %}

In MUnit, a test suite is a `class` that extends `munit.FunSuite`.
It must contain one or more tests, defined by calling the `test` method in the body of the test suite.
The `test` method takes a first argument which is the name of the test and a second argument wich is the body of the test.

We use assertion methods, such as `assertEquals`, in the body of the test to check the correctness of the program.

In our previous example the test would pass if the values of `obtained` and `expected` are the same.
Let's check this by running the test.

## Running the tests

We can run all the tests of our program in a single command.

{% tabs munit-unit-test-4 %}
{% tab 'Scala CLI' %}
Using Scala CLI, we run the `test` command and pass it the folder containing our source files. It can be the `example` folder or the `.` folder.
```
scala-cli test example
# Compiling project (test, Scala 3.2.1, JVM)
# Compiled project (test, Scala 3.2.1, JVM)
# MyTests:
#  + sum of two integers 0.009s
```
{% endtab %}
{% tab 'sbt' %}
In the sbt shell, we run the `test` task of the `example` project:
```
sbt:example> example/test
# MyTests:
#   + sum of two integers 0.006s
# [info] Passed: Total 1, Failed 0, Errors 0, Passed 1
# [success] Total time: 0 s, completed Nov 11, 2022 12:54:08 PM
```
{% endtab %}
{% tab 'Mill' %}
Using Mill, we run the `test` task in the `test` module of the `example` module:
```
./mill example.test.test
# [71/71] example.test.test 
# MyTests:
#   + sum of two integers 0.008s
```
{% endtab %}
{% endtabs %}

The `+` symbol before the name of the test indicates that the test passed successfully.

We can add a failing test to see the difference:
```scala
test("failing test") {
  val obtained = 2 + 3
  val expected = 4
  assertEquals(obtained, expected)
}
```

Running the test suite should now return the following output:

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

The line starting with `==> X MyTests.failing test` indicates that the test named `failing test` failed.
The following lines gives us indications of where and why it failed.
It failed on line 13 because the value of `obtained` is `5` while the value of `expected` is `4`.
