---
title: How to run a single test?
type: section
description: About testOnly in the build tool and .only in MUnit
num: 5
previous-page: testing-run
next-page: testing-exceptions
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Running a single test suite

{% tabs munit-unit-test-only class=tabs-build-tool %}
{% tab 'Scala CLI' %}
To run a single `example.MyTests` suite with Scala CLI, use the `--test-only` option of the `test` command.
```
scala-cli test example --test-only example.MyTests
```

{% endtab %}
{% tab 'sbt' %}
To run a single `example.MyTests` suite in sbt, use the `testOnly` task:
```
sbt:example> testOnly example.MyTests
```
{% endtab %}
{% tab 'Mill' %}
To run a single `example.MyTests` suite in Mill, use the `testOnly` task:
```
./mill example.test.testOnly example.MyTests
```
{% endtab %}
{% endtabs %}

## Running a single test in a test suite

Within a test suite file, you can select individual tests to run by temporarily appending `.only`, e.g.

{% tabs 'only-demo' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc
class MathSuite extends munit.FunSuite {
  test("addition") {
    assert(1 + 1 == 2)
  }
  test("multiplication".only) {
    assert(3 * 7 == 21)
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MathSuite extends munit.FunSuite:
  test("addition") {
    assert(1 + 1 == 2)
  }
  test("multiplication".only) {
    assert(3 * 7 == 21)
  }
```
{% endtab %}
{% endtabs %}

In the above example, only the `"multiplication"` tests will run (i.e. `"addition"` is ignored).
This is useful to quickly debug a specific test in a suite.

## Alternative: excluding specific tests

You can exclude specific tests from running by appending `.ignore` to the test name.
For example the following ignores the `"addition"` test, and run all the others:

{% tabs 'ignore-demo' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala mdoc:reset
class MathSuite extends munit.FunSuite {
  test("addition".ignore) {
    assert(1 + 1 == 2)
  }
  test("multiplication") {
    assert(3 * 7 == 21)
  }
  test("remainder") {
    assert(13 % 5 == 3)
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MathSuite extends munit.FunSuite:
  test("addition".ignore) {
    assert(1 + 1 == 2)
  }
  test("multiplication") {
    assert(3 * 7 == 21)
  }
  test("remainder") {
    assert(13 % 5 == 3)
  }
```
{% endtab %}
{% endtabs %}

## Use tags to group tests, and run specific tags

MUnit lets you group and run tests across suites by tags, which are textual labels.
[The MUnit docs][munit-tags] have instructions on how to do this.

[munit-tags]: https://scalameta.org/munit/docs/filtering.html#include-and-exclude-tests-based-on-tags
