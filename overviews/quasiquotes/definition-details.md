---
layout: overview-large
title: Definition and import details

disqus: true

partof: quasiquotes
num: 11
outof: 13
languages: [ko]
---
**Denys Shabalin** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

## Modifiers

Every definition except packages and package objects have associated modifiers object which contains following data:

1. `FlagSet`, a set of bits that characterizes given definition.
2. Private within name (e.g. `foo` in `private[foo] def f`)
3. List of annotations

Quasiquotes let you easily work with those fields through native support for `Modifiers`, `FlagSet` and annotation unquoting:

    scala> val f1 = q"${Modifiers(PRIVATE | IMPLICIT)} def f"
    f1: universe.DefDef = implicit private def f: scala.Unit

    scala> val f2 = q"$PRIVATE $IMPLICIT def f"
    f2: universe.DefDef = implicit private def f: scala.Unit

    scala> val f3 = q"private implicit def f"
    f3: universe.DefDef = implicit private def f: scala.Unit

All of those quasiquotes result into equivalent trees. It's also possible to combine unquoted flags with one provided inline in the source code but unquoted one should be used before inline ones:

    scala> q"$PRIVATE implicit def foo"
    res10: universe.DefDef = implicit private def foo: scala.Unit

    scala> q"implicit $PRIVATE def foo"
    <console>:32: error: expected start of definition
                  q"implicit $PRIVATE def foo"
                             ^

To provide a definition annotation one need to unquote a new-shaped tree:

    scala> val annot = q"new foo(1)"
    annot: universe.Tree = new Foo(1)

    scala> val f4 = q"@$annot def f"
    f4: universe.DefDef = @new foo(1) def f: scala.Unit

    scala> val f5 = q"@foo(1) def f"
    f5: universe.DefDef = @new foo(1) def f: scala.Unit

In deconstruction one can either extract `Modifiers` or annotations, but you can't extract flags separately:

    scala> val q"$mods def f" = q"@foo implicit def f"
    mods: universe.Modifiers = Modifiers(<deferred> implicit, , Map())

    scala> val q"@..$annots implicit def f" = q"@foo @bar implicit def f"
    annots: List[universe.Tree] = List(new foo(), new bar())

Considering the fact that definitions might contain various low-level flags added to trees during typechecking it\'s recommended to always extract complete modifiers as otherwise your pattern might not be exhaustive. If you don't care about them just use a wildcard:

    scala> val q"$_ def f" = q"@foo @bar implicit def f"

## Templates

Templates are a common abstraction in definition trees that is used in new expressions, classes, traits, objects, package objects. Although there is no interpolator for it at the moment we can illustrate its structure on the example of new expression (similar handling will apply to all other template-bearing trees):

    q"new { ..$earlydefns } with ..$parents { $self => ..$stats }"

So template consists of:

1. Early definitions. A list of val or type definitions. Type definitions are still allowed by they are deprecated and will be removed in the future:

        scala> val withx = q"new { val x = 1 } with RequiresX"
        withx: universe.Tree = ...

        scala> val q"new { ..$earlydefns } with RequiresX" = withx
        earlydefns: List[universe.Tree] = List(val x = 1)

2. List of parents. A list of type identifiers with possibly an optional arguments to the first one in the list:

        scala> val q"new ..$parents"  = q"new Foo(1) with Bar[T]"
        parents: List[universe.Tree] = List(Foo(1), Bar[T])

   First of the parents has a bit unusual shape that is a symbiosis of term and type trees:

        scala> val q"${tq"$name[..$targs]"}(...$argss)" = parents.head
        name: universe.Tree = Foo
        targs: List[universe.Tree] = List()
        argss: List[List[universe.Tree]] = List(List(1))

   The others are just plain type trees:

        scala> val tq"$name[..$targs]" = parents.tail.head
        name: universe.Tree = Bar
        targs: List[universe.Tree] = List(T)

3. Self type definition. A val definition that can be used to define an alias to this and provide a self-type via tpt:

        scala> val q"new { $self => }" = q"new { self: T => }"
        self: universe.ValDef = private val self: T = _

        scala> val q"$mods val $name: $tpt" = self
        mods: universe.Modifiers = Modifiers(private, , Map())
        name: universe.TermName = self
        tpt: universe.Tree = T

4. List of body statements.

        scala> val q"new { ..$body }" = q"new { val x = 1; def y = 'y }"
        body: List[universe.Tree] = List(val x = 1, def y = scala.Symbol("y"))

## Val and Var Definitions

