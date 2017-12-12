---
layout: multipage-overview
title: Midiendo el rendimiento

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 8
language: es
---

## Performance on the JVM

Algunas veces el modelo de rendimiento de la JVM se complica debido a comentarios
sobre el mismo, y como resultado de los mismos, se tienen concepciones equívocas del mismo.
Por diferentes motivos, determinado código podría ofrecer un rendimiento o escalabilidad
inferior a la esperada. A continuación ofrecemos algunos ejemplos.

Uno de los principales motivos es que el proceso de compilación de una aplicación que se
ejecuta sobre la JVM no es el mismo que el de un lenguaje compilado de manera estática
(véase \[[2][2]\]). Los compiladores de Java y Scala traducen el código fuente en *bytecode* y
el conjunto de optimizaciones que llevan a cabo es muy reducido. En la mayoría de las JVM
modernas, una vez el bytecode es ejecutado, se convierte en código máquina dependiente de la
arquitectura de la máquina subyacente. Este proceso es conocido como compilación "just-int-time".
Sin embargo, el nivel de optimización del código es muy bajo puesto que dicho proceso deber ser
lo más rápido posible. Con el objetivo de evitar el proceso de recompilación, el llamado
compilador HotSpot optimiza únicamente aquellas partes del código que son ejecutadas de manera
frecuente. Esto supone que los desarrolladores de "benchmarks" deberán ser conscientes que los
programas podrían presentar rendimientos dispares en diferentes ejecuciones. Múltiples ejecuciones
de un mismo fragmento de código (por ejemplo un método) podrían ofrecer rendimientos dispares en función de
si se ha llevado a cabo un proceso de optimización del código entre dichas ejecuciones. Adicionalmente,
la medición de los tiempos de ejecución de un fragmento de código podría incluir el tiempo en el que
el propio compilador JIT lleva a cabo el proceso de optimizacion, falseando los resultados.

Otro elemento "oculto" que forma parte de la JVM es la gestión automática de la memoria. De vez en cuando,
la ejecución de un programa es detenida para que el recolector de basura entre en funcionamiento. Si el
programa que estamos analizando realiza alguna reserva de memoria (algo que la mayoría de programas hacen),
el recolector de basura podría entrar en acción, posiblemente distorsionando los resultados. Con el objetivo
de disminuir los efectos de la recolección de basura, el programa bajo estudio deberá ser ejecutado en
múltiples ocasiones para disparar numerosas recolecciones de basura.

Una causa muy común que afecta de manera notable al rendimiento son las conversiones implícitas que se
llevan a cabo cuando se pasa un tipo primitivo a un método que espera un argumento genérico. En tiempo
de ejecución, los tipos primitivos con convertidos en los objetos que los representan, de manera que puedan
ser pasados como argumentos en los métodos que presentan parámetros genéricos. Este proceso implica un conjunto
extra de reservas de memoria y es más lento, ocasionando nueva basura en el heap.

Cuando nos referimos al rendimiento en colecciones paralelas la contención de la memoria es un problema muy
común, dado que el desarrollador no dispone de un control explícito sobre la asignación de los objetos.
De hecho, debido a los efectos ocasionados por la recolección de basura, la contención puede producirse en
un estado posterior del ciclo de vida de la aplicación, una vez los objetos hayan ido circulando por la
memoria. Estos efectos deberán ser tenidos en cuenta en el momento en que se esté desarrollando un benchmark.

## Ejemplo de microbenchmarking

Numerosos enfoques permiten evitar los anteriores efectos durante el periodo de medición.
En primer lugar, el microbenchmark debe ser ejecutado el número de veces necesario que
permita asegurar que el compilador just-in-time ha compilado a código máquina y que
ha optimizado el código resultante. Esto es lo que comunmente se conoce como fase de
calentamiento.

El microbenchmark debe ser ejecutado en una instancia independiente de la máquina virtual
con el objetivo de reducir la cantidad de ruido proveniente de la recolección de basura
de los objetos alocados por el propio benchmark o de compilaciones just-in-time que no
están relacionadas con el proceso que estamos midiendo.

