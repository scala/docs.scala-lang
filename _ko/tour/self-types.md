---
layout: tour
title: 명시적으로 타입이 지정된 자기 참조
partof: scala-tour

num: 24
language: ko

next-page: implicit-parameters
previous-page: compound-types
---

확장 가능한 소프트웨어를 개발할 땐 `this` 값의 타입을 명시적으로 선언하는 편이 편리할 수도 있다. 이를 이해하기 위해 스칼라로 작성된 작고 확장 가능한 그래프 데이터 구조를 만들어 보기로 하자.

다음은 그래프가 무엇인지 설명해주는 정의이다.

    abstract class Graph {
      type Edge
      type Node <: NodeIntf
      abstract class NodeIntf {
        def connectWith(node: Node): Edge
      }
      def nodes: List[Node]
      def edges: List[Edge]
      def addNode: Node
    }

그래프는 노드와 엣지의 리스트로 구성되며, 노드와 엣지의 타입은 모두 추상적으로 남겨뒀다. [추상 타입](abstract-type-members.html)을 사용해서 트레잇 Graph를 구현할 수 있도록 했고, 이를 통해 노드와 엣지에 해당하는 자신의 콘크리트 클래스를 만들 수 있다. 뿐만 아니라 `addNode`라는 메소드는 그래프에 새로운 노드를 추가해준다. 메소드 `connectWith`를 사용해 노드를 연결한다.

다음 클래스는 클래스 `Graph`를 구현하는 한 예다.

    abstract class DirectedGraph extends Graph {
      type Edge <: EdgeImpl
      class EdgeImpl(origin: Node, dest: Node) {
        def from = origin
        def to = dest
      }
      class NodeImpl extends NodeIntf {
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)
          edges = edge :: edges
          edge
        }
      }
      protected def newNode: Node
      protected def newEdge(from: Node, to: Node): Edge
      var nodes: List[Node] = Nil
      var edges: List[Edge] = Nil
      def addNode: Node = {
        val node = newNode
        nodes = node :: nodes
        node
      }
    }

클래스 `DirectedGraph`는 부분적 구현을 제공해서 `Graph` 클래스를 특수화한다. `DirectedGraph`가 더욱 확장 가능하길 원하기 때문에 그 일부만을 구현했다. 그 결과, 이 클래스의 구현 세부 사항은 모두가 확정되지 않은 상태로 열려있고, 엣지와 노드 타입은 추상적으로 처리됐다. 반면에, 클래스 `DirectedGraph`는 클래스 `EdgeImpl`과의 결합을 강화함으로써 엣지 타입의 구현에 관한 내용 일부를 추가적으로 표현하고 있다. 또한 클래스 `EdgeImpl`과 `NodeImpl`을 통해 엣지와 노드의 구현 일부를 먼저 정의했다. 새로운 노드와 엣지 객체를 부분 클래스 구현 안에서 생성해야만 하기 때문에 팩토리 메소드 `newNode`와 `newEdge`도 추가해야 한다. 메소드 `addNode`와 `connectWith`는 이 팩토리 메소드를 사용해 정의했다. 메소드 `connectWith`의 구현을 좀 더 자세히 살펴보면, 엣지를 생성하기 위해선 반드시 자기 참조 `this`를 팩토리 메소드 `newEdge`로 전달해야 함을 알 수 있다. 하지만 `this`에는 타입 `NodeImpl`이 할당되고, 이는 팩토리 메소드에서 요구하는 타입 `Node`와 호환되지 않는다. 결국, 위의 프로그램은 제대로 만들어지지 않았으며, 스칼라 컴파일러는 오류 메시지를 표시한다.

스칼라에선 자기 참조 `this`에 다른 타입을 명시적으로 부여함으로써 클래스를 다른 타입(향후에 구현될)과 묶을 수 있다. 이 기법을 사용하면 위의 코드를 올바르게 고칠 수 있다. 명시적 자기 타입은 클래스 `DirectedGraph`의 내부에서 지정된다.

다음은 고쳐진 프로그램이다.

    abstract class DirectedGraph extends Graph {
      ...
      class NodeImpl extends NodeIntf {
        self: Node =>
        def connectWith(node: Node): Edge = {
          val edge = newEdge(this, node)  // now legal
          edges = edge :: edges
          edge
        }
      }
      ...
    }

새롭게 정의한 클래스 `NodeImpl`에선 `this`의 타입이 `Node`다. 타입 `Node`가 추상적이기 때문에 `NodeImpl`이 정말 `Node`의 서브타입인지 알 수 없으며, 스칼라의 타입 시스템은 이 클래스의 인스턴스화를 허용하지 않는다. 하지만 인스턴스화를 위해선 언젠간 `NodeImpl`(의 서브클래스)이 타입 `Node`의 서브타입을 지정해주도록 명시적 타입 어노테이션을 표시했다.

다음은 모든 추상 클래스 멤버가 콘크리트하게 변경된, `DirectedGraph`의 콘크리트한 특수화다.

    class ConcreteDirectedGraph extends DirectedGraph {
      type Edge = EdgeImpl
      type Node = NodeImpl
      protected def newNode: Node = new NodeImpl
      protected def newEdge(f: Node, t: Node): Edge =
        new EdgeImpl(f, t)
    }

이젠 `NodeImpl`에서 `Node`(단순히 `NodeImpl`의 또 다른 이름일 뿐이다)의 서브타입을 지정했기 때문에, 이 클래스에선 `NodeImpl`을 인스턴스화 할 수 있음을 기억하자.

다음은 클래스 `ConcreteDirectedGraph`를 사용하는 예다.

    object GraphTest extends App {
      val g: Graph = new ConcreteDirectedGraph
      val n1 = g.addNode
      val n2 = g.addNode
      val n3 = g.addNode
      n1.connectWith(n2)
      n2.connectWith(n3)
      n1.connectWith(n3)
    }

윤창석, 이한욱 옮김
