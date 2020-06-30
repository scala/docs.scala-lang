---
layout: multipage-overview
title: Using the Scaladoc Interface
partof: scaladoc
overview-name: Scaladoc

num: 2

permalink: /overviews/scaladoc/:title.html
---

Many Scala developers, including those with a great deal of experience, are
unaware of some of the more powerful features of Scaladoc.

## Scaladoc Features in Brief

- The latest Scaladoc for the core Scala libraries can always be found at
  [https://www.scala-lang.org/api/current](https://www.scala-lang.org/api/current).
- Methods and values may have information folded away that can be accessed by
  activating that items box. This box is indicated by a blue stripe on the left.
- In the title bar, at the very top, is a breadcrumb list of the parent packages
  and each package is a link to the package object documentation which sometimes
  holds an overview of the package or API as a whole.
- By expanding linear supertypes section, you can see the linearized trait
  definitions for the current class, trait or object.
- Known subclasses lists all subclasses for this entity within the current
  Scaladoc.
- Type hierarchy shows a graphical view of this class related to its super
  classes and traits, immediate sub-types, and important related entities. The
  graphics themselves are links to the various entities.
- The link in the Source section takes you to the online source for the class
  assuming it is available (and it certainly is for the core libraries and for
  many other libraries).
