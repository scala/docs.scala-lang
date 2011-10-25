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