Deberá ser ejecutado utilizando la versión servidora de la máquina virtual, la cual lleva a
cabo un conjunto de optimizaciones mucho más agresivas.

Finalmente, con el objetivo de reducir la posibilidad de que una recolección de basura ocurra
durante la ejecución del benchmark, idealmente, debería producirse un ciclo de recolección de basura antes
de la ejecución del benchmark, retrasando el siguiente ciclo tanto como sea posible.

El trait `scala.testing.Benchmark` se predefine en la librería estándar de Scala y ha sido diseñado con
el punto anterior en mente. A continuación se muestra un ejemplo del benchmarking de un operación map
sobre un "trie" concurrente:

    import collection.parallel.mutable.ParTrieMap
	import collection.parallel.ForkJoinTaskSupport

    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val partrie = ParTrieMap((0 until length) zip (0 until length): _*)

      partrie.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        partrie map {
          kv => kv
        }
      }
    }

El método `run` encapsula el código del microbenchmark que será ejecutado de
manera repetitiva y cuyos tiempos de ejecución serán medidos. El anterior objeto `Map` extiende
el trait `scala.testing.Benchmark` y parsea los parámetros `par` (nivel de paralelismo) y
`length` (número de elementos en el trie). Ambos parámetros son especificados a través de
propiedades del sistema.

Tras compilar el programa anterior, podríamos ejecutarlo tal y como se muestra a continuación:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=300000 Map 10

El flag `server` indica que la máquina virtual debe ser utiliada en modo servidor. `cp` especifica
el classpath e incluye todos los archivos __.class__ en el directorio actual así como el jar de
la librería de Scala. Los argumentos `-Dpar` y `-Dlength` representan el nivel de paralelismo y
el número de elementos respectivamente. Por último, `10` indica el número de veces que el benchmark
debería ser ejecutado en una misma máquina virtual.

Los tiempos de ejecución obtenidos estableciendo `par` a los valores `1`, `2`, `4` y `8` sobre un
procesador quad-core i7 con hyperthreading habilitado son los siguientes:

    Map$	126	57	56	57	54	54	54	53	53	53
    Map$	90	99	28	28	26	26	26	26	26	26
    Map$	201	17	17	16	15	15	16	14	18	15
    Map$	182	12	13	17	16	14	14	12	12	12

Podemos observar en la tabla anterior que el tiempo de ejecución es mayor durante las
ejecuciones iniciales, reduciéndose a medida que el código va siendo optimizado. Además,
podemos ver que el beneficio del hyperthreading no es demasiado alto en este ejemplo
concreto, puesto que el incremento de `4` a `8` hilos produce un incremento mínimo en
el rendimiento.

## ¿Cómo de grande debe ser una colección para utilizar la versión paralela?

Esta es pregunta muy común y la respuesta es algo complicada.

El tamaño de la colección a partir de la cual la paralelización merece la pena
depende de numerosos factores. Algunos de ellos, aunque no todos, son:

- Arquitectura de la máquina. Diferentes tipos de CPU ofrecen diferente características
  de rendimiento y escalabilidad. Por ejemplo, si la máquina es multicore o presenta
  múltiples procesadores comunicados mediante la placa base.

- Versión y proveedor de la JVM. Diferentes máquinas virtuales llevan a cabo
  diferentes optimizaciones sobre el código en tiempo de ejecución. Implementan
  diferente gestion de memoria y técnicas de sincronización. Algunas de ellas no
  soportan el `ForkJoinPool`, volviendo a `ThreadPoolExecutor`, lo cual provoca
  una sobrecarga mucho mayor.

- Carga de trabajo por elemento. Una función o un predicado para una colección
  paralela determina cómo de grande es la carga de trabajo por elemento. Cuanto
  menor sea la carga de trabajo, mayor será el número de elementos requeridos para
  obtener acelaraciones cuando se está ejecutando en paralelo.

- Uso de colecciones específicas. Por ejemplo, `ParArray` y
  `ParTrieMap` tienen "splitters" que recorren la colección a diferentes
  velocidades, lo cual implica que existe más trabajo por elemento en el
  propio recorrido.

