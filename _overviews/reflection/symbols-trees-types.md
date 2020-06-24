---
layout: multipage-overview
title: Symbols, Trees, and Types
partof: reflection
overview-name: Reflection

num: 3

languages: [ja]
permalink: /overviews/reflection/:title.html
---

<span class="label important" style="float: right;">EXPERIMENTAL</span>

## Symbols

Symbols are used to establish bindings between a name and the entity it refers
to, such as a class or a method. Anything you define and can give a name to in
Scala has an associated symbol.

Symbols contain all available information about the declaration of an entity
(`class`/`object`/`trait` etc.) or a member (`val`s/`var`s/`def`s etc.), and
as such are an integral abstraction central to both runtime reflection and
compile-time reflection (macros).

A symbol can provide a wealth of information ranging from the basic `name`
method available on all symbols to other, more involved, concepts such as
getting the `baseClasses` from `ClassSymbol`. Other common use cases of
symbols include inspecting members' signatures, getting type parameters of a
class, getting the parameter type of a method or finding out the type of a
field.

### The Symbol Owner Hierarchy

Symbols are organized in a hierarchy. For example, a symbol that represents a
parameter of a method is *owned* by the corresponding method symbol, a method
symbol is *owned* by its enclosing class, trait, or object, a class is *owned*
by a containing package and so on.

If a symbol does not have an owner, for example, because it refers to a top-level
entity, such as a top-level package, then its owner is the special
`NoSymbol` singleton object. Representing a missing symbol, `NoSymbol` is
commonly used in the API to denote an empty or default value. Accessing the
`owner` of `NoSymbol` throws an exception. See the API docs for the general
interface provided by type `Symbol`


### `TypeSymbol`s

A `TypeSymbol` represents type, class, and trait declarations, as well as type
parameters. Interesting members that do not apply to the more specific
`ClassSymbol`s, include `isAbstractType`, `isContravariant`, and
`isCovariant`.

- `ClassSymbol`: Provides access to all information contained in a class or trait declaration, e.g., `name`, modifiers (`isFinal`, `isPrivate`, `isProtected`, `isAbstractClass`, etc.), `baseClasses`, and `typeParams`.

### `TermSymbol`s

The type of term symbols representing val, var, def, and object declarations
as well as packages and value parameters.

- `MethodSymbol`: The type of method symbols representing def declarations (subclass of `TermSymbol`). It supports queries like checking whether a method is a (primary) constructor, or whether a method supports variable-length argument lists.
- `ModuleSymbol`: The type of module symbols representing object declarations. It allows looking up the class implicitly associated with the object definition via member `moduleClass`. The opposite look up is also possible. One can go back from a module class to the associated module symbol by inspecting its `selfType.termSymbol`.

### Symbol Conversions

There can be situations where one uses a method that returns an instance of
the general `Symbol` type. In cases like these, it's possible to convert the
more general `Symbol` type obtained to the specific, more specialized symbol
type needed.

Symbol conversions, such as `asClass` or `asMethod`, are used to convert to a
more specific subtype of `Symbol` as appropriate (if you want to use the
`MethodSymbol` interface, for example).

For example,

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> class C[T] { def test[U](x: T)(y: U): Int = ??? }
    defined class C

    scala> val testMember = typeOf[C[Int]].member(TermName("test"))
    testMember: scala.reflect.runtime.universe.Symbol = method test

In this case, `member` returns an instance of `Symbol`, not `MethodSymbol` as
one might expect. Thus, we must use `asMethod` to ensure that we obtain a
`MethodSymbol`

    scala> testMember.asMethod
    res0: scala.reflect.runtime.universe.MethodSymbol = method test

### Free symbols

The two symbol types `FreeTermSymbol` and `FreeTypeSymbol` have a special
status, in the sense that they refer to symbols whose available information is
not complete. These symbols are generated in some cases during reification
(see the corresponding section about reifying trees for more background).
Whenever reification cannot locate a symbol (meaning that the symbol is not
available in the corresponding class file, for example, because the symbol
refers to a local class), it reifies it as a so-called "free type", a
synthetic dummy symbol that remembers the original name and owner and has a
surrogate type signature that closely follows the original. You can check
whether a symbol is a free type by calling `sym.isFreeType`. You can also get
a list of all free types referenced by a tree and its children by calling
`tree.freeTypes`. Finally, you can get warnings when reification produces free
types by using `-Xlog-free-types`.

