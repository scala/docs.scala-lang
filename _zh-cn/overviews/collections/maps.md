---
layout: multipage-overview
title: 映射

discourse: false

partof: collections
overview-name: Collections

num: 7
language: zh-cn
---


映射（Map）是一种可迭代的键值对结构（也称映射或关联）。Scala的Predef类提供了隐式转换，允许使用另一种语法：`key -> value`，来代替`(key, value)`。如：`Map("x" -> 24, "y" -> 25, "z" -> 26)`等同于`Map(("x", 24), ("y", 25), ("z", 26))`，却更易于阅读。

映射（Map）的基本操作与集合（Set）类似。下面的表格分类总结了这些操作：

- **查询类操作：**apply、get、getOrElse、contains和DefinedAt。它们都是根据主键获取对应的值映射操作。例如：def get(key): Option[Value]。“m get key” 返回m中是否用包含了key值。如果包含了，则返回对应value的Some类型值。否则，返回None。这些映射中也包括了apply方法，该方法直接返回主键对应的值。apply方法不会对值进行Option封装。如果该主键不存在，则会抛出异常。  
- **添加及更新类操作：**+、++、updated，这些映射操作允许你添加一个新的绑定或更改现有的绑定。  
- **删除类操作：**-、--，从一个映射（Map）中移除一个绑定。  
- **子集类操作：**keys、keySet、keysIterator、values、valuesIterator，可以以不同形式返回映射的键和值。  
- **filterKeys、mapValues等**变换用于对现有映射中的绑定进行过滤和变换，进而生成新的映射。

## Map类的操作

| WHAT IT IS | WHAT IT DOES |
|---------------|---------------------|
| **查询：**	 |                  |
| ms get k | 返回一个Option，其中包含和键k关联的值。若k不存在，则返回None。 |
| ms(k) | （完整写法是ms apply k）返回和键k关联的值。若k不存在，则抛出异常。 |
| ms getOrElse (k, d) | 返回和键k关联的值。若k不存在，则返回默认值d。 |
| ms contains k | 检查ms是否包含与键k相关联的映射。 |
| ms isDefinedAt k | 同contains。 |
| **添加及更新:**	 |                  |
| ms + (k -> v) | 返回一个同时包含ms中所有键值对及从k到v的键值对k -> v的新映射。 |
| ms + (k -> v, l -> w) | 返回一个同时包含ms中所有键值对及所有给定的键值对的新映射。 |
| ms ++ kvs | 返回一个同时包含ms中所有键值对及kvs中的所有键值对的新映射。 |
| ms updated (k, v) | 同ms + (k -> v)。 |
| **移除：**	 |            |
| ms - k | 返回一个包含ms中除键k以外的所有映射关系的映射。 |
| ms - (k, 1, m) | 返回一个滤除了ms中与所有给定的键相关联的映射关系的新映射。 |
| ms -- ks | 返回一个滤除了ms中与ks中给出的键相关联的映射关系的新映射。 |
| **子容器（Subcollection）：**	 |                 |
| ms.keys | 返回一个用于包含ms中所有键的iterable对象（译注：请注意iterable对象与iterator的区别） |
| ms.keySet | 返回一个包含ms中所有的键的集合。 |
| ms.keysIterator | 返回一个用于遍历ms中所有键的迭代器。 |
| ms.values | 返回一个包含ms中所有值的iterable对象。 |
| ms.valuesIterator | 返回一个用于遍历ms中所有值的迭代器。 |
| **变换：**	 |             |
| ms filterKeys p | 一个映射视图（Map View），其包含一些ms中的映射，且这些映射的键满足条件p。用条件谓词p过滤ms中所有的键，返回一个仅包含与过滤出的键值对的映射视图（view）。|
|ms mapValues f | 用f将ms中每一个键值对的值转换成一个新的值，进而返回一个包含所有新键值对的映射视图（view）。|


可变映射（Map）还支持下表中列出的操作。

## mutable.Map类中的操作

| WHAT IT IS | WHAT IT DOES |
|-------------------------|-------------------------|
| **添加及更新**	 |             |
| ms(k) = v | （完整形式为ms.update(x, v)）。向映射ms中新增一个以k为键、以v为值的映射关系，ms先前包含的以k为值的映射关系将被覆盖。 |
| ms += (k -> v) | 向映射ms增加一个以k为键、以v为值的映射关系，并返回ms自身。 |
| ms += (k -> v, l -> w) | 向映射ms中增加给定的多个映射关系，并返回ms自身。 |
| ms ++= kvs | 向映射ms增加kvs中的所有映射关系，并返回ms自身。 |
| ms put (k, v) | 向映射ms增加一个以k为键、以v为值的映射，并返回一个Option，其中可能包含此前与k相关联的值。 |
| ms getOrElseUpdate (k, d) | 如果ms中存在键k，则返回键k的值。否则向ms中新增映射关系k -> v并返回d。 |
| **移除：**	 |                   |
| ms -= k | 从映射ms中删除以k为键的映射关系，并返回ms自身。 |
| ms -= (k, l, m) | 从映射ms中删除与给定的各个键相关联的映射关系，并返回ms自身。 |
| ms --= ks | 从映射ms中删除与ks给定的各个键相关联的映射关系，并返回ms自身。 |
| ms remove k | 从ms中移除以k为键的映射关系，并返回一个Option，其可能包含之前与k相关联的值。 |
| ms retain p | 仅保留ms中键满足条件谓词p的映射关系。 |
| ms.clear() | 删除ms中的所有映射关系 |
| **变换：**	 |              |
| ms transform f | 以函数f转换ms中所有键值对（译注：原文比较含糊，transform中参数f的类型是(A, B) => B，即对ms中的所有键值对调用f，得到一个新的值，并用该值替换原键值对中的值）。 |
| **克隆：**	 |             |
| ms.clone | 返回一个新的可变映射（Map），其中包含与ms相同的映射关系。 |

