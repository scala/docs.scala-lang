---
layout: overview-large
title: Changes in Scala 2.11

disqus: true

partof: macros
num: 13
outof: 13
languages: [ko]
---

<span class="label warning" style="float: right;">EXPERIMENTAL</span>

**Eugene Burmako**

This document lists all major changes to reflection and macros during the development cycle of Scala 2.11.0. First, we provide summaries of the most important fixes and newly introduced features, and then, later in the document, we explain how these changes are going to affect compatibility with Scala 2.10.x, and how it's possible to make your reflection-based code work in both 2.10.x and 2.11.0.

### Quasiquotes

Quasiquotes is the single most impressive upgrade for reflection and macros in Scala 2.11.0. Implemented by Denys Shabalin, they have significantly simplified the life of Scala metaprogrammers around the globe. Visit [the dedicated documentation page](/overviews/quasiquotes/intro.html) to learn more about quasiquotes.

### New macro powers

1) **[Fundep materialization](http://docs.scala-lang.org/overviews/macros/implicits.html#fundep_materialization)**. Since Scala 2.10.2, implicit whitebox macros can be used to materialize instances of type classes, however such materialized instances can't guide type inference. In Scala 2.11.0, materializers can also affect type inference, helping scalac to infer type arguments for enclosing method applications, something that's used with great success in Shapeless. Even more, with the fix of [SI-3346](https://issues.scala-lang.org/browse/SI-3346), this inference guiding capability can affect both normal methods and implicit conversions alike. Please note, however, that fundep materialization doesn't let one change how Scala's type inference works, but merely provides a way to throw more type constraints into the mix, so it's, for example, impossible to make type inference flow from right to left using fundep materializers.

2) **[Extractor macros](https://github.com/paulp/scala/commit/84a335916556cb0fe939d1c51f27d80d9cf980dc)**. A prominent new feature in Scala 2.11.0 is [name-based extractors](https://github.com/scala/scala/pull/2848) implemented by Paul Phillips. And as usual, when there's a Scala feature, it's very likely that macros can make use of it. Indeed, with the help of structural types, whitebox macros can be used to write extractors than refine the types of extractees on case-by-case basis. This is the technique that we use internally to implement quasiquotes.

3) **[Named and default arguments in macros](https://github.com/scala/scala/pull/3543)**. This is something that strictly speaking shouldn't belong to this changelog, because this feature was reverted shortly after being merged into Scala 2.11.0-RC1 due to a tiny mistake that led to a regression, but we've got a patch that makes the macro engine understand named/default arguments in macro applications. Even though the code freeze won't let us bring this change in Scala 2.11.0, we expect to merge it in Scala 2.11.1 at an earliest opportunity.

4) **[Type macros](http://docs.scala-lang.org/overviews/macros/typemacros.html) and [macro annotations](http://docs.scala-lang.org/overviews/macros/annotations.html)**. Neither type macros, not macro annotations are included of Scala 2.11.0. It is highly unlikely that type macros will ever be included in Scala, but we still deliberate on macro annotations. However, macro annotations are available both for Scala 2.10.x and for Scala 2.11.0 via the [macro paradise plugin](http://docs.scala-lang.org/overviews/macros/annotations.html).

5) **@compileTimeOnly**. Standard library now features a new `scala.annotations.compileTimeOnly` annotation that tells scalac that its annottees should not be referred to after type checking (which includes macro expansion). The main use case for this annotation is marking helper methods that are only supposed be used only together with an enclosing macro call to indicate parts of arguments of that macro call that need special treatment (e.g. `await` in scala/async or `value` in sbt's new macro-based DSL). For example, scala/async's `await` marked as `@compileTimeOnly` only makes sense inside an `async { ... }` block that compiles it away during its transformation, and using it outside of `async` is a compile-time error thanks to the new annotation.

### Changes to the macro engine

6) **[Blackbox/whitebox separation](http://docs.scala-lang.org/overviews/macros/blackbox-whitebox.html)**. Macros whose macro implementations use `scala.reflect.macros.blackbox.Context` (new in Scala 2.11.0) are called blackbox, have reduced power in comparison to macros in 2.10.x, better support in IDEs and better perspectives in becoming part of Scala. Macros whose macro implementations use `scala.reflect.macros.whitebox.Context` (new in Scala 2.11.0) or `scala.reflect.macros.Context` (the only context in Scala 2.10.x, deprecated in Scala 2.11.0) are called whitebox and have at least the same power as macros in 2.10.x.

7) **[Macro bundles](http://docs.scala-lang.org/overviews/macros/bundles.html)**. It is well-known that path-dependent nature of the current reflection API (that's there in both Scala 2.10.x and Scala 2.11.0) makes it difficult to modularize macros. There are [design patterns](http://docs.scala-lang.org/overviews/macros/overview.html#writing_bigger_macros) that help to overcome this difficulty, but that just leads to proliferation of boilerplate. One of the approaches to dealing with this problem is doing away with cakes altogether, and that's what we're pursing in Project Palladium, but that was too big of a change to pull off in Scala 2.11.0, so we've come up with a workaround that would alleviate the problem until the real solution arrives. Macro bundles are classes that have a single public field of type `Context` and any public method inside a bundle can be referred to as a macro implementation. Such macro implementations can then easily call into other methods of the same class or its superclasses without having to carry the context around, because the bundle already carries the context that everyone inside it can see and refer to. This significantly simplifies writing and maintaining complex macros.

8) **Relaxed requirements for signatures of macro implementations**. With the advent of quasiquotes, reify is quickly growing out of favor as being too clunky and inflexible. To recognize that we now allow both arguments and return types of macro implementations to be of type `c.Tree` rather than `c.Expr[Something]`. There's no longer a need to write huge type signatures and then spend time and lines of code trying to align your macro implementations with those types. Just take trees in and return trees back - the boilerplate is gone.