Vals and vars allow you to define immutable and mutable variables correspondingly. Additionally they are also used to represent [function](/overviews/quasiquotes/expression-details.html#function), [class](#class-definition) and [method](#method-definition) parameters.

Each val and var consistents of four components: modifiers, name, type tree and a right hand side:

    scala> val valx = q"val x = 2"
    valx: universe.ValDef = val x = 2

    scala> val q"$mods val $name: $tpt = $rhs" = valx
    mods: universe.Modifiers = Modifiers(, , Map())
    name: universe.TermName = x
    tpt: universe.Tree = <type ?>
    rhs: universe.Tree = 2

If type of the val isn't explicitly specified by the user an [empty type](/overviews/quasiquotes/type-details.html#empty-type) is used as tpt.

Vals and vars are disjoint (they don't match one another):

    scala> val q"$mods val $name: $tpt = $rhs" = q"var x = 2"
    scala.MatchError: var x = 2 (of class scala.reflect.internal.Trees$ValDef)
      ... 32 elided

Vars always have `MUTABLE` flag in their modifiers:

    scala> val q"$mods var $name: $tpt = $rhs" = q"var x = 2"
    mods: universe.Modifiers = Modifiers(<mutable>, , Map())
    name: universe.TermName = x
    tpt: universe.Tree = <type ?>
    rhs: universe.Tree = 2

## Pattern Definitions

Pattern definitions allow to use scala pattern matching capabilities to define variables. Unlike
val and var definitions, pattern definitions are not first-class and they are get represented
through combination of regular vals and vars and pattern matching:

    scala> val patdef = q"val (x, y) = (1, 2)"
    patdef: universe.Tree =
    {
      <synthetic> <artifact> private[this] val x$2 = scala.Tuple2(1, 2): @scala.unchecked match {
        case scala.Tuple2((x @ _), (y @ _)) => scala.Tuple2(x, y)
      };
      val x = x$2._1;
      val y = x$2._2;
      ()
    }

This representation has a few side-effects on the usage of such definitions:

1. Due to the fact that single definition often gets desugared into multiple lower-level
   ones, one need to always use unquote splicing to unquote pattern definitions into other trees:

        scala> val tupsum = q"..$patdef; a + b"
        tupsum: universe.Tree =
        {
          <synthetic> <artifact> private[this] val x$3 = scala.Tuple2(1, 2): @scala.unchecked match {
            case scala.Tuple2((x @ _), (y @ _)) => scala.Tuple2(x, y)
          };
          val x = x$3._1;
          val y = x$3._2;
          a.$plus(b)
        }

   Otherwise if a regular unquoting is used, the definitions will be nested in a block that will make
   them invisible in the scope where they are meant to be used:

        scala> val wrongtupsum = q"$patdef; a + b"
        wrongtupsum: universe.Tree =
        {
          {
            <synthetic> <artifact> private[this] val x$3 = scala.Tuple2(1, 2): @scala.unchecked match {
              case scala.Tuple2((x @ _), (y @ _)) => scala.Tuple2(x, y)
            };
            val x = x$3._1;
            val y = x$3._2;
            ()
          };
          a.$plus(b)
        }

2. One can only construct pattern definitions, not deconstruct them.

Generic form of pattern definition consists of modifiers, pattern, ascribed type and a right hand side:

    q"$mods val $pat: $tpt = $rhs"

Similarly one can also construct a mutable pattern definition:

    q"$mods var $pat: $tpt = $rhs"

## Type Definition

Type definition have two possible shapes: abstract type definitions and alias type definitions.

Abstract type definitions have the following shape:

    scala> val q"$mods type $name[..$tparams] >: $low <: $high" =
               q"type Foo[T] <: List[T]"
    mods: universe.Modifiers = Modifiers(<deferred>, , Map())
    name: universe.TypeName = Foo
    tparams: List[universe.TypeDef] = List(type T)
    low: universe.Tree = <empty>
    high: universe.Tree = List[T]

Whenever one of the bounds isn\'t available it gets represented as [empty tree](/overviews/quasiquotes/expression-details.html#empty). Here each of the type arguments is a type definition iteself.

Another form of type definition is a type alias:

    scala> val q"$mods type $name[..$args] = $tpt" =
               q"type Foo[T] = List[T]"
    mods: universe.Modifiers = Modifiers(, , Map())
    name: universe.TypeName = Foo
    args: List[universe.TypeDef] = List(type T)
    tpt: universe.Tree = List[T]

Due to low level uniform representation of type aliases and abstract types one matches another:

    scala> val q"$mods type $name[..$args] = $tpt" = q"type Foo[T] <: List[T]"
    mods: universe.Modifiers = Modifiers(<deferred>, , Map())
    name: universe.TypeName = Foo
    args: List[universe.TypeDef] = List(type T)
    tpt: universe.Tree =  <: List[T]

Where `tpt` has a `TypeBoundsTree(low, high)` shape.

## Method Definition

Each method consists of modifiers, name, type arguments, value arguments, return type and a body:

    scala> val q"$mods def $name[..$tparams](...$paramss): $tpt = $body" = q"def f = 1"
    mods: universe.Modifiers = Modifiers(, , Map())
    name: universe.TermName = f
    tparams: List[universe.TypeDef] = List()
    paramss: List[List[universe.ValDef]] = List()
    tpt: universe.Tree = <type ?>
    body: universe.Tree = 1

Type arguments are [type definitions](#type-definition) and value arguments are [val definitions](#val-and-var-definitions). Inferred return type is represented as [empty type](/overviews/quasiquotes/type-details.html#empty-type). If body of the method is [empty expression](/overviews/quasiquotes/expression-details.html#empty) it means that method is abstract.

Alternatively you can also deconstruct arguments separating implicit and non-implicit parameters:

    scala> val q"def g(...$paramss)(implicit ..$implparams) = $body" =
               q"def g(x: Int)(implicit y: Int) = x + y"
    paramss: List[List[universe.ValDef]] = List(List(val x: Int = _))
    implparams: List[universe.ValDef] = List(implicit val y: Int = _)
    body: universe.Tree = x.$plus(y)

This way of parameter handling will still work if method doesn\'t have any implicit parameters and `implparams` will get extracted as an empty list:

    scala> val q"def g(...$paramss)(implicit ..$implparams) = $rhs" =
               q"def g(x: Int)(y: Int) = x + y"
    paramss: List[List[universe.ValDef]] = List(List(val x: Int = _), List(val y: Int = _))
    implparams: List[universe.ValDef] = List()
    body: universe.Tree = x.$plus(y)

## Secondary Constructor Definition

Secondary constructors are special kinds of methods that have following shape:

    scala> val q"$mods def this(...$paramss) = this(...$argss)" =
               q"def this() = this(0)"
    mods: universe.Modifiers = Modifiers(, , Map())
    paramss: List[List[universe.ValDef]] = List(List())
    argss: List[List[universe.Tree]] = List(List(0))

Due to low level underlying representation of trees secondary constructors are represented as special kind of method with `termNames.CONSTRUCTOR` name:

    scala> val q"$mods def $name[..$tparams](...$paramss): $tpt = $body"
             = q"def this() = this(0)"
    mods: universe.Modifiers = Modifiers(, , Map())
    name: universe.TermName = <init>
    tparams: List[universe.TypeDef] = List()
    paramss: List[List[universe.ValDef]] = List(List())
    tpt: universe.Tree = <type ?>
    body: universe.Tree = <init>(0)

## Class Definition

Classes have a following structure:

    q"$mods class $tpname[..$tparams] $ctorMods(...$paramss) extends { ..$earlydefns } with ..$parents { $self => ..$stats }"

As you probably already see the right part after extends is just a [template](#templates). Apart from it and modifiers classes
also have primary constructor which consists of constructor modifiers, type and value parameters which behave very much like
[method](#method-definition) modifiers and parameters.

## Trait Definition

Syntactically traits are quite similar to [classes](#class-definition) sans value parameters and constructor modifiers:

     q"$mods trait $tpname[..$tparams] extends { ..$earlydefns } with ..$parents { $self => ..$stats }"

An important difference in handling is caused by [SI-8399](https://issues.scala-lang.org/browse/SI-8399?filter=12305): due to INTERFACE flag that is set for traits with only abstract
members trait pattern might not match:

    scala> val q"trait $name { ..$stats }" = q"trait X { def x: Int }"
    scala.MatchError: ...

A workaround it to always extract modifiers with wildcard pattern:

    scala> val q"$_ trait $name { ..$stats }" = q"trait X { def x: Int }"
    name: universe.TypeName = X
    stats: List[universe.Tree] = List(def x: Int)

## Object Definition

Syntactically objects are quite similar [classes](#class-definition) without constructors:

    q"$mods object $tname extends { ..$earlydefns } with ..$parents { $self => ..$stats }"

## Package Definition

Packages are a fundamental primitive to organize source code. You can express them in quasiquotes as:

    scala> val pack = q"package mycorp.myproj { class MyClass }"
    pack: universe.PackageDef =
    package mycorp.myproj {
      class MyClass extends scala.AnyRef {
        def <init>() = {
          super.<init>();
          ()
        }
      }
    }

    scala> val q"package $ref { ..$body }" = pack
    ref: universe.RefTree = mycorp.myproj
    body: List[universe.Tree] =
    List(class MyClass extends scala.AnyRef {
      def <init>() = {
        super.<init>();
        ()
      }
    })

Quasiquotes don\'t support inline package definition syntax that are usually used in the
header of the source file (but it's equivalent to the supported one in terms of ASTs).

## Package Object Definition

Package objects are a cross between packages and object:

    q"package object $tname extends { ..$earlydefns } with ..$parents { $self => ..$stats }"

All of the handling properties are equivalent to those of objects apart from the fact that they don\'t have [modifiers](#modifiers).

Even though package and regular objects seem to be quite similar syntactically they don't match one another:

    scala> val q"$mods object $name" = q"package object O"
    scala.MatchError: ...

    scala> val q"package object $name" = q"object O"
    scala.MatchError: ...

Internally they get represtend as an object nested into package with given name:

    scala> val P = q"package object P"
    P: universe.PackageDef =
    package P {
      object `package` extends scala.AnyRef {
        def <init>() = {
          super.<init>();
          ()
        }
      }
    }

This also means that you can match package object as a package.
