---
layout: multipage-overview
title: 集合

discourse: false

partof: collections
overview-name: Collections

num: 6
language: zh-cn
---


集合是不包含重复元素的可迭代对象。下面的通用集合表和可变集合表中概括了集合类型适用的运算。分为几类：

* **测试型的方法：**`contains`，`apply`，`subsetOf`。`contains` 方法用于判断集合是否包含某元素。集合的 `apply` 方法和 `contains` 方法的作用相同，因此 `set(elem)` 等同于 `set contains elem`。这意味着集合对象的名字能作为其自身是否包含某元素的测试函数。

例如

    val fruit = Set("apple", "orange", "peach", "banana")
    fruit: scala.collection.immutable.Set[java.lang.String] =
    Set(apple, orange, peach, banana)
    scala> fruit("peach")
    res0: Boolean = true
    scala> fruit("potato")
    res1: Boolean = false

* **加法类型的方法：** `+` 和 `++`。添加一个或多个元素到集合中，产生一个新的集合。  
* **减法类型的方法：** `-` 、`--`。它们实现从一个集合中移除一个或多个元素，产生一个新的集合。  
* **Set运算包括并集、交集和差集**。每一种运算都存在两种书写形式：字母和符号形式。字母形式：`intersect`、`union` 和 `diff`，符号形式：`&`、`|` 和 `&~`。事实上，`Set` 中继承自 `Traversable` 的 `++` 也能被看做 `union` 或|的另一个别名。区别是，`++` 的参数为 `Traversable` 对象，而 `union` 和 `|` 的参数是集合。  

## Set 类的操作  

| WHAT IT IS  |  WHAT IT DOES  |
|------------------------|--------------------------|
|  **实验代码：**	 |                      |
|  `xs contains x` | 测试 `x` 是否是 `xs` 的元素。  |
|  `xs(x)` | 与 `xs contains x` 相同。  |
|  `xs subsetOf ys` | 测试 `xs` 是否是 `ys` 的子集。  |
|  **加法：**	 |                  |
|  `xs + x` | 包含 `xs` 中所有元素以及 `x` 的集合。  |
|  `xs + (x, y, z)` | 包含 `xs` 中所有元素及附加元素的集合  |
|  `xs ++ ys` | 包含 `xs` 中所有元素及 `ys` 中所有元素的集合  |
|  **移除：** | 	                 |
|  `xs - x` | 包含 `xs` 中除x以外的所有元素的集合。  |
|  `xs - x` | 包含 `xs` 中除去给定元素以外的所有元素的集合。  |
|  `xs -- ys` | 集合内容为：`xs` 中所有元素，去掉 `ys` 中所有元素后剩下的部分。  |
|  `xs.empty` | 与 `xs` 同类的空集合。  |
|  **二值操作：**	  |                   |
|  `xs & ys` | 集合 `xs` 和 `ys` 的交集。  |
|  `xs intersect ys` | 等同于 `xs & ys`。  |
|  <code>xs &#124; ys</code> | 集合 `xs` 和 `ys` 的并集。  |
|  `xs union ys` | 等同于 <code>xs &#124; ys</code>。  |
|  `xs &~ ys` | 集合 `xs` 和 `ys` 的差集。  |
|  `xs diff ys` | 等同于 `xs &~ ys`。  |


可变集合提供加法类方法，可以用来添加、删除或更新元素。下面对这些方法做下总结。

## mutable.Set 类的操作

