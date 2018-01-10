---
layout: multipage-overview
title: Overview

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 1
language: es
---

**Autores originales: Aleksandar Prokopec, Heather Miller**

**Traducción y arreglos: Santiago Basulto**

## Motivación

En el medio del cambio en los recientes años de los fabricantes de procesadores de arquitecturas simples a arquitecturas multi-nucleo, tanto el ámbito académico, como el industrial coinciden que la _Programación Paralela_ sigue siendo un gran desafío.

Las Colecciones Paralelizadas (Parallel collections, en inglés) fueron incluidas en la librería del lenguaje Scala en un esfuerzo de facilitar la programación paralela al abstraer a los usuarios de detalles de paralelización de bajo nivel, mientras se provee con una abstracción de alto nivel, simple y familiar. La esperanza era, y sigue siendo, que el paralelismo implícito detrás de una abstracción de colecciones (como lo es el actual framework de colecciones del lenguaje) acercara la ejecución paralela confiable, un poco más al trabajo diario de los desarrolladores.

La idea es simple: las colecciones son abstracciones de programación ficientemente entendidas y a su vez son frecuentemente usadas. Dada su regularidad, es posible que sean paralelizadas eficiente y transparentemente. Al permitirle al usuario intercambiar colecciones secuenciales por aquellas que son operadas en paralelo, las colecciones paralelizadas de Scala dan un gran paso hacia la posibilidad de que el paralelismo sea introducido cada vez más frecuentemente en nuestro código.

Veamos el siguiente ejemplo secuencial, donde realizamos una operación monádica en una colección lo suficientemente grande.

    val list = (1 to 10000).toList
    list.map(_ + 42)

Para realizar la misma operación en paralelo, lo único que devemos incluir, es la invocación al método `par` en la colección secuencial `list`. Después de eso, es posible utilizar la misma colección paralelizada de la misma manera que normalmente la usariamos si fuera una colección secuencial. El ejemplo superior puede ser paralelizado al hacer simplemente lo siguiente:

    list.par.map(_ + 42)

El diseño de la librería de colecciones paralelizadas de Scala está inspirada y fuertemente integrada con la librería estandar de colecciones (secuenciales) del lenguaje (introducida en la versión 2.8). Se provee te una contraparte paralelizada a un número importante de estructuras de datos de la librería de colecciones (secuenciales) de Scala, incluyendo:

* `ParArray`
* `ParVector`
* `mutable.ParHashMap`
* `mutable.ParHashSet`
* `immutable.ParHashMap`
* `immutable.ParHashSet`
* `ParRange`
* `ParTrieMap` (`collection.concurrent.TrieMap`s are new in 2.10)

Además de una arquitectura común, la librería de colecciones paralelizadas de Scala también comparte la _extensibilidad_ con la librería de colecciones secuenciales. Es decir, de la misma manera que los usuarios pueden integrar sus propios tipos de tipos de colecciones de la librería normal de colecciones secuenciales, pueden realizarlo con la librería de colecciones paralelizadas, heredando automáticamente todas las operaciones paralelas disponibles en las demás colecciones paralelizadas de la librería estandar.

## Algunos Ejemplos

To attempt to illustrate the generality and utility of parallel collections,
we provide a handful of simple example usages, all of which are transparently
executed in parallel.

De forma de ilustrar la generalidad y utilidad de las colecciones paralelizadas, proveemos un conjunto de ejemplos de uso útiles, todos ellos siendo ejecutados en paralelo de forma totalmente transparente al usuario.

_Nota:_ Algunos de los siguientes ejemplos operan en colecciones pequeñas, lo cual no es recomendado. Son provistos como ejemplo para ilustrar solamente el propósito. Como una regla heurística general, los incrementos en velocidad de ejecución comienzan a ser notados cuando el tamaño de la colección es lo suficientemente grande, tipicamente algunos cuantos miles de elementos. (Para más información en la relación entre tamaño de una coleccion paralelizada y su performance, por favor véase [appropriate subsection]({{ site.baseurl}}/es/overviews/parallel-collections/performance.html) en la sección [performance]({{ site.baseurl }}/es/overviews/parallel-collections/performance.html) (en inglés).

#### map

Usando un `map` paralelizado para transformar una colección de elementos tipo `String` a todos caracteres en mayúscula:

    scala> val apellidos = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    apellidos: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> apellidos.map(_.toUpperCase)
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(SMITH, JONES, FRANKENSTEIN, BACH, JACKSON, RODIN)

#### fold

Sumatoria mediante `fold` en un `ParArray`:

    scala> val parArray = (1 to 10000).toArray.par
    parArray: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3, ...

    scala> parArray.fold(0)(_ + _)
    res0: Int = 50005000

#### filtrando


Usando un filtrado mediante `filter` paralelizado para seleccionar los apellidos que alfabéticamente preceden la letra "K":

    scala> val apellidos = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    apellidos: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)

    scala> apellidos.filter(_.head >= 'J')
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Jackson, Rodin)

