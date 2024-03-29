---
layout: multipage-overview
title: Expression details
partof: quasiquotes
overview-name: Quasiquotes

num: 8

permalink: /overviews/quasiquotes/:title.html
---
**Denys Shabalin** <span class="tag" style="float: right;">EXPERIMENTAL</span>

## Empty

`q""` is used to indicate that some part of the tree is not provided by the user:

1. `Val`s, `Var`s and `Def`s without the right-hand side have it set to `q""`.
2. Abstract type definitions without bounds have them set to `q""`.
3. `Try` expressions without a `finally` clause have it set to `q""`.
4. `Case` clauses without guards have them set to `q""`.

The default `toString` formats `q""` as `<empty>`.

## Literal

Scala has a number of default built-in literals:

    q"1", q"1L"              // integer literals
    q"1.0f", q"1.0", q"1.0d" // floating point literals
    q"true", q"false"        // boolean literals
    q"'c'"                   // character literal
    q""" "string" """        // string literal
    q"'symbol"               // symbol literal
    q"null"                  // null literal
    q"()"                    // unit literal

All of those values are of type `Literal` except symbols, which have a different representation:

    scala> val foo = q"'foo"
    foo: universe.Tree = scala.Symbol("foo")

Thanks to [lifting]({{ site.baseurl }}/overviews/quasiquotes/lifting.html), you can also easily create literal trees directly from values of corresponding types:

    scala> val x = 1
    scala> val one = q"$x"
    one: universe.Tree = 1

