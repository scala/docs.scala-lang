---
title: How to run tests?
type: section
description: Running the MUnit tests
num: 7
previous-page: munit-write-tests
next-page: munit-test-only
---

{% include markdown.html path="_markdown/install-munit.md" %}

## Running the tests

You can run all the tests of your program in a single command.

{% tabs munit-unit-test-4 class=tabs-build-tool %}
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
