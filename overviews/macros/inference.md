---
layout: overview-large
title: Inference-Driving Macros

disqus: true

partof: macros
num: 7
outof: 7
languages: [ja]
---
<span class="label important" style="float: right;">MACRO PARADISE</span>

**Eugene Burmako**

Inference-driving macros are pre-release features included in so-called macro paradise, an experimental branch in the official Scala repository. Follow the instructions at the ["Macro Paradise"](/overviews/macros/paradise.html) page to download and use our nightly builds.

## A motivating example

The use case, which gave birth to inference-driving macros, is provided by Miles Sabin and his [shapeless](https://github.com/milessabin/shapeless) library. Miles has defined the `Iso` trait, which represents isomorphisms between types.

    trait Iso[T, U] {
      def to(t : T) : U
      def from(u : U) : T
    }

Currently instances of `Iso` are defined manually and then published as implicit values. Methods, which want to make use of
defined isomorphisms, declare implicit parameters of type `Iso`, which then get filled in during implicit search.

    def foo[C](c: C)(implicit iso: Iso[C, L]): L = iso.from(c)

    case class Foo(i: Int, s: String, b: Boolean)
    implicit val fooIsoTuple = Iso.tuple(Foo.apply _, Foo.unapply _)

    val tp  = foo(Foo(23, "foo", true))
    tp : (Int, String, Boolean)
    tp == (23, "foo", true)

As we can see, the isomorphism between a case class and a tuple is trivial (actually, shapeless uses Iso's to convert between case
classes and HLists, but for simplicity let's use tuples). The compiler already generates the necessary methods,
and we just have to make use of them. Unfortunately in Scala 2.10.0 it's impossible to simplify this even further - for every case class
you have manually define an implicit `Iso` instance.

The real showstopper is the fact that when typechecking applications of methods like `foo`, scalac has to infer the type argument `L`,
which it has no clue about (and that's no wonder, since this is domain-specific knowledge). As a result, even if you define an implicit
macro, which synthesizes `Iso[C, L]`, scalac will helpfully infer `L` as `Nothing` before expanding the macro and then everything crumbles.

## The proposed solution

As demonstrated by [https://github.com/scala/scala/pull/2499](https://github.com/scala/scala/pull/2499), the solution to the outlined
problem is extremely simple and elegant. <span class="label success">NEW</span>

In 2.10 we don't allow macro applications to expand until all their type arguments are inferred. However we don't have to do that.
The typechecker can infer as much as it possibly can (e.g. in the running example `C` will be inferred to `Foo` and
`L` will remain uninferred) and then stop. After that we expand the macro and then proceed with type inference using the type of the
expansion to help the typechecker with previously undetermined type arguments.

An illustration of this technique in action can be found in our [files/run/t5923c](https://github.com/scalamacros/kepler/tree/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923c) tests.
Note how simple everything is. The `materializeIso` implicit macro just takes its first type argument and uses it to produce an expansion.
We don't need to make sense of the second type argument (which isn't inferred yet), we don't need to interact with type inference -
everything happens automatically.

Please note that there is [a funny caveat](https://github.com/scalamacros/kepler/blob/7b890f71ecd0d28c1a1b81b7abfe8e0c11bfeb71/test/files/run/t5923a/Macros_1.scala)
with Nothings that we plan to address later.

## Internals of type inference (deprecated)

From what I learned about this over a few days, type inference in Scala is performed by the following two methods
in `scala/tools/nsc/typechecker/Infer.scala`: [`inferExprInstance`](https://github.com/scalamacros/kepler/blob/d7b59f452f5fa35df48a5e0385f579c98ebf3555/src/compiler/scala/tools/nsc/typechecker/Infer.scala#L1123) and
[`inferMethodInstance`](https://github.com/scalamacros/kepler/blob/d7b59f452f5fa35df48a5e0385f579c98ebf3555/src/compiler/scala/tools/nsc/typechecker/Infer.scala#L1173).
So far I have nothing to say here other than showing `-Yinfer-debug` logs of various code snippets, which involve type inference.

    def foo[T1](x: T1) = ???
    foo(2)

    [solve types] solving for T1 in ?T1
    [infer method] solving for T1 in (x: T1)Nothing based on (Int)Nothing (solved: T1=Int)

    def bar[T2] = ???
    bar

    [solve types] solving for T2 in ?T2
    inferExprInstance {
      tree      C.this.bar[T2]
      tree.tpe  Nothing
      tparams   type T2
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }

    class Baz[T]
    implicit val ibaz = new Baz[Int]
    def baz[T3](implicit ibaz: Baz[T3]) = ???
    baz

    [solve types] solving for T3 in ?T3
    inferExprInstance {
      tree      C.this.baz[T3]
      tree.tpe  (implicit ibaz: C.this.Baz[T3])Nothing
      tparams   type T3
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }
    inferExprInstance/AdjustedTypeArgs {
      okParams
      okArgs
      leftUndet  type T3
    }
    [infer implicit] C.this.baz[T3] with pt=C.this.Baz[T3] in class C
    [search] C.this.baz[T3] with pt=C.this.Baz[T3] in class C, eligible:
      ibaz: => C.this.Baz[Int]
    [search] considering T3 (pt contains ?T3) trying C.this.Baz[Int] against pt=C.this.Baz[T3]
    [solve types] solving for T3 in ?T3
    [success] found SearchResult(C.this.ibaz, TreeTypeSubstituter(List(type T3),List(Int))) for pt C.this.Baz[=?Int]
    [infer implicit] inferred SearchResult(C.this.ibaz, TreeTypeSubstituter(List(type T3),List(Int)))

    class Qwe[T]
    implicit def idef[T4] = new Qwe[T4]
    def qwe[T4](implicit xs: Qwe[T4]) = ???
    qwe

    [solve types] solving for T4 in ?T4
    inferExprInstance {
      tree      C.this.qwe[T4]
      tree.tpe  (implicit xs: C.this.Qwe[T4])Nothing
      tparams   type T4
      pt        ?
      targs     Nothing
      tvars     =?Nothing
    }
    inferExprInstance/AdjustedTypeArgs {
      okParams
      okArgs
      leftUndet  type T4
    }
    [infer implicit] C.this.qwe[T4] with pt=C.this.Qwe[T4] in class C
    [search] C.this.qwe[T4] with pt=C.this.Qwe[T4] in class C, eligible:
      idef: [T4]=> C.this.Qwe[T4]
    [solve types] solving for T4 in ?T4
    inferExprInstance {
      tree      C.this.idef[T4]
      tree.tpe  C.this.Qwe[T4]
      tparams   type T4
      pt        C.this.Qwe[?]
      targs     Nothing
      tvars     =?Nothing
    }
    [search] considering T4 (pt contains ?T4) trying C.this.Qwe[Nothing] against pt=C.this.Qwe[T4]
    [solve types] solving for T4 in ?T4
    [success] found SearchResult(C.this.idef[Nothing], ) for pt C.this.Qwe[=?Nothing]
    [infer implicit] inferred SearchResult(C.this.idef[Nothing], )
    [solve types] solving for T4 in ?T4
    [infer method] solving for T4 in (implicit xs: C.this.Qwe[T4])Nothing based on (C.this.Qwe[Nothing])Nothing (solved: T4=Nothing)

## Previously proposed solution (deprecated)

It turns out that it's unnecessary to introduce a low-level hack in the type inference mechanism.
As outlined above, there is a much more elegant and powerful solution <span class="label success">NEW</span>.

Using the infrastructure provided by [macro bundles](/overviews/macros/bundles.html) (in principle, we could achieve exactly the same
thing using the traditional way of defining macro implementations, but that's not important here), we introduce the `onInfer` callback,
which macros can define to be called by the compiler from `inferExprInstance` and `inferMethodInstance`. The callback takes a single
parameter of type `c.TypeInferenceContext`, which encapsulates the arguments of `inferXXX` methods and provides methods to infer
unknown type parameters.

    trait Macro {
      val c: Context
      def onInfer(tc: c.TypeInferenceContext): Unit = tc.inferDefault()
    }

    type TypeInferenceContext <: TypeInferenceContextApi
    trait TypeInferenceContextApi {
      def tree: Tree
      def unknowns: List[Symbol]
      def expectedType: Type
      def actualType: Type

      // TODO: can we get rid of this couple?
      def keepNothings: Boolean
      def useWeaklyCompatible: Boolean

      def infer(sym: Symbol, tpe: Type): Unit

      // TODO: would be lovely to have a different signature here, namely:
      // def inferDefault(sym: Symbol): Type
      // so that the macro can partially rely on out-of-the-box inference
      // and infer the rest afterwards
      def inferDefault(): Unit
    }

With this infrastructure in place, we can write the `materializeIso` macro, which obviates the need for manual declaration of implicits.
The full source code is available in [paradise/macros](https://github.com/scalamacros/kepler/blob/paradise/macros/test/files/run/macro-programmable-type-inference/Impls_Macros_1.scala), here's the relevant excerpt:

    override def onInfer(tic: c.TypeInferenceContext): Unit = {
      val C = tic.unknowns(0)
      val L = tic.unknowns(1)
      import c.universe._
      import definitions._
      val TypeRef(_, _, caseClassTpe :: _ :: Nil) = tic.expectedType // Iso[Test.Foo,?]
      tic.infer(C, caseClassTpe)
      val fields = caseClassTpe.typeSymbol.typeSignature.declarations.toList.collect{ case x: TermSymbol if x.isVal && x.isCaseAccessor => x }
      val core = (TupleClass(fields.length) orElse UnitClass).asType.toType
      val tequiv = if (fields.length == 0) core else appliedType(core, fields map (_.typeSignature))
      tic.infer(L, tequiv)
    }
