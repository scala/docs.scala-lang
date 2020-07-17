---
type: section
layout: multipage-overview
title: Using ScalaTest with sbt
description: This lesson shows how to write ScalaTest unit tests with sbt in a test-driven development (TDD) style.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 42
outof: 54
previous-page: scala-build-tool-sbt
next-page: sbt-scalatest-bdd
---


[ScalaTest](http://www.scalatest.org) is one of the main testing libraries for Scala projects, and in this lesson you’ll see how to create a Scala project that uses ScalaTest. You’ll also be able to compile, test, and run the project with sbt.


## Creating the project directory structure

As with the previous lesson, create an sbt project directory structure for a project named *HelloScalaTest* with the following commands:

```sh
mkdir HelloScalaTest
cd HelloScalaTest
mkdir -p src/{main,test}/{java,resources,scala}
mkdir lib project target
```



## Creating the *build.sbt* file

Next, create a *build.sbt* file in the root directory of your project with these contents:

```scala
name := "HelloScalaTest"
version := "1.0"
scalaVersion := "{{site.scala-version}}"

libraryDependencies +=
    "org.scalatest" %% "scalatest" % "3.0.8" % Test

```

The first three lines of this file are essentially the same as the first example, and the `libraryDependencies` lines tell sbt to include the dependencies (jar files) that are needed to run ScalaTest:

```scala
libraryDependencies +=
    "org.scalatest" %% "scalatest" % "3.0.8" % Test
```

>The ScalaTest documentation has always been good, and you can always find the up to date information on what those lines should look like on the [Installing ScalaTest](http://www.scalatest.org/install) page.



## Create a Scala file

Next, create a Scala program that you can use to demonstrate ScalaTest. First, from the root directory of your project, create a directory under *src/main/scala* named *simpletest*:

```sh
$ mkdir src/main/scala/simpletest
```

Then, inside that directory, create a file named *Hello.scala* with these contents:

```scala
package simpletest

object Hello extends App {
    val p = new Person("Alvin Alexander")
    println(s"Hello ${p.name}")
}

class Person(var name: String)
```

There isn’t much that can go wrong with that source code, but it provides a simple way to demonstrate ScalaTest. At this point you can run your project with the `sbt run` command, where your output should look like this:

````
> sbt run

[warn] Executing in batch mode.
[warn]   For better performance, hit [ENTER] to switch to interactive mode, or
[warn]   consider launching sbt without any commands, or explicitly passing 'shell'
...
...
[info] Compiling 1 Scala source to /Users/al/Projects/Scala/HelloScalaTest/target/scala-2.12/classes...
[info] Running simpletest.Hello 
Hello Alvin Alexander
[success] Total time: 4 s
````

Now let’s create a ScalaTest file.



## Your first ScalaTest tests

ScalaTest is very flexible, and there are a lot of different ways to write tests, but a simple way to get started is to write tests using the ScalaTest “FunSuite.” To get started, create a directory named *simpletest* under the *src/test/scala* directory, like this:

```sh
$ mkdir src/test/scala/simpletest
```

Next, create a file named *HelloTests.scala* in that directory with the following contents:

```scala
package simpletest

import org.scalatest.FunSuite

class HelloTests extends FunSuite {

    // test 1
    test("the name is set correctly in constructor") {
        val p = new Person("Barney Rubble")
        assert(p.name == "Barney Rubble")
    }

    // test 2
    test("a Person's name can be changed") {
        val p = new Person("Chad Johnson")
        p.name = "Ochocinco"
        assert(p.name == "Ochocinco")
    }

}
```

This file demonstrates the ScalaTest `FunSuite` approach. A few important points:

- Your class should extend `FunSuite`
- You create tests as shown, by giving each `test` a unique name
- At the end of each test you should call `assert` to test that a condition has been satisfied

Using ScalaTest like this is similar to JUnit, so if you’re coming to Scala from Java, hopefully this looks very familiar.

Now you can run these tests with the `sbt test` command. Skipping the first few lines of output, the result looks like this:

````
> sbt test
[info] Set current project to HelloScalaTest (in build file:/Users/al/Projects/Scala/HelloScalaTest/)
[info] HelloTests:
[info] - the name is set correctly in constructor
[info] - a Person's name can be changed
[info] Run completed in 277 milliseconds.
[info] Total number of tests run: 2
[info] Suites: completed 1, aborted 0
[info] Tests: succeeded 2, failed 0, canceled 0, ignored 0, pending 0
[info] All tests passed.
[success] Total time: 1 s
````



## TDD tests

This example demonstrates a *Test-Driven Development* (TDD) style of testing with ScalaTest. In the next lesson you’ll see how to write *Behavior-Driven Development* (BDD) tests with ScalaTest and sbt.

>Keep the project you just created. You’ll use it again in the next lesson.