- Operación específica. Por ejemplo, `ParVector` es mucho más lenta para los métodos
  de transformación (cómo `filter`) que para métodos de acceso (como `foreach`).

- Efectos colaterales. Cuando se modifica un area de memoria de manera concurrente o
  se utiliza la sincronización en el cuerpo de un `foreach`, `map`, etc se puede
  producir contención.

- Gestión de memoria. Cuando se reserva espacio para muchos objectos es posible
  que se dispare un ciclo de recolección de basura. Dependiendo de cómo se
  distribuyan las referencias de los objetos el ciclo de recolección puede llevar
  más o menos tiempo.

Incluso de manera independiente, no es sencillo razonar sobre el conjunto de situaciones
anteriores y determinar una respuesta precisa sobre cuál debería ser el tamaño de la
colección. Para ilustrar de manera aproximada cuál debería ser el valor de dicho tamaño,
a continuación, se presenta un ejemplo de una sencilla operación de reducción, __sum__ en este caso,
libre de efectos colaterales sobre un vector en un procesador i7 quad-core (hyperthreading
deshabilitado) sobre JDK7

    import collection.parallel.immutable.ParVector

    object Reduce extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val parvector = ParVector((0 until length): _*)

      parvector.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        parvector reduce {
          (a, b) => a + b
        }
      }
    }

    object ReduceSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val vector = collection.immutable.Vector((0 until length): _*)

      def run = {
        vector reduce {
          (a, b) => a + b
        }
      }
    }

La primera ejecución del benchmark utiliza `250000` elementos y obtiene los siguientes resultados para `1`, `2` y `4` hilos:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=250000 Reduce 10 10
    Reduce$    54    24    18    18    18    19    19    18    19    19
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=250000 Reduce 10 10
    Reduce$    60    19    17    13    13    13    13    14    12    13
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=250000 Reduce 10 10
    Reduce$    62    17    15    14    13    11    11    11    11    9

Posteriormente se decrementa en número de elementos hasta `120000` y se utilizan `4` hilos para comparar
el tiempo con la operación de reducción sobre un vector secuencial:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Reduce 10 10
    Reduce$    54    10    8    8    8    7    8    7    6    5
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=120000 ReduceSeq 10 10
    ReduceSeq$    31    7    8    8    7    7    7    8    7    8

En este caso, `120000` elementos parece estar en torno al umbral.

En un ejemplo diferente, utilizamos `mutable.ParHashMap` y el método `map` (un método de transformación)
y ejecutamos el siguiente benchmark en el mismo entorno:

    import collection.parallel.mutable.ParHashMap

    object Map extends testing.Benchmark {
      val length = sys.props("length").toInt
      val par = sys.props("par").toInt
      val phm = ParHashMap((0 until length) zip (0 until length): _*)

      phm.tasksupport = new collection.parallel.ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(par))

      def run = {
        phm map {
          kv => kv
        }
      }
    }

    object MapSeq extends testing.Benchmark {
      val length = sys.props("length").toInt
      val hm = collection.mutable.HashMap((0 until length) zip (0 until length): _*)

      def run = {
        hm map {
          kv => kv
        }
      }
    }

Para `120000` elementos obtenemos los siguientes tiempos cuando el número de hilos oscila de `1` a `4`:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=120000 Map 10 10    
    Map$    187    108    97    96    96    95    95    95    96    95
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=120000 Map 10 10
    Map$    138    68    57    56    57    56    56    55    54    55
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Map 10 10
    Map$    124    54    42    40    38    41    40    40    39    39

Ahora, si reducimos el número de elementos a `15000` y comparamos con el hashmap secuencial:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=15000 Map 10 10
    Map$    41    13    10    10    10    9    9    9    10    9
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=15000 Map 10 10
    Map$    48    15    9    8    7    7    6    7    8    6
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=15000 MapSeq 10 10
    MapSeq$    39    9    9    9    8    9    9    9    9    9

Para esta colección y esta operacion tiene sentido utilizar la versión paralela cuando existen más
de `15000` elementos (en general, es factible paralelizar hashmaps y hashsets con menos elementos de
los que serían requeridos por arrays o vectores).

## Referencias

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]

  [1]: http://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: http://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"
