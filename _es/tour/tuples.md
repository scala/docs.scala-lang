---
layout: tour
title: Tuples
partof: scala-tour
num: 
language: es

next-page: mixin-class-composition
previous-page: inner-classes

---

En Scala, una tupla es un valor que contiene un número fijo de elementos,
cada uno de ellos puede ser de distinto tipo. Las tuplas son inmutables.

Las tuplas son especialmente útiles para retornar múltiples valores desde 
un método.

Una tupla con dos elementos puede ser creada del siguiente modo:

```scala mdoc
val ingredient = ("Sugar", 25)
```

Esta instrucción crea una tupla que contiene un elemento de tipo `String` 
y un elemento de tipo `Int`.

El tipo de la tupla `ingredient` se infiere que es`(String, Int)`, lo cual es
una abreviatura de `Tuple2[String, Int]`.

Para representar tuplas, Scala utiliza una serie de clases: `Tuple2`, `Tuple3`, 
etc., hasta `Tuple22`.
Cada clase tiene tantos parámetros como número de elementos.

## Accediendo a los elementos

Una forma de acceder a los elementos de una tupla es por posición.
Los elementos concretos se llaman `_1`, `_2`, y así sucesivamente.

```scala mdoc
println(ingredient._1) // Sugar
println(ingredient._2) // 25
```

## Reconocimiento de patrones en tuplas

Una tupla también puede ser dividida/expandida usando reconocimiento de patrones (pattern matching):

```scala mdoc
val (name, quantity) = ingredient
println(name)     // Sugar
println(quantity) // 25
```

En esta ocasión el tipo de `name` es inferido como `String` y el de
`quantity` como `Int`.

A continuación otro ejemplo de reconocimiento de patrones con tuplas:

```scala mdoc
val planets =
  List(("Mercury", 57.9), ("Venus", 108.2), ("Earth", 149.6),
       ("Mars", 227.9), ("Jupiter", 778.3))
planets.foreach{
  case ("Earth", distance) =>
    println(s"Nuestro planeta está a $distance millones de kilómetros del Sol.")
  case _ =>
}
```

O en compresión de bucles `for`:

```scala mdoc
val numPairs = List((2, 5), (3, -7), (20, 56))
for ((a, b) <- numPairs) {
  println(a * b)
}
```

## Tuplas y case classes

A veces los usuarios encuentran difícil elegir entre tuplas y clases Case. 
Los elementos de las clases Case tienen nombre. Los nombres pueden mejorar
la lectura en el código.
En el ejemplo anterior de los planetas, podríamos haber definido 
`case class Planet(name: String, distance: Double)` en vez de usar tuplas.


## Más recursos

* Aprende más acerca de las tuplas en el [Scala Book](/overviews/scala-book/tuples.html)
