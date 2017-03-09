---
layout: overview-large
title: Hygiene

disqus: true

partof: quasiquotes
num: 5
outof: 13
languages: [ko]
---
**Denys Shabalin, Eugene Burmako** <span class="label warning" style="float: right;">EXPERIMENTAL</span>

The notion of hygiene has been widely popularized by macro research in Scheme. A code generator is called hygienic if it ensures absence of name clashes between regular and generated code, preventing accidental capture of identifiers. As numerous experience reports show, hygiene is of great importance to code generation, because name binding problems are often very non-obvious and lack of hygiene might manifest itself in subtle ways.

Sophisticated macro systems such as Racket's have mechanisms that make macros hygienic without any effort from macro writers. In Scala we don't have automatic hygiene yet - both of our codegen facilities (compile-time codegen with macros and runtime codegen with toolboxes) require programmers to handle hygiene manually. Fixing this is our number one priority for 2.12 (see [future prospects](/overviews/quasiquotes/future.html)), but in the meanwhile you need to know how to work around the absence of hygiene, which is what this section is about.

Preventing name clashes between regular and generated code means two things. First, we must ensure that regardless of the context in which we put generated code, its meaning isn't going to change (*referential transparency*). Second, we must make certain that regardless of the context in which we splice regular code, its meaning isn't going to change (often called *hygiene in the narrow sense*). Let's see what can be done to this end on a series of examples.

## Referential transparency

What referential transparency means is that quasiquotes should remember the lexical context in which they are defined. For instance, if there are imports provided at the definition site of the quasiquote, then these imports should be used to resolve names in the quasiquote. Unfortunately, this is not the case at the moment, and here's an example:

    scala> import collection.mutable.Map

    scala> def typecheckType(tree: Tree): Type =
             toolbox.typecheck(tree, toolbox.TYPEmode).tpe

    scala> typecheckType(tq"Map[_, _]") =:= typeOf[Map[_, _]]
    false

    scala> typecheckType(tq"Map[_, _]") =:= typeOf[collection.immutable.Map[_, _]]
    true

Here we can see that plain reference to `Map` doesn\'t respect our custom import and resolves to default `collection.immutable.Map` instead. Similar problems can arise if references aren't fully qualified in macros.

    // ---- MyMacro.scala ----
    package example

    import scala.reflect.macros.blackbox.Context
    import scala.language.experimental.macros

    object MyMacro {
      def wrapper(x: Int) = { println(s"wrapped x = $x"); x }
      def apply(x: Int): Int = macro impl
      def impl(c: Context)(x: c.Tree) = {
        import c.universe._
        q"wrapper($x)"
      }
    }

    // ---- Test.scala ----
    package example

    object Test extends App {
      def wrapper(x: Int) = x
      MyMacro(2)
    }

If we compile both macro and it's usage we'll see that `println` will not be called when application runs. This will happen because after macro expansion `Test.scala` will look like:

    // Expanded Test.scala
    package example

    object Test extends App {
      def wrapper(x: Int) = x
      wrapper(2)
    }

And wrapper will be resolved to `example.Test.wrapper` rather than intended `example.MyMacro.wrapper`. To avoid referential transparency gotchas one can use two possible workarounds:

1. Fully qualify all references. i.e. we can adapt our macros' implementation to:

       def impl(c: Context)(x: c.Tree) = {
         import c.universe._
         q"_root_.example.MyMacro.wrapper($x)"
       }

   It's important to start with `_root_` as otherwise there will still be a chance of name collision if `example` gets redefined at use-site of the macro.

2. Unquote symbols instead of using plain identifiers. i.e. we can resolve reference to wrapper by hand:

       def impl(c: Context)(x: c.Tree) = {
         import c.universe._
         val myMacro = symbolOf[MyMacro.type].asClass.module
         val wrapper = myMacro.info.member(TermName("wrapper"))
         q"$wrapper($x)"
       }

## Hygiene in the narrow sense

What hygiene in the narrow sense means is that quasiquotes shouldn't mess with the bindings of trees that are unquoted into them. For example, if a macro argument unquoted into a macro expansion was originally referring to some variable in enclosing lexical context, then this reference should remain in force after macro expansion, regardless of what code was generated for the macro expansion. Unfortunately, we don't have automatic facilities to ensure this, and that can lead to unexpected situations:

    scala> val originalTree = q"val x = 1; x"
    originalTree: universe.Tree = ...

    scala> toolbox.eval(originalTree)
    res1: Any = 1

    scala> val q"$originalDefn; $originalRef" = originalTree
    originalDefn: universe.Tree = val x = 1
    originalRef: universe.Tree = x

    scala> val generatedTree = q"$originalDefn; { val x = 2; println(x); $originalRef }"
    generatedTree: universe.Tree = ...

    scala> toolbox.eval(generatedTree)
    2
    res2: Any = 2

In the example the definition of `val x = 2` shadows the binding from `x` to `val x = 1` established in the original tree, changing the semantics of `originalRef` in generated code. In this simple example, shadowing is quite easy to follow, however in elaborate macros it can easy get out of hand.

To avoid these issues, there's a battle-tested workaround from the times of early Lisp - having a function that creates unique names to be used in generated code. In Lisp parlance it's called gensym, whereas in Scala we call it freshName. Quasiquotes are particularly nice here, because they allow unquoting of generated names directly into generated code.

There's a bit of a mixup in our API, though. There is an internal API `internal.reificationSupport.freshTermName/freshTypeName` available in both compile-time and runtime universes, however only at compile-time there's a pretty public facade for it, called `c.freshName`. We plan to fix this in Scala 2.12.

    scala> val xfresh = universe.internal.reificationSupport.freshTermName("x$")
    xfresh: universe.TermName = x$1

    scala> val generatedTree = q"$originalDefn; { val $xfresh = 2; println($xfresh); $originalRef }"
    generatedTree: universe.Tree = ...

    scala> toolbox.eval(generatedTree)
    2
    res2: Any = 1


