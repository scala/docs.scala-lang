---
title: Create a Project with 'sbt new'
description: This page shows how to create and run a “Hello, world” project using Scala 3 and the 'sbt new' command
---

Now that you’ve seen how to create an sbt project manually, a quicker way to create a new project is with the `sbt new` command and a template.



## Using ‘sbt new’

The `sbt new` command creates a new directory for you, so first `cd` to a directory where you usually create new projects. Then run this command:

```sh
$ sbt new lampepfl/dotty.g8
```

That command can take a few moments to run, because it’s using a template on Github to create your project. When it prompts you for a name, use the name `HelloWorld`. This creates the following directories:

```sh
helloworld
project
target
```

Notice that sbt currently changes the name of your project to lowercase. You can also delete the *project* and *target* directories, which were only created so sbt could run.



## The project layout

Next, `cd` into the *helloworld* directory. If you have the `tree` command installed on your system, you can use it to see the files and directories that `sbt new` creates:

```
$ tree .
.
├── README.md
├── build.sbt
├── project
│   ├── build.properties
│   └── plugins.sbt
└── src
    ├── main
    │   └── scala
    │       └── Main.scala
    └── test
        └── scala
            └── Test1.scala
```

As shown, one source code file named *Main.scala* is included, as is a test file named *Test1.scala*. We’ll come back to these in just a moment.



## The build file

When you look at the *build.sbt* file, you’ll see that it has these contents:

```scala
val dottyVersion = "3.0.0-M2"

lazy val root = project
  .in(file("."))
  .settings(
    name := "dotty-simple",
    version := "0.1.0",

    scalaVersion := dottyVersion,

    libraryDependencies += "com.novocode" % "junit-interface" % "0.11" % "test"
  )
```

This is a little more complicated than our first example, but it shows that you can use Scala code in sbt’s build file. When your builds get more complicated, this gives you a lot of power to control the build process.

The `sbt new` process currently doesn’t update the `name` in this file, so change that to `HelloWorld` or `helloworld`, if you prefer.

Notice in the last line of the file that a “junit-interface” is added to the project as a library dependency. This means that when you run a test with sbt, it will download that dependency and then run your test(s). A test class is included with this template, so you’ll see that next.



## The source code files

This is the content in the *src/main/scala/Main.scala* file:

```scala
object Main {

  def main(args: Array[String]): Unit = {
    println("Hello world!")
    println(msg)
  }

  def msg = "I was compiled by dotty :)"

}
```

This is a Scala `object` with a `main` method. When you use the `sbt run` command, it runs this `main` method. The class also includes a `msg` method, which is used in the following test class.

This is the content in the *src/test/scala/Test1.scala* file:

```scala
import org.junit.Test
import org.junit.Assert._

class Test1 {
  @Test def t1(): Unit = {
    assertEquals("I was compiled by dotty :)", Main.msg)
  }
}
```

This code shows how to use jUnit in Scala. Assuming that you’ve used unit tests before, you can see that there is some usual boilerplate code, and then a test method named `t1`. It runs an `assertEquals` method which compares the `String` in its first parameter to the `String` returned by the `msg` method in the `main` object.



## Running and testing the code

To run the `main` method, use this `sbt` command from the root directory of the project:

```sh
$ sbt run
```

That runs for a few seconds, downloads what it needs, then compiles and runs your code. Eventually you see this output:

```sh
[info] running Main 
Hello world!
I was compiled by dotty :)
```

>sbt may be a little slow the first time you run it, because it needs to download any dependencies it doesn’t have. But after that first run, it runs much faster. It’s also faster to open the sbt shell and run commands from inside of it, as described in the [“Scala Tools” chapter](scala-tools.md).

Next, to run the `t1` test, use this command:

```sh
$ sbt test
```

After a few moments you’ll see that the test ran successfully:

```sh
[info] Passed: Total 1, Failed 0, Errors 0, Passed 1
```


<!--
## More sbt information

While these commands show how to *manually* create an sbt project, you can use other commands to automate this initial setup process. Those commands are demonstrated in the [Scala Tools chapter](scala-tools.md).
-->






