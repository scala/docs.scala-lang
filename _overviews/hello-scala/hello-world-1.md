---
layout: multipage-overview
title: Hello, World
description: This page shares a Scala 'Hello, world' example.
partof: hello_scala
overview-name: Hello, Scala
num: 5
---

Since the release of the book, *C Programming Language*, most programming books have begun with a simple “Hello, world” example, and in keeping with tradition, here’s the source code for a Scala “Hello, world” example:

```scala
object Hello {
    def main(args: Array[String]) {
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
    def main(args: Array[String]) {
        println("Hello, world")
    }
}
```

Here’s a short description of that code:

- It defines a method named `main` inside a Scala `object` named `Hello`
- An `object` is similar to a `class`, but you specifically use it when you want a singleton object
    - If you’re coming to Scala from Java, this means that `main` is just like a `static` method (I write more on this later)
- `main` takes an input parameter named `args` that is a string array
- `Array` is a class that wraps the Java `array` primitive

That Scala code is pretty much the same as this Java code:

```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world")
    }
}
```


## Going deeper: Scala creates *.class* files

As I mentioned, when you run the `scalac` command it creates *.class* JVM bytecode files. You can see this for yourself. As an example, run this `javap` command on the *Hello.class* file:

````
$ javap Hello.class
Compiled from "Hello.scala"
public final class Hello {
  public static void main(java.lang.String[]);
}
````

As that output shows, the `javap` command reads that *.class* file just as if it was created from Java source code. Scala code runs on the JVM, and can use existing Java libraries, and both are terrific benefits for Scala programmers.


### Peaking behind the curtain

To be more precise, what happens is that Scala source code is initially compiled to Java source code, and then that source code is turned into bytecode that works with the JVM. I explain some details of this process in the *Scala Cookbook*.

If you’re interested in more details on this process right now, see the “Using scalac print options” section of my [How to disassemble and decompile Scala code](https://alvinalexander.com/scala/how-to-disassemble-decompile-scala-source-code-javap-scalac-jad) tutorial.



<!-- This is what the output looks like when you run `javap` on the `Hello$.class` file:

````
$ javap Hello\$.class
Compiled from "Hello.scala"
public final class Hello$ {
  public static Hello$ MODULE$;
  public static {};
  public void main(java.lang.String[]);
}
```` -->










