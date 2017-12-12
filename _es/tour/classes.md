---
layout: tour
title: Clases

discourse: false

partof: scala-tour

num: 4
language: es

next-page: case-classes
previous-page: annotations
---
En Scala, las clases son plantillas estáticas que pueden ser instanciadas por muchos objetos en tiempo de ejecución.
Aquí se presenta una clase la cual define la clase `Point`:

    class Point(xc: Int, yc: Int) {
      var x: Int = xc
      var y: Int = yc
      def move(dx: Int, dy: Int) {
        x = x + dx
        y = y + dy
      }
      override def toString(): String = "(" + x + ", " + y + ")";
    }

Esta clase define dos variables `x` e `y`, y dos métodos: `move` y `toString`. El método `move` recibe dos argumentos de tipo entero, pero no retorna ningún valor (implícitamente se retorna el tipo `Unit`, el cual se corresponde a `void` en lenguajes tipo Java). `toString`, por otro lado, no recibe ningún parámetro pero retorna un valor tipo `String`. Ya que `toString` sobreescribe el método `toString` predefinido en una superclase, tiene que ser anotado con `override`.

Las clases en Scala son parametrizadas con argumentos constructores (inicializadores). En el código anterior se definen dos argumentos contructores, `xc` y `yc`; ambos son visibles en toda la clase. En nuestro ejemplo son utilizados para inicializar las variables `x` e `y`.

Para instanciar una clase es necesario usar la primitiva `new`, como se muestra en el siguiente ejemplo:

    object Classes {
      def main(args: Array[String]) {
        val pt = new Point(1, 2)
        println(pt)
        pt.move(10, 10)
        println(pt)
      }
    }

El programa define una aplicación ejecutable a través del método `main` del objeto singleton `Classes`. El método `main` crea un nuevo `Point` y lo almacena en `pt`. _Note que valores definidos con la signatura `val` son distintos de los definidos con `var` (véase la clase `Point` arriba) ya que los primeros (`val`) no permiten reasignaciones; es decir, que el valor es una constante._

Aquí se muestra la salida del programa:

    (1, 2)
    (11, 12)
