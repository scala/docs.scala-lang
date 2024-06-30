---
layout: tour
title: Basics
partof: scala-tour

num: 2
language: fr

next-page: unified-types
previous-page: tour-of-scala
---

Dans cette page, nous aborderons les bases de Scala.

## Essayer Scala dans le navigateur

Vous pouvez exécuter Scala dans votre navigateur avec _Scastie_. 
Il s'agit d'un moyen simple et sans configuration pour essayer des morceaux de code Scala :

1. Accédez à [Scastie](https://scastie.scala-lang.org/).
2. Collez `println("Hello, world!")` dans le volet de gauche.
3. Cliquez sur __Run__. La sortie apparaît dans le volet de droite.

_Scastie_ est intégré à certains des exemples de code de cette documentation; 
si vous voyez un bouton __Run__ dans un exemple de code ci-dessous, cliquez dessus pour expérimenter directement le code.

## Expressions

Les expressions sont des instructions calculables :

{% tabs expression %}
{% tab 'Scala 2 et 3' for=expression %}
```scala mdoc
1 + 1
```
{% endtab %}
{% endtabs %}

Vous pouvez afficher les résultats des expressions en utilisant `println` :

{% tabs println %}
{% tab 'Scala 2 et 3' for=println %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endtab %}
{% endtabs %}

### Values

Vous pouvez nommer les résultats des expressions en utilisant le mot-clé `val` :

{% tabs val %}
{% tab 'Scala 2 et 3' for=val %}
```scala mdoc
val x = 1 + 1
println(x) // 2
```
{% endtab %}
{% endtabs %}

Les résultats nommés, comme `x` ici, sont appelés valeurs. Référencer une valeur ne la recalcule pas.

Les valeurs ne peuvent pas être réaffectées :

{% tabs val-error %}
{% tab 'Scala 2 et 3' for=val-error %}
```scala mdoc:fail
x = 3 // Ne compile pas.
```
{% endtab %}
{% endtabs %}

Le type d'une valeur peut être omis et [inférer](https://docs.scala-lang.org/fr/tour/type-inference.html), ou il peut être explicitement indiqué :

{% tabs type-inference %}
{% tab 'Scala 2 et 3' for=type-inference %}
```scala mdoc:nest
val x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}

Remarquez comment la déclaration du type `Int` vient après l'identifiant `x`. 
Vous avez également besoin d'un `:`.

### Variables

Les variables sont comme des valeurs, sauf que vous pouvez les réaffecter. Vous pouvez définir une variable avec le mot-clé `var`.

{% tabs var %}
{% tab 'Scala 2 et 3' for=var %}
```scala mdoc:nest
var x = 1 + 1
x = 3 // Ce code compile car "x" est déclarée avec le mot-clé "var".
println(x * x) // 9
```
{% endtab %}
{% endtabs %}

Comme pour les valeurs, le type d'une variable peut être omis et [inférer](https://docs.scala-lang.org/fr/tour/type-inference.html), ou il peut être explicitement indiqué :

{% tabs type-inference-2 %}
{% tab 'Scala 2 et 3' for=type-inference-2 %}
```scala mdoc:nest
var x: Int = 1 + 1
```
{% endtab %}
{% endtabs %}

## Blocs

Vous pouvez combiner des expressions en les entourant de `{}`. 
Nous appelons cela un bloc.

Le résultat de la dernière expression du bloc est également le résultat du bloc global :

{% tabs blocks %}
{% tab 'Scala 2 et 3' for=blocks %}
```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```
{% endtab %}
{% endtabs %}

## Fonctions

Les fonctions sont des expressions qui ont des paramètres et acceptent des arguments.

Vous pouvez définir une fonction anonyme (c'est-à-dire une fonction sans nom) qui renvoie un entier donné plus un :

{% tabs anonymous-function %}
{% tab 'Scala 2 et 3' for=anonymous-function %}
```scala mdoc
(x: Int) => x + 1
```
{% endtab %}
{% endtabs %}

À gauche de `=>` se trouve une liste de paramètres. 
À droite se trouve une expression impliquant les paramètres.

Vous pouvez également nommer des fonctions :

{% tabs named-function %}
{% tab 'Scala 2 et 3' for=named-function %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endtab %}
{% endtabs %}

Une fonction peut avoir plusieurs paramètres :

{% tabs multiple-parameters %}
{% tab 'Scala 2 et 3' for=multiple-parameters %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Ou elle peut n'avoir aucun paramètre :

{% tabs no-parameters %}
{% tab 'Scala 2 et 3' for=no-parameters %}
```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```
{% endtab %}
{% endtabs %}

## Méthodes

Les méthodes ressemblent et se comportent de manière très similaire aux fonctions, mais il existe quelques différences clés entre elles.

Les méthodes sont définies avec le mot-clé `def`. 
`def` est suivi d'un nom, d'une ou plusieurs listes de paramètres, d'un type de retour et d'un corps :

{% tabs method %}
{% tab 'Scala 2 et 3' for=method %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endtab %}
{% endtabs %}

Remarquez comment le type de retour `Int` est déclaré _après_ la liste de paramètres et un `:`.

Une méthode peut prendre plusieurs listes de paramètres :

{% tabs multiple-parameter-lists %}
{% tab 'Scala 2 et 3' for=multiple-parameter-lists %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endtab %}
{% endtabs %}

Ou aucune liste de paramètres du tout :

{% tabs no-parameter-lists %}
{% tab 'Scala 2 et 3' for=no-parameter-lists %}
```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```
{% endtab %}
{% endtabs %}

Il existe d'autres différences, mais pour l'instant, vous pouvez considérer les méthodes comme quelque chose de similaire aux fonctions.

Les méthodes peuvent également avoir des expressions sur plusieurs lignes :

{% tabs get-square-string class=tabs-scala-version %}

{% tab 'Scala 2' for=get-square-string %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% tab 'Scala 3' for=get-square-string %}
```scala
def getSquareString(input: Double): String =
  val square = input * input
  square.toString

println(getSquareString(2.5)) // 6.25
```
{% endtab %}

{% endtabs %}

La dernière expression du corps est la valeur de retour de la méthode. 
(Scala a le mot-clé `return`, mais il est rarement utilisé.)

## Classes

Vous pouvez définir des classes avec le mot-clé `class`, suivi de son nom et de des paramètres du constructeur :

{% tabs greeter-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-definition %}
```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-definition %}
```scala
class Greeter(prefix: String, suffix: String):
  def greet(name: String): Unit =
    println(prefix + name + suffix)
```
{% endtab %}

