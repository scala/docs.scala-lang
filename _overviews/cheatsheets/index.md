---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Brendan O'Connor
about: Thanks to <a href="http://brenocon.com/">Brendan O'Connor</a>, this cheatsheet aims to be a quick reference of Scala syntactic constructions. Licensed by Brendan O'Connor under a CC-BY-SA 3.0 license.

languages: [ba, fr, ja, pl, pt-br, zh-cn, th, ru]
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
      <td><pre class="highlight"><code>var x = 5</code></pre><br /> <span class="label success">Good</span><br><pre class="highlight"><code>x=6</code></pre></td>
      <td>variable</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val x = 5</code></pre><br /> <span class="label important">Bad</span><br><pre class="highlight"><code>x=6</code></pre></td>
      <td>constant</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x: Double = 5</code></pre></td>
      <td>explicit type</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">functions</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Int) = { x * x }</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x: Int)   { x * x }</code></pre></td>
      <td>define function <br /> hidden error: without = it’s a Unit-returning procedure; causes havoc</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>def f(x: Any) = println(x)</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>def f(x) = println(x)</code></pre></td>
      <td>define function <br /> syntax error: need types for every arg.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>type R = Double</code></pre></td>
      <td>type alias</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def f(x: R)</code></pre> vs.<br /> <pre class="highlight"><code>def f(x: =&gt; R)</code></pre></td>
      <td>call-by-value <br /> call-by-name (lazy parameters)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(x:R) =&gt; x * x</code></pre></td>
      <td>anonymous function</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(_ * 2)</code></pre> vs.<br /> <pre class="highlight"><code>(1 to 5).reduceLeft( _ + _ )</code></pre></td>
      <td>anonymous function: underscore is positionally matched arg.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map( x =&gt; x * x )</code></pre></td>
      <td>anonymous function: to use an arg twice, have to name it.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>(1 to 5).map(2 *)</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>(1 to 5).map(* 2)</code></pre></td>
      <td>anonymous function: bound infix method.<br /> Use <code class="highlighter-rouge">2 * _</code> for sanity’s sake instead.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map { x =&gt;
  val y = x * 2
  println(y)
  y
}</code></pre></td>
      <td>anonymous function: block style returns last expression.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5) filter {
  _ % 2 == 0
} map {
  _ * 2
}</code></pre></td>
      <td>anonymous functions: pipeline style. (or parens too).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def compose(g: R =&gt; R, h: R =&gt; R) =
  (x: R) =&gt; g(h(x))</code></pre> <br /> <pre class="highlight"><code>val f = compose(_ * 2, _ - 1)</code></pre></td>
      <td>anonymous functions: to pass in multiple blocks, need outer parens.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val zscore = 
  (mean: R, sd: R) =&gt;
    (x:R) =&gt; 
      (x - mean) / sd</code></pre></td>
      <td>currying, obvious syntax.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean:R, sd:R) =
  (x:R) =&gt; 
    (x - mean) / sd</code></pre></td>
      <td>currying, obvious syntax</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean:R, sd:R)(x:R) =
  (x - mean) / sd</code></pre></td>
      <td>currying, sugar syntax. but then:</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val normer =
  zscore(7, 0.4) _</code></pre></td>
      <td>need trailing underscore to get the partial, only for the sugar version.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def mapmake[T](g: T =&gt; T)(seq: List[T]) =
  seq.map(g)</code></pre></td>
      <td>generic type.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>5.+(3); 5 + 3</code></pre> <br /> <pre class="highlight"><code>(1 to 5) map (_ * 2)</code></pre></td>
      <td>infix sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def sum(args: Int*) = 
  args.reduceLeft(_+_)</code></pre></td>
      <td>varargs.</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">packages</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection._</code></pre></td>
      <td>wildcard import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.Vector</code></pre> <br /> <pre class="highlight"><code>import scala.collection.{Vector, Sequence}</code></pre></td>
      <td>selective import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.{Vector =&gt; Vec28}</code></pre></td>
      <td>renaming import.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import java.util.{Date =&gt; _, _}</code></pre></td>
      <td>import all from java.util except Date.</td>
    </tr>
    <tr>
      <td><em>At start of file:</em> <pre class="highlight"><code>package pkg</code></pre><br /> <em>Packaging by scope: </em> <pre class="highlight"><code>package pkg {
  ...
}</code></pre><br /><em>Package singleton: </em> <pre class="highlight"><code>package object pkg {
  ...
}</code></pre></td>
      <td>declare a package.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">data structures</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1, 2, 3)</code></pre></td>
      <td>tuple literal. (<code class="highlighter-rouge">Tuple3</code>)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var (x, y, z) = (1, 2, 3)</code></pre></td>
      <td>destructuring bind: tuple unpacking via pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br><pre class="highlight"><code>var x, y, z = (1, 2, 3)</code></pre></td>
      <td>hidden error: each assigned to the entire tuple.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var xs = List(1, 2, 3)</code></pre></td>
      <td>list (immutable).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>xs(2)</code></pre></td>
      <td>paren indexing. (<a href="http://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slides</a>)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 :: List(2, 3)</code></pre></td>
      <td>cons.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 to 5</code></pre> <em>same as</em> <pre class="highlight"><code>1 until 6</code></pre> <br /> <pre class="highlight"><code>1 to 10 by 2</code></pre></td>
      <td>range sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>()</code></pre></td>
      <td>Empty parens is singleton value of the Unit type<br /> Equivalent to <code class="highlighter-rouge">void</code> in C and Java.</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">control constructs</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy else sad</code></pre></td>
      <td>conditional.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>if (check) happy else ()</code></pre></td>
      <td>conditional sugar.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>while (x &lt; 5) { 
  println(x)
  x += 1
}</code></pre></td>
      <td>while loop.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>do {
  println(x)
  x += 1
} while (x &lt; 5)</code></pre></td>
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
      <td><pre class="highlight"><code>for (x &lt;- xs if x%2 == 0)
yield x * 10</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>xs.filter(_%2 == 0).map( _ * 10)</code></pre></td>
      <td>for comprehension: filter/map</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for ((x, y) &lt;- xs zip ys)
yield x * y</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre></td>
      <td>for comprehension: destructuring bind</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys)
