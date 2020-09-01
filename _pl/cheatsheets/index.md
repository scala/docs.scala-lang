---
layout: cheatsheet
title: Scala Cheatsheet

partof: cheatsheet

by: Filip Czaplicki, Konrad Klawikowski
about: Podziękowania dla <a href="https://brenocon.com/">Brendan O'Connor</a>. Ten cheatsheet ma być szybkim podsumowaniem konstrukcji składniowych Scali. Licencjonowany przez Brendan O'Connor pod licencją CC-BY-SA 3.0.

language: pl
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
      <td><span id="variables" class="h2">zmienne</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x = 5</code></pre><br /> <span class="label success">Dobrze</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Zmienna.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val x = 5</code></pre><br /> <span class="label important">Źle</span><br><pre class="highlight"><code>x = 6</code></pre></td>
      <td>Stała.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var x: Double = 5</code></pre></td>
      <td>Zmienna z podanym typem.</td>
    </tr>
    <tr>
      <td><span id="functions" class="h2">funkcje</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br> <pre class="highlight"><code>def f(x: Int) = { x * x }</code></pre><br /> <span class="label important">Źle</span><br> <pre class="highlight"><code>def f(x: Int)   { x * x }</code></pre></td>
      <td>Definiowanie funkcji.<br />Ukryty błąd: bez znaku <code>=</code> jest procedurą zwracającą <code>Unit</code>; powoduje to chaos. <a href="https://github.com/scala/scala/pull/6325">Przestarzałe</a> w Scali 2.13.</td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br> <pre class="highlight"><code>def f(x: Any) = println(x)</code></pre><br /> <span class="label important">Źle</span><br> <pre class="highlight"><code>def f(x) = println(x)</code></pre></td>
      <td>Definiowanie funkcji.<br />Błąd składni: wymagane są typy dla każdego argumentu.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>type R = Double</code></pre></td>
      <td>Alias typu.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def f(x: R)</code></pre> vs.<br /> <pre class="highlight"><code>def f(x: =&gt; R)</code></pre></td>
      <td>Wywoływanie przez wartość.<br /><br />Wywoływanie przez nazwę (parametr leniwy).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(x: R) =&gt; x * x</code></pre></td>
      <td>Funkcja anonimowa.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(_ * 2)</code></pre> vs.<br /> <pre class="highlight"><code>(1 to 5).reduceLeft(_ + _)</code></pre></td>
      <td>Funkcja anonimowa: podkreślenie to argument pozycyjny.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map(x =&gt; x * x)</code></pre></td>
      <td>Funkcja anonimowa: aby użyć argumentu dwa razy, musisz go nazwać</td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br> <pre class="highlight"><code>(1 to 5).map(2*)</code></pre><br /> <span class="label important">Źle</span><br> <pre class="highlight"><code>(1 to 5).map(*2)</code></pre></td>
      <td>Funkcja anonimowa: związana metoda infiksowa. Możesz użyć także <code>2 * _</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5).map { x =&gt;
  val y = x * 2
  println(y)
  y
}</code></pre></td>
      <td>Funkcja anonimowa: z bloku zwracane jest ostatnie wyrażenie.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1 to 5) filter {
  _ % 2 == 0
} map {
  _ * 2
}</code></pre></td>
      <td>Funkcja anonimowa: styl potokowy.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def compose(g: R =&gt; R, h: R =&gt; R) =
  (x: R) =&gt; g(h(x))</code></pre> <br /> <pre class="highlight"><code>val f = compose(_ * 2, _ - 1)</code></pre></td>
      <td>Funkcja anonimowa: aby przekazać kilka bloków musisz użyć nawiasów.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val zscore =
  (mean: R, sd: R) =&gt;
    (x: R) =&gt;
      (x - mean) / sd</code></pre></td>
      <td>Rozwijanie funkcji, oczywista składnia.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R) =
  (x: R) =&gt;
    (x - mean) / sd</code></pre></td>
      <td>Rozwijanie funkcji, oczywista składnia</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def zscore(mean: R, sd: R)(x: R) =
  (x - mean) / sd</code></pre></td>
      <td>Rozwijanie funkcji, lukier składniowy, ale wtedy:</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val normer =
  zscore(7, 0.4) _</code></pre></td>
      <td>Potrzeba podążającego podkreślenia, aby wydobyć funkcję częściowo zaaplikowaną, tylko przy wersji z lukrem składniowym.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def mapmake[T](g: T =&gt; T)(seq: List[T]) =
  seq.map(g)</code></pre></td>
      <td>Typ generyczny.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>5.+(3); 5 + 3</code></pre> <br /> <pre class="highlight"><code>(1 to 5) map (_ * 2)</code></pre></td>
      <td>Lukier składniowy dla operatorów infiksowych.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>def sum(args: Int*) =
  args.reduceLeft(_+_)</code></pre></td>
      <td>Zmienna liczba argumentów.</td>
    </tr>
    <tr>
      <td><span id="packages" class="h2">pakiety</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection._</code></pre></td>
      <td>Import wszystkiego z pakietu.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.Vector</code></pre> <br /> <pre class="highlight"><code>import scala.collection.{Vector, Sequence}</code></pre></td>
      <td>Import selektywny.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.collection.{Vector =&gt; Vec28}</code></pre></td>
      <td>Import ze zmianą nazwy.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import java.util.{Date =&gt; _, _}</code></pre></td>
      <td>Importowanie wszystkiego z <code>java.util</code> poza <code>Date</code>.</td>
    </tr>
    <tr>
      <td><em>Na początku pliku:</em> <pre class="highlight"><code>package pkg</code></pre><br /> <em>Definiowanie pakietu według zakresu: </em> <pre class="highlight"><code>package pkg {
  ...
}</code></pre><br /><em>Singleton dla pakietu: </em> <pre class="highlight"><code>package object pkg {
  ...
}</code></pre></td>
      <td>Deklaracja pakietu.</td>
    </tr>
    <tr>
      <td><span id="data_structures" class="h2">struktury danych</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>(1, 2, 3)</code></pre></td>
      <td>Literał krotki (<code class="highlighter-rouge">Tuple3</code>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var (x, y, z) = (1, 2, 3)</code></pre></td>
      <td>Przypisanie z podziałem: rozpakowywanie krotki przy pomocy dopasowywania wzorca.</td>
    </tr>
    <tr>
      <td><span class="label important">Źle</span><br><pre class="highlight"><code>var x, y, z = (1, 2, 3)</code></pre></td>
      <td>Ukryty błąd: do każdego przypisana cała krotka.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>var xs = List(1, 2, 3)</code></pre></td>
      <td>Lista (niezmienna).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>xs(2)</code></pre></td>
      <td>Indeksowanie za pomocą nawiasów (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/27">slajdy</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 :: List(2, 3)</code></pre></td>
      <td>Operator dołożenia elementu na początek listy.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>1 to 5</code></pre> <em>to samo co:</em> <pre class="highlight"><code>1 until 6</code></pre> <br /> <pre class="highlight"><code>1 to 10 by 2</code></pre></td>
      <td>Składnia dla przedziałów.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>()</code></pre></td>
      <td>Jedyny obiekt typu Unit. <br />Identyczny do <code class="highlighter-rouge">void</code> w C i Java.</td>
    </tr>
    <tr>
      <td><span id="control_constructs" class="h2">konstrukcje kontrolne</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy else sad</code></pre></td>
      <td>Warunek.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>if (check) happy</code></pre>
      <br><em><strong>to samo co:</strong></em><br>
      <pre class="highlight"><code>if (check) happy else ()</code></pre></td>
      <td>Lukier składniowy dla warunku.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>while (x &lt; 5) {
  println(x)
  x += 1
}</code></pre></td>
      <td>Pętla while.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>do {
  println(x)
  x += 1
} while (x &lt; 5)</code></pre></td>
      <td>Pętla do-while.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>import scala.util.control.Breaks._

breakable {
  for (x &lt;- xs) {
    if (Math.random &lt; 0.1)
      break
  }
}</code></pre></td>
      <td>Instrukcja przerwania pętli (<a href="https://www.slideshare.net/Odersky/fosdem-2009-1013261/21">slajdy</a>).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs if x % 2 == 0)
  yield x * 10</code></pre>
      <br><em><strong>to samo co:</strong></em><br>
      <pre class="highlight"><code>xs.filter(_ % 2 == 0).map(_ * 10)</code></pre></td>
      <td>Intrukcja for: filtrowanie/mapowanie.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for ((x, y) &lt;- xs zip ys)
  yield x * y</code></pre>
      <br><em><strong>to samo co: </strong></em><br>
      <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre></td>
      <td>Instrukcja for: przypisanie z podziałem.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys)
  yield x * y</code></pre>
      <br><em><strong>to samo co: </strong></em><br>
      <pre class="highlight"><code>xs flatMap { x =&gt;
  ys map { y =&gt;
    x * y
  }
}</code></pre></td>
      <td>Instrukcja for: iloczyn kartezjański.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (x &lt;- xs; y &lt;- ys) {
  val div = x / y.toFloat
  println("%d/%d = %.1f".format(x, y, div))
}</code></pre></td>
      <td>Instrukcja for: imperatywnie.<br /><a href="https://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax"><code>sprintf</code> style</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 to 5) {
  println(i)
}</code></pre></td>
      <td>Instrukcja for: iterowanie aż do górnej granicy włącznie.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>for (i &lt;- 1 until 5) {
  println(i)
}</code></pre></td>
      <td>Instrukcja for: iterowanie poniżej górnej granicy.</td>
    </tr>
    <tr>
      <td><span id="pattern_matching" class="h2">pattern matching (dopasowywanie wzorca)</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br> <pre class="highlight"><code>(xs zip ys) map {
  case (x, y) =&gt; x * y
}</code></pre><br /> <span class="label important">Źle</span><br> <pre class="highlight"><code>(xs zip ys) map {
  (x, y) =&gt; x * y
}</code></pre></td>
      <td>Używaj słowa kluczowego <code>case</code> w funkcjach w celu dopasowywania wzorca.</td>
    </tr>
    <tr>
      <td><span class="label important">Źle</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case v42 =&gt; println("42")
  case _   =&gt; println("Not 42")
}</code></pre></td>
      <td><code>v42</code> jest interpretowane jako nazwa pasująca do każdej wartości typu Int, więc "42" zostaje wypisywane.</td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br>
      <pre class="highlight"><code>val v42 = 42
