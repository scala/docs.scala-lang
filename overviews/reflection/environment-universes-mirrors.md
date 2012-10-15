---
layout: overview-large
title: Environment, Universes, and Mirrors

partof: reflection
num: 2
---

### Universes

Standard reflection interfaces and implementations are all contained in the jar `scala-reflect.jar`.
This jar is needed for all operations involving either Java reflection or macro implementations.
The two share a large set of operations, which are all abstracted out in the reflective core API in `scala.reflect.api.Universe`. This universe provides a fairly complete set of reflection operations that allow to query key Scala type relations such as membership or subtyping.

Class `scala.reflect.api.Universe` has two specialized sub-universes. Class `scala.reflect.api.JavaUniverse` adds operations that link symbols and types to the underlying classes and runtime values of a JVM. Class `scala.reflect.macros.Universe` adds operations which allow macros to access selected compiler data structures and operations.

The main implementation object of `scala-reflect.jar` is named `scala.reflect.runtime.universe`. It is a global singleton, which serves as an entry point to runtime reflection. There is no analogous global singleton universe for macros. Instead, macros access the currently running compiler instance as their universe, accessible via `scala.reflect.macros.Context#universe`.

### Mirrors

Each universe has one or more mirrors. A mirror defines a hierarchy of symbols starting with the root package `_root_` and provides methods to locate and define classes and singleton objects in that hierarchy. Mirrors for runtime reflection also provide operations to reflect on runtime instances.

All universes have one root mirror each, available in the `rootMirror` field. This mirror contains standard Scala classes and types such as `Any`, `AnyRef`, `AnyVal`, `Nothing`, `Null`, and all classes loaded from scala-library. The root package of the root mirror contains the root packages of all other mirrors as members.

In a Java universe each mirror is associated with a classloader. This reflects the fact that multiple classes with the same name can exist in a JVM instance, where each class is loaded by a different classloader. To model this behavior, each JVM classloader is associated with a mirror, and each mirror contains its own hierarchy of packages and classes. However, the same class may also exist in several different classloaders and mirrors because classloaders can delegate to each other. This is modelled by one level of indirection: several packages in different mirrors can link to the same class.

The main access point to mirrors in runtime reflection is `scala.reflect.runtime.package#currentMirror`,
which gives a JVM reflection mirror that corresponds to the current lexical context.
`currentMirror` is typically equivalent to `universe.runtimeMirror(getClass.getClassLoader)` invoked at the call site. Macro universe is not based on classloaders, therefore it has only one mirror that corresponds to the compiler classpath, accessible via `scala.reflect.macros.Context#mirror`.

### Toolboxes

Along with runtime Java universe `scala.reflect.api.Universe` and compile-time macro universe `scala.reflect.macros.Universe`, reflection API also includes a runtime compiler universe implemented in `scala.tools.reflect`. One interacts with such universes via toolboxes, instances of `scala.tools.reflect.ToolBox` declared in scala-compiler.jar.

After importing the `scala.tools.reflect.ToolBox` implicit conversion, runtime reflection mirrors gain the `mkToolBox` method that lets one create runtime compiler instances, optionally providing custom `options` string and a custom `frontEnd` that determines how to process warnings and errors emitted by the compilers. Toolboxes have such methods as `parse`, `typeCheck`, `inferImplicitValue`, `compile` and `eval`.


### Using runtime reflection

Suppose we want to invoke the `head` method on `List(1, 2)`. This can be done in four steps, which include:

1. setting up the environment
2. getting to a symbol that represents `head`
3. creating a method mirror for `head`
4. invoking the method mirror.

### Step 1: Setting up the environment

To do anything with reflection one needs to decide on a universe. The universe of choice for
runtime reflection is `scala.reflect.runtime.universe`. A commonplace idiom is to do a blanket import `import scala.reflect.runtime.universe._` to get access to all types and methods declared inside the universe.

 	scala> import scala.reflect.runtime.universe._
  	import scala.reflect.runtime.universe._

