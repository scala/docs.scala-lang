---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Filip Czaplicki
about: Podziękowania dla <a href="http://brenocon.com/">Brendan O'Connor</a>. Ten cheatsheet ma być szybkim podsumowaniem konstrukcji składniowych Scali. Licencjonowany przez Brendan O'Connor pod licencją CC-BY-SA 3.0.

language: pl
---

###### Contributed by {{ page.by }}
{{ page.about }}

|  <span id="variables" class="h2">zmienne</span>                                                          |                 |
|  `var x = 5`                                                                                             |  zmienna        |
|  <span class="label success">Dobrze</span> `val x = 5`<br> <span class="label important">Źle</span> `x=6`  |  stała          |
|  `var x: Double = 5`                                                                                     |  zmienna z podanym typem |
|  <span id="functions" class="h2">funkcje</span>                                                                       |                 |
|  <span class="label success">Dobrze</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Źle</span> `def f(x: Int)   { x*x }` |  definicja funkcji <br> ukryty błąd: bez znaku = jest to procedura zwracająca Unit; powoduje to chaos |
|  <span class="label success">Dobrze</span> `def f(x: Any) = println(x)`<br> <span class="label important">Źle</span> `def f(x) = println(x)` |  definicja funkcji <br> błąd składni: potrzebne są typy dla każdego argumentu. |
|  `type R = Double`                                                                                       |  alias typu     |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  wywołanie przez wartość <br> wywołanie przez nazwę (parametry leniwe) |
|  `(x:R) => x*x`                                                                                          |  funkcja anonimowa  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  funkcja anonimowa: podkreślenie to argument pozycjonalny |
|  `(1 to 5).map( x => x*x )`                                                                              |  funkcja anonimowa: aby użyć argumentu dwa razy, musisz go nazwać. |
|  <span class="label success">Dobrze</span> `(1 to 5).map(2*)`<br> <span class="label important">Źle</span> `(1 to 5).map(*2)` |  funkcja anonimowa: związana metoda infiksowa. Możesz użyć także `2*_`. |
|  `(1 to 5).map { x => val y=x*2; println(y); y }`                                                             |  funkcja anonimowa: z bloku zwracane jest ostatnie wyrażenie. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  funkcja anonimowa: styl potokowy. (lub ponawiasowane). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  funkcja anonimowa: aby przekazać kilka bloków musisz użyć nawiasów. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  rozwijanie funkcji, oczywista składnia. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  rozwijanie funkcji, oczywista składnia. |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  rozwijanie funkcji, lukier składniowy. ale wtedy: |
|  `val normer = zscore(7, 0.4) _`                                                                          |  potrzeba wiodącego podkreślenia, aby wydobyć funkcję częściowo zaaplikowaną, tylko dla wersji z lukrem składniowym. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  typ generyczny. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  lukier składniowy dla operatorów infiksowych. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  zmienna liczba argumentów funkcji. |
|  <span id="packages" class="h2">pakiety</span>                                                                         |                 |
|  `import scala.collection._`                                                                             |  import wszystkiego z danego pakietu. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  import selektywny. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  import ze zmianą nazwy. |
|  `import java.util.{Date => _, _}`                                                                       |  importowanie wszystkiego z java.util poza Date. |
|  `package pkg` _na początku pliku_ <br> `package pkg { ... }`                                             |  deklaracja pakietu. |
|  <span id="data_structures" class="h2">struktury danych</span>                                                           |                 |
|  `(1,2,3)`                                                                                               |  literał krotki. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  przypisanie z podziałem: rozpakowywanie krotki przy pomocy dopasowywania wzorca. |
|  <span class="label important">Źle</span>`var x,y,z = (1,2,3)`                                           |  ukryty błąd: do każdego przypisana cała krotka. |
|  `var xs = List(1,2,3)`                                                                                  |  lista (niezmienna). |
|  `xs(2)`                                                                                                 |  indeksowanie za pomocą nawiasów. ([slajdy](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  operator dołożenia elementu na początek listy. |
|  `1 to 5` _to samo co_ `1 until 6` <br> `1 to 10 by 2`                                                      |  składnia dla przedziałów. |
|  `()` _(puste nawiasy)_                                                                                   |  jedyny obiekt typu Unit (podobnie jak void w C/Java). |
|  <span id="control_constructs" class="h2">konstrukcje kontrolne</span>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  warunek. |
|  `if (check) happy` _to samo co_ <br> `if (check) happy else ()`                                            |  lukier składniowy dla warunku. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  pętla while. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  pętla do while. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  instrukcja przerwania pętli (break). ([slides](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _to samo co_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  instrukcja for: filtrowanie / mapowanie |
|  `for ((x,y) <- xs zip ys) yield x*y` _to samo co_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  instrukcja for: przypisanie z podziałem |
|  `for (x <- xs; y <- ys) yield x*y` _to samo co_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  instrukcja for: iloczyn kartezjański |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`                     |  instrukcja for: imperatywnie<br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  instrukcja for: iterowanie aż do górnej granicy |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  instrukcja for: iterowanie poniżej górnej granicy |
|  <span id="pattern_matching" class="h2">pattern matching (dopasowywanie wzorca)</span>                                                         |                 |
|  <span class="label success">Dobrze</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Źle</span> `(xs zip ys) map( (x,y) => x*y )` |  używaj słowa kluczowego case w funkcjach w celu dopasowywania wzorca (pattern matching). |
|  <span class="label important">Źle</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" jest interpretowane jako nazwa pasująca do każdej wartości typu Int, więc "42" zostaje wypisywane. |
|  <span class="label success">Dobrze</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" z grawisami jest interpretowane jako istniejąca wartość `v42`, więc "Not 42" zostaje wypisywane. |
|  <span class="label success">Dobrze</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal` jest traktowane jako istniejąca wartość, nie jako zmienna wzorca, bo zaczyna się z wielkiej litery. W takim razie wartość przechowywana w `UppercaseVal` jest porównywana z `3`, więc "Not 42" zostaje wypisywane. |
|  <span id="object_orientation" class="h2">obiektowość</span>                                                     |                 |
|  `class C(x: R)` _to samo co_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  parametry konstruktora - prywatne |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  parametry konstruktora - publiczne |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br><br>konstruktor jest ciałem klasy<br>deklaracja publicznego pola<br>deklaracja publicznej stałej<br>deklaracja pola prywatnego<br>alternatywny konstruktor|
|  `new{ ... }`                                                                                            |  klasa anonimowa |
|  `abstract class D { ... }`                                                                              |  definicja klasy abstrakcyjnej. (nie da się stworzyć obiektu tej klasy) |
|  `class C extends D { ... }`                                                                             |  definicja klasy pochodnej. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  dziedziczenie i parametry konstruktora. (wishlist: domyślne, automatyczne przekazywanie parametrów)
|  `object O extends D { ... }`                                                                            |  definicja singletona. (w stylu modułu) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  cechy.<br>interface'y z implementacją. bez parametrów konstruktora. [możliwość mixin'ów]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  wiele cech. |
|  `class C extends D { override def f = ...}`	                                                           |  w przeciążeniach funkcji wymagane jest słowo kluczowe override. |
|  `new java.io.File("f")`                   	                                                           |  tworzenie obiektu. |
|  <span class="label important">Źle</span> `new List[Int]`<br> <span class="label success">Dobrze</span> `List(1,2,3)` |  błąd typu: typ abstrakcyjny<br>zamiast tego konwencja: wywoływalna fabryka przysłaniająca typ |
|  `classOf[String]`                                                                                       |  literał klasy. |
|  `x.isInstanceOf[String]`                                                                                |  sprawdzenie typu (w czasie wykonania) |
|  `x.asInstanceOf[String]`                                                                                |  rzutowanie typu (w czasie wykonania) |
|  `x: String`                                                                                             |  oznaczenie typu (w czasie kompilacji) |
