---
layout: tutorial
title: Tipos Unificados

disqus: true

tutorial: scala-tour
num: 30
language: es
---

A diferencia de Java, todos los valores en Scala son objetos (incluyendo valores numéricos y funciones). Dado que Scala está basado en clases, todos los valores son instancias de una clase. El diagrama siguiente ilustra esta jerarquía de clases:

![Jerarquía de Tipos de Scala]({{ site.baseurl }}/resources/images/classhierarchy.img_assist_custom.png)

## Jerarquía de clases en Scala ##

La superclase de todas las clases, `scala.Any`, tiene dos subclases directas, `scala.AnyVal` y `scala.AnyRef` que representan dos mundos de clases muy distintos: clases para valores y clases para referencias. Todas las clases para valores están predefinidas; se corresponden con los tipos primitivos de los lenguajes tipo Java. Todas las otras clases definen tipos referenciables. Las clases definidas por el usuario son definidas como tipos referenciables por defecto, es decir, siempre (indirectamente) extienden de `scala.AnyRef`. Toda clase definida por usuario en Scala extiende implicitamente el trait `scala.ScalaObject`. Clases pertenecientes a la infraestructura en la cual Scala esté corriendo (ejemplo, el ambiente de ejecución de Java) no extienden de `scala.ScalaObject`. Si Scala es usado en el contexto de un ambiente de ejecución de Java, entonces `scala.AnyRef` corresponde a `java.lang.Object`.
Por favor note que el diagrama superior también muestra conversiones implícitas llamadas viestas entre las clases para valores.
Aquí se muestra un ejemplo que demuestra que tanto valores numéricos, de caracteres, buleanos y funciones son objetos, tal como cualquier otro objeto:

    object UnifiedTypes {
      def main(args: Array[String]) {
        val set = new scala.collection.mutable.HashSet[Any]
        set += "This is a string"  // suma un String
        set += 732                 // suma un número
        set += 'c'                 // suma un caracter
        set += true                // suma un valor booleano
        set += main _              // suma la función main
        val iter: Iterator[Any] = set.elements
        while (iter.hasNext) {
          println(iter.next.toString())
        }
      }
    }

El programa declara una aplicación `UnifiedTypes` en forma de un objeto singleton de primer nive con un método `main`. El método main define una variable local `set` (un conjunto), la cual se refiere a una instancia de la clase `HashSet[Any]`. El programa suma varios elementos a este conjunto. Los elementos tienen que cumplir con el tipo declarado para los elementos por el conjunto, que es `Any`. En el final, una representación en texto (cadena de caracteres, o string) es impresa en pantalla.

Aquí se muestra la salida del programa:

    c
    true
    <function>
    732
    This is a string
