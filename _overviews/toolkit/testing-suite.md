---
title: How to write tests?
type: section
description: The basics of writing a test suite with MUnit
num: 3
previous-page: testing-intro
next-page: testing-run
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Writing a test suite

A group of tests in a single class is called a test class or test suite.

Each test suite validates a particular component or feature of the software.
Typically we define one test suite for each source file or class that we want to test.

{% tabs munit-unit-test-2 class=tabs-build-tool %}
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
In sbt, test sources go in the `src/test/scala` folder.

For instance, the following is the file structure of a project `example`:
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
In Mill, test sources go in the `test/src` folder.

For instance, the following is the file structure of a module `example`:
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

In the test source file, define a suite containing a single test:

{% tabs munit-unit-test-3 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
package example

class MyTests extends munit.FunSuite {
  test("sum of two integers") {
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
package example

class MyTests extends munit.FunSuite:
  test("sum of two integers"):
    val obtained = 2 + 2
    val expected = 4
    assertEquals(obtained, expected)
```
{% endtab %}
{% endtabs %}

A test suite is a Scala class that extends `munit.FunSuite`.
It contains one or more tests, each defined by a call to the `test` method.

In the previous example, we have a single test `"sum of integers"` that checks that `2 + 2` equals `4`.
We use the assertion method `assertEquals` to check that two values are equal.
The test passes if all the assertions are correct and fails otherwise.

## Assertions

It is important to use assertions in each and every test to describe what to check.
The main assertion methods in MUnit are:
- `assertEquals` to check that what you obtain is equal to what you expected
- `assert` to check a boolean condition

The following is an example of a test that use `assert` to check a boolean condition on a list.

{% tabs assertions-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
test("all even numbers") {
  val input: List[Int] = List(1, 2, 3, 4)
  val obtainedResults: List[Int] = input.map(_ * 2_)
  // check that obtained values are all even numbers
  assert(obtainedResults.forall(x => x % 2 == 0))
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
test("all even numbers"):
  val input: List[Int] = List(1, 2, 3, 4)
  val obtainedResults: List[Int] = input.map(_ * 2_)
  // check that obtained values are all even numbers
  assert(obtainedResults.forall(x => x % 2 == 0))
```
{% endtab %}
{% endtabs %}

MUnit contains more assertion methods that you can discover in its [documentation](https://scalameta.org/munit/docs/assertions.html):
`assertNotEquals`, `assertNoDiff`, `fail`, and `compileErrors`.