## Types

As its name suggests, instances of `Type` represent information about the type
of a corresponding symbol. This includes its members (methods, fields, type
aliases, abstract types, nested classes, traits, etc.) either declared
directly or inherited, its base types, its erasure and so on. Types also
provide operations to test for type conformance or equivalence.

### Instantiating Types

In general, there are three ways to instantiate a `Type`.

1. via method `typeOf` on `scala.reflect.api.TypeTags`, which is mixed into `Universe` (simplest and most common).
2. Standard Types, such as `Int`, `Boolean`, `Any`, or `Unit` are accessible through the available universe.
3. Manual instantiation using factory methods such as `typeRef` or `polyType` on `scala.reflect.api.Types`, (not recommended).

#### Instantiating Types With `typeOf`

To instantiate a type, most of the time, the
`scala.reflect.api.TypeTags#typeOf` method can be used. It takes a type
argument and produces a `Type` instance which represents that argument. For
example:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> typeOf[List[Int]]
    res0: scala.reflect.runtime.universe.Type = scala.List[Int]

In this example, a
`scala.reflect.api.Types$TypeRef`
is returned, which corresponds to the type constructor `List`, applied to
the type argument `Int`.

Note, however, that this approach requires one to specify by hand the type
we're trying to instantiate. What if we're interested in obtaining an instance
of `Type` that corresponds to some arbitrary instance? One can simply define a
method with a context bound on the type parameter-- this generates a
specialized `TypeTag` for us, which we can use to obtain the type of our
arbitrary instance:

    scala> def getType[T: TypeTag](obj: T) = typeOf[T]
    getType: [T](obj: T)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T])scala.reflect.runtime.universe.Type

    scala> getType(List(1,2,3))
    res1: scala.reflect.runtime.universe.Type = List[Int]

    scala> class Animal; class Cat extends Animal
    defined class Animal
    defined class Cat

    scala> val a = new Animal
    a: Animal = Animal@21c17f5a

    scala> getType(a)
    res2: scala.reflect.runtime.universe.Type = Animal

    scala> val c = new Cat
    c: Cat = Cat@2302d72d

    scala> getType(c)
    res3: scala.reflect.runtime.universe.Type = Cat

_Note:_ Method `typeOf` does not work for types with type parameters, such as
`typeOf[List[A]]` where `A` is a type parameter. In this case, one can use
`scala.reflect.api.TypeTags#weakTypeOf` instead. For more details, see the
[TypeTags]({{ site.baseurl }}/overviews/reflection/typetags-manifests.html)
section of this guide.

#### Standard Types

Standard types, such as `Int`, `Boolean`, `Any`, or `Unit`, are accessible through a universe's `definitions` member. For example:

    scala> import scala.reflect.runtime.universe
    import scala.reflect.runtime.universe

    scala> val intTpe = universe.definitions.IntTpe
    intTpe: scala.reflect.runtime.universe.Type = Int

