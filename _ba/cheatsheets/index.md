---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Brendan O'Connor
about: Zahvaljujući <a href="http://brenocon.com/">Brendan O'Connor</a>u ovaj cheatsheet teži da bude kratki pregled sintakse Scale. Licenca pripada Brendan O'Connor-u, pod CC-BY-SA 3.0 licencom.

language: ba
---

###### Doprinio {{ page.by }}
{{ page.about }}

|  <span id="variables" class="h2">varijable</span>                                                                       |                 |
|  `var x = 5`                                                                                             |  varijabla.       |
|  <span class="label success">Dobro</span> `val x = 5`<br> <span class="label important">Loše</span> `x=6`  |  konstanta.       |
|  `var x: Double = 5`                                                                                     |  eksplicitni tip.  |
|  <span id="functions" class="h2">funkcije</span>                                                                       |                 |
|  <span class="label success">Dobro</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Loše</span> `def f(x: Int)   { x*x }` |  definicija funkcije. <br> skrivena greška: bez `=` ovo je procedura koja vraća `Unit`; uzrokuje zabunu. |
|  <span class="label success">Dobro</span> `def f(x: Any) = println(x)`<br> <span class="label important">Loše</span> `def f(x) = println(x)` |  definicija funkcije. <br> sintaksna greška: potrebni su tipovi za svaki argument. |
|  `type R = Double`                                                                                       |  pseudonim za tip.     |
|  `def f(x: R)` ili<br> `def f(x: => R)`                                                                  |  poziv-po-vrijednosti. <br> poziv-po-imenu (lijeni parameteri). |
|  `(x:R) => x*x`                                                                                          |  anonimna funkcija.  |
|  `(1 to 5).map(_*2)` ili<br> `(1 to 5).reduceLeft( _+_ )`                                                |  anonimna funkcija: donja crta odgovara argumentu po poziciji. |
|  `(1 to 5).map( x => x*x )`                                                                              |  anonimna funkcija: da bi koristili argument više od jednom, morate mu dati ime. |
|  <span class="label success">Dobro</span> `(1 to 5).map(2*)`<br> <span class="label important">Loše</span> `(1 to 5).map(*2)` |  anonimna funkcija: vezana infiksna metoda. Koristite `2*_` zbog jasnoće. |
|  `(1 to 5).map { x => val y=x*2; println(y); y }`                                                             |  anonimna funkcija: blokovski stil vraća vrijednost zadnjeg izraza. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  anonimne funkcije: pipeline stil (može i sa oblim zagradama). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  anonimne funkcije: da bi proslijedili više blokova, potrebne su dodatne zagrade. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  curry-jevanje, očita sintaksa. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  curry-jevanje, očita sintaksa. |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  curry-jevanje, sintaksni šećer (kratica). Ali onda: |
|  `val normer = zscore(7, 0.4) _`                                                                          |  je potrebna prateća donja crta za parcijalnu primjenu, samo kod šećer (skraćene) verzije. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  generički tip. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  infiksni šećer. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  varirajući broj argumenata (varargs). |
|  <span id="packages" class="h2">paketi</span>                                                                         |                 |
|  `import scala.collection._`                                                                             |  džoker (wildcard) import. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  selektivni import. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  preimenujući import. |
|  `import java.util.{Date => _, _}`                                                                       |  import svega iz `java.util` paketa osim `Date`. |
|  `package pkg` _na početku fajla_ <br> `package pkg { ... }`                                             |  deklaracija paketa. |
|  <span id="data_structures" class="h2">strukture podataka</span>                                                           |                 |
|  `(1,2,3)`                                                                                               |  torka (tuple) literal (`Tuple3`). |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  destrukturirajuće vezivanje: otpakivanje torke podudaranjem uzoraka (pattern matching). |
|  <span class="label important">Loše</span>`var x,y,z = (1,2,3)`                                           |  skrivena greška: svim varijablama dodijeljena cijela torka. |
|  `var xs = List(1,2,3)`                                                                                  |  lista (nepromjenjiva). |
|  `xs(2)`                                                                                                 |  indeksiranje zagradama ([slajdovi](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)). |
|  `1 :: List(2,3)`                                                                                        |  cons. |
|  `1 to 5` _isto kao_ `1 until 6` <br> `1 to 10 by 2`                                                      |  šećer za raspon (range). |
|  `()` _(prazne zagrade)_                                                                                   |  jedina instanca Unit tipa (slično kao u C/Java void). |
|  <span id="control_constructs" class="h2">kontrolne strukture</span>                                                     |                 |
|  `if (check) happy else sad`                                                                             |  uslov. |
|  `if (check) happy` _isto kao_ <br> `if (check) happy else ()`                                            |  sintaksni šećer za uslov. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  while petlja. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  do while petlja. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break ([slajdovi](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)). |
|  `for (x <- xs if x%2 == 0) yield x*10` _isto kao_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  for komprehensija: filter/map. |
|  `for ((x,y) <- xs zip ys) yield x*y` _isto kao_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  for komprehensija: destrukturirajuće vezivanje. |
|  `for (x <- xs; y <- ys) yield x*y` _isto kao_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  for komprehensija: međuproizvod (vektorski proizvod). |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`                     |  for komprehensija: imperativ-asto.<br>[sprintf-stil.](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  for komprehensija: iteracija uključujući gornju granicu. |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  for komprehensija: iteracija ne uključujući gornju granicu. |
|  <span id="pattern_matching" class="h2">podudaranje uzoraka (pattern matching)</span>                                                         |                 |
|  <span class="label success">Dobro</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Loše</span> `(xs zip ys) map( (x,y) => x*y )` |  slučaj korištenja u argumentima funkcije. |
|  <span class="label important">Loše</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" interpretira se kao ime koje odgovara bilo kojoj vrijednosti Int, i "42" se prikazuje. |
|  <span class="label success">Dobro</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" s kosim apostrofima interpretira se kao postojeća val `v42`, i "Not 42" se prikazuje. |
|  <span class="label success">Dobro</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal` tretira se kao postojeća val, a ne kao nova vrijednost uzorka, zato što počinje velikim slovom. Stoga, vrijednost u `UppercaseVal` se poredi sa `3`, i "Not 42" se prikazuje. |
|  <span id="object_orientation" class="h2">objektna orijentisanost</span>                                                     |                 |
|  `class C(x: R)` _isto kao_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                         |  parameteri konstruktora - privatni. |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  parameteri konstruktora - javni. |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>konstruktor je tijelo klase.<br>deklaracija javnog člana. <br> deklaracija dostupnog ali nepromjenjivog člana<br>deklaracija privatnog člana.<br>alternativni konstruktor.|
|  `new{ ... }`                                                                                            |  anonimna klasa. |
|  `abstract class D { ... }`                                                                              |  definicija apstraktne klase (ne može se kreirati). |
|  `class C extends D { ... }`                                                                             |  definicija nasljedne klase. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  nasljeđivanje i parameteri konstruktora (lista želja: automatsko prosljeđivanje parametara...).
|  `object O extends D { ... }`                                                                            |  definicija singletona (kao modul). |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  trejtovi.<br>interfejs-s-implementacijom. Bez parametara konstruktora. [Miksabilan]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  više trejtova. |
|  `class C extends D { override def f = ...}`	                                                           |  moraju se deklarisati prebrisane metode. |
|  `new java.io.File("f")`                   	                                                           |  kreiranje objekta. |
|  <span class="label important">Loše</span> `new List[Int]`<br> <span class="label success">Dobro</span> `List(1,2,3)` |  greška tipa: apstraktni tip. <br> umjesto toga, konvencija: fabrika istoimenog tipa. |
|  `classOf[String]`                                                                                       |  literal za klasu. |
|  `x.isInstanceOf[String]`                                                                                |  provjera tipa (runtime). |
|  `x.asInstanceOf[String]`                                                                                |  kastovanje tipa (runtime). |
|  `x: String`                                                                                             |  askripcija (compile time). |
