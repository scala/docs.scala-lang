---
layout: tour
title: Patrones basados en expresiones regulares

discourse: false

partof: scala-tour

num: 22
language: es

next-page: traits
previous-page: polymorphic-methods
---

## Patrones de secuencias que ignoran a la derecha ##

Los patrones de secuencias que ignoran a la derecha son una característica útil para separar cualquier dato que sea tanto un subtipo de `Seq[A]` o una clase case con un parámetro iterador formal, como por ejemplo

    Elem(prefix:String, label:String, attrs:MetaData, scp:NamespaceBinding, children:Node*)

En esos casos, Scala permite a los patrones que utilicen el cómodin `_*` en la posición más a la derecha que tomen lugar para secuencias arbitrariamente largas. El siguiente ejemplo demuestra un reconocimiento de patrones el cual identifica un prefijo de una secuencia y liga el resto a la variable `rest`.

    object RegExpTest1 extends App {
      def containsScala(x: String): Boolean = {
        val z: Seq[Char] = x
        z match {
          case Seq('s','c','a','l','a', rest @ _*) =>
            println("rest is "+rest)
            true
          case Seq(_*) =>
            false
        }
      }
    }


A diferencia de versiones previas de Scala, ya no está permitido tener expresiones regulares arbitrarias, por las siguientes razones.

###Patrones generales de expresiones regulares (`RegExp`) temporariamente retirados de Scala###

Desde que descubrimos un problema en la precisión, esta característica está temporariamente retirada del lenguaje. Si existiese una petición de parte de la comunidad de usuarios, podríamos llegar a reactivarla de una forma mejorada.

De acuerdo a nuestra opinión los patrones basados en expresiones regulares no resultaron útiles para el procesamiento de XML. En la vida real, las aplicaciones que procesan XML, XPath parece una opción mucho mejor. Cuando descubrimos que nuestra traducción de los patrones para expresiones regulares tenía algunos errores para patrones raros y poco usados, aunque difícil de excluir, decidimos que sería tiempo de simplificar el lenguaje.
