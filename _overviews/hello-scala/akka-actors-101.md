---
layout: multipage-overview
title: Akka Actors
description: This page provides an introduction to Akka Actors, specifically how to use actors in Scala.
partof: hello_scala
overview-name: Hello, Scala
num: 55
---

In this lesson I provide a brief introduction to the [Akka actors library](http://akka.io/). In the lesson you’ll learn about:

- Actors and the actor model
- Akka’s benefits

At the end I also share a link to a video of an Alexa-like application I wrote using actors

>If you’re already comfortable with the *Actor model*, feel free to move on to the next lesson, where I share some Scala/Akka code.



## Actors and the Actor Model

The first thing to know about actors is the *actor model*, which is a mental model of how to think about a system built with actors. Within that model the first concept to understand is an *actor*:

- An actor is a long-running process that runs in parallel to the main application thread, and responds to messages that are sent to it.
- An actor is the smallest unit of functionality when building an actor-based system, just like a class is the smallest unit in an OOP system.
- Like a class, an actor encapsulates state and behavior.
- You can’t peek inside an actor to get its state. You can send an actor a message requesting state information (like texting a person to ask how they’re feeling), but you can’t reach in and execute one of its methods or access its fields (just like you can’t peak inside someone else’s brain).
- An actor has a mailbox (an inbox), and the actor’s purpose in life is to process the messages in its mailbox.
- You communicate with an actor by sending it an immutable message (typically as a case class or case object in Akka). These messages go directly into the actor’s mailbox.
- When an actor receives a message, it’s like taking a letter out of its mailbox. It opens the letter, processes the message using one of its algorithms, then moves on to the next message in the mailbox. If there are no more messages, the actor waits until it receives one.

Akka experts recommend thinking of an actor as being like a person, such as a person in a business organization:

- You can’t know what’s going on inside another person. All you can do is send them a message and wait for their response.
- An actor has one parent, known as a *supervisor*. In Akka, that supervisor is the actor that created it.
- An actor may have children. For instance, a President in a business may have a number of Vice Presidents. Those VPs are like children of the President, and they may also have many subordinates. (And those subordinates may have many subordinates, etc.)
- An actor may have siblings — i.e., other actors at the same level. For instance, there may be 10 VPs in an organization, and they are all at the same level in the organization chart.


### Actors should delegate their work

There’s one more important point to know about actors: As soon as a top-level actor receives a message, it should delegate its work. Actors need to be able to respond to messages in their mailbox as fast as possible, so the actor mantra is, “Delegate, delegate, delegate.”

If you think of an actor as being a person, imagine that one message includes a task that’s going to take a month to complete. If the actor worked on that task for a month, it wouldn’t be able to respond to its mailbox for a month. That’s bad. But if the actor delegates that task to one of its children, it can respond to the next message in its mailbox immediately (and delegate that as well).



## Akka features

Akka is the main actor library for Scala, and it’s a great way to build massively parallel systems. From my own experience I can say that all of these industry buzzwords can be used to describe Akka:

- asynchronous
- event-driven
- message-driven
- reactive
- scalable (“scale up” and “scale out”)
- concurrent and parallel
- non-blocking
- location transparency
- resilient and redundant (no single point of failure with multiple, distributed servers)
- fault-tolerant

All of those features are great, but the first great feature is that Akka and the actor model *greatly* simplify the process of working with long-running threads. In fact, when working with Akka, you never really think about threads, you just write actors to respond to messages in a non-blocking manner, and the threads take of themselves.


## Akka benefits

In addition to those features, here are some concrete benefits of using Akka actors, mostly coming from Lightbend’s [Akka Quickstart Guide](http://developer.lightbend.com/guides/akka-quickstart-scala/) and [the Akka.io website](http://akka.io):

- Actors are *much* easier to work with than threads; you program at a much higher level of abstraction.
- Actors let you build systems that *scale up*, using the resources of a server more efficiently, and *scale out*, using multiple servers.
- Performance: Actors have been shown to process up to 50 million messages/second on a single machine.
- Lightweight: Each instance consumes only a few hundred bytes, which allows millions of concurrent actors to exist in a single application (allowing ~2.5 million actors per GB of heap).
- Location transparency: The Akka system constructs actors from a factory and returns references to the instances. Because the location of actors doesn’t matter — they can be running on the current server or some other server — actor instances can start, stop, move, and restart to scale up and down, as well as recover from unexpected failures.



## A video example

Way back in 2011 I started developing a “personal assistant” named [SARAH](http://alvinalexander.com/sarah), which was based on the computer assistant of the same name on the television show [Eureka](http://www.imdb.com/title/tt0796264/). SARAH is like having the Amazon Echo running on your computer. You speak to it to access and manage information:

- Get news headlines from different sources
- Get weather reports and stock prices
- Manage a “to-do list”
- Control iTunes with voice commands
- Check your email
- Perform Google searches

Beyond just *responding* to voice commands with spoken and displayed output, SARAH also has long-running background tasks — small pieces of software I call “agents” — so it can do other things:

- Tell me when I receive new email from people I’m interested in
- Report the time at the top of every hour (“The time is 11 a.m.”)

The entire application is based on Akka actors. I found Akka to be a terrific way to write an application that had many threads running simultaneously.

For more information on SARAH, see the “Sarah - Version 2” video at [alvinalexander.com/sarah](https://alvinalexander.com/sarah). I haven’t worked on SARAH in a while, but it gives you can idea of what can be done with Akka actors.

>For a simpler version of SARAH that you can get started with today, see my tutorial, [“Alexa written with Akka” = Aleka](https://alvinalexander.com/scala/alexa-plus-akka-equals-aleka-tutorial)



## What’s next

Given this background, the next lesson shows several examples of how to use Akka actors.

>From [the Akka FAQ](https://doc.akka.io/docs/akka/2.5/additional/faq.html), the name *Akka* “is the name of a beautiful Swedish mountain in the northern part of Sweden called Laponia ... Akka is also the name of a goddess in the Sámi (the native Swedish population) mythology. She is the goddess that stands for all the beauty and good in the world ... Also, the name AKKA is a palindrome of the letters A and K, as in Actor Kernel.”







