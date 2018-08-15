---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Brendan O'Connor
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

languages: [ba, fr, ja, pl, pt-br, zh-cn, th]
permalink: /cheatsheets/index.html
---

<!-- ###### Contributed by {{ page.by }} -->

{{ page.about }}

<table>
  <thead>
    <tr>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span id="variables" class="h2">variables</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var x = 5</code></td>
      <td>variable</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br><code class="highlighter-rouge">val x = 5</code><br /> <span class="label important">Bad</span><br><code class="highlighter-rouge">x=6</code></td>
      <td>constant</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var x: Double = 5</code></td>
      <td>explicit type</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">functions</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <code class="highlighter-rouge">def f(x: Int) = { x*x }</code><br /> <span class="label important">Bad</span><br> <code class="highlighter-rouge">def f(x: Int)   { x*x }</code></td>
      <td>define function <br /> hidden error: without = it’s a Unit-returning procedure; causes havoc</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <code class="highlighter-rouge">def f(x: Any) = println(x)</code><br /> <span class="label important">Bad</span><br> <code class="highlighter-rouge">def f(x) = println(x)</code></td>
      <td>define function <br /> syntax error: need types for every arg.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">type R = Double</code></td>
      <td>type alias</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def f(x: R)</code> vs.<br /> <code class="highlighter-rouge">def f(x: =&gt; R)</code></td>
      <td>call-by-value <br /> call-by-name (lazy parameters)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(x:R) =&gt; x*x</code></td>
      <td>anonymous function</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map(_*2)</code> vs.<br /> <code class="highlighter-rouge">(1 to 5).reduceLeft( _+_ )</code></td>
      <td>anonymous function: underscore is positionally matched arg.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map( x =&gt; x*x )</code></td>
      <td>anonymous function: to use an arg twice, have to name it.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <code class="highlighter-rouge">(1 to 5).map(2*)</code><br /> <span class="label important">Bad</span><br> <code class="highlighter-rouge">(1 to 5).map(*2)</code></td>
      <td>anonymous function: bound infix method. Use <code class="highlighter-rouge">2*_</code> for sanity’s sake instead.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5).map { x =&gt; val y=x*2; println(y); y }</code></td>
      <td>anonymous function: block style returns last expression.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1 to 5) filter {_%2 == 0} map {_*2}</code></td>
      <td>anonymous functions: pipeline style. (or parens too).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def compose(g:R=&gt;R, h:R=&gt;R) = (x:R) =&gt; g(h(x))</code> <br /> <code class="highlighter-rouge">val f = compose({_*2}, {_-1})</code></td>
      <td>anonymous functions: to pass in multiple blocks, need outer parens.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">val zscore = (mean:R, sd:R) =&gt; (x:R) =&gt; (x-mean)/sd</code></td>
      <td>currying, obvious syntax.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def zscore(mean:R, sd:R) = (x:R) =&gt; (x-mean)/sd</code></td>
      <td>currying, obvious syntax</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd</code></td>
      <td>currying, sugar syntax. but then:</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">val normer = zscore(7, 0.4) _</code></td>
      <td>need trailing underscore to get the partial, only for the sugar version.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def mapmake[T](g:T=&gt;T)(seq: List[T]) = seq.map(g)</code></td>
      <td>generic type.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">5.+(3); 5 + 3</code> <br /> <code class="highlighter-rouge">(1 to 5) map (_*2)</code></td>
      <td>infix sugar.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">def sum(args: Int*) = args.reduceLeft(_+_)</code></td>
      <td>varargs.</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">packages</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection._</code></td>
      <td>wildcard import.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection.Vector</code> <br /> <code class="highlighter-rouge">import scala.collection.{Vector, Sequence}</code></td>
      <td>selective import.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import scala.collection.{Vector =&gt; Vec28}</code></td>
      <td>renaming import.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">import java.util.{Date =&gt; _, _}</code></td>
      <td>import all from java.util except Date.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">package pkg</code> <em>at start of file</em> <br /> <code class="highlighter-rouge">package pkg { ... }</code></td>
      <td>declare a package.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">data structures</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">(1,2,3)</code></td>
      <td>tuple literal. (<code class="highlighter-rouge">Tuple3</code>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var (x,y,z) = (1,2,3)</code></td>
      <td>destructuring bind: tuple unpacking via pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br><code class="highlighter-rouge">var x,y,z = (1,2,3)</code></td>
      <td>hidden error: each assigned to the entire tuple.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">var xs = List(1,2,3)</code></td>
      <td>list (immutable).</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">xs(2)</code></td>
      <td>paren indexing. (<a href="http://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slides</a>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">1 :: List(2,3)</code></td>
      <td>cons.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">1 to 5</code> <em>same as</em> <code class="highlighter-rouge">1 until 6</code> <br /> <code class="highlighter-rouge">1 to 10 by 2</code></td>
      <td>range sugar.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">()</code> <em>(empty parens)</em></td>
      <td>sole member of the Unit type (like C/Java void).</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">control constructs</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">if (check) happy else sad</code></td>
      <td>conditional.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">if (check) happy</code>
      <br><em><strong>same as</strong></em><br>
      <code class="highlighter-rouge">if (check) happy else ()</code></td>
      <td>conditional sugar.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">while (x &lt; 5) { println(x); x += 1}</code></td>
      <td>while loop.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">do { println(x); x += 1} while (x &lt; 5)</code></td>
      <td>do while loop.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._
breakable {
  for (x <- xs) {
    if (Math.random < 0.1)
      break
  }
}</code></pre></td>
      <td>break. (<a href="http://www.slideshare.net/Odersky/fosdem-2009-1013261/21">slides</a>)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for (x &lt;- xs if x%2 == 0) yield x*10</code>
      <br><em><strong>same as</strong></em><br>
      <code class="highlighter-rouge">xs.filter(_%2 == 0).map(_*10)</code></td>
      <td>for comprehension: filter/map</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for ((x,y) &lt;- xs zip ys) yield x*y</code>
      <br><em><strong>same as</strong></em><br>
      <code class="highlighter-rouge">(xs zip ys) map { case (x,y) =&gt; x*y }</code></td>
      <td>for comprehension: destructuring bind</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">for (x &lt;- xs; y &lt;- ys) yield x*y</code>
      <br><em><strong>same as</strong></em><br>
      <code class="highlighter-rouge">xs flatMap {x =&gt; ys map {y =&gt; x*y}}</code></td>
      <td>for comprehension: cross product</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x <- xs; y <- ys) {
  println("%d/%d = %.1f".format(x, y, x/y.toFloat))
}</code></pre></td>
      <td>for comprehension: imperative-ish<br /><a href="http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax">sprintf-style</a></td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i <- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>for comprehension: iterate including the upper bound</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i <- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>for comprehension: iterate omitting the upper bound</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">pattern matching</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <code class="highlighter-rouge">(xs zip ys) map { case (x,y) =&gt; x*y }</code><br /> <span class="label important">Bad</span><br> <code class="highlighter-rouge">(xs zip ys) map( (x,y) =&gt; x*y )</code></td>
      <td>use case in function args for pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br>
      <pre class="highlight"><code>val v42 = 42
Some(3) match {
  case Some(v42) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td>“v42” is interpreted as a name matching any Int value, and “42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val v42 = 42
Some(3) match {
  case Some(`v42`) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td>”`v42`” with backticks is interpreted as the existing val <code class="highlighter-rouge">v42</code>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
Some(3) match {
  case Some(UppercaseVal) => println("42")
  case _ => println("Not 42")
}</code></pre></td>
      <td><code class="highlighter-rouge">UppercaseVal</code> is treated as an existing val, rather than a new pattern variable, because it starts with an uppercase letter. Thus, the value contained within <code class="highlighter-rouge">UppercaseVal</code> is checked against <code class="highlighter-rouge">3</code>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">object orientation</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C(x: R)</code></td>
      <td>constructor params - <code class="highlighter-rouge">x</code> is only available in class body</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C(val x: R)</code><br /><code class="highlighter-rouge">var c = new C(4)</code><br /><code class="highlighter-rouge">c.x</code></td>
      <td>constructor params - automatic public member defined</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this = this(42)
}</code></pre></td>
      <td>constructor is class body<br />declare a public member<br />declare a gettable but not settable member<br />declare a private member<br />alternative constructor</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">new{ ... }</code></td>
      <td>anonymous class</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">abstract class D { ... }</code></td>
      <td>define an abstract class. (non-createable)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C extends D { ... }</code></td>
      <td>define an inherited class.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class D(var x: R)</code><br /><code class="highlighter-rouge">class C(x: R) extends D(x)</code></td>
      <td>inheritance and constructor params. (wishlist: automatically pass-up params by default)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">object O extends D { ... }</code></td>
      <td>define a singleton. (module-like)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">trait T { ... }</code><br /><code class="highlighter-rouge">class C extends T { ... }</code><br /><code class="highlighter-rouge">class C extends D with T { ... }</code></td>
      <td>traits.<br />interfaces-with-implementation. no constructor params. <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">mixin-able</a>.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">trait T1; trait T2</code><br /><code class="highlighter-rouge">class C extends T1 with T2</code><br /><code class="highlighter-rouge">class C extends D with T1 with T2</code></td>
      <td>multiple traits.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">class C extends D { override def f = ...}</code></td>
      <td>must declare method overrides.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">new java.io.File("f")</code></td>
      <td>create object.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br> <code class="highlighter-rouge">new List[Int]</code><br /> <span class="label success">Good</span><br> <code class="highlighter-rouge">List(1,2,3)</code></td>
      <td>type error: abstract type<br />instead, convention: callable factory shadowing the type</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">classOf[String]</code></td>
      <td>class literal.</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x.isInstanceOf[String]</code></td>
      <td>type check (runtime)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x.asInstanceOf[String]</code></td>
      <td>type cast (runtime)</td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">x: String</code></td>
      <td>ascription (compile time)</td>
    </tr>
  </tbody>
</table>