9) **Inference of macro def return types is being phased out**. Given the new scheme of things, where macro implementations can return `c.Tree` instead of `c.Expr[Something]`, it's no longer possible to robustly infer return types of macro defs from return types of macro impls (if a macro impl returns `c.Tree`, what's going to be the type of that tree then?). Therefore, we're phasing out this language mechanism. Macro impls that return `c.Expr[T]` can still be used to infer return types of their macro defs, but that will produce a deprecation warning, whereas trying to use macro impls that return `c.Tree` to infer the return type of a macro def will lead to a compilation error.

10) **[Changes to how macro expansions typecheck](https://github.com/scala/scala/pull/3495)**. In Scala 2.10.x, macro expansions were typechecked twice: first against the return type of the corresponding macro def (so called innerPt) and second against expected type derived from the enclosing program (so called outerPt). This led to certain rare issues, when the return type misguided type inference and macro expansions ended up having imprecise types. In Scala 2.11.0, the typechecking scheme is changed. Blackbox macros are still typechecked against innerPt and then outerPt, but whitebox macros are first typed without any expected type (i.e. against WildcardType), and only then against innerPt and outerPt.

11) **Duplication of everything that comes in and goes out**. Unfortunately, data structures central to the reflection API (trees, symbols, types) are either mutable themselves or are transitively mutable. This makes the APIs brittle as it's easy to inadvertently change someone's state in ways that are going to be incompatible with its future clients. We don't have a complete solution for that yet, but we've applied a number of safeguards to our macro engine to somewhat contain the potential for mutation. In particular, we now duplicate all the arguments and return values of macro implementations, as well as all the ins and outs of possibly mutating APIs such as `Context.typeCheck`.

### Changes to the reflection API

