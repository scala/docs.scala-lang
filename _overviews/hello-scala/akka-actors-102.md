---
layout: multipage-overview
title: Akka Actor Examples
description: This is the second part of my introduction to Akka actors, specifically how to use actors in Scala.
partof: hello_scala
overview-name: Hello, Scala
num: 56
---


In this lesson I’ll show two examples of applications that use Akka actors, both of which can help you get started with my larger [“Alexa written with Akka” = Aleka](https://alvinalexander.com/scala/alexa-plus-akka-equals-aleka-tutorial) application.



## Source code

I originally wrote this lesson for my book, [Functional Programming, Simplified](https://alvinalexander.com/scala/learning-functional-programming-in-scala-book), so you can find the source code for it at this URL:

- [github.com/alvinj/FPAkkaHelloWorld](https://github.com/alvinj/FPAkkaHelloWorld)



## An Akka “Hello, world” example

First, let’s look at an example of how to write a “Hello, world” application using Akka. 


### Writing a “Hello” actor

An actor is an instance of the `akka.actor.Actor` class, and once it’s created it starts running on a parallel thread, and all it does is respond to messages that are sent to it. For this “Hello, world” example I want an actor that responds to “hello” messages, so I start with code like this:

```scala
case class Hello(msg: String)

class HelloActor extends Actor {
    def receive = {
        case Hello(s) => {
            println(s"you said '$s'")
            println(s"$s back at you!\n")
        }
        case _ => println("huh?")
    }
}
```

In the first line of code I define a case class named `Hello`. The preferred way to send messages with Akka is to use instances of case classes and case objects because they support immutability and pattern-matching. Therefore, I define `Hello` as a simple wrapper around a string.

After that, I define `HelloActor` as an instance of `Actor`. The body of `HelloActor` is just the `receive` method, which you implement to define the actor’s behavior, i.e., how the actor responds to the messages it receives.

<!-- receive returns a partial function -->

The way this code works is that when `HelloActor` receives a new message in its inbox, `receive` is triggered as a response to that event, and the incoming message is tested against `receive`’s `case` statements. In this example, if the message is of the type `Hello`, the first `case` statement handles the message; if the message is *anything else*, the second `case` statement is triggered. (The second `case` statement is a “catch-all” statement that handles all unknown messages.)

Of course actors get more complicated than this, but that’s the essence of the actor programming pattern:

- You create case classes and case objects to define the types of messages you want your actor to receive
- Because the only way the rest of your code can interact with the actor is by sending messages to it, those classes and objects become your actor’s API
- Inside the actor’s `receive` method you define how you want to respond to each message type

At a high level, that’s all there is to writing actor code.


### A test program

Now all you need is a little driver program to test the actor. This one will do:

```scala
object AkkaHelloWorld extends App {

    // an actor needs an ActorSystem
    val system = ActorSystem("HelloSystem")

    // create and start the actor
    val helloActor = system.actorOf(
        Props[HelloActor], 
        name = "helloActor"
    )

    // send the actor two known messages
    helloActor ! Hello("hello")
    helloActor ! Hello("buenos dias")

    // send it an unknown message
    helloActor ! "hi!"

    // shut down the system
    system.terminate()

}
```

Here’s how that code works. First, actors need an [ActorSystem](https://doc.akka.io/api/akka/current/akka/actor/ActorSystem.html) that they can run in, so you create one like this:

```scala
val system = ActorSystem("HelloSystem")
```

Just give the `ActorSystem` a unique name, and you’re ready to go.

>The `ActorSystem` is the main construct that takes care of the gory thread details behind the scenes. Per the Akka website, “An `ActorSystem` is a heavyweight structure that will allocate 1...N Threads, so create one per logical application ... It is also the entry point for creating or looking up actors.”

Next, as that quote states, you create new actors with the `ActorSystem`, so this is how you create an instance of a `HelloActor`:

```scala
val helloActor = system.actorOf(
    Props[HelloActor],
    name = "helloActor"
)
```

Depending on your needs there are a few variations of that method, but the important part is that you create an instance of `HelloActor` by calling `actorOf` on the `ActorSystem` as shown.

Besides the required `import` statements, that’s the entire setup process. At this point the `helloActor` instance is up and running in parallel with the main application thread, and you can send it messages. This is how you send it a message:

```scala
helloActor ! Hello("hello")
```

This line of code can be read as, “Send the message `Hello("hello")` to the actor named `helloActor`, and don’t wait for a reply.”

The `!` character is how you send a message to an actor. More precisely, it’s how you send a message to an actor *without waiting for a reply back from the actor*. This is by far the most common way to send a message to an actor; you don’t want to wait for a reply back from the actor, because that would cause your application’s thread to block at that point, and *blocking* is bad.

This `case` statement inside `HelloActor` handles this message when it’s received:

```scala
// in HelloActor
case Hello(s) => {
    println(s"you said '$s'")
    println(s"$s back at you!\n")
}
```

Inside that `case` statement I just print two lines of output, but in real world applications this is where you normally delegate work to a child actor.

Looking back at the code, after I send the two `Hello` messages to the `HelloActor`, I send it this message:

```scala
helloActor ! "hi!"
```

Because `HelloActor` doesn’t know how to handle a `String` message, it responds to this message with its “catch-all” `case` statement:

```scala
// in HelloActor
case _ => println("huh?")
```

At this point the `AkkaHelloWorld` application reaches this line of code, which shuts down the `ActorSystem`:

```scala
system.terminate()
```

That’s the entire Akka “Hello, world” application.

I encourage you to work with the source code from the repository for this lesson. In the *HelloWorld.scala* file, add new messages (as case classes and case objects), and then add new `case` statements to the `receive` method in `HelloActor` to respond to those messages. Keep playing with it until you’re sure you know how it all works.



## A second example

As a slightly more complicated example, the *Echo.scala* file in the same repository contains an Akka application that responds to whatever you type at the command line. First, the application defines a case class and a case object that are used to send and receive messages:

```scala
case class Message(msg: String)
case object Bye
```

Next, this is how the `EchoActor` responds to the messages it receives:

```scala
class EchoActor extends Actor {
    def receive = {
        case Message(s) => println("\nyou said " + s)
        case Bye => println("see ya!")
        case _ => println("huh?")
    }
}
```

That follows the same pattern I showed in the first example.

Finally, here’s a driver program you can use to test `EchoActor`:

```scala
object EchoMain extends App {

    // an actor needs an ActorSystem
    val system = ActorSystem("EchoSystem")

    // create and start the actor
    val echoActor = system.actorOf(
        Props[EchoActor], 
        name = "echoActor"
    )

    // prompt the user for input
    var input = ""
    while (input != "q") {
        print("type something (q to quit): ")
        input = StdIn.readLine()
        echoActor ! Message(input)
    }

    echoActor ! Bye

    // shut down the system
    system.terminate()

}
```

Notice that after the `ActorSystem` and `echoActor` are created, the application sits in a loop prompting you for input, until you enter the character `q`. Once you type `q` and the loop terminates, the `echoActor` is sent one last message:

```scala
echoActor ! Bye
```

After that, the system shuts down.

This is what the output of the application looks like when you run it and type a few things at the command line:

````
type something (q to quit): hello
you said hello

type something (q to quit): hola
you said hola

type something (q to quit): q
you said q

bye!
````



## More examples

I could keep showing more examples, but the pattern is the same:

- Create case classes and case objects for the messages you want your actor to handle. These messages become the API for the actor.
- Write your actor’s `receive` method so it responds to those messages as desired.
- Send messages to your actors using `!`.

If you’d like to work with a more-complicated example that builds on this second example, I created an Akka application that works a little like SARAH and the Amazon Echo, albeit at your computer’s command line. See this page on my website for more details:

- [alvinalexander.com/amazon-echo-akka](https://alvinalexander.com/amazon-echo-akka)

That web page describes how the “Akkazon Ekko” application works, but here’s a quick example of some command-line input and output with the application:

````
ekko: weather
stand by ...
The current temperature is 78 degrees, and the sky is partly cloudy.

ekko: forecast
stand by ...
Here's the forecast.
For Sunday, a low of 59, a high of 85, and Partly Cloudy skies. 
For Monday, a low of 53, a high of 72, and Scattered Thunderstorms skies.

ekko: todo add Wake Up
1. Wake Up
````

Please see that web page for more details and the source code.



## Where Akka fits in

As these examples show, an actor is an instance of `Actor`. Once created, an actor resides in memory, running in parallel to the main application thread, waiting for messages to appear in its inbox. When it receives a new message, it responds to the message with the `case` statements defined in its `receive` method. Therefore, an actor-based application can be any application that takes advantage of that programming model.

Depending on your needs, actors can provide a great approach for *reactive programming* because they can help to keep your application’s UI responsive. In something like a Swing (or JavaFX) GUI application, the process looks like this:

- The user provides input through the GUI.
- Your GUI’s event-handling code responds to that input event by sending a message to the appropriate actor.
- The Swing “Event Dispatch Thread” (EDT) remains responsive because the work is not being handled on the EDT.
- When the actor receives the message, it immediately delegates that work to a child actor. (I didn’t show that process in this book, but you can find examples on my website and in the *Scala Cookbook*.)
- When the actor (and its children) finish processing the message, it sends a message back, and that message results in the UI being updated (eventually being handled by `SwingUtilities.invokeLater()`, in the case of Swing).

This is exactly the way SARAH works.

While the actor model isn’t the only way to handle this situation, actors are a great choice when you want to create parallel processes that will live in memory for a long time, and have messages that they know how to respond to.

In the case of SARAH, it has many actors that know how to do different kinds of work, including:

- Actors to get news headlines, check my email, get stock quotes, search Google, and get Twitter trends, etc.
- Actors to represent a mouth, ears, and brain, where the “ear actor” listens to your computer’s microphone, the “mouth actor” speaks through the computer’s speakers, and the “brain actor” knows how to process inputs and outputs, and delegate work to all of the other actors.



## Key points

The key things to know about Akka actors are:

- The primary purpose of actors is to create objects that live in RAM for a long time, run on parallel threads, communicate only by message-passing, and know how to respond to one or more messages. (*Futures*, which you’ll see in the next lesson, are better for “one shot,” short-lived concurrency needs.)
- Messages are defined as case classes and case objects.
- Actors respond to messages with pattern-matching statements in their `receive` method.
- To keep actors responsive, top-level actors should quickly delegate their work.
- Actors don’t share any state with other actors, so there is no mutable, shared state in your application.

Akka is intended for building reactive, responsive, event-driven (message-driven), scalable systems, and the actor model *greatly* simplifies the process of working with multiple long-running threads.



## See also

- [The Akka website](http://akka.io)
- [The Akka documentation](http://akka.io/docs)
- Akka is based on the actor model, which is “[defined here on Wikipedia](https://en.wikipedia.org/wiki/Actor_model)”
- I wrote about Akka Actors in depth in the *Scala Cookbook*
- I wrote [an introductory ‘Ping Pong’ Akka actors example](https://alvinalexander.com/scala/scala-akka-actors-ping-pong-simple-example)
- I wrote an [Akka actors example video game](https://alvinalexander.com/scala/akka-actors-video-game)
- You can learn more about SARAH at [alvinalexander.com/sarah](https://alvinalexander.com/sarah)
- My “Akkazon Ekko” application, which is a simple version of SARAH: [alvinalexander.com/amazon-echo-akka](https://alvinalexander.com/amazon-echo-akka)
- Akka was inspired by the [Erlang language](https://www.erlang.org), which is used to “build massively scalable soft real-time systems with requirements on high availability”

























