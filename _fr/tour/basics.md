---
layout: tour
title: Basics
partof: scala-tour

num: 2
language: fr

next-page: unified-types
previous-page: tour-of-scala
---

Dans cette page, nous allons aborder les bases de Scala.

## Essayer Scala avec le navigateur

Vous pouvez tester Scala dans votre navigateur avec _ScalaFiddle_. C'est une méthode simple et sans installation qui permet d'expérimenter des morceaux de code Scala :

1. Allez sur [https://scalafiddle.io](https://scalafiddle.io).
2. Collez `println("Hello, world!")` dans le panneau de gauche.
3. Clickez sur __Run__. La sortie appraît dans le panneau de droite.

_ScalaFiddle_ est intégré avec le code de la documentation; si vous voyez un boutton __Run__ dans les exemples de code ci-dessous, cliquez dessus pour essayer dans l'outil.

## Expressions

Les expressions sont des déclarations calculables :
```scala mdoc
1 + 1
```
Vous pouvez voir le résultat de l'expression en utilisant `println`:

{% scalafiddle %}
```scala mdoc
println(1) // 1
println(1 + 1) // 2
println("Hello!") // Hello!
println("Hello," + " world!") // Hello, world!
```
{% endscalafiddle %}

### Valeurs

Vous pouvez nommer le résultat d'une expression en utilisant le mot clef `val` :

```scala mdoc
val x = 1 + 1
println(x) // 2
```
Les résultats nommés, comme `x` ici, sont appelés des valeurs. Faire référence à une valeur ne la recalcule pas.

Les valeurs ne peuvent pas être réassignées :

```scala mdoc:fail
x = 3 // Cela ne compile pas.
```

Le type d'une valeur peut être omis et [inféré](https://docs.scala-lang.org/tour/type-inference.html), ou il peut être déclaré explicitement :

```scala mdoc:nest
val x: Int = 1 + 1
```

Veuillez noter comment la déclaration de type `Int` est faite. Elle vient après l'identifiant `x` et vous avez besoin du caractère `:`.

### Variables

Les Variables sont similaires aux valeurs, sauf que vous pouvez les réassigner. Vous pouvez définir une variable avec le mot clef `var`.

```scala mdoc:nest
var x = 1 + 1
x = 3 // Cela compile parce que "x" est déclaré avec le mot clef "var".
println(x * x) // 9
```

Comme pour les valeurs, le type d'une variable peut être omis et [inféré](https://docs.scala-lang.org/tour/type-inference.html), ou il peut être déclaré explicitement :

```scala mdoc:nest
var x: Int = 1 + 1
```


## Blocs

Vous pouvez combiner les expressions en les entourant avec `{}`. Nous appelons cela un bloc.

Le résultat de la dernière expression dans le bloc est le résultat de tout le bloc :

```scala mdoc
println({
  val x = 1 + 1
  x + 1
}) // 3
```

## Fonctions

Les fonctions sont des expressions qui ont des paramètres, et qui prennent des arguments.

Vous pouvez définir une fonction anonyme (càd, une fonction sans nom) qui retourne un entier plus 1 :

```scala mdoc
(x: Int) => x + 1
```

À gauche du symbole `=>`, c'est la liste des paramètres. À droite, c'est une expression impliquant les paramètres.

Vous pouvez aussi nommer les fonctions :

{% scalafiddle %}
```scala mdoc
val addOne = (x: Int) => x + 1
println(addOne(1)) // 2
```
{% endscalafiddle %}

Une fonction peut avoir plusieurs paramètres :

{% scalafiddle %}
```scala mdoc
val add = (x: Int, y: Int) => x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Ou elle peut n'avoir aucun paramètre :

```scala mdoc
val getTheAnswer = () => 42
println(getTheAnswer()) // 42
```

## Méthodes

Les méthodes ressemblent et se comportent comme les fonctions, mais il y a quelques différences clefs.

Les méthodes définissent le mot clef `def`. Il est suivi par un nom, une liste de paramètres, un type de retour et un corpus :

{% scalafiddle %}
```scala mdoc:nest
def add(x: Int, y: Int): Int = x + y
println(add(1, 2)) // 3
```
{% endscalafiddle %}

Veuillez noter la déclaration du type de retour `Int`. Il est déclaré _après_ la liste des paramètres et le symbole `:`.

Une méthode peut prendre plusieurs listes de paramètres :

{% scalafiddle %}
```scala mdoc
def addThenMultiply(x: Int, y: Int)(multiplier: Int): Int = (x + y) * multiplier
println(addThenMultiply(1, 2)(3)) // 9
```
{% endscalafiddle %}

Ou aucune liste de paramètres :

```scala mdoc
def name: String = System.getProperty("user.name")
println("Hello, " + name + "!")
```

Il y a quelques autres différences, mais pour l'instant, vous pouvez considérer les méthodes comme quelque chose de similaire aux fonctions.

Une méthode peut avoir également des expressions multi-lignes :

{% scalafiddle %}
```scala mdoc
def getSquareString(input: Double): String = {
  val square = input * input
  square.toString
}
println(getSquareString(2.5)) // 6.25
```
{% endscalafiddle %}

La dernière expression du bloc est la valeur de retour de la méthode. (Scala a un mot clef `return`, mais il est rarement utilisé.)

## Classes

Vous pouvez définir les classes avec le mot clef `class`, suivi par son nom et son constructeur de paramètres :

```scala mdoc
class Greeter(prefix: String, suffix: String) {
  def greet(name: String): Unit =
    println(prefix + name + suffix)
}
```
Le type de retour de la méthode `greet` est `Unit`, ce qui signifie qu'il n'y a rien d'utile à retourner. C'est utilisé de la même façon que `void` en Java et en C. (La différence, c'est que chaque expression Scala doit retourner une valeur, il y a actuellement une valeur singleton de type Unit ecrit (). Elle ne transporte aucune information.)

Vous pouvez créer une instance de la classe avec le mot clef `new` :

```scala mdoc:nest
val greeter = new Greeter("Hello, ", "!")
greeter.greet("Scala developer") // Hello, Scala developer!
```

Nous couvrirons les [classes](classes.html) en détail plus tard.

## Case Classes

Scala a un type spécial de classes appelées classes de cas. Par défaut, les instances des classes de cas sont immuables, et elles sont comparables par leurs valeurs. (contrairement aux instances de classes, qui sont comparées par référence). Cela les rend également utiles pour le [pattern matching](https://docs.scala-lang.org/tour/pattern-matching.html#matching-on-case-classes).

Vous pouvez définir les classes de cas avec le mot clef `case class` :

```scala mdoc
case class Point(x: Int, y: Int)
```

Vous pouvez instancier les classes de cas sans le mot clef `new` :

```scala mdoc
val point = Point(1, 2)
val anotherPoint = Point(1, 2)
val yetAnotherPoint = Point(2, 2)
```

Les instances de classes de cas sont comparées par valeur, et non par référence :

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

Il y a beaucoup d'autres informations que nous aurions souhaité introduire à propos des classes de cas, et nous sommes convaincus que vous allez les appréciez ! Nous allons aborder les [classes de cas](case-classes.html) en détail plus tard.

## Objets

Les objets sont des instances uniques de leur propre définition. Vous pouvez les considérer comme des singletons de leurs propres classes.

Vous pouvez définir les objets avec le mot clef `object` :

```scala mdoc
object IdFactory {
  private var counter = 0
  def create(): Int = {
    counter += 1
    counter
  }
}
```

Vous pouvez accéder à un object en se référant à son nom :

```scala mdoc
val newId: Int = IdFactory.create()
println(newId) // 1
val newerId: Int = IdFactory.create()
println(newerId) // 2
```

Nous allons aborder les [objets](singleton-objects.html) détail plus tard.

## Traits

Les traits sont des types de données abstraits contenant des champs et des méthodes. Avec l'héritage Scala, une classe peut hériter d'une seule autre classe, mais elle peut hériter de plusieurs traits.

Vous pouvez définir les traits avec le mot clef `trait` :

```scala mdoc:nest
trait Greeter {
  def greet(name: String): Unit
}
```

Les traits peuvent aussi avoir des implémentations par défaut :

{% scalafiddle %}
```scala mdoc:reset
trait Greeter {
  def greet(name: String): Unit =
    println("Hello, " + name + "!")
}
```

Vous pouvez hériter des traits avec le mot clef `extends` et réécrire une implémentation avec le mot clef `override` :

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
{% endscalafiddle %}

Ici, `DefaultGreeter` hérite seulement d'un seul trait, mais il pourrait hériter de plusieurs traits.

Nous allons aborder les [traits](traits.html) en détail plus tard.

## La méthode Main

La méthode main est le point d'entrée d'un programme Scala. La machine virtuelle Java impose une méthode principale, nommée `main`, qui prend en argument : un tableau de Strings.  

En utilisant un objet, vous pouvez définir la méthode main tel que ci-dessous :

```scala mdoc
object Main {
  def main(args: Array[String]): Unit =
    println("Hello, Scala developer!")
}
```

## Plus d'informations

* Aperçu du livre [Scala book](/overviews/scala-book/prelude-taste-of-scala.html)

Traduction par Antoine Pointeau.