The next step is creating a mirror. On JVM mirrors are in one-to-one correspondence with classloaders.
Another common idiom is to create a mirror from `getClass.getClassLoader`, the classloader of the
current class. In most cases that will do, but if the structure of classloaders in your application
is more complex than that, adjust accordingly.

	scala> val cm = runtimeMirror(getClass.getClassLoader)
	cm: reflect.runtime.universe.Mirror = JavaMirror with <translating classloader> of type
	class scala.tools.nsc.interpreter.IMain$TranslatingClassLoader with classpath [(memory)]
	and parent being <url classloader> of type class scala.tools.nsc.util.ScalaClassLoader$
	URLClassLoader with classpath [file:/c:/PROGRA~1/Java/JDK/jre/lib/resources.jar...


### Step 2: Getting to a symbol that represents `head`

We start with obtaining a type of `List` to get to the `head` symbol that represents the given method.
There are three ways of doing that.

The best way is to write `typeOf[List[Int]]`, which is applicable when the type of the value being inspected is known in advance, and which gives the exact information about the type. When the type is dynamic, we have to first obtain a Java class and then convert it to a Scala type, e.g., `cm.runtimeClass(list.getClass).toType`. Unfortunately then the information about the type suffers from erasure.


	scala> typeOf[List[Int]]
	res0: reflect.runtime.universe.Type = scala.List[Int]

	scala> cm.classSymbol(List(1, 2).getClass).toType
	res1: reflect.runtime.universe.Type = scala.collection.immutable.::[B]


A compromise solution, which allows to preserve the exact type information, involves `TypeTag`
context bounds. If the value being inspected is an argument of a function, then we can make
the corresponding parameter generic and annotated the introduced type parameter with a type tag.
After we do that, the compiler will preserve exact types of arguments passed to a function,
available via `typeOf`.


	scala> def invokeHead(x: Any): Any = {
    	 | // type of x is unknown, the best we can do is to approximate
    	 | println(cm.classSymbol(x.getClass).toType)
     	 | }
	invokeHead: (x: Any)Any

	scala> invokeHead(List(1, 2))
	scala.collection.immutable.::[B]

	scala> invokeHead(List("x"))
	scala.collection.immutable.::[B]

	scala> def invokeHead[T: TypeTag](x: T): Any = {
     	| // type of x is preserved by the compiler
     	| println(typeOf[T])
     	| }
	invokeHead: [T](x: T)(implicit evidence$1: reflect.runtime.universe.TypeTag[T])Any

	scala> invokeHead(List(1, 2))
	List[Int]

	scala> invokeHead(List("x"))
	List[java.lang.String]

Having a type at hand it is straightforward to traverse its members and obtain a symbol
that represents `head`.


	scala> val head = typeOf[List[Int]].member("head": TermName).asMethod
	head: reflect.runtime.universe.MethodSymbol = method head

Note the `asMethod` cast following the invocation of `member`. In Scala reflection symbol-returning methods don't raise exceptions, but rather produce `NoSymbol`, a special singleton, which is a null object for symbols. Therefore to use such APIs one has to first check whether a callee returned a valid symbol and, if yes, then perform a cast using one of the `asTerm`, `asMethod`, `asModule`, `asType` or `asClass` methods.

Also be careful with overloaded methods, which are represented as instances of `TermSymbol`, not `MethodSymbol`, with multiple `alternatives` of type `MethodSymbol` that have to be resolved manually. This and other gotchas with symbol loading are discussed on [[scala.reflect.api.Symbols the documentation page about symbols]].

### Step 3: Creating a method mirror for `head`

In Scala reflection, all reflective invocations go through mirrors created with `reflectXXX` methods.
For example, to get a singleton instance of an `object`, one needs to reflect a `ModuleSymbol` to obtain
a `ModuleMirror`, which provides the `instance` method.

In our case we need to reflect an instance being processed, producing an `InstanceMirror`, then reflect
a method symbol loaded during the previous step, producing a `MethodMirror`. Finally, method mirrors
provide the `apply` method that performs reflective invocations.

	scala> val im = cm.reflect(List(1, 2))
	im: reflect.runtime.universe.InstanceMirror = instance mirror for List(1, 2)

	scala> val mm = im.reflectMethod(head)
	mm: reflect.runtime.universe.MethodMirror = method mirror for
	scala.collection.IterableLike.head: A (bound to List(1, 2))

### Step 4: Invoking the method mirror

The final step is straightforward. Reflective invocation of a method is as simple as calling
the `apply` method of a `MethodMirror`:

	scala> mm()
	res1 @ 758f3dae: Any = 1

### Conclusion

As specified in the documentation of traits declared in [[scala.reflect.api.Mirrors]],
in a similar fashion (by using `reflectXXX` methods), it is possible to:
  
  - Get and set field values
  - Instantiate classes
  - Obtain singleton instances of objects

However there's much more to Scala reflection, with examples on other documentation pages answering the following questions:
  
  - [[scala.reflect.api.Symbols How to get a Symbol that corresponds to a given definition?]]
  - [[scala.reflect.api.Types How to get a Type of some Scala code?]]
  - [[scala.reflect.api.Trees How to get a Tree that corresponds to some Scala code?]]
  - [[scala.reflect.api.Trees How to parse a string into a Tree?]]
  - [[scala.reflect.api.Trees How to compile or evaluate a Tree?]]
  - [[scala.reflect.api.Annotations How to get Java and/or Scala annotations attached to a given definition?]]
  - [[scala.reflect.api.Printers How to inspect internal structure of reflection artifacts?]]
  - [[scala.reflect.api.Importers How to move reflection artifacts from one universe to another?]]
  - [[scala.reflect.macros.package How to use compile-time reflection in macros?]]


<!--  *
 * See [[scala.reflect.api.package the overview page]] for a description of universes and infomation on getting started with Scala reflection API.
 * This page lists the most important layers of the cake, and describes paculiarities of cake APIs.
 *
 * The reflection library is structured according to the 'cake pattern'. The main layer
 * resides in package [[scala.reflect.api]] and defines an interface to the following main types: -->

<!-- Taken from Universe.reify
    * == Further info and implementation details ==
   *
   * `reify` is implemented as a macro, which given an expression, generates a tree that when compiled and executed produces the original tree.
   *
   *  For instance in `reify{ x + 1 }` the macro `reify` receives the abstract syntax tree of `x + 1` as its argument, which is
   *
   *  {{{
   *    Apply(Select(Ident("x"), "+"), List(Literal(Constant(1))))
   *  }}}
   *
   *  and returns a tree, which produces the tree above, when compiled and executed. So in other terms, the refiy call expands to something like
   *
   *  {{{
   *      val $u: u.type = u // where u is a reference to the Universe that calls the reify
   *      $u.Expr[Int]($u.Apply($u.Select($u.Ident($u.newFreeVar("x", <Int>, x), "+"), List($u.Literal($u.Constant(1))))))
   *  }}}
   *
   *  ------
   *
   *  Reification performs expression splicing (when processing Expr.splice)
   *  and type splicing (for every type T that has a TypeTag[T] implicit in scope):
   *
   *  {{{
   *    val two = mirror.reify(2)                         // Literal(Constant(2))
   *    val four = mirror.reify(two.splice + two.splice)  // Apply(Select(two.tree, newTermName("$plus")), List(two.tree))
   *
   *    def macroImpl[T](c: Context) = {
   *      ...
   *      // T here is just a type parameter, so the tree produced by reify won't be of much use in a macro expansion
   *      // however, if T were annotated with c.WeakTypeTag (which would declare an implicit parameter for macroImpl)
   *      // then reification would substitute T with the TypeTree that was used in a TypeApply of this particular macro invocation
   *      val factory = c.reify{ new Queryable[T] }
   *      ...
   *    }
   *  }}}
   *
   *  The transformation looks mostly straightforward, but it has its tricky parts:
   *    - Reifier retains symbols and types defined outside the reified tree, however
   *      locally defined entities get erased and replaced with their original trees
   *    - Free variables are detected and wrapped in symbols of the type `FreeTermSymbol` or `FreeTypeSymbol`
   *    - Mutable variables that are accessed from a local function are wrapped in refs
 -->


<!-- FROM REFLECT.API.PACKAGE.SCALA
-/**
- * The main package of Scala's reflection library.
- *
- * The reflection library is structured according to the 'cake pattern'. The main layer
- * resides in package [[scala.reflect.api]] and defines an interface to the following main types:
- *
- *   - [[scala.reflect.api.Types#Type Types]] represent types
- *   - [[scala.reflect.api.Symbols#Symbol Symbols]] represent definitions
- *   - [[scala.reflect.api.Trees#Tree Trees]] represent abstract syntax trees
- *   - [[scala.reflect.api.Names#Name Names]] represent term and type names
- *   - [[scala.reflect.api.Annotations#Annotation Annotations]] represent annotations
- *   - [[scala.reflect.api.Positions#Position Positions]] represent source positions of tree nodes
- *   - [[scala.reflect.api.FlagSets#FlagSet FlagSet]] represent sets of flags that apply to symbols and
- *     definition trees
- *   - [[scala.reflect.api.Constants#Constant Constants]] represent compile-time constants.
- *
- * Each of these types are defined in their own enclosing traits, which are ultimately all inherited by class
- * [[scala.reflect.api.Universe Universe]]. The main universe defines a minimal interface to the above types.
- * Universes that provide additional functionality such as deeper introspection or runtime code generation,
- * are defined in packages [[scala.reflect.api]] and `scala.tools.reflect`.
- *
- * The cake pattern employed here requires to write certain Scala idioms with more indirections that usual.
- * What follows is a description of these indirections, which will help to navigate the Scaladocs easily.
- *
- * For instance, consider the base type of all abstract syntax trees: [[scala.reflect.api.Trees#Tree]].
- * This type is not a class but is abstract and has an upper bound of [[scala.reflect.api.Trees#TreeApi]],
- * which is a class defining the minimal base interface for all trees.
- *
- * For a more interesting tree type, consider [[scala.reflect.api.Trees#If]] representing if-expressions.
- * It is defined next to a value `If` of type [[scala.reflect.api.Trees#IfExtractor]].
- * This value serves as the companion object defining a factory method `apply` and a corresponding `unapply`
- * for pattern matching.
- *
- * {{{
- * import scala.reflect.runtime.universe._ 
- * val cond = reify{ condition }.tree // <- just some tree representing a condition
- * val body = Literal(Constant(1))
- * val other = Literal(Constant(2))
- * val iftree = If(cond,body,other)
- * }}}
- *
- * is equivalent to
- *
- * {{{
- * import scala.reflect.runtime.universe._
- * val iftree = reify{ if( condition ) 1 else 2 }.tree
- * }}}
- * 
- * and can be pattern matched as
- *
- * {{{
- * iftree match { case If(cond,body,other) => ... }
- * }}}
- *
- * Moreover, there is an implicit value [[scala.reflect.api.Trees#IfTag]] of type
- * `ClassTag[If]` that is used by the Scala compiler so that we can indeed pattern match on `If`:
- * {{{
- *   iftree match { case _:If => ... } 
- * }}}
- * Without the given implicit value, this pattern match would raise an "unchecked" warning at compile time 
- * since `If` is an abstract type that gets erased at runtime. See [[scala.reflect.ClassTag]] for details.
- *
- * To summarize: each tree type `X` (and similarly for other types such as `Type` or `Symbol`) is represented
- * by an abstract type `X`, optionally together with a class `XApi` that defines `X`'s' interface.
- * `X`'s companion object, if it exists, is represented by a value `X` that is of type `XExtractor`.
- * Moreover, for each type `X`, there is a value `XTag` of type `ClassTag[X]` that allows to pattern match on `X`. -->