The list of standard types is specified in trait `StandardTypes` in
[`scala.reflect.api.StandardDefinitions`](https://www.scala-lang.org/api/current/index.html#scala.reflect.api.StandardDefinitions$StandardTypes).

### Common Operations on Types

Types are typically used for type conformance tests or are queried for members.
The three main classes of operations performed on types are:

1. Checking the subtyping relationship between two types.
2. Checking for equality between two types.
3. Querying a given type for certain members or inner types.

#### Subtyping Relationships

Given two `Type` instances, one can easily test whether one is a subtype of
the other using `<:<` (and in exceptional cases, `weak_<:<`, explained below)

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> class A; class B extends A
    defined class A
    defined class B

    scala> typeOf[A] <:< typeOf[B]
    res0: Boolean = false

    scala> typeOf[B] <:< typeOf[A]
    res1: Boolean = true

Note that method `weak_<:<` exists to check for _weak conformance_ between two
types. This is typically important when dealing with numeric types.

Scala's numeric types abide by the following ordering (section 3.5.3 of the Scala language specification):

> In some situations Scala uses a more general conformance relation. A type S weakly conforms to a type T, written S <:w T, if S<:T or both S and T are primitive number types and S precedes T in the following ordering:

| Weak Conformance Relations |
| --- |
| `Byte` `<:w` `Short` |
| `Short` `<:w` `Int` |
| `Char` `<:w` `Int` |
| `Int` `<:w` `Long` |
| `Long` `<:w` `Float` |
| `Float` `<:w` `Double` |

For example, weak conformance is used to determine the type of the following if-expression:

    scala> if (true) 1 else 1d
    res2: Double = 1.0

In the if-expression shown above, the result type is defined to be the
_weak least upper bound_ of the two types (i.e., the least upper bound with
respect to weak conformance).

Thus, since `Double` is defined to be the least upper bound with respect to
weak conformance between `Int` and `Double` (according to the spec, shown
above), `Double` is inferred as the type of our example if-expression.

Note that method `weak_<:<` checks for _weak conformance_ (as opposed to `<:<`
which checks for conformance without taking into consideration weak
conformance relations in section 3.5.3 of the spec) and thus returns the
correct result when inspecting conformance relations between numeric types
`Int` and `Double`:

    scala> typeOf[Int] weak_<:< typeOf[Double]
    res3: Boolean = true

    scala> typeOf[Double] weak_<:< typeOf[Int]
    res4: Boolean = false

Whereas using `<:<` would incorrectly report that `Int` and `Double` do not
conform to each other in any way:

    scala> typeOf[Int] <:< typeOf[Double]
    res5: Boolean = false

    scala> typeOf[Double] <:< typeOf[Int]
    res6: Boolean = false

#### Type Equality

Similar to type conformance, one can easily check the _equality_ of two types.
That is, given two arbitrary types, one can use method `=:=` to see if both
denote the exact same compile-time type.

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> def getType[T: TypeTag](obj: T) = typeOf[T]
    getType: [T](obj: T)(implicit evidence$1: scala.reflect.runtime.universe.TypeTag[T])scala.reflect.runtime.universe.Type

    scala> class A
    defined class A

    scala> val a1 = new A; val a2 = new A
    a1: A = A@cddb2e7
    a2: A = A@2f0c624a

    scala> getType(a1) =:= getType(a2)
    res0: Boolean = true

Note that the _precise type info_ must be the same for both instances. In the
following code snippet, for example, we have two instances of `List`
with different type arguments.

    scala> getType(List(1,2,3)) =:= getType(List(1.0, 2.0, 3.0))
    res1: Boolean = false

    scala> getType(List(1,2,3)) =:= getType(List(9,8,7))
    res2: Boolean = true

Also important to note is that `=:=` should _always_ be used to compare types
for equality. That is, never use `==`, as it can't check for type equality in
the presence of type aliases, whereas `=:=` can:

    scala> type Histogram = List[Int]
    defined type alias Histogram

    scala> typeOf[Histogram] =:= getType(List(4,5,6))
    res3: Boolean = true

    scala> typeOf[Histogram] == getType(List(4,5,6))
    res4: Boolean = false

As we can see, `==` incorrectly reports that `Histogram` and `List[Int]` have
different types.

#### Querying Types for Members and Declarations

Given a `Type`, one can also _query_ it for specific members or declarations.
A `Type`'s _members_ include all fields, methods, type aliases, abstract
types, nested classes/objects/traits, etc. A `Type`'s _declarations_ are only
those members that were declared (not inherited) in the class/trait/object
definition which the given `Type` represents.

To obtain a `Symbol` for some specific member or declaration, one need only to use methods `members` or `decls` which provide the list of definitions associated with that type. There also exists singular counterparts for each, methods `member` and `decl` as well. The signatures of all four are shown below:

    /** The member with given name, either directly declared or inherited, an
      * OverloadedSymbol if several exist, NoSymbol if none exist. */
    def member(name: Universe.Name): Universe.Symbol

    /** The defined or declared members with name name in this type; an
      * OverloadedSymbol if several exist, NoSymbol if none exist. */
    def decl(name: Universe.Name): Universe.Symbol

    /** A Scope containing all members of this type
      * (directly declared or inherited). */
    def members: Universe.MemberScope // MemberScope is a type of
                                      // Traversable, use higher-order
                                      // functions such as map,
                                      // filter, foreach to query!

    /** A Scope containing the members declared directly on this type. */
    def decls: Universe.MemberScope // MemberScope is a type of
                                           // Traversable, use higher-order
                                           // functions such as map,
                                           // filter, foreach to query!

For example, to look up the `map` method of `List`, one can do:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> typeOf[List[_]].member(TermName("map"))
    res0: scala.reflect.runtime.universe.Symbol = method map

Note that we pass method `member` a `TermName`, since we're looking up a
method. If we were to look up a type member, such as `List`'s self type, `Self`, we
would pass a `TypeName`:

    scala> typeOf[List[_]].member(TypeName("Self"))
    res1: scala.reflect.runtime.universe.Symbol = type Self

We can also query all members or declarations on a type in interesting ways.
We can use method `members` to obtain a `Traversable` (`MemberScopeApi`
extends `Traversable`) of `Symbol`s representing all inherited or declared
members on a given type, which means that we can use popular higher-order
functions on collections like `foreach`, `filter`, `map`, etc., to explore our
type's members. For example, to print the members of `List` which are private,
one must simply do:

    scala> typeOf[List[Int]].members.filter(_.isPrivate).foreach(println _)
    method super$sameElements
    method occCounts
    class CombinationsItr
    class PermutationsItr
    method sequential
    method iterateUntilEmpty

## Trees

Trees are the basis of Scala's abstract syntax which is used to represent
programs. They are also called abstract syntax trees and commonly abbreviated
as ASTs.

In Scala reflection, APIs that produce or use trees are the following:

1. Scala annotations, which use trees to represent their arguments, exposed in `Annotation.scalaArgs` (for more, see the [Annotations]({{ site.baseurl }}/overviews/reflection/annotations-names-scopes.html) section of this guide).
2. `reify`, a special method that takes an expression and returns an AST that represents this expression.
3. Compile-time reflection with macros (outlined in the [Macros guide]({{ site.baseurl }}/overviews/macros/overview.html)) and runtime compilation with toolboxes both use trees as their program representation medium.

It's important to note that trees are immutable except for three fields--
`pos` (`Position`), `symbol` (`Symbol`), and `tpe` (`Type`), which are
assigned when a tree is typechecked.

### Kinds of `Tree`s

There are three main categories of trees:

1. **Subclasses of `TermTree`** which represent terms, _e.g.,_ method invocations are represented by `Apply` nodes, object instantiation is achieved using `New` nodes, etc.
2. **Subclasses of `TypTree`** which represent types that are explicitly specified in program source code, _e.g.,_ `List[Int]` is parsed as `AppliedTypeTree`. _Note_: `TypTree` is not misspelled, nor is it conceptually the same as `TypeTree`-- `TypeTree` is something different. That is, in situations where `Type`s are constructed by the compiler (_e.g.,_ during type inference), they can be wrapped in `TypeTree` trees and integrated into the AST of the program.
3. **Subclasses of `SymTree`** which introduce or reference definitions. Examples of the introduction of new definitions include `ClassDef`s which represent class and trait definitions, or `ValDef` which represent field and parameter definitions. Examples of the reference of existing definitions include `Ident`s which refer to an existing definition in the current scope such as a local variable or a method.

Any other type of tree that one might encounter are typically syntactic or
short-lived constructs. For example, `CaseDef`, which wraps individual match
cases; such nodes are neither terms nor types, nor do they carry a symbol.

### Inspecting Trees

Scala Reflection provides a handful of ways to visualize trees, all available
through a universe. Given a tree, one can:

- use methods `show` or `toString` which print pseudo-Scala code represented by the tree.
- use method `showRaw` to see the raw internal tree that the typechecker operates upon.

For example, given the following tree:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Ident(TermName("x")), TermName("$plus")), List(Literal(Constant(2))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2)

