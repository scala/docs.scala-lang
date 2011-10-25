---
layout: cheatsheet
title: Scalacheat
by: Brendan O'Connor
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
|  `package pkg` _at start of file_ <br> `package pkg { ... }`                                             |  declare a package. |
|  <h2 id="data_structures">data structures</h2>                                                           |                 |
|  `(1,2,3)`                                                                                               |  tuple literal. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  destructuring bind: tuple unpacking via pattern matching. |
|  <span class="label important">Bad</span>`var x,y,z = (1,2,3)`                                           |  hidden error: each assigned to the entire tuple. |
|  `var xs = List(1,2,3)`                                                                                  |  list (immutable). |
|  `xs(2)`                                                                                                 |  paren indexing. ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  cons. |
|  `1 to 5` _same as_ `1 until 6` <br> `1 to 10 by 2`                                                      |  range sugar. |
|  `()` _(emptu parens)_                                                                                   |  sole member of the Unit type (like C/Java void). |
|  <h2 id="control_constructs">control constructs</h2>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  conditional. |
|  `if (check) happy` _same as_ <br> `if (check) happy else ()`                                            |  conditional sugar. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while loop. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while loop. |