| WHAT IT IS   | WHAT IT DOES   |
|------------------|------------------------|
|  **加法：** |                     |
|  `xs += x` | 把元素 `x` 添加到集合 `xs` 中。该操作有副作用，它会返回左操作符，这里是 `xs` 自身。  |
|  `xs += (x, y, z)` | 添加指定的元素到集合 `xs` 中，并返回 `xs` 本身。（同样有副作用）  |
|  `xs ++= ys` | 添加集合 `ys` 中的所有元素到集合 `xs` 中，并返回 `xs` 本身。（表达式有副作用）  |
|  `xs add x` | 把元素 `x` 添加到集合 `xs` 中，如集合 `xs` 之前没有包含 `x`，该操作返回 `true`，否则返回 `false`。  |
|  **移除：**	  |                 |          
|  `xs -= x` | 从集合 `xs` 中删除元素 `x`，并返回 `xs` 本身。（表达式有副作用）  |
|  `xs -= (x, y, z)` | 从集合 `xs` 中删除指定的元素，并返回 `xs` 本身。（表达式有副作用）  |
|  `xs --= ys` | 从集合 `xs` 中删除所有属于集合 `ys` 的元素，并返回 `xs` 本身。（表达式有副作用）  |
|  `xs remove x` | 从集合 `xs` 中删除元素 `x` 。如之前 `xs` 中包含了 `x` 元素，返回 `true`，否则返回 `false`。  |
|  `xs retain p` | 只保留集合 `xs` 中满足条件 `p` 的元素。  |
|  `xs.clear()` | 删除集合 `xs` 中的所有元素。  |
|  **更新：**  |                         |
|  `xs(x) = b` | （ 同 `xs.update(x, b)` ）参数 `b` 为布尔类型，如果值为 `true` 就把元素x加入集合 `xs`，否则从集合 `xs` 中删除 `x`。  |
|  **克隆：**	  |                |
|  `xs.clone` | 产生一个与 `xs` 具有相同元素的可变集合。  |


与不变集合一样，可变集合也提供了`+`和`++`操作符来添加元素，`-`和`--`用来删除元素。但是这些操作在可变集合中通常很少使用，因为这些操作都要通过集合的拷贝来实现。可变集合提供了更有效率的更新方法，`+=`和`-=`。 `s += elem`，添加元素elem到集合s中，并返回产生变化后的集合作为运算结果。同样的，`s -= elem `执行从集合s中删除元素elem的操作，并返回产生变化后的集合作为运算结果。除了`+=`和`-=`之外还有从可遍历对象集合或迭代器集合中添加和删除所有元素的批量操作符`++=`和`--=`。

选用`+=`和`-=`这样的方法名使得我们得以用非常近似的代码来处理可变集合和不可变集合。先看一下以下处理不可变集合 `s` 的REPL会话：

    scala> var s = Set(1, 2, 3)
    s: scala.collection.immutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    scala> s -= 2
    scala> s
    res2: scala.collection.immutable.Set[Int] = Set(1, 3, 4)

我们在`immutable.Set`类型的变量中使用`+=`和`-= `。诸如 `s += 4` 的表达式是 `s = s + 4 `的缩写，它的作用是，在集合 `s` 上运用方法`+`，并把结果赋回给变量 `s`。下面我们来分析可变集合上的类似操作。

    scala> val s = collection.mutable.Set(1, 2, 3)
    s: scala.collection.mutable.Set[Int] = Set(1, 2, 3)
    scala> s += 4
    res3: s.type = Set(1, 4, 2, 3)
    scala> s -= 2
    res4: s.type = Set(1, 4, 3)

最后结果看起来和之前的在非可变集合上的操作非常相似；从`Set(1, 2, 3)`开始，最后得到`Set(1, 3, 4)`。然而，尽管相似，但它们在实现上其实是不同的。 这里`s += 4 `是在可变集合值s上调用`+=`方法，它会改变 `s` 的内容。同样的，`s -= 2` 也是在s上调用 `-= `方法，也会修改 `s` 集合的内容。

通过比较这两种方式得出一个重要的原则。我们通常能用一个非可变集合的变量来替换可变集合的常量，反之亦然。这一原则至少在没有别名的引用添加到Collection时起作用。别名引用主要是用来观察操作在Collection上直接做的修改还是生成了一个新的Collection。

