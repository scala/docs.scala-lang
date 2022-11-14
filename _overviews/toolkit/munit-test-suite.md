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

For instance, you can create a `WebService.test.scala` file, just next to a `Webservice.scala` file:
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

After creating the test file, you can define a test suite:

```scala
class MyTests extends munit.FunSuite:
  test("sum of two integers") {
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
  }
```

In MUnit, a test suite is a `class` that extends `munit.FunSuite`.

<blockquote class="help-info">
<i class="fa fa-info"></i>&nbsp;&nbsp;
If your test suite is an object or if it is a class with a non-empty constructor, MUnit will complain with an org.junit.runners.model.InvalidTestClassError exception.
</blockquote>

It must contain one or more tests, defined by calling the `test` method in the body of the test suite.
The `test` method takes a first argument which is the name of the test and a second argument wich is the body of the test.


You can use assertion methods, such as `assertEquals`, in the body of the test to check the correctness of the program.

In the previous example the test would pass if the values of `obtained` and `expected` are the same.
Let's check this by running the test.

## Running the tests

You can run all the tests of your program in a single command.

{% tabs munit-unit-test-4 %}
{% tab 'Scala CLI' %}
Using Scala CLI, you can run the `test` command and pass it the folder containing all your source files, or just `.` if you run Scala CLI in that folder.
```
scala-cli test example
# Compiling project (test, Scala 3.2.1, JVM)
# Compiled project (test, Scala 3.2.1, JVM)
# MyTests:
#  + sum of two integers 0.009s
```
{% endtab %}
{% tab 'sbt' %}
In the sbt shell, you can run the `test` task of the `example` project:
```
sbt:example> example/test
# MyTests:
#   + sum of two integers 0.006s
# [info] Passed: Total 1, Failed 0, Errors 0, Passed 1
# [success] Total time: 0 s, completed Nov 11, 2022 12:54:08 PM
```
{% endtab %}
{% tab 'Mill' %}
Using Mill, you can run the `test` task in the `test` module of the `example` module:
```
./mill example.test.test
# [71/71] example.test.test 
# MyTests:
#   + sum of two integers 0.008s
```
{% endtab %}
{% endtabs %}

The `+` symbol before the name of the test indicates that the test passed successfully.

You can add a failing test to see the difference:
```scala
test("failing test") {
  val obtained = 2 + 3
  val expected = 4
  assertEquals(obtained, expected)
}
```

This test should fail, as `2 + 3` should not return `4`.
Indeed, after running the test you should see the following output:

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
The following lines give you indications of where and why it failed.
It failed on line 13 because the value of `obtained` is `5` while the value of `expected` is `4`.
