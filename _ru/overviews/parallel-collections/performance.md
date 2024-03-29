---
layout: multipage-overview
title: Измерение производительности
partof: parallel-collections
overview-name: Parallel Collections
num: 8
language: ru
---

##  Производительность JVM

При описании модели производительности выполнения кода на JVM иногда ограничиваются несколькими  комментариями, и как результат-- не всегда становится хорошо понятно, что в силу различных причин написанный код может быть не таким производительным или расширяемым, как можно было бы ожидать. В этой главе будут приведены несколько примеров.

Одной из причин является то, что процесс компиляции выполняющегося на JVM приложения не такой, как у языка со статической компиляцией (как можно увидеть здесь \[[2][2]\]). Компиляторы Java и Scala обходятся минимальной оптимизацией при преобразовании исходных текстов в байткод JVM. При первом запуске на большинстве современных виртуальных Java-машин байткод преобразуется в машинный код той архитектуры, на которой он запущен. Это преобразование называется компиляцией "на лету" или JIT-компиляцией (JIT от just-in-time). Однако из-за того, что компиляция "на лету" должна быть быстрой, уровень оптимизации при такой компиляции остается низким. Более того, чтобы избежать повторной компиляции, компилятор HotSpot оптимизирует только те участки кода, которые выполняются часто. Поэтому тот, кто пишет тест производительности, должен учитывать, что программа может показывать разную производительность каждый раз, когда ее запускают: многократное выполнение одного и того же куска кода (то есть, метода) на одном экземпляре JVM может демонстрировать очень разные результаты замеров производительности в зависимости от того, оптимизировался ли определенный код между запусками. Более того, измеренное время выполнения некоторого участка кода может включать в себя время, за которое произошла сама оптимизация JIT-компилятором, что сделает результат измерения нерепрезентативным.

Кроме этого, результат может включать в себя потраченное на стороне JVM время на осуществление операций автоматического управления памятью. Время от времени выполнение программы прерывается и вызывается сборщик мусора. Если исследуемая программа размещает хоть какие-нибудь данные в куче (а большинство программ JVM размещают), значит сборщик мусора должен запуститься, возможно, исказив при этом результаты измерений. Можно нивелировать влияние сборщика мусора на результат, запустив измеряемую программу множество раз, и тем самым спровоцировав большое количество циклов сборки мусора.

Одной из распространенных причин ухудшения производительности является упаковка и распаковка примитивов, которые неявно происходят в случаях, когда примитивный тип передается аргументом в обобщенный (generic) метод. Чтобы примитивные типы можно было передать в метод с параметром обобщенного типа, они во время выполнения преобразуются в представляющие их объекты. Этот процесс замедляет выполнение, а кроме того порождает необходимость в дополнительном выделении памяти и, соответственно, создает дополнительный мусор в куче.

В качестве распространенной причины ухудшения параллельной производительности можно назвать соперничество за память (memory contention), возникающее из-за того, что программист не может явно указать, где следует размещать объекты. Фактически, из-за влияния сборщика мусора, это соперничество может произойти на более поздней стадии жизни приложения, а именно после того, как объекты начнут перемещаться в памяти. Такие влияния нужно учитывать при написании теста.

## Пример микротеста производительности

Существует несколько подходов, позволяющих избежать описанных выше эффектов во время измерений. В первую очередь следует убедиться, что JIT-компилятор преобразовал исходный текст в машинный код (и что последний был оптимизирован), прогнав микротест производительности достаточное количество раз. Этот процесс известен как фаза разогрева (warm-up).

Для того, чтобы уменьшить число помех, вызванных сборкой мусора от объектов, размещенных другими участками программы или несвязанной компиляцией "на лету", требуется запустить микротест на отдельном экземпляре JVM.

Кроме того, запуск следует производить на серверной версии HotSpot JVM, которая выполняет более агрессивную оптимизацию.

Наконец, чтобы уменьшить вероятность того, что сборка мусора произойдет посреди микротеста, лучше всего добиться выполнения цикла сборки мусора перед началом теста, а следующий цикл отложить настолько, насколько это возможно.

В стандартной библиотеке Scala предопределен трейт `scala.testing.Benchmark`, спроектированный с учетом приведенных выше соображений. Ниже приведен пример тестирования производительности операции `map` многопоточного префиксного дерева:

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

Метод `run` содержит код микротеста, который будет повторно запускаться для измерения времени своего выполнения. Объект `Map`, расширяющий трейт `scala.testing.Benchmark`, запрашивает передаваемые системой параметры уровня параллелизма `par` и количества элементов дерева `length`.

После компиляции программу, приведенную выше, следует запустить так:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=300000 Map 10

Флаг `server` требует использовать серверную VM. Флаг `cp` означает "classpath", то есть указывает, что файлы классов требуется искать в текущем каталоге и в jar-архиве библиотеки Scala. Аргументы `-Dpar` и `-Dlength`-- это количество потоков и количество элементов соответственно. Наконец, `10` означает что тест производительности будет запущен на одной и той же JVM именно 10 раз.

Устанавливая количество потоков `par` в `1`, `2`, `4` и `8`, получаем следующее время выполнения на четырехъядерном i7 с поддержкой гиперпоточности:

    Map$	126	57	56	57	54	54	54	53	53	53
    Map$	90	99	28	28	26	26	26	26	26	26
    Map$	201	17	17	16	15	15	16	14	18	15
    Map$	182	12	13	17	16	14	14	12	12	12

