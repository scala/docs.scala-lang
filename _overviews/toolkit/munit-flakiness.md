---
title: How to deal with flaky tests?
type: section
description: Describe the flaky tag in MUnit.
num: 10
previous-page: munit-resources
next-page: munit-assumptions
---

{% include markdown.html path="_markdown/install-munit.md" %}

A flaky test is a test that fails randomly depending on some outside factor: network issue, concurrency issue, high memory or CPU usage, etc.
Flaky tests are inconvenient because they can make your CI fail regardless of the actual changes in the code.

Stabilizing a flaky test is sometimes hard to do.
Removing the test would make it riskier to introduce bugs.
Alternatively, in Munit, you can flag a test with `flaky`.
It will still be run, but its result will be ignored, under some conditions.

{% tabs 'flaky-1' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
class MyTests extends munit.FunSuite {
  test("send some request".flaky) {
    // body of the test
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
class MyTests extends munit.FunSuite:
  test("send some request".flaky) {
    // body of the test
  }
```
{% endtab %}
{% endtabs %}


In your CI, you can set the `MUNIT_FLAKY_OK` environment variable to `true` to ignore the failure of the tests flagged with `flaky`.

{% tabs 'flaky-2' class=tabs-ci %}
{% tab 'Github Action' %}
In a Github action this is how you can set `MUNIT_FLAKY_OK`.

```yaml
env:
  MUNIT_FLAKY_OK: true
```
{% endtab %}
{% endtabs %}

The CI will pass even if the flaky test fails.

Beware not to abuse the flaky tag, as it can make your tests fail silently because of a regression in your code.
To avoid this you should, once in while, run the flaky tests locally, or without the `MUNIT_FLAKY_OK`.
