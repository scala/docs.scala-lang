---
layout: multipage-overview
title: Clases Concretas de las Colecciones Paralelas

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 2
language: es
---

## Array Paralelo

Una secuencia [ParArray](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/mutable/ParArray.html) contiene un conjunto de elementos contiguos lineales. Esto significa que los elementos pueden ser accedidos y actualizados (modificados) eficientemente al modificar la estructura subyacente (un array). El iterar sobre sus elementos es también muy eficiente por esta misma razón. Los Arrays Paralelos son como arrays en el sentido de que su tamaño es constante.

    scala> val pa = scala.collection.parallel.mutable.ParArray.tabulate(1000)(x => 2 * x + 1)
    pa: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 3, 5, 7, 9, 11, 13,...

    scala> pa reduce (_ + _)
    res0: Int = 1000000

    scala> pa map (x => (x - 1) / 2)
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(0, 1, 2, 3, 4, 5, 6, 7,...

Internamente, para partir el array para que sea procesado de forma paralela se utilizan [splitters]({{ site.baseurl }}/es/overviews/parallel-collections/architecture.html) (o "partidores"). El Splitter parte y crea dos nuevos splitters con sus índices actualizados. A continuación son utilizados los [combiners]({{ site.baseurl }}/es/overviews/parallel-collections/architecture.html) (o "combinadores"), que necesitan un poco más de trabajo. Ya que en la mayoría de los métodos transformadores (ej: `flatMap`, `filter`, `takeWhile`, etc.) previamente no es sabido la cantidad de elementos (y por ende, el tamaño del array), cada combiner es esencialmente una variante de un array buffer con un tiempo constante de la operación `+=`. Diferentes procesadores añaden elementos a combiners de arrays separados, que después son combinados al encadenar sus arrays internos. El array subyacente se crea en memoria y se rellenan sus elementos después que el número total de elementos es conocido. Por esta razón, los métodos transformadores son un poco más caros que los métodos de acceso. También, nótese que la asignación de memoria final procede secuencialmente en la JVM, lo que representa un cuello de botella si la operación de mapeo (el método transformador aplicado) es en sí económico (en términos de procesamiento).

Al invocar el método `seq`, los arrays paralelos son convertidos al tipo de colección `ArraySeq`, que vendría a ser la contraparte secuencial del `ParArray`. Esta conversión es eficiente, y el `ArraySeq` utiliza a bajo nivel el mismo array que había sido obtenido por el array paralelo.


## Vector Paralelo

Un [ParVector](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParVector.html) es una secuencia inmutable con un tiempo de acceso y modificación logarítimico bajo a constante.

    scala> val pv = scala.collection.parallel.immutable.ParVector.tabulate(1000)(x => x)
    pv: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,...

    scala> pv filter (_ % 2 == 0)
    res0: scala.collection.parallel.immutable.ParVector[Int] = ParVector(0, 2, 4, 6, 8, 10, 12, 14, 16, 18,...

Los vectores inmutables son representados por árboles, por lo que los splitters dividen pasándose subárboles entre ellos. Los combiners concurrentemente mantienen un vector de elementos y son combinados al copiar dichos elementos de forma "retardada". Es por esta razón que los métodos tranformadores son menos escalables que sus contrapartes en arrays paralelos. Una vez que las operaciones de concatenación de vectores estén disponibles en una versión futura de Scala, los combiners podrán usar dichas características y hacer más eficientes los métodos transformadores.

Un vector paralelo es la contraparte paralela de un [Vector](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Vector.html) secuencial, por lo tanto la conversión entre estas dos estructuras se efectúa en tiempo constante.

## Rango (Range) Paralelo

Un [ParRange](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParRange.html) es una secuencia ordenada separada por intervalos iguales (ej: 1, 2, 3 o 1, 3, 5, 7). Un rango paralelo es creado de forma similar al [Rango](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/immutable/Range.html) secuencial:

    scala> 1 to 3 par
    res0: scala.collection.parallel.immutable.ParRange = ParRange(1, 2, 3)

    scala> 15 to 5 by -2 par
    res1: scala.collection.parallel.immutable.ParRange = ParRange(15, 13, 11, 9, 7, 5)

Tal como los rangos secuenciales no tienen constructores, los rangos paralelos no tienen [combiner]({{ site.baseurl }}/overviews/parallel-collections/architecture.html)s. Mapear elementos de un rango paralelo produce un vector paralelo. Los rangos secuenciales y paralelos pueden ser convertidos de uno a otro utilizando los métodos `seq` y `par`.

    scala> (1 to 5 par) map ((x) => x * 2)
    res2: scala.collection.parallel.immutable.ParSeq[Int] = ParVector(2, 4, 6, 8, 10)


## Tablas Hash Paralelas

Las tablas hash paralelas almacenan sus elementos en un array subyacente y los almacenan en una posición determinada por el código hash del elemento respectivo. Las versiones mutables de los hash sets paralelos ([mutable.ParHashSet](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/mutable/ParHashSet.html)) y los hash maps paraleos ([mutable.ParHashMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/mutable/ParHashMap.html)) están basados en tablas hash.

    scala> val phs = scala.collection.parallel.mutable.ParHashSet(1 until 2000: _*)
    phs: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(18, 327, 736, 1045, 773, 1082,...

    scala> phs map (x => x * x)
    res0: scala.collection.parallel.mutable.ParHashSet[Int] = ParHashSet(2181529, 2446096, 99225, 2585664,...

Los combiners de las tablas hash ordenan los elementos en posiciones de acuerdo a su código hash. Se combinan simplemente concatenando las estructuras que contienen dichos elementos. Una vez que la tabla hash final es construida (es decir, se invoca el método `result` del combiner), el array subyacente es rellenado y los elementos de las diferentes estructuras previas son copiados en paralelo a diferentes segmentos continuos del array de la tabla hash.

Los "Mapas Hash" (Hash Maps) y los "Conjuntos Hash" (Hash Sets) secuenciales pueden ser convertidos a sus variantes paralelas usando el método `par`. Las tablas hash paralelas internamente necesitan de un mapa de tamaño que mantiene un registro del número de elementos en cada pedazo de la hash table. Lo que esto significa es que la primera vez que una tabla hash secuencial es convertida a una tabla hash paralela, la tabla es recorrida y el mapa de tamaño es creado - es por esta razón que la primera llamada a `par` requiere un tiempo lineal con respecto al tamaño total de la tabla. Cualquier otra modificación que le siga mantienen el estado del mapa de tamaño, por lo que conversiones sucesivas entre `par` y `seq` tienen una complejidad constante. El mantenimiento del tamaño del mapa puede ser habilitado y deshabilitado utilizando el método `useSizeMap` de la tabla hash. Es importante notar que las modificaciones en la tabla hash secuencial son visibles en la tabla hash paralela, y viceversa.

## Hash Tries Paralelos

Los Hash Tries paralelos son la contraparte paralela de los hash tries inmutables, que son usados para representar conjuntos y mapas inmutables de forma eficiente. Las clases involucradas son: [immutable.ParHashSet](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/parallel/immutable/ParHashSet.html)
y
[immutable.ParHashMap](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/immutable/ParHashMap.html).

    scala> val phs = scala.collection.parallel.immutable.ParHashSet(1 until 1000: _*)
    phs: scala.collection.parallel.immutable.ParHashSet[Int] = ParSet(645, 892, 69, 809, 629, 365, 138, 760, 101, 479,...

    scala> phs map { x => x * x } sum
    res0: Int = 332833500

De forma similar a las tablas hash paralelas, los [combiners]({{ site.baseurl }}/overviews/parallel-collections/architecture.html) de los hash tries paralelos pre-ordenan los elementos en posiciones y construyen el hash trie resultante en paralelo al asignarle distintos grupos de posiciones a diferentes procesadores, los cuales contruyen los sub-tries independientemente.

Los hash tries paralelos pueden ser convertidos hacia y desde hash tries secuenciales por medio de los métodos `seq` y `par`.


## Tries Paralelos Concurrentes

Un [concurrent.TrieMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/concurrent/TrieMap.html) es un mapa thread-safe (seguro ante la utilización de múltiples hilos concurrentes) mientras que [mutable.ParTrieMap](http://www.scala-lang.org/api/{{ site.scala-version}}/scala/collection/parallel/mutable/ParTrieMap.html) es su contraparte paralela. Si bien la mayoría de las estructuras de datos no garantizan una iteración consistente si la estructura es modificada en medio de dicha iteración, los tries concurrentes garantizan que las actualizaciones sean solamente visibles en la próxima iteración. Esto significa que es posible mutar el trie concurrente mientras se está iterando sobre este, como en el siguiente ejemplo, que computa e imprime las raíces cuadradas de los números entre 1 y 99:

    scala> val numbers = scala.collection.parallel.mutable.ParTrieMap((1 until 100) zip (1 until 100): _*) map { case (k, v) => (k.toDouble, v.toDouble) }
    numbers: scala.collection.parallel.mutable.ParTrieMap[Double,Double] = ParTrieMap(0.0 -> 0.0, 42.0 -> 42.0, 70.0 -> 70.0, 2.0 -> 2.0,...

    scala> while (numbers.nonEmpty) {
         |   numbers foreach { case (num, sqrt) =>
         |     val nsqrt = 0.5 * (sqrt + num / sqrt)
         |     numbers(num) = nsqrt
         |     if (math.abs(nsqrt - sqrt) < 0.01) {
         |       println(num, nsqrt)
         |       numbers.remove(num)
         |     }
         |   }
         | }
    (1.0,1.0)
    (2.0,1.4142156862745097)
    (7.0,2.64576704419029)
    (4.0,2.0000000929222947)
    ...


Para ofrecer más detalles de lo que sucede bajo la superficie, los [Combiners]({{ site.baseurl }}/overviews/parallel-collections/architecture.html) son implementados como `TrieMap`s --ya que esta es una estructura de datos concurrente, solo un combiner es construido para todo la invocación al método transformador y compartido por todos los procesadores.

Al igual que todas las colecciones paralelas mutables, `TrieMap`s y la versión paralela, `ParTrieMap`s obtenidas mediante los métodos `seq` o `par` subyacentemente comparten la misma estructura de almacenamiento, por lo tanto modificaciones en una es visible en la otra.


## Características de desmpeño (performance)

Performance de los tipo secuencia:

|               | head | tail | apply | update| prepend | append | insert |
| --------      | ---- | ---- | ----  | ----  | ----    | ----   | ----   |
| `ParArray`    | C    | L    | C     | C     |  L      | L      |  L     |
| `ParVector`   | eC   | eC   | eC    | eC    |  eC     | eC     |  -     |
| `ParRange`    | C    | C    | C     | -     |  -      | -      |  -     |

Performance para los sets y maps:

|                          | lookup | add  | remove |
| --------                 | ----   | ---- | ----   |
| **inmutables**           |        |      |        |
| `ParHashSet`/`ParHashMap`| eC     | eC   | eC     |
| **mutables**             |        |      |        |
| `ParHashSet`/`ParHashMap`| C      | C    | C      |
| `ParTrieMap`             | eC     | eC   | eC     |


Los valores en las tablas de arriba se explican de la siguiente manera:

|     |                                           |
| --- | ----                                      |
| **C**   | La operación toma un tiempo constante (rápido) |
| **eC**  | La opración toma tiempo efectivamente constante, pero esto puede depender de algunas suposiciones como el tamaño máximo de un vector o la distribución de las claves hash. |
| **aC**  | La operación requiere un tiempo constante amortizado. Algunas invocaciones de la operación pueden tomar un poco más de tiempo, pero si en promedio muchas operaciones son realizadas solo es requerido tiempo constante. |
| **Log** | La operación requiere de un tiempo proporcional al logaritmo del tamaño de la colección. |
| **L**   | La operación es linea, es decir que requiere tiempo proporcional al tamaño de la colección. |
| **-**   | La operación no es soportada. |

La primer tabla considera tipos secuencia --ambos mutables e inmutables-- con las siguientes operaciones:

|     |                                                     |
| --- | ----                                                |
| **head**   | Seleccionar el primer elemento de la secuencia. |
| **tail**   | Produce una nueva secuencia que contiene todos los elementos menos el primero. |
| **apply**  | Indexación. Seleccionar un elemento por posición. |
| **update** | Actualización funcional (con `updated`) para secuencias inmutables, actualización real con efectos laterales para secuencias mutables. |
| **prepend**| Añadir un elemento al principio de la colección. Para secuencias inmutables, esto produce una nueva secuencia. Para secuencias mutables, modifica la secuencia existente. |
| **append** | Añadir un elemento al final de la secuencia. Para secuencias inmutables, produce una nueva secuencia. Para secuencias mutables modifica la secuencia existente. |
| **insert** | Inserta un elemento a una posición arbitraria. Solamente es posible en secuencias mutables. |

La segunda tabla trata sets y maps, tanto mutables como inmutables, con las siguientes operaciones:

|     |                                                     |
| --- | ----                                                |
| **lookup** | Comprueba si un elemento es contenido en un set, o selecciona un valor asociado con una clave en un map. |
| **add**    | Añade un nuevo elemento a un set o un par clave/valor a un map. |
| **remove** | Removing an element from a set or a key from a map. |
| **remove** | Elimina un elemento de un set o una clave de un map. |
| **min**    | El menor elemento de un set o la menor clave de un mapa. |
