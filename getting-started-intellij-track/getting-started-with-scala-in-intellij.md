---
title: Getting Started with Scala in IntelliJ
layout: inner-page-no-masthead
disqus: true
next-page: building-a-scala-project-with-intellij-and-sbt
---

In this tutorial, we'll see how to build a minimal Scala project
using IntelliJ IDE with the Scala plugin. We'll have IntelliJ download
Scala for you.

## Installation
1. Make sure you have the Java 8 JDK (also known as 1.8)
    * Run `javac -version` in the command line and make sure you see
    `javac 1.8.___`
    * If you don't have version 1.8 or higher, [install the JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
1. Install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Install the Scala plugin by following the instructions on
[how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/installing-updating-and-uninstalling-repository-plugins.html)

When we create the project, we'll install the latest version of Scala.
Note: If you want to open an existing Scala project, you can click **Open**
when you start IntelliJ.

## Creating the Project
1. Open up IntelliJ and click **File** => **New** => **Project**
1. On the left panel, select Scala. On the right panel, select Scala once again.
1. Name the project **HelloWorld**
1. Assuming this is your first time creating a Scala project with IntelliJ,
you'll need to install a Scala SDK. To the right of the Scala SDK field,
click the **Create** button.
1. Select the highest version number (e.g. 2.12.1) and click **Download**. This might
take a few minutes but subsequent projects can use the same SDK.
1. Once the SDK is created and you're back to the "New Project" window click **Finish**.


## Writing code

1. On the **Project** pane on the left, right-click `src` and select
**New** => **Scala class**.
1. Name the class `Hello` and change the **Kind** to `object`.
1. Change the code in the class to the following:

```
object Hello extends App {
  println("Hello, World!")
}
```

## Running it
* Right click on `Hello` in your code and select **Run 'Hello'**.
* You're done!

## Experimenting with Scala
A good way to try out code samples is with Scala Worksheets

1. In the project pane on the left, right click
`src` and select **New** => **Scala Worksheet**.
1. Enter the following code into the worksheet:


```

def square(x: Int) = x * x

square(2)
```

As you change your code, you'll notice that it gets evaluated
in the right pane.

## Next Steps
Now you know how to create a simple Scala project which can be used
for starting to learn the language. In the next tutorial, we'll introduce
an important build tool called sbt which can be used for simple projects
and production apps.

Up Next: [Building a Scala Project with IntelliJ and sbt](building-a-scala-project-with-intellij-and-sbt.html)
