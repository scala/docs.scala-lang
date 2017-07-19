---
layout: inner-page-no-masthead
title: Sintaxis de funciones anónimas

discourse: false

tutorial: scala-tour
categories: tour
num: 14
language: es

next-page: currying
previous-page: nested-functions
---

Scala provee una sintaxis relativamente livana para definir funciones anónimas. La siguiente expresión crea una función incrementadora para números enteros:

    (x: Int) => x + 1

El código anterior es una forma compacta para la definición de la siguiente clase anónima:

    new Function1[Int, Int] {
      def apply(x: Int): Int = x + 1
    }

También es posible definir funciones con múltiples parámetros:

    (x: Int, y: Int) => "(" + x + ", " + y + ")"

o sin parámetros: 

    () => { System.getProperty("user.dir") }

Existe también una forma simple para escribir los tipos de las funciones. A continuación se muestran los tipos de las trés funciones escritas anteriormente:

    Int => Int
    (Int, Int) => String
    () => String

La sintaxis anterior es la forma sintética de escribir los siguientes tipos:

    Function1[Int, Int]
    Function2[Int, Int, String]
    Function0[String]
