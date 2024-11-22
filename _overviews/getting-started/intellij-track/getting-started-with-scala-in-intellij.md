---
title: Getting Started with Scala in IntelliJ
layout: singlepage-overview
partof: getting-started-with-scala-in-intellij
languages: [ja, ru, uk]
disqus: true
next-page: building-a-scala-project-with-intellij-and-sbt

redirect_from: "/getting-started-intellij-track/getting-started-with-scala-in-intellij.html"
---

In this tutorial, we'll see how to build a minimal Scala project using IntelliJ
IDE with the Scala plugin. In this guide, IntelliJ will download Scala for you.

## Installation
1. Make sure you have the Java 8 JDK (also known as 1.8) or newer:
    * run `javac -version` on the command line to check the Java version,
    * if you don't have version 1.8 or higher, [install the JDK](https://www.oracle.com/java/technologies/downloads/).
1. Next, download and install [IntelliJ Community Edition](https://www.jetbrains.com/idea/download/).
1. Then, after starting up IntelliJ, you can download and install the Scala plugin by following the instructions on
[how to install IntelliJ plugins](https://www.jetbrains.com/help/idea/managing-plugins.html) (search for "Scala" in the plugins menu.)

When we create the project, we'll install the latest version of Scala.
Note: If you want to open an existing Scala project, you can click **Open**
when you start IntelliJ.

## Creating the Project
1. Open up IntelliJ and click **File** => **New** => **Project**.
1. Name the project **HelloWorld**.
1. Select **Scala** from the **Language** list. 
1. Select **IntelliJ** from the **Build system** list.
1. Assuming this is your first time creating a Scala project with IntelliJ,
you'll need to install a Scala SDK. To the right of the Scala SDK field,
click the **Create** button.
1. Select the highest version number (e.g. {{ site.scala-version }}) and click **Download**. This might
take a few minutes but subsequent projects can use the same SDK.
1. Once the SDK is created, and you're back to the "New Project" window, click **Create**.


## Writing code

1. On the **Project** pane on the left, right-click `src` and select
**New** => **Scala class**. If you don't see **Scala class**, right-click on **HelloWorld** and click on **Add Framework Support...**, select **Scala** and proceed. If you see **Error: library is not specified**, you can either click download button, or select the library path manually. If you only see **Scala Worksheet** try expanding the `src` folder and its `main` subfolder, and right-click on the `scala` folder.
1. Name the class `Hello` and change the **Kind** to `object`.
1. Change the code in the file to the following:

{% tabs hello-world-entry-point class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-entry-point %}

```
object Hello extends App {
  println("Hello, World!")
}
```

{% endtab %}

{% tab 'Scala 3' for=hello-world-entry-point %}

```
@main def hello(): Unit =
  println("Hello, World!")
```

In Scala 3, you can remove the object `Hello` and define a top-level method
`hello` instead, which you annotate with `@main`.

{% endtab %}

{% endtabs %}

## Running it

{% tabs hello-world-run class=tabs-scala-version %}

{% tab  'Scala 2' for=hello-world-run %}

* Right click on `Hello` in your code and select **Run 'Hello'**.
* You're done!

{% endtab %}

{% tab 'Scala 3' for=hello-world-run %}

* Right click on `hello` in your code and select **Run 'hello'**.
* You're done!

{% endtab %}

{% endtabs %}

## Experimenting with Scala
A good way to try out code samples is with Scala Worksheets

1. In the project pane on the left, right click
`src` and select **New** => **Scala Worksheet**.
2. Name your new Scala worksheet "Mathematician".
3. Enter the following code into the worksheet:

{% tabs square %}
{% tab 'Scala 2 and 3' for=square %}
```
def square(x: Int): Int = x * x

square(2)
```
{% endtab %}
{% endtabs %}

As you change your code, you'll notice that it gets evaluated
in the right pane. If you do not see a right pane, right-click on your Scala worksheet in the Project pane, and click on Evaluate Worksheet.

## Next Steps

Now you know how to create a simple Scala project which can be used
for starting to learn the language. In the next tutorial, we'll introduce
an important build tool called sbt which can be used for simple projects
and production apps.

Up Next: [Building a Scala Project with IntelliJ and sbt](building-a-scala-project-with-intellij-and-sbt.html)
