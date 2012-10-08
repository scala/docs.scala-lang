---
layout: overview-large
title: Symbols, Trees, and Types

partof: reflection
num: 3
---

### How to get an internal representation of a type?

The `toString` method on types is designed to print a close-to-Scala representation
of the code that a given type represents. This is usually convenient, but sometimes
one would like to look under the covers and see what exactly are the elements that
constitute a certain type.

Scala reflection provides a way to dig deeper through [[scala.reflect.api.Printers]]
and their `showRaw` method. Refer to the page linked above for a series of detailed
examples.

	scala> import scala.reflect.runtime.universe._
	import scala.reflect.runtime.universe._

	scala> def tpe = typeOf[{ def x: Int; val y: List[Int] }]
	tpe: reflect.runtime.universe.Type

	scala> show(tpe)
	res0: String = scala.AnyRef{def x: Int; val y: scala.List[Int]}

	scala> showRaw(tpe)
	res1: String = RefinedType(
	  List(TypeRef(ThisType(scala), newTypeName("AnyRef"), List())),
	  Scope(
	    newTermName("x"),
	    newTermName("y")))
