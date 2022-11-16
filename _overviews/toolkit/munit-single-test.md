---
title: How to run a single test?
type: section
description: ???
num: 6
previous-page: munit-exceptions
next-page: munit-clues
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Declare specific tests to run from within the test file

Within a test suite file, you can select individual tests to run by appending `.only` to a test name, e.g.

{% tabs 'only-demo' class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
class MathSuite extends munit.FunSuite {
  test("addition") {
    assert(1 + 1 == 2)
  }

  test("multiplication".only) {
    assert(3 * 7 == 21)
  }

  test("remainder".only) {
    assert(13 % 5 == 3)
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

  test("remainder".only) {
    assert(13 % 5 == 3)
  }
```
{% endtab %}

{% endtabs %}

In the above example, [running the tests as usual]({% link _overviews/toolkit/munit-test-suite.md %}) will only run the `"multiplication"` and `"remainder"` tests (i.e. `"addition"` is ignored). This is useful to quickly debug specific tests in a suite.

## Alternative: exclude specific tests

You can exclude specific tests from running by appending `.ignore` to the test name, for example the following will only ignore the `"addition"` test, but continue to run the others:

{% tabs 'ignore-demo' class=tabs-scala-version %}

{% tab 'Scala 2' %}
```scala
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

MUnit lets you group tests accross suites by a tag, aka a textual label. For example, you could tag tests by a feature that is covered, and then run only the tests that cover that feature. [Read the MUnit docs][munit-tags] for clear instructions on how to do this.

[munit-tags]: https://scalameta.org/munit/docs/filtering.html#include-and-exclude-tests-based-on-tags
