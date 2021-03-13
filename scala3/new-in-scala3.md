---
layout: singlepage-overview
title: New in Scala 3
languages: ["ja"]
---
The upcoming, exciting new version of Scala 3 brings many improvements and
new features. Here we provide you with a quick overview of the most important
changes. If you want to dig deeper, there are a few references at your disposal:

- The [Scala 3 Book]({% link _overviews/scala3-book/introduction.md %}) targets developers new to the Scala language.
- The [Syntax Summary][syntax-summary] provides you with a formal description of the new syntax.
- The [Language Reference][reference] gives a detailed description of the changes from Scala 2 to Scala 3.
- The [Migration Guide][migration] provides you with all of the information necessary to move from Scala 2 to Scala 3.

## What's new in Scala 3
Scala 3 is a complete overhaul of the Scala language. At its core, many aspects
of the type-system have been change to be more principled. While this also
brings exciting new features along (like union types), first and foremost, it
means that the type-system gets (even) less in your way and for instance
[type-inference][type-inference] and overload resolution are much improved.

### New & Shiny: The Syntax
Besides many (minor) cleanups, the Scala 3 syntax offers the following  improvements:

- A new "quiet" syntax for control structures like `if`, `while`, and `for` ([new control syntax][syntax-control])
- The `new` keyword is optional (_aka_ [creator applications][creator])
- [Optional braces][syntax-indentation] that supports a distraction-free, indentation sensitive style of programming
- Change of [type-level wildcards][syntax-wildcard] from `_` to `?`.
- Implicits (and their syntax) have been [heavily revised][implicits].

### Opinionated: Contextual Abstractions
One underlying core concept of Scala was (and still is to some degree) to
provide users with a small set of powerful features that can be combined to
great (and sometimes even unforeseen) expressivity. For example, the feature of _implicits_
has been used to model contextual abstraction, to express type-level
computation, model type-classes, perform implicit coercions, encode
extension methods, and many more.
Learning from these use cases, Scala 3 takes a slightly different approach
and focuses on **intent** rather than **mechanism**.
Instead of offering one very powerful feature, Scala 3 offers multiple
tailored language features, allowing programmers to directly express their intent:

- **Abtracting over contextual information**. [Using clauses][contextual-using] allow programmers to abstract over information that is available in the calling context and should be passed implicitly. As an improvement over Scala 2 implicits, using clauses can be specified by type, freeing function signatures from term variable names that are never explicitly referred to.

- **Providing Type-class instances**. [Given instances][contextual-givens] allow programmers to define the _canonical value_ of a certain type. This makes programming with type-classes more straightforward without leaking implementation details.

- **Retroactively extending classes**. In Scala 2, extension methods had to be encoded using implicit conversions or implicit classes. In contrast, in Scala 3 [extension methods][contextual-extension] are now directly built into the language, leading to better error messages and improved type inference.

- **Viewing one type as another**. Implicit conversion have been [redesigned][contextual-conversions] from the ground up as instances of a type-class `Conversion`.

- **Higher-order contextual abstractions**. The _all-new_ feature of [context functions][contextual-functions] makes contextual abstractions a first-class citizen. They are an important tool for library authors and allow to express concise domain specific languages.

