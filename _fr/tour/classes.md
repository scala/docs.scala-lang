---
layout: tour
title: Classes
partof: scala-tour

num: 4

language: fr

next-page: default-parameter-values
previous-page: unified-types
---

Les classes en Scala sont des modèles pour créer des objets. Elle peuvent contenir des méthodes,
des valeurs, des variables, des types, des objets, des traits, et des classes qui sont collectivement appelés _members_. Les types, les objets et les traits seront couverts plus tards dans le tour.

## Définir une classe

La définition minimum d'une classe est simplement le mot clef `class` plus un identifiant.
Le nom d'une classe doit commencer par une majuscule. 

```scala mdoc
class User

val user1 = new User
```

Le mot clef `new` est utilisé pour créer une instance de la classe. `User` a un constructeur par défaut qui ne prend aucun argument, car aucun constructeur n'a été défini. Cependant, vous souhaiterez souvent un constructeur et un corps de classe.

Voici un exemple de définition d'une classe pour un point : 

```scala mdoc
class Point(var x: Int, var y: Int) {

  def move(dx: Int, dy: Int): Unit = {
    x = x + dx
    y = y + dy
  }

  override def toString: String =
    s"($x, $y)"
}

val point1 = new Point(2, 3)
println(point1.x)  // 2
println(point1)  // prints (2, 3)
```
Cette classe `Point` possède quatre membres : les variables `x` et `y` et les méthodes `move` et `toString`.
Contrairement à beaucoup d'autres langages, le constructeur primaire est dans la signature de la classe `(var x: Int, var y: Int)`.
La méthode `move` prend deux entiers en arguments et retourne la valeur Unit `()`, qui ne comporte aucune information.
Cela correspond à-peu-près à `void` dans les langages similaires à Java.
`toString`, d'un autre côté, ne prend aucun argument mais retourne une valeur `String`.
Étant donné que `toString` surcharge l'implémentation de `toString` fournie par [`AnyRef`](unified-types.html), elle doit être accompagnée du mot clef `override`.

## Les constructeurs

Les constructeurs peuvent avoir des paramètres optionnels en fournissant une valeur par défaut :

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)

val origin = new Point  // x et y valent tous les deux 0
val point1 = new Point(1)
println(point1.x)  // prints 1
```

Dans cette version de la classe `Point`, `x` et `y` ont tous les deux une valeur par défaut`0`, donc aucun argument n'est requis. Toutefois, parce que le constructeur lit les arguments de gauche à droite, si vous souhaitez seulement fournir la valeur pour `y`, vous devrez nommer le paramètre.

```scala mdoc:nest
class Point(var x: Int = 0, var y: Int = 0)
val point2 = new Point(y = 2)
println(point2.y)  // prints 2
```

C'est aussi une bonne pratique pour améliorer la clarté du code.

## Membres privés et Syntaxe Getter/Setter

Les membres sont publics par défaut. Utilisez le modifieur d'accès `private` 
pour cacher les membres en dehors de la classes.

```scala mdoc:reset
class Point {
  private var _x = 0
  private var _y = 0
  private val bound = 100

  def x = _x
  def x_= (newValue: Int): Unit = {
    if (newValue < bound) _x = newValue else printWarning
  }

  def y = _y
  def y_= (newValue: Int): Unit = {
    if (newValue < bound) _y = newValue else printWarning
  }

  private def printWarning = println("WARNING: Out of bounds")
}

val point1 = new Point
point1.x = 99
point1.y = 101 // prints the warning
```

Dans cette version de la classe `Point`, les données sont stockées dans les variables privées `_x` et `_y`. Il y a les méthodes `def x` et `def y` pour accéder à ces données. `def x_=` et `def y_=` servent à valider et remplacer les valeurs de `_x` et `_y`. Notez la syntaxe spéciale des "setters": la méthode porte le même nom que la méthode "getter" avec `_=` ajouté, ensuite viennent les paramètres.

Les paramètres du constructeur avec `val` et `var` sont publics. Cependant, puisque les `val` sont immuables, vous ne pouvez pas écrire ce qui suit.

```scala mdoc:fail
class Point(val x: Int, val y: Int)
val point = new Point(1, 2)
point.x = 3  // <-- ne compile pas
```

Les paramètres sans `val` ou `var` sont des valeurs privées, visibles seulement dans la classe.

```scala mdoc:fail
class Point(x: Int, y: Int)
val point = new Point(1, 2)
point.x  // <-- ne compile pas
```

## Plus d'informations

* Apprennez-en plus à propos des classes dans [Scala Book](/overviews/scala-book/classes.html)
* Comment utiliser les [Auxiliary Class Constructors](/overviews/scala-book/classes-aux-constructors.html)

Traduction par Antoine Pointeau.
