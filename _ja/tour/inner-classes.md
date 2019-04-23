---
layout: tour
title: 内部クラス
language: ja

discourse: true

partof: scala-tour

num: 22
next-page: abstract-type-members
previous-page: lower-type-bounds

redirect_from: "/tutorials/tour/inner-classes.html"
---

Scalaではクラスが他のクラスをメンバーとして保持することが可能です。
Javaのような、内部クラスが外側のクラスのメンバーとなる言語とは対照的に、Scalaでは、そのような内部クラスは外側のオブジェクトに束縛されます。
どのノードがなんのグラフに属しているのかを私達が混同しないように、コンパイラがコンパイル時に防いでほしいのです。
パス依存型はその解決策の1つです。

その違いを図示するために、グラフデータ型の実装をさっと書きます。

```tut
class Graph {
  class Node {
    var connectedNodes: List[Node] = Nil
    def connectTo(node: Node) {
      if (connectedNodes.find(node.equals).isEmpty) {
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
このプログラムはグラフをノードのリスト(`List[Node]`)で表現しています。いずれのノードも接続している他のノードへのリスト(`connectedNodes`)を保持します。`class Node`は `class Graph`の中にネストしているので、 _パス依存型_ です。
そのため`connectedNodes`の中にある全てのノードは同じ`Graph`インスタンスから`newNode`を使用し作る必要があります。

```tut
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
val node3: graph1.Node = graph1.newNode
node1.connectTo(node2)
node3.connectTo(node1)
```
`node1`、`node2`、そして `node3`の型が`graph1.Node`であることを明確にするために、明示的に宣言しています。
これは`graph1.newNode`を呼び出す時、`new Node`を呼び出し、そのメソッドがインスタンス`graph1`特有の`Node`のインスタンスを使用しているからです。

今2つのグラフがあれば、Scalaの型システムは1つのグラフの中でノードと別のグラフのノードを混ぜることを許しません。
それは他のグラフのノードは別の型だからです。
こちらは不正なプログラムです。

```
val graph1: Graph = new Graph
val node1: graph1.Node = graph1.newNode
val node2: graph1.Node = graph1.newNode
node1.connectTo(node2)      // legal
val graph2: Graph = new Graph
val node3: graph2.Node = graph2.newNode
node1.connectTo(node3)      // illegal!
```
型`graph1.Node`は`graph2.Node`とは異なります。Javaでは先のプログラム例の最後の行は正しいでしょう。
2つのグラフのノードに対して、Javaは同じ型`Graph.Node`を指定します。つまりクラス`Graph`は`Node`の接頭辞です。
Scalaではそのような型も同様に表現することができ、`Graph#Node`と書きます。
もし他のグラフのノードに接続できるようにしたければ、以下の方法で最初のグラフ実装の定義を変える必要があります。

```tut
class Graph {
  class Node {
    var connectedNodes: List[Graph#Node] = Nil
    def connectTo(node: Graph#Node) {
      if (connectedNodes.find(node.equals).isEmpty) {
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
