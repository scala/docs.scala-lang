---
layout: tour
title: Singleton Objects
partof: scala-tour

num: 15

language: fr

next-page: regular-expression-patterns
previous-page: pattern-matching
---

Un objet est une classe qui a exactement une instance. Il est créé de façon paresseuse au moment où il est référencé, comme une valeur paresseuse `lazy val`.

En tant que valeur de premier niveau, un object est un singleton.

En tant que membre d'une classe englobante ou en tant que valeur locale, il se comporte exactement comme une `lazy val`.

# Définir un objet singleton

Un objet est une valeur. La définition d'un objet ressemble a une classe, mais utilise le mot clef `object` :

```scala mdoc
object Box
```

Voici l'exemple d'un objet avec une méthode :

```
package logging

object Logger {
  def info(message: String): Unit = println(s"INFO: $message")
}
```

La méthode `info` peut être importée depuis n'importe où dans le programme. Créer des méthodes utilitaires, comme celle-ci, est un cas d'usage commun pour les objets singleton.

Regardons comment utiliser `info` dans un autre package :

```
import logging.Logger.info

class Project(name: String, daysToComplete: Int)

class Test {
  val project1 = new Project("TPS Reports", 1)
  val project2 = new Project("Website redesign", 5)
  info("Created projects")  // Prints "INFO: Created projects"
}
```

La méthode `info` est visible grâce à l'import, `import logging.Logger.info`. Les imports ont besoin d'un chemin d'accès stable aux ressources, et un objet est un chemin stable.

Note : Si un `objet` est encapsulé dans une autre classe ou un autre objet, alors l'objet est dépendant du chemin d'accès comme les autres membres. Cela veut dire par exemple, que si on prend 2 types de boissons, `class Milk` et `class OrangeJuice`, un membre de class `object NutritionInfo` est dépendant de son instance d'encapsulation. `milk.NutritionInfo` est complétement différent de `oj.NutritionInfo`.

## Les objets compagnons

Un objet avec le même nom qu'une classe est appelé un _objet compagnon_. Inversement, la classe se nomme la _classe compagnon_ de l'objet. Une classe ou un objet compagnon peut accéder aux membres privés de son compagnon. 

```
import scala.math._

case class Circle(radius: Double) {
  import Circle._
  def area: Double = calculateArea(radius)
}

object Circle {
  private def calculateArea(radius: Double): Double = Pi * pow(radius, 2.0)
}

val circle1 = Circle(5.0)

circle1.area
```

La classe `class Circle` a un membre `area` qui est spécifique à chaque instance, et un singleton `object Circle` qui a une méthode `calculateArea` qui est disponible pour chaque instance.

L'objet compagnon peut aussi contenir des méthodes de fabrique (_factory_) :

```scala mdoc
class Email(val username: String, val domainName: String)

object Email {
  def fromString(emailString: String): Option[Email] = {
    emailString.split('@') match {
      case Array(a, b) => Some(new Email(a, b))
      case _ => None
    }
  }
}

val scalaCenterEmail = Email.fromString("scala.center@epfl.ch")
scalaCenterEmail match {
  case Some(email) => println(
    s"""Registered an email
       |Username: ${email.username}
       |Domain name: ${email.domainName}
     """.stripMargin)
  case None => println("Error: could not parse email")
}
```

L'objet `object Email` contient une méthode de fabrique `fromString` qui créé une instance de `Email` depuis une chaîne de caractères. L'instance est retournée en tant que `Option[Email]` pour gérer le cas des erreurs de syntaxe.

Note : Si une classe ou un objet a un compagnon, tout deux doivent être définis dans le même fichier. Pour définir des compagnons dans le REPL, tout deux doivent être définis sur la même ligne ou il faut entrer en mode `:paste`. 

## Notes pour les programmeurs Java ##

Les membres `static` en Java sont modélisés comme des membres ordinaires d'un objet compagnon en Scala.

En utilisant un objet compagnon depuis du code Java, ses membres seront définis dans la classe compagnon avec le modificateur `static`. Cela s'appelle le _static forwarding_. Cela se produit même si vous n'avez pas défini de classe compagnon vous-même.

## Plus d'informations

* Apprennez-en plus sur les objets compagnons dans [Scala Book](/overviews/scala-book/companion-objects.html)

Traduit par Antoine Pointeau.