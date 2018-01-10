---
layout: singlepage-overview
title: The Scala Actors API

partof: actors

language: zh-cn

discourse: false
---

**Philipp Haller 和 Stephen Tu 著**

## 简介

本指南介绍了Scala 2.8和2.9中`scala.actors`包的API。这个包的内容因为逻辑上相通，所以放到了同一个类型的包内。这个trait在每个章节里面都会有所涉及。这章的重点在于这些traits所定义的各种方法在运行状态时的行为，由此来补充现有的Scala基础API。

注意：在Scala 2.10版本中这个Actors库将是过时的，并且在未来Scala发布的版本中将会被移除。开发者应该使用在`akka.actor`包中[Akka](http://akka.io/) actors来替代它。想了解如何将代码从Scala actors迁移到Akka请参考[Actors 迁移指南](http://docs.scala-lang.org/overviews/core/actors-migration-guide.html)章节。

## Actor trait：Reactor, ReplyReactor和Actor

### Reactor trait

Reactor 是所有`actor trait`的父级trait。扩展这个trait可以定义actor，其具有发送和接收消息的基本功能。

Reactor的行为通过实现其act方法来定义。一旦调用start方法启动Reactor，这个act方法便会执行，并返回这个Reactor对象本身。start方法是具有等幂性的，也就是说，在一个已经启动了的actor对象上调用它（start方法）是没有作用的。

Reactor trait 有一个Msg 的类型参数，这个参数指明这个actor所能接收的消息类型。

调用Reactor的!方法来向接收者发送消息。用!发送消息是异步的，这样意味着不会等待消息被接收——它在发送消息后便立刻往下执行。例如：`a ! msg`表示向`a`发送`msg`。每个actor都有各自的信箱（mailbox）作为缓冲来存放接收到的消息，直至这些消息得到处理。

Reactor trait中也定义了一个forward方法，这个方法继承于OutputChannel。它和!（感叹号，发送方法）有同样的作用。Reactor的SubTrait（子特性）——特别是`ReplyReactor trait`——覆写了此方法，使得它能够隐式地回复目标。（详细地看下面的介绍）

一个Reactor用react方法来接收消息。react方法需要一个PartialFunction[Msg, Unit]类型的参数，当消息到达actor的邮箱之后，react方法根据这个参数来确定如何处理消息。在下面例子中，当前的actor等待接收一个“Hello”字符串，然后打印一句问候。

    react {
      case "Hello" => println("Hi there")
    }

调用react没有返回值。因此，在接收到一条消息后，任何要执行的代码必须被包含在传递给react方法的偏函数（partial function）中。举个例子，通过嵌套两个react方法调用可以按顺序接收到两条消息：

    react {
      case Get(from) =>
        react {
          case Put(x) => from ! x
        }
    }

Reactor trait 也提供了控制结构，简化了react方法的代码。

### 终止和执行状态

当Reactor的act方法完整执行后， Reactor则随即终止执行。Reactor也可以显式地使用exit方法来终止自身。exit方法的返回值类型为Nothing，因为它总是会抛出异常。这个异常仅在内部使用，并且不应该去捕捉这个异常。

一个已终止的Reactor可以通过它的restart方法使它重新启动。对一个未终止的Reactor调用restart方法则会抛出`IllegalStateException`异常。重新启动一个已终止的actor则会使它的act方法重新运行。

Reactor定义了一个getState方法，这个方法可以将actor当前的运行状态作为Actor.State枚举的一个成员返回。一个尚未运行的actor处于`Actor.State.New`状态。一个能够运行并且不在等待消息的actor处于`Actor.State.Runnable`状态。一个已挂起，并正在等待消息的actor处于`Actor.State.Suspended`状态。一个已终止的actor处于`Actor.State.Terminated`状态。

### 异常处理

exceptionHandler成员允许定义一个异常处理程序，其在Reactor的整个生命周期均可用。

    def exceptionHandler: PartialFunction[Exception, Unit]

exceptionHandler返回一个偏函数，它用来处理其他没有被处理的异常。每当一个异常被传递到Reactor的act方法体之外时，这个成员函数就被应用到该异常，以允许这个actor在它结束前执行清理代码。注意：`exceptionHandler`的可见性为protected。

用exceptionHandler来处理异常并使用控制结构对与react的编程是非常有效的。每当exceptionHandler返回的偏函数处理完一个异常后，程序会以当前的后续闭包（continuation closure）继续执行。

    loop {
      react {
        case Msg(data) =>
          if (cond) // 数据处理代码
          else throw new Exception("cannot process data")
      }
    }

假设Reactor覆写了exceptionHandler，在处理完一个在react方法体内抛出的异常后，程序将会执行下一个循环迭代。

### ReplyReactor trait

`ReplyReactor trait`扩展了`Reactor[Any]`并且增加或覆写了以下方法：

！方法被覆写以获得一个当前actor对象（发送方）的引用，并且，这个发送方引用和实际的消息一起被传递到接收actor的信箱（mail box）中。接收方通过其sender方法访问消息的发送方（见下文）。

forward方法被覆写以获得一个引用，这个引用指向正在被处理的消息的发送方。引用和实际的消息一起作为当前消息的发送方传递。结果，forward方法允许代表不同于当前actor对象的actor对象转发消息。

增加的sender方法返回正被处理的消息的发送方。考虑到一个消息可能已经被转发，发送方可能不会返回实际发送消息的actor对象。

增加的reply方法向最后一个消息的发送方回复消息。reply方法也被用作回复一个同步消息发送或者一个使用future的消息发送（见下文）。

增加的!?方法提供同步消息发送。调用!?方法会引起发送方actor对象等待，直到收到一个响应，然后返回这个响应。重载的变量有两个。这个双参数变量需要额外的超时参数（以毫秒计），并且，它的返回类型是Option[Any]而不是Any。如果发送方在指定的超时期间没有收到一个响应，!?方法返回None，否则它会返回由Some包裹的响应。

增加的!!方法与同步消息发送的相似点在于，它们都允许从接收方传递一个响应。然而，它们返回Future实例，而不是阻塞发送中的actor对象直到接收响应。一旦Future对象可用，它可以被用来重新获得接收方的响应，还可以在不阻塞发送方的情况下，用于获知响应是否可用。重载的变量有两个。双参数变量需要额外的PartialFunction[Any,A]类型的参数。这个偏函数用于对接收方响应进行后处理。本质上，!!方法返回一个future对象，一旦响应被接收，这个future对象把偏函数应用于响应。future对象的结果就是后处理的结果。

增加的reactWithin方法允许在一段给定的时间段内接收消息。相对于react方法，这个方法需要一个额外的msec参数，用来指示在这个时间段（以毫秒计）直到匹配指定的TIMEOUT模式为止（TIMEOUT是包scala.actors中的用例对象（case object））。例如：

reactWithin(2000) { case Answer(text) => // process text case TIMEOUT => println("no answer within 2 seconds") }

reactWithin方法也允许以非阻塞方式访问信箱。当指定一个0毫秒的时间段时，首先会扫描信箱以找到一个匹配消息。如果在第一次扫描后没有匹配的消息，这个TIMEOUT模式将会匹配。例如，这使得接收某些消息会比其他消息有较高的优先级：

reactWithin(0) { case HighPriorityMsg => // ... case TIMEOUT => react { case LowPriorityMsg => // ... } }

在上述例子中，即使在信箱里有一个先到达的低优先级的消息，actor对象也会首先处理下一个高优先级的消息。actor对象只有在信箱里没有高优先级消息时才会首先处理一个低优先级的消息。

另外，ReplyReactor 增加了`Actor.State.TimedSuspended`执行状态。一个使用`reactWithin`方法等待接收消息而挂起的actor对象，处在` Actor.State.TimedSuspended `状态。

### Actor trait

Actor trait扩展了`ReplyReactor`并增加或覆写了以下成员：

增加的receive方法的行为类似react方法，但它可以返回一个结果。这可以在它的类型上反映——它的结果是多态的：def receive[R](f: PartialFunction[Any, R]): R。然而，因为actor对象挂起并等待消息时，receive方法会阻塞底层线程（underlying thread），使用receive方法使actor对象变得更加重量级。直到receive方法的调用返回，阻塞的线程将不能够执行其他actor对象。

增加的link和unlink方法允许一个actor对象将自身链接到另一个actor对象，或将自身从另一个actor对象断开链接。链接可以用来监控或对另一个actor对象的终止做出反应。特别要注意的是，正如在Actor trait的API文档中的解释，链接影响调用exit方法的行为。

trapExit成员允许对链接的actor对象的终止做出反应而无关其退出的原因（即，无关是否正常退出）。如果一个actor对象的trapExit成员被设置为true，则这个actor对象会因链接的actor对象而永远不会终止。相反，每当其中一个链接的actor对象个终止了，它将会收到类型为Exit的消息。这个Exit case class 有两个成员：from指终止的actor对象；reason指退出原因。

### 终止和执行状态

当终止一个actor对象的执行时，可以通过调用以下exit方法的变体，显式地设置退出原因：

    def exit(reason: AnyRef): Nothing
当一个actor对象以符号'normal以外的原因退出，会向所有链接到它的atocr对象传递其退出原因。如果一个actor对象由于一个未捕获异常终止，它的退出原因则为一个UncaughtException case class的实例。

Actor trait增加了两个新的执行状态。使用receive方法并正在等待接收消息的actor处在`Actor.State.Blocked`状态。使用receiveWithin方法并正在等待接收消息的actor处在`Actor.State.TimedBlocked`状态。

## 控制结构

Reactor trait定义了控制结构，它简化了无返回的react操作的编程。一般来说，一个react方法调用并不返回。如果actor对象随后应当执行代码，那么，或者显式传递actor对象的后续代码给react方法，或者可以使用下述控制结构，达到隐藏这些延续代码的目的。

最基础的控制结构是andThen，它允许注册一个闭包。一旦actor对象的所有其他代码执行完毕，闭包就会被执行。

    actor {
      {
        react {
          case "hello" => // 处理 "hello"
        }: Unit
      } andThen {
        println("hi there")
      }
    }

例如，上述actor实例在它处理了“hello”消息之后，打印一句问候。虽然调用react方法不会返回，我们仍然可以使用andThen来注册这段输出问候的代码（作为actor的延续）。

注意：在react方法的调用（: Unit）中存在一种类型归属。总而言之，既然表达式的结果经常可以被忽略，react方法的结果就可以合法地作为Unit类型来处理。andThen方法无法成为Nothing类型（react方法的结果类型）的一个成员，所以在这里有必要这样做。把react方法的结果类型当作Unit，允许实现一个隐式转换的应用，这个隐式转换使得andThen成员可用。

API还提供一些额外的控制结构：

loop { ... }。无限循环，在每一次迭代中，执行括号中的代码。调用循环体内的react方法，actor对象同样会对消息做出反应。而后，继续执行这个循环的下次迭代。

loopWhile (c) { ... }。当条件c返回true，执行括号中的代码。调用循环体中的react方法和使用loop时的效果一样。

continue。继续执行当前的接下来的后续闭包（continuation closure）。在loop或loopWhile循环体内调用continue方法将会使actor对象结束当前的迭代并继续执行下次迭代。如果使用andThen注册了当前的后续代码，这个闭包会作为第二个参数传给andThen，并以此继续执行。

控制结构可以在Reactor对象的act方法中，以及在act方法（传递地）调用的方法中任意处使用。对于用actor{...}这样的缩略形式创建的actor，控制结构可以从Actor对象导入。

### Future

ReplyReactor和Actor trait支持发送带有结果的消息（!!方法），其立即返回一个future实例。一个future即Future trait的一个实例，即可以用来重新获取一个send-with-future消息的响应的句柄。

一个send-with-future消息的发送方可以通过应用future来等待future的响应。例如，使用val fut = a !! msg 语句发送消息，允许发送方等待future的结果。如：val res = fut()。

另外，一个Future可以在不阻塞的情况下，通过isSet方法来查询并获知其结果是否可用。

send-with-future的消息并不是获得future的唯一的方法。future也可以通过future方法计算而得。下述例子中，计算体会被并行地启动运行，并返回一个future实例作为其结果：

    val fut = Future { body }
    // ...
    fut() // 等待future

能够通过基于actor的标准接收操作（例如receive方法等）来取回future的结果，使得future实例在actor上下文中变得特殊。此外，也能够通过使用基于事件的操作（react方法和ractWithin方法）。这使得一个actor实例在等待一个future实例结果时不用阻塞它的底层线程。

通过future的inputChannel，使得基于actor的接收操作方法可用。对于一个类型为`Future[T]`的future对象而言，它的类型是`InputChannel[T]`。例如：

    val fut = a !! msg
    // ...
    fut.inputChannel.react {
      case Response => // ...
    }

## Channel（通道）

channnel可以用来对发送到同一actor的不同类型消息的处理进行简化。channel的层级被分为OutputChannel和InputChannel。

OutputChannel可用于发送消息。OutputChannel的out方法支持以下操作。

out ! msg。异步地向out方法发送msg。当msg直接发送给一个actor，一个发送中的actor的引用会被传递。

out forward msg。异步地转发msg给out方法。当msg被直接转发给一个actor，发送中的actor会被确定。

out.receiver。返回唯一的actor，其接收发送到out channel（通道）的消息。

out.send(msg, from)。异步地发送msg到out，并提供from作为消息的发送方。

注意：OutputChannel trait有一个类型参数，其指定了可以被发送到channel（通道）的消息类型（使用!、forward和send）。这个类型参数是逆变的：

    trait OutputChannel[-Msg]

Actor能够从InputChannel接收消息。就像OutputChannel，InputChannel trait也有一个类型参数，用于指定可以从channel（通道）接收的消息类型。这个类型参数是协变的：

    trait InputChannel[+Msg]

An` InputChannel[Msg] `in支持下列操作。

in.receive { case Pat1 => ... ; case Patn => ... }（以及类似的 in.receiveWithin）。从in接收一个消息。在一个输入channel（通道）上调用receive方法和actor的标准receive操作具有相同的语义。唯一的区别是，作为参数被传递的偏函数具有PartialFunction[Msg, R]类型，此处R是receive方法的返回类型。

in.react { case Pat1 => ... ; case Patn => ... }（以及类似的in.reactWithin）通过基于事件的react操作，从in方法接收一个消息。就像actor的react方法，返回类型是Nothing。这意味着此方法的调用不会返回。就像之前的receive操作，作为参数传递的偏函数有一个更具体的类型：PartialFunction[Msg, Unit]

### 创建和共享channel

channel通过使用具体的Channel类创建。它同时扩展了InputChannel和OutputChannel。使channel在多个actor的作用域（Scope）中可见，或者将其在消息中发送，都可以实现channel的共享。

下面的例子阐述了基于作用域（scope）的共享。

    actor {
      var out: OutputChannel[String] = null
      val child = actor {
        react {
          case "go" => out ! "hello"
        }
      }
      val channel = new Channel[String]
      out = channel
      child ! "go"
      channel.receive {
        case msg => println(msg.length)
      }
    }

运行这个例子将输出字符串“5”到控制台。注意：子actor对out（一个OutputChannel[String]）具有唯一的访问权。而用于接收消息的channel的引用则被隐藏了。然而，必须要注意的是，在子actor向输出channel发送消息之前，确保输出channel被初始化到一个具体的channel。通过使用“go”消息来完成消息发送。当使用channel.receive来从channel接收消息时，因为消息是String类型的，可以使用它提供的length成员。

另一种共享channel的可行的方法是在消息中发送它们。下面的例子对此作了阐述。

    case class ReplyTo(out: OutputChannel[String])

    val child = actor {
      react {
        case ReplyTo(out) => out ! "hello"
      }
    }

    actor {
      val channel = new Channel[String]
      child ! ReplyTo(channel)
      channel.receive {
        case msg => println(msg.length)
      }
    }

ReplyTo case class是一个消息类型，用于分派一个引用到OutputChannel[String]。当子actor接收一个ReplyTo消息时，它向它的输出channel发送一个字符串。第二个actor则像以前一样接收那个channel上的消息。

## Scheduler

scheduler用于执行一个Reactor实例（或子类型的一个实例）。Reactor trait引入了scheduler成员，其返回常用于执行Reactor实例的scheduler。

    def scheduler: IScheduler

运行时系统通过使用在IScheduler trait中定义的execute方法之一，向scheduler提交任务来执行actor。只有在完整实现一个新的scheduler时（但没有必要），此trait的大多数其他方法才是相关的。

默认的scheduler常用于执行Reactor实例，而当所有的actor完成其执行时，Actor则会检测环境。当这发生时，scheduler把它自己关闭（终止scheduler使用的任何线程）。然而，一些scheduler，比如SingleThreadedScheduler（位于scheduler包）必须要通过调用它们的shutdown方法显式地关闭。

创建自定义scheduler的最简单方法是通过扩展SchedulerAdapter，实现下面的抽象成员：

    def execute(fun: => Unit): Unit

典型情况下，一个具体的实现将会使用线程池来执行它的按名参数fun。

## 远程Actor

这一段描述了远程actor的API。它的主要接口是scala.actors.remote包中的RemoteActor对象。这个对象提供各种方法来创建和连接到远程actor实例。在下面的代码段中我们假设所有的RemoteActor成员都已被导入，所使用的完整导入列表如下：

    import scala.actors._
    import scala.actors.Actor._
    import scala.actors.remote._
    import scala.actors.remote.RemoteActor._

### 启动远程Actor

远程actor由一个Symbol唯一标记。在这个远程Actor所执行JVM上，这个符号对于JVM实例是唯一的。由名称'myActor标记的远程actor可按如下方法创建。

    class MyActor extends Actor {
      def act() {
        alive(9000)
        register('myActor, self)
        // ...
      }
    }

记住：一个名字一次只能标记到一个单独的（存活的）actor。例如，想要标记一个actorA为'myActor，然后标记另一个actorB为'myActor。这种情况下，必须等待A终止。这个要求适用于所有的端口，因此简单地将B标记到不同的端口来作为A是不能满足要求的。

### 连接到远程Actor

连接到一个远程actor也同样简单。为了获得一个远程Actor的远程引用（运行于机器名为myMachine，端口为8000，名称为'anActor），可按下述方式使用select方法：

    val myRemoteActor = select(Node("myMachine", 8000), 'anActor)

从select函数返回的actor具有类型AbstractActor，这个类型本质上提供了和通常actor相同的接口，因此支持通常的消息发送操作：

    myRemoteActor ! "Hello!"
    receive {
      case response => println("Response: " + response)
    }
    myRemoteActor !? "What is the meaning of life?" match {
      case 42 => println("Success")
      case oops => println("Failed: " + oops)
    }
    val future = myRemoteActor !! "What is the last digit of PI?"

记住：select方法是惰性的，它不实际初始化任何网络连接。仅当必要时（例如，调用!时），它会单纯地创建一个新的，准备好初始化新网络连接的AbstractActor实例。
