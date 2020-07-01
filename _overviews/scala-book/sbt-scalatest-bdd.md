---
type: section
layout: multipage-overview
title: Writing BDD Style Tests with ScalaTest and sbt
description: This lesson shows how to write ScalaTest unit tests with sbt in a behavior-driven development (TDD) style.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 43
outof: 54
previous-page: sbt-scalatest-tdd
next-page: functional-programming
---



In the previous lesson you saw how to write Test-Driven Development (TDD) tests with [ScalaTest](http://www.scalatest.org). ScalaTest also supports a [Behavior-Driven Development (BDD)](https://dannorth.net/introducing-bdd/) style of testing, which we’ll demonstrate next.

>This lesson uses the same sbt project as the previous lesson, so you don’t have to go through the initial setup work again.



## Creating a Scala class to test

First, create a new Scala class to test. In the *src/main/scala/simpletest*, create a new file named *MathUtils.scala* with these contents:

```scala
package simpletest

object MathUtils {

    def double(i: Int) = i * 2

}
```

The BDD tests you’ll write next will test the `double` method in that class.



## Creating ScalaTest BDD-style tests

Next, create a file named *MathUtilsTests.scala* in the *src/test/scala/simpletest* directory, and put these contents in that file:

```scala
package simpletest

import org.scalatest.FunSpec

class MathUtilsSpec extends FunSpec {
  
    describe("MathUtils::double") {

        it("should handle 0 as input") {
            val result = MathUtils.double(0)
            assert(result == 0)
        }

        it("should handle 1") {
            val result = MathUtils.double(1)
            assert(result == 2)
        }

        it("should handle really large integers") (pending)
        
    }

}
```

As you can see, this is a very different-looking style than the TDD tests in the previous lesson. If you’ve never used a BDD style of testing before, a main idea is that the tests should be relatively easy to read for one of the “domain experts” who work with the programmers to create the application. A few notes about this code:

- It uses the `FunSpec` class where the TDD tests used `FunSuite`
- A set of tests begins with `describe`
- Each test begins with `it`. The idea is that the test should read like, “It should do XYZ...,” where “it” is the `double` function
- This example also shows how to mark a test as “pending”



## Running the tests

With those files in place you can again run `sbt test`. The important part of the output looks like this:

````
> sbt test

[info] HelloTests:
[info] - the name is set correctly in constructor
[info] - a Person's name can be changed
[info] MathUtilsSpec:
[info] MathUtils::double
[info] - should handle 0 as input
[info] - should handle 1
[info] - should handle really large integers (pending)
[info] Total number of tests run: 4
[info] Suites: completed 2, aborted 0
[info] Tests: succeeded 4, failed 0, canceled 0, ignored 0, pending 1
[info] All tests passed.
[success] Total time: 4 s, completed Jan 6, 2018 4:58:23 PM
````

A few notes about that output:

- `sbt test` ran the previous `HelloTests` as well as the new `MathUtilsSpec` tests
- The pending test shows up in the output and is marked “(pending)”
- All of the tests passed

If you want to have a little fun with this, change one or more of the tests so they intentionally fail, and then see what the output looks like.



## Where to go from here

For more information about sbt and ScalaTest, see the following resources:

- [The main sbt documentation](http://www.scala-sbt.org/documentation.html)
- [The ScalaTest documentation](http://www.scalatest.org/user_guide)








