---
layout: overview-large
title: Using the Scaladoc Interface

disqus: true

partof: scaladoc
num: 3
outof: 3
languages: [ko]
---

Many Scala developers, including those with a great deal of experience, are
unaware of some of the more powerful features of Scaladoc.

The quickest way to find out about some of these is to check out this
tutorial video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/GQxUEAXX_fE" frameborder="0" allowfullscreen></iframe>

However, if you are in a hurry and just want a few pointers to things you
may not have known about already, here are a few key points.

## Scaladoc Features in Brief

- The latest Scaladoc for the core Scala libraries can always be found at
  [http://www.scala-lang.org/api/current](http://www.scala-lang.org/api/current).
- The search box on the top left narrows the list of classes to those that
  match a string search to your typing, use this to home in quickly on the class,
  trait or object you are trying to find.
- The letters underneath the search box list all fields, methods and other
  tokens found during the creation of the Scaladoc. E.g. if you want to find
  where the `.reverse` method you are using is defined, click on **R** in the
  list of letters there, and then find in page to locate the `.reverse` method and
  the list of implementing classes/traits.
- The small icons on the left of the list of classes denote object `O`, class `C`
  and/or trait `T`. Two icons show that this class or trait has a companion as
  well. Clicking on the `O` takes you directly to the companion object instead
  of the class or trait.
- The same (but larger) icons at the top of the right pane in the title indicate
  the same information (i.e. you are looking at the class, trait or object). If
  the icon has a "peel over" corner on it, clicking will flip you between the
  class/trait and its companion.
- Methods and values may have information folded away that can be accessed by
  clicking on the triangle to the left of the definition.
- In the title bar, at the very top, is a breadcrumb list of the parent packages
  and each package is a link to the package object documentation which sometimes
  holds an overview of the package or API as a whole.
- You can use the Hide and Focus links next to the packages to ignore a package
  you no longer want to see in searches, or to concentrate only on that package
  for searches.
- By expanding linear supertypes triangle, you can see the linearized trait
  definitions for the current class, trait or object.
- Known subclasses lists all subclasses for this entity within the current
  Scaladoc.
- Type hierarchy shows a graphical view of this class related to its super
  classes and traits, immediate sub-types, and important related entities. The
  graphics themselves are links to the various entities.
- The link in the Source section takes you to the online source for the class
  assuming it is available (and it certainly is for the core libraries and for
  many other libraries).