3 match {
  case `v42` =&gt; println("42")
  case _     =&gt; println("Not 42")
}</code></pre></td>
      <td><code>`v42`</code> z grawisami jest interpretowane jako istniejąca wartość<code>v42</code>, więc “Not 42” zostaje wypisywane.</td>
    </tr>
    <tr>
      <td><span class="label success">Dobrze</span><br>
      <pre class="highlight"><code>val UppercaseVal = 42
3 match {
  case UppercaseVal =&gt; println("42")
  case _            =&gt; println("Not 42")
}</code></pre></td>
      <td><code>UppercaseVal</code> jest traktowane jako istniejąca wartość, nie jako zmienna wzorca, bo zaczyna się z wielkiej litery. W takim razie wartość przechowywana w <code>UppercaseVal</code> jest porównywana z <code>3</code>, więc “Not 42” jest wypisywane.</td>
    </tr>
    <tr>
      <td><span id="object_orientation" class="h2">obiektowość</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(x: R)</code></pre></td>
      <td>Parametry konstruktora <code>x</code> - prywatne.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(val x: R)</code></pre><br /><pre class="highlight"><code>var c = new C(4)</code></pre><br /><pre class="highlight"><code>c.x</code></pre></td>
      <td>Parametry konstruktora - publiczne.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C(var x: R) {
  assert(x > 0, "positive please")
  var y = x
  val readonly = 5
  private var secret = 1
  def this = this(42)
}</code></pre></td>
      <td>Konstruktor jest ciałem klasy.<br />Deklaracja publicznego pola.<br />Deklaracja publicznej stałej.<br />Deklaracja pola prywatnego.<br />Alternatywny konstruktor.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new {
  ...
}</code></pre></td>
      <td>Instancja klasy anonimowej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>abstract class D { ... }</code></pre></td>
      <td>Defiicja klasy abstrakcyjnej (nie da się stworzyć obiektu tej klasy).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { ... }</code></pre></td>
      <td>Definicja klasy pochodnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class D(var x: R)</code></pre><br /><pre class="highlight"><code>class C(x: R) extends D(x)</code></pre></td>
      <td>Dziedziczenie i parametry konstruktora (wishlist: domyślne, automatyczne przekazywanie parametrów).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>object O extends D { ... }</code></pre></td>
      <td>Definicja singletona (w stylu modułu).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T { ... }</code></pre><br /><pre class="highlight"><code>class C extends T { ... }</code></pre><br /><pre class="highlight"><code>class C extends D with T { ... }</code></pre></td>
      <td>Cechy.<br />Interface'y z implementacją. Bez parametrów konstruktora. <a href="{{site.baseurl}}/tutorials/tour/mixin-class-composition.html">Możliwość mixin'ów</a>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>trait T1; trait T2</code></pre><br /><pre class="highlight"><code>class C extends T1 with T2</code></pre><br /><pre class="highlight"><code>class C extends D with T1 with T2</code></pre></td>
      <td>Wiele cech.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>class C extends D { override def f = ...}</code></pre></td>
      <td>W przeciążeniach funkcji wymagane jest słowo kluczowe <code>override</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>new java.io.File("f")</code></pre></td>
      <td>Tworzenie obiektu.</td>
    </tr>
    <tr>
      <td><span class="label important">Źle</span><br> <pre class="highlight"><code>new List[Int]</code></pre><br /> <span class="label success">Dobrze</span><br> <pre class="highlight"><code>List(1, 2, 3)</code></pre></td>
      <td>Błąd typu: typ abstrakcyjny.<br />Zamiast tego konwencja: wywoływalna fabryka przysłaniająca typ.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>classOf[String]</code></pre></td>
      <td>Literał klasy.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.isInstanceOf[String]</code></pre></td>
      <td>Sprawdzanie typu (w czasie wykonania).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x.asInstanceOf[String]</code></pre></td>
      <td>Rzutowanie typu (w czasie wykonania).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>x: String</code></pre></td>
      <td>Oznaczenie typu (w czasie kompilacji).</td>
      <td> </td>
    </tr>
    <tr>
      <td><span id="options" class="h2">opcje</span></td>
      <td> </td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Some(42)</code></pre></td>
      <td>Tworzenie niepustej wartości opcjonalnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>None</code></pre></td>
      <td>Pojedyncza pusta wartość opcjonalna.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>Option(null) == None
