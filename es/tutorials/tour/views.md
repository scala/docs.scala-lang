---
layout: tutorial
title: Vistas

disqus: true

tutorial: scala-tour
num: 32
language: es
---

[Parámetros implícitos](implicit-parameters.html) y métodos también pueden definir conversiones implícitas llamadas _vistas_. Una vista de tipo `S` a `T` es definida por un valor implícito que tiene una función del tipo `S => T`, o por un método implícito convertible a un valor de tal tipo.

Las vistas son aplicadas en dos situaciones:
* Si una expresión `e` es de tipo `S`, y `S` no se ajusta al tipo esperado de la expresión `T`.
* En una selección `e.m` con `e` de tipo `T`, si el selector `m` no es un miembro de `T`.

En el primer caso, una vista `v` es buscada la cual sea aplicable a `e` y cuyo tipo resultado se ajusta a `T`. 
En el segundo caso, una vista `v` es buscada para la cual sea aplicable a `e` y cuyor resultado contenga un miembro llamado `m`.

La siguiente operación entre las dos listas `xs` y `ys` de tipo `List[Int]` es legal:

    xs <= ys

asumiendo que los métodos implícitos `list2ordered` e `int2ordered` definidos abajo estén en el alcance de la operación:

    implicit def list2ordered[A](x: List[A])
        (implicit elem2ordered: a => Ordered[A]): Ordered[List[A]] =
      new Ordered[List[A]] { /* .. */ }
    
    implicit def int2ordered(x: Int): Ordered[Int] = 
      new Ordered[Int] { /* .. */ }

La función `list2ordered` puede ser también expresada con el uso de un _límite de vista_ por un parámetro de tipo:

    implicit def list2ordered[A <% Ordered[A]](x: List[A]): Ordered[List[A]] = ...

El compilador de Scala que genera después genera el código equivalente a la definición de `list2ordered` vista anteriormente.

El objeto `scala.Predef` importado implicitamente declara varios tipos predefinidos (ej. `Pair`) and métodos (ej. `assert`) pero también varias vistas. El siguiente ejemplo muestra una idea de la vista predefinida `charWrapper`:

    final class RichChar(c: Char) {
      def isDigit: Boolean = Character.isDigit(c)
      // isLetter, isWhitespace, etc.
    }
    object RichCharTest {
      implicit def charWrapper(c: char) = new RichChar(c)
      def main(args: Array[String]) {
        println('0'.isDigit)
      }
    }