This would work the same way for all literal types (see [standard liftables]({{ site.baseurl }}/overviews/quasiquotes/lifting.html#standard-liftables) except `Null`. Lifting of the `null` value into the `Null` type isn't supported; use `q"null"` if you really want to create a `null` literal:

    scala> val x = null
    scala> q"$x"
    <console>:31: error: Can't unquote Null, bottom type values often indicate programmer mistake
                  q"$x"
                     ^

During deconstruction you can use [unlifting]({{ site.baseurl }}/overviews/quasiquotes/unlifting.html) to extract values out of `Literal` trees:

    scala> val q"${x: Int}" = q"1"
    x: Int = 1

Similarly, it would work with all the literal types except `Null`. (see [standard unliftables]({{ site.baseurl }}/overviews/quasiquotes/unlifting.html#standard-unliftables))

## Identifier and Selection

Identifiers and member selections are two fundamental primitives that let you refer to other definitions. A combination of two of them is also known as a `RefTree`.

Each term identifier is defined by its name and whether it is backquoted:

    scala> val name = TermName("Foo")
    name: universe.TermName = Foo

    scala> val foo = q"$name"
    foo: universe.Ident = Foo

    scala> val backquoted = q"`$name`"
    backquoted: universe.Ident = `Foo`

Although backquoted and non-backquoted identifiers may refer to the same thing they are not syntactically equivalent:

    scala> val q"`Foo`" = q"Foo"
    scala.MatchError: Foo (of class scala.reflect.internal.Trees$Ident)
      ... 32 elided

This is because backquoted identifiers have different semantics in pattern patching.

Apart from matching on identifiers with a given name, you can also extract their name values with the help of [unlifting]({{ site.baseurl }}/overviews/quasiquotes/unlifting.html):

    scala> val q"${name: TermName}" = q"Foo"
    name: universe.TermName = Foo

Name ascription is important here because without it you'll get a pattern that is equivalent to regular pattern variable binding.

Similarly, you can create and extract member selections:

    scala> val member = TermName("bar")
    member: universe.TermName = bar

    scala> val q"foo.$name" = selected
    name: universe.TermName = bar

## Super and This

One can use `this` and `super` to select precise members within an inheritance chain.

This tree supports following variations:

    scala> val q"$name.this" = q"this"
    name: universe.TypeName =

    scala> val q"$name.this" = q"foo.this"
    name: universe.TypeName = foo

So an unqualified `q"this"` is equivalent to `q"${tpnme.EMPTY}.this"`.

Similarly, for `super` we have:

    scala> val q"$name.super[$qual].$field" = q"super.foo"
    name: universe.TypeName =
    qual: universe.TypeName =
    field: universe.Name = foo

    scala> val q"$name.super[$qual].$field" = q"super[T].foo"
    name: universe.TypeName =
    qual: universe.TypeName = T
    field: universe.Name = foo

    scala> val q"$name.super[$qual].$field" = q"other.super[T].foo"
    name: universe.TypeName = other
    qual: universe.TypeName = T
    field: universe.Name = foo

## Application and Type Application

Value applications and type applications are two fundamental parts from which one can construct calls to Scala functions and methods. Let's assume that we would like to handle function calls to the following method:

    def f[T](xs: T*): List[T] = xs.toList

This can be accomplished with the following:

    scala> val apps = List(q"f[Int](1, 2)", q"f('a, 'b)")
    scala> apps.foreach {
             case q"f[..$ts](..$args)" =>
               println(s"type arguments: $ts, value arguments: $args")
           }
    type arguments: List(Int), value arguments: List(1, 2)
    type arguments: List(), value arguments: List(scala.Symbol("a"), scala.Symbol("b"))

As you can see, we were able to match both calls regardless of whether a specific type application exists. This happens because the type application matcher extracts the empty list of type arguments if the tree is not an actual type application, making it possible to handle both situations uniformly.

It is recommended to always include type applications when you match on a function with type arguments, as they will be inserted by the compiler during type checking, even if the user didn't write them explicitly:

    scala> val q"$_; f[..$ts](..$args)" = toolbox.typecheck(q"""
             def f[T](xs: T*): List[T] = xs.toList
             f(1, 2, 3)
           """)
    ts: List[universe.Tree] = List(Int)
    args: List[universe.Tree] = List(1, 2, 3)

Other important features of Scala method calls are multiple argument lists and implicit arguments:

    def g(x: Int)(implicit y: Int) = x + y

Here we might get one, or two subsequent value applications:

    scala> val apps = List(q"g(1)", q"g(1)(2)")
    scala> apps.foreach {
             case q"g(...$argss)" if argss.nonEmpty =>
               println(s"argss: $argss")
           }
    argss: List(List(1))
    argss: List(List(1), List(2))

`...$`, in a pattern, allows us to greedily match all subsequent value applications. Similarly to the type arguments matcher, one needs to be careful because it always matches even in the case where no actual value applications exist:

    scala> val q"g(...$argss)" = q"g"
    argss: List[List[universe.Tree]] = List()

Therefore, it's recommended to use more specific patterns that check that ensure the extracted `argss` is not empty.

Similarly to type arguments, implicit value arguments are automatically inferred during type checking:

    scala> val q"..$stats; g(...$argss)" = toolbox.typecheck(q"""
             def g(x: Int)(implicit y: Int) = x + y
             implicit val y = 3
             g(2)
           """)
    stats: List[universe.Tree] = List(def g(x: Int)(implicit y: Int): Int = x.+(y), implicit val y: Int = 3)
    argss: List[List[universe.Tree]] = List(List(2), List(y))

## Assign and Update

Assign and update are two related ways to explicitly mutate a variable or collection:

    scala> val assign = q"x = 2"
    assign: universe.Tree = x = 2

    scala> val update = q"array(0) = 1"
    update: universe.Tree = array.update(0, 1)

As you can see, the update syntax is just syntactic sugar that gets represented as an update method call on given object.

Nevertheless, quasiquotes let you deconstruct both of them uniformly according to their user-facing syntax:

    scala> List(assign, update).foreach {
             case q"$left = $right" =>
               println(s"left = $left, right = $right")
           }
    left = x, right = 2
    left = array(0), right = 1

Where `array(0)` has the same AST as function application.

On the other hand if you want to treat this two cases separately, it's possible with the following, more specific pattern:

    scala> List(assign, update).foreach {
             case q"${ref: RefTree} = $expr" =>
               println(s"assign $expr to $ref")
             case q"$obj(..$args) = $expr" =>
               println(s"update $obj at $args with $expr")
           }
    assign 2 to x
    update array at List(0) with 1


## Return

The *return* expression is used to perform an early return from a function.

    scala> val ret = q"return 2 + 2"
    ret: universe.Return = return 2.$plus(2)

    scala> val q"return $expr" = ret
    expr: universe.Tree = 2.$plus(2)

## Throw

The *throw* expression is used to throw a throwable:

    scala> val thr = q"throw new Exception"
    thr: universe.Throw = throw new Exception()

    scala> val q"throw $expr" = thr
    expr: universe.Tree = new Exception()

## Ascription

Ascriptions let users annotate the type of intermediate expression:

    scala> val ascribed = q"(1 + 1): Int"
    ascribed: universe.Typed = (1.$plus(1): Int)

    scala> val q"$expr: $tpt" = ascribed
    expr: universe.Tree = 1.$plus(1)
    tpt: universe.Tree = Int

## Annotation

Expressions can be annotated:

    scala> val annotated = q"(1 + 1): @positive"
    annotated: universe.Annotated = 1.$plus(1): @positive

    scala> val q"$expr: @$annot" = annotated
    expr: universe.Tree = 1.$plus(1)
    annot: universe.Tree = positive

It's important to mention that such a pattern won't match if we combine annotation with ascription:

    scala> val q"$expr: @$annot" = q"(1 + 1): Int @positive"
    scala.MatchError: (1.$plus(1): Int @positive) (of class scala.reflect.internal.Trees$Typed)
      ... 32 elided

In this case we need to deconstruct it as an [ascription](#ascription) and then deconstruct `tpt` as an [annotated type]({{ site.baseurl }}/overviews/quasiquotes/type-details.html#annotated-type).

## Tuple

Tuples are heteregeneous data structures with built-in user-friendly syntax. The syntax itself is just syntactic sugar that maps onto `scala.TupleN` calls:

    scala> val tup = q"(a, b)"
    tup: universe.Tree = scala.Tuple2(a, b)

At the moment, tuples are only supported up to an arity of 22, but this is just an implementation restriction that might be lifted in the future. To find out if a given arity is supported use:

    scala> val `tuple 10 supported?` = definitions.TupleClass(10) != NoSymbol
    tuple 10 supported?: Boolean = true

    scala> val `tuple 23 supported?` = definitions.TupleClass(23) != NoSymbol
    tuple 23 supported?: Boolean = false

Despite the fact that `Tuple1` class exists there is no built-in syntax for it. Single parens around expression do not change its meaning:

    scala> val inparens = q"(a)"
    inparens: universe.Ident = a

It is also common to treat `Unit` as a nullary tuple:

    scala> val elems = List.empty[Tree]
    scala> val nullary = q"(..$elems)"
    nullary: universe.Tree = ()

Quasiquotes also support deconstruction of tuples of arbitrary arity:

    scala> val q"(..$elems)" = q"(a, b)"
    elems: List[universe.Tree] = List(a, b)

This pattern also matches expressions as single-element tuples:

    scala> val q"(..$elems)" = q"(a)"
    elems: List[universe.Tree] = List(a)

And `Unit` as a nullary tuple:

    scala> val q"(..$elems)" = q"()"
    elems: List[universe.Tree] = List()

## Block

Blocks are a fundamental primitive used to express a sequence of actions or bindings. The `q"..."` interpolator is an equivalent of a block. It allows you to convey more than one expression, separated by a semicolon or a newline:

    scala> val t = q"a; b; c"
    t: universe.Tree =
    {
      a;
      b;
      c
    }

The only difference between `q"{...}"` and `q"..."` is how they handle the of case just a single element.  `q"..."` always returns an element itself while a block still remains a block if a single element is not an expression:

    scala> val t = q"val x = 2"
    t: universe.ValDef = val x = 2

    scala> val t = q"{ val x = 2 }"
    t: universe.Tree =
    {
      val x = 2;
      ()
    }

Blocks can also be flattened into other blocks with `..$`:

    scala> val ab = q"a; b"
    ab: universe.Tree =
    {
      a;
      b
    }

    scala> val abc = q"..$ab; c"
    abc: universe.Tree =
    {
      a;
      b;
      c
    }

The same syntax can be used to deconstruct blocks:

    scala> val q"..$stats" = q"a; b; c"
    stats: List[universe.Tree] = List(a, b, c)

Deconstruction always returns the user-defined contents of a block:

    scala> val q"..$stats" = q"{ val x = 2 }"
    stats: List[universe.Tree] = List(val x = 2)

Due to automatic flattening of single-element blocks with expressions, expressions themselves are considered to be single-element blocks:

    scala> val q"..$stats" = q"foo"
    stats: List[universe.Tree] = List(foo)

Except for empty tree which is not considered to be a block:

    scala> val q"..$stats" = q""
    scala.MatchError: <empty> (of class scala.reflect.internal.Trees$EmptyTree$)
      ... 32 elided

A zero-element block is equivalent to a synthetic unit (one that was inserted by the compiler rather than written by the user):

    scala> val q"..$stats" = q"{}"
    stats: List[universe.Tree] = List()

    scala> val syntheticUnit = q"..$stats"
    syntheticUnit: universe.Tree = ()

Such units are used in empty `else` branches of [ifs](#if) and empty bodies of [case clauses](#pattern-match), making it as convenient to work with those cases as with zero-element blocks.

## If

There are two varieties of if expressions: those with an `else` clause and without it:

    scala> val q"if ($cond) $thenp else $elsep" = q"if (true) a else b"
    cond: universe.Tree = true
    thenp: universe.Tree = a
    elsep: universe.Tree = b

    scala> val q"if ($cond) $thenp else $elsep" = q"if (true) a"
    cond: universe.Tree = true
    thenp: universe.Tree = a
    elsep: universe.Tree = ()

A missing `else` clause is equivalent to an `else` clause that contains a synthetic unit literal ([empty block](#block)).

## Pattern Match

Pattern matching is a cornerstone feature of Scala that lets you deconstruct values into their components:

    q"$expr match { case ..$cases } "

Where `expr` is some non-empty expression and each case is represented with a `cq"..."` quote:

    cq"$pat if $expr => $expr"

A combination of the two forms allows you to construct and deconstruct arbitrary pattern matches:

    scala> val q"$expr match { case ..$cases }" =
               q"foo match { case _: Foo => 'foo case _ => 'notfoo }"
    expr: universe.Tree = foo
    cases: List[universe.CaseDef] = List(case (_: Foo) => scala.Symbol("foo"), case _ => scala.Symbol("notfoo"))

    scala> val cq"$pat1 => $body1" :: cq"$pat2 => $body2" :: Nil = cases
    pat1: universe.Tree = (_: Foo)
    body1: universe.Tree = scala.Symbol("foo")
    pat2: universe.Tree = _
    body2: universe.Tree = scala.Symbol("notfoo")

A case clause without a body is equivalent to one holding a synthetic unit literal ([empty block](#block)):

    scala> val cq"$pat if $expr1 => $expr2" = cq"_ =>"
    pat: universe.Tree = _
    expr1: universe.Tree = <empty>
    expr2: universe.Tree = ()

The lack of a guard is represented with the help of an [empty expression](#empty).

## Try

A `try` expression is used to handle possible error conditions and to ensure a consistent state via `finally`. Both error handling cases and the `finally` clause are optional.

    scala> val q"try $a catch { case ..$b } finally $c" = q"try t"
    a: universe.Tree = t
    b: List[universe.CaseDef] = List()
    c: universe.Tree = <empty>

    scala> val q"try $a catch { case ..$b } finally $c" =
               q"try t catch { case _: C => }"
    a: universe.Tree = t
    b: List[universe.CaseDef] = List(case (_: C) => ())
    c: universe.Tree = <empty>

    scala> val q"try $a catch { case ..$b } finally $c" =
               q"try t finally f"
    a: universe.Tree = t
    b: List[universe.CaseDef] = List()
    c: universe.Tree = f

Similar to [pattern matching](#pattern-match), cases can be further deconstructed with `cq"..."`. The lack of a `finally` clause is represented with the help of an [empty expression](#empty).

## Function

There are three ways to create anonymous function:

    scala> val f1 = q"_ + 1"
    anon1: universe.Function = ((x$4) => x$4.$plus(1))

    scala> val f2 = q"(a => a + 1)"
    anon2: universe.Function = ((a) => a.$plus(1))

    scala> val f3 = q"(a: Int) => a + 1"
    anon3: universe.Function = ((a: Int) => a.$plus(1))

The first one uses the placeholder syntax. The second one names the function parameter but still relies on type inference to infer its type. An the last one explicitly defines the function parameter. Due to an implementation restriction, the second notation can only be used in parentheses or inside another expression. If you leave them out then you must specify the parameter types.

Parameters are represented as [Vals]({{ site.baseurl }}/overviews/quasiquotes/definition-details.html#val-and-var-definitions). If you want to programmatically create a `val` that should have its type inferred you need to use the [empty type]({{ site.baseurl }}/overviews/quasiquotes/type-details.html#empty-type):

    scala> val tpt = tq""
    tpt: universe.TypeTree = <type ?>

    scala> val param = q"val x: $tpt"
    param: universe.ValDef = val x

    scala> val fun = q"($param => x)"
    fun: universe.Function = ((x) => x)

All of the given forms are represented in the same way and may be matched uniformly:

    scala> List(f1, f2, f3).foreach {
             case q"(..$params) => $body" =>
               println(s"params = $params, body = $body")
           }
    params = List(<synthetic> val x$5 = _), body = x$5.$plus(1)
    params = List(val a = _), body = a.$plus(1)
    params = List(val a: Int = _), body = a.$plus(1)

You can also tear arguments apart even further:

    scala> val q"(..$params) => $_" = f3
    params: List[universe.ValDef] = List(val a: Int = _)

    scala> val List(q"$_ val $name: $tpt") = params
    name: universe.TermName = a
    tpt: universe.Tree = Int

It is recommended that you use the underscore pattern in place of [modifiers]({{ site.baseurl }}/overviews/quasiquotes/definition-details.html#modifiers), even if you don't plan to work with them as parameters, they may contain additional flags which might cause match failures.

## Partial Function

Partial functions are a neat syntax that let you express functions with a limited domain by using pattern matching:

    scala> val pf = q"{ case i: Int if i > 0 => i * i }"
    pf: universe.Match =
    <empty> match {
      case (i @ (_: Int)) if i.$greater(0) => i.$times(i)
    }

    scala> val q"{ case ..$cases }" = pf
    cases: List[universe.CaseDef] = List(case (i @ (_: Int)) if i.$greater(0) => i.$times(i))

A weird default for the "pretty printed" view on the tree represents the fact that they share a similar data structure as do trees for match expressions. Despite this fact, they do not match one another:

  scala> val q"$expr match { case ..$cases }" = pf
  scala.MatchError: ...

## While and Do-While Loops

While and do-while loops are low-level control structures that can be used when performance of a particular iteration is critical:

    scala> val `while` = q"while(x > 0) x -= 1"
    while: universe.LabelDef =
    while$6(){
      if (x.$greater(0))
        {
          x.$minus$eq(1);
          while$6()
        }
      else
        ()
    }

    scala> val q"while($cond) $body" = `while`
    cond: universe.Tree = x.$greater(0)
    body: universe.Tree = x.$minus$eq(1)

    scala> val `do-while` = q"do x -= 1 while (x > 0)"
    do-while: universe.LabelDef =
    doWhile$2(){
      x.$minus$eq(1);
      if (x.$greater(0))
        doWhile$2()
      else
        ()
    }

    scala> val q"do $body while($cond)" = `do-while`
    body: universe.Tree = x.$minus$eq(1)
    cond: universe.Tree = x.$greater(0)

## For and For-Yield Loops

`for` and `for-yield` expressions allow us to write a monadic style comprehension that desugar into calls to `map`, `flatMap`, `foreach` and `withFilter` methods:

    scala> val `for-yield` = q"for (x <- xs; if x > 0; y = x * 2) yield x"
    for-yield: universe.Tree =
    xs.withFilter(((x) => x.$greater(0))).map(((x) => {
      val y = x.$times(2);
      scala.Tuple2(x, y)
    })).map(((x$3) => x$3: @scala.unchecked match {
      case scala.Tuple2((x @ _), (y @ _)) => x
    }))

Each enumerator in the comprehension can be expressed with the `fq"..."` interpolator:

    scala> val enums = List(fq"x <- xs", fq"if x > 0", fq"y = x * 2")
    enums: List[universe.Tree] = List(`<-`((x @ _), xs), `if`(x.$greater(0)), (y @ _) = x.$times(2))

    scala> val `for-yield` = q"for (..$enums) yield y"
    for-yield: universe.Tree

Similarly, one can deconstruct the `for-yield` back into a list of enumerators and body:

    scala> val q"for (..$enums) yield $body" = `for-yield`
    enums: List[universe.Tree] = List(`<-`((x @ _), xs), `if`(x.$greater(0)), (y @ _) = x.$times(2))
    body: universe.Tree = x

It's important to mention that `for` and `for-yield` do not cross-match each other:

    scala> val q"for (..$enums) $body" = `for-yield`
    scala.MatchError: ...

## New

New expressions let you construct an instance of given type, possibly refining it with other types or definitions:

    scala> val q"new ..$parents { ..$body }" = q"new Foo(1) with Bar { def baz = 2 }"
    parents: List[universe.Tree] = List(Foo(1), Bar)
    body: List[universe.Tree] = List(def baz = 2)

See the [templates]({{ site.baseurl }}/overviews/quasiquotes/definition-details.html#templates) section for details.

## Import

Import trees consist of a reference and a list of selectors:

    scala> val q"import $ref.{..$sels}" = q"import foo.{bar, baz => boo, poison => _, _}"
    ref: universe.Tree = foo
    sels: List[universe.Tree] = List((bar @ _), $minus$greater((baz @ _), (boo @ _)), $minus$greater((poison @ _), _), _)

Selectors are extracted as pattern trees that are syntactically similar to selectors:

1. Simple identifier selectors are represented as pattern bindings: `pq"bar"`
2. Renaming selectors are represented as thin arrow patterns: `pq"baz -> boo"`
3. Unimport selectors are represented as thin arrows with a wildcard right-hand side: `pq"poison -> _"`
4. The wildcard selector is represented as a wildcard pattern: `pq"_"`

Similarly, one construct imports back from a programmatically created list of selectors:

    scala> val ref = q"a.b"
    scala> val sels = List(pq"foo -> _", pq"_")
    scala> val imp = q"import $ref.{..$sels}"
    imp: universe.Import = import a.b.{foo=>_, _}
