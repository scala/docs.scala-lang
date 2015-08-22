---
layout: tutorial
title: Introduction

disqus: true

tutorial: scala-tour
num: 1
language: es
---

Scala es un moderno lenguaje de programación multi-paradigma diseñado para expresar patrones de programación comunes de una forma concisa, elegante, y de tipado seguro. Integra facilmente características de lenguajes orientados a objetos y funcionales.

## Scala es orientado a objetos ##
Scala es un lenguaje puramente orientado a objetos en el sentido de que [todo es un objeto](unified_types.html). Los tipos y comportamientos de objetos son descriptos por [clases](classes.html) y [traits](traits.html) (que podría ser traducido como un "rasgo"). Las clases pueden ser extendidas a través de subclases y un flexible mecanismo [de composición mezclada](mixin-class-composition.html) que provee un claro remplazo para la herencia múltiple.

## Scala es funcional ##
Scala es también un lenguaje funcional en el sentido que [toda función es un valor](unified_types.html). Scala provee una [sintaxis ligera](anonymous-function-syntax.html) para definir funciones anónimas. Soporta [funciones de primer orden](higher-order-functions.html), permite que las funciones sean [anidadas](nested-functions.html), y soporta [currying](currying.html). Las [clases caso](case-classes.html) de Scala y las construcciones incorporadas al lenguaje para [reconocimiento de patrones](pattern-matching.html) modelan tipos algebráicos usados en muchos lenguajes de programación funcionales.

Además, la noción de reconocimiento de patrones de Scala se puede extender naturalmente al [procesamiento de datos XML](xml-processing.html) con la ayuda de [patrones de secuencias que igonoran a la derecha](regular-expression-patterns.html). En este contexto, [seq comprehensions](sequence-comprehensions.html) resultan útiles para formular consultas. Estas características hacen a Scala ideal para desarrollar aplicaciones como Web Services.

## Scala estaticamente tipado ##
Scala cuenta con un expresivo sistema de tipado que fuerza estaticamente las abstracciones a ser usadas en una manera coherente y segura. En particular, el sistema de tipado soprta:
* [Clases genéricas](generic-classes.html)
* [anotaciones variables](variances.html),
* límites de tipado [superiores](upper-type-bounds.html) e [inferiores](lower-type-bouunds.html),
* [clases internas](inner-classes.html) y [tipos abstractos](abstract-types.html) como miembros de objetos,
* [tipos compuestos](compound-types.html)
* [auto-referencias explicitamente tipadas](explicitly-typed-self-references.html)
* [vistas](views.html)
* [métodos polimórficos](polymorphic-methods.html)

El [mecanismo de inferencia de tipos locales](local-type-inference.html) se encarga de que el usuario no tengan que anotar el programa con información redundante de tipado. Combinadas, estas características proveen una base poderosa para el reuso seguro de abstracciones de programación y para la extensión segura (en cuanto a tipos) de software.

## Scala es extensible ##

En la práctica el desarrollo de aplicaciones específicas para un dominio generalmente requiere de "Lenguajes de dominio específico" (DSL). Scala provee una única combinación de mecanismos del lenguaje que simplifican la creación de construcciones propias del lenguaje en forma de librerías:
* cualquier método puede ser usado como un operador de [infijo o postfijo](operators.html)
* [las closures son construidas automáticamente dependiendo del tipo esperado](automatic-closures.html) (tipos objetivo).

El uso conjunto de ambas características facilita la definición de nuevas sentencias sin tener que extender la sintaxis y sin usar facciones de meta-programación como tipo macros.

Scala está diseñado para interoperar bien con el popular Entorno de ejecución de Java 2 (JRE). En particular, la interacción con el lenguaje orientado a objetos Java es muy sencillo. Scala tiene el mismo esquema de compilación (compilación separada, carga de clases dinámica) que java y permite acceder a las miles de librerías de gran calidad existentes.

Por favor continúe a la próxima página para conocer más.
