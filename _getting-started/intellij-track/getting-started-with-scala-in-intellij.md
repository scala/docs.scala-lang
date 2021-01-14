---
title: Getting Started with Scala in IntelliJ
layout: singlepage-overview
partof: getting-started-with-scala-in-intellij
languages: [ja]
disqus: true
next-page: building-a-scala-project-with-intellij-and-sbt

redirect_from: "/getting-started-intellij-track/getting-started-with-scala-in-intellij.html"
---

In this tutorial, we'll see how to build a minimal Scala project using IntelliJ
IDE with the Scala plugin. In this guide, IntelliJ will download Scala for you.

## Installation
1. Make sure you have the Java 8 JDK (also known as 1.8)
    * Run `javac -version` on the command line and make sure you see
    `javac 1.8.___`
    * If you don't have version 1.8 or higher, [install the JDK](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
1. Next, download and install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/)
1. Then, after starting up IntelliJ, you can download and install the Scala plugin by following the instructions on
[how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/installing-updating-and-uninstalling-repository-plugins.html) (search for "Scala" in the plugins menu.)

When we create the project, we'll install the latest version of Scala.
Note: If you want to open an existing Scala project, you can click **Open**
when you start IntelliJ.

## Creating the Project
1. Open up IntelliJ and click **File** => **New** => **Project**
1. On the left panel, select Scala. On the right panel, select IDEA.
1. Name the project **HelloWorld**
1. Assuming this is your first time creating a Scala project with IntelliJ,
you'll need to install a Scala SDK. To the right of the Scala SDK field,
click the **Create** button.
1. Select the highest version number (e.g. {{ site.scala-version }}) and click **Download**. This might
take a few minutes but subsequent projects can use the same SDK.
1. Once the SDK is created and you're back to the "New Project" window click **Finish**.


## Writing code

1. On the **Project** pane on the left, right-click `src` and select
**New** => **Scala class**. If you don't see **Scala class**, right-click on **HelloWorld** and click on **Add Framework Support...**, select **Scala** and proceed. If you see **Error: library is not specified**, you can either click download button, or select the library path manually. If you only see **Scala Worksheet** try expanding the `src` folder and its `main` subfolder, and right-click on the `scala` folder.
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
2. Name your new Scala worksheet "Mathematician".
3. Enter the following code into the worksheet:

```
def square(x: Int) = x * x

square(2)
```

As you change your code, you'll notice that it gets evaluated
in the right pane. If you do not see a right pane, right click on your Scala worksheet in the Project pane, and click on Evaluate Worksheet.

## Next Steps

Now you know how to create a simple Scala project which can be used
for starting to learn the language. In the next tutorial, we'll introduce
an important build tool called sbt which can be used for simple projects
and production apps.

Up Next: [Building a Scala Project with IntelliJ and sbt](building-a-scala-project-with-intellij-and-sbt.html)
