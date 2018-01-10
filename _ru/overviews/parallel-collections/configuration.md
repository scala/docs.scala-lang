---
layout: multipage-overview
title: Конфигурирование параллельных коллекций

discourse: false

partof: parallel-collections
overview-name: Parallel Collections

language: ru
num: 7
---

## Обслуживание задач

Параллельные коллекции предоставляют возможность выбора методов планирования задач и распределения нагрузки на процессоры. В числе параметров каждой параллельной коллекции есть так называемый объект обслуживания задач, который и отвечает за это планирование.

Внутри объект обслуживания задач содержит ссылку на пул потоков; кроме того он определяет, как и когда задачи разбиваются на более мелкие подзадачи. Подробнее о том, как конкретно происходит этот процесс, можно узнать в техническом отчете \[[1][1]\].

В настоящее время для параллельных коллекций доступно несколько реализаций объекта поддержки задач. Например, `ForkJoinTaskSupport` реализован посредством "fork-join" пула и используется по умолчанию на JVM 1.6 или более поздних. Менее эффективный `ThreadPoolTaskSupport` является резервом для JVM 1.5 и тех машин, которые не поддерживают пулы "fork-join". `ExecutionContextTaskSupport` по умолчанию берет из `scala.concurrent` объект контекста выполнения `ExecutionContext` и, таким образом, использует тот же пул потоков, что и `scala.concurrent` (в зависимости от версии JVM, это может быть пул "fork-join" или "thread pool executor"). По умолчанию каждой параллельной коллекции назначается именно обслуживание задач контекста выполнения, поэтому параллельные коллекции используют тот же пул "fork-join", что и API объектов "future".

Сменить метод обслуживания задач для параллельной коллекции можно так:

    scala> import scala.collection.parallel._
    import scala.collection.parallel._

    scala> val pc = mutable.ParArray(1, 2, 3)
    pc: scala.collection.parallel.mutable.ParArray[Int] = ParArray(1, 2, 3)

    scala> pc.tasksupport = new ForkJoinTaskSupport(new scala.concurrent.forkjoin.ForkJoinPool(2))
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ForkJoinTaskSupport@4a5d484a

    scala> pc map { _ + 1 }
    res0: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

Код выше настраивает параллельную коллекцию на использование "fork-join" пула с количеством потоков равным 2. Заставить коллекцию использовать "thread pool executor" можно так:

    scala> pc.tasksupport = new ThreadPoolTaskSupport()
    pc.tasksupport: scala.collection.parallel.TaskSupport = scala.collection.parallel.ThreadPoolTaskSupport@1d914a39

    scala> pc map { _ + 1 }
    res1: scala.collection.parallel.mutable.ParArray[Int] = ParArray(2, 3, 4)

Когда параллельная коллекция сериализуется, поле объекта обслуживания задач исключается из сериализуемых. Когда параллельная коллекция восстанавливается из полученной последовательности байт, это поле приобретает значение по умолчанию, то есть способ обслуживания задач берется из `ExecutionContext`.

Чтобы реализовать собственный механизм поддержки задач, достаточно унаследовать трейт `TaskSupport` и реализовать следующие методы:

    def execute[R, Tp](task: Task[R, Tp]): () => R

    def executeAndWaitResult[R, Tp](task: Task[R, Tp]): R

    def parallelismLevel: Int

Метод `execute` планирует асинхронное выполнение задачи и возвращает "future" в качестве ссылки к будущему результату выполнения. Метод `executeAndWait` делает то же самое, но возвращает результат только после завершения задачи. Метод `parallelismLevel` просто возвращает предпочитаемое количество ядер, которое будет использовано для вычислений.

## Ссылки

1. [On a Generic Parallel Collection Framework, June 2011][1]

  [1]: http://infoscience.epfl.ch/record/165523/files/techrep.pdf "parallel-collections"