12) **[Introduction of Universe.internal and Context.internal](https://github.com/xeno-by/scala/commit/114c99691674873393223a11a9aa9168c3f41d77)**. Feedback from the users of the Scala 2.10.x reflection API has given us two important insights. First, certain functionality that we exposed was too low-level and were very out of place in the public API. Second, certain low-level functionality was very important in getting important macros operational. In order to somewhat resolve the tension created by these two development vectors, we've created internal subsections of the public APIs that are: a) clearly demarcated from the blessed parts of the reflection API, b) available to those who know what they are doing and want to implement practically important use cases that we want to support. Follow migration and compatibility notes in the bottom of the document to learn more.

13) **[Thread safety for runtime reflection](http://docs.scala-lang.org/overviews/reflection/thread-safety.html)**. The most pressing problem in reflection for Scala 2.10.x was its thread unsafety. Attempts to use runtime reflection (e.g. type tags) from multiple threads resulted in weird crashes documented above. We believe to have fixed this problem in Scala 2.11.0-RC1 by introducing a number of locks in critical places of our implementation. On the one hand, the strategy we are using at the moment is sub-optimal in the sense that certain frequently used operations (such as `Symbol.typeSignature` or `TypeSymbol.typeParams`) are hidden behind a global lock, but we plan to optimize that in the future. On the other hand, most of the typical APIs (e.g. `Type.members` or `Type.<:<`) either use thread-local state or don't require synchronization at all, so it's definitely worth a try.

14) **[Type.typeArgs](https://github.com/xeno-by/scala/commit/0f4e95574081bd9a945fb5b32d157a32af840cd3)**. It is now dead simple to obtain type arguments of a given type. What required a pattern match in Scala 2.10.x is now a simple method invocation. The `typeArgs` method is also joined by `typeParams`, `paramLists`, and `resultType`, making it very easy to perform common type inspection tasks.

15) **[symbolOf[T]](https://issues.scala-lang.org/browse/SI-8194)**. Scala 2.11.0 introduces a shortcut for a very common `typeOf[T].typeSymbol` operation, making it easier to figure out metadata (annotations, flags, visibility, etc) of given classes and objects.

16) **[knownDirectSubclasses is deemed to be officially broken](https://issues.scala-lang.org/browse/SI-7046)**. A lot of users who tried to traverse sealed hierarchies of classes have noticed that `ClassSymbol.knownDirectSubclasses` only works if invocations of their macros come after the definitions of those hierarchies in Scala's compilation order. For instance, if a sealed hierarchy is defined in the bottom of a source file, and a macro application is written in the top of the file, then knownDirectSubclasses will return an empty list. This is an issue that is deeply rooted in Scala's internal architecture, and we can't provide a fix for it in the near future.

17) **showCode**. Along with `Tree.toString` that prints Scala-ish source code and `showRaw(tree)` that prints internal structures of trees, we now have `showCode` that prints compileable Scala source code corresponding to the provided tree, courtesy of Vladimir Nikolaev, who's done an amazing work of bringing this to life. We plan to eventually replace `Tree.toString` with `showCode`, but in Scala 2.11.0 these are two different methods.

18) **[It is now possible to typecheck in type and pattern modes](https://issues.scala-lang.org/browse/SI-6814)**. A very convenient `Context.typeCheck` and `ToolBox.typeCheck` functionality of Scala 2.10.x had a significant inconvenience - it only worked for expressions, and typechecking something as a type or as a pattern required building dummy expressions. Now `typeCheck` has the mode parameter that take case of that difficulty.

19) **[Reflective invocations now support value classes](https://github.com/scala/scala/pull/3409)**. Runtime reflection now correctly deals with value classes in parameters of methods and constructors and also correctly unboxes and boxes inputs and outputs to reflective invocations such as `FieldMirror.get`, `FieldMirror.set` and `MethodMirror.apply`.

20) **[Reflective invocations have become faster](https://github.com/scala/scala/pull/1821)**. With the help of the newly introduced `FieldMirror.bind` and `MethodMirror.bind` APIs, it is now possible to quickly create new mirrors from pre-existing ones, avoiding the necessity to undergo costly mirror initialization. In our tests, invocation-heavy scenarios exhibit up to 20x performance boosts thanks to these new APIs.

21) **Context.introduceTopLevel**. The `Context.introduceTopLevel` API, which used to be available in early milestone builds of Scala 2.11.0 as a stepping stone towards type macros, was removed from the final release, because type macros were rejected for including in Scala and discontinued in macro paradise.