映射（Map）的添加和删除操作与集合（Set）的相关操作相同。同集合（Set）操作一样，可变映射（mutable maps）也支持非破坏性（non-destructive）修改操作+、-、和updated。但是这些操作涉及到可变映射的复制，因此较少被使用。而利用两种变形`m(key) = value和m += (key -> value)`， 我们可以“原地”修改可变映射m。此外，存还有一种变形`m put (key, value)`，该调用返回一个Option值，其中包含此前与键相关联的值，如果不存在这样的值，则返回None。

getOrElseUpdate特别适合用于访问用作缓存的映射（Map）。假设调用函数f开销巨大：

    scala> def f(x: String) = {
           println("taking my time."); sleep(100)
           x.reverse }
    f: (x: String)String

此外，再假设f没有副作用，即反复以相同参数调用f，得到的结果都相同。那么，我们就可以将之前的调用参数和计算结果保存在一个映射（Map）内，今后仅在映射中查不到对应参数的情况下实际调用f，这样就可以节约时间。这个映射便可以认为是函数f的缓存。

    val cache = collection.mutable.Map[String, String]()
    cache: scala.collection.mutable.Map[String,String] = Map()

现在，我们可以写出一个更高效的带缓存的函数f：

    scala> def cachedF(s: String) = cache.getOrElseUpdate(s, f(s))
    cachedF: (s: String)String
    scala> cachedF("abc")

稍等片刻。

    res3: String = cba
    scala> cachedF("abc")
    res4: String = cba

注意，getOrElseUpdate的第2个参数是“按名称（by-name）"传递的，所以，仅当在缓存映射中找不到第1个参数，而getOrElseUpdate需要其第2个参数的值时，上述的f("abc")才会被执行。当然我们也可以利用Map的基本操作直接实现cachedF，但那样写就要冗长很多了。

    def cachedF(arg: String) = cache get arg match {
      case Some(result) => result
      case None =>
        val result = f(x)
        cache(arg) = result
        result
    }

## 同步集合（Set）和映射（Map）

无论什么样的Map实现，只需混入`SychronizedMap trait`，就可以得到对应的线程安全版的Map。例如，我们可以像下述代码那样在HashMap中混入SynchronizedMap。这个示例一上来先从`scala.colletion.mutable`包中import了两个trait：Map、SynchronizedMap，和一个类：HashMap。接下来，示例中定义了一个单例对象MapMaker，其中定义了一个方法makeMap。该方法的返回值类型是一个同时以String为键值类型的可变映射。

      import scala.collection.mutable.{Map,
          SynchronizedMap, HashMap}
      object MapMaker {
        def makeMap: Map[String, String] = {
            new HashMap[String, String] with
                SynchronizedMap[String, String] {
              override def default(key: String) =
                "Why do you want to know?"
            }
        }
      }

混入SynchronizedMap trait

makeMap方法中的第1个语句构造了一个新的混入了SynchronizedMap trait的可变映射：

    new HashMap[String, String] with
      SynchronizedMap[String, String]

针对这段代码，Scala编译器会合成HashMap的一个混入了SynchronizedMap trait的子类，同时生成（并返回）该合成子类的一个实例。处于下面这段代码的缘故，这个合成类还覆写了default方法：

    override def default(key: String) =
      "Why do you want to know?"

当向某个Map查询给定的键所对应的值，而Map中不存在与该键相关联的值时，默认情况下会触发一个NoSuchElementException异常。不过，如果自定义一个Map类并覆写default方法，便可以针对不存在的键返回一个default方法返回的值。所以，编译器根据上述代码合成的HashMap子类在碰到不存在的键时将会反过来质问你“Why do you want to know?”

makeMap方法返回的可变映射混入了 SynchronizedMap trait，因此可以用在多线程环境下。对该映射的每次访问都是同步的。以下示例展示的是从解释器内以单个线程访问该映射：

    scala> val capital = MapMaker.makeMap  
    capital: scala.collection.mutable.Map[String,String] = Map()
    scala> capital ++ List("US" -> "Washington",
            "France" -> "Paris", "Japan" -> "Tokyo")
    res0: scala.collection.mutable.Map[String,String] =
      Map(France -> Paris, US -> Washington, Japan -> Tokyo)
    scala> capital("Japan")
    res1: String = Tokyo
    scala> capital("New Zealand")
    res2: String = Why do you want to know?
    scala> capital += ("New Zealand" -> "Wellington")
    scala> capital("New Zealand")                    
    res3: String = Wellington

同步集合（synchronized set）的创建方法与同步映射（synchronized map）类似。例如，我们可以通过混入SynchronizedSet trait来创建同步哈希集：

    import scala.collection.mutable  //导入包scala.collection.mutable
    val synchroSet =
      new mutable.HashSet[Int] with
          mutable.SynchronizedSet[Int]

最后，如有使用同步容器（synchronized collection）的需求，还可以考虑使用`java.util.concurrent`中提供的并发容器（concurrent collections）。
