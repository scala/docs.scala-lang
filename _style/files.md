---
layout: style-guide
title: Files

partof: style
overview-name: "Style Guide"

num: 9

previous-page: method-invocation
next-page: scaladoc
---

The unit of work for the compiler is a "compilation unit",
which is usually just an ordinary file.
The Scala language places few restrictions on how code is organized across files.
The definition of a class, or equivalently a trait or object, can't be split over multiple files,
so it must be contained within a single file.
A class and its companion object must be defined together in the same file.
A sealed class can be extended only in the same file, so all its subclasses must be defined there.

Similarly, there are no restrictions on the name of a source file or where it is located in the file system,
although certain conventions are broadly honored in practice.
Generally, the file is named after the class it contains,
or if it has more than one class, the parent class.

For example, a file, `Inbox.scala`, is expected to contain `Inbox` and its companion:

    package org.coolness

    class Inbox { ... }

    // companion object
    object Inbox { ... }

The file may be located in a directory, `org/coolness`, following Java tooling conventions,
but this is at the discretion of the developer and for their convenience.

It is natural to put the following `Option` ADT in a file, `Option.scala`:

    sealed trait Option[+A]

    case class Some[A](a: A) extends Option[A]

    case object None extends Option[Nothing]

The related elements, `Some` and `None`, are easily discoverable, even in the absence of tooling.

When unrelated classes are grouped together, perhaps because they implement a feature or a model a domain,
the source file receives a descriptive `camelCase` name.
Some prefer this naming scheme for top-level terms. For example, `object project` would be found in `project.scala`.
Similarly, a package object defined as `package object model` is located in `package.scala` in the `model` source directory.

Files created just for quick testing can have arbitrary names, such as `demo-bug.scala`.
