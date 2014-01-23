---
layout: tutorial
title: Regular Expression Patterns

disqus: true

tutorial: scala-tour
num: 22
---

## Right-ignoring sequence patterns ##

Right-ignoring patterns are a useful feature to decompose any data which is either a subtype of `Seq[A]` or a case class with an iterated formal parameter, like for instance

    Elem(prefix:String, label:String, attrs:MetaData, scp:NamespaceBinding, children:Node*)

In those cases, Scala allows patterns having a wildcard-star `_*` in the rightmost position to stand for arbitrary long sequences.
The following example demostrate a pattern match which matches a prefix of a sequence and binds the rest to the variable `rest`.

    object RegExpTest1 extends App {
      def containsScala(x: String): Boolean = {
        val z: Seq[Char] = x
        z match {
          case Seq('s','c','a','l','a', rest @ _*) =>
            println("rest is "+rest)
            true
          case Seq(_*) =>
            false
        }
      }
    }

In contrast to previous Scala versions, it is no longer allowed to have arbitrary regular expressions, for the reasons described below.

###General `RegExp` patterns temporarily retracted from Scala###

Since we discovered a problem in correctness, this feature is temporarily retracted from the Scala language. If there is request from the user community, we might reactivate it in an improved form.

According to our opinion regular expressions patterns were not so useful for XML processing as we estimated. In real life XML processing applications, XPath seems a far better option. When we discovered that our translation or regular expressions patterns has some bugs for esoteric patterns which are unusual yet hard to exclude, we chose it would be time to simplify the language.