{% endtabs %}

Le type de retour de la méthode `greet` est `Unit`, ce qui signifie qu'il n'y a rien de significatif à retourner. 
Il est utilisé de la même manière que `void` en Java et C. 
(Une différence notable est que, parce que chaque expression Scala doit avoir une certaine valeur, il existe une seule valeur de type `Unit`, écrite `()`. 
Elle ne contient aucune information.)

Dans Scala 2, vous pouvez créer une instance d'une classe avec le mot-clé `new`. 
Cependant, dans Scala 3, le mot-clé `new` n'est pas nécessaire grâce aux [méthodes d'application universelles](https://docs.scala-lang.org/scala3/reference/other-new-features/creator-applications.html) :

{% tabs greeter-usage class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-usage %}
```scala mdoc:nest
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% tab 'Scala 3' for=greeter-usage %}
```scala
val greeter = Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```
{% endtab %}

{% endtabs %}

Nous aborderons les classes en profondeur [plus tard](classes.html).

## Case Classes

Scala a un type spécial de classe appelé "case" classe. 
Par défaut, les instances des "case" classes sont immuables et sont comparées par valeur (contrairement aux classes dont les instances sont comparées par référence). 
Cela les rend également utiles pour le [pattern matching](https://docs.scala-lang.org/fr/tour/pattern-matching.html#matching-on-case-classes).

Vous pouvez définir des case classes avec les mots-clés `case class` :

{% tabs case-class-definition %}
{% tab 'Scala 2 et 3' for=case-class-definition %}
```scala mdoc
case class Point(x: Int, y: Int)
```
{% endtab %}
{% endtabs %}

Vous pouvez instancier des case classes sans le mot-clé `new` :

{% tabs case-class-creation %}
{% tab 'Scala 2 et 3' for=case-class-creation %}
```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```
{% endtab %}
{% endtabs %}

Les instances de case classes sont comparées par valeur et non par référence :

{% tabs compare-case-class-equality class=tabs-scala-version %}

{% tab 'Scala 2' for=compare-case-class-equality %}
```scala mdoc
if (point == anotherPoint) {
  println(s"$point and $anotherPoint are the same.")
} else {
  println(s"$point and $anotherPoint are different.")
} // Point(1,2) and Point(1,2) are the same.

if (point == yetAnotherPoint) {
  println(s"$point and $yetAnotherPoint are the same.")
} else {
  println(s"$point and $yetAnotherPoint are different.")
} // Point(1,2) and Point(2,2) are different.
```
{% endtab %}

{% tab 'Scala 3' for=compare-case-class-equality %}
```scala
if point == anotherPoint then
  println(s"$point and $anotherPoint are the same.")
else
  println(s"$point and $anotherPoint are different.")
// ==> Point(1,2) and Point(1,2) are the same.

if point == yetAnotherPoint then
  println(s"$point and $yetAnotherPoint are the same.")
else
  println(s"$point and $yetAnotherPoint are different.")
// ==> Point(1,2) and Point(2,2) are different.
```
{% endtab %}

{% endtabs %}

Il y a beaucoup plus aux case classes que nous aimerions vous présenter, et nous sommes convaincus que vous en tomberez amoureux! 
Nous les aborderons en profondeur [plus tard](case-classes.html).

## Objets

Les objets sont des instances uniques de leurs propres définitions. 
Vous pouvez les considérer comme des instances uniques de leurs propres classes.

Vous pouvez définir des objets avec le mot-clé `object` :

{% tabs id-factory-definition class=tabs-scala-version %}

{% tab 'Scala 2' for=id-factory-definition %}
```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```
{% endtab %}

{% tab 'Scala 3' for=id-factory-definition %}
```scala
object IdFactory:
  private var counter = 0
  def create(): Int =
    counter += 1
    counter
```
{% endtab %}

{% endtabs %}

Vous pouvez accéder à un objet en référant à son nom :

{% tabs id-factory-usage %}
{% tab 'Scala 2 et 3' for=id-factory-usage %}
```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```
{% endtab %}
{% endtabs %}

Nous aborderons les objets en profondeur [plus tard](singleton-objects.html).

## Traits

Les traits sont des types de données abstraits contenant certains champs et méthodes. 
Dans l'héritage Scala, une classe ne peut étendre qu'une seule autre classe, mais elle peut étendre plusieurs traits.

Vous pouvez définir des traits avec le mot-clé `trait` :

{% tabs greeter-trait-def class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def %}
```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def %}
```scala
trait Greeter:
  def greet(name: String): Unit
```
{% endtab %}

