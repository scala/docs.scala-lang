---
layout: sip
number: 13
permalink: /sips/:number.html
redirect_from:
  - /sips/:number
  - /sips/:title.html
  - /sips/pending/implicit-classes.html
stage: completed
status: shipped
title: Implicit classes
---

**By: Josh Suereth**

This SIP is based on [this pre-draft](https://docs.google.com/document/d/1k-aGAGmbrDB-2pJ3uDPpHVKno6p-XbnkVHDc07zPrzQ/edit?hl=en_US).

Material adapted from [https://jorgeortiz85.github.io/ImplicitClassSIP.xhtml](https://jorgeortiz85.github.io/ImplicitClassSIP.xhtml)  which is Copyright © 2009, Jorge Ortiz and David Hall

## Abstract ##

A new language construct is proposed to simplify the creation of
classes which provide _extension methods_ to another type.

## Description ##

The `implicit` keyword will now be allowed as an annotation on
classes.  Classes annotated with the `implicit` keyword are referred to
as _implicit classes_.

An implicit class must have a primary constructor with *exactly* one
argument in its first parameter list. It may also include an
additional implicit parameter list. An implicit class must be defined
in a scope where method definitions are allowed (not at the top
level).  An implicit class is desugared into a class and implicit
method pairing, where the implicit method mimics the constructor of
the class.

The generated implicit method will have the same name as the implicit
class.  This allows importing the implicit conversion using the name
of the class, as one expects from other implicit definitions.  For
example, a definition of the form:

    implicit class RichInt(n: Int) extends Ordered[Int] {
      def min(m: Int): Int = if (n <= m) n else m
      ...
    }

will be transformed by the compiler as follows:

    class RichInt(n: Int) extends Ordered[Int] {
      def min(m: Int): Int = if (n <= m) n else m
      ...
    }
    implicit final def RichInt(n: Int): RichInt = new RichInt(n)

Annotations on `implicit` classes default to attaching to the
generated class *and* the method.  For example,

    @bar
    implicit class Foo(n: Int)

will desugar into:

    @bar implicit def Foo(n: Int): Foo = new Foo(n)
    @bar class Foo(n:Int)

The `annotation.target` annotations will be expanded to include a
`genClass` and `method` annotation.  This can be used to target
annotations at just the generated class or the generated method of an
implicit class.  For example:

    @(bar @genClass) implicit class Foo(n: Int)

will desugar into

    implicit def Foo(n: Int): Foo = new Foo(n)
    @bar class Foo(n: Int)

## Specification ##

No changes are required to Scala's syntax specification, as the
relevant production rules already allow for implicit classes.

    LocalModifier ::= ‘implicit’
    BlockStat     ::= {LocalModifier} TmplDef
    TmplDef       ::= [‘case’] ‘class’ ClassDef

The language specification (SLS 7.1) would be modified to allow the
use of the implicit modifier for classes. A new section on Implicit
Classes would describe the behavior of the construct.

## Consequences ##

The new syntax should not break existing code, and so remain source
compatible with existing techniques.
