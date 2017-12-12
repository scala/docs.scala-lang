---
layout: multipage-overview
title: Configurando las colecciones paralelas

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

num: 7
language: es
---

## "Task support"

Las colecciones paralelas son modulares respecto al modo en que las operaciones
son planificadas. Cada colección paralela es planificada con un objeto "task support"
el cual es responsable de la planificación y el balanceo de las tareas a los
distintos procesadores.

El objeto "task support" mantiene internamente un referencia a un pool de hilos y decide
cómo y cuando las tareas son divididas en tareas más pequeñas. Para conocer más en detalle
cómo funciona internamente diríjase al informe técnico \[[1][1]\].

En la actualidad las colecciones paralelas disponen de unas cuantas implementaciones de
"task support". El `ForkJoinTaskSupport` utiliza internamente un fork-join pool y es utilizado
por defecto en JVM 1.6 o superiores. `ThreadPoolTaskSupport`, menos eficiente, es utilizado como
mecanismo de reserva para JVM 1.5 y máquinas virtuales que no soporten los fork join pools. El
`ExecutionContextTaskSupport` utiliza el contexto de ejecución por defecto que viene definido
en `scala.concurrent`, y reutiliza el thread pool utilizado en dicho paquete (podrá ser un fork
join pool o un thread pool executor dependiendo de la versión de la JVM). El "task support" basado
en el contexto de ejecución es establecido en cada una de las colecciones paralelas por defecto, de modo
que dichas colecciones reutilizan el mismo fork-join pool del mismo modo que el API de las "futures".

A continuación se muestra cómo se puede modificar el objeto "task support" de una colección paralela:

    scala> import scala.collection.parallel._
    import scala.collection.parallel._

    scala> val pc = mutable.ParArray(1, 2, 3)
    pc: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3)

    scala> pc.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(2))
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ForkJoinTaskSupport@4a5d484a

    scala> pc map { _ + 1 }
    res0: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

El fragmento de código anterior determina que la colección paralela utilice un fork-join pool con un nivel 2 de
paralelismo. Para indicar que la colección utilice un thread pool executor tendremos que hacerlo del siguiente modo:

    scala> pc.tasksupport = new ThreadPoolTaskSupport()
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ThreadPoolTaskSupport@1d914a39

    scala> pc map { _ + 1 }
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

Cuando una colección paralela es serializada, el atributo que almacena la referencia
al objeto "task support" es omitido en el proceso de serialización. Cuando una colección
paralela es deserializada, dicho atributo toma el valor por defecto -- el objeto "task support"
basado en el contexto de ejecución.

Para llevar a cabo una implementación personalizada de un nuevo objeto "task support" necesitamos
extender del trait `TaskSupport` e implementar los siguientes métodos:

    def execute[R, Tp](task: Task[R, Tp]): () => R

    def executeAndWaitResult[R, Tp](task: Task[R, Tp]): R

    def parallelismLevel: Int

El método `execute` planifica una tarea asíncrona y retorna una "future" sobre la que
esperar el resultado de la computación. El método `executeAndWait` lleva a cabo el mismo
trabajo, pero retorna única y exclusivamente una vez la tarea haya finalizado. `parallelismLevel`
simplemente retorna el número de núcleos que el objeto "task support" utiliza para planificar
las diferentes tareas.


## Referencias

1. [On a Generic Parallel Collection Framework, June 2011][1]

  [1]: http://infoscience.epfl.ch/record/165523/files/techrep.pdf "parallel-collections"
