---
layout: overview-large
title: Type Providers

disqus: true

partof: macros
num: 8
outof: 13
languages: [ko, ja]
---
<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

Type providers aren't implemented as a dedicated macro flavor, but are rather built on top of the functionality
that Scala macros already provide.

There are two strategies of emulating type providers: one based on structural types (referred to as "anonymous type providers")
and one based on macro annotations (referred to as "public type providers"). The former builds on functionality available
in 2.10.x, 2.11.x and 2.12.x, while the latter requires macro paradise. Both strategies can be used to implement erased type providers
as described below.

Note that macro paradise is needed both to compile and to expand macro annotations,
which means that both authors and users of public type providers will have to add macro paradise to their builds.
However, after macro annotations expand, the resulting code will no longer have any references to macro paradise
and won't require its presence at compile-time or at runtime.

Recently we've given a talk about macro-based type providers in Scala, summarizing the state of the art and providing
concrete examples. Slides and accompanying code can be found at [https://github.com/travisbrown/type-provider-examples](https://github.com/travisbrown/type-provider-examples).

## Introduction

Type providers are a strongly-typed type-bridging mechanism, which enables information-rich programming in F# 3.0.
A type provider is a compile-time facility, which is capable of generating definitions and their implementations
based on static parameters describing datasources. Type providers can operate in two modes: non-erased and erased.
The former is similar to textual code generation in the sense that every generated type becomes bytecode, while
in the latter case generated types only manifest themselves during type checking, but before bytecode generation
get erased to programmer-provided upper bounds.

In Scala, macro expansions can generate whatever code the programmer likes, including `ClassDef`, `ModuleDef`, `DefDef`,
and other definition nodes, so the code generation part of type providers is covered. Keeping that in mind, in order
to emulate type providers we need to solve two more challenges:

1. Make generated definitions publicly visible (def macros, the only available macro flavor in Scala 2.10, 2.11 and 2.12,
are local in the sense that the scope of their expansions is limited: [https://groups.google.com/d/msg/scala-user/97ARwwoaq2U/kIGWeiqSGzcJ](https://groups.google.com/d/msg/scala-user/97ARwwoaq2U/kIGWeiqSGzcJ)).
1. Make generated definitions optionally erasable (Scala supports erasure for a number of language constructs,
e.g. for abstract type members and value classes, but the mechanism is not extensible, which means that macro writers can't customize it).

## Anonymous type providers

Even though the scope of definitions introduced by expansions of def macros is limited to those expansions,
these definitions can escape their scopes by turning into structural types. For instance, consider the `h2db` macro that
takes a connection string and generates a module that encapsulates the given database, expanding as follows.

    def h2db(connString: String): Any = macro ...

    // an invocation of the `h2db` macro
    val db = h2db("jdbc:h2:coffees.h2.db")

    // expands into the following code
    val db = {
      trait Db {
        case class Coffee(...)
        val Coffees: Table[Coffee] = ...
      }
      new Db {}
    }

It is true that noone outside the macro expansion block would be able to refer to the `Coffee` class directly,
however if we inspect the type of `db`, we will find something fascinating.

    scala> val db = h2db("jdbc:h2:coffees.h2.db")
    db: AnyRef {
      type Coffee { val name: String; val price: Int; ... }
      val Coffees: Table[this.Coffee]
    } = $anon$1...

As we can see, when the typechecker tried to infer a type for `db`, it took all the references to locally declared classes
and replaced them with structural types that contain all publicly visible members of those classes. The resulting type
captures the essence of the generated classes, providing a statically typed interface to their members.

    scala> db.Coffees.all
    res1: List[Db$1.this.Coffee] = List(Coffee(Brazilian,99,0))

This approach to type providers is quite neat, because it can be used with production versions of Scala, however
it has performance problems caused by the fact that Scala emits reflective calls when compiling accesses to members
of structural types. There are several strategies of dealing with that, but this margin is too narrow to contain them
so I refer you to an amazing blog series by Travis Brown for details: [post 1](http://meta.plasm.us/posts/2013/06/19/macro-supported-dsls-for-schema-bindings/), [post 2](http://meta.plasm.us/posts/2013/07/11/fake-type-providers-part-2/), [post 3](http://meta.plasm.us/posts/2013/07/12/vampire-methods-for-structural-types/).

## Public type providers

With the help of [macro paradise](/overviews/macros/paradise.html) and its [macro annotations](/overviews/macros/annotations.html), it becomes
possible to easily generate publicly visible classes, without having to apply workarounds based on structural types. The annotation-based
solution is very straightforward, so I won't be writing much about it here.

    class H2Db(connString: String) extends StaticAnnotation {
      def macroTransform(annottees: Any*) = macro ...
    }

    @H2Db("jdbc:h2:coffees.h2.db") object Db
    println(Db.Coffees.all)
    Db.Coffees.insert("Brazilian", 99, 0)

### Addressing the erasure problem

We haven't looked into this in much detail, but there's a hypothesis that a combination of type members
and singleton types can provide an equivalent of erased type providers in F#. Concretely, classes that we don't want to erase
should be declared as usual, whereas classes that should be erased to a given upper bound should be declared as type aliases
to that upper bound parameterized by a singleton type that carries unique identifiers. With that approach, every new generated type
would still incur the overhead of additional bytecode to the metadata of type aliases, but that bytecode would be significantly smaller
than bytecode of a full-fledged class. This technique applies to both anonymous and public type providers.

    object Netflix {
      type Title = XmlEntity["http://.../Title".type]
      def Titles: List[Title] = ...
      type Director = XmlEntity["http://.../Director".type]
      def Directors: List[Director] = ...
      ...
    }

    class XmlEntity[Url] extends Dynamic {
      def selectDynamic(field: String) = macro XmlEntity.impl
    }

    object XmlEntity {
      def impl(c: Context)(field: c.Tree) = {
        import c.universe._
        val TypeRef(_, _, tUrl) = c.prefix.tpe
        val ConstantType(Constant(sUrl: String)) = tUrl
        val schema = loadSchema(sUrl)
        val Literal(Constant(sField: String)) = field
        if (schema.contains(sField)) q"${c.prefix}($sField)"
        else c.abort(s"value $sField is not a member of $sUrl")
      }
    }

## Blackbox vs whitebox

Both anonymous and public type providers must be [whitebox](/overviews/macros/blackbox-whitebox.html).
If you declare a type provider macro as [blackbox](/overviews/macros/blackbox-whitebox.html), it will not work.