可变集合同样提供作为 `+=` 和 `-=` 的变型方法，`add` 和 `remove`，它们的不同之处在于 `add` 和 `remove` 会返回一个表明运算是否对集合有作用的Boolean值

目前可变集合默认使用哈希表来存储集合元素，非可变集合则根据元素个数的不同，使用不同的方式来实现。空集用单例对象来表示。元素个数小于等于4的集合可以使用单例对象来表达，元素作为单例对象的字段来存储。 元素超过4个，非可变集合就用哈希前缀树（hash trie）来实现。

采用这种表示方法，较小的不可变集合（元素数不超过4）往往会比可变集合更加紧凑和高效。所以，在处理小尺寸的集合时，不妨试试不可变集合。

集合的两个特质是 `SortedSet` 和 `BitSet`。

## 有序集（SortedSet）

 [SortedSet](http://www.scala-lang.org/api/current/scala/collection/SortedSet.html) 是指以特定的顺序（这一顺序可以在创建集合之初自由的选定）排列其元素（使用iterator或foreach）的集合。 [SortedSet](http://www.scala-lang.org/api/current/scala/collection/SortedSet.html) 的默认表示是有序二叉树，即左子树上的元素小于所有右子树上的元素。这样，一次简单的顺序遍历能按增序返回集合中的所有元素。Scala的类 `immutable.TreeSet` 使用红黑树实现，它在维护元素顺序的同时，也会保证二叉树的平衡，即叶节点的深度差最多为1。

创建一个空的 [TreeSet](http://www.scala-lang.org/api/current/scala/collection/immutable/TreeSet.html) ，可以先定义排序规则：

    scala> val myOrdering = Ordering.fromLessThan[String](_ > _)
    myOrdering: scala.math.Ordering[String] = ...

然后，用这一排序规则创建一个空的树集：

    scala> TreeSet.empty(myOrdering)
    res1: scala.collection.immutable.TreeSet[String] = TreeSet()

或者，你也可以不指定排序规则参数，只需要给定一个元素类型或空集合。在这种情况下，将使用此元素类型默认的排序规则。

    scala> TreeSet.empty[String]
    res2: scala.collection.immutable.TreeSet[String] = TreeSet()

如果通过已有的TreeSet来创建新的集合（例如，通过串联或过滤操作），这些集合将和原集合保持相同的排序规则。例如，

    scala> res2 + ("one", "two", "three", "four")
    res3: scala.collection.immutable.TreeSet[String] = TreeSet(four, one, three, two)

有序集合同样支持元素的范围操作。例如，range方法返回从指定起始位置到结束位置（不含结束元素）的所有元素，from方法返回大于等于某个元素的所有元素。调用这两种方法的返回值依然是有序集合。例如：

    scala> res3 range ("one", "two")
    res4: scala.collection.immutable.TreeSet[String] = TreeSet(one, three)
    scala> res3 from "three"
    res5: scala.collection.immutable.TreeSet[String] = TreeSet(three, two)

## 位集合（Bitset）

位集合是由单字或多字的紧凑位实现的非负整数的集合。其内部使用 `Long` 型数组来表示。第一个 `Long` 元素表示的范围为0到63，第二个范围为64到127，以此类推（值为0到127的非可变位集合通过直接将值存储到第一个或第两个 `Long` 字段的方式，优化掉了数组处理的消耗）。对于每个 `Long`，如果有相应的值包含于集合中则它对应的位设置为1，否则该位为0。这里遵循的规律是，位集合的大小取决于存储在该集合的最大整数的值的大小。假如N是为集合所要表示的最大整数，则集合的大小就是 `N/64` 个长整形字，或者 `N/8` 个字节，再加上少量额外的状态信息字节。  

因此当位集合包含的元素值都比较小时，它比其他的集合类型更紧凑。位集合的另一个优点是它的 `contains` 方法（成员测试）、`+=` 运算（添加元素）、`-=` 运算（删除元素）都非常的高效。  
