---
layout: tour
title: Unified Types
partof: scala-tour

num: 3

language: fr

next-page: classes
previous-page: basics
---

En Scala, toutes les valeurs ont un type, y compris les nombres et les fonctions. Le diagramme ci-dessous illustre un sous-ensemble de cette hiérarchie des types.

<a href="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/unified-types-diagram.svg" alt="Scala Type Hierarchy"></a>

## Hiérarchie des types Scala ##

[`Any`](https://www.scala-lang.org/api/2.12.1/scala/Any.html) est un supertype de tous les types, aussi appelé type supérieur. Il définit certaines méthodes universelles comme `equals`, `hashCode`, et `toString`. `Any` a deux sous-types directs : `AnyVal` et `AnyRef`.

`AnyVal` représente les types valeurs. Il y a neuf types valeurs prédéfinis qui ne peuvent pas être nulls : `Double`, `Float`, `Long`, `Int`, `Short`, `Byte`, `Char`, `Unit`, et `Boolean`. `Unit` est un type valeur qui ne contient aucune information significative. Il y n'y a qu'une seule instance de `Unit` qui peut être déclarée littéralement comme ceci : `()`. Toutes les fonctions doivent retourner quelque chose, alors parfois `Unit` est utile comme type de retour.

`AnyRef` représente les types références. Tous les types qui ne sont pas des valeurs sont définis en tant que type référence. Tous les types définis par les utilisateurs de Scala sont des sous-types de `AnyRef`. Si Scala est utilisé dans un contexte Java Runtime Environment (JRE), `AnyRef` correspond à `java.lang.Object`.

Voici un exemple qui démontre que les chaînes de caractères, les entiers, les caractères, les valeurs booléennes, et les fonctions sont tous du type `Any`, comme tous les autres objets :

```scala mdoc
val list: List[Any] = List(
  "a string",
  732,  // un entier
  'c',  // un caractère
  true, // une valeur booléenne
  () => "une fonction anonyme qui retourne une string"
)

list.foreach(element => println(element))
```

La valeur `list` est définie avec le type `List[Any]`. La liste est initialisée avec des éléments de types différents, mais chacun est une instance de `scala.Any`, donc vous pouvez les ajouter dans la liste.

Voici la sortie du programme :

```
a string
732
c
true
<function>
```

## Cast de Type

Les types valeurs peuvent être forcés en un autre type de cette façon : 
<a href="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg"><img  style="width:100%" src="{{ site.baseurl }}/resources/images/tour/type-casting-diagram.svg" alt="Scala Type Hierarchy"></a>

Par exemple :

```scala mdoc
val x: Long = 987654321
val y: Float = x  // 9.8765434E8 (à noter que la précision n'est pas conservée)

val face: Char = '☺'
val number: Int = face  // 9786
```

Le cast est unidirectionnel. Ceci ne compilera pas :

```
val x: Long = 987654321
val y: Float = x  // 9.8765434E8
val z: Long = y  // Non conforme
```

Vous pouvez aussi forcer un type référence en un sous-type. Vous verrez cela dans le suite du tour.

## Nothing et Null

`Nothing` est un sous-type des tous les types, aussi appelé le type inférieur. Il n'y a aucune valeur qui a le type `Nothing`. Un usage courrant est pour signaler une non-terminaison comme pour lever une exception, la fin d'un programme, ou une boucle infinie (càd, que c'est le type d'une expression qui ne s'évalue pas en valeur, ou une méthode qui ne se termine pas normallement).

Traduction par Antoine Pointeau.