## Creación de colecciones paralelizadas

Las colecciones paralelizadas están pensadas para ser usadas exactamente de la misma manera que las colecciones secuenciales --la única diferencia notoria es cómo _obtener_ una colección paralelizada.

Generalmente se tienen dos opciones para la creación de colecciones paralelizadas:

Primero al utilizar la palabra clave `new` y una sentencia de importación apropiada:

    import scala.collection.parallel.immutable.ParVector
    val pv = new ParVector[Int]

Segundo, al _convertir_ desde una colección secuencial:

    val pv = Vector(1,2,3,4,5,6,7,8,9).par

Lo que es importante desarrollar aquí son estos métodos para la conversión de colecciones. Las colecciones secuenciales pueden ser convertiadas a colecciones paralelizadas mediante la invocación del método `par`, y de la misma manera, las colecciones paralelizadas pueden ser convertidas a colecciones secuenciales mediante el método `seq`.

_Nota:_ Las colecciones que son inherentemente secuenciales (en el sentido que sus elementos deben ser accedidos uno a uno), como las listas, colas y streams (a veces llamados flujos), son convertidos a sus contrapartes paralelizadas al copiar los todos sus elementos. Un ejemplo es la clase `List` --es convertida a una secuencia paralelizada inmutable común, que es un `ParVector`. Por supuesto, el tener que copiar los elementos para estas colecciones involucran una carga más de trabajo que no se sufre con otros tipos como: `Array`, `Vector`, `HashMap`, etc.

For more information on conversions on parallel collections, see the
[conversions]({{ site.baseurl }}/overviews/parallel-collections/conversions.html)
and [concrete parallel collection classes]({{ site.baseurl }}/overviews/parallel-collections/concrete-parallel-collections.html)
sections of thise guide.

Para más información sobre la conversión de colecciones paralelizadas, véase los artículos sobre [conversiones]({{ site.baseurl }}/es/overviews/parallel-collections/conversions.html) y [clases concretas de colecciones paralelizadas]({{ site.baseurl }}/es/overviews/parallel-collections/concrete-parallel-collections.html) de esta misma serie.

## Entendiendo las colecciones paralelizadas

A pesar de que las abstracciones de las colecciones paralelizadas se parecen mucho a las colecciones secuenciales normales, es importante notar que su semántica difiere, especialmente con relación a efectos secundarios (o colaterales, según algunas traducciones) y operaciones no asociativas.

Para entender un poco más esto, primero analizaremos _cómo_ son realizadas las operaciones paralelas. Conceptualmente, el framework de colecciones paralelizadas de Scala paraleliza una operación al "dividir" recursivamente una colección dada, aplicando una operación en cada partición de la colección en paralelo y recombinando todos los resultados que fueron completados en paralelo.

Esta ejecución concurrente y fuera de orden de las colecciones paralelizadas llevan a dos implicancias que es importante notar:

1. **Las operaciones con efectos secundarios pueden llegar a resultados no deterministas**
2. **Operaciones no asociativas generan resultados no deterministas**

### Operaciones con efectos secundarios

Given the _concurrent_ execution semantics of the parallel collections
framework, operations performed on a collection which cause side-effects
should generally be avoided, in order to maintain determinism. A simple
example is by using an accessor method, like `foreach` to increment a `var`
declared outside of the closure which is passed to `foreach`.

Dada la ejecución _concurrente_ del framework de colecciones paralelizadas, las operaciones que generen efectos secundarios generalmente deben ser evitadas, de manera de mantener el "determinismo".

Veamos un ejemplo:

    scala> var sum = 0
    sum: Int = 0

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.foreach(sum += _); sum
    res01: Int = 467766

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res02: Int = 457073

    scala> var sum = 0
    sum: Int = 0

    scala> list.foreach(sum += _); sum
    res03: Int = 468520

