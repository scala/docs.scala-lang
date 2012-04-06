---
layout: overview-large
title: Overview

disqus: true

partof: parallel-collections
num: 1
languages: [ja]
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

_Nota:_ Algunos de los siguientes ejemplos operan en colecciones pequeñas, lo cual no es recomendado. Son provistos como ejemplo para ilustrar solamente el propósito. Como una regla heurística general, los incrementos en velocidad de ejecución comienzan a ser notados cuando el tamaño de la colección es lo suficientemente grande, tipicamente algunos cuantos miles de elementos. (Para más información en la relación entre tamaño de una coleccion paralelizada y su performance, por favor véase [appropriate subsection]({{ site.baseurl}}/overviews/parallel-collections/performance.html#how_big_should_a_collection_be_to_go_parallel) en la sección [performance]({{ site.baseurl }}/overviews/parallel-collections/performance.html) (en inglés).

#### map

Usando un `map` paralelizado para transformar una colección de elementos tipo `String` a todos caracteres en mayúscula:

    scala> val apellidos = List("Smith","Jones","Frankenstein","Bach","Jackson","Rodin").par
    apellidos: scala.collection.parallel.immutable.ParSeq[String] = ParVector(Smith, Jones, Frankenstein, Bach, Jackson, Rodin)
    
    scala> apellidos.map(_.toUpperCase)
    res0: scala.collection.parallel.immutable.ParSeq[String] = ParVector(SMITH, JONES, FRANKENSTEIN, BACH, JACKSON, RODIN)

#### fold

Sumatoria mediante `fold` en un `ParArray`:

    scala> val parArray = (1 to 1000000).toArray.par
    parArray: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3, ...
    
    scala> parArray.fold(0)(_ + _)
    res0: Int = 1784293664

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

What's important to expand upon here are these conversion methods-- sequential
collections can be converted to parallel collections by invoking the
sequential collection's `par` method, and likewise, parallel collections can
be converted to sequential collections by invoking the parallel collection's
`seq` method.

_Of Note:_ Collections that are inherently sequential (in the sense that the
elements must be accessed one after the other), like lists, queues, and
streams, are converted to their parallel counterparts by copying the elements
into a similar parallel collection. An example is `List`-- it's converted into
a standard immutable parallel sequence, which is a `ParVector`. Of course, the
copying required for these collection types introduces an overhead not
incurred by any other collection types, like `Array`, `Vector`, `HashMap`, etc.

For more information on conversions on parallel collections, see the
[conversions]({{ site.baseurl }}/overviews/parallel-collections/converesions.html) 
and [concrete parallel collection classes]({{ site.baseurl }}/overviews/parallel-collections/concrete-parallel-collections.html) 
sections of thise guide.

## Semantics

While the parallel collections abstraction feels very much the same as normal
sequential collections, it's important to note that its semantics differs,
especially with regards to side-effects and non-associative operations.

In order to see how this is the case, first, we visualize _how_ operations are
performed in parallel. Conceptually, Scala's parallel collections framework
parallelizes an operation on a parallel collection by recursively "splitting"
a given collection, applying an operation on each partition of the collection
in parallel, and re-"combining" all of the results that were completed in
parallel. 

These concurrent, and "out-of-order" semantics of parallel collections lead to
the following two implications:

1. **Side-effecting operations can lead to non-determinism**
2. **Non-associative operations lead to non-determinism**

### Side-Effecting Operations

Given the _concurrent_ execution semantics of the parallel collections
framework, operations performed on a collection which cause side-effects
should generally be avoided, in order to maintain determinism. A simple
example is by using an accessor method, like `foreach` to increment a `var`
declared outside of the closure which is passed to `foreach`.

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
    
Here, we can see that each time `sum` is reinitialized to 0, and `foreach` is
called again on `list`, `sum` holds a different value. The source of this 
non-determinism is a _data race_-- concurrent reads/writes to the same mutable
variable.

In the above example, it's possible for two threads to read the _same_ value
in `sum`, to spend some time doing some operation on that value of `sum`, and
then to attempt to write a new value to `sum`, potentially resulting in an
overwrite (and thus, loss) of a valuable result, as illustrated below:

    ThreadA: read value in sum, sum = 0                value in sum: 0
    ThreadB: read value in sum, sum = 0                value in sum: 0
    ThreadA: increment sum by 760, write sum = 760     value in sum: 760
    ThreadB: increment sum by 12, write sum = 12       value in sum: 12

The above example illustrates a scenario where two threads read the same
value, `0`, before one or the other can sum `0` with an element from their
partition of the parallel collection. In this case, `ThreadA` reads `0` and
sums it with its element, `0+760`, and in the case of `ThreadB`, sums `0` with
its element, `0+12`. After computing their respective sums, they each write
their computed value in `sum`. Since `ThreadA` beats `ThreadB`, it writes
first, only for the value in `sum` to be overwritten shortly after by
`ThreadB`, in effect completely overwriting (and thus losing) the value `760`.

### Non-Associative Operations

Given this _"out-of-order"_ semantics,  also must be careful to perform only
associative operations in order to avoid non-determinism. That is, given a
parallel collection, `pcoll`, one should be sure that when invoking a 
higher-order function on `pcoll`, such as `pcoll.reduce(func)`, the order in 
which `func` is applied to the elements of `pcoll` can be arbitrary. A simple, 
but obvious example is a non-associative operation such as subtraction:

    scala> val list = (1 to 1000).toList.par
    list: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(1, 2, 3,…
    
    scala> list.reduce(_-_)
    res01: Int = -228888
    
    scala> list.reduce(_-_)
    res02: Int = -61000
    
    scala> list.reduce(_-_)
    res03: Int = -331818
    
In the above example, we take a `ParVector[Int]`, invoke `reduce`, and pass to
it `_-_`, which simply takes two unnamed elements, and subtracts the first
from the second. Due to the fact that the parallel collections framework spawns
threads which, in effect, independently perform `reduce(_-_)` on different
sections of the collection, the result of two runs of `reduce(_-_)` on the
same collection will not be the same.

_Note:_ Often, it is thought that, like non-associative operations,  non-commutative  
operations passed to a higher-order function on a parallel
collection likewise result in non-deterministic behavior. This is not the
case, a simple example is string concatenation-- an associative, but non-
commutative operation:

    scala> val strings = List("abc","def","ghi","jk","lmnop","qrs","tuv","wx","yz").par
    strings: scala.collection.parallel.immutable.ParSeq[java.lang.String] = ParVector(abc, def, ghi, jk, lmnop, qrs, tuv, wx, yz) 
    
    scala> val alphabet = strings.reduce(_++_)
    alphabet: java.lang.String = abcdefghijklmnopqrstuvwxyz

The _"out of order"_ semantics of parallel collections only means that
the operation will be executed out of order (in a _temporal_ sense. That is,
non-sequentially), it does not mean that the result will be
re-"*combined*" out of order (in a _spatial_ sense). On the contrary, results
will generally always be reassembled _in order_-- that is, a parallel collection
broken into partitions A, B, C, in that order, will be reassembled once again
in the order A, B, C. Not some other arbitrary order like B, C, A.

For more on how parallel collections split and combine operations on different
parallel collection types, see the [Architecture]({{ site.baseurl }}/overviews
/parallel-collections/architecture.html) section of this guide. 