Можно заметить, что на первые запуски требуется больше времени, но после оптимизации кода оно уменьшается. Кроме того, мы можем увидеть что гиперпотоковость не дает большого преимущества в нашем примере, это следует из того, что увеличение количества потоков от `4` до `8` не приводит к значительному увеличению производительности.

## Насколько большую коллекцию стоит сделать параллельной?

Этот вопрос задается часто, но ответ на него достаточно запутан.

Размер коллекции, при котором оправданы затраты на параллелизацию, в действительности зависит от многих факторов. Некоторые из них (но не все) приведены ниже:

- Архитектура системы. Различные типы CPU имеют различную архитектуру и различные характеристики масштабируемости. Помимо этого, машина может быть многоядерной, а может иметь несколько процессоров, взаимодействующих через материнскую плату.
- Производитель и версия JVM. Различные виртуальные машины применяют различные оптимизации кода во время выполнения и реализуют различные механизмы синхронизации и управления памятью. Некоторые из них не поддерживают `ForkJoinPool`, возвращая нас к использованию `ThreadPoolExecutor`, что приводит к увеличению накладных расходов.
- Поэлементная нагрузка. Величина нагрузки, оказываемой обработкой одного элемента, зависит от функции или предиката, которые требуется выполнить параллельно. Чем меньше эта нагрузка, тем выше должно быть количество элементов для получения ускорения производительности при параллельном выполнении.
- Выбранная коллекция. Например, разделители `ParArray` и `ParTrieMap` перебирают элементы коллекции с различными скоростями, а значит разницу количества нагрузки при обработке каждого элемента создает уже сам перебор.
- Выбранная операция. Например, у `ParVector` намного медленнее методы трансформации (такие, как `filter`) чем методы получения доступа (как `foreach`)
- Побочные эффекты. При изменении областей памяти несколькими потоками или при использовании механизмов синхронизации внутри тела `foreach`, `map`, и тому подобных, может возникнуть соперничество.
- Управление памятью. Размещение большого количества объектов может спровоцировать цикл сборки мусора. В зависимости от способа передачи ссылок на новые объекты, цикл сборки мусора может занимать больше или меньше времени.

Даже рассматривая вышеперечисленные факторы по отдельности, не так-то просто рассуждать о влиянии каждого, а тем более дать точный ответ, каким же должен быть размер коллекции. Чтобы в первом приближении проиллюстрировать, каким же он должен быть, приведем пример выполнения быстрой и не вызывающей побочных эффектов операции сокращения параллельного вектора (в нашем случае-- суммированием) на четырехъядерном процессоре i7 (без использования гиперпоточности) на JDK7:

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

Сначала запустим тест производительности с `250000` элементами и получим следующие результаты для `1`, `2` и `4` потоков:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=250000 Reduce 10 10
    Reduce$    54    24    18    18    18    19    19    18    19    19
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=250000 Reduce 10 10
    Reduce$    60    19    17    13    13    13    13    14    12    13
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=250000 Reduce 10 10
    Reduce$    62    17    15    14    13    11    11    11    11    9

Затем уменьшим количество элементов до `120000` и будем использовать `4` потока для сравнения со временем сокращения последовательного вектора:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Reduce 10 10
    Reduce$    54    10    8    8    8    7    8    7    6    5
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=120000 ReduceSeq 10 10
    ReduceSeq$    31    7    8    8    7    7    7    8    7    8

Похоже, что `120000` близко к пограничному значению в этом случае.

В качестве еще одного примера возьмем метод `map` (метод трансформации) коллекции `mutable.ParHashMap` и запустим следующий тест производительности в той же среде:

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

Для `120000` элементов получаем следующие значения времени на количестве потоков от `1` до `4`:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=120000 Map 10 10    
    Map$    187    108    97    96    96    95    95    95    96    95
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=120000 Map 10 10
    Map$    138    68    57    56    57    56    56    55    54    55
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=4 -Dlength=120000 Map 10 10
    Map$    124    54    42    40    38    41    40    40    39    39

Теперь уменьшим число элементов до `15000` и сравним с последовательным хэш-отображением:

    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=1 -Dlength=15000 Map 10 10
    Map$    41    13    10    10    10    9    9    9    10    9
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dpar=2 -Dlength=15000 Map 10 10
    Map$    48    15    9    8    7    7    6    7    8    6
    java -server -cp .:../../build/pack/lib/scala-library.jar -Dlength=15000 MapSeq 10 10
    MapSeq$    39    9    9    9    8    9    9    9    9    9

Для выбранных в этом случае коллекции и операции есть смысл сделать вычисление параллельным при количестве элементов больше `15000` (в общем случае хэш-отображения и хэш-множества возможно делать параллельными на меньших количествах элементов, чем требовалось бы для массивов или векторов).

## Ссылки

1. [Anatomy of a flawed microbenchmark, Brian Goetz][1]
2. [Dynamic compilation and performance measurement, Brian Goetz][2]

  [1]: https://www.ibm.com/developerworks/java/library/j-jtp02225/index.html "flawed-benchmark"
  [2]: https://www.ibm.com/developerworks/library/j-jtp12214/ "dynamic-compilation"
