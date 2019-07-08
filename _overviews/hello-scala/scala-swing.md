---
layout: multipage-overview
title: Scala and Swing
description: In this lesson I show how Scala works with Java Swing classes, like JFrame, JTextArea, etc.
partof: hello_scala
overview-name: Hello, Scala
num: 39
---



Scala works with Java Swing classes like `JFrame`, `JTextArea`, etc., very easily. Here’s an example of a Scala application that opens a `JFrame`, adds a few components to it, and then displays it:

```scala
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JFrame
import javax.swing.JScrollPane
import javax.swing.JTextArea

object SwingExample extends App {

    val textArea = new JTextArea
    textArea.setText("Hello, Swing world")
    val scrollPane = new JScrollPane(textArea)

    val frame = new JFrame("Hello, Swing")
    frame.getContentPane.add(scrollPane, BorderLayout.CENTER)
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE)
    frame.setSize(new Dimension(600, 400))
    frame.setLocationRelativeTo(null)
    frame.setVisible(true)

}
```

To see how that code works, save it to a file named *SwingExample.scala*, then compile it:

````
$ scalac SwingExample.scala
````

and then run it:

````
$ scala SwingExample
````

I’ve written a few Swing applications with Scala totaling thousands of lines of code, and I haven’t had any problems with it.

>Please note that there’s also a Scala project known as [Scala Swing](TODO:URL), which is something different. That project is an effort to make Swing GUI code look more like it would have looked if someone knew Scala and then wrote a GUI framework on top of it.



## Experiment with the code yourself

To experiment with this on your own, please see the *SwingExample* project in this book’s GitHub repository, which you can find at this URL:

- [github.com/alvinj/HelloScalaExamples](https://github.com/alvinj/HelloScalaExamples)

If you know how to use the [Scala Build Tool](http://www.scala-sbt.org/) you can use it, otherwise you can compile and run the source code file that’s in the project’s root directory using `scalac` and `scala`, as shown above.

For information on getting started with SBT, see my tutorial, [How to compile, run, and package a Scala project with SBT](https://alvinalexander.com/scala/sbt-how-to-compile-run-package-scala-project).







