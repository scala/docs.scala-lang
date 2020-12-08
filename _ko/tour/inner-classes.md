---
layout: tour
title: 내부 클래스
partof: scala-tour

num: 21
language: ko

next-page: abstract-type-members
previous-page: lower-type-bounds
---

스칼라의 클래스는 다른 클래스를 멤버로 가질 수 있다. 자바와 같은 언어의 내부 클래스는 자신을 감싸고 있는 클래스의 멤버인 반면에, 스칼라에선 내부 클래스가 외부 객체의 경계 안에 있다. 이런 차이점을 분명히 하기 위해 그래프 데이터타입의 구현을 간단히 그려보자.
 
    class Graph {
      class Node {
        var connectedNodes: List[Node] = Nil
        def connectTo(node: Node) {
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
 
이 프로그램에선 노드의 리스트로 그래프를 나타냈다. 노드는 내부 클래스 `Node`의 객체다. 각 노드는 리스트 `connectedNodes`에 저장되는 이웃의 목록을 갖고 있다. 이제 몇몇 노드를 선택하고 이에 연결된 노드를 추가하면서 점진적으로 그래프를 구축할 수 있다.
 
    object GraphTest extends App {
      val g = new Graph
      val n1 = g.newNode
      val n2 = g.newNode
      val n3 = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
정의된 여러 엔티티의 타입이 무엇인지 명시적으로 알려주는 타입 정보를 사용해 위의 예제를 확장해보자.
 
    object GraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      val n3: g.Node = g.newNode
      n1.connectTo(n2)
      n3.connectTo(n1)
    }
 
이 코드는 외부 인스턴스(이 예제의 객체 `g`)를 접두어로 지정해 노드 타입을 분명히 나타내고 있다. 두 그래프가 있는 상황에서, 스칼라의 타입 시스템은 한 그래프에 정의된 노드를 다른 그래프에서도 정의해 공유하는 상황을 허용하지 않는다. 이는 다른 그래프의 노드는 다른 타입을 갖기 때문이다.
다음은 잘못된 프로그램이다.
 
    object IllegalGraphTest extends App {
      val g: Graph = new Graph
      val n1: g.Node = g.newNode
      val n2: g.Node = g.newNode
      n1.connectTo(n2)      // legal
      val h: Graph = new Graph
      val n3: h.Node = h.newNode
      n1.connectTo(n3)      // illegal!
    }
 
자바에선 이 예제 프로그램의 마지막 줄이 올바른 표현임을 상기하자. 자바는 두 그래프의 노드에 `Graph.Node`라는 동일한 타입을 할당한다. 즉, `Node`에는 클래스 `Graph`가 접두어로 붙는다. 스칼라에서도 이런 타입을 표현할 수 있으며, 이를 `Graph#Node`로 나타낸다. 서로 다른 그래프 간에 노드를 연결할 수 있길 원한다면 초기 그래프 구현의 정의를 다음과 같이 변경해야 한다.
 
    class Graph {
      class Node {
        var connectedNodes: List[Graph#Node] = Nil
        def connectTo(node: Graph#Node) {
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
 
> 이 프로그램에선 하나의 노드를 서로 다른 두 그래프에 추가할 수 없음에 주의하자. 이 제약도 함께 제거하기 위해선 변수 nodes의 타입을 `Graph#Node`로 바꿔야 한다.

윤창석, 이한욱 옮김
