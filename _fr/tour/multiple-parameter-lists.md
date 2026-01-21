---
layout: tour
title: Multiple Parameter Lists (Currying)
partof: scala-tour

num: 12

language: fr

next-page: case-classes
previous-page: nested-functions
---

Les méthodes peuvent avoir plusieurs listes de paramètre.

### Exemple

Voici un exemple, défini sur le trait `Iterable` dans l'API collections de Scala :

```scala
trait Iterable[A] {
  ...
  def foldLeft[B](z: B)(op: (B, A) => B): B
  ...
}
```

`foldLeft` applique une fonction à deux paramètres `op` sur une valeur initiale `z` et tous les éléments de la collection, en allant de gauche à droite. Comme montré ci-dessous, un exemple d'utilisation.

En partant d'une valeur initiale de 0, ici `foldLeft` applique la fonction `(m, n) => m + n` à chaque élément de la liste avec la valeur précédemment accumulée.

{% scalafiddle %}
```scala mdoc
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val res = numbers.foldLeft(0)((m, n) => m + n)
println(res) // 55
```
{% endscalafiddle %}

### Cas d'usage

Les cas d'usage suggérés pour les listes multiples de paramètre incluent :

#### Commander l'inférence de type

Il se trouve qu'en Scala, l'inférence de type résout une liste de paramètre à la fois.
Disons que vous avez la méthode suivante :

```scala mdoc
def foldLeft1[A, B](as: List[A], b0: B, op: (B, A) => B) = ???
```

Vous aimeriez l'appeler de la façon suivante, mais vous verriez que cela ne compile pas : 

```scala mdoc:fail
def notPossible = foldLeft1(numbers, 0, _ + _)
```

Vous auriez à l'appeler selon l'une des manières suivantes :

```scala mdoc
def firstWay = foldLeft1[Int, Int](numbers, 0, _ + _)
def secondWay = foldLeft1(numbers, 0, (a: Int, b: Int) => a + b)
```

C'est parce que Scala ne sera pas capable d'inférer le type de la fonction `_ + _`, puisqu'il sera toujours en train d'inférer `A` et `B`. En déplaçant le paramètre `op` dans sa propre liste de paramètre, `A` et `B` seront inférés dans la première liste de paramètre. Ces types déjà inférés seront disponibles pour la seconde liste de paramètre et `_ + _` correspondra au type inféré `(Int, Int) => Int`.

```scala mdoc
def foldLeft2[A, B](as: List[A], b0: B)(op: (B, A) => B) = ???
def possible = foldLeft2(numbers, 0)(_ + _)
```

Cette définition n'a pas besoin d'aide et peut inférer tout ses types de paramètres.


#### Paramètre implicite

Pour spécifier seulement certains paramètres comme [`implicit`](https://docs.scala-lang.org/tour/implicit-parameters.html), ils doivent être placés dans leur propre liste de paramètre `implicit`.

Un exemple de cela :

```scala mdoc
def execute(arg: Int)(implicit ec: scala.concurrent.ExecutionContext) = ???
```

#### Application partielle

Quand une méthode est appelée sans toutes ses listes de paramètre, alors cela va générer une fonction prennant les listes de paramètre restantes comme arguments. C'est formellement appelé une [partial application](https://en.wikipedia.org/wiki/Partial_application).

Par exemple,

```scala mdoc:nest
val numbers = List(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
val numberFunc = numbers.foldLeft(List[Int]()) _

val squares = numberFunc((xs, x) => xs :+ x*x)
println(squares) // List(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)

val cubes = numberFunc((xs, x) => xs :+ x*x*x)
println(cubes)  // List(1, 8, 27, 64, 125, 216, 343, 512, 729, 1000)
```

Traduit par Antoine Pointeau.