---
layout: cheatsheet
title: Scalacheat
by: Brendan O'Connor
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.
---

###### Contributed by {{ page.by }}

|                                                                                                          |                 |
| ------                                                                                                   | ------          |
|  <h2 id="variables">variables</h2>                                                                       |                 |
|  `var x = 5`                                                                                             |  variable       |
|  <span class="label success">Good</span> `val x = 5`<br> <span class="label important">Bad</span> `x=6`  |  constant       |
|  `var x: Double = 5`                                                                                     |  explicit type  |
|  <h2 id="functions">functions</h2>                                                                       |                 |
|  <span class="label success">Good</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Bad</span> `def f(x: Int)   { x*x }` |  define function <br> hidden error: without = it's a Unit-returning procedure; causes havoc |
|  <span class="label success">Good</span> `def f(x: Any) = println(x)`<br> <span class="label important">Bad</span> `def f(x) = println(x)` |  define function <br> syntax error: need types for every arg. |
|  `type R = Double`                                                                                       |  type alias     |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  call-by-value <br> call-by-name (lazy parameters) |
|  `(x:R) => x*x`                                                                                          |  anonymous function  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  anonymous function: underscore is positionally matched arg. |
|  `(1 to 5).map( x => x*x )`                                                                              |  anonymous function: to use an arg twice, have to name it. |
|  <span class="label success">Good</span> `(1 to 5).map(2*)`<br> <span class="label important">Bad</span> `(1 to 5).map(*2)` |  anonymous function: bound infix method. Use `2*_` for sanity's sake instead. |
|  `(1 to 5).map { val x=_*2; println(x); x }`                                                             |  anonymous function: block style returns last expression. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  anonymous functions: pipeline style. (or parens too). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  anonymous functions: to pass in multiple blocks, need outer parens. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  currying, obvious syntax. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  currying, obvious syntax |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  currying, sugar syntax. but then: |
|  `val normer = zscore(7, 0.4)_`                                                                          |  need trailing underscore to get the partial, only for the sugar version. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  generic type. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  infix sugar. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  varargs. |
|  <h2 id="packages">packages</h2>                                                                         |                 |
|  `import scala.collection._`                                                                             |  wildcard import. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  selective import. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  renaming import. |
|  `import java.util.{Date => _, _}`                                                                       |  import all from java.util except Date. |
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  declare a package. |
|  <h2 id="data_structures">data structures</h2>                                                           |                 |
|  `(1,2,3)`                                                                                               |  tuple literal. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  destructuring bind: tuple unpacking via pattern matching. |
|  <span class="label important">Bad</span>`var x,y,z = (1,2,3)`                                           |  hidden error: each assigned to the entire tuple. |
|  `var xs = List(1,2,3)`                                                                                  |  list (immutable). |
|  `xs(2)`                                                                                                 |  paren indexing. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  cons. |
|  `1 to 5` _same as_ `1 until 6` <br> `1 to 10 by 2`                                                      |  range sugar. |
|  `()` _(empty parens)_                                                                                   |  sole member of the Unit type (like C/Java void). |
|  <h2 id="control_constructs">control constructs</h2>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  conditional. |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  conditional sugar. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while loop. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while loop. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _same as_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  for comprehension: filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` _same as_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  for comprehension: destructuring bind |
|  `for (x <- xs; y <- ys) yield x*y` _same as_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  for comprehension: cross product |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x,y, x*y))`<br>`}`                     |  for comprehension: imperative-ish<br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  for comprehension: iterate including the upper bound |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  for comprehension: iterate omitting the upper bound |
|  <h2 id="pattern_matching">pattern matching</h2>                                                         |                 |
|  <span class="label success">Good</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Bad</span> `(xs zip ys) map( (x,y) => x*y )` |  use case in function args for pattern matching. |
|  <span class="label important">Bad</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" is interpreted as a name matching any Int value, and "42" is printed. |
|  <span class="label success">Good</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" with backticks is interpreted as the existing val `v42`, and "Not 42" is printed. |
|  <span class="label success">Good</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal` is treated as an existing val, rather than a new pattern variable, because it starts with an uppercase letter. Thus, the value contained within `UppercaseVal` is checked against `3`, and "Not 42" is printed. |
|  <h2 id="object_orientation">object orientation</h2>                                                     |                 |
|  `class C(x: R)` _same as_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  constructor params - private |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  constructor params - public |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>constructor is class body<br>declare a public member<br>declare a gettable but not settable member<br>declare a private member<br>alternative constructor|
|  `new{ ... }`                                                                                            |  anonymous class |
|  `abstract class D { ... }`                                                                              |  define an abstract class. (non-createable) |
|  `class C extends D { ... }`                                                                             |  define an inherited class. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  inheritance and constructor params. (wishlist: automatically pass-up params by default)
|  `object O extends D { ... }`                                                                            |  define a singleton. (module-like) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  traits.<br>interfaces-with-implementation. no constructor params. [mixin-able]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  multiple traits. |
|  `class C extends D { override def f = ...}`	                                                           |  must declare method overrides. |
|  `new java.io.File("f")`                   	                                                           |  create object. |
|  <span class="label important">Bad</span> `new List[Int]`<br> <span class="label success">Good</span> `List(1,2,3)` |  type error: abstract type<br>instead, convention: callable factory shadowing the type |
|  `classOf[String]`                                                                                       |  class literal. |
|  `x.isInstanceOf[String]`                                                                                |  type check (runtime) |
|  `x.asInstanceOf[String]`                                                                                |  type cast (runtime) |
|  `x: String`                                                                                             |  ascription (compile time) |
