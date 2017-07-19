---
layout: inner-page-no-masthead
title: Parámetros nombrados

discourse: false

tutorial: scala-tour
categories: tour
num: 35
language: es

previous-page: default-parameter-values
---

En la invocación de métodos y funciones se puede usar el nombre de las variables explícitamente en la llamada, de la siguiente manera:

      def imprimirNombre(nombre:String, apellido:String) = {
        println(nombre + " " + apellido)
      }

      imprimirNombre("John","Smith")
      // Imprime "John Smith"
      imprimirNombre(first = "John",last = "Smith")
      // Imprime "John Smith"
      imprimirNombre(last = "Smith",first = "John")
      // Imprime "John Smith"

Note que una vez que se utilizan parámetros nombrados en la llamada, el orden no importa, mientras todos los parámetros sean nombrados. Esta característica funciona bien en conjunción con [valores de parámetros por defecto]({{ site.baseurl }}/tutorials/tour/default_parameter_values.html):

      def imprimirNombre(nombre:String = "John", apellido:String = "Smith") = {
        println(nombre + " " + apellido)
      }

      printName(apellido = "Jones")
      // Imprime "John Jones"

Ya que es posible colocar los parámetros en cualquier orden que te guste, puedes usar el valor por defecto para parámetros que aparecen primero en la lista de parámetros.
