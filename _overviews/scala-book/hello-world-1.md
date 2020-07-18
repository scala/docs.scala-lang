---
type: section
layout: multipage-overview
title: Hello, World
description: This page shares a Scala 'Hello, world' example.
partof: scala_book
overview-name: Scala Book
discourse: true
num: 5
outof: 54
previous-page: scala-features
next-page: hello-world-2
---

Since the release of the book, *C Programming Language*, most programming books have begun with a simple “Hello, world” example, and in keeping with tradition, here’s the source code for a Scala “Hello, world” example:

```scala
object Hello {
    def main(args: Array[String]) = {
        println("Hello, world")
    }
}
```

Using a text editor, save that source code in a file named *Hello.scala*. After saving it, run this `scalac` command at your command line prompt to compile it:

```sh
$ scalac Hello.scala
```

`scalac` is just like `javac`, and that command creates two new files:

- Hello$.class
- Hello.class

These are the same types of “.class” bytecode files you create with `javac`, and they’re ready to work with the JVM.

Now you can run the `Hello` application with the `scala` command:

```sh
$ scala Hello
```



## Discussion

Here’s the original source code again:

```scala
object Hello {
    def main(args: Array[String]) = {
        println("Hello, world")
    }
}
```

Here’s a short description of that code:

- It defines a method named `main` inside a Scala `object` named `Hello`
- An `object` is similar to a `class`, but you specifically use it when you want a single instance of that class
    - If you’re coming to Scala from Java, this means that `main` is just like a `static` method (We write more on this later)
- `main` takes an input parameter named `args` that is a string array
- `Array` is a class that wraps the Java `array` primitive

That Scala code is pretty much the same as this Java code:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world");
    }
}
```


## Going deeper: Scala creates *.class* files

As we mentioned, when you run the `scalac` command it creates *.class* JVM bytecode files. You can see this for yourself. As an example, run this `javap` command on the *Hello.class* file:

````
$ javap Hello.class
Compiled from "Hello.scala"
public final class Hello {
  public static void main(java.lang.String[]);
}
````

As that output shows, the `javap` command reads that *.class* file just as if it was created from Java source code. Scala code runs on the JVM and can use existing Java libraries — and both are terrific benefits for Scala programmers.




