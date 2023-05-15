---
title: What else can MUnit do?
type: section
description: A incomplete list of features of MUnit
num: 9
previous-page: testing-resources
next-page: os-intro
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Adding clues to get better error report

Use `clue` inside an `assert` to a get a better error report when the assertion fails.

{% tabs clues %}
{% tab 'Scala 2 and 3' %}
```scala
assert(clue(List(a).head) > clue(b))
// munit.FailException: assertion failed
// Clues {
//   List(a).head: Int = 1
//   b: Int = 2
// }
```
{% endtab %}
{% endtabs %}

Learn more about clues in the [MUnit documentation](https://scalameta.org/munit/docs/assertions.html#assert).

## Writing environment-specific tests

Use `assume` to write environment-specific tests.
`assume` can contain a boolean condition. You can check the operating system, the Java version, a Java property, an environment variable, or anything else.
A test is skipped if one of its assumptions isn't met.

{% tabs assumption class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import scala.util.Properties

test("home directory") {
  assume(Properties.isLinux, "this test runs only on Linux")
  assert(os.home.toString.startsWith("/home/"))
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import scala.util.Properties

test("home directory") {
  assume(Properties.isLinux, "this test runs only on Linux")
  assert(os.home.toString.startsWith("/home/"))
}
```
{% endtab %}
{% endtabs %}

Learn more about filtering tests in the [MUnit documentation](https://scalameta.org/munit/docs/filtering.html).

## Tagging flaky tests

You can tag a test with `flaky` to mark it as being flaky.
Flaky tests can be skipped by setting the `MUNIT_FLAKY_OK` environment variable to `true`.

{% tabs flaky class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
test("requests".flaky) {
  // I/O heavy tests that sometimes fail
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
test("requests".flaky) {
  // I/O heavy tests that sometimes fail
}
```
{% endtab %}
{% endtabs %}

Learn more about flaky tests in the [MUnit documentation](https://scalameta.org/munit/docs/tests.html#tag-flaky-tests)