### How to make your 2.10.x macros work in 2.11.0

22) **Blackbox/whitebox**. All macros in Scala 2.10.x are whitebox and will behave accordingly, being able to refine the advertised return type of their macro defs in their expansions. See the subsequent section of the document for information on how to make macros in Scala 2.10.x behave exactly like blackbox macros in Scala 2.11.0.

23) **Macro bundles**. Scala 2.11.0 now recognizes certain new shapes of references to macro implementations in right-hand sides of macro defs, and in some very rare situations this might change how existing code is compiled. First of all, no runtime behavior is going to be affected in this case - if a Scala 2.10.x macro def compiles in Scala 2.11.0, then it's going to bind to the same macro impl as before. Secondly, in some cases macro impl references might become ambiguous and fail compilation, but that should be fixable in a backward compatible fashion by simple renaming suggested by the error message.

24) **Inference of macro def return types**. In Scala 2.11.0, macro defs, whose return types are inferred from associated macro impls, will work consistently with Scala 2.10.x. A deprecation warning will be emitted for such macro defs, but no compilation errors or behavior discrepancies are going to happen.

25) **Changes to how macro expansions typecheck**. Scala 2.11.0 changes the sequence of expected types used to typecheck whitebox macro expansions (and since all macros in Scala 2.10.x are whitebox, they all can potentially be affected). In rare situations, when a Scala 2.10.x macro expansion relied on a specific shape of an expected type to get its type arguments inferred, it might stop working. In such cases, specifying such type arguments explicitly will fix the problem in a way compatible with both Scala 2.10.x and Scala 2.11.0: [example](https://github.com/milessabin/shapeless/commit/7b192b8d89b3654e58d7bac89427ebbcc5d5adf1#diff-c6aebd4b374deb66f0d5cdeff8484338L69).

26) **Duplication of everything that comes in and goes out**. In Scala 2.11.0, we consistently duplicate trees that cross boundaries between userland (macro implementation code) and kernel (compiler internals), limiting the scope of mutations of those trees. In extremely rare cases, Scala 2.10.x macros might be relying on such mutations to operate correctly. Such macros will be broken and will have to be rewritten. Don't worry much about this though, because we haven't yet encountered such macros in the wild, so it's most likely that your macros are going to be fine.

27) **Introduction of Universe.internal and Context.internal**. The following 51 APIs available in Scala 2.10.x have been moved into the `internal` submodule of the reflection cake. There are two ways of fixing these source incompatibilities. The easy one is writing `import compat._` after `import scala.reflect.runtime.universe._` or `import c.universe._`. The hard one is the easy one + applying all migration suggestions provided by deprecating warnings on methods imported from compat.

