---
title: How to run tests?
type: section
description: Running the MUnit tests
num: 4
previous-page: testing-suite
next-page: testing-run-only
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Running the tests

You can run all of your test suites with a single command.

{% tabs munit-unit-test-4 class=tabs-build-tool %}
{% tab 'Scala CLI' %}
Using Scala CLI, the following command runs all the tests in the folder `example`:
```
scala-cli test example
# Compiling project (test, Scala 3.2.1, JVM)
# Compiled project (test, Scala 3.2.1, JVM)
# MyTests:
#  + sum of two integers 0.009s
```
{% endtab %}
{% tab 'sbt' %}
In the sbt shell, the following command runs all the tests of the project `example`:
```
sbt:example> test
# MyTests:
#   + sum of two integers 0.006s
# [info] Passed: Total 1, Failed 0, Errors 0, Passed 1
# [success] Total time: 0 s, completed Nov 11, 2022 12:54:08 PM
```
{% endtab %}
{% tab 'Mill' %}
In Mill, the following command runs all the tests of the module `example`:
```
./mill example.test.test
# [71/71] example.test.test
# MyTests:
#   + sum of two integers 0.008s
```
{% endtab %}
{% endtabs %}

The test report, printed in the console, shows the status of each test.
The `+` symbol before a test name shows that the test passed successfully.

Add and run a failing test to see how a failure looks:

{% tabs assertions-1 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
test("failing test") {
  val obtained = 2 + 3
  val expected = 4
  assertEquals(obtained, expected)
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
test("failing test") {
  val obtained = 2 + 3
  val expected = 4
  assertEquals(obtained, expected)
}
```
{% endtab %}
{% endtabs %}

```
# MyTests:
#   + sum of two integers 0.008s
# ==> X MyTests.failing test  0.015s munit.ComparisonFailException: ./MyTests.test.scala:13
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

The line starting with `==> X` indicates that the test named `failing test` fails.
The following lines show where and how it failed.
Here it shows that the obtained value is 5, where 4 was expected.