yield x * y</code></pre>
      <br><em><strong>same as</strong></em><br>
      <pre class="highlight"><code>xs flatMap { x =&gt;
  ys map { y =&gt;
    x * y
  }
}</code></pre></td>
      <td>for comprehension: cross product</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x <- xs; y <- ys) {
  val div = x / y.toFloat
  println("%d/%d = %.1f".format(x, y, div))
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
      <td><span class="label success">Good</span><br> <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y 
}</code></pre><br /> <span class="label important">Bad</span><br> <pre class="highlight"><code>(xs zip ys) map {
  (x, y) =&gt; x * y
}</code></pre></td>
      <td>use case in function args for pattern matching.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case v42 =&gt; println("42")
  case _   =&gt; println("Not 42")
}</code></pre></td>
      <td>“v42” is interpreted as a name matching any Int value, and “42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case `v42` =&gt; println("42")
  case _     =&gt; println("Not 42")
}</code></pre></td>
      <td>”`v42`” with backticks is interpreted as the existing val <pre class="highlight"><code>v42</code></pre>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span class="label success">Good</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
3 match {
  case UppercaseVal =&gt; println("42")
  case _            =&gt; println("Not 42")
}</code></pre></td>
      <td><pre class="highlight"><code>UppercaseVal</code></pre> is treated as an existing val, rather than a new pattern variable, because it starts with an uppercase letter. Thus, the value contained within <pre class="highlight"><code>UppercaseVal</code></pre> is checked against <pre class="highlight"><code>3</code></pre>, and “Not 42” is printed.</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">object orientation</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(x: R)</code></pre></td>
      <td>constructor params - <pre class="highlight"><code>x</code></pre> is only available in class body</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(val x: R)</code></pre><br /><pre class="highlight"><code>var c = new C(4)</code></pre><br /><pre class="highlight"><code>c.x</code></pre></td>
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
      <td><pre class="highlight"><code>new {
  ...
}</code></pre></td>
      <td>anonymous class</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>abstract class D { ... }</code></pre></td>
      <td>define an abstract class. (non-createable)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { ... }</code></pre></td>
      <td>define an inherited class.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class D(var x: R)</code></pre><br /><pre class="highlight"><code>class C(x: R) extends D(x)</code></pre></td>
      <td>inheritance and constructor params. (wishlist: automatically pass-up params by default)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>object O extends D { ... }</code></pre></td>
      <td>define a singleton. (module-like)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T { ... }</code></pre><br /><pre class="highlight"><code>class C extends T { ... }</code></pre><br /><pre class="highlight"><code>class C extends D with T { ... }</code></pre></td>
      <td>traits.<br />interfaces-with-implementation. no constructor params. <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">mixin-able</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T1; trait T2</code></pre><br /><pre class="highlight"><code>class C extends T1 with T2</code></pre><br /><pre class="highlight"><code>class C extends D with T1 with T2</code></pre></td>
      <td>multiple traits.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { override def f = ...}</code></pre></td>
      <td>must declare method overrides.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new java.io.File("f")</code></pre></td>
      <td>create object.</td>
    </tr>
    <tr>
      <td><span class="label important">Bad</span><br> <pre class="highlight"><code>new List[Int]</code></pre><br /> <span class="label success">Good</span><br> <pre class="highlight"><code>List(1, 2, 3)</code></pre></td>
      <td>type error: abstract type<br />instead, convention: callable factory shadowing the type</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>classOf[String]</code></pre></td>
      <td>class literal.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.isInstanceOf[String]</code></pre></td>
      <td>type check (runtime)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.asInstanceOf[String]</code></pre></td>
      <td>type cast (runtime)</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x: String</code></pre></td>
      <td>ascription (compile time)</td>
      <td> </td>
    </tr>
    <tr>
      <td><span id="options" class="h2">options</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Some(42)</code></pre></td>
      <td>Construct a non empty optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>None</code></pre></td>
      <td>The singleton empty optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Option(null) == None