{% endtabs %}

Les traits peuvent également avoir des implémentations par défaut :

{% tabs greeter-trait-def-impl class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-trait-def-impl %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```
{% endtab %}

{% tab 'Scala 3' for=greeter-trait-def-impl %}
```scala
trait Greeter:
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
```
{% endtab %}

{% endtabs %}

Vous pouvez étendre les traits avec le mot-clé `extends` et remplacer une implémentation avec le mot-clé `override` :

{% tabs greeter-implementations class=tabs-scala-version %}

{% tab 'Scala 2' for=greeter-implementations %}
```scala mdoc
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter {
  override def greet(name: String): Unit = {
    println(prefix + name + postfix)
  }
}

val greeter = new DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = new CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endtab %}

{% tab 'Scala 3' for=greeter-implementations %}
```scala
class DefaultGreeter extends Greeter

class CustomizableGreeter(prefix: String, postfix: String) extends Greeter:
  override def greet(name: String): Unit =
    println(prefix + name + postfix)

val greeter = DefaultGreeter()
greeter.greet("Scala developer") // Hello, Scala developer!

val customGreeter = CustomizableGreeter("How are you, ", "?")
customGreeter.greet("Scala developer") // How are you, Scala developer?
```
{% endtab %}

{% endtabs %}

Ici, `DefaultGreeter` n'étend qu'un seul trait, mais il pourrait étendre plusieurs traits.

Nous aborderons les traits en profondeur [plus tard](traits.html).

## Point d'entrée du programme

La méthode principale est le point d'entrée d'un programme Scala. 
La Machine Virtuelle Java nécessite une méthode principale, nommée `main`, qui prend un argument : un tableau de chaînes.

{% tabs hello-world-demo class=tabs-scala-version %}

{% tab 'Scala 2' for=hello-world-demo %}

Dans Scala 2, vous devez définir manuellement une méthode principale. 
À l'aide d'un objet, vous pouvez définir la méthode `main` comme suit :

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```
{% endtab %}

{% tab 'Scala 3' for=hello-world-demo %}

Dans Scala 3, avec l'annotation `@main`, une méthode main est automatiquement générée à partir d'une méthode comme suit :

```scala
@main def hello() = println("Hello, Scala developer!")
```
{% endtab %}

{% endtabs %}

## Ressources additionnelles

* Présentation du [livre Scala](/scala3/book/taste-intro.html)