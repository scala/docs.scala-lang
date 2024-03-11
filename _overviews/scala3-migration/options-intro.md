---
title: Compiler Options
type: chapter
description: This chapter shows the difference between Scala 2.13 and Scala 3 compiler options
num: 23
previous-page: incompat-type-inference
next-page: options-lookup
---

The Scala 3 compiler has been rewritten from the ground up and consequently it does not offer the same options as the Scala 2.13 compiler.
Some options are available under a different name, others have just not been implemented yet.

When porting a Scala 2.13 project to Scala 3, you will need to adapt the list of compiler options.
To do so you can refer to the [Lookup Table](options-lookup.html).

> Passing an unavailable option to the Scala 3 compiler does not make it fail.
> It just prints a warning and ignores the option.

You can also discover the new Scala 3 compiler options, which have no equivalent in Scala 2.13, in the [New Compiler Options](options-new.html) page.

For Scaladoc settings reference and their compatibility with Scala2 Scaladoc, read [Scaladoc settings compatibility between Scala2 and Scala3](scaladoc-settings-compatibility.html) page.
