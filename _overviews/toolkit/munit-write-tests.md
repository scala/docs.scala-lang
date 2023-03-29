---
title: How to write tests?
type: section
description: The basics of writing a test suite with MUnit
num: 6
previous-page: munit-intro
next-page: munit-run-tests
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

## Assertions

Assertions describe what to check in your tests. If any assertion in a unit test
fails, then the test fails. This tutorial shows the main assertion operations
supported by [MUnit](https://index.scala-lang.org/scalameta/munit):
- `assertEquals` to check that what you obtain is equal to what you expect,
- `assert` to check a boolean condition on the result of a method.

Here is an example of test that use `assert` to check a boolean condition on a list.

{% tabs assertions-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class MyTests extends munit.FunSuite {
  test("a unit test") {
    // create a list containing some arbitrary input values
    val input = List(1, 2, 3, 4)
    // compute the double of every input value
    val obtainedResults = input.map(double)
    // check that they are all even numbers
    assert(obtainedResults.forall(x => x % 2 == 0))
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MyTests extends munit.FunSuite:
  test("a unit test") {
    // create a list containing some arbitrary input values
    val input = List(1, 2, 3, 4)
    // compute the double of every input value
    val obtainedResults = input.map(double)
    // check that they are all even numbers
    assert(obtainedResults.forall(x => x % 2 == 0))
  }
```
{% endtab %}
{% endtabs %}

MUnit contains more assertion methods that you can discover in its [documentation](https://scalameta.org/munit/docs/assertions.html):
`assertNotEquals`, `assertNoDiff`, `fail`, and `compileErrors`.

