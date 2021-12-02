---
layout: tour
title: Default Parameter Values
partof: scala-tour

num: 5

language: fr

next-page: named-arguments
previous-page: classes
---

Scala fournit la possibilité de donner des valeurs par défaut aux paramètres.
Cela peut être utilisé pour omettre ces paramètres lors des appels aux fonctions.

```scala mdoc
def log(message: String, level: String = "INFO") = println(s"$level: $message")

log("System starting")  // prints INFO: System starting
log("User not found", "WARNING")  // prints WARNING: User not found
```

Le paramètre `level` a une valeur par défaut, donc il est optionnel. Sur la dernière ligne, l'argument `"WARNING"` écrase la valeur par défaut `"INFO"`. Là où vous pourriez "overload" les méthodes en Java, vous pouvez simplement utiliser les paramètres optionnels pour obtenir le même effet. Cependant, lorsque l'appel ignore un argument, tous les arguments suivants doivent être nommés.

```scala mdoc
class Point(val x: Double = 0, val y: Double = 0)

val point1 = new Point(y = 1)
```

Ici nous pouvons dire que `y = 1`.

Notez que les paramètres par défaut en Scala ne sont pas optionnels quand ils sont appelés par un code Java :

```scala mdoc:reset
// Point.scala
class Point(val x: Double = 0, val y: Double = 0)
```

```java
// Main.java
public class Main {
    public static void main(String[] args) {
        Point point = new Point(1);  // ne compile pas
    }
}
```

Traduction par Antoine Pointeau.