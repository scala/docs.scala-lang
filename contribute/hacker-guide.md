---
layout: page
title: Scala hacker guide
---

**Eugene Burmako**

This guide is intended to help you get from an idea of fixing a bug or implementing a new feature 
to a nightly and, ultimately, to a production release of Scala incorporating your idea. Being able to 
influence a programming language of your choice is amazing, and I'm excited to demonstrate that it's easier 
than one might think.

I like string interpolation a lot. Doing debug prints with interpolators introduced in Scala 2.10.0
is so enjoyable that I often wonder how we ever lived without that feature. However there's an annoying issue
which I occasionally stumble upon: the formatting string interpolator `f` [does not support](https://issues.scala-lang.org/browse/SI-6725) 
new line tokens `%n`. I could go the mailing list, ask to fix this bug and then indefinitely
wait for the fix. Or I could instead patch Scala myself and get the fix in a subsequent release (nightly builds get produced, well, every 
night, minor releases are pumped every few months and major releases happen once a year). Let's get to work!

### 1. Connect ###

Sometimes it's appealing to hack alone and not to have to interact with humans, but in the context of such a big project like Scala
this might not be the very best idea. Our community has people who spent years accumulating knowledge about Scala. They might provide
unique insights and, what's even better, direct assistance in their areas. 

Typically bug fixes and especially new features beging with posting to one of [our mailing lists](TODO) to find out how people feel
about things you want to implement. People proficient is certain areas of Scala usually monitor mailing lists, so you'll often get some help
by simply posting a message. But the most efficient way to connect is to cc your message to one of the go-to persons in your area. Here's the 
list of people (Github usernames and real-life names) and their specialties:

    library: @phaller (Philipp Haller), @axel22 (Aleksandar Prokopec -- concurrent & collection)
    specialisation: @axel22 (Aleksander Prokopec), @vladureche (Vlad Ureche), @dragos (Iulian Dragos)
    named / default args, annotations, plugins: @lrytz (Lukas Rytz)
    macros, reflection, manifests, type tags: @xeno-by (Eugene Burmako), @cvogt (Christopher Vogt)
    type checker, inference: @odersky (Martin Odersky), @adriaanm (Adriaan Moors)
    language specification, string interpolation, value classes: @odersky (Martin Odersky)
    new pattern matcher, implicit search: @adriaanm (Adriaan Moors)
    partest, Continuations Plugin: @phaller (Philipp Haller)
    error handling, lazy vals: @hubertp (Hubert Plociniczak)
    backend: @magarciaEPFL (Miguel Garcia), @gkossakowski (Grzegorz Kossakowski), @dragos (Iulian Dragos)
    repl, compiler performance: @paulp (Paul Phillips)
    swing: @ingoem (Ingo Maier)
    scaladoc: @vladureche (Vlad Ureche)
    optimizer: @vladureche (Vlad Ureche), @magarciaEPFL (Miguel Garcia)
    build: @jsuereth (Josh Suereth)
    random compiler bugs: @lrytz, @adriaanm, @hubertp
    documentation: @heathermiller (Heather Miller)
    cps: @TiarkRompf (Tiark Rompf)

Martin is the one who submitted the string interpolation proposal and implemented this language features for Scala 2.10.0.
(TODO: how to choose a mailing list)
Therefore now I'm going to [the scala-user mailing list](http://groups.google.com/group/scala-user) and will post a topic
about my issue. Note that I put Martin in the cc list of the email. If I didn't do that, he would probably miss it in a bunch
of emails, which get posted to scala-user every day.

![Posting to scala-user](/contribute/01-post.png)

Now when I have an approval of the feature's author, it makes sense to start doing something.

### 2. Set up ###

Hacking Scala begins with creating a branch for your work item. In our workflow we use [Git](http://git-scm.com/) 
and [GitHub](http://github.com/). This section of the guide provides a short walkthrough on how to use them.
If you are new to Git, it might make sense to familiarize with it first. We recommend the [Git Pro](http://git-scm.com/book/en/) 
online book.

### Fork ###

Log into [GitHub](http://github.com/), go to [https://github.com/scala/scala](https://github.com/scala/scala) and click the `Fork` 
button at the top of the page. This will create your own copy of our repository that will serve as a scratchpad for your experiments. 
If you're new to Git, don't be afraid of messing it up - there is no way you can corrupt our repository.

![Fork scala/scala](/contribute/03-fork.png)

### Clone ###

If everything went okay, you will be redirected to your own fork at `https://github.com/username/scala`, where `username` 
is your github user name. You might find it helpful to read [http://help.github.com/fork-a-repo/](http://help.github.com/fork-a-repo/), 
which covers some of the things that will follow below. Then clone your repository by running something like the following on the command line:

    16:35 ~/Projects$ git clone https://github.com/xeno-by/scala
    Cloning into 'scala'...
    remote: Counting objects: 258564, done.
    remote: Compressing objects: 100% (58239/58239), done.
    remote: Total 258564 (delta 182155), reused 254094 (delta 178356)
    Receiving objects: 100% (258564/258564), 46.91 MiB | 700 KiB/s, done.
    Resolving deltas: 100% (182155/182155), done.

This will create a local directory called `scala`, which contains a clone of your own copy of our repository. The changes that you make
in this directory can be propagated back to your copy and, ultimately, pushed into Scala.

### Branch ###

Before you start making changes, always create your own branch. Never work on the `master` branch. Think of a name that describes 
the changes you plan on doing. Use a prefix that describes the nature of your change. There are essentially two kinds of changes: 
bug fixes and new features.

* For bug fixes, use `issue/NNNN` for bug NNNN from the [Scala issue tracker](https://issues.scala-lang.org/). 
* For new feature use `topic/XXX` for feature XXX. Use feature names that make sense in the context of the whole Scala project and not just to you personally. For example, if you work on diagrams in Scaladoc, use `topic/scaladoc-diagrams` instead of just `topic/diagrams`.

Since I'm going to fix an existing bug [SI-6725](https://issues.scala-lang.org/browse/SI-6725), I'll create a branch named ticket/6725.

    16:39 ~/Projects/scala (master)$ git checkout -b ticket/6725
    Switched to a new branch 'ticket/6725'

If you are new to Git and branching, read the [Branching Chapter](http://git-scm.com/book/en/Git-Branching) in the Git Pro book.