Option(obj.unsafeMethod)</code></pre></td>
      <td>Null-safe optional value factory</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val optStr: Option[String] = None</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>val optStr = Option.empty[String]</code></pre></td>
      <td>Explicit type for empty optional value.<br /> Factory for empty optional value.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val name: Option[String] =
  request.getParameter("name")
val upper = name.map {
  _.trim
}
.filter {
  _.length != 0
}
.map {
  _.toUpperCase
}
println(upper.getOrElse(""))
</code></pre></td>
      <td>Pipeline style</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val upper = for {
  name <- request.getParameter("name")
  trimmed <- Some(name.trim)
    if trimmed.length != 0
  upper <- Some(trimmed.toUpperCase)
} yield upper
println(upper.getOrElse(""))</code></pre></td>
      <td>for-comprehension syntax</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.map(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(f(x))
  case None    =&gt; None
}</code></pre></td>
      <td>Apply a function on the optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.flatMap(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; None
}</code></pre></td>
      <td>Same as map but function must return an optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>optionOfOption.flatten</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>optionOfOption match {
  case Some(Some(x)) =&gt; Some(x)
  case _             =&gt; None
}</code></pre></td>
      <td>Extract nested option</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.foreach(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; ()
}</code></pre></td>
      <td>Apply a procedure on optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.fold(y)(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; y
}</code></pre></td>
      <td>Apply function on optional value, return default if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.collect {
  case x =&gt; ...
}</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x)
    if f.isDefinedAt(x) =&gt; ...
  case Some(_)          =&gt; None
  case None             =&gt; None
}</code></pre></td>
      <td>Apply partial pattern match on optional value</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isDefined</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td>True if not empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isEmpty</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; false
  case None    =&gt; true
}</code></pre></td>
      <td>True if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.nonEmpty</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td>True if not empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.size</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; 1
  case None    =&gt; 0
}</code></pre></td>
      <td>Zero if empty, otherwise one</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orElse(Some(y))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(x)
  case None    =&gt; Some(y)
}</code></pre></td>
      <td>Evaluate and return alternate optional value if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.getOrElse(y)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; y
}</code></pre></td>
      <td>Evaluate and return default value if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.get</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; throw new Exception
}</code></pre></td>
      <td>Return value, throw exception if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orNull</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; null
}</code></pre></td>
      <td>Return value, null if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filter(f)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; Some(x)
  case _               =&gt; None
}</code></pre></td>
      <td>Optional value satisfies predicate</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filterNot(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if !f(x) =&gt; Some(x)
  case _                =&gt; None
}</code></pre></td>
      <td>Optional value doesn't satisfy predicate</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.exists(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case _               =&gt; false
}</code></pre></td>
      <td>Apply predicate on optional value or false if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.forall(f(_))</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case None            =&gt; false
}</code></pre></td>
      <td>Apply predicate on optional value or true if empty</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.contains(y)</code></pre>
      <em><strong>same as</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x == y
  case None    =&gt; false
}</code></pre></td>
      <td>Checks if value equals optional value or false if empty</td>
    </tr>
  </tbody>
</table>
