---
layout: multipage-overview
title: Реализации Изменяемых Коллекций

discourse: true

partof: collections-213
overview-name: Collections

num: 9
previous-page: concrete-immutable-collection-classes
next-page: arrays

language: ru

---

Вы уже успели увидеть наиболее часто используемые неизменяемые типы коллекции, которые есть в стандартной библиотеке Scala. Настало время посмотреть на изменяемые (mutable) типы коллекции.

## Array Buffers

[ArrayBuffer](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayBuffer.html) - буферизированный массив в своем буфере хранит массив и его размер. Большинство операций с буферизированным массивом выполняются с той же скоростью, что и с массивом, так как операции просто обращаются и изменяют исходный массив. Кроме того он может эффективно добавлять данные к своему концу. Присоединение элемента к такому массиву занимает амортизированное константное время. Поэтому буферизированные массивы будут полезны, если вы строите большую коллекцию данных регулярно добавляя новые элементы в конец.
                                       
    scala> val buf = scala.collection.mutable.ArrayBuffer.empty[Int]
    buf: scala.collection.mutable.ArrayBuffer[Int] = ArrayBuffer()
    scala> buf += 1
    res32: buf.type = ArrayBuffer(1)
    scala> buf += 10
    res33: buf.type = ArrayBuffer(1, 10)
    scala> buf.toArray
    res34: Array[Int] = Array(1, 10)

## List Buffers

похож на буферизированный массив, за исключением того, что он базируется на связанном списке, а не массиве. Если после создания буферизированного объекта, вы планируете преобразовать его в список, то лучше используйте `ListBuffer` вместо `ArrayBuffer`.

    scala> val buf = scala.collection.mutable.ListBuffer.empty[Int]
    buf: scala.collection.mutable.ListBuffer[Int] = ListBuffer()
    scala> buf += 1
    res35: buf.type = ListBuffer(1)
    scala> buf += 10
    res36: buf.type = ListBuffer(1, 10)
    scala> buf.toList
    res37: List[Int] = List(1, 10)

## StringBuilders

Так же, как буферизированный массив полезен для создания массивов, а буферизированный список полезен для построения списков,  [StringBuilder](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/StringBuilder.html) полезен для создания строк. StringBuilders настолько широко используются, что они уже импортированы по умолчанию в стандартную область видимости. Можете создать их с помощью `new StringBuilder`, как в следующем примере:

    scala> val buf = new StringBuilder
    buf: StringBuilder =
    scala> buf += 'a'
    res38: buf.type = a
    scala> buf ++= "bcdef"
    res39: buf.type = abcdef
    scala> buf.toString
    res41: String = abcdef

## ArrayDeque

[ArrayDeque](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArrayDeque.html)
это последовательность, поддерживающая эффективное добавление элементов как спереди, так и сзади.
Реализован на основе массива с изменяемым размером.

Если вам нужно добавить элементы к началу или концу буфера, используйте `ArrayDeque` вместо `ArrayBuffer`.

## Queues (Очереди)

Scala предоставляет не только неизменяемые, но и изменяемые очереди. Работать с изменяемой очередью - `mQueue` можно аналогично неизменяемой, но вместо `enqueue` для добавления элементов используете операторы `+=` и `++=` . Кроме того, в изменяемой очереди метод `dequeue` просто удалит передний элемент из очереди, возвратив его в качестве результата работы метода. Например:

    scala> val queue = new scala.collection.mutable.Queue[String]
    queue: scala.collection.mutable.Queue[String] = Queue()
    scala> queue += "a"
    res10: queue.type = Queue(a)
    scala> queue ++= List("b", "c")
    res11: queue.type = Queue(a, b, c)
    scala> queue
    res12: scala.collection.mutable.Queue[String] = Queue(a, b, c)
    scala> queue.dequeue
    res13: String = a
    scala> queue
    res14: scala.collection.mutable.Queue[String] = Queue(b, c)

## Stacks (Стэки)

Вы видели неизменяемые стэки раньше. Существует еще и изменяемая версия, предоставляемая классом [mutable.Stack](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/Stack.html). Который работает точно так же, как и неизменяемая версия, за исключением того, что изменения происходят прямо в нём самом.

    scala> val stack = new scala.collection.mutable.Stack[Int]           
    stack: scala.collection.mutable.Stack[Int] = Stack()
    scala> stack.push(1)
    res0: stack.type = Stack(1)
    scala> stack
    res1: scala.collection.mutable.Stack[Int] = Stack(1)
    scala> stack.push(2)
    res0: stack.type = Stack(1, 2)
    scala> stack
    res3: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.top
    res8: Int = 2
    scala> stack
    res9: scala.collection.mutable.Stack[Int] = Stack(1, 2)
    scala> stack.pop    
    res10: Int = 2
    scala> stack    
    res11: scala.collection.mutable.Stack[Int] = Stack(1)

## ArraySeqs (Изменяемый Последовательные Массивы)

Последовательные массивы - это изменяемые массивы со свойствами последовательности фиксированного размера, которые хранят свои элементы внутри `Array[Object]`. Они реализованы в Scala классом [ArraySeq](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/ArraySeq.html).

Вам стоит использовать `ArraySeq`, если вам нужен массив из-за его показателей производительности, но вы дополнительно хотите использовать обобщеные экземпляры последовательности, в которых вы не знаете тип элементов и у которого нет `ClassTag` который будет предоставлен непосредственно во время исполнения. Эти аспекты рассматриваются в разделе [arrays]({{ site.baseurl }}/overviews/collections/arrays.html).