We can use method `show` (or `toString`, which is equivalent) to see what that
tree represents.

    scala> show(tree)
    res0: String = x.$plus(2)

As we can see, `tree` simply adds `2` to term `x`.

We can also go in the other direction. Given some Scala expression, we can
first obtain a tree, and then use method `showRaw` to see the raw internal
tree that the compiler and typechecker operate on. For example, given the
expression:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val expr = reify { class Flower { def name = "Rose" } }
    expr: scala.reflect.runtime.universe.Expr[Unit] = ...

Here, `reify` simply takes the Scala expression it was passed, and returns a
Scala `Expr`, which is simply wraps a `Tree` and a `TypeTag` (see the
[Expr]({{ site.baseurl }}/overviews/reflection/annotations-names-scopes.html)
section of this guide for more information about `Expr`s). We can obtain
the tree that `expr` contains by:

    scala> val tree = expr.tree
    tree: scala.reflect.runtime.universe.Tree =
    {
      class Flower extends AnyRef {
        def <init>() = {
          super.<init>();
          ()
        };
        def name = "Rose"
      };
      ()
    }

And we can inspect the raw tree by simply doing:

    scala> showRaw(tree)
    res1: String = Block(List(ClassDef(Modifiers(), TypeName("Flower"), List(), Template(List(Ident(TypeName("AnyRef"))), emptyValDef, List(DefDef(Modifiers(), termNames.CONSTRUCTOR, List(), List(List()), TypeTree(), Block(List(Apply(Select(Super(This(typeNames.EMPTY), typeNames.EMPTY), termNames.CONSTRUCTOR), List())), Literal(Constant(())))), DefDef(Modifiers(), TermName("name"), List(), List(), TypeTree(), Literal(Constant("Rose"))))))), Literal(Constant(())))

