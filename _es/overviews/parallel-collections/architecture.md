---
layout: multipage-overview
title: Arquitectura de la librería de colecciones paralelas de Scala

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 5
language: es
---

Del mismo modo que la librería de colecciones secuencial, la versión paralela
ofrece un gran número de operaciones uniformes sobre un amplio abanico de
implementaciones de diversas colecciones. Siguiendo la filosofía de la versión
secuencial, se pretende evitar la duplicación de código mediante el uso de
"plantillas" de colecciones paralelas, las cuales permiten que las operaciones
sean definidas una sola vez, pudiendo ser heredadas por las diferentes implementaciones.

El uso de este enfoque facilita de manera notable el **mantenimiento** y la **extensibilidad**
de la librería. En el caso del primero -- gracias a que cada operación se implementa una única
vez y es heredada por todas las colecciones, el mantenimiento es más sencillo y robusto; la
corrección de posibles errores se progaga hacia abajo en la jerarquía de clases en lugar de
duplicar las implementaciones. Del mismo modo, los motivos anteriores facilitan que la librería al completo sea
más sencilla de extender -- la mayor parte de las nuevas colecciones podrán heredar la mayoría de sus
operaciones.

## Core Abstractions

El anteriormente mencionado trait "template" implementa la mayoría de las operaciones en términos
de dos abstracciones básicas -- `Splitter`s y `Combiner`s

### Splitters

El trabajo de un `Splitter`, como su propio nombre indica, consiste en dividir una
colección paralela en una partición no trivial de sus elementos. La idea principal
es dividir dicha colección en partes más pequeñas hasta alcanzar un tamaño en el que
se pueda operar de manera secuencial sobre las mismas.

    trait Splitter[T] extends Iterator[T] {
    	def split: Seq[Splitter[T]]
    }

Curiosamente, los `Splitter` son implementados como `Iterator`s, por lo que además de
particionar, son utilizados por el framework para recorrer una colección paralela
(dado que heredan los métodos `next`y `hasNext` presentes en `Iterator`).
Este "splitting iterator" presenta una característica única: su método `split`
divide `this` (recordad que un `Splitter` es de tipo `Iterator`) en un conjunto de
`Splitter`s cada uno de los cuales recorre un subconjunto disjunto del total de
elementos presentes en la colección. Del mismo modo que un `Iterator` tradicional,
un `Splitter` es invalidado una vez su método `split` es invocado.

Generalmente las colecciones son divididas, utilizando `Splitter`s, en subconjuntos
con un tamaño aproximadamente idéntico. En situaciones donde se necesitan un tipo de
particiones más arbitrarias, particularmente en las secuencias paralelas, se utiliza un
`PreciseSplitter`, el cual hereda de `Splitter` y define un meticuloso método de
 particionado: `psplit`.

### Combiners

Podemos ver los `Combiner`s como una generalización de los `Builder`, provenientes
de las secuencias en Scala. Cada una de las colecciones paralelas proporciona un
`Combiner` independiente, del mismo modo que cada colección secuencial ofrece un
`Builder`.

Mientras que en las colecciones secuenciales los elementos pueden ser añadidos a un
`Builder`, y una colección puede ser construida mediante la invocación del método
`result`, en el caso de las colecciones paralelas los `Combiner` presentan un método
llamado `combine` que acepta otro `Combiner`como argumento y retona un nuevo `Combiner`,
el cual contiene la unión de ambos. Tras la invocación del método `combine` ambos
`Combiner` son invalidados.

    trait Combiner[Elem, To] extends Builder[Elem, To] {
    	def combine(other: Combiner[Elem, To]): Combiner[Elem, To]
    }

Los dos parametros de tipo `Elem` y `To` presentes en el fragmento de código anterior
representan el tipo del elemento y de la colección resultante respectivamente.

_Nota:_ Dados dos `Combiner`s, `c1` y `c2` donde `c1 eq c2` toma el valor `true`
(esto implica que son el mismo `Combiner`), la invocación de `c1.combine(c2)`
simplemente retona el `Combiner` receptor de la llamada, `c1` en el ejemplo que
nos ocupa.

## Hierarchy

La librería de colecciones paralelas está inspirada en gran parte en el diseño
de la librería de colecciones secuenciales -- de hecho, "replican" los correspondientes
traits presentes en el framework de colecciones secuenciales, tal y como se muestra
a continuación.

[<img src="{{ site.baseurl }}/resources/images/parallel-collections-hierarchy.png" width="550">]({{ site.baseurl }}/resources/images/parallel-collections-hierarchy.png)

<center><b>Jerarquía de clases de las librerías de colecciones secuenciales y paralelas de Scala</b></center>
<br/>

El objetivo es, por supuesto, integrar tan estrechamente como sea posible las colecciones
secuenciales y paralelas, permitendo llevar a cabo una sustitución directa entre ambos
tipos de colecciones.

Con el objetivo de tener una referencia a una colección que podría ser secuencial o
paralela (de modo que sea posible "intercambiar" la colección paralela y la secuencial
mediante la invocación de `par` y `seq` respectivamente), necesitamos un supertipo común a
los tipos de las dos colecciones. Este es el origen de los traits "generales" mostrados
anteriormente: `GenTraversable`, `GenIterable`, `GenSeq`, `GenMap` and `GenSet`, los cuales
no garantizan el orden ni el "one-at-a-time" del recorrido. Los correspondientes traits paralelos
o secuenciales heredan de los anteriores. Por ejemplo, el tipo `ParSeq`y `Seq` son subtipos
de una secuencia más general: `GenSeq`, pero no presentan un relación de herencia entre ellos.

Para una discusión más detallada de la jerarquía de clases compartida por las colecciones secuenciales y
paralelas referirse al artículo \[[1][1]\]

## References

1. [On a Generic Parallel Collection Framework, Aleksandar Prokopec, Phil Bawgell, Tiark Rompf, Martin Odersky, June 2011][1]

[1]: http://infoscience.epfl.ch/record/165523/files/techrep.pdf "flawed-benchmark"
