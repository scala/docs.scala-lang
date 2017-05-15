---
title: Testing Scala in IntelliJ with ScalaTest
layout: inner-page-no-masthead
disqus: true
previous-page: building-a-scala-project-with-intellij-and-sbt
---

There are multiple libraries and testing methodologies for Scala,
but in this tutorial, we'll demonstrate one popular option from the ScalaTest framework
called [FunSuite](http://www.scalatest.org/getting_started_with_fun_suite).
We assume you know [how to build a project in IntelliJ](building-a-scala-project-with-intellij-and-sbt.html).

## Setup
1. Create an sbt project in IntelliJ.
* Add the ScalaTest dependency to your build.sbt file:

```
libraryDependencies += "org.scalatest" %% "scalatest" % "3.0.1" % "test"
```

1. this will cause sbt to pull down the ScalaTest library
1. If you get a notification "build.sbt was changed", select **auto-import**.
1. On the project pane on the left, expand `src` => `main`.
1. Right-click on `scala` and select **New** => **Scala class**.
1. Call it `CubeCalculator`, change the **Kind** to `object`, and click **OK**.
1. Replace the code with the following:

```
object CubeCalculator extends App {
  def cube(x: Int) = {
    x * x * x
  }
}
```

## Creating a test
1. On the project pane on the left, expand `src` => `test`.
1. Right-click on `scala` and select **New** => **Scala class**.
1. Name the class `CubeCalculatorTest` and click **OK**.
1. Replace the code with the following:

```
import org.scalatest.FunSuite

class CubeCalculatorTest extends FunSuite {
  test("CubeCalculator.cube") {
    assert(CubeCalculator.cube(3) === 27)
  }
}
```

1. In the source code, right-click `CubeCalculatorTest` and select **Run
'CubeCalculatorTest'**.

## Understanding the code
Let's go over this line by line.

* `class CubeCalculatorTest` means we are testing the object `CubeCalculator`
* `extends FunSuite` lets us use functionality of ScalaTest's FunSuite class
such as the `test` function
* `test` is function that comes from the FunSuite library that collects
results from assertions within the function body.
* `"CubeCalculator.cube"` is a name for the test. You can call it anything but
one convention is "ClassName.methodName".
* `assert` takes a boolean condition and determines whether the test passes or fails.
* `CubeCalculator.cube(3) === 27` checks whether the output of the `cube` function is
indeed 27. The `===` is part of ScalaTest and provides clean error messages.

## Adding another test case
1. Add another `assert` statement after the first one that checks for the cube
of `0`.
1. Re-run the test again by right-clicking `CubeCalculatorTest` and selecting
'Run **CubeCalculatorTest**'.

## Conclusion
You've seen one way to test your Scala code. You can learn more about
ScalaTest's FunSuite on the [official website](http://www.scalatest.org/getting_started_with_fun_suite).
