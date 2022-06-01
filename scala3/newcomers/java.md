---
layout: singlepage-overview
title: Scala for Java Programmers
---
There's a saying that Scala is Java without semicolons.

There is a truth to this statement. Scala builds upon the foundations of Java, and can use any Java library out of the box; once the project is configured, most Java programs will still work in Scala by only converting the syntax.

Scala stands for Scalable Language – and a scalable language is supposed to scale not only with hardware resources and load requirements, but also with the level of programmer's skill. True to the spirit of a scalable language, if you choose, Scala can be much deeper than Java without semicolons. It provides you with a wide array of expressive features that, when mastered, can  tremendously increase your ability as a developer, giving access to techniques that are different from those used in Java. Learning these extras are optional steps to approach at your own pace. The most fun and effective way to learn, in our opinion, is to ensure you are productive first with what knowledge you have from Java. And then, learn one thing at a time following the [Scala Book](https://docs.scala-lang.org/scala3/book/introduction.html). Pick the learning pace convenient for you and ensure whatever you are learning is fun.

TL;DR: start writing Scala as Java without semicolons, explore from there as you see fit.

## How to Get Started
### The Basics
First, you need somewhere to practice your code-writing. We recommend the following resources to get your playground going:

- [Scastie](https://scastie.scala-lang.org/) the online Scala playground. Start writing Scala in a single click.
- [Install Scala](https://www.scala-lang.org/download/) on your machine. May need some work, but this is a comprehensive solution with which you can write serious projects.

Next, you need to know what to write. The [Official Scala 3 Overview for Java Developers](https://docs.scala-lang.org/scala3/book/scala-for-java-devs.html) is a good place to start getting familiar with Scala. The document outlines how Scala differs from Java. If you feel comfortable with it, it may be a good idea to try out the snippets from the document in your playground.

### Getting Productive
After going through the basics, you should get a good feel of how to write Scala as Java without semicolons. Next step is, how do you actually do stuff with Scala. You can't do stuff without libraries. As a Java programmer, you already know a lot of libraries that do the job in Java, so let's start with those.

In Java, you can fetch dependencies into your project via Maven. While it is possible to [set up a Maven project with Scala](https://docs.scala-lang.org/tutorials/scala-with-maven.html), it is not a widely used way in the Scala ecosystem. The build tool of choice in Scala is [sbt](https://www.scala-sbt.org/). We recommend you to spend some time to familiarise yourself with sbt documentation, but for the impatient ones, there is always a template project option. An sbt template is an sbt project that you can fetch from the Internet with a single command so that you have something to get started with. We recommend the following template for Scala 3: [https://github.com/scala/scala3.g8](https://github.com/scala/scala3.g8). After installing sbt on your machine, you should be able to follow the readme of that template to get started.

An SBT project is specified in the build.scala file in the root of the cloned template, and the library dependencies are specified via the libraryDependencies value in that file (also present in the example template). To learn the ropes around how to declare dependencies, see the [documentation of sbt](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html#The++key).

Caveat: you may notice that the Scala dependencies have their group name and artifact name separated with `%%`. For Java dependencies, use `%`, a single percent sign. Why? Technical detail: Scala artifact names are suffixed with Scala's binary version, e.g. munit_3 instead of munit, and the role of the `%%` is to help sbt to fill in the right suffix automatically . Since Java artifacts don't have such a naming convention, use `%`. For more information, see the [sbt documentation](https://www.scala-sbt.org/1.x/docs/Library-Dependencies.html#Getting+the+right+Scala+version+with).

That's it! Now you can use your Java libraries from Scala! You can continue your Scala journey by reading the [Scala Book](https://docs.scala-lang.org/scala3/book/introduction.html) or following a number of [online MOOCs](https://docs.scala-lang.org/online-courses.html).