Option(obj.unsafeMethod)</code></pre>
      <em><strong>ale</strong></em>
      <pre class="highlight"><code>Some(null) != None</code></pre></td>
      <td>Fabryka wartości opcjonalnych null-safe.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val optStr: Option[String] = None</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>val optStr = Option.empty[String]</code></pre></td>
      <td>Jawny typ pustej wartości opcjonalnej<br /> Fabryka dla pustej wartości opcjonalnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val name: Option[String] =
  request.getParameter("name")
val upper = name.map {
  _.trim
} filter {
  _.length != 0
} map {
  _.toUpperCase
}
println(upper.getOrElse(""))</code></pre></td>
      <td>Styl potokowy (pipeline).</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>val upper = for {
  name &lt;- request.getParameter("name")
  trimmed &lt;- Some(name.trim)
    if trimmed.length != 0
  upper &lt;- Some(trimmed.toUpperCase)
} yield upper
println(upper.getOrElse(""))</code></pre></td>
      <td>Składnia instrukcji for.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.map(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(f(x))
  case None    =&gt; None
}</code></pre></td>
      <td>Zastosuj funkcję do wartości opcjonalnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.flatMap(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; None
}</code></pre></td>
      <td>To samo co map, ale funkcja musi zwracać opcjonalną wartość.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>optionOfOption.flatten</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>optionOfOption match {
  case Some(Some(x)) =&gt; Some(x)
  case _             =&gt; None
}</code></pre></td>
      <td>Wyodrębnij opcję zagnieżdżoną.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.foreach(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; ()
}</code></pre></td>
      <td>Zastosuj procedurę na wartości opcjonalnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.fold(y)(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; f(x)
  case None    =&gt; y
}</code></pre></td>
      <td>Zastosuj funkcję do wartości opcjonalnej, zwróć wartość domyślną, jeśli pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.collect {
  case x =&gt; ...
}</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f.isDefinedAt(x) =&gt; ...
  case Some(_)                     =&gt; None
  case None                        =&gt; None
}</code></pre></td>
      <td>Zastosuj częściowe dopasowanie do wzorca dla wartości opcjonalnej.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isDefined</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> jeżeli nie jest puste.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.isEmpty</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; false
  case None    =&gt; true
}</code></pre></td>
      <td><code>true</code> jeżeli puste.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.nonEmpty</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; true
  case None    =&gt; false
}</code></pre></td>
      <td><code>true</code> jeżeli nie jest puste.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.size</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(_) =&gt; 1
  case None    =&gt; 0
}</code></pre></td>
      <td><code>0</code> jeżeli puste, w przeciwnym razie <code>1</code>.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orElse(Some(y))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; Some(x)
  case None    =&gt; Some(y)
}</code></pre></td>
      <td>Oblicz i zwróć alternatywną wartość opcjonalną, jeżeli pierwotna wartość jest pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.getOrElse(y)</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; y
}</code></pre></td>
      <td>Oblicz i zwróć wartość domyślną, jeżeli pierwotna wartość jest pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.get</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; throw new Exception
}</code></pre></td>
      <td>Zwróć wartość, jeżeli pusta to rzuć wyjątek.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.orNull</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x
  case None    =&gt; null
}</code></pre></td>
      <td>Zwróć wartość, <code>null</code> jeżeli pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filter(f)</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; Some(x)
  case _               =&gt; None
}</code></pre></td>
      <td>Wartość opcjonalna spełnia predyktat.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.filterNot(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if !f(x) =&gt; Some(x)
  case _                =&gt; None
}</code></pre></td>
      <td>Wartość opcjonalna nie spełnia predyktatu.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.exists(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; false
}</code></pre></td>
      <td>Zastosuj predyktat na wartości lub <code>false</code> jeżeli pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.forall(f(_))</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) if f(x) =&gt; true
  case Some(_)         =&gt; false
  case None            =&gt; true
}</code></pre></td>
      <td>Zastosuj predyktat na opcjonalnej wartości lub <code>true</code> jeżeli pusta.</td>
    </tr>
    <tr>
      <td><pre class="highlight"><code>option.contains(y)</code></pre>
      <em><strong>to samo co:</strong></em>
      <pre class="highlight"><code>option match {
  case Some(x) =&gt; x == y
  case None    =&gt; false
}</code></pre></td>
      <td>Sprawdź, czy wartość jest równa wartości opcjonalnej lub <code>false</code> jeżeli pusta.</td>
    </tr>
  </tbody>
</table>
