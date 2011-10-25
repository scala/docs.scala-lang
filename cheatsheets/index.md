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
