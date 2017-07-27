---
layout: cheatsheet
title: Scalacheat

partof: cheatsheet

by: Brendan O'Connor
about: Grâce à  <a href="http://brenocon.com/">Brendan O'Connor</a>, ce memento vise à être un guide de référence rapide pour les constructions syntaxiques en Scala. Licencié par Brendan O'Connor sous licence CC-BY-SA 3.0.

language: fr
---

###### Contribué par {{ page.by }}
{{ page.about }}

|  <span id="variables" class="h2">variables</span>                                                                       |                     |
|  `var x = 5`                                                                                             |  variable           |
|  <span class="label success">Good</span> `val x = 5`<br> <span class="label important">Bad</span> `x=6`  |  constante          |
|  `var x: Double = 5`                                                                                     |  type explicite     |
|  <span id="functions" class="h2">fonctions</span>                                                                       |                     |
|  <span class="label success">Good</span> `def f(x: Int) = { x*x }`<br> <span class="label important">Bad</span> `def f(x: Int)   { x*x }` |  définition d'une fonction <br> erreur cachée : sans le = c'est une procédure qui retourne un Unit ; occasionnant des problèmes incontrôlés. |
|  <span class="label success">Good</span> `def f(x: Any) = println(x)`<br> <span class="label important">Bad</span> `def f(x) = println(x)` |  définition d'une fonction <br> erreur de syntaxe : chaque argument a besoin d'être typé. |
|  `type R = Double`                                                                                       |  alias de type     |
|  `def f(x: R)` vs.<br> `def f(x: => R)`                                                                  |  appel par valeur <br> appel par nom (paramètres paresseux (lazy)) |
|  `(x:R) => x*x`                                                                                          |  fonction anonyme  |
|  `(1 to 5).map(_*2)` vs.<br> `(1 to 5).reduceLeft( _+_ )`                                                |  fonction anonyme : l'underscore est associé à la position du paramètre en argument. |
|  `(1 to 5).map( x => x*x )`                                                                              |  fonction anonyme : pour utiliser un argument deux fois, il faut le nommer. |
|  <span class="label success">Good</span> `(1 to 5).map(2*)`<br> <span class="label important">Bad</span> `(1 to 5).map(*2)` |  fonction anonyme :  méthode bornée et infixée. Pour votre santé, préférez la syntaxe `2*_`. |
|  `(1 to 5).map { x => val y=x*2; println(y); y }`                                                        |  fonction anonyme : la dernière expression d'un bloc est celle qui est retournée. |
|  `(1 to 5) filter {_%2 == 0} map {_*2}`                                                                  |  fonctions anonymes : style "pipeline". (ou avec des parenthèses). |
|  `def compose(g:R=>R, h:R=>R) = (x:R) => g(h(x))` <br> `val f = compose({_*2}, {_-1})`                   |  fonctions anonymes : pour passer plusieurs blocs, il faut les entourer par des parenthèses. |
|  `val zscore = (mean:R, sd:R) => (x:R) => (x-mean)/sd`                                                   |  curryfication, syntaxe évidente. |
|  `def zscore(mean:R, sd:R) = (x:R) => (x-mean)/sd`                                                       |  curryfication, syntaxe évidente. |
|  `def zscore(mean:R, sd:R)(x:R) = (x-mean)/sd`                                                           |  curryfication, sucre syntaxique. mais alors : |
|  `val normer = zscore(7, 0.4) _`                                                                         |  il faut ajouter l'underscore dans la fonction partielle, mais ceci uniquement pour la version avec le sucre syntaxique. |
|  `def mapmake[T](g:T=>T)(seq: List[T]) = seq.map(g)`                                                     |  type générique. |
|  `5.+(3); 5 + 3` <br> `(1 to 5) map (_*2)`                                                               |  sucre syntaxique pour opérateurs infixés. |
|  `def sum(args: Int*) = args.reduceLeft(_+_)`                                                            |  arguments variadiques. |
|  <span id="packages" class="h2">paquetages</span>                                                                       |                 |
|  `import scala.collection._`                                                                             |  import global. |
|  `import scala.collection.Vector` <br> `import scala.collection.{Vector, Sequence}`                      |  import sélectif. |
|  `import scala.collection.{Vector => Vec28}`                                                             |  renommage d'import. |
|  `import java.util.{Date => _, _}`                                                                       |  importe tout de java.util excepté Date. |
|  `package pkg` _en début de fichier_ <br> `package pkg { ... }`                                          |  déclare un paquetage. |
|  <span id="data_structures" class="h2">structures de données</span>                                                      |                 |
|  `(1,2,3)`                                                                                               |  tuple littéral. (`Tuple3`) |
|  `var (x,y,z) = (1,2,3)`                                                                                 |  liaison déstructurée : le déballage du tuple se fait par le "pattern matching". |
|  <span class="label important">Bad</span>`var x,y,z = (1,2,3)`                                           |  erreur cachée : chaque variable est associée au tuple au complet. |
|  `var xs = List(1,2,3)`                                                                                  |  liste (immuable). |
|  `xs(2)`                                                                                                 |  indexe un élément par le biais des parenthèses. ([transparents](http://www.slideshare.net/Odersky/fosdem-2009-1013261/27)) |
|  `1 :: List(2,3)`                                                                                        |  créé une liste par le biais de l'opérateur "cons".|
|  `1 to 5` _est équivalent à_ `1 until 6` <br> `1 to 10 by 2`                                             |  sucre syntaxique pour les plages de valeurs. |
|  `()` _(parenthèses vides)_                                                                              |  l'unique membre de type Unit  (à l'instar de void en C/Java). |
|  <span id="control_constructs" class="h2">structures de constrôle</span>                                                |                 |
|  `if (check) happy else sad`                                                                             |  test conditionnel. |
|  `if (check) happy` _est équivalent à_ <br> `if (check) happy else ()`                                   |  sucre syntaxique pour un test conditionnel. |
|  `while (x < 5) { println(x); x += 1}`                                                                   |  boucle while. |
|  `do { println(x); x += 1} while (x < 5)`                                                                |  boucle do while. |
|  `import scala.util.control.Breaks._`<br>`breakable {`<br>`    for (x <- xs) {`<br>`        if (Math.random < 0.1) break`<br>`    }`<br>`}`|  break. ([transparents](http://www.slideshare.net/Odersky/fosdem-2009-1013261/21)) |
|  `for (x <- xs if x%2 == 0) yield x*10` _est équivalent à_ <br>`xs.filter(_%2 == 0).map(_*10)`                    |  *for comprehension*: filter/map |
|  `for ((x,y) <- xs zip ys) yield x*y` _est équivalent à_ <br>`(xs zip ys) map { case (x,y) => x*y }`              |  *for comprehension* : liaison déstructurée |
|  `for (x <- xs; y <- ys) yield x*y` _est équivalent à_ <br>`xs flatMap {x => ys map {y => x*y}}`                  |  *for comprehension* : produit cartésien. |
|  `for (x <- xs; y <- ys) {`<br>    `println("%d/%d = %.1f".format(x, y, x/y.toFloat))`<br>`}`                     |  *for comprehension* : à la manière impérative <br>[sprintf-style](http://java.sun.com/javase/6/docs/api/java/util/Formatter.html#syntax) |
|  `for (i <- 1 to 5) {`<br>    `println(i)`<br>`}`                                                        |  *for comprehension* : itère jusqu'à la borne supérieure comprise. |
|  `for (i <- 1 until 5) {`<br>    `println(i)`<br>`}`                                                     |  *for comprehension* : itère jusqu'à la borne supérieure non comprise. |
|  <span id="pattern_matching" class="h2">pattern matching</span>                                                         |                 |
|  <span class="label success">Good</span> `(xs zip ys) map { case (x,y) => x*y }`<br> <span class="label important">Bad</span> `(xs zip ys) map( (x,y) => x*y )` |  cas d’utilisation d’une fonction utilisée avec un "pattern matching". |
|  <span class="label important">Bad</span><br>`val v42 = 42`<br>`Some(3) match {`<br>`  case Some(v42) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  "v42" est interprété comme un nom ayant n’importe quelle valeur de type Int, donc "42" est affiché. |
|  <span class="label success">Good</span><br>`val v42 = 42`<br>`Some(3) match {`<br>``    case Some(`v42`) => println("42")``<br>`case _ => println("Not 42")`<br>`}`  |  "\`v42\`" x les "backticks" est interprété avec la valeur de val `v42`, et "Not 42" est affiché. |
|  <span class="label success">Good</span><br>`val UppercaseVal = 42`<br>`Some(3) match {`<br>`  case Some(UppercaseVal) => println("42")`<br>`    case _ => println("Not 42")`<br>`}` |  `UppercaseVal`i est traité avec la valeur contenue dans val, plutôt qu’un nouvelle variable du "pattern", parce que cela commence par une lettre en capitale. Ainsi, la valeur contenue dans `UppercaseVal` est comparée avec `3`, et "Not 42" est affiché. |
|  <span id="object_orientation" class="h2">l'orienté objet</span>                                                        |                 |
|  `class C(x: R)` _est équivalent à_ <br>`class C(private val x: R)`<br>`var c = new C(4)`                |  paramètres du constructeur - privé |
|  `class C(val x: R)`<br>`var c = new C(4)`<br>`c.x`                                                      |  paramètres du constructeur - public |
|  `class C(var x: R) {`<br>`assert(x > 0, "positive please")`<br>`var y = x`<br>`val readonly = 5`<br>`private var secret = 1`<br>`def this = this(42)`<br>`}`|<br>le constructeur est dans le corps de la classe<br>déclare un membre public<br>déclare un accesseur<br>déclare un membre privé<br>constructeur alternatif |
|  `new{ ... }`                                                                                            |  classe anonyme |
|  `abstract class D { ... }`                                                                              |  définition d’une classe abstraite. (qui n’est pas instanciable). |
|  `class C extends D { ... }`                                                                             |  définition d’une classe qui hérite d’une autre. |
|  `class D(var x: R)`<br>`class C(x: R) extends D(x)`                                                     |  héritage et constructeurs paramétrés. (souhaits : pouvoir passer les paramètres automatiquement par défaut).
|  `object O extends D { ... }`                                                                            |  définition d’un singleton. (à la manière d'un module) |
|  `trait T { ... }`<br>`class C extends T { ... }`<br>`class C extends D with T { ... }`                  |  traits.<br>interfaces avec implémentation. constructeur sans paramètre. [mixin-able]({{ site.baseurl }}/tutorials/tour/mixin-class-composition.html).
|  `trait T1; trait T2`<br>`class C extends T1 with T2`<br>`class C extends D with T1 with T2`             |  multiple traits. |
|  `class C extends D { override def f = ...}`	                                                           |  doit déclarer une méthode surchargée. |
|  `new java.io.File("f")`                   	                                                           |  créé un objet. |
|  <span class="label important">Bad</span> `new List[Int]`<br> <span class="label success">Good</span> `List(1,2,3)` |  erreur de typage : type abstrait<br> : au contraire, par convention : la fabrique appelée masque le typage.|
|  `classOf[String]`                                                                                       |  classe littérale. |
|  `x.isInstanceOf[String]`                                                                                |  vérification de types (à l’exécution) |
|  `x.asInstanceOf[String]`                                                                                |  "casting" de type (à l’exécution) |
|  `x: String`                                                                                             |  attribution d’un type (à la compilation) |
