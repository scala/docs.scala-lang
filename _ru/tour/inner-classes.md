---
layout: tour
title: Внутренние классы
partof: scala-tour
num: 22
language: ru
next-page: abstract-type-members
previous-page: lower-type-bounds
---

В Scala классам можно иметь в качестве членов другие классы. В отличие от Java-подобных языков, где такие внутренние классы являются членами окружающего класса, в Scala такие внутренние классы привязаны к содержащему его объекту. Предположим, мы хотим, чтобы компилятор не позволял нам на этапе компиляции смешивать узлы этого графа. Для решения этой задачи нам подойдут типы, зависящие от своего расположения.

Чтобы проиллюстрировать суть подхода, мы быстро набросаем реализацию такого графа:

{% tabs inner-classes_1 class=tabs-scala-version %}
{% tab 'Scala 2' for=inner-classes_1 %}

```scala mdoc
class Graph {
  class Node {
    var connectedNodes: List[Node] = Nil
    def connectTo(node: Node): Unit = {
      if (!connectedNodes.exists(node.equals)) {
        connectedNodes = node :: connectedNodes
      }
    }
  }
  var nodes: List[Node] = Nil
  def newNode: Node = {
    val res = new Node
    nodes = res :: nodes
    res
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=inner-classes_1 %}

```scala
class Graph:
  class Node:
    var connectedNodes: List[Node] = Nil
    def connectTo(node: Node): Unit =
      if !connectedNodes.exists(node.equals) then
        connectedNodes = node :: connectedNodes

  var nodes: List[Node] = Nil
  def newNode: Node =
    val res = Node()
    nodes = res :: nodes
    res
```

{% endtab %}
{% endtabs %}

Данная программа представляет собой граф в составленного из списка узлов (`List[Node]`). Каждый узел имеет список других узлов, с которым он связан (`connectedNodes`). Класс `Node` является _зависимым от месторасположения типом_, поскольку он вложен в `Class Graph`. Поэтому все узлы в `connectedNodes` должны быть созданы с использованием `newNode` из одного и того же экземпляра `Graph`.

{% tabs inner-classes_2 %}
{% tab 'Scala 2 и 3' for=inner-classes_2 %}

```scala mdoc
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
val node3: graph1.Node = graph1.newNode
node1.connectTo(node2)
node3.connectTo(node1)
```

{% endtab %}
{% endtabs %}

Мы явно объявили тип `node1`, `node2` и `node3` как `graph1.Node` для ясности, хотя компилятор мог определить это самостоятельно. Это потому, что когда мы вызываем `graph1.newNode`, вызывающий `new Node`, метод использует экземпляр `Node`, специфичный экземпляру `graph1`.

Если у нас есть два графа, то система типов Scala не позволит смешивать узлы, определенные в рамках одного графа, с узлами другого, так как узлы другого графа имеют другой тип.
Вот некорректная программа:

{% tabs inner-classes_3 %}
{% tab 'Scala 2 и 3' for=inner-classes_3 %}

```scala mdoc:fail
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
node1.connectTo(node2)      // работает
val graph2: Graph = new Graph
val node3: graph2.Node = graph2.newNode
node1.connectTo(node3)      // не работает!
```

{% endtab %}
{% endtabs %}

Тип `graph1.Node` отличается от типа `graph2.Node`. В Java последняя строка в предыдущем примере программы была бы правильной. Для узлов обоих графов Java будет присваивать один и тот же тип `Graph.Node`, т.е. `Node` имеет префикс класса `Graph`. В Скале такой тип также может быть выражен, он записывается `Graph#Node`. Если мы хотим иметь возможность соединять узлы разных графов, то вам нужно изменить описание первоначальной реализации графов следующим образом:

{% tabs inner-classes_4 class=tabs-scala-version %}
{% tab 'Scala 2' for=inner-classes_4 %}

```scala mdoc:nest
class Graph {
  class Node {
    var connectedNodes: List[Graph#Node] = Nil
    def connectTo(node: Graph#Node): Unit = {
      if (!connectedNodes.exists(node.equals)) {
        connectedNodes = node :: connectedNodes
      }
    }
  }
  var nodes: List[Node] = Nil
  def newNode: Node = {
    val res = new Node
    nodes = res :: nodes
    res
  }
}
```

{% endtab %}
{% tab 'Scala 3' for=inner-classes_4 %}

```scala
class Graph:
  class Node:
    var connectedNodes: List[Graph#Node] = Nil
    def connectTo(node: Graph#Node): Unit =
      if !connectedNodes.exists(node.equals) then
        connectedNodes = node :: connectedNodes

  var nodes: List[Node] = Nil
  def newNode: Node =
    val res = Node()
    nodes = res :: nodes
    res
```

{% endtab %}
{% endtabs %}