### Traversing Trees

After one understands the structure of a given tree, typically the next step
is to extract info from it. This is accomplished by _traversing_ the tree, and
it can be done in one of two ways:

- Traversal via pattern matching.
- Using a subclass of `Traverser`

#### Traversal via Pattern Matching

Traversal via pattern matching is the simplest and most common way to traverse
a tree. Typically, one traverses a tree via pattern matching when they are
interested in the state of a given tree at a single node. For example, say we
simply want to obtain the function and the argument of the only `Apply` node
in the following tree:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Ident(TermName("x")), TermName("$plus")), List(Literal(Constant(2))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2)

We can simply match on our `tree`, and in the case that we have an `Apply`
node, just return `Apply`'s  function and argument:

    scala> val (fun, arg) = tree match {
         |     case Apply(fn, a :: Nil) => (fn, a)
         | }
    fun: scala.reflect.runtime.universe.Tree = x.$plus
    arg: scala.reflect.runtime.universe.Tree = 2

We can achieve exactly the same thing a bit more concisely, by putting the
pattern match on the left-hand side:

    scala> val Apply(fun, arg :: Nil) = tree
    fun: scala.reflect.runtime.universe.Tree = x.$plus
    arg: scala.reflect.runtime.universe.Tree = 2

Note that `Tree`s can typically be quite complex, with nodes nested
arbitrarily deep within other nodes. A simple illustration would be if we were
to add a second `Apply` node to the above tree which serves to add `3` to our
sum:

    scala> val tree = Apply(Select(Apply(Select(Ident(TermName("x")), TermName("$plus")), List(Literal(Constant(2)))), TermName("$plus")), List(Literal(Constant(3))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2).$plus(3)

If we apply the same pattern match as above, we obtain the outer `Apply` node
which contains as its function the entire tree representing `x.$plus(2)` that
we saw above:

    scala> val Apply(fun, arg :: Nil) = tree
    fun: scala.reflect.runtime.universe.Tree = x.$plus(2).$plus
    arg: scala.reflect.runtime.universe.Tree = 3

    scala> showRaw(fun)
    res3: String = Select(Apply(Select(Ident(TermName("x")), TermName("$plus")), List(Literal(Constant(2)))), TermName("$plus"))

In cases where one must do some richer task, such as traversing an entire
tree without stopping at a specific node, or collecting and inspecting all
nodes of a specific type, using `Traverser` for traversal might be more
advantageous.

#### Traversal via `Traverser`

In situations where it's necessary to traverse an entire tree from top to
bottom, using traversal via pattern matching would be infeasible-- to do it
this way, one must individually handle every type of node that we might come
across in the pattern match. Thus, in these situations, typically class
`Traverser` is used.

`Traverser` makes sure to visit every node in a given tree, in a depth-first search.

To use a `Traverser`, simply subclass `Traverser` and override method
`traverse`. In doing so, you can simply provide custom logic to handle only
the cases you're interested in. For example, if, given our
`x.$plus(2).$plus(3)` tree from the previous section, we would like to collect
all `Apply` nodes, we could do:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = Apply(Select(Apply(Select(Ident(TermName("x")), TermName("$plus")), List(Literal(Constant(2)))), TermName("$plus")), List(Literal(Constant(3))))
    tree: scala.reflect.runtime.universe.Apply = x.$plus(2).$plus(3)

    scala> object traverser extends Traverser {
         |   var applies = List[Apply]()
         |   override def traverse(tree: Tree): Unit = tree match {
         |     case app @ Apply(fun, args) =>
         |       applies = app :: applies
         |       super.traverse(fun)
         |       super.traverseTrees(args)
         |     case _ => super.traverse(tree)
         |   }
         | }
    defined module traverser

In the above, we intend to construct a list of `Apply` nodes that we find in
our given tree.

We achieve this by in effect _adding_ a special case to the already depth-first
`traverse` method defined in superclass `Traverser`, via subclass
`traverser`'s overridden `traverse` method. Our special case affects only
nodes that match the pattern `Apply(fun, args)`, where `fun` is some function
(represented by a `Tree`) and `args` is a list of arguments (represented by a
list of `Tree`s).

When a tree matches the pattern (_i.e.,_ when we have an `Apply` node), we
simply add it to our `List[Apply]`, `applies`, and continue our traversal.

Note that, in our match, we call `super.traverse` on the function `fun`
wrapped in our `Apply`, and we call `super.traverseTrees` on our argument list
`args` (essentially the same as `super.traverse`, but for `List[Tree]` rather
than a single `Tree`). In both of these calls, our objective is simple-- we
want to make sure that we use the default `traverse` method in `Traverser`
because we don't know whether the `Tree` that represents fun contains our
`Apply` pattern-- that is, we want to traverse the entire sub-tree. Since the
`Traverser` superclass calls `this.traverse`, passing in every nested sub-
tree, eventually our custom `traverse` method is guaranteed to be called for
each sub-tree that matches our `Apply` pattern.

To trigger the `traverse` and to see the resulting `List` of matching `Apply`
nodes, simply do:

    scala> traverser.traverse(tree)

    scala> traverser.applies
    res0: List[scala.reflect.runtime.universe.Apply] = List(x.$plus(2), x.$plus(2).$plus(3))

### Creating Trees

When working with runtime reflection, one need not construct trees manually.
However, runtime compilation with toolboxes and compile-time reflection with
macros both use trees as their program representation medium. In these cases,
there are three recommended ways to create trees:

1. Via method `reify` (should be preferred wherever possible).
2. Via method `parse` on `ToolBox`es.
3. Manual construction (not recommended).

#### Tree Creation via `reify`

Method `reify` simply takes a Scala expression as an argument, and produces
that argument's typed `Tree` representation as a result.

Tree creation via method `reify` is the recommended way of creating trees in
Scala Reflection. To see why, let's start with a small example:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> { val tree = reify(println(2)).tree; showRaw(tree) }
    res0: String = Apply(Select(Select(This(TypeName("scala")), TermName("Predef")), TermName("println")), List(Literal(Constant(2))))

Here, we simply `reify` the call to `println(2)`-- that is, we convert the
expression `println(2)` to its corresponding tree representation. Then we
output the raw tree. Note that the `println` method was transformed to
`scala.Predef.println`. Such transformations ensure that regardless of where
the result of `reify` is used, it will not unexpectedly change its meaning.
For example, even if this `println(2)` snippet is later inserted into a block
of code that defines its own `println`, it wouldn't affect the behavior of the
snippet.

This way of creating trees is thus _hygenic_, in the sense that it preserves
bindings of identifiers.

##### Splicing Trees

Using `reify` also allows one to compose trees from smaller trees. This is
done using `Expr.splice`.

_Note:_ `Expr` is `reify`'s return type. It can be thought of as a simple
wrapper which contains a _typed_ `Tree`, a `TypeTag` and a handful of
reification-relevant methods, such as `splice`. For more information about
`Expr`s, see
[the relevant section of this guide]({{ site.baseurl}}/overviews/reflection/annotations-names-scopes.html).

For example, let's try to construct a tree representing `println(2)` using
`splice`:

    scala> val x = reify(2)
    x: scala.reflect.runtime.universe.Expr[Int(2)] = Expr[Int(2)](2)

    scala> reify(println(x.splice))
    res1: scala.reflect.runtime.universe.Expr[Unit] = Expr[Unit](scala.this.Predef.println(2))

Here, we `reify` `2` and `println` separately, and simply `splice` one into
the other.

Note, however, that there is a requirement for the argument of `reify` to be
valid and typeable Scala code. If instead of the argument to `println` we
wanted to abstract over the `println` itself, it wouldn't be possible:

    scala> val fn = reify(println)
    fn: scala.reflect.runtime.universe.Expr[Unit] = Expr[Unit](scala.this.Predef.println())

    scala> reify(fn.splice(2))
    <console>:12: error: Unit does not take parameters
                reify(fn.splice(2))
                                ^

As we can see, the compiler assumes that we wanted to reify a call to
`println` with no arguments, when what we really wanted was to capture the
name of the function to be called.

These types of use-cases are currently inexpressible when using `reify`.

#### Tree Creation via `parse` on `ToolBox`es

`Toolbox`es can be used to typecheck, compile, and execute abstract syntax
trees. A toolbox can also be used to parse a string into an AST.

_Note:_ Using toolboxes requires `scala-compiler.jar` to be on the classpath.

Let's see how `parse` deals with the `println` example from the previous
section:

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> import scala.tools.reflect.ToolBox
    import scala.tools.reflect.ToolBox

    scala> val tb = runtimeMirror(getClass.getClassLoader).mkToolBox()
    tb: scala.tools.reflect.ToolBox[scala.reflect.runtime.universe.type] = scala.tools.reflect.ToolBoxFactory$ToolBoxImpl@7bc979dd

    scala> showRaw(tb.parse("println(2)"))
    res2: String = Apply(Ident(TermName("println")), List(Literal(Constant(2))))

It's important to note that, unlike `reify`, toolboxes aren't limited by the
typeability requirement-- although this flexibility is achieved by sacrificing
robustness. That is, here we can see that `parse`, unlike `reify`, doesn’t
reflect the fact that `println` should be bound to the standard `println`
method.

_Note:_ when using macros, one shouldn’t use `ToolBox.parse`. This is because
there’s already a `parse` method built into the macro context. For example:

    bash$ scala -Yrepl-class-based:false
    
    scala> import scala.language.experimental.macros
    import scala.language.experimental.macros

    scala> def impl(c: scala.reflect.macros.whitebox.Context) = c.Expr[Unit](c.parse("println(2)"))
    def impl(c: scala.reflect.macros.whitebox.Context): c.Expr[Unit]

    scala> def test: Unit = macro impl
    def test: Unit

    scala> test
    2

You can find more about the two `Context`s in [this Macros article]({{ site.baseurl }}/overviews/macros/blackbox-whitebox.html).

##### Typechecking with ToolBoxes

As earlier alluded to, `ToolBox`es enable one to do more than just
constructing trees from strings. They can also be used to typecheck, compile,
and execute trees.

In addition to outlining the structure of the program, trees also hold
important information about the semantics of the program encoded in `symbol`
(a symbol assigned to trees that introduce or reference definitions), and
`tpe` (the type of the tree). By default these fields are empty, but
typechecking fills them in.

When using the runtime reflection framework, typechecking is implemented by
`ToolBox.typeCheck`. When using macros, at compile time one can use the
`Context.typeCheck` method.

    scala> import scala.reflect.runtime.universe._
    import scala.reflect.runtime.universe._

    scala> val tree = reify { "test".length }.tree
    tree: scala.reflect.runtime.universe.Tree = "test".length()

    scala> import scala.tools.reflect.ToolBox
    import scala.tools.reflect.ToolBox

    scala> val tb = runtimeMirror(getClass.getClassLoader).mkToolBox()
    tb: scala.tools.reflect.ToolBox[scala.reflect.runtime.universe.type] = ...

    scala> val ttree = tb.typeCheck(tree)
    ttree: tb.u.Tree = "test".length()

    scala> ttree.tpe
    res5: tb.u.Type = Int

    scala> ttree.symbol
    res6: tb.u.Symbol = method length

Here, we simply create a tree that represents a call to `"test".length`, and
use `ToolBox` `tb`'s `typeCheck` method to typecheck the tree. As we can see,
`ttree` gets the correct type, `Int`, and its `Symbol` is correctly set.

#### Tree Creation via Manual Construction

If all else fails, one can manually construct trees. This is the most low-level
way to create trees, and it should only be attempted if no other
approach works. It sometimes offers greater flexibility when compared with
`parse`, though this flexibility is achieved at a cost of excessive verbosity
and fragility.

Our earlier example involving `println(2)` can be manually constructed as
follows:

    scala> Apply(Ident(TermName("println")), List(Literal(Constant(2))))
    res0: scala.reflect.runtime.universe.Apply = println(2)

The canonical use case for this technique is when the target tree needs to be
assembled from dynamically created parts, which don’t make sense in isolation
from one another. In that case, `reify` will most likely be inapplicable,
because it requires its argument to be typeable. `parse` might not work
either, since quite often, trees are assembled on sub-expression level, with
individual parts being inexpressible as Scala sources.
