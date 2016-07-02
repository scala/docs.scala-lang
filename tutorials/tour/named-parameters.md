---
layout: tutorial
title: Named Parameters

disqus: true

tutorial: scala-tour
num: 33
tutorial-previous: default-parameter-values
---

When calling methods and functions, you can use the name of the variables explicitly in the call, like so:

      def printName(first:String, last:String) = {
        println(first + " " + last)
      }

      printName("John","Smith")
      // Prints "John Smith"
      printName(first = "John",last = "Smith")
      // Prints "John Smith"
      printName(last = "Smith",first = "John")
      // Prints "John Smith"

Note that once you are using parameter names in your calls, the order doesn't matter, so long as all parameters are named.  This
feature works well with [default parameter values]({{ site.baseurl }}/tutorials/tour/default-parameter-values.html):

      def printName(first:String = "John", last:String = "Smith") = {
        println(first + " " + last)
      }

      printName(last = "Jones")
      // Prints "John Jones"

Since you can place the parameters in any order you like, you can use the default value for parameters that come first in the
parameter list.