- **Actionable feedback from the compiler**. In case an implicit parameter can not be resolved by the compiler, it now provides you [import suggestions](https://www.scala-lang.org/blog/2020/05/05/scala-3-import-suggestions.html) that may fix the problem.

### Say What You Mean: Type System Improvements
Besides greatly improved type inference, the Scala 3 type system also offers many new features, giving you powerful tools to statically express invariants in the types:

- **Enumerations**. [Enums][enums] have been redesigned to blend well with case classes and form the new standard to express [algebraic data types][enums-adts].

- **Opaque Types**. Hide implementation details behind [opaque type aliases][types-opaque] without paying for it in performance! Opaque types supersede value classes and allow you to set up an abstraction barrier without causing additional boxing overhead.

- **Intersection and union types**. Basing the type system on new foundations led to the introduction of new type system features: instances of a [intersection types][types-intersection], like `A & B`, are instances of _both_ `A` and of `B`. Instances of [union types][types-union], like `A | B`, are instances of _either_ `A` or `B`. Both constructs allow programmers to flexibly express type constraints outside of the inheritance hierarchy.

- **Dependent function types**. Scala 2 already allowed return types to depend on (value) arguments. In Scala 3 it is now possible to abstract over this pattern and express [dependent function types][types-dependent]. In the type `type F = (e: Entry) => e.Key`  the result type _depends_ on the argument!

- **Polymorphic function types**. Like with dependent function types, Scala 2 supported methods that allow type parameters, but does not allow programmers to abstract over those methods. In Scala 3, [polymorphic function types][types-polymorphic] like `[A] => List[A] => List[A]` can abstract over functions that take _type arguments_ in addition to their value arguments.

- **Type lambdas**. What needed to be expressed using a [compiler plugin](https://github.com/typelevel/kind-projector) in Scala 2 is now a first-class feature in Scala 3: Type lambdas are type level functions that can be pass as (higher-kinded) type arguments without requiring an auxiliary type definition.

- **Match types**. Instead of encoding type-level computation using implicit resolution, Scala 3 offers direct support for [matching on types][types-match]. Integrating type-level computation into the type checker enables improved error messages and removes the need for complicated encodings.


### Re-envisioned: Object-Oriented Programming
Scala has always been at the frontier between functional programming and object-oriented programming --
and Scala 3 pushes boundaries in both directions! The above mentioned type system changes and the redesign of contextual abstractions make _functional programming_ easier than before.
At the same time, the following novel features enable well-structured _object-oriented designs_ and support best practices.

- **Pass it on**. Traits move closer to classes and now can also take [parameters][oo-trait-parameters], making them even more powerful as a tool for modular software decomposition.
- **Plan for extension**. Extending classes that are not intended for extension is a long standing problem in object-oriented design. To address this issue, [open classes][oo-open] require library designers to _explicitly_ mark classes as open.
- **Hide implementation details**. Utility traits that implement behavior sometimes should not be part of inferred types. In Scala 3, those traits can be marked as [transparent][oo-transparent] hiding the inheritance from the user (in inferred types).
- **Composition over inheritance**. This phrase is often cited, but tedious to implement. Not so with Scala 3's [export clauses][oo-export]: symmetric to imports, export clauses allow to define aliases for selected members of an object.
- **No more NPEs**. Scala 3 is safer than ever: [explicit null][oo-explicit-null] moves `null` out of the type hierarchy, helping you to catch errors statically; additional checks for [safe initialization][oo-safe-init] detect access to uninitialized objects.


### Batteries Included: Metaprogramming
While macros in Scala 2 were an experimental feature only, Scala 3 comes with a powerful arsenal of tools for metaprogramming.
The [macro tutorial]({% link _overviews/scala3-macros/index.md %}) contains detailed information on the different facilities. In particular, Scala 3 offers the following features for metaprogramming.

- **Inline**. As the basic starting point, the [inline feature][meta-inline] allows values and methods to be reduced at compile time. This simple feature already covers many use-cases and at the same time provides the entry point for more advanced features.
- **Compile-time operations**. The package [`scala.compiletime`][meta-compiletime] contains additional functionality that can be used to implement inline methods.
- **Quoted code blocks**. Scala 3 adds the new feature of [quasi-quotation][meta-quotes] for code, providing a convenient high-level interface to construct and analyse code. Constructing code for adding one and one is as easy as `'{ 1 + 1 }`.
- **Reflection API**. For more advanced use cases [TASTy reflect][meta-reflection] provides more detailed control to inspect and generate program trees.

If you want to learn more about meta programming in Scala 3, we invite you to take our [tutorial][meta-tutorial].


[enums]: {{ site.scala3ref }}/enums/enums.html
[enums-adts]: {{ site.scala3ref }}/enums/adts.html

[types-intersection]: {{ site.scala3ref }}/new-types/intersection-types.html
[types-union]: {{ site.scala3ref }}/new-types/union-types.html
[types-dependent]: {{ site.scala3ref }}/new-types/dependent-function-types.html
[types-lambdas]: {{ site.scala3ref }}/new-types/type-lambdas.html
[types-polymorphic]: {{ site.scala3ref }}/new-types/polymorphic-function-types.html
[types-match]: {{ site.scala3ref }}/new-types/match-types.html
[types-opaque]: {{ site.scala3ref }}/other-new-features/opaques.html

[type-inference]: {{ site.scala3ref }}/changed-features/type-inference.html
[overload-resolution]: {{ site.scala3ref }}/changed-features/overload-resolution.html
[reference]: {{ site.scala3ref }}/overview.html
[creator]: {{ site.scala3ref }}/other-new-features/creator-applications.html
[migration]: https://scalacenter.github.io/scala-3-migration-guide

[implicits]: {{ site.scala3ref }}/contextual/motivation.html
[contextual-using]: {{ site.scala3ref }}/contextual/using-clauses.html
[contextual-givens]: {{ site.scala3ref }}/contextual/givens.html
[contextual-extension]: {{ site.scala3ref }}/contextual/extension-methods.html
[contextual-conversions]: {{ site.scala3ref }}/contextual/conversions.html
[contextual-functions]: {{ site.scala3ref }}/contextual/context-functions.html

[syntax-summary]: {{ site.scala3ref }}/syntax.html
[syntax-control]: {{ site.scala3ref }}/other-new-features/control-syntax.html
[syntax-indentation]: {{ site.scala3ref }}/other-new-features/indentation.html
[syntax-wildcard]: {{ site.scala3ref }}/changed-features/wildcards.html

[meta-tutorial]: {% link _overviews/scala3-macros/index.md %}
[meta-inline]: {% link _overviews/scala3-macros/tutorial/inline.md %}
[meta-compiletime]: {% link _overviews/scala3-macros/tutorial/compiletime.md %}
[meta-quotes]: {% link _overviews/scala3-macros/tutorial/quotes.md %}
[meta-reflection]: {% link _overviews/scala3-macros/tutorial/reflection.md %}

[oo-explicit-null]: {{ site.scala3ref }}/other-new-features/explicit-nulls.html
[oo-safe-init]: {{ site.scala3ref }}/other-new-features/safe-initialization.html
[oo-trait-parameters]: {{ site.scala3ref }}/other-new-features/trait-parameters.html
[oo-open]: {{ site.scala3ref }}/other-new-features/open-classes.html
[oo-transparent]: {{ site.scala3ref }}/other-new-features/transparent-traits.html
[oo-export]: {{ site.scala3ref }}/other-new-features/export.html
