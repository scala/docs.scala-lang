---
title: How to test exceptions?
type: section
description: Describe the intercept assertion
num: 9
previous-page: munit-test-only
next-page: munit-asynchronous-tests
---

{% include markdown.html path="_markdown/install-munit.md" %}

In a test, you can use the `intercept` assertion to check that your code throws an exception.

{% tabs 'intercept-1' class=tabs-scala-version %}
{% tab 'Scala 2' %}
```scala
import java.nio.file.NoSuchFileException

class FileTests extends munit.FunSuite {
  test("read missing file") {
    val missingFile = os.pwd / "missing.txt"
    
    intercept[NoSuchFileException] { 
      os.read(missingFile)
    }
  }
}
```
{% endtab %}
{% tab 'Scala 3' %}
```scala
import java.nio.file.NoSuchFileException

class FileTests extends munit.FunSuite:
  test("read missing file") {
    val missingFile = os.pwd / "missing.txt"
    
    intercept[NoSuchFileException] {
      // the code that should throw an exception
      os.read(missingFile)
    }
  }
```
{% endtab %}
{% endtabs %}

The type parameter of the `intercept` assertion is the expected exception.
Here it is `NoSuchFileException`.
The body of the `intercept` assertion contains the code that should throw the exception.

The test passes if the code throws the expected exception and it fails otherwise.

The `intercept` method returns the exception that is thrown.
You can check more assertions on it.

```scala
val exception = intercept[NoSuchFileException](os.read(missingFile))
assert(clue(exception.getMessage).contains("missing.txt"))
```

You can also use the more concise `interceptMessage` method to test the exception and its message in a single assertion.
Learn more about it in the [MUnit documentation](https://scalameta.org/munit/docs/assertions.html#interceptmessage).
