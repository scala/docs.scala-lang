---
layout: singlepage-overview
title: Scala Actors迁移指南

partof: actor-migration

language: zh-cn

discourse: false
---

**Vojin Jovanovic 和 Philipp Haller 著**

## 概述

从Scala的2.11.0版本开始，Scala的Actors库已经过时了。早在Scala2.10.0的时候，默认的actor库即是Akka。

为了方便的将Scala Actors迁移到Akka，我们提供了Actor迁移工具包（AMK）。通过在一个项目的类路径中添加scala-actors-migration.jar，AMK包含了一个针对Scala Actors扩展。此外，Akka 2.1包含一些特殊功能，比如ActorDSL singleton，可以实现更简单的转换功能，使Scala Actors代码变成Akka代码。本章内容的目的是用来指导用户完成迁移过程，并解释如何使用AMK。

本指南包括以下内容：在“迁移工具的局限性”章节中，我们在此概述了迁移工具的主要局限性。在“迁移概述”章节中我们描述了迁移过程和谈论了Scala的变化分布，使得迁移成为一种可能。最后，在“一步一步指导迁移到Akka”章节里，我们展示了一些迁移工作的例子，以及各个步骤，如果需要从Scala Actors迁移至Akka's actors，本节是推荐阅读的。

免责声明:并发代码是臭名昭著的，当出现bug时很难调试和修复。由于两个actor的不同实现，这种差异导致可能出现错误。迁移过程每一步后都建议进行完全的代码测试。

## 迁移工具的局限性

由于Akka和Scala的actor模型的完整功能不尽相同导致两者之间不能平滑地迁移。下面的列表解释了很难迁移的部分行为：