## Hash Tables (Хэш Таблицы)

Хэш-таблица хранит свои элементы в массиве, помещая каждый элемент на ту позицию, которая определяется хэш-кодом этого элемента. Добавление элемента в хэш-таблицу занимает константное время, если в массиве ещё нет другого элемента с таким же хэш-кодом. Таким образом, хэш-таблицы работают очень быстро, до тех пор пока размещенные в них объекты имеют хорошее распределение хэш-кодов. Поэтому в Scala изменяемые мапы и множества основываются на хэш-таблицах. Чтоб получить доступ к ним, можно использовать классы - [mutable.HashSet](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashSet.html) и [mutable.HashMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/HashMap.html).

Хэш-таблицы и хэш-мапы используются так же, как и любая другая мапа или множество. Вот несколько простых примеров:

    scala> val map = scala.collection.mutable.HashMap.empty[Int,String]
    map: scala.collection.mutable.HashMap[Int,String] = Map()
    scala> map += (1 -> "make a web site")
    res42: map.type = Map(1 -> make a web site)
    scala> map += (3 -> "profit!")
    res43: map.type = Map(1 -> make a web site, 3 -> profit!)
    scala> map(1)
    res44: String = make a web site
    scala> map contains 2
    res46: Boolean = false

При итерировании по хэш-таблице нет никаких гарантий по поводу порядка обхода. Итерирование проходит по базовому массиву в произвольном порядке. Чтобы получить гарантированный порядок обхода, используйте _связанную_ хэш-мапу (`linked Hashmap`) или множество (`linked Set`) вместо обычной. Связанная хэш-мапа или множество похожи на обычную, за исключением того, что между их элементами есть связь выстроенная в том порядке, в котором эти элементы были добавлены. Поэтому итерирование по такой коллекции всегда происходит в том же порядке, в котором элементы и были добавлены.

## Weak Hash Maps (Ослабленные Хэш-Мапы)

Ослабленный хэш-мап это специальный вид хэш-мапы, при которой сборщик мусора не ходит по ссылкам с мапы к её ключам. Это означает, что ключ и связанное с ним значение исчезнут из мапы, если на ключ не будет никаких ссылок. Ослабленные хэш-мапы полезны для таких задач, как кэширование, в которых вы можете переиспользовать результат дорогостоящей функции, сохранив результат функции и вызывая его снова используя тот же аргумент в качестве ключа. Если результаты работы будут хранить на обычной хэш-мапе, мапа будет расти без ограничений и ни один из ключей никогда не будет утилизирован сборщиком мусора. Использование ослабленной хэш-мапы позволяет избежать этой проблемы. Данные из ослабленной хэш-мапы удаляются, как только ключ становится недоступным. Ослабленные хэш-мапы в Scala реализованы классом [WeakHashMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/WeakHashMap.html), который в свою очередь является оберткой над Java `java.util.WeakHashMap`.

## Concurrent Maps (Конкурентные Мапы)

Несколько потоков могут получить паралелльный доступ к такой мапе на [конкуретной основе](https://en.wikipedia.org/wiki/Concurrent_data_structure). В дополнение к обычным операциям на [Map](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/Map.html) добавленны следующие атомарные операции:

### Операции на классе concurrent.Map

| ПРИМЕР	  	            | ЧТО ДЕЛАЕТ				     |
| ------       	       	        | ------					     |
|  `m.putIfAbsent(k, v)`  	    | Добавляет пару ключа/значение `k -> v`, если `k` отсутствует в `m`. |
|  `m.remove(k, v)`  	          |Удаляет запись для `k`, если для этого ключа соответствует значение `v`.  |
|  `m.replace(k, old, new)`  	  |Заменяет значение, связанное с ключом `k` на `new`, если ранее оно было равно `old`.  |
|  `m.replace (k, v)`  	        | Заменяет значение, связанное с ключом `k` на `v`, если ранее значение вообще существовало.|

`concurrent.Map` это трейт в библиотеке коллекций Scala. В настоящее время он реализуется двумя способами. Первый - через Java мапу `java.util.concurrent.ConcurrentMap`, который может быть автоматически преобразован в Scala мапу с помощью  [стандартного механизма преобразования Java/Scala коллекций]({{ site.baseurl }}/overviews/collections/conversions-between-java-and-scala-collections.html). Вторая реализация через [TrieMap](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/concurrent/TrieMap.html), которая представляет из себя не блокируемую хэш-таблицу привязанную к дереву.

## Mutable Bitsets (Изменяемый Битовый Набор)

Изменяемый набор типа [mutable.BitSet](http://www.scala-lang.org/api/{{ site.scala-version }}/scala/collection/mutable/BitSet.html) практически такойже как и неизменяемый набор, за исключением того, что он при изменении сам меняется. Изменяемые битовые наборы немного эффективнее при обновлении, чем неизменяемые, так как им не нужно копировать `Long`, которые не изменились.

    scala> val bits = scala.collection.mutable.BitSet.empty
    bits: scala.collection.mutable.BitSet = BitSet()
    scala> bits += 1
    res49: bits.type = BitSet(1)
    scala> bits += 3
    res50: bits.type = BitSet(1, 3)
    scala> bits
    res51: scala.collection.mutable.BitSet = BitSet(1, 3)
