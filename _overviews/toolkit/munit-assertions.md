---
title: How to write assertions?
type: section
description: Comparing what you obtain with what you expect
num: 4
previous-page: munit-test-suite
next-page: munit-exceptions
---

{% include markdown.html path="_markdown/install-munit.md" %}

Assertions describe what to check in your tests. If any assertion in a unit test
fails, then the test fails. This tutorial shows the main assertion operations
supported by [MUnit](https://index.scala-lang.org/scalameta/munit):
- `assertEquals` to check that what you obtain is equal to what you expect,
- `assert` to check a boolean condition on the result of a method.

Assuming you have defined a
[test suite]({% link _overviews/toolkit/munit-test-suite.md %}) `MyTests`, this
tutorial shows various ways to write assertions within test specifications.

{% tabs assertions-0 class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class MyTests extends munit.FunSuite {
  test("a unit test") {
    // test specification goes here
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MyTests extends munit.FunSuite:
  test("a unit test") {
    // test specification goes here
  }
```
{% endtab %}
{% endtabs %}

## Comparing What You Get With What You Expect

The most common form of assertions consists of comparing a result obtained from
the tested program with an expected value that you know is correct. You achieve
this with the method `assertEquals`, which you inherit from the test suite base
class, `munit.FunSuite`.

For instance, assuming your program provides a method `double`, which takes an
integer value as parameter and returns that value multiplied by two, you can
write the following assertion:

{% tabs assertions-1 %}
{% tab 'Scala 2 and 3' %}
```scala
assertEquals(double(21), 42)
```
{% endtab %}
{% endtabs %}

Note the order of the arguments: the first one is the result of the program, and
the second one is the expected correct result. To understand why this is important,
let us look at the test report you get in case the tested program is incorrect:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.068s munit.ComparisonFailException: ./example/MyTests.test.scala:7
# 6:  test("some-unit-test") {
# 7:    assertEquals(double(21), 42)
# 8:  }
# values are not the same
# => Obtained
# 23
# => Diff (- obtained, + expected)
# -23
# +42
```

The test report shows the difference between the obtained result (`23`) and the
expected result (`42`).

If, by mistake, you swap the order of the arguments of the call to `assertEquals`,
you get a wrong test report:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.068s munit.ComparisonFailException: ./example/MyTests.test.scala:7
# 6:  test("some-unit-test") {
# 7:    assertEquals(42, double(21)) // BAD EXAMPLE, don't copy this
# 8:  }
# values are not the same
# => Obtained
# 42
# => Diff (- obtained, + expected)
# -42
# +23
```

As you can see, the test report is confusing because it says that the expected
result is `23`, whereas it is actually `42`.

## Checking a Boolean Condition

You can check that a boolean condition holds by using the method `assert`, which
is also inherited from the base class `munit.FunSuite`.

For instance, you can check that all the values returned by `double` are even values
as follows:

{% tabs assertions-2 %}
{% tab 'Scala 2 and 3' %}
```scala
// create a list containing some arbitrary input values
val input = List(1, 2, 3, 4)
// compute the double of every input value
val obtainedResults = input.map(double)
// check that they are all even numbers
assert(obtainedResults.forall(x => x % 2 == 0))
```
{% endtab %}
{% endtabs %}

In case of failure, the test report looks like the following:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.035s munit.FailException: ./example/MyTests.test.scala:9 assertion failed
# 8:     val obtainedResults = input.map(double)
# 9:     assert(obtainedResults.forall(x => x % 2 == 0))
# 10:  }
#     at munit.FunSuite.assert(FunSuite.scala:11)
#     at MyTests.$init$$$anonfun$1(my-tests.test.scala:9)
```

## `assert` vs `assertEquals`

You may be tempted to write `assert(a == b)` instead of `assertEquals(a, b)`.
What is the difference between both?

The difference lies in the way failures are reported. With `assertEquals`,
MUnit shows a “diff” describing the difference between the expression that
was obtained and the expression that was expected. On the other hand, with
`assert`, MUnit only tells you that “an assertion failed”.

Below is a concrete example, for the sake of comparison. First, with `assertEquals`:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.068s munit.ComparisonFailException: ./example/MyTests.test.scala:7
# 6:  test("some-unit-test") {
# 7:    assertEquals(double(21), 42)
# 8:  }
# values are not the same
# => Obtained
# 23
# => Diff (- obtained, + expected)
# -23
# +42
```

Then, the same example with `assert` shows less details about the failure:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.068s munit.FailException: ./example/MyTests.test.scala:7 assertion failed
# 6:  test("some-unit-test") {
# 7:    assertEquals(double(21) == 42)
# 8:  }
```

Note that it is possible to slightly improve the errors reported by assertions
by adding [clues]({% link _overviews/toolkit/munit-clues.md %}).

In case the obtained and expected results are complex objects, MUnit shows a detailed
“diff” highlighting the very fields that were different between them. Here is an example
of test specification involving complex objects:

{% tabs assertions-3 %}
{% tab 'Scala 2 and 3' %}
```scala
// File User.scala
case class User(name: String, email: String)
```
```scala
// Test specification
val obtained = User("Alice", "alice@gmail.com")
val expected = User("Alice", "alice@sca.la")
assertEquals(obtained, expected)
```
{% endtab %}
{% endtabs %}

The test report is the following:

```text
# MyTests:
# ==> X MyTests.some-unit-test  0.072s munit.ComparisonFailException: /tmp/tests/my-tests.test.scala:11
# 10:    val expected = User("Alice", "alice@sca.la")
# 11:    assertEquals(obtained, expected)
# 12:  }
# values are not the same
# => Obtained
# User(
#   name = "Alice",
#   email = "alice@gmail.com"
# )
# => Diff (- obtained, + expected)
#    name = "Alice",
# -  email = "alice@gmail.com"
# +  email = "alice@sca.la"
#  )
```

You see that the test reports points out that the field `email` you obtain is
different from your expectation.

## Next Steps

This tutorial only covered the two main types of assertions that you can use with
MUnit. You can discover other assertion operations in the
[documentation of MUnit](https://scalameta.org/munit/docs/assertions.html):
`assertNotEquals`, `assertNoDiff`, `fail`, and `compileErrors`.