1. 依靠终止原因和双向行为链接方法 - Scala和Akka actors有不同的故障处理和actor monitoring模型。在Scala actors模型中，如果一个相关联部分异常终止，相关联的actors终止。如果终止是显式跟踪(通过self.trapExit)，actor可以从失败的actor收到终止的原因。通过Akka这个功能不能迁移到AMK。AMK允许迁移的只是[Akka monitoring](http://doc.akka.io/docs/akka/2.1.0/general/supervision.html#What_Lifecycle_Monitoring_Means)机制。Monitoring不同于连接,因为它是单向(unindirectional)的并且终止的原因是现在已知的。如果仅仅是monitoring机制是无法满足需求的,迁移的链接必须推迟到最后一刻(步骤5的迁移)。然后,当迁移到Akka,用户必须创建一个[监督层次(supervision hierarchy)](http://doc.akka.io/docs/akka/2.1.0/general/supervision.html),处理故障。

2. 使用restart方法——Akka不提供显式的重启actors，因此上述例子我们不能提供平滑迁移。用户必须更改系统,所以没有使用重启方法(restart method)。

3. 使用getState方法 - Akka actors没有显式状态,此功能无法迁移。用户代码必须没有getState调用。

4. 实例化后没有启动actors - Akka actors模型会在实例化后自动启动actors，所以用户不需要重塑系统来显式的在实例化后启动actors。

5. mailboxSize方法不存在Akka中,因此不能迁移。这种方法很少使用,很容易被删除。

## 迁移概述

### 迁移工具

在Scal 2.10.0 actors 是在[Scala distribution](http://www.scala-lang.org/downloads)中作为一个单独包（scala-actors.jar）存在的，并且他们的接口已被弃用。这种分布也包含在Akka actors的akka-actor.jar里。AMK同时存在Scala actors 和 akka-actor.jar之中。未来的主要版本的Scala将不包含Scala actors和AMK。

开始迁移，用户需要添加scala-actors.jar和scala-actors-migration.jar来构建他们的项目。添加scala-actors.jar和scala-actors-migration.jar允许使用下面描述的AMK。这些jar位于Scala Tools库和[Scala distribution](http://www.scala-lang.org/downloads)库中。

### 一步一步来迁移

Actor迁移工具使用起来应该有5步骤。每一步都设计为引入的基于代码的最小变化。在前四个迁移步骤的代码中将使用Scala actors来实现，并在该步完成后运行所有的系统测试。然而,方法和类的签名将被转换为与Akka相似。迁移工具在Scal方面引入了一种新的actor类型（ActWithStash）和强制执行actors的ActorRef接口。

该结果同样强制通过一个特殊的方法在ActorDSL 对象上创建actors。在这些步骤可以每次迁移一个actor。这降低了在同一时刻引入多个bug的可能性，同样降低了bug的复杂程度。

在Scala方面迁移完成后，用户应该改变import语句并变成使用Akka库。在Akka方面，ActorDSL和ActWithStash允许对Scala Actors和他们的生态系的react construct进行建模。这个步骤迁移所有actors到Akka的后端，会在系统中引入bug。一旦代码迁移到Akka,用户将能够使用Akka的所有的功能的。

### 一步一步指导迁移到Akka

在这一章中,我们将通过actor迁移的5个步骤。在每一步之后的代码都要为可能的错误进行检测。在前4个步骤中可以一边迁移一个actor和一边测试功能。然而,最后一步迁移所有actors到Akka后它只能作为一个整体进行测试。在这个步骤之后系统应该具有和之前一样相同的功能，不过它将使用Akka actor库。

### 步骤1——万物皆是Actor

Scala actors库提供了公共访问多个类型的actors。他们被组织在类层次结构和每个子类提供了稍微更丰富的功能。为了进一步的使迁移步骤更容易，我们将首先更改Actor类型系统中的每一个actor。这种迁移步骤很简单，因为Actor类位于层次结构的底部，并提供了广泛的功能。

来自Scala库的Actors应根据以下规则进行迁移：

1. class MyServ extends Reactor[T] -> class MyServ extends Actor

注意,反应器提供了一个额外的类型参数代表了类型的消息收到。如果用户代码中使用这些信息，那么一个需要：i）应用模式匹配与显式类型,或者ii）做一个向下的消息来自任何泛型T。

1. class MyServ extends ReplyReactor -> class MyServ extends Actor

2. class MyServ extends DaemonActor -> class MyServ extends Actor

为了为DaemonActor提供配对功能，将下列代码添加到类的定义。

	override def scheduler: IScheduler = DaemonScheduler

### 步骤2 - 实例化

在Akka中,actors可以访问只有通过ActorRef接口。ActorRef的实例可以通过在ActorDSL对象上调用actor方法或者通过调用ActorRefFactory实例的actorOf方法来获得。在Scala的AMK工具包中，我们提供了Akka ActorRef和ActorDSL的一个子集，该子集实际上是Akka库的一个单例对象(singleton object)。

这一步的迁移使所有actors访问通过ActorRefs。首先，我们现实如何迁移普通模式的实例化Sacla Actors。然后，我们将展示如何分别克服问题的ActorRef和Actor的不同接口。

#### Actor实例化

actor实例的转换规则（以下规则需要import scala.actors.migration._）：

1. 构造器调用实例化

        val myActor = new MyActor(arg1, arg2)
        myActor.start()

应该被替换

	ActorDSL.actor(new MyActor(arg1, arg2))

2. 用于创建Actors的DSL(译注：领域专用语言(Domain Specific Language))

        val myActor = actor {
          // actor 定义
        }
应该被替换

        val myActor = ActorDSL.actor(new Actor {
           def act() {
             // actor 定义
           }
        })

3. 从Actor Trait扩展来的对象

        object MyActor extends Actor {
          // MyActor 定义
        }
        MyActor.start()
应该被替换

        class MyActor extends Actor {
          // MyActor 定义
        }

        object MyActor {
          val ref = ActorDSL.actor(new MyActor)
        }
所有的MyActor地想都应该被替换成MyActor.ref。

需要注意的是Akka actors在实例化的同时开始运行。actors创建并开始在迁移的系统的情况下，actors在不同的位置以及改变这可能会影响系统的行为，用户需要更改代码，以使得actors在实例化后立即开始执行。

远程actors也需要被获取作为ActorRefs。为了得到一个远程actor ActorRef需使用方法selectActorRef。

#### 不同的方法签名(signatures)

至此为止我们已经改变了所有的actor实例化，返回ActorRefs，然而，我们还没有完成迁移工作。有不同的接口在ActorRefs和Actors中，因此我们需要改变在每个迁移实例上触发的方法。不幸的是，Scala Actors提供的一些方法不能迁移。对下列方法的用户需要找到一个解决方案:

1. getState()——Akka中的actors 默认情况下由其监管actors(supervising actors)负责管理和重启。在这种情况下,一个actor的状态是不相关的。

2. restart() - 显式的重启一个Scala actor。在Akka中没有相应的功能。

所有其他Actor方法需要转换为两个ActorRef中的方法。转换是通过下面描述的规则。请注意,所有的规则需要导入以下内容:

    import scala.concurrent.duration._
    import scala.actors.migration.pattern.ask
    import scala.actors.migration._
    import scala.concurrent._
额外规则1-3的作用域定义在无限的时间需要一个隐含的超时。然而，由于Akka不允许无限超时，我们会使用100年。例如：

    implicit val timeout = Timeout(36500 days)

规则：

1. !!(msg: Any): Future[Any] 被？替换。这条规则会改变一个返回类型到scala.concurrent.Future这可能导致类型不匹配。由于scala.concurrent.Future比过去的返回值具有更广泛的功能，这种类型的错误可以很容易地固定在与本地修改：

		actor !! message -> respActor ? message

2. !![A] (msg: Any, handler: PartialFunction[Any, A]): Future[A] 被？取代。处理程序可以提取作为一个单独的函数，并用来生成一个future对象结果。处理的结果应给出另一个future对象结果,就像在下面的例子:

        val handler: PartialFunction[Any, T] = ... // handler
        actor !! (message, handler) -> (respActor ? message) map handler

3. !? (msg: Any):任何被？替换都将阻塞在返回的future对象上

        actor !? message ->
          Await.result(respActor ? message, Duration.Inf)

4. !? (msec: Long, msg: Any): Option[Any]任何被？替换都将显式的阻塞在future对象

        actor !? (dur, message) ->
          val res = respActor.?(message)(Timeout(dur milliseconds))
          val optFut = res map (Some(_)) recover { case _ => None }
          Await.result(optFut, Duration.Inf)

这里没有提到的公共方法是为了actors DSL被申明为公共的。他们只能在定义actor时使用，所以他们的这一步迁移是不相关的。

###第3步 -  从Actor 到 ActWithStash

到目前为止，所有的控制器都继承自Actor trait。我们通过指定的工厂方法来实例化控制器，所有的控制器都可以通过接口ActorRef 来进行访问。现在我们需要把所有的控制器迁移的AMK 的 ActWithStash 类上。这个类的行为方式和Scala的Actor几乎完全一致，它提供了另外一些方法，对应于Akka的Actor trait。这使得控制器更易于逐步的迁移到Akka。

为了达到这个目的，所有的从Actor继承的类，按照下列的方式，需要改为继承自ActWithStash：

	class MyActor extends Actor -> class MyActor extends ActWithStash

经过这样修改以后，代码会无法通过编译。因为ActWithStash中的receive 方法不能在act中像原来那样使用。要使代码通过编译，需要在所有的 receive 调用中加上类型参数。例如：

      receive { case x: Int => "Number" } ->
        receive[String] { case x: Int => "Number" }

另外，要使代码通过编译，还要在act方法前加上 override关键字，并且定义一个空的receive方法。act方法需要被重写，因为它在ActWithStash 的实现中模拟了Akka的消息处理循环。需要修改的地方请看下面的例子：

      class MyActor extends ActWithStash {

         // 空的 receive 方法 (现在还没有用)
         def receive = {case _ => }

         override def act() {
           // 原来代码中的 receive 方法改为 react。
         }
      }
ActWithStash 的实例中，变量trapExit 的缺省值是true。如果希望改变，可以在初始化方法中把它设置为false。

远程控制器在ActWithStash 下无法直接使用，register('name, this)方法需要被替换为：

		registerActorRef('name, self)

在后面的步骤中， registerActorRef 和 alive 方法的调用与其它方法一样。

现在，用户可以测试运行，整个系统的运行会和原来一样。ActWithStash 和Actor 拥有相同的基本架构，所以系统的运行会与原来没有什么区别。

### 第4步 - 去掉act 方法

在这一节，我们讨论怎样从ActWithStash中去掉act方法，以及怎样修改其他方法，使它与Akka更加契合. 这一环节会比较繁杂，所以我们建议最好一次只修改一个控制器。在Scala中，控制器的行为主要是在act方法的中定义。逻辑上来说，控制器是一个并发执行act方法的过程，执行完成后过程终止。在Akka中，控制器用一个全局消息处理器来依次处理它的的消息队列中的消息。这个消息处理器是一个receive函数返回的偏函数(partial function)，该偏函数被应用与每一条消息上。

因为ActWithStash中Akka方法的行为依赖于移除的act方法，所以我们首先要做的是去掉act方法。然后，我们需要按照给定的规则修改scala.actors.Actor中每个方法的。

#### 怎样去除act 方法

在下面的列表中，我们给出了通用消息处理模式的修改规则。这个列表并不包含所有的模式，它只是覆盖了其中一些通用的模式。然而用户可以通过参考这些规则，通过扩展简单规则，将act方法移植到Akka。

嵌套调用react/reactWithin需要注意：消息处理偏函数需要做结构扩展，使它更接近Akka模式。尽管这种修改会很复杂，但是它允许任何层次的嵌套被移植。下面有相关的例子。

在复杂控制流中使用receive/receiveWithin需要注意：这个移植会比较复杂，因为它要求重构act方法。在消息处理偏函数中使用react 和 andThen可以使receive的调用模型化。下面是一些简单的例子。

1. 如果在act方法中有一些代码在第一个包含react的loop之前被执行，那么这些代码应该被放在preStart方法中。

        def act() {
          //初始化的代码放在这里
          loop {
            react { ... }
          }
        }
应该被替换

      override def preStart() {
        //初始化的代码放在这里
      }

      def act() {
        loop {
          react{ ... }
        }
      }
其他的模式，如果在第一个react 之前有一些代码，也可以使用这个规则。

2. 当act 的形式为：一个简单loop循环嵌套react，用下面的方法。

        def act() = {
          loop {
            react {
              // body
            }
          }
        }
应该被替换

      def receive = {
        // body
      }

3. 当act包含一个loopWhile 结构，用下面的方法。

        def act() = {
          loopWhile(c) {
            react {
              case x: Int =>
                // do task
                if (x == 42) {
                  c = false
                }
            }
          }
        }
应该被替换

    def receive = {
      case x: Int =>
        // do task
        if (x == 42) {
          context.stop(self)
        }
    }

4. 当act包含嵌套的react，用下面的规则：

        def act() = {
          var c = true
          loopWhile(c) {
          react {
            case x: Int =>
              // do task
              if (x == 42) {
                c = false
              } else {
                react {
                  case y: String =>
                    // do nested task
                }
              }
            }
          }
        }
应该被替换

      def receive = {
        case x: Int =>
          // do task
          if (x == 42) {
            context.stop(self)
          } else {
            context.become(({
              case y: String =>
              // do nested task
            }: Receive).andThen(x => {
              unstashAll()
              context.unbecome()
           }).orElse { case x => stash(x) })
          }
      }

5. reactWithin方法使用下面的修改规则：

        loop {
          reactWithin(t) {
            case TIMEOUT => // timeout processing code
            case msg => // message processing code
          }
        }
应该被替换

        import scala.concurrent.duration._

        context.setReceiveTimeout(t millisecond)
        def receive = {
          case ReceiveTimeout => // timeout processing code
          case msg => // message processing code
        }

6. 在Akka中，异常处理用另一种方式完成。如果要模拟Scala控制器的方式，那就用下面的方法

        def act() = {
          loop {
            react {
              case msg =>
              // 可能会失败的代码
            }
          }
        }

        override def exceptionHandler = {
          case x: Exception => println("got exception")
        }
应该被替换

      def receive = PFCatch({
        case msg =>
          // 可能会失败的代码
      }, { case x: Exception => println("got exception") })
      PFCatch 的定义

      class PFCatch(f: PartialFunction[Any, Unit],
        handler: PartialFunction[Exception, Unit])
        extends PartialFunction[Any, Unit] {

        def apply(x: Any) = {
          try {
            f(x)
          } catch {
            case e: Exception if handler.isDefinedAt(e) =>
              handler(e)
          }
        }

        def isDefinedAt(x: Any) = f.isDefinedAt(x)
      }

      object PFCatch {
        def apply(f: PartialFunction[Any, Unit],
          handler: PartialFunction[Exception, Unit]) =
            new PFCatch(f, handler)
      }

PFCatch并不包含在AMK之中，所以它可以保留在移植代码中，AMK将会在下一版本中被删除。当整个移植完成后，错误处理也可以改由Akka来监管。

#### 修改Actor的方法

当我们移除了act方法以后，我们需要替换在Akka中不存在，但是有相似功能的方法。在下面的列表中，我们给出了两者的区别和替换方法：

1. exit()/exit(reason) - 需要由 context.stop(self) 替换

2. receiver - 需要由 self 替换

3. reply(msg) - 需要由 sender ! msg 替换

4. link(actor) - 在Akka中，控制器之间的链接一部分由[supervision](http://doc.akka.io/docs/akka/2.1.0/general/supervision.html#What_Supervision_Means)来完成，一部分由[actor monitoring](http://doc.akka.io/docs/akka/2.1.0/general/supervision.html#What_Lifecycle_Monitoring_Means)来完成。在AMK中，我们只支持监测方法。因此，这部分Scala功能可以被完整的移植。

linking 和 watching 之间的区别在于：watching actor总是接受结束通知。然而，不像Scala的Exit消息包含结束的原因，Akka的watching 返回Terminated(a: ActorRef)消息，只包含ActorRef。获取结束原因的功能无法被移植。在Akka中，这一步骤可以在第4步之后，通过组织控制器的监管层级 [supervision hierarchy](http://doc.akka.io/docs/akka/2.1.0/general/supervision.html)来完成。

如果watching actors收到的消息不撇陪结束消息，控制器会被终止并抛出DeathPactException异常。注意就算watching actors正常的结束，也会发生这种情况。在Scala中，linked actors只要一方不正常的终止，另一方就会以相同的原因终止。

如果系统不能单独的用 watch actors来 移植，用户可以像原来那样用link和exit(reason)来使用。然而，因为act()重载了Exit消息，需要做如下的修改：

      case Exit(actor, reason) =>
        println("sorry about your " + reason)
        ...
应该被替换

      case t @ Terminated(actorRef) =>
        println("sorry about your " + t.reason)
        ...
注意：在Scala和Akka的actor之间有另一种细微的区别：在Scala， link/watch 到已经终止的控制器不会有任何影响。在Akka中，看管已经终止的控制器会导致发送终止消息。这会在系统移植的第5 步导致不可预料的结果。

### 第5步 - Akka后端的移植

到目前为止，用户代码已经做好了移植到Akka actors的准备工作。现在我们可以把Scala actors迁移到Akka actor上。为了完成这一目标，需要配置build，去掉scala-actors.jar 和 scala-actors-migration.jar，把 akka-actor.jar 和 typesafe-config.jar加进来。AMK只能在Akka actor 2.1下正常工作，Akka actor 2.1已经包含在分发包 [Scala distribution](http://www.scala-lang.org/downloads)中， 可以用这样的方法配置。

经过这一步骤以后，因为包名的不同和API之间的细微差别，编译会失败。我们必须将每一个导入的actor从scala 修改为Akka。下列是部分需要修改的包名：

      scala.actors._ -> akka.actor._
      scala.actors.migration.ActWithStash -> akka.actor.ActorDSL._
      scala.actors.migration.pattern.ask -> akka.pattern.ask
      scala.actors.migration.Timeout -> akka.util.Timeout

当然，ActWithStash 中方法的声明 def receive = 必须加上前缀override。

在Scala actor中，stash 方法需要一个消息做为参数。例如：

      def receive = {
        ...
        case x => stash(x)
      }

在Akka中，只有当前处理的消息可以被隐藏(stashed)。因此，上面的例子可以替换为：

        def receive = {
          ...
          case x => stash()
        }

#### 添加Actor System

Akka actor 组织在[Actor systems](http://doc.akka.io/docs/akka/2.1.0/general/actor-systems.html)系统中。每一个被实例化的actor必须属于某一个ActorSystem。因此，要添加一个ActorSystem 实例作为每个actor 实例调用的第一个参数。下面给出了例子。

为了完成该转换，你需要有一个actor system 实例。例如：

	val system = ActorSystem("migration-system")

然后，做如下转换：

	ActorDSL.actor(...) -> ActorDSL.actor(system)(...)

如果对actor 的调用都使用同一个ActorSystem ，那么它可以作为隐式参数来传递。例如：

      ActorDSL.actor(...) ->
        import project.implicitActorSystem
        ActorDSL.actor(...)

当所有的主线程和actors结束后，Scala程序会终止。迁移到Akka后，当所有的主线程结束，所有的actor systems关闭后，程序才会结束。Actor systems 需要在程序退出前明确的中止。这需要通过在Actor system中调用shutdown 方法来完成。

#### 远程 Actors

当代码迁移到Akka，远程actors就不再工作了。 registerActorFor 和 alive 方法需要被移除。 在Akka中，远程控制通过配置独立的完成。更多细节请参考[Akka remoting documentation](http://doc.akka.io/docs/akka/2.1.0/scala/remoting.html)。

#### 样例和问题

这篇文档中的所有程序片段可以在[Actors Migration test suite](http://github.com/scala/actors-migration/tree/master/src/test/)中找到，这些程序做为测试文件，前缀为actmig。

这篇文档和Actor移植组件由 [Vojin Jovanovic](http://people.epfl.ch/vojin.jovanovic)和[Philipp Haller](http://lampwww.epfl.ch/~phaller/)编写。

如果你发现任何问题或不完善的地方，请把它们报告给 [Scala Bugtracker](https://github.com/scala/actors-migration/issues)。
