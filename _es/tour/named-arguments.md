---
layout: tour
title: Parámetros nombrados
partof: scala-tour

num: 35
language: es

previous-page: default-parameter-values
---

En la invocación de métodos y funciones se puede usar el nombre de las variables explícitamente en la llamada, de la siguiente manera:

      def imprimirNombre(nombre: String, apellido: String) = {
        println(nombre + " " + apellido)
      }

      imprimirNombre("John","Smith")
      // Imprime "John Smith"
      imprimirNombre(nombre = "John", apellido = "Smith")
      // Imprime "John Smith"
      // Imprime "John Smith"

Note que una vez que se utilizan parámetros nombrados en la llamada, el orden no importa, mientras todos los parámetros sean nombrados. Esta característica funciona bien en conjunción con valores de parámetros por defecto:

      def imprimirNombre(nombre: String = "John", apellido: String = "Smith") = {
        println(nombre + " " + apellido)
      }

      imprimirNombre(apellido = "Jones")
      // Imprime "John Jones"

language: es
---