Acá podemos ver que cada vez que `sum` es reinicializado a 0, e invocamos el método `foreach` en nuestro objeto `list`, el valor de `sum` resulta ser distinto. La razón de este no-determinismo es una _condición de carrera_ -- lecturas/escrituras concurrentes a la misma variable mutable.

En el ejemplo anterior, es posible para dos hilos leer el _mismo_ valor de `sum`, demorarse un tiempo realizando la operación que tienen que hacer sobre `sum`, y después volver a escribir ese nuevo valor a `sum`, lo que probablemente resulte en una sobreescritura (y por lo tanto pérdida) de un valor anterior que generó otro hilo. Veamos otro ejemplo:

    HiloA: lee el valor en sum, sum = 0                                        valor de sum: 0
    HiloB: lee el valor en sum, sum = 0                                        valor de sum: 0
    HiloA: incrementa el  valor de sum a 760, graba sum = 760                  valor de sum: 760
    HiloA: incrementa el  valor de sum a 12, graba sum = 12                    valor de sum: 12

Este ejemplo ilustra un escenario donde dos hilos leen el mismo valor, `0`, antes que el otro pueda sumar su parte de la ejecución sobre la colección paralela. En este caso el `HiloA` lee `0` y le suma el valor de su cómputo, `0+760`, y en el caso del `HiloB`, le suma al valor leido `0` su resultado, quedando `0+12`. Después de computar sus respectivas sumas, ambos escriben el valor en `sum`. Ya que el `HiloA` llega a escribir antes que el `HiloB` (por nada en particular, solamente coincidencia que en este caso llegue primero el `HiloA`), su valor se pierde, porque seguidamente llega a escribir el `HiloB` y borra el valor previamente guardado. Esto se llama _condición de carrera_ porque el valor termina resultando una cuestión de suerte, o aleatoria, de quién llega antes o después a escribir el valor final.

### Operaciones no asociativas

Dado este funcionamiento "fuera de orden", también se debe ser cuidadoso de realizar solo operaciones asociativas para evitar comportamientos no esperados. Es decir, dada una colección paralelizada `par_col`, uno debe saber que cuando invoca una función de orden superior sobre `par_col`, tal como `par_col.reduce(func)`, el orden en que la función `func` es invocada sobre los elementos de `par_col` puede ser arbitrario (de hecho, es el caso más probable). Un ejemplo simple y pero no tan obvio de una operación no asociativa es es una substracción:

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…

    scala> list.reduce(_-_)
    res01: Int = -228888

    scala> list.reduce(_-_)
    res02: Int = -61000

    scala> list.reduce(_-_)
    res03: Int = -331818

En el ejemplo anterior invocamos reduce sobre un `ParVector[Int]` pasándole `_-_`. Lo que hace esto es simplemente tomar dos elementos y resta el primero al segundo. Dado que el framework de colecciones paralelizadas crea varios hilos que realizan `reduce(_-_)` independientemente en varias secciones de la colección, el resultado de correr dos veces el método `reduce(_-_)` en la misma colección puede no ser el mismo.

_Nota:_ Generalmente se piensa que, al igual que las operaciones no asociativas, las operaciones no conmutativas pasadas a un función de orden superior también generan resultados extraños (no deterministas). En realidad esto no es así, un simple ejemplo es la concatenación de Strings (cadenas de caracteres). -- una operación asociativa, pero no conmutativa:

    scala> val strings = List("abc","def","ghi","jk","lmnop","qrs","tuv","wx","yz").par
    strings: scala.collection.parallel.immutable.ParSeq[java.lang.String] = ParVector(abc, def, ghi, jk, lmnop, qrs, tuv, wx, yz)

    scala> val alfabeto = strings.reduce(_++_)
    alfabeto: java.lang.String = abcdefghijklmnopqrstuvwxyz

Lo que implica el "fuera de orden" en las colecciones paralelizadas es solamente que la operación será ejecutada fuera de orden (en un sentido _temporal_, es decir no secuencial, no significa que el resultado va a ser re-"*combinado*" fuera de orden (en un sentido de _espacio_). Al contrario, en general los resultados siempre serán reensamblados en roden, es decir una colección paralelizada que se divide en las siguientes particiones A, B, C, en ese orden, será reensamblada nuevamente en el orden A, B, C. No en otro orden arbitrario como B, C, A.

Para más información de cómo se dividen y se combinan los diferentes tipos de colecciones paralelizadas véase el artículo sobre [Arquitectura]({{ site.baseurl }}/es/overviews/parallel-collections/architecture.html) de esta misma serie.