|                           |                                |                           |
| ------------------------- | ------------------------------ | ------------------------- |
| typeTagToManifest         | Tree.pos_=                     | Symbol.isSkolem           |
| manifestToTypeTag         | Tree.setPos                    | Symbol.deSkolemize        |
| newScopeWith              | Tree.tpe_=                     | Symbol.attachments        |
| BuildApi.setTypeSignature | Tree.setType                   | Symbol.updateAttachment   |
| BuildApi.flagsFromBits    | Tree.defineType                | Symbol.removeAttachment   |
| BuildApi.emptyValDef      | Tree.symbol_=                  | Symbol.setTypeSignature   |
| BuildApi.This             | Tree.setSymbol                 | Symbol.setAnnotations     |
| BuildApi.Select           | TypeTree.setOriginal           | Symbol.setName            |
| BuildApi.Ident            | Symbol.isFreeTerm              | Symbol.setPrivateWithin   |
| BuildApi.TypeTree         | Symbol.asFreeTerm              | captureVariable           |
| Tree.freeTerms            | Symbol.isFreeType              | referenceCapturedVariable |
| Tree.freeTypes            | Symbol.asFreeType              | capturedVariableType      |
| Tree.substituteSymbols    | Symbol.newTermSymbol           | singleType                |
| Tree.substituteTypes      | Symbol.newModuleAndClassSymbol | refinedType               |
| Tree.substituteThis       | Symbol.newMethodSymbol         | typeRef                   |
| Tree.attachments          | Symbol.newTypeSymbol           | intersectionType          |
| Tree.updateAttachment     | Symbol.newClassSymbol          | polyType                  |
| Tree.removeAttachment     | Symbol.isErroneous             | existentialAbstraction    |

28) **Official brokenness of knownDirectSubclasses**. There's nothing that can be done here from your side apart from being aware of limitations of that API. Macros that use `knownDirectSubclasses` will continue to work in Scala 2.11.0 exactly like they did in Scala 2.10.x, without any deprecation warnings.

29) **Deprecation of Context.enclosingTree-style APIs**. Existing enclosing tree macro APIs face both technical and philosophical problems, so we've made a hard decision to phase them out, deprecating them in Scala 2.11.0 and removing them in Scala 2.12.0. There's no direct replacement for these APIs, just the newly introduced c.internal.enclosingOwner that only covers a subset of their functionality. Follow the discussion at [https://github.com/scala/scala/pull/3354](https://github.com/scala/scala/pull/3354) for more information.

30) **Other deprecations**. Some of you have -Xfatal-warnings turned on in your builds, so any deprecation might fail compilation. This guide has covered all controversial deprecations, and the rest can be fixed by straightforwardly following deprecation messages.

31) **Removal of resetAllAttrs**. resetAllAttrs is a very dangerous API and shouldn't have been exposed in the first place. That's why we have removed it without going through a deprecation cycle. There is however a publicly available replacement called `resetLocalAttrs` that should be sufficient in almost all cases, and we recommend using it instead. In an exceptional case when `resetLocalAttrs` doesn't cut it, go for [https://github.com/scalamacros/resetallattrs](https://github.com/scalamacros/resetallattrs).

32) **Removal of isLocal**. `Symbol.isLocal` wasn't doing what is was advertising, and there was no way to fix it. Therefore we have removed it without any deprecation warnings and are recommending using `Symbol.isPrivateThis` and/or `Symbol.isProtectedThis` instead.

33) **Removal of isOverride**. Same story as with `Symbol.isLocal`. This method was broken beyond repair, which is why it was removed from the public API. `Symbol.allOverriddenSymbols` (or its newly introduced alias `Symbol.overrides`) should be used instead.

### How to make your 2.11.0 macros work in 2.10.x

34) **Quasiquotes**. We don't plan to release quasiquotes as part of the Scala 2.10.x distribution, but they can still be used in Scala 2.10.x by the virtue of the macro paradise plugin. Read [paradise documentation](http://docs.scala-lang.org/overviews/macros/paradise.html) to learn more about what's required to use the compiler plugin, what are the binary compatibility consequences and what are the support guarantees.

35) **Most of the new functionality doesn't have equivalents in 2.10.x**. We don't plan to backport any of the new functionality, e.g. fundep materialization or macro bundles, to Scala 2.10.x (except for maybe thread safety for runtime reflection). Consult [the roadmap of macro paradise for Scala 2.10.x](http://docs.scala-lang.org/overviews/macros/roadmap.html) to see what features are supported in paradise.

36) **Blackbox/whitebox**. If you're determined to have your macros blackbox, it's going to require additional effort to have those macros working consistently in both 2.10.x and 2.11.0, because in 2.10.x all macros are whitebox. First of all, make sure that you're not actually using any of [whitebox powers](http://docs.scala-lang.org/overviews/macros/blackbox-whitebox.html#codifying_the_distinction), otherwise you'll have to rewrite your macros first. Secondly, before returning from your macros impls, explicitly upcast the expansions to the type required by their macro defs. (Of course, none of this applies to whitebox macros. If don't mind your macros being whitebox, then you don't have to do anything to ensure cross-compatibility).

    object Macros {
      def impl(c: Context) = {
        import c.universe._
        q"new { val x = 2 }"
      }

      def foo: Any = macro impl
    }

    object Test extends App {
      // works in Scala 2.10.x and Scala 2.11.0 if foo is whitebox
      // doesn't work in Scala 2.11.0 if foo is blackbox
      println(Macros.foo.x)
    }

    object Macros {
      def impl(c: Context) = {
        import c.universe._
        q"(new { val x = 2 }): Any" // note the explicit type ascription
      }

      def foo: Any = macro impl
    }

    object Test extends App {
      // consistently doesn't work in Scala 2.10.x and Scala 2.11.0
      // regardless of whether foo is whitebox or blackbox
      println(Macros.foo.x)
    }

37) **@compileTimeOnly**. The `compileTimeOnly` annotation is secretly available in `scala-reflect.jar` as `scala.reflect.internal.compileTimeOnly` since Scala 2.10.1 (To the contrast, in Scala 2.11.0 `compileTimeOnly` lives in `scala-library.jar` under the name of `scala.annotations.compileTimeOnly`). If you don't mind the users of your API having to transitively depend on `scala-reflect.jar`, go ahead and use `compileTimeOnly` even in Scala 2.10.x - it will behave in the same fashion as in Scala 2.11.0.

38) **Changes to how macro expansions typecheck**. Scala 2.11.0 changes the sequence of expected types used to typecheck whitebox macro expansions (and since all macros in Scala 2.10.x are whitebox, they all can potentially be affected), which can theoretically cause type inference problems. This is unlikely to become a problem even when migrating from 2.10.x to 2.11.0, but going in reverse direction has almost non-existent chances of causing issues. If you encounter difficulties, then like with any type inference glitch, try providing an explicit type annotation by upcasting macro expansions to the type that you want.

39) **Introduction of Universe.internal and Context.internal**. Even though it's hard to imagine how this could work, it is possible to have a macro using internal APIs compileable with both Scala 2.10.x and 2.11.0. Big thanks to Jason Zaugg for showing us the way:

    // scala.reflect.macros.Context is available both in 2.10 and 2.11
    // in Scala 2.11.0 it is deprecated
    // and aliased to scala.reflect.macros.whitebox.Context
    import scala.reflect.macros.Context
    import scala.language.experimental.macros

    // provides a source compatibility stub
    // in Scala 2.10.x, it will make `import compat._` compile just fine,
    // even though `c.universe` doesn't have `compat`
    // in Scala 2.11.0, it will be ignored, becase `import c.universe._`
    // brings its own `compat` in scope and that one takes precedence
    private object HasCompat { val compat = ??? }; import HasCompat._

    object Macros {
      def impl(c: Context): c.Expr[Int] = {
        import c.universe._
        // enables Tree.setType that's been removed in Scala 2.11.0
        import compat._
        c.Expr[Int](Literal(Constant(42)) setType definitions.IntTpe)
      }

      def ultimateAnswer: Int = macro impl
    }

40) **Use macro-compat**. [Macro-compat](https://github.com/milessabin/macro-compat) is a small library which allows you to compile macros with Scala 2.10.x which are written to the Scala 2.11/2 macro API.  It brings to Scala 2.10: type aliases for the blackbox and whitebox Context types, support for macro bundles, forwarders for the 2.11 API and support for using Tree in the macro def type